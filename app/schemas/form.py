from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class FormBase(BaseModel):
    title: str
    description: Optional[str] = None
    is_active: Optional[bool] = True


class FormCreate(FormBase):
    pass


class FormUpdate(FormBase):
    pass


class Form(FormBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True
