"""Authentication service: credential verification and token issuance.

Business logic layer. It relies on the repository for data access and on
``core.security`` for password hashing and JWT operations (JWT service).
"""

from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password
from app.models.user import Utilisateur
from app.repositories.user_repository import UserRepository


class AuthService:
    """Handle user authentication and access-token generation."""

    def __init__(self, db: Session) -> None:
        self._users = UserRepository(db)

    def authenticate(self, email: str, password: str) -> Utilisateur | None:
        """Return the user if the credentials are valid, otherwise ``None``."""
        user = self._users.get_by_email(email)
        if user is None:
            return None
        if not verify_password(password, user.mot_de_passe_hash):
            return None
        return user

    def create_token_for_user(self, user: Utilisateur) -> str:
        """Issue a signed JWT access token for the given user."""
        return create_access_token(
            subject=user.id_user,
            additional_claims={"role": user.role.value},
        )
