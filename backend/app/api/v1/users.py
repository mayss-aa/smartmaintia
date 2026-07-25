"""User management endpoints (CRUD)."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.enums import RoleUtilisateur
from app.models.user import Utilisateur
from app.schemas.user import UtilisateurCreate, UtilisateurRead, UtilisateurUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


def require_admin(current_user: Utilisateur = Depends(get_current_user)) -> Utilisateur:
    """Dependency that requires ADMINISTRATEUR role."""
    if current_user.role != RoleUtilisateur.ADMINISTRATEUR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    return current_user


def require_manager_or_admin(current_user: Utilisateur = Depends(get_current_user)) -> Utilisateur:
    """Dependency that requires MANAGER_MAINTENANCE or ADMINISTRATEUR role."""
    if current_user.role not in (
        RoleUtilisateur.MANAGER_MAINTENANCE,
        RoleUtilisateur.ADMINISTRATEUR,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager or Administrator role required",
        )
    return current_user


def can_view_user(current_user: Utilisateur, target_user_id: int) -> bool:
    """Check if the current user can view the target user."""
    # ADMINISTRATEUR can view any user
    if current_user.role == RoleUtilisateur.ADMINISTRATEUR:
        return True
    # Other roles can only view their own profile
    return current_user.id_user == target_user_id


@router.get("/", response_model=list[UtilisateurRead], summary="List all users")
def list_users(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(require_admin),  # Only ADMINISTRATEUR can list all users
) -> list[Utilisateur]:
    """Return a paginated list of users (requires ADMINISTRATEUR role)."""
    service = UserService(db)
    return service.list_users(skip=skip, limit=limit)


@router.get(
    "/technicians/",
    response_model=list[UtilisateurRead],
    summary="List all technicians",
    description="Returns all users with TECHNICIEN role. Requires Manager or Administrator.",
)
def list_technicians(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records to return"),
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(require_manager_or_admin),
) -> list[Utilisateur]:
    """Return a paginated list of users with TECHNICIEN role."""
    service = UserService(db)
    return service.list_technicians(skip=skip, limit=limit)


@router.get("/{id_user}", response_model=UtilisateurRead, summary="Get a user by ID")
def get_user(
    id_user: int,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Retrieve a specific user by identifier (requires authentication).
    
    ADMINISTRATEUR can view any user. Other roles can only view their own profile.
    """
    # Check permissions
    if not can_view_user(current_user, id_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only view your own profile",
        )
    
    service = UserService(db)
    return service.get_user_or_404(id_user)


@router.post(
    "/",
    response_model=UtilisateurRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user",
)
def create_user(
    user_data: UtilisateurCreate,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(require_admin),
) -> Utilisateur:
    """Create a new user (requires ADMINISTRATEUR role)."""
    service = UserService(db)
    return service.create_user(user_data)


@router.put("/{id_user}", response_model=UtilisateurRead, summary="Update a user")
def update_user(
    id_user: int,
    update_data: UtilisateurUpdate,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Update user information.
    
    ADMINISTRATEUR can update any user. Other users can only update their own profile.
    Non-ADMINISTRATEUR users cannot update their role.
    """
    # Check if user is trying to update their role without ADMINISTRATEUR permission
    if update_data.role is not None and current_user.role != RoleUtilisateur.ADMINISTRATEUR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update role without ADMINISTRATEUR permission",
        )
    
    # Check permissions: ADMINISTRATEUR can update anyone, others can only update themselves
    if current_user.role != RoleUtilisateur.ADMINISTRATEUR and current_user.id_user != id_user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Can only update your own profile",
        )
    
    service = UserService(db)
    return service.update_user(id_user, update_data)


@router.delete(
    "/{id_user}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a user",
)
def delete_user(
    id_user: int,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(require_admin),
) -> None:
    """Delete a user (requires ADMINISTRATEUR role)."""
    service = UserService(db)
    success = service.delete_user(id_user)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
