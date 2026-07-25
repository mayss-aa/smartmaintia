"""Service layer for the HistoriqueGlobal entity."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.enums import RoleUtilisateur
from app.models.user import Utilisateur
from app.repositories.historique_repository import HistoriqueRepository


class HistoriqueService:
    """Business logic for global history records."""

    def __init__(self, db: Session) -> None:
        self._historique_repo = HistoriqueRepository(db)

    def list_historiques(self, user: Utilisateur, skip: int = 0, limit: int = 100) -> list:
        """Return paginated list of global history records filtered by user role."""
        if user.role in (RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MANAGER_MAINTENANCE):
            # Admins and Managers can see all history
            return self._historique_repo.list(skip, limit)
        elif user.role == RoleUtilisateur.TECHNICIEN:
            # Technicians can only see history for interventions assigned to them
            return self._historique_repo.list_for_technicien(user.id_user, skip, limit)
        else:
            # Should not reach here (Operators blocked by RBAC dependency)
            return []

    def get_historique(self, id_historique: int, user: Utilisateur):
        """Return a history record by its id, filtered by user role."""
        if user.role in (RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MANAGER_MAINTENANCE):
            # Admins and Managers can see any history record
            return self._historique_repo.get_by_id(id_historique)
        elif user.role == RoleUtilisateur.TECHNICIEN:
            # Technicians can only see history records for interventions assigned to them
            return self._historique_repo.get_by_id_for_technicien(id_historique, user.id_user)
        else:
            # Should not reach here (Operators blocked by RBAC dependency)
            return None


def get_historique_service(
    db: Annotated[Session, Depends(get_db)],
) -> HistoriqueService:
    """Dependency for obtaining an HistoriqueService instance."""
    return HistoriqueService(db)