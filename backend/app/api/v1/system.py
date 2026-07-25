"""System / technical endpoints (health checks).

These endpoints belong to the technical foundation. They contain no business
logic and expose only liveness/readiness information.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.database.session import get_db

router = APIRouter(tags=["system"])


@router.get("/health", summary="Liveness probe")
def health_check() -> dict:
    """Return a simple liveness status."""
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


@router.get("/health/db", summary="Database readiness probe")
def health_check_db(db: Session = Depends(get_db)) -> dict:
    """Check whether the MySQL database is reachable."""
    try:
        db.execute(text("SELECT 1"))
    except Exception as exc:  # noqa: BLE001 - readiness reporting
        return {"database": "unavailable", "detail": str(exc)}
    return {"database": "connected"}
