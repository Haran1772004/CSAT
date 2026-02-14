from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.form import Form
from app.models.user import User
from app.schemas.form import Form as FormSchema
from app.schemas.form import FormCreate, FormUpdate

router = APIRouter()


@router.get("/", response_model=List[FormSchema])
def read_forms(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve forms owned by the current user.
    """
    forms = (
        db.query(Form)
        .filter(Form.owner_id == current_user.id)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return forms


@router.post("/", response_model=FormSchema)
def create_form(
    *,
    db: Session = Depends(deps.get_db),
    form_in: FormCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new form.
    """
    form = Form(
        title=form_in.title,
        description=form_in.description,
        is_active=form_in.is_active,
        owner_id=current_user.id,
    )
    db.add(form)
    db.commit()
    db.refresh(form)
    return form


@router.get("/{id}", response_model=FormSchema)
def read_form(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get form by ID.
    """
    form = db.query(Form).filter(Form.id == id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    if form.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return form
