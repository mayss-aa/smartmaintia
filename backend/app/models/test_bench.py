"""SQLAlchemy model for the ``BancTestBDD`` entity (see ERD.md / DATABASE.md).

Table and column names follow the validated data model exactly:
code_banc, nom, emplacement, statut.
"""

from sqlalchemy import Enum as SAEnum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base
from app.models.enums import StatutBanc


class BancTestBDD(Base):
    """Test bench entity representing industrial test equipment."""

    __tablename__ = "banc_test_bdd"

    code_banc: Mapped[str] = mapped_column(
        String(50), primary_key=True, nullable=False
    )
    nom: Mapped[str] = mapped_column(String(100), nullable=False)
    emplacement: Mapped[str] = mapped_column(String(150), nullable=False)
    statut: Mapped[StatutBanc] = mapped_column(
        SAEnum(StatutBanc, name="statutbanc"), nullable=False
    )

    # Relationships
    historiques: Mapped[list["HistoriqueGlobal"]] = relationship(
        "HistoriqueGlobal", back_populates="banc"
    )

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"<BancTestBDD code_banc={self.code_banc!r} nom={self.nom!r}>"


# Import circulaire résolu
from app.models.historique import HistoriqueGlobal  # noqa: E402
