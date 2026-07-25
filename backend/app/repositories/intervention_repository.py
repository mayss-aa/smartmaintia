"""Data access layer for the Intervention entity."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.intervention import Intervention


class InterventionRepository:
    """Repository encapsulating database access for maintenance interventions."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def get_by_id(self, id_intervention: int) -> Intervention | None:
        """Return the intervention with the given id, or ``None``."""
        return self._db.get(Intervention, id_intervention)

    def create(self, intervention_data: dict) -> Intervention:
        """Create a new maintenance intervention."""
        intervention = Intervention(**intervention_data)
        self._db.add(intervention)
        self._db.commit()
        self._db.refresh(intervention)
        return intervention

    def update(self, id_intervention: int, update_data: dict) -> Intervention | None:
        """Update intervention fields partially."""
        intervention = self.get_by_id(id_intervention)
        if not intervention:
            return None

        for key, value in update_data.items():
            if value is not None:
                setattr(intervention, key, value)

        self._db.commit()
        self._db.refresh(intervention)
        return intervention

    def delete(self, id_intervention: int) -> bool:
        """Delete a maintenance intervention."""
        intervention = self.get_by_id(id_intervention)
        if not intervention:
            return False

        self._db.delete(intervention)
        self._db.commit()
        return True

    def list(self, skip: int = 0, limit: int = 100) -> list[Intervention]:
        """Return paginated list of maintenance interventions."""
        stmt = select(Intervention).offset(skip).limit(limit)
        return list(self._db.scalars(stmt))

    def list_by_technicien(self, id_technicien: int, skip: int = 0, limit: int = 100) -> list[Intervention]:
        """Return paginated list of interventions for a specific technician."""
        stmt = (
            select(Intervention)
            .where(Intervention.id_technicien == id_technicien)
            .offset(skip)
            .limit(limit)
        )
        return list(self._db.scalars(stmt))

    def list_by_manager(self, id_manager: int, skip: int = 0, limit: int = 100) -> list[Intervention]:
        """Return paginated list of interventions for a specific manager."""
        stmt = (
            select(Intervention)
            .where(Intervention.id_manager == id_manager)
            .offset(skip)
            .limit(limit)
        )
        return list(self._db.scalars(stmt))

    def list_by_ticket(self, id_ticket: int, skip: int = 0, limit: int = 100) -> list[Intervention]:
        """Return paginated list of interventions for a specific ticket."""
        stmt = (
            select(Intervention)
            .where(Intervention.id_ticket == id_ticket)
            .offset(skip)
            .limit(limit)
        )
        return list(self._db.scalars(stmt))

    def list_by_type(self, type_intervention: str, skip: int = 0, limit: int = 100) -> list[Intervention]:
        """Return paginated list of interventions with a specific type."""
        stmt = (
            select(Intervention)
            .where(Intervention.type == type_intervention)
            .offset(skip)
            .limit(limit)
        )
        return list(self._db.scalars(stmt))