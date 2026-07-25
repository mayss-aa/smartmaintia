"""Data access layer for the TicketMaintenance entity."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.ticket import TicketMaintenance


class TicketRepository:
    """Repository encapsulating database access for maintenance tickets."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def get_by_id(self, id_ticket: int) -> TicketMaintenance | None:
        """Return the ticket with the given id, or ``None``."""
        return self._db.get(TicketMaintenance, id_ticket)

    def create(self, ticket_data: dict) -> TicketMaintenance:
        """Create a new maintenance ticket."""
        ticket = TicketMaintenance(**ticket_data)
        self._db.add(ticket)
        self._db.commit()
        self._db.refresh(ticket)
        return ticket

    def update(self, id_ticket: int, update_data: dict) -> TicketMaintenance | None:
        """Update ticket fields partially."""
        ticket = self.get_by_id(id_ticket)
        if not ticket:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(ticket, key, value)

        self._db.commit()
        self._db.refresh(ticket)
        return ticket

    def delete(self, id_ticket: int) -> bool:
        """Delete a maintenance ticket."""
        ticket = self.get_by_id(id_ticket)
        if not ticket:
            return False

        self._db.delete(ticket)
        self._db.commit()
        return True

    def list(self, skip: int = 0, limit: int = 100) -> list[TicketMaintenance]:
        """Return paginated list of maintenance tickets."""
        stmt = select(TicketMaintenance).offset(skip).limit(limit)
        return list(self._db.scalars(stmt))

    def list_by_user(self, id_user: int, skip: int = 0, limit: int = 100) -> list[TicketMaintenance]:
        """Return paginated list of tickets created by a specific user."""
        stmt = (
            select(TicketMaintenance)
            .where(TicketMaintenance.id_user == id_user)
            .offset(skip)
            .limit(limit)
        )
        return list(self._db.scalars(stmt))

    def list_by_banc(self, code_banc: str, skip: int = 0, limit: int = 100) -> list[TicketMaintenance]:
        """Return paginated list of tickets for a specific banc."""
        stmt = (
            select(TicketMaintenance)
            .where(TicketMaintenance.code_banc == code_banc)
            .offset(skip)
            .limit(limit)
        )
        return list(self._db.scalars(stmt))

    def list_by_statut(self, statut: str, skip: int = 0, limit: int = 100) -> list[TicketMaintenance]:
        """Return paginated list of tickets with a specific status."""
        stmt = (
            select(TicketMaintenance)
            .where(TicketMaintenance.statut == statut)
            .offset(skip)
            .limit(limit)
        )
        return list(self._db.scalars(stmt))