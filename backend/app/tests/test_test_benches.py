"""Tests for test bench management endpoints."""

import pytest
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.enums import RoleUtilisateur
from app.models.test_bench import BancTestBDD
from app.models.user import Utilisateur


class TestTestBenchManagement:
    """Test suite for test bench CRUD operations."""

    @pytest.fixture
    def admin_user(self, db_session: Session) -> Utilisateur:
        """Create an admin user for testing."""
        user = Utilisateur(
            nom="Admin",
            prenom="TestBench",
            email="admin_banc@test.com",
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
            prenom="TestBench",
            email="manager_banc@test.com",
            mot_de_passe_hash=hash_password("password123"),
            role=RoleUtilisateur.MANAGER_MAINTENANCE,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    @pytest.fixture
    def technician_user(self, db_session: Session) -> Utilisateur:
        """Create a technician user for testing."""
        user = Utilisateur(
            nom="Technician",
            prenom="TestBench",
            email="technician_banc@test.com",
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
            prenom="TestBench",
            email="operator_banc@test.com",
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
            code_banc="TEST-BANC-001",
            nom="Banc de test principal",
            emplacement="Atelier A",
            statut="OPERATIONNEL",
        )
        db_session.add(banc)
        db_session.commit()
        db_session.refresh(banc)
        return banc

    def get_auth_token(self, client: TestClient, email: str, password: str) -> str:
        """Helper to get authentication token."""
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": password},
        )
        assert login_response.status_code == status.HTTP_200_OK
        return login_response.json()["access_token"]

    def test_list_test_benches_all_roles_can_view(
        self, client, admin_user, manager_user, technician_user, operator_user
    ):
        """Test that all roles can list test benches."""
        # Test each role
        for user_fixture in [admin_user, manager_user, technician_user, operator_user]:
            token = self.get_auth_token(
                client, user_fixture.email, "password123"
            )
            
            response = client.get(
                "/api/v1/bancs/",
                headers={"Authorization": f"Bearer {token}"},
            )
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert isinstance(data, list)

    def test_create_test_bench_admin_only(
        self, client, admin_user, manager_user, technician_user, operator_user
    ):
        """Test that only ADMINISTRATEUR can create test benches."""
        banc_data = {
            "code_banc": "NEW-BANC-001",
            "nom": "Nouveau banc de test",
            "emplacement": "Atelier B",
            "statut": "OPERATIONNEL",
        }
        
        # Admin should succeed
        admin_token = self.get_auth_token(client, admin_user.email, "password123")
        response = client.post(
            "/api/v1/bancs/",
            json=banc_data,
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["code_banc"] == "NEW-BANC-001"
        
        # Other roles should fail
        for user_fixture, role_name in [
            (manager_user, "MANAGER_MAINTENANCE"),
            (technician_user, "TECHNICIEN"),
            (operator_user, "OPERATEUR_PRODUCTION"),
        ]:
            token = self.get_auth_token(client, user_fixture.email, "password123")
            response = client.post(
                "/api/v1/bancs/",
                json=banc_data,
                headers={"Authorization": f"Bearer {token}"},
            )
            assert response.status_code == status.HTTP_403_FORBIDDEN
            assert "Administrator role required" in response.json()["detail"]

    def test_get_test_bench_by_code_all_roles_can_view(
        self, client, test_banc, admin_user, manager_user, technician_user, operator_user
    ):
        """Test that all roles can view a specific test bench."""
        # Test each role
        for user_fixture in [admin_user, manager_user, technician_user, operator_user]:
            token = self.get_auth_token(
                client, user_fixture.email, "password123"
            )
            
            response = client.get(
                f"/api/v1/bancs/{test_banc.code_banc}",
                headers={"Authorization": f"Bearer {token}"},
            )
            assert response.status_code == status.HTTP_200_OK
            data = response.json()
            assert data["code_banc"] == test_banc.code_banc
            assert data["nom"] == test_banc.nom

    def test_get_test_bench_not_found(self, client, admin_user):
        """Test getting a non-existent test bench."""
        token = self.get_auth_token(client, admin_user.email, "password123")
        
        response = client.get(
            "/api/v1/bancs/NONEXISTENT",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_test_bench_admin_only(
        self, client, test_banc, admin_user, manager_user
    ):
        """Test that only ADMINISTRATEUR can update test benches."""
        update_data = {
            "nom": "Banc modifié",
            "emplacement": "Atelier modifié",
            "statut": "EN_MAINTENANCE",
        }
        
        # Admin should succeed
        admin_token = self.get_auth_token(client, admin_user.email, "password123")
        response = client.put(
            f"/api/v1/bancs/{test_banc.code_banc}",
            json=update_data,
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["nom"] == "Banc modifié"
        assert data["statut"] == "EN_MAINTENANCE"
        
        # Manager should fail
        manager_token = self.get_auth_token(client, manager_user.email, "password123")
        response = client.put(
            f"/api/v1/bancs/{test_banc.code_banc}",
            json=update_data,
            headers={"Authorization": f"Bearer {manager_token}"},
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_test_bench_admin_only(
        self, client, db_session, admin_user, manager_user
    ):
        """Test that only ADMINISTRATEUR can delete test benches."""
        # Create a test bench to delete
        banc = BancTestBDD(
            code_banc="DELETE-BANC",
            nom="Banc à supprimer",
            emplacement="Atelier X",
            statut="OPERATIONNEL",
        )
        db_session.add(banc)
        db_session.commit()
        
        # Admin should succeed
        admin_token = self.get_auth_token(client, admin_user.email, "password123")
        response = client.delete(
            "/api/v1/bancs/DELETE-BANC",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify it's deleted
        response = client.get(
            "/api/v1/bancs/DELETE-BANC",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND
        
        # Create another test bench for manager test
        banc2 = BancTestBDD(
            code_banc="DELETE-BANC-2",
            nom="Banc à supprimer 2",
            emplacement="Atelier Y",
            statut="OPERATIONNEL",
        )
        db_session.add(banc2)
        db_session.commit()
        
        # Manager should fail
        manager_token = self.get_auth_token(client, manager_user.email, "password123")
        response = client.delete(
            "/api/v1/bancs/DELETE-BANC-2",
            headers={"Authorization": f"Bearer {manager_token}"},
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_duplicate_test_bench_code(
        self, client, test_banc, admin_user
    ):
        """Test that creating a banc with duplicate code fails."""
        banc_data = {
            "code_banc": test_banc.code_banc,  # Duplicate code
            "nom": "Autre banc",
            "emplacement": "Atelier différent",
            "statut": "OPERATIONNEL",
        }
        
        token = self.get_auth_token(client, admin_user.email, "password123")
        response = client.post(
            "/api/v1/bancs/",
            json=banc_data,
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already exists" in response.json()["detail"]

    def test_pagination(self, client, admin_user):
        """Test pagination parameters."""
        token = self.get_auth_token(client, admin_user.email, "password123")
        
        # Test with custom pagination
        response = client.get(
            "/api/v1/bancs/?skip=0&limit=5",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        
        # Test invalid parameters should be validated
        response = client.get(
            "/api/v1/bancs/?skip=-1",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
