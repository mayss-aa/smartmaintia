"""Data access layer for the HistoriqueGlobal entity."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.historique import HistoriqueGlobal
from app.models.intervention import Intervention


class HistoriqueRepository:
    """Repository encapsulating database access for global history records."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def get_by_id(self, id_historique: int) -> HistoriqueGlobal | None:
        """Return the history record with the given id, or ``None``."""
        return self._db.get(HistoriqueGlobal, id_historique)

    def list(self, skip: int = 0, limit: int = 100) -> list[HistoriqueGlobal]:
        """Return paginated list of global history records."""
        stmt = select(HistoriqueGlobal).offset(skip).limit(limit)
        return list(self._db.scalars(stmt))

    def list_for_technicien(self, id_technicien: int, skip: int = 0, limit: int = 100) -> list[HistoriqueGlobal]:
        """Return paginated list of history records for interventions assigned to a specific technician."""
        stmt = (
            select(HistoriqueGlobal)
            .join(Intervention, HistoriqueGlobal.id_intervention == Intervention.id_intervention)
            .where(Intervention.id_technicien == id_technicien)
            .offset(skip)
            .limit(limit)
        )
        return list(self._db.scalars(stmt))

    def get_by_id_for_technicien(self, id_historique: int, id_technicien: int) -> HistoriqueGlobal | None:
        """Return a history record by its id only if it belongs to an intervention assigned to the technician."""
        stmt = (
            select(HistoriqueGlobal)
            .join(Intervention, HistoriqueGlobal.id_intervention == Intervention.id_intervention)
            .where(
                HistoriqueGlobal.id_historique == id_historique,
                Intervention.id_technicien == id_technicien
            )
        )
        return self._db.scalar(stmt)

    def create(self, historique_data: dict) -> HistoriqueGlobal:
        historique = HistoriqueGlobal(**historique_data)
        self._db.add(historique)
        self._db.commit()
        self._db.refresh(historique)
        return historique