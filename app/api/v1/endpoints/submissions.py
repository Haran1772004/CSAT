from datetime import datetime, timedelta
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
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
    screenshot: Optional[UploadFile] = File(None),
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
    if screenshot:
        if screenshot.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Invalid file type")
        # Check file size (approximate, since we read stream)
        # Better to check content-length header or read chunk
        # For simplicity in this example, relying on S3 upload or basic check
        # Real production code might use a "StreamReader" to count bytes
        screenshot_url = s3_service.upload_file(screenshot)

    # Capture IP
    client_ip = request.client.host if request.client else None

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
    Get submissions for a form. Only owner can access.
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
