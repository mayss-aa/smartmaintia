"""SQLAlchemy model for the ``Utilisateur`` entity (see ERD.md / DATABASE.md).

Table and column names follow the validated data model exactly:
id_user, nom, prenom, email, mot_de_passe_hash, role.
"""

from sqlalchemy import Enum as SAEnum
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base
from app.models.enums import RoleUtilisateur


class Utilisateur(Base):
    """User entity used for authentication and role-based access control."""

    __tablename__ = "utilisateur"

    id_user: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    nom: Mapped[str] = mapped_column(String(100), nullable=False)
    prenom: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(
        String(150), nullable=False, unique=True, index=True
    )
    mot_de_passe_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[RoleUtilisateur] = mapped_column(
        SAEnum(RoleUtilisateur, name="roleutilisateur"), nullable=False
    )

    def __repr__(self) -> str:  # pragma: no cover - debug helper
        return f"<Utilisateur id_user={self.id_user} email={self.email!r}>"
