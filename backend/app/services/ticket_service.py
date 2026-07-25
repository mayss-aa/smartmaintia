"""Service layer for the TicketMaintenance entity."""

from typing import Annotated

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.enums import StatutTicket
from app.models.test_bench import BancTestBDD
from app.models.ticket import TicketMaintenance
from app.repositories.ticket_repository import TicketRepository
from app.repositories.test_bench_repository import TestBenchRepository
from app.repositories.user_repository import UserRepository
from app.schemas.ticket import TicketMaintenanceCreate, TicketMaintenanceUpdate


class TicketService:
    """Business logic for maintenance tickets."""

    def __init__(self, db: Session) -> None:
        self._ticket_repo = TicketRepository(db)
        self._banc_repo = TestBenchRepository(db)
        self._user_repo = UserRepository(db)

    def list_tickets(
        self, skip: int = 0, limit: int = 100
    ) -> list[TicketMaintenance]:
        """Return paginated list of maintenance tickets."""
        return self._ticket_repo.list(skip, limit)

    def get_ticket(self, id_ticket: int) -> TicketMaintenance | None:
        """Return a maintenance ticket by its id, or None."""
        return self._ticket_repo.get_by_id(id_ticket)

    def create_ticket(self, ticket_create: TicketMaintenanceCreate, id_user: int) -> TicketMaintenance:
        """Create a new maintenance ticket linked to the declaring user."""
        # Validation: ensure banc exists
        banc = self._banc_repo.get_by_code(ticket_create.code_banc)
        if not banc:
            raise ValueError(
                f"Test bench with code {ticket_create.code_banc} does not exist"
            )

        # Validate status
        if not isinstance(ticket_create.statut, StatutTicket):
            raise ValueError(f"Invalid ticket status: {ticket_create.statut}")

        # Validate declaring user exists
        user = self._user_repo.get_by_id(id_user)
        if not user:
            raise ValueError(f"User with id {id_user} does not exist")

        ticket_data = ticket_create.model_dump()
        ticket_data["id_user"] = id_user
        return self._ticket_repo.create(ticket_data)

    def update_ticket(
        self, id_ticket: int, ticket_update: TicketMaintenanceUpdate
    ) -> TicketMaintenance | None:
        """Update a maintenance ticket partially."""
        # Validation: ensure ticket exists
        existing = self._ticket_repo.get_by_id(id_ticket)
        if not existing:
            return None

        # Validate status if provided
        if ticket_update.statut and not isinstance(ticket_update.statut, StatutTicket):
            raise ValueError(f"Invalid ticket status: {ticket_update.statut}")

        update_data = {
            k: v for k, v in ticket_update.model_dump().items() if v is not None
        }
        return self._ticket_repo.update(id_ticket, update_data)

    def list_my_declarations(
        self, id_user: int, skip: int = 0, limit: int = 100
    ) -> list[TicketMaintenance]:
        """Return paginated list of tickets created by a specific user."""
        return self._ticket_repo.list_by_user(id_user, skip, limit)

    def delete_ticket(self, id_ticket: int) -> bool:
        """Delete a maintenance ticket."""
        return self._ticket_repo.delete(id_ticket)

    def list_tickets_by_banc(
        self, code_banc: str, skip: int = 0, limit: int = 100
    ) -> list[TicketMaintenance]:
        """Return paginated list of tickets for a specific banc."""
        # Validation: ensure banc exists
        banc = self._banc_repo.get_by_code(code_banc)
        if not banc:
            raise ValueError(f"Test bench with code {code_banc} does not exist")

        return self._ticket_repo.list_by_banc(code_banc, skip, limit)

    def list_tickets_by_statut(
        self, statut: str, skip: int = 0, limit: int = 100
    ) -> list[TicketMaintenance]:
        """Return paginated list of tickets with a specific status."""
        # Validate status
        try:
            StatutTicket(statut)
        except ValueError:
            raise ValueError(f"Invalid ticket status: {statut}")

        return self._ticket_repo.list_by_statut(statut, skip, limit)


def get_ticket_service(
    db: Annotated[Session, Depends(get_db)],
) -> TicketService:
    """Dependency for obtaining a TicketService instance."""
    return TicketService(db)