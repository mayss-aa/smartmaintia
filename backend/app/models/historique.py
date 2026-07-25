"""SQLAlchemy model for the ``HistoriqueGlobal`` entity (see ERD.md / DATABASE.md)."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class HistoriqueGlobal(Base):
    """Global history entity archiving all completed interventions."""

    __tablename__ = "historique_global"

    id_historique: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, nullable=False
    )
    code_banc: Mapped[str] = mapped_column(
        String(50), ForeignKey("banc_test_bdd.code_banc"), nullable=False
    )
    id_intervention: Mapped[int] = mapped_column(
        Integer, ForeignKey("intervention.id_intervention"), nullable=False
    )
    type_action: Mapped[str] = mapped_column(String(100), nullable=False)
    rapport_clean_ia: Mapped[str] = mapped_column(Text, nullable=False)
    date_cloture: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    mttr_calcule: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Relationships
    banc: Mapped["BancTestBDD"] = relationship(back_populates="historiques")
    intervention: Mapped["Intervention"] = relationship(back_populates="historique")

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"<HistoriqueGlobal id_historique={self.id_historique!r} code_banc={self.code_banc!r}>"