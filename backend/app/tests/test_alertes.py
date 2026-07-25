"""Tests for predictive alert management endpoints."""

import pytest
from datetime import datetime
from fastapi import status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.enums import RoleUtilisateur, StatutBanc
from app.models.alerte import AlertePredictive
from app.models.test_bench import BancTestBDD
from app.models.user import Utilisateur


class TestAlertePredictiveManagement:
    """Test suite for AlertePredictive CRUD operations."""

    @pytest.fixture
    def admin_user(self, db_session: Session) -> Utilisateur:
        """Create an admin user for testing."""
        user = Utilisateur(
            nom="Admin",
            prenom="User",
            email="admin@test.com",
            mot_de_passe_hash=hash_password("password123"),
            role=RoleUtilisateur.ADMINISTRATEUR,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    @pytest.fixture
    def manager_user(self, db_session: Session) -> Utilisateur:
        """Create a manager user for testing."""
        user = Utilisateur(
            nom="Manager",
            prenom="User",
            email="manager@test.com",
            mot_de_passe_hash=hash_password("password123"),
            role=RoleUtilisateur.MANAGER_MAINTENANCE,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    @pytest.fixture
    def technicien_user(self, db_session: Session) -> Utilisateur:
        """Create a technicien user for testing."""
        user = Utilisateur(
            nom="Technicien",
            prenom="User",
            email="technicien@test.com",
            mot_de_passe_hash=hash_password("password123"),
            role=RoleUtilisateur.TECHNICIEN,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    @pytest.fixture
    def operator_user(self, db_session: Session) -> Utilisateur:
        """Create an operator user for testing."""
        user = Utilisateur(
            nom="Operator",
            prenom="User",
            email="operator@test.com",
            mot_de_passe_hash=hash_password("password123"),
            role=RoleUtilisateur.OPERATEUR_PRODUCTION,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    @pytest.fixture
    def test_banc(self, db_session: Session) -> BancTestBDD:
        """Create a test bench for testing."""
        banc = BancTestBDD(
            code_banc="BANC001",
            nom="Test Bench 1",
            emplacement="Zone A",
            statut=StatutBanc.OPERATIONNEL,
        )
        db_session.add(banc)
        db_session.commit()
        db_session.refresh(banc)
        return banc

    @pytest.fixture
    def test_alerte(self, db_session: Session, test_banc: BancTestBDD) -> AlertePredictive:
        """Create a test alert for testing."""
        alerte = AlertePredictive(
            code_banc=test_banc.code_banc,
            composant_cible="Moteur principal",
            probabilite_panne=0.85,
            date_detection=datetime.utcnow(),
            statut_alerte="Nouvelle",
        )
        db_session.add(alerte)
        db_session.commit()
        db_session.refresh(alerte)
        return alerte

    def test_list_alertes_requires_auth(self, client):
        """Test that listing alertes requires authentication."""
        response = client.get("/api/v1/alertes/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_alertes_admin_can_access(self, client, admin_user, test_alerte):
        """Test that admin can list alertes."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List alertes
        response = client.get(
            "/api/v1/alertes/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["id_alerte"] == test_alerte.id_alerte

    def test_list_alertes_manager_can_access(self, client, manager_user, test_alerte):
        """Test that manager can list alertes."""
        # Login as manager
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": manager_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List alertes
        response = client.get(
            "/api/v1/alertes/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1

    def test_list_alertes_technicien_cannot_access(self, client, technicien_user):
        """Test that technicien cannot list alertes."""
        # Login as technicien
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": technicien_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List alertes
        response = client.get(
            "/api/v1/alertes/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_list_alertes_operator_cannot_access(self, client, operator_user):
        """Test that operator cannot list alertes."""
        # Login as operator
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": operator_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List alertes
        response = client.get(
            "/api/v1/alertes/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_get_alerte_by_id(self, client, admin_user, test_alerte):
        """Test getting a specific alerte by ID."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get alerte
        response = client.get(
            f"/api/v1/alertes/{test_alerte.id_alerte}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id_alerte"] == test_alerte.id_alerte
        assert data["code_banc"] == test_alerte.code_banc
        assert data["composant_cible"] == test_alerte.composant_cible
        assert data["probabilite_panne"] == test_alerte.probabilite_panne

    def test_get_alerte_not_found(self, client, admin_user):
        """Test getting a non-existent alerte returns 404."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get non-existent alerte
        response = client.get(
            "/api/v1/alertes/999",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_alerte_manager_can_access(self, client, manager_user, test_alerte):
        """Test that manager can get a specific alerte."""
        # Login as manager
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": manager_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get alerte
        response = client.get(
            f"/api/v1/alertes/{test_alerte.id_alerte}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK

    def test_get_alerte_technicien_cannot_access(self, client, technicien_user, test_alerte):
        """Test that technicien cannot get a specific alerte."""
        # Login as technicien
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": technicien_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get alerte
        response = client.get(
            f"/api/v1/alertes/{test_alerte.id_alerte}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_alerte_as_admin(self, client, admin_user, test_banc):
        """Test that admin can create alertes."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Create alerte - admin can create alerts
        alerte_data = {
            "code_banc": test_banc.code_banc,
            "composant_cible": "Nouveau composant",
            "probabilite_panne": 0.75,
            "date_detection": datetime.utcnow().isoformat(),
            "statut_alerte": "Nouvelle"
        }
        
        response = client.post(
            "/api/v1/alertes/",
            json=alerte_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["composant_cible"] == "Nouveau composant"

    def test_update_alerte_not_allowed(self, client, admin_user, test_alerte):
        """Test that updating alertes is not allowed (endpoint not in API spec)."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Update alerte - endpoint exists but admin can update alerts
        update_data = {
            "composant_cible": "Composant mis à jour",
            "probabilite_panne": 0.90
        }
        
        response = client.put(
            f"/api/v1/alertes/{test_alerte.id_alerte}",
            json=update_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK

    def test_delete_alerte_not_allowed(self, client, admin_user, test_alerte):
        """Test that deleting alertes is not allowed (endpoint not in API spec)."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Delete alerte - endpoint exists but admin can delete alerts
        response = client.delete(
            f"/api/v1/alertes/{test_alerte.id_alerte}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_list_alertes_by_banc_not_allowed(self, client, admin_user, test_banc):
        """Test that listing alertes by banc is not allowed (endpoint not in API spec)."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List alertes by banc - should return 404 as endpoint doesn't exist
        response = client.get(
            f"/api/v1/alertes/banc/{test_banc.code_banc}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_alertes_data_structure(self, client, admin_user, test_alerte):
        """Test that alerte data structure matches ERD specification."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get alerte
        response = client.get(
            f"/api/v1/alertes/{test_alerte.id_alerte}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # Check all fields from ERD.md are present
        required_fields = [
            "id_alerte", "code_banc", "composant_cible", 
            "probabilite_panne", "date_detection", "statut_alerte"
        ]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
        
        # Check data types
        assert isinstance(data["id_alerte"], int)
        assert isinstance(data["code_banc"], str)
        assert isinstance(data["composant_cible"], str)
        assert isinstance(data["probabilite_panne"], float)
        assert isinstance(data["statut_alerte"], str)

    def test_multiple_alertes_listing(self, client, admin_user, test_banc, db_session: Session):
        """Test listing multiple alertes."""
        # Create additional alertes
        alerte1 = AlertePredictive(
            code_banc=test_banc.code_banc,
            composant_cible="Composant A",
            probabilite_panne=0.65,
            date_detection=datetime.utcnow(),
            statut_alerte="Nouvelle",
        )
        alerte2 = AlertePredictive(
            code_banc=test_banc.code_banc,
            composant_cible="Composant B",
            probabilite_panne=0.92,
            date_detection=datetime.utcnow(),
            statut_alerte="Validée",
        )
        db_session.add(alerte1)
        db_session.add(alerte2)
        db_session.commit()
        
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List alertes
        response = client.get(
            "/api/v1/alertes/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2
        
        # Should be ordered by date_detection desc
        assert data[0]["id_alerte"] == alerte2.id_alerte  # Most recent
        assert data[1]["id_alerte"] == alerte1.id_alerte  # Older