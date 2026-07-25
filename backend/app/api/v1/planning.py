"""REST endpoints for Planning view.

The planning is not a separate entity but derived from Intervention records
that have `date_planifiee` and `id_technicien` (see DATABASE.md).
"""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.dependencies.rbac import (
    require_planning_consultation,
    require_planning_modification,
)
from app.models.enums import RoleUtilisateur
from app.models.user import Utilisateur
from app.schemas.planning import (
    PlanningRead,
    PlanningUpdate,
)
from app.services.planning_service import PlanningService, get_planning_service

router = APIRouter(prefix="/planning", tags=["planning"])


@router.get(
    "/",
    response_model=list[PlanningRead],
    summary="List planning entries",
    description="Return paginated list of planned interventions.",
)
def list_planning(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of items to return"),
    date_debut: Optional[datetime] = Query(None, description="Start date filter"),
    date_fin: Optional[datetime] = Query(None, description="End date filter"),
    id_technicien: Optional[int] = Query(None, description="Filter by technician ID"),
    type_intervention: Optional[str] = Query(None, description="Filter by intervention type"),
    statut_intervention: Optional[str] = Query(None, description="Filter by status"),
    service: PlanningService = Depends(get_planning_service),
    current_user: Utilisateur = Depends(require_planning_consultation),
) -> list[PlanningRead]:
    """List all planning entries (planned interventions) with pagination and filtering."""
    if current_user.role == RoleUtilisateur.TECHNICIEN:
        id_technicien = current_user.id_user
    try:
        interventions = service.get_planning(
            skip=skip,
            limit=limit,
            date_debut=date_debut,
            date_fin=date_fin,
            id_technicien=id_technicien,
            type_intervention=type_intervention,
            statut_intervention=statut_intervention,
        )
        
        result = []
        for intervention in interventions:
            result.append(
                PlanningRead(
                    id_intervention=intervention.id_intervention,
                    id_technicien=intervention.id_technicien,
                    id_manager=intervention.id_manager,
                    id_ticket=intervention.id_ticket,
                    id_alerte=intervention.id_alerte,
                    type=intervention.type,
                    priorite=intervention.priorite,
                    date_planifiee=intervention.date_planifiee,
                    duree_reparation=intervention.duree_reparation,
                    statut_intervention=intervention.statut_intervention,
                    technicien_nom=intervention.technicien.nom if intervention.technicien else "",
                    technicien_prenom=intervention.technicien.prenom if intervention.technicien else "",
                    manager_nom=intervention.manager.nom if intervention.manager else "",
                    manager_prenom=intervention.manager.prenom if intervention.manager else "",
                    ticket_code_banc=intervention.ticket.code_banc if intervention.ticket else None,
                    banc_nom=intervention.ticket.banc.nom if intervention.ticket and intervention.ticket.banc else None,
                    banc_emplacement=intervention.ticket.banc.emplacement if intervention.ticket and intervention.ticket.banc else None,
                )
            )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e


@router.get(
    "/technicien/mon-planning",
    response_model=list[PlanningRead],
    summary="Get current technician's planning",
    description="Return planning entries assigned to the current technician.",
)
def get_my_planning_as_technicien(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of items to return"),
    date_debut: Optional[datetime] = Query(None, description="Start date filter"),
    date_fin: Optional[datetime] = Query(None, description="End date filter"),
    service: PlanningService = Depends(get_planning_service),
    current_user: Utilisateur = Depends(require_planning_consultation),
) -> list[PlanningRead]:
    """Get planning entries for the current technician."""
    if current_user.role != RoleUtilisateur.TECHNICIEN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only technicians can view their own planning",
        )
    
    try:
        interventions = service.get_technicien_planning(
            id_technicien=current_user.id_user,
            skip=skip,
            limit=limit,
            date_debut=date_debut,
            date_fin=date_fin,
        )
        
        result = []
        for intervention in interventions:
            result.append(
                PlanningRead(
                    id_intervention=intervention.id_intervention,
                    id_technicien=intervention.id_technicien,
                    id_manager=intervention.id_manager,
                    id_ticket=intervention.id_ticket,
                    id_alerte=intervention.id_alerte,
                    type=intervention.type,
                    priorite=intervention.priorite,
                    date_planifiee=intervention.date_planifiee,
                    duree_reparation=intervention.duree_reparation,
                    statut_intervention=intervention.statut_intervention,
                    technicien_nom=intervention.technicien.nom if intervention.technicien else "",
                    technicien_prenom=intervention.technicien.prenom if intervention.technicien else "",
                    manager_nom=intervention.manager.nom if intervention.manager else "",
                    manager_prenom=intervention.manager.prenom if intervention.manager else "",
                    ticket_code_banc=intervention.ticket.code_banc if intervention.ticket else None,
                    banc_nom=intervention.ticket.banc.nom if intervention.ticket and intervention.ticket.banc else None,
                    banc_emplacement=intervention.ticket.banc.emplacement if intervention.ticket and intervention.ticket.banc else None,
                )
            )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e


@router.put(
    "/{id}",
    response_model=PlanningRead,
    summary="Update planning entry",
    description="Update a planning entry (planned intervention).",
)
def update_planning_entry(
    id: int,
    planning_update: PlanningUpdate,
    service: PlanningService = Depends(get_planning_service),
    current_user: Utilisateur = Depends(require_planning_modification),
) -> PlanningRead:
    """Update a planning entry."""
    try:
        intervention = service.update_planning_entry(id, planning_update)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    if intervention is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Planning entry with ID {id} not found",
        )
    
    return PlanningRead(
        id_intervention=intervention.id_intervention,
        id_technicien=intervention.id_technicien,
        id_manager=intervention.id_manager,
        id_ticket=intervention.id_ticket,
        id_alerte=intervention.id_alerte,
        type=intervention.type,
        date_planifiee=intervention.date_planifiee,
        duree_reparation=intervention.duree_reparation,
        statut_intervention=intervention.statut_intervention,
        technicien_nom=intervention.technicien.nom if intervention.technicien else "",
        technicien_prenom=intervention.technicien.prenom if intervention.technicien else "",
        manager_nom=intervention.manager.nom if intervention.manager else "",
        manager_prenom=intervention.manager.prenom if intervention.manager else "",
        ticket_code_banc=intervention.ticket.code_banc if intervention.ticket else None,
        banc_nom=intervention.ticket.banc.nom if intervention.ticket and intervention.ticket.banc else None,
        banc_emplacement=intervention.ticket.banc.emplacement if intervention.ticket and intervention.ticket.banc else None,
    )


@router.get(
    "/technicien/{id_technicien}/charge",
    summary="Get technician workload",
    description="Return workload statistics for a technician.",
)
def get_technicien_workload(
    id_technicien: int,
    date_debut: Optional[datetime] = Query(None, description="Start date for workload calculation"),
    date_fin: Optional[datetime] = Query(None, description="End date for workload calculation"),
    service: PlanningService = Depends(get_planning_service),
    current_user: Utilisateur = Depends(require_planning_consultation),
) -> dict:
    """Get workload statistics for a technician."""
    try:
        workload = service.get_technicien_workload(
            id_technicien=id_technicien,
            date_debut=date_debut,
            date_fin=date_fin,
        )
        return workload
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
