"""Unit tests for Planning module."""

from datetime import datetime, timedelta
from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException

from app.models.enums import RoleUtilisateur, TypeIntervention
from app.schemas.planning import PlanningCreate, PlanningUpdate
from app.services.planning_service import PlanningService


class TestPlanningService:
    """Test PlanningService methods."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.mock_db = MagicMock()
        self.service = PlanningService(self.mock_db)
        
        # Mock repositories
        self.service.planning_repo = MagicMock()
        self.service.intervention_repo = MagicMock()
        self.service.user_repo = MagicMock()
    
    def test_get_planning_with_filters(self):
        """Test get_planning with various filters."""
        # Arrange
        mock_interventions = [MagicMock(), MagicMock()]
        self.service.planning_repo.get_planned_interventions.return_value = mock_interventions
        
        # Act
        result = self.service.get_planning(
            skip=0,
            limit=10,
            date_debut=datetime(2024, 1, 1),
            date_fin=datetime(2024, 1, 31),
            id_technicien=1,
            type_intervention=TypeIntervention.PREVENTIF,
            statut_intervention="planifié"
        )
        
        # Assert
        assert result == mock_interventions
        self.service.planning_repo.get_planned_interventions.assert_called_once_with(
            skip=0,
            limit=10,
            date_debut=datetime(2024, 1, 1),
            date_fin=datetime(2024, 1, 31),
            id_technicien=1,
            type_intervention=TypeIntervention.PREVENTIF,
            statut_intervention="planifié"
        )
    
    def test_get_technicien_planning_technician_not_found(self):
        """Test get_technicien_planning when technician doesn't exist."""
        # Arrange
        self.service.user_repo.get_by_id.return_value = None
        
        # Act & Assert
        with pytest.raises(ValueError, match="Technician with ID 999 not found"):
            self.service.get_technicien_planning(id_technicien=999)
    
    def test_update_planning_entry_not_found(self):
        """Test update when planning entry doesn't exist."""
        # Arrange
        update_data = PlanningUpdate(date_planifiee=datetime(2024, 1, 20, 14, 0))
        self.service.planning_repo.get_intervention_by_id.return_value = None
        
        # Act
        result = self.service.update_planning_entry(999, update_data)
        
        # Assert
        assert result is None
    
    def test_update_planning_entry_not_planning_entry(self):
        """Test update when intervention is not a planning entry."""
        # Arrange
        update_data = PlanningUpdate(date_planifiee=datetime(2024, 1, 20, 14, 0))
        mock_intervention = MagicMock()
        mock_intervention.date_planifiee = None  # Not a planning entry
        mock_intervention.id_technicien = 1
        self.service.planning_repo.get_intervention_by_id.return_value = mock_intervention
        
        # Act & Assert
        with pytest.raises(ValueError, match="Intervention 1 is not a planning entry"):
            self.service.update_planning_entry(1, update_data)
    
    def test_get_planning_entry_success(self):
        """Test successful retrieval of planning entry."""
        # Arrange
        mock_intervention = MagicMock()
        mock_intervention.date_planifiee = datetime(2024, 1, 15, 10, 0)
        mock_intervention.id_technicien = 1
        self.service.planning_repo.get_intervention_by_id.return_value = mock_intervention
        
        # Act
        result = self.service.get_planning_entry(1)
        
        # Assert
        assert result == mock_intervention
    
    def test_get_planning_entry_not_planning(self):
        """Test retrieval when intervention is not a planning entry."""
        # Arrange
        mock_intervention = MagicMock()
        mock_intervention.date_planifiee = None  # Not a planning entry
        mock_intervention.id_technicien = 1
        self.service.planning_repo.get_intervention_by_id.return_value = mock_intervention
        
        # Act
        result = self.service.get_planning_entry(1)
        
        # Assert
        assert result is None
    
    def test_get_technicien_workload(self):
        """Test workload calculation for technician."""
        # Arrange
        date_debut = datetime(2024, 1, 1)
        date_fin = datetime(2024, 1, 7)
        
        # Mock planned interventions count
        self.service.planning_repo.count_planned_interventions_by_technicien.return_value = 2
        
        # Mock interventions list
        mock_intervention1 = MagicMock()
        mock_intervention1.duree_reparation = 60
        mock_intervention1.type = TypeIntervention.PREVENTIF
        
        mock_intervention2 = MagicMock()
        mock_intervention2.duree_reparation = 90
        mock_intervention2.type = TypeIntervention.CURATIF
        
        self.service.planning_repo.get_technicien_planning.return_value = [
            mock_intervention1, mock_intervention2
        ]
        
        # Act
        result = self.service.get_technicien_workload(
            id_technicien=1,
            date_debut=date_debut,
            date_fin=date_fin
        )
        
        # Assert
        assert result["technicien_id"] == 1
        assert result["planned_count"] == 2
        assert result["total_duration_minutes"] == 150
        assert result["interventions_by_type"]["PREVENTIF"] == 1
        assert result["interventions_by_type"]["CURATIF"] == 1
        assert result["avg_daily_interventions"] == pytest.approx(2 / 6)  # 2 interventions over 6 days (Jan 1 to Jan 7 inclusive = 6 days)


class TestPlanningSchemas:
    """Test Planning Pydantic schemas."""
    
    def test_planning_create_schema(self):
        """Test PlanningCreate schema validation."""
        # Valid data
        data = {
            "id_technicien": 1,
            "id_manager": 2,
            "type": "PREVENTIF",
            "date_planifiee": "2024-01-15T10:00:00",
            "statut_intervention": "planifié"
        }
        
        planning_create = PlanningCreate(**data)
        
        assert planning_create.id_technicien == 1
        assert planning_create.id_manager == 2
        assert planning_create.type == TypeIntervention.PREVENTIF
        assert planning_create.statut_intervention == "planifié"
        
        # Test default status
        data_without_status = {
            "id_technicien": 1,
            "id_manager": 2,
            "type": "CURATIF",
            "date_planifiee": "2024-01-15T10:00:00"
        }
        
        planning_create_default = PlanningCreate(**data_without_status)
        assert planning_create_default.statut_intervention == "planifié"
    
    def test_planning_update_schema(self):
        """Test PlanningUpdate schema validation."""
        # Partial update
        data = {
            "date_planifiee": "2024-01-20T14:00:00",
            "duree_reparation": 180
        }
        
        planning_update = PlanningUpdate(**data)
        
        assert planning_update.date_planifiee == datetime(2024, 1, 20, 14, 0)
        assert planning_update.duree_reparation == 180
        assert planning_update.id_technicien is None
        
        # Invalid status
        with pytest.raises(ValueError):
            PlanningUpdate(statut_intervention="invalid_status")


class TestPlanningRBAC:
    """Test planning RBAC permissions."""
    
    def test_require_planning_consultation_allowed_roles(self):
        """Test planning consultation permission for allowed roles."""
        from app.dependencies.rbac import require_planning_consultation
        
        # Test allowed roles
        for role in [
            RoleUtilisateur.ADMINISTRATEUR,
            RoleUtilisateur.MANAGER_MAINTENANCE,
            RoleUtilisateur.TECHNICIEN
        ]:
            mock_user = MagicMock()
            mock_user.role = role
            
            # Should not raise exception
            result = require_planning_consultation(mock_user)
            assert result == mock_user
    
    def test_require_planning_consultation_operator_denied(self):
        """Test planning consultation permission denied for OPERATEUR_PRODUCTION."""
        from app.dependencies.rbac import require_planning_consultation
        
        mock_user = MagicMock()
        mock_user.role = RoleUtilisateur.OPERATEUR_PRODUCTION
        
        with pytest.raises(HTTPException) as exc_info:
            require_planning_consultation(mock_user)
        
        assert exc_info.value.status_code == 403
        assert "Operators cannot consult planning" in exc_info.value.detail
    
    def test_require_planning_creation_only_manager(self):
        """Test planning creation permission only for MANAGER_MAINTENANCE."""
        from app.dependencies.rbac import require_planning_creation
        
        # Manager should be allowed
        mock_manager = MagicMock()
        mock_manager.role = RoleUtilisateur.MANAGER_MAINTENANCE
        result = require_planning_creation(mock_manager)
        assert result == mock_manager
        
        # Other roles should be denied
        for role in [
            RoleUtilisateur.ADMINISTRATEUR,
            RoleUtilisateur.TECHNICIEN,
            RoleUtilisateur.OPERATEUR_PRODUCTION
        ]:
            mock_user = MagicMock()
            mock_user.role = role
            
            with pytest.raises(HTTPException) as exc_info:
                require_planning_creation(mock_user)
            
            assert exc_info.value.status_code == 403
            assert "Only Manager can create planning entries" in exc_info.value.detail
    
    def test_require_planning_modification_only_manager(self):
        """Test planning modification permission only for MANAGER_MAINTENANCE."""
        from app.dependencies.rbac import require_planning_modification
        
        # Manager should be allowed
        mock_manager = MagicMock()
        mock_manager.role = RoleUtilisateur.MANAGER_MAINTENANCE
        result = require_planning_modification(mock_manager)
        assert result == mock_manager
        
        # Other roles should be denied
        for role in [
            RoleUtilisateur.ADMINISTRATEUR,
            RoleUtilisateur.TECHNICIEN,
            RoleUtilisateur.OPERATEUR_PRODUCTION
        ]:
            mock_user = MagicMock()
            mock_user.role = role
            
            with pytest.raises(HTTPException) as exc_info:
                require_planning_modification(mock_user)
            
            assert exc_info.value.status_code == 403
            assert "Only Manager can modify planning entries" in exc_info.value.detail
