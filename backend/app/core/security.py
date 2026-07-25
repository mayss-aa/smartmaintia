"""Security utilities: JWT tokens and password hashing."""

from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
import jwt

from app.config.settings import settings

# bcrypt truncates passwords beyond 72 bytes; we enforce the same bound.
_BCRYPT_MAX_BYTES = 72


def hash_password(password: str) -> str:
    """Hash a plain-text password using bcrypt."""
    pwd_bytes = password.encode("utf-8")[:_BCRYPT_MAX_BYTES]
    return bcrypt.hashpw(pwd_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    pwd_bytes = password.encode("utf-8")[:_BCRYPT_MAX_BYTES]
    try:
        return bcrypt.checkpw(pwd_bytes, hashed_password.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def create_access_token(
    subject: str | Any,
    expires_minutes: int | None = None,
    additional_claims: dict[str, Any] | None = None,
) -> str:
    """Create a signed JWT access token.

    Args:
        subject: Value stored in the ``sub`` claim (e.g. a user identifier).
        expires_minutes: Optional custom expiration; defaults to the configured value.
        additional_claims: Optional extra claims to embed in the token.

    Returns:
        The encoded JWT as a string.
    """
    now = datetime.now(timezone.utc)
    expire = now + timedelta(
        minutes=expires_minutes or settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload: dict[str, Any] = {"sub": str(subject), "iat": now, "exp": expire}
    if additional_claims:
        payload.update(additional_claims)
    return jwt.encode(
        payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and verify a JWT access token.

    Raises:
        jwt.PyJWTError: If the token is invalid or expired.
    """
    return jwt.decode(
        token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
    )
