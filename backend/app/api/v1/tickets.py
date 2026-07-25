"""REST endpoints for TicketMaintenance entity."""

from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.rbac import (
    require_ticket_consultation,
    require_ticket_creation,
    require_ticket_deletion,
    require_ticket_modification,
)
from app.models.enums import RoleUtilisateur
from app.models.user import Utilisateur
from app.schemas.ticket import (
    TicketMaintenanceCreate,
    TicketMaintenanceRead,
    TicketMaintenanceUpdate,
    TicketMaintenanceWithBanc,
)
from app.services.ticket_service import TicketService, get_ticket_service

router = APIRouter(prefix="/tickets", tags=["tickets"])


@router.get(
    "/",
    response_model=list[TicketMaintenanceWithBanc],
    summary="List maintenance tickets",
    description="Return paginated list of maintenance tickets with banc information.",
)
def list_tickets(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of items to return"),
    code_banc: Optional[str] = Query(None, description="Filter by banc code"),
    statut: Optional[str] = Query(None, description="Filter by ticket status"),
    service: TicketService = Depends(get_ticket_service),
    current_user: Utilisateur = Depends(require_ticket_consultation),
) -> list[TicketMaintenanceWithBanc]:
    """List maintenance tickets with pagination and optional filtering.

    Operators only see their own declarations.
    Administrators and Managers see all tickets.
    """
    try:
        if current_user.role == RoleUtilisateur.OPERATEUR_PRODUCTION:
            tickets = service.list_my_declarations(current_user.id_user, skip, limit)
        elif code_banc and statut:
            banc_tickets = service.list_tickets_by_banc(code_banc, skip, limit)
            filtered_tickets = [
                t for t in banc_tickets if t.statut.value == statut
            ][:limit]
            tickets = filtered_tickets
        elif code_banc:
            tickets = service.list_tickets_by_banc(code_banc, skip, limit)
        elif statut:
            tickets = service.list_tickets_by_statut(statut, skip, limit)
        else:
            tickets = service.list_tickets(skip, limit)

        # Convert to response with banc info
        result = []
        for ticket in tickets:
            result.append(
                TicketMaintenanceWithBanc(
                    id_ticket=ticket.id_ticket,
                    code_banc=ticket.code_banc,
                    symptome=ticket.symptome,
                    criticite=ticket.criticite,
                    date_creation=ticket.date_creation,
                    statut=ticket.statut,
                    banc_nom=ticket.banc.nom if ticket.banc else "",
                    banc_emplacement=ticket.banc.emplacement if ticket.banc else "",
                    banc_statut=ticket.banc.statut.value if ticket.banc else "",
                )
            )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e


@router.get(
    "/{id_ticket}",
    response_model=TicketMaintenanceWithBanc,
    summary="Get maintenance ticket by ID",
    description="Return a specific maintenance ticket by its ID.",
)
def get_ticket(
    id_ticket: int,
    service: TicketService = Depends(get_ticket_service),
    current_user: Utilisateur = Depends(require_ticket_consultation),
) -> TicketMaintenanceWithBanc:
    """Get a maintenance ticket by its ID.

    Operators can only access tickets they created.
    Administrators and Managers can access any ticket.
    """
    ticket = service.get_ticket(id_ticket)
    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance ticket with ID {id_ticket} not found",
        )

    if current_user.role == RoleUtilisateur.OPERATEUR_PRODUCTION and ticket.id_user != current_user.id_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance ticket with ID {id_ticket} not found",
        )

    return TicketMaintenanceWithBanc(
        id_ticket=ticket.id_ticket,
        code_banc=ticket.code_banc,
        symptome=ticket.symptome,
        criticite=ticket.criticite,
        date_creation=ticket.date_creation,
        statut=ticket.statut,
        banc_nom=ticket.banc.nom if ticket.banc else "",
        banc_emplacement=ticket.banc.emplacement if ticket.banc else "",
        banc_statut=ticket.banc.statut.value if ticket.banc else "",
    )


@router.post(
    "/",
    response_model=TicketMaintenanceRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create maintenance ticket",
    description="Create a new maintenance ticket.",
)
def create_ticket(
    ticket_create: TicketMaintenanceCreate,
    service: TicketService = Depends(get_ticket_service),
    current_user: Utilisateur = Depends(require_ticket_creation),
) -> TicketMaintenanceRead:
    """Create a new maintenance ticket automatically linked to the authenticated user."""
    try:
        ticket = service.create_ticket(ticket_create, current_user.id_user)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    return TicketMaintenanceRead.model_validate(ticket)


@router.put(
    "/{id_ticket}",
    response_model=TicketMaintenanceRead,
    summary="Update maintenance ticket",
    description="Update a maintenance ticket.",
)
def update_ticket(
    id_ticket: int,
    ticket_update: TicketMaintenanceUpdate,
    service: TicketService = Depends(get_ticket_service),
    current_user: Utilisateur = Depends(require_ticket_modification),
) -> TicketMaintenanceRead:
    """Update a maintenance ticket partially."""
    ticket = service.update_ticket(id_ticket, ticket_update)
    if ticket is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance ticket with ID {id_ticket} not found",
        )
    return TicketMaintenanceRead.model_validate(ticket)


@router.delete(
    "/{id_ticket}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete maintenance ticket",
    description="Delete a maintenance ticket.",
)
def delete_ticket(
    id_ticket: int,
    service: TicketService = Depends(get_ticket_service),
    current_user: Utilisateur = Depends(require_ticket_deletion),
) -> None:
    """Delete a maintenance ticket."""
    success = service.delete_ticket(id_ticket)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Maintenance ticket with ID {id_ticket} not found",
        )