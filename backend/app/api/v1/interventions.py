"""REST endpoints for Intervention entity."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.dependencies.rbac import (
    can_view_assigned_interventions,
    require_intervention_consultation,
    require_intervention_creation,
    require_intervention_execution,
    require_intervention_modification,
)
from app.models.enums import RoleUtilisateur
from app.models.user import Utilisateur
from app.schemas.intervention import (
    InterventionCompleteRequest,
    InterventionCreate,
    InterventionRead,
    InterventionUpdate,
    InterventionWithRelations,
)
from app.services.intervention_service import (
    InterventionService,
    get_intervention_service,
)

router = APIRouter(prefix="/interventions", tags=["interventions"])


@router.get(
    "/",
    response_model=list[InterventionWithRelations],
    summary="List maintenance interventions",
    description="Return paginated list of maintenance interventions with user information.",
)
def list_interventions(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of items to return"),
    id_technicien: Optional[int] = Query(None, description="Filter by technician ID"),
    id_manager: Optional[int] = Query(None, description="Filter by manager ID"),
    id_ticket: Optional[int] = Query(None, description="Filter by ticket ID"),
    type_intervention: Optional[str] = Query(None, description="Filter by intervention type"),
    service: InterventionService = Depends(get_intervention_service),
    current_user: Utilisateur = Depends(require_intervention_consultation),
) -> list[InterventionWithRelations]:
    """List all maintenance interventions with pagination and optional filtering."""
    if current_user.role == RoleUtilisateur.TECHNICIEN:
        id_technicien = current_user.id_user
    try:
        if id_technicien:
            interventions = service.list_interventions_by_technicien(
                id_technicien, skip, limit
            )
        elif id_manager:
            interventions = service.list_interventions_by_manager(
                id_manager, skip, limit
            )
        elif id_ticket:
            interventions = service.list_interventions_by_ticket(
                id_ticket, skip, limit
            )
        elif type_intervention:
            interventions = service.list_interventions_by_type(
                type_intervention, skip, limit
            )
        else:
            interventions = service.list_interventions(skip, limit)
        
        # Convert to response with user info
        result = []
        for intervention in interventions:
            result.append(
                InterventionWithRelations(
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
                    rapport_clean_ia=intervention.historique.rapport_clean_ia if intervention.historique else None,
                )
            )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e


@router.get(
    "/{id_intervention}",
    response_model=InterventionWithRelations,
    summary="Get maintenance intervention by ID",
    description="Return a specific maintenance intervention by its ID.",
)
def get_intervention(
    id_intervention: int,
    service: InterventionService = Depends(get_intervention_service),
    current_user: Utilisateur = Depends(require_intervention_consultation),
) -> InterventionWithRelations:
    """Get a maintenance intervention by its ID."""
    intervention = service.get_intervention(id_intervention)
    if intervention is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance intervention with ID {id_intervention} not found",
        )
    
    return InterventionWithRelations(
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
        rapport_clean_ia=intervention.historique.rapport_clean_ia if intervention.historique else None,
    )


@router.post(
    "/",
    response_model=InterventionRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create maintenance intervention",
    description="Create a new maintenance intervention.",
)
def create_intervention(
    intervention_create: InterventionCreate,
    service: InterventionService = Depends(get_intervention_service),
    current_user: Utilisateur = Depends(require_intervention_creation),
) -> InterventionRead:
    """Create a new maintenance intervention."""
    try:
        intervention = service.create_intervention(intervention_create)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    return InterventionRead.model_validate(intervention)


@router.put(
    "/{id_intervention}",
    response_model=InterventionRead,
    summary="Update maintenance intervention",
    description="Update a maintenance intervention.",
)
def update_intervention(
    id_intervention: int,
    intervention_update: InterventionUpdate,
    service: InterventionService = Depends(get_intervention_service),
    current_user: Utilisateur = Depends(require_intervention_modification),
) -> InterventionRead:
    """Update a maintenance intervention partially."""
    intervention = service.update_intervention(id_intervention, intervention_update)
    if intervention is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance intervention with ID {id_intervention} not found",
        )
    return InterventionRead.model_validate(intervention)


@router.delete(
    "/{id_intervention}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete maintenance intervention",
    description="Delete a maintenance intervention.",
)
def delete_intervention(
    id_intervention: int,
    service: InterventionService = Depends(get_intervention_service),
    current_user: Utilisateur = Depends(require_intervention_modification),
) -> None:
    """Delete a maintenance intervention."""
    success = service.delete_intervention(id_intervention)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance intervention with ID {id_intervention} not found",
        )


@router.get(
    "/technicien/mes-interventions",
    response_model=list[InterventionWithRelations],
    summary="List interventions assigned to current technician",
    description="Return paginated list of interventions assigned to the current technician.",
)
def list_my_interventions_as_technicien(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of items to return"),
    service: InterventionService = Depends(get_intervention_service),
    current_user: Utilisateur = Depends(can_view_assigned_interventions),
) -> list[InterventionWithRelations]:
    """List interventions assigned to the current technician."""
    if current_user.role.value != "TECHNICIEN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only technicians can view their assigned interventions",
        )
    
    try:
        interventions = service.list_interventions_by_technicien(
            current_user.id_user, skip, limit
        )
        
        result = []
        for intervention in interventions:
            result.append(
                InterventionWithRelations(
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
                    rapport_clean_ia=intervention.historique.rapport_clean_ia if intervention.historique else None,
                )
            )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e


@router.put(
    "/{id_intervention}/start",
    response_model=InterventionRead,
    summary="Start maintenance intervention",
    description="Start a planned intervention. Only the assigned technician can start it.",
)
def start_intervention(
    id_intervention: int,
    service: InterventionService = Depends(get_intervention_service),
    current_user: Utilisateur = Depends(require_intervention_execution),
) -> InterventionRead:
    try:
        intervention = service.start_intervention(id_intervention, current_user.id_user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    return InterventionRead.model_validate(intervention)


@router.put(
    "/{id_intervention}/complete",
    response_model=InterventionRead,
    summary="Complete maintenance intervention",
    description="Complete an in-progress intervention with a report. Only the assigned technician can complete it.",
)
def complete_intervention(
    id_intervention: int,
    request: InterventionCompleteRequest,
    service: InterventionService = Depends(get_intervention_service),
    current_user: Utilisateur = Depends(require_intervention_execution),
) -> InterventionRead:
    try:
        intervention = service.complete_intervention(id_intervention, current_user.id_user, request)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    return InterventionRead.model_validate(intervention)