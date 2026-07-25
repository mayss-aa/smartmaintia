"""Authentication endpoints (login and current user)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import Utilisateur
from app.schemas.auth import LoginRequest, Token
from app.schemas.user import UtilisateurRead
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token, summary="Authenticate and obtain a JWT")
def login(credentials: LoginRequest, db: Session = Depends(get_db)) -> Token:
    """Verify credentials and return a JWT access token."""
    service = AuthService(db)
    user = service.authenticate(credentials.email, credentials.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = service.create_token_for_user(user)
    return Token(access_token=token)


@router.get("/me", response_model=UtilisateurRead, summary="Get the current user")
def read_current_user(
    current_user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Return the profile of the authenticated user."""
    return current_user
