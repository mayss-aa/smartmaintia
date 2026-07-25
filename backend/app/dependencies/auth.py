"""Authentication dependencies (JWT verification and current-user resolution)."""

from typing import Any

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.database.session import get_db
from app.models.user import Utilisateur
from app.repositories.user_repository import UserRepository

bearer_scheme = HTTPBearer(auto_error=False)

_CREDENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid or expired token",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_token_payload(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict[str, Any]:
    """Validate the Bearer token and return its decoded payload.

    Generic technical dependency used to protect routes.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        return decode_access_token(credentials.credentials)
    except jwt.PyJWTError as exc:
        raise _CREDENTIALS_EXCEPTION from exc


def get_current_user(
    payload: dict[str, Any] = Depends(get_token_payload),
    db: Session = Depends(get_db),
) -> Utilisateur:
    """Resolve the authenticated user from the JWT ``sub`` claim."""
    subject = payload.get("sub")
    if subject is None:
        raise _CREDENTIALS_EXCEPTION
    try:
        user_id = int(subject)
    except (TypeError, ValueError) as exc:
        raise _CREDENTIALS_EXCEPTION from exc

    user = UserRepository(db).get_by_id(user_id)
    if user is None:
        raise _CREDENTIALS_EXCEPTION
    return user
