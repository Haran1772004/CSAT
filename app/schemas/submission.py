from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class SubmissionBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    feedback: Optional[str] = None
    customer_name: str
    customer_email: Optional[EmailStr] = None


class SubmissionCreate(SubmissionBase):
    # form_id is passed in URL
    # IP is captured from request
    pass


class Submission(SubmissionBase):
    id: int
    form_id: int
    ip_address: Optional[str] = None
    screenshot_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
