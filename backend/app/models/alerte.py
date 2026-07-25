"""SQLAlchemy model for the ``AlertePredictive`` entity (see ERD.md / DATABASE.md)."""

from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class AlertePredictive(Base):
    """Predictive alert entity."""

    __tablename__ = "alerte_predictive"

    id_alerte: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True, nullable=False
    )
    code_banc: Mapped[str] = mapped_column(
        String(50), ForeignKey("banc_test_bdd.code_banc"), nullable=False
    )
    composant_cible: Mapped[str] = mapped_column(String(150), nullable=False)
    probabilite_panne: Mapped[float] = mapped_column(Float, nullable=False)
    date_detection: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    statut_alerte: Mapped[str] = mapped_column(String(50), nullable=False)

    # Relationships
    banc: Mapped["BancTestBDD"] = relationship(
        "BancTestBDD", back_populates="alertes"
    )
    interventions: Mapped[list["Intervention"]] = relationship(
        "Intervention", back_populates="alerte"
    )

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"<AlertePredictive id_alerte={self.id_alerte!r} composant={self.composant_cible!r}>"


# Import circulaire résolu
from app.models.test_bench import BancTestBDD  # noqa: E402

# Ajouter la relation inverse dans BancTestBDD
if not hasattr(BancTestBDD, "alertes"):
    BancTestBDD.alertes = relationship(
        "AlertePredictive", back_populates="banc"
    )