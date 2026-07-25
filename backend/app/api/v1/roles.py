"""Roles enumeration endpoint."""

from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.models.enums import RoleUtilisateur
from app.models.user import Utilisateur

router = APIRouter(prefix="/roles", tags=["roles"])


@router.get("/", summary="Get available user roles")
def list_roles(current_user: Utilisateur = Depends(get_current_user)) -> list[str]:
    """Return the list of valid user roles as defined in ERD.md (requires authentication)."""
    return [role.value for role in RoleUtilisateur]