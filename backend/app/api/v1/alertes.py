"""REST API endpoints for the ``AlertePredictive`` entity (see API_SPECIFICATION.md)."""

from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import Utilisateur
from app.schemas.alerte import (
    AlertePredictiveCreate,
    AlertePredictiveRead,
    AlertePredictiveSimple,
    AlertePredictiveUpdate,
)
from app.services.alerte_service import AlerteService

router = APIRouter(prefix="/alertes", tags=["Alertes Prédictives"])


@router.get(
    "/",
    response_model=List[AlertePredictiveSimple],
    status_code=status.HTTP_200_OK,
    summary="List all predictive alerts",
    description="Returns all predictive alerts. Only Administrateur and Manager can access.",
)
def list_alertes(
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user),
):
    """Get all predictive alerts."""
    service = AlerteService(db)
    alertes = service.list_alertes(current_user)
    return alertes


@router.get(
    "/{id_alerte}",
    response_model=AlertePredictiveRead,
    status_code=status.HTTP_200_OK,
    summary="Get a predictive alert by ID",
    description="Returns a specific predictive alert by ID. Only Administrateur and Manager can access.",
)
def get_alerte(
    id_alerte: int,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user),
):
    """Get a single predictive alert by ID."""
    service = AlerteService(db)
    alerte = service.get_alerte(id_alerte, current_user)
    return alerte


@router.post(
    "/",
    response_model=AlertePredictiveRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a predictive alert",
    description="Creates a new predictive alert. Only Administrateur can create.",
)
def create_alerte(
    alerte_data: AlertePredictiveCreate,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user),
):
    """Create a new predictive alert."""
    service = AlerteService(db)
    return service.create_alerte(alerte_data, current_user)


@router.put(
    "/{id_alerte}",
    response_model=AlertePredictiveRead,
    status_code=status.HTTP_200_OK,
    summary="Update a predictive alert",
    description="Updates an existing predictive alert. Only Administrateur can update.",
)
def update_alerte(
    id_alerte: int,
    alerte_data: AlertePredictiveUpdate,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user),
):
    """Update an existing predictive alert."""
    service = AlerteService(db)
    return service.update_alerte(id_alerte, alerte_data, current_user)


@router.delete(
    "/{id_alerte}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a predictive alert",
    description="Deletes a predictive alert. Only Administrateur can delete.",
)
def delete_alerte(
    id_alerte: int,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user),
):
    """Delete a predictive alert."""
    service = AlerteService(db)
    service.delete_alerte(id_alerte, current_user)