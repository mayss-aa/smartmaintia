"""User management service (business logic layer)."""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import Utilisateur
from app.repositories.user_repository import UserRepository
from app.schemas.user import UtilisateurCreate, UtilisateurUpdate


class UserService:
    """Handle user management business logic."""

    def __init__(self, db: Session) -> None:
        self._users = UserRepository(db)

    def get_user(self, id_user: int) -> Utilisateur | None:
        """Retrieve a user by ID."""
        return self._users.get_by_id(id_user)

    def get_user_or_404(self, id_user: int) -> Utilisateur:
        """Retrieve a user by ID or raise 404."""
        user = self.get_user(id_user)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user

    def create_user(self, user_data: UtilisateurCreate) -> Utilisateur:
        """Create a new user with validation."""
        # Check if email already exists
        existing = self._users.get_by_email(user_data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )
        
        # Convert Pydantic model to dict for repository
        create_dict = user_data.model_dump()
        
        return self._users.create(create_dict)

    def update_user(self, id_user: int, update_data: UtilisateurUpdate) -> Utilisateur:
        """Update user information."""
        user = self.get_user_or_404(id_user)
        
        # Check if email is being updated and if it's already taken
        if update_data.email is not None and update_data.email != user.email:
            existing = self._users.get_by_email(update_data.email)
            if existing and existing.id_user != id_user:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already registered",
                )
        
        # Convert Pydantic model to dict for repository
        update_dict = update_data.model_dump(exclude_unset=True)
        
        updated = self._users.update(id_user, update_dict)
        if updated is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return updated

    def delete_user(self, id_user: int) -> bool:
        """Delete a user."""
        user = self.get_user(id_user)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return self._users.delete(id_user)

    def list_users(self, skip: int = 0, limit: int = 100) -> list[Utilisateur]:
        """Return paginated list of users."""
        return self._users.list(skip=skip, limit=limit)

    def list_technicians(self, skip: int = 0, limit: int = 100) -> list[Utilisateur]:
        """Return paginated list of technicians."""
        from app.models.enums import RoleUtilisateur
        return self._users.list_by_role(RoleUtilisateur.TECHNICIEN, skip=skip, limit=limit)
