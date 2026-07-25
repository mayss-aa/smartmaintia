"""RBAC dependencies following PERMISSIONS_MATRIX.md and RBAC.md."""

from typing import Callable, TypeVar

from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.enums import RoleUtilisateur
from app.models.user import Utilisateur
from app.repositories.user_repository import UserRepository

T = TypeVar("T")


def require_role(*roles: RoleUtilisateur) -> Callable[[Utilisateur], Utilisateur]:
    """Require that the current user has one of the specified roles."""

    def _require_role(user: Utilisateur = Depends(get_current_user)) -> Utilisateur:
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role {user.role} not authorized for this operation",
            )
        return user

    return _require_role


def require_admin(user: Utilisateur = Depends(get_current_user)) -> Utilisateur:
    """Require ADMINISTRATEUR role."""
    if user.role != RoleUtilisateur.ADMINISTRATEUR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator role required",
        )
    return user


def require_manager_or_admin(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require MANAGER_MAINTENANCE or ADMINISTRATEUR role."""
    if user.role not in (
        RoleUtilisateur.MANAGER_MAINTENANCE,
        RoleUtilisateur.ADMINISTRATEUR,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager or Administrator role required",
        )
    return user


def require_consultation_access_banc_test(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require consultation permission for BancTestBDD according to PERMISSIONS_MATRIX.md.
    
    All roles can consult test benches.
    """
    # According to PERMISSIONS_MATRIX.md, all roles can consult BancTestBDD
    return user


def require_full_access_banc_test(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require full access (CRUD) for BancTestBDD according to PERMISSIONS_MATRIX.md.
    
    Only ADMINISTRATEUR can create/modify/delete test benches.
    """
    if user.role != RoleUtilisateur.ADMINISTRATEUR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator role required to modify test benches",
        )
    return user


def can_modify_user(
    target_user_id: int,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Check if current user can modify the target user.
    
    Rules:
    - ADMINISTRATEUR can modify any user
    - Other users can only modify their own profile
    """
    if current_user.role == RoleUtilisateur.ADMINISTRATEUR:
        return current_user
    
    if current_user.id_user != target_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only modify your own profile",
        )
    
    return current_user


def can_view_user(
    target_user_id: int,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Check if current user can view the target user.
    
    Rules:
    - ADMINISTRATEUR can view any user
    - Other users can only view their own profile
    """
    if current_user.role == RoleUtilisateur.ADMINISTRATEUR:
        return current_user
    
    if current_user.id_user != target_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own profile",
        )
    
    return current_user

def require_ticket_consultation(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require consultation permission for tickets according to PERMISSIONS_MATRIX.md.
    
    Permissions:
    - ADMINISTRATEUR: ✅ Consultation complète
    - MANAGER_MAINTENANCE: ✅ Consultation complète
    - TECHNICIEN: ✅ Consultation des tickets affectés
    - OPERATEUR_PRODUCTION: 👤 Consultation de ses propres déclarations
    """
    # All authenticated users can consult tickets (with different filters)
    return user


def require_ticket_creation(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require creation permission for tickets according to PERMISSIONS_MATRIX.md.
    
    Tickets are automatically generated. Only operators can declare incidents.
    
    Permissions:
    - ADMINISTRATEUR: ❌ (consultation only)
    - MANAGER_MAINTENANCE: ❌ (consultation only — Manager never creates tickets)
    - TECHNICIEN: ❌
    - OPERATEUR_PRODUCTION: ✅ Déclaration d'incidents
    """
    if user.role != RoleUtilisateur.OPERATEUR_PRODUCTION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only operators can create tickets",
        )
    return user


def require_ticket_modification(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require modification permission for tickets according to PERMISSIONS_MATRIX.md.
    
    Permissions:
    - ADMINISTRATEUR: ❌ (consultation only)
    - MANAGER_MAINTENANCE: ✅ Modification
    - TECHNICIEN: ❌
    - OPERATEUR_PRODUCTION: ❌
    """
    if user.role != RoleUtilisateur.MANAGER_MAINTENANCE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Manager can modify tickets",
        )
    return user


def require_ticket_deletion(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require deletion permission for tickets.
    
    No standard role deletes tickets. Only Administrators can
    in exceptional circumstances.
    
    Permissions:
    - ADMINISTRATEUR: ✅ Cleanup exceptionnel
    - MANAGER_MAINTENANCE: ❌
    - TECHNICIEN: ❌
    - OPERATEUR_PRODUCTION: ❌
    """
    if user.role != RoleUtilisateur.ADMINISTRATEUR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Administrators can delete tickets",
        )
    return user


def require_intervention_consultation(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require consultation permission for interventions according to PERMISSIONS_MATRIX.md.
    
    Permissions:
    - ADMINISTRATEUR: ✅ Consultation complète
    - MANAGER_MAINTENANCE: ✅ Consultation complète
    - TECHNICIEN: ✅ Consultation des interventions affectées
    - OPERATEUR_PRODUCTION: ❌
    """
    if user.role == RoleUtilisateur.OPERATEUR_PRODUCTION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operators cannot consult interventions",
        )
    return user


def require_intervention_creation(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require creation permission for interventions according to PERMISSIONS_MATRIX.md.
    
    Permissions:
    - ADMINISTRATEUR: ❌ (consultation only)
    - MANAGER_MAINTENANCE: ✅ Création
    - TECHNICIEN: ❌
    - OPERATEUR_PRODUCTION: ❌
    """
    if user.role != RoleUtilisateur.MANAGER_MAINTENANCE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Manager can create interventions",
        )
    return user


def require_intervention_modification(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require modification permission for interventions according to PERMISSIONS_MATRIX.md.
    
    Permissions:
    - ADMINISTRATEUR: ❌ (consultation only)
    - MANAGER_MAINTENANCE: ✅ Modification
    - TECHNICIEN: ❌
    - OPERATEUR_PRODUCTION: ❌
    """
    if user.role != RoleUtilisateur.MANAGER_MAINTENANCE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Manager can modify interventions",
        )
    return user


def require_intervention_execution(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require execution permission for interventions according to PERMISSIONS_MATRIX.md.
    
    Permissions:
    - ADMINISTRATEUR: ❌
    - MANAGER_MAINTENANCE: ❌
    - TECHNICIEN: ✅ Réalisation
    - OPERATEUR_PRODUCTION: ❌
    """
    if user.role != RoleUtilisateur.TECHNICIEN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Technicians can execute interventions",
        )
    return user


def can_view_own_tickets(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Check if user can view their own tickets (for OPERATEUR_PRODUCTION).
    
    Operators can only view tickets they created.
    """
    return user


def can_view_assigned_interventions(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Check if user can view assigned interventions (for TECHNICIEN).
    
    Technicians can only view interventions assigned to them.
    """
    return user

def require_planning_consultation(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require consultation permission for planning according to PERMISSIONS_MATRIX.md.
    
    Permissions:
    - ADMINISTRATEUR: ✅ Consultation
    - MANAGER_MAINTENANCE: ✅ Consultation
    - TECHNICIEN: 👤 Consultation de son planning
    - OPERATEUR_PRODUCTION: ❌
    """
    if user.role == RoleUtilisateur.OPERATEUR_PRODUCTION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operators cannot consult planning",
        )
    return user


def require_planning_creation(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require creation permission for planning according to PERMISSIONS_MATRIX.md.
    
    Permissions:
    - ADMINISTRATEUR: ❌
    - MANAGER_MAINTENANCE: ✅ Création
    - TECHNICIEN: ❌
    - OPERATEUR_PRODUCTION: ❌
    """
    if user.role != RoleUtilisateur.MANAGER_MAINTENANCE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Manager can create planning entries",
        )
    return user


def require_planning_modification(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require modification permission for planning according to PERMISSIONS_MATRIX.md.
    
    Permissions:
    - ADMINISTRATEUR: ❌
    - MANAGER_MAINTENANCE: ✅ Modification
    - TECHNICIEN: ❌
    - OPERATEUR_PRODUCTION: ❌
    """
    if user.role != RoleUtilisateur.MANAGER_MAINTENANCE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Manager can modify planning entries",
        )
    return user

def require_historique_consultation(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require consultation permission for historique according to PERMISSIONS_MATRIX.md.
    
    Permissions:
    - ADMINISTRATEUR: ✅ Consultation complète
    - MANAGER_MAINTENANCE: ✅ Consultation complète
    - TECHNICIEN: 👤 Consultation de son historique
    - OPERATEUR_PRODUCTION: ❌
    """
    if user.role == RoleUtilisateur.OPERATEUR_PRODUCTION:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operators cannot consult history",
        )
    return user


def require_dashboard_consultation(
    user: Utilisateur = Depends(get_current_user),
) -> Utilisateur:
    """Require consultation permission for dashboard according to PERMISSIONS_MATRIX.md.
    
    Permissions:
    - ADMINISTRATEUR: ✅ Consultation
    - MANAGER_MAINTENANCE: ✅ Consultation
    - TECHNICIEN: ❌
    - OPERATEUR_PRODUCTION: ❌
    """
    if user.role not in (
        RoleUtilisateur.ADMINISTRATEUR,
        RoleUtilisateur.MANAGER_MAINTENANCE,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Administrators and Managers can consult the dashboard",
        )
    return user