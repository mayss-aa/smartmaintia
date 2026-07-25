"""Data access layer for the Utilisateur entity."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.enums import RoleUtilisateur
from app.models.user import Utilisateur


class UserRepository:
    """Repository encapsulating database access for users."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def get_by_id(self, id_user: int) -> Utilisateur | None:
        """Return the user with the given identifier, or ``None``."""
        return self._db.get(Utilisateur, id_user)

    def get_by_email(self, email: str) -> Utilisateur | None:
        """Return the user with the given email, or ``None``."""
        stmt = select(Utilisateur).where(Utilisateur.email == email)
        return self._db.scalar(stmt)

    def create(self, utilisateur_data: dict) -> Utilisateur:
        """Create a new user with hashed password."""
        # Hash the password if provided
        if "password" in utilisateur_data:
            password = utilisateur_data.pop("password")
            if isinstance(password, str):
                utilisateur_data["mot_de_passe_hash"] = hash_password(password)
            else:
                raise ValueError("Password must be a string")
        
        user = Utilisateur(**utilisateur_data)
        self._db.add(user)
        self._db.commit()
        self._db.refresh(user)
        return user

    def update(self, id_user: int, update_data: dict) -> Utilisateur | None:
        """Update user fields partially."""
        user = self.get_by_id(id_user)
        if not user:
            return None
        
        # Hash the password if provided
        if "password" in update_data:
            password = update_data.pop("password")
            if isinstance(password, str):
                update_data["mot_de_passe_hash"] = hash_password(password)
            else:
                raise ValueError("Password must be a string")
        
        for key, value in update_data.items():
            if value is not None:
                setattr(user, key, value)
        
        self._db.commit()
        self._db.refresh(user)
        return user

    def delete(self, id_user: int) -> bool:
        """Delete a user (hard delete)."""
        user = self.get_by_id(id_user)
        if not user:
            return False
        
        self._db.delete(user)
        self._db.commit()
        return True

    def list(self, skip: int = 0, limit: int = 100) -> list[Utilisateur]:
        """Return paginated list of users."""
        stmt = select(Utilisateur).offset(skip).limit(limit)
        return list(self._db.scalars(stmt))

    def list_by_role(self, role: RoleUtilisateur, skip: int = 0, limit: int = 100) -> list[Utilisateur]:
        """Return paginated list of users filtered by role."""
        stmt = select(Utilisateur).where(Utilisateur.role == role).offset(skip).limit(limit)
        return list(self._db.scalars(stmt))
