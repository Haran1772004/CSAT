from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.schema import CheckConstraint

from app.db.base_class import Base


class Submission(Base):
    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("form.id", ondelete="CASCADE"), nullable=False, index=True)
    rating = Column(Integer, nullable=False)
    feedback = Column(Text, nullable=True)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 support
    screenshot_url = Column(String(1024), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='rating_1_to_5'),
    )
