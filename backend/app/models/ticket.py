"""SQLAlchemy model for the ``TicketMaintenance`` entity (see ERD.md / DATABASE.md)."""

from datetime import datetime

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base
from app.models.enums import StatutTicket


class TicketMaintenance(Base):
    """Maintenance ticket entity representing reported incidents."""

    __tablename__ = "ticket_maintenance"

    id_ticket: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, nullable=False
    )
    id_user: Mapped[int] = mapped_column(
        Integer, ForeignKey("utilisateur.id_user"), nullable=False
    )
    code_banc: Mapped[str] = mapped_column(
        String(50), ForeignKey("banc_test_bdd.code_banc"), nullable=False
    )
    symptome: Mapped[str] = mapped_column(String(1000), nullable=False)
    criticite: Mapped[str] = mapped_column(String(50), nullable=False)
    date_creation: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )
    statut: Mapped[StatutTicket] = mapped_column(
        SAEnum(StatutTicket, name="stattutticket"), nullable=False
    )

    # Relationships
    banc: Mapped["BancTestBDD"] = relationship(back_populates="tickets")
    interventions = relationship("Intervention", back_populates="ticket")
    declarant: Mapped["Utilisateur"] = relationship(
        "Utilisateur", back_populates="tickets_declares"
    )

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"<TicketMaintenance id_ticket={self.id_ticket!r} code_banc={self.code_banc!r}>"


# Import circulaire résolu
from app.models.test_bench import BancTestBDD  # noqa: E402
from app.models.user import Utilisateur  # noqa: E402

# Ajouter les relations inverses
if not hasattr(BancTestBDD, "tickets"):
    BancTestBDD.tickets = relationship("TicketMaintenance", back_populates="banc")

if not hasattr(Utilisateur, "tickets_declares"):
    Utilisateur.tickets_declares = relationship(
        "TicketMaintenance", back_populates="declarant"
    )