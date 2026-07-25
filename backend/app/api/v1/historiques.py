"""REST endpoints for HistoriqueGlobal entity."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import require_historique_consultation
from app.models.enums import RoleUtilisateur
from app.models.user import Utilisateur
from app.schemas.historique import HistoriqueRead
from app.services.historique_service import (
    HistoriqueService,
    get_historique_service,
)

router = APIRouter(prefix="/historiques", tags=["historiques"])


@router.get(
    "/",
    response_model=list[HistoriqueRead],
    summary="List history records",
    description="Return paginated list of global history records. Administrators and Managers can view all. Technicians can view their own.",
)
def list_historiques(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of items to return"),
    service: HistoriqueService = Depends(get_historique_service),
    current_user: Utilisateur = Depends(require_historique_consultation),
) -> list[HistoriqueRead]:
    """List all history records with pagination, filtered by user role."""
    historiques = service.list_historiques(user=current_user, skip=skip, limit=limit)
    return [HistoriqueRead.model_validate(hist) for hist in historiques]


@router.get(
    "/{id_historique}",
    response_model=HistoriqueRead,
    summary="Get history record by ID",
    description="Return a specific history record by its ID. Administrators and Managers can view all. Technicians can view their own.",
)
def get_historique(
    id_historique: int,
    service: HistoriqueService = Depends(get_historique_service),
    current_user: Utilisateur = Depends(require_historique_consultation),
) -> HistoriqueRead:
    """Get a history record by its ID, filtered by user role."""
    historique = service.get_historique(id_historique, user=current_user)
    if historique is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History record with id {id_historique} not found",
        )
    return HistoriqueRead.model_validate(historique)