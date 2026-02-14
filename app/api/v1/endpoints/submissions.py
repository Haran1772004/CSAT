import io
from datetime import datetime, timedelta
from typing import Any, List, Optional

import pandas as pd
from fastapi import (APIRouter, Depends, File, Form, HTTPException, Request,
                     UploadFile)
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api import deps
from app.core.limiter import limiter
from app.models.form import Form as FormModel
from app.models.submission import Submission
from app.schemas.submission import Submission as SubmissionSchema
from app.services.s3 import s3_service

router = APIRouter()


@router.post("/submit/{form_id}", response_model=SubmissionSchema)
@limiter.limit("5/minute")
def create_submission(
    request: Request,
    form_id: int,
    rating: int = Form(..., ge=1, le=5),
    feedback: Optional[str] = Form(None),
    customer_name: str = Form(...),
    customer_email: Optional[str] = Form(None),
    error_screenshot: Optional[UploadFile] = File(None),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Submit feedback for a specific form.
    Public endpoint. Rate limited.
    """
    # Verify form exists and is active
    form = db.query(FormModel).filter(FormModel.id == form_id).first()
    if not form or not form.is_active:
        raise HTTPException(status_code=404, detail="Form not found or inactive")

    # Handle file upload
    screenshot_url = None
    if error_screenshot:
        if error_screenshot.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Invalid file type")
        screenshot_url = s3_service.upload_file(error_screenshot)

    # Capture IP (handling Nginx proxy headers)
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        # Get the first IP in the list (original client)
        client_ip = x_forwarded_for.split(",")[0].strip()
    else:
        client_ip = request.headers.get("X-Real-IP") or (request.client.host if request.client else None)

    submission = Submission(
        form_id=form_id,
        rating=rating,
        feedback=feedback,
        customer_name=customer_name,
        customer_email=customer_email,
        ip_address=client_ip,
        screenshot_url=screenshot_url,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/forms/{form_id}/submissions", response_model=List[SubmissionSchema])
def read_submissions(
    form_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all submissions for a form. Only owner can access.
    """
    form = db.query(FormModel).filter(FormModel.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    if form.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    submissions = (
        db.query(Submission)
        .filter(Submission.form_id == form_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return submissions


@router.get("/{id}", response_model=SubmissionSchema)
def read_submission(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get a single submission by ID. Only form owner can access.
    """
    submission = db.query(Submission).filter(Submission.id == id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Verify the current user owns the form this submission belongs to
    form = db.query(FormModel).filter(FormModel.id == submission.form_id).first()
    if not form or form.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
        
    return submission


@router.get("/{id}/download", response_class=StreamingResponse)
def download_submission(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """
    Download a single submission as an Excel file.
    """
    submission = db.query(Submission).filter(Submission.id == id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    form = db.query(FormModel).filter(FormModel.id == submission.form_id).first()
    if not form or form.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    # Prepare data for Excel
    data = [{
        "Submission ID": submission.id,
        "Form Title": form.title,
        "Customer Name": submission.customer_name,
        "Customer Email": submission.customer_email or "N/A",
        "Rating": submission.rating,
        "Feedback": submission.feedback or "No feedback",
        "Screenshot URL": submission.screenshot_url or "No screenshot",
        "Client IP": submission.ip_address or "Unknown",
        "Submission Date": submission.created_at.strftime("%Y-%m-%d %H:%M:%S")
    }]

    df = pd.DataFrame(data)
    
    # Create Excel file in memory
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Submission_Detail')
    output.seek(0)

    headers = {
        'Content-Disposition': f'attachment; filename="submission_{id}.xlsx"'
    }
    return StreamingResponse(
        output,
        headers=headers,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )


@router.get("/forms/{form_id}/download/bulk", response_class=StreamingResponse)
def download_submissions_bulk(
    form_id: int,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """
    Download all submissions for a form as an Excel file.
    """
    form = db.query(FormModel).filter(FormModel.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    if form.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    submissions = db.query(Submission).filter(Submission.form_id == form_id).all()
    
    if not submissions:
        raise HTTPException(status_code=404, detail="No submissions found for this form")

    # Prepare data for Excel
    data = []
    for s in submissions:
        data.append({
            "Submission ID": s.id,
            "Form Title": form.title,
            "Customer Name": s.customer_name,
            "Customer Email": s.customer_email or "N/A",
            "Rating": s.rating,
            "Feedback": s.feedback or "No feedback",
            "Screenshot URL": s.screenshot_url or "No screenshot",
            "Client IP": s.ip_address or "Unknown",
            "Submission Date": s.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })

    df = pd.DataFrame(data)
    
    # Create Excel file in memory
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='All_Submissions')
    output.seek(0)

    headers = {
        'Content-Disposition': f'attachment; filename="bulk_submissions_form_{form_id}.xlsx"'
    }
    return StreamingResponse(
        output,
        headers=headers,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
