"""SQLAlchemy model for the ``Intervention`` entity (see ERD.md / DATABASE.md)."""

from datetime import datetime

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base
from app.models.enums import PrioriteIntervention, TypeIntervention


class Intervention(Base):
    """Maintenance intervention entity."""

    __tablename__ = "intervention"

    id_intervention: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, nullable=False
    )
    id_technicien: Mapped[int] = mapped_column(
        Integer, ForeignKey("utilisateur.id_user"), nullable=False
    )
    id_manager: Mapped[int] = mapped_column(
        Integer, ForeignKey("utilisateur.id_user"), nullable=False
    )
    id_ticket: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("ticket_maintenance.id_ticket"), nullable=True
    )
    id_alerte: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("alerte_predictive.id_alerte"), nullable=True
    )
    type: Mapped[TypeIntervention] = mapped_column(
        SAEnum(TypeIntervention, name="typeintervention"), nullable=False
    )
    priorite: Mapped[PrioriteIntervention | None] = mapped_column(String(50), nullable=True)
    date_planifiee: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    duree_reparation: Mapped[int | None] = mapped_column(Integer, nullable=True)
    statut_intervention: Mapped[str] = mapped_column(String(50), nullable=False)

    # Relationships
    technicien: Mapped["Utilisateur"] = relationship(
        foreign_keys=[id_technicien], back_populates="interventions_technicien"
    )
    manager: Mapped["Utilisateur"] = relationship(
        foreign_keys=[id_manager], back_populates="interventions_manager"
    )
    ticket: Mapped["TicketMaintenance | None"] = relationship(
        "TicketMaintenance", back_populates="interventions"
    )
    alerte: Mapped["AlertePredictive | None"] = relationship(
        "AlertePredictive", back_populates="interventions"
    )

    historique: Mapped["HistoriqueGlobal | None"] = relationship(
        "HistoriqueGlobal", back_populates="intervention", uselist=False
    )

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"<Intervention id_intervention={self.id_intervention!r} type={self.type!r}>"


# Import circulaire résolu
from app.models.ticket import TicketMaintenance  # noqa: E402
from app.models.user import Utilisateur  # noqa: E402

# Ajouter les relations inverses dans Utilisateur
if not hasattr(Utilisateur, "interventions_technicien"):
    Utilisateur.interventions_technicien = relationship(
        "Intervention", 
        foreign_keys="[Intervention.id_technicien]",
        back_populates="technicien"
    )

if not hasattr(Utilisateur, "interventions_manager"):
    Utilisateur.interventions_manager = relationship(
        "Intervention", 
        foreign_keys="[Intervention.id_manager]",
        back_populates="manager"
    )