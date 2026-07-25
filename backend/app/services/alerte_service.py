"""Service layer for the ``AlertePredictive`` entity (see API_SPECIFICATION.md / RBAC.md)."""

from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import Utilisateur
from app.repositories.alerte_repository import AlerteRepository
from app.schemas.alerte import AlertePredictiveCreate, AlertePredictiveUpdate


class AlerteService:
    """Service for AlertePredictive operations."""

    def __init__(self, session: Session):
        self.repository = AlerteRepository(session)

    def get_alerte(self, id_alerte: int, current_user: Utilisateur) -> Optional["AlertePredictive"]:
        """Get a single AlertePredictive by id_alerte."""
        # RBAC check: Only Administrateur and Manager can consult alerts
        from app.models.enums import RoleUtilisateur
        
        if current_user.role not in [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MANAGER_MAINTENANCE]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to view alerts"
            )
        
        alerte = self.repository.get(id_alerte)
        if not alerte:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"AlertePredictive with id_alerte={id_alerte} not found"
            )
        
        return alerte

    def list_alertes(self, current_user: Utilisateur) -> List["AlertePredictive"]:
        """Get all AlertePredictive records."""
        # RBAC check: Only Administrateur and Manager can consult alerts
        from app.models.enums import RoleUtilisateur
        
        if current_user.role not in [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MANAGER_MAINTENANCE]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to view alerts"
            )
        
        return self.repository.list()

    def create_alerte(self, alerte_data: AlertePredictiveCreate, current_user: Utilisateur) -> "AlertePredictive":
        """Create a new AlertePredictive."""
        # RBAC check: Only Administrateur can create alerts (based on PERMISSIONS_MATRIX.md)
        from app.models.enums import RoleUtilisateur
        
        if current_user.role != RoleUtilisateur.ADMINISTRATEUR:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to create alerts"
            )
        
        from app.models.alerte import AlertePredictive
        alerte = AlertePredictive(
            code_banc=alerte_data.code_banc,
            composant_cible=alerte_data.composant_cible,
            probabilite_panne=alerte_data.probabilite_panne,
            date_detection=alerte_data.date_detection,
            statut_alerte=alerte_data.statut_alerte,
        )
        
        return self.repository.create(alerte)

    def update_alerte(
        self, id_alerte: int, alerte_data: AlertePredictiveUpdate, current_user: Utilisateur
    ) -> Optional["AlertePredictive"]:
        """Update an existing AlertePredictive."""
        # RBAC check: Only Administrateur can update alerts (based on PERMISSIONS_MATRIX.md)
        from app.models.enums import RoleUtilisateur
        
        if current_user.role != RoleUtilisateur.ADMINISTRATEUR:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to update alerts"
            )
        
        alerte = self.repository.get(id_alerte)
        if not alerte:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"AlertePredictive with id_alerte={id_alerte} not found"
            )
        
        # Update only provided fields
        for field, value in alerte_data.model_dump(exclude_unset=True).items():
            setattr(alerte, field, value)
        
        return self.repository.update(alerte)

    def delete_alerte(self, id_alerte: int, current_user: Utilisateur) -> None:
        """Delete an AlertePredictive."""
        # RBAC check: Only Administrateur can delete alerts (based on PERMISSIONS_MATRIX.md)
        from app.models.enums import RoleUtilisateur
        
        if current_user.role != RoleUtilisateur.ADMINISTRATEUR:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to delete alerts"
            )
        
        alerte = self.repository.get(id_alerte)
        if not alerte:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"AlertePredictive with id_alerte={id_alerte} not found"
            )
        
        self.repository.delete(alerte)