from fastapi import APIRouter

from app.api.v1.endpoints import auth, forms, reports, submissions

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["login"])
api_router.include_router(forms.router, prefix="/forms", tags=["forms"])
api_router.include_router(submissions.router, tags=["submissions"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
