"""Repository layer for the ``AlertePredictive`` entity (see ERD.md / DATABASE.md)."""

from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.alerte import AlertePredictive


class AlerteRepository:
    """Repository for AlertePredictive operations."""

    def __init__(self, session: Session):
        self.session = session

    def get(self, id_alerte: int) -> Optional[AlertePredictive]:
        """Get an AlertePredictive by id_alerte."""
        return self.session.get(AlertePredictive, id_alerte)

    def list(self) -> List[AlertePredictive]:
        """Get all AlertePredictive records."""
        stmt = select(AlertePredictive).order_by(AlertePredictive.date_detection.desc())
        return list(self.session.scalars(stmt).all())

    def create(self, alerte: AlertePredictive) -> AlertePredictive:
        """Create a new AlertePredictive."""
        self.session.add(alerte)
        self.session.flush()
        return alerte

    def update(self, alerte: AlertePredictive) -> AlertePredictive:
        """Update an existing AlertePredictive."""
        self.session.add(alerte)
        self.session.flush()
        return alerte

    def delete(self, alerte: AlertePredictive) -> None:
        """Delete an AlertePredictive."""
        self.session.delete(alerte)
        self.session.flush()