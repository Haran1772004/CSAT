from datetime import datetime, timedelta
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api import deps
from app.models.form import Form as FormModel
from app.models.submission import Submission
from app.models.user import User

router = APIRouter()


@router.get("/{form_id}/analytics")
def get_analytics(
    form_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get analytics for a form. Check ownership using current_user.
    """
    form = db.query(FormModel).filter(FormModel.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    if form.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")

    # Helper for average in last N days
    def get_avg_rating(days: int = None):
        query = db.query(func.avg(Submission.rating)).filter(
            Submission.form_id == form_id
        )
        if days:
            cutoff = datetime.utcnow() - timedelta(days=days)
            query = query.filter(Submission.created_at >= cutoff)
        return query.scalar() or 0.0

    # Total Average
    total_avg = get_avg_rating()

    # Time-based Averages
    avg_30 = get_avg_rating(30)
    avg_60 = get_avg_rating(60)
    avg_90 = get_avg_rating(90)

    # Distribution (1-5)
    distribution_query = (
        db.query(Submission.rating, func.count(Submission.rating))
        .filter(Submission.form_id == form_id)
        .group_by(Submission.rating)
        .all()
    )
    distribution = {r: 0 for r in range(1, 6)}
    for rating, count in distribution_query:
        distribution[rating] = count

    # Unique Respondents (based on Email or IP if email is missing)
    # This identifies the total number of distinct people who have interacted with this form
    unique_total = db.query(Submission.ip_address, Submission.customer_email).filter(
        Submission.form_id == form_id
    ).distinct().count()

    return {
        "form_id": form_id,
        "total_avg_rating": round(total_avg, 2),
        "avg_30_days": round(avg_30, 2),
        "avg_60_days": round(avg_60, 2),
        "avg_90_days": round(avg_90, 2),
        "rating_distribution": distribution,
        "total_submissions": sum(distribution.values()),
        "unique_respondents": unique_total,
        "unique_ratings_count": len([v for v in distribution.values() if v > 0]),
    }
