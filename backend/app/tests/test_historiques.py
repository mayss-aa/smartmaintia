"""Tests for historique management endpoints."""

import pytest
from datetime import datetime, timedelta
from fastapi import status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.enums import RoleUtilisateur, StatutBanc, TypeIntervention
from app.models.historique import HistoriqueGlobal
from app.models.intervention import Intervention
from app.models.test_bench import BancTestBDD
from app.models.ticket import TicketMaintenance
from app.models.user import Utilisateur


class TestHistoriqueManagement:
    """Test suite for historique CRUD operations."""

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
    def other_technicien_user(self, db_session: Session) -> Utilisateur:
        """Create another technicien user for testing."""
        user = Utilisateur(
            nom="Other",
            prenom="Technicien",
            email="other_technicien@test.com",
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
    def test_ticket(self, db_session: Session, test_banc: BancTestBDD, technicien_user: Utilisateur) -> TicketMaintenance:
        """Create a test ticket for testing."""
        ticket = TicketMaintenance(
            id_user=technicien_user.id_user,
            code_banc=test_banc.code_banc,
            symptome="Temperature too high",
            criticite="High",
            date_creation=datetime.utcnow(),
            statut="OUVERT",
        )
        db_session.add(ticket)
        db_session.commit()
        db_session.refresh(ticket)
        return ticket

    @pytest.fixture
    def test_intervention(self, db_session: Session, test_ticket: TicketMaintenance, 
                         manager_user: Utilisateur, technicien_user: Utilisateur) -> Intervention:
        """Create a test intervention for testing."""
        intervention = Intervention(
            id_technicien=technicien_user.id_user,
            id_manager=manager_user.id_user,
            id_ticket=test_ticket.id_ticket,
            type=TypeIntervention.CURATIF,
            date_planifiee=datetime.utcnow() + timedelta(days=1),
            statut_intervention="planifiee",
        )
        db_session.add(intervention)
        db_session.commit()
        db_session.refresh(intervention)
        return intervention

    @pytest.fixture
    def test_historique(self, db_session: Session, test_banc: BancTestBDD, 
                       test_intervention: Intervention) -> HistoriqueGlobal:
        """Create a test historique for testing."""
        historique = HistoriqueGlobal(
            code_banc=test_banc.code_banc,
            id_intervention=test_intervention.id_intervention,
            type_action="Maintenance corrective",
            rapport_clean_ia="Rapport généré par IA: La maintenance a été effectuée avec succès.",
            date_cloture=datetime.utcnow(),
            mttr_calcule=120,  # 2 hours
        )
        db_session.add(historique)
        db_session.commit()
        db_session.refresh(historique)
        return historique

    def test_list_historiques_requires_auth(self, client):
        """Test that listing historiques requires authentication."""
        response = client.get("/api/v1/historiques/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_historiques_admin_can_access(self, client, admin_user, test_historique):
        """Test that admin can list historiques."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List historiques
        response = client.get(
            "/api/v1/historiques/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["id_historique"] == test_historique.id_historique

    def test_list_historiques_manager_can_access(self, client, manager_user, test_historique):
        """Test that manager can list historiques."""
        # Login as manager
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": manager_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List historiques
        response = client.get(
            "/api/v1/historiques/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK

    def test_list_historiques_technicien_can_access(self, client, technicien_user, test_historique):
        """Test that technicien can list historiques."""
        # Login as technicien
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": technicien_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List historiques
        response = client.get(
            "/api/v1/historiques/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK

    def test_list_historiques_operator_cannot_access(self, client, operator_user):
        """Test that operator cannot list historiques."""
        # Login as operator
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": operator_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List historiques
        response = client.get(
            "/api/v1/historiques/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_get_historique_by_id(self, client, admin_user, test_historique):
        """Test getting a specific historique by ID."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get historique
        response = client.get(
            f"/api/v1/historiques/{test_historique.id_historique}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id_historique"] == test_historique.id_historique
        assert data["code_banc"] == test_historique.code_banc

    def test_get_historique_not_found(self, client, admin_user):
        """Test getting a non-existent historique returns 404."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get non-existent historique
        response = client.get(
            "/api/v1/historiques/999",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_list_historiques_by_banc_not_allowed(self, client, admin_user, test_banc):
        """Test that listing historiques by banc is not allowed (endpoint not in API spec)."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List historiques by banc - should return 404 as endpoint doesn't exist
        response = client.get(
            f"/api/v1/historiques/banc/{test_banc.code_banc}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_list_historiques_by_intervention_not_allowed(self, client, admin_user, test_intervention):
        """Test that listing historiques by intervention is not allowed (endpoint not in API spec)."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List historiques by intervention - should return 404 as endpoint doesn't exist
        response = client.get(
            f"/api/v1/historiques/intervention/{test_intervention.id_intervention}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_create_historique_not_allowed(self, client, admin_user, test_banc, test_intervention):
        """Test that creating historiques is not allowed (endpoint not in API spec)."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Create historique - should return 405 as POST method not allowed
        historique_data = {
            "code_banc": test_banc.code_banc,
            "id_intervention": test_intervention.id_intervention,
            "type_action": "Maintenance préventive",
            "rapport_clean_ia": "Nouveau rapport généré par IA",
            "date_cloture": datetime.utcnow().isoformat(),
            "mttr_calcule": 90
        }
        
        response = client.post(
            "/api/v1/historiques/",
            json=historique_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_update_historique_not_allowed(self, client, admin_user, test_historique):
        """Test that updating historiques is not allowed (endpoint not in API spec)."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Update historique - should return 405 as PUT method not allowed
        update_data = {
            "type_action": "Maintenance mise à jour",
            "mttr_calcule": 150
        }
        
        response = client.put(
            f"/api/v1/historiques/{test_historique.id_historique}",
            json=update_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_delete_historique_not_allowed(self, client, admin_user, test_historique):
        """Test that deleting historiques is not allowed (endpoint not in API spec)."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Delete historique - should return 405 as DELETE method not allowed
        response = client.delete(
            f"/api/v1/historiques/{test_historique.id_historique}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_technicien_sees_only_own_intervention_history(self, client, db_session, technicien_user, manager_user, test_banc):
        """Test that technician can only see history for interventions assigned to them."""
        # Create two interventions - one for this technician, one for another technician
        # First create another technician
        other_technicien = Utilisateur(
            nom="Other",
            prenom="Technicien",
            email="other_technicien@test.com",
            mot_de_passe_hash=hash_password("password123"),
            role=RoleUtilisateur.TECHNICIEN,
        )
        db_session.add(other_technicien)
        db_session.commit()
        
        # Create a ticket for the interventions
        ticket = TicketMaintenance(
            id_user=technicien_user.id_user,
            code_banc=test_banc.code_banc,
            symptome="Test symptom",
            criticite="Medium",
            date_creation=datetime.utcnow(),
            statut="OUVERT",
        )
        db_session.add(ticket)
        db_session.commit()
        
        # Create intervention assigned to current technician
        intervention1 = Intervention(
            id_technicien=technicien_user.id_user,
            id_manager=manager_user.id_user,
            id_ticket=ticket.id_ticket,
            type=TypeIntervention.CURATIF,
            date_planifiee=datetime.utcnow() + timedelta(days=1),
            statut_intervention="terminee",
        )
        db_session.add(intervention1)
        db_session.commit()
        
        # Create intervention assigned to other technician
        intervention2 = Intervention(
            id_technicien=other_technicien.id_user,
            id_manager=manager_user.id_user,
            id_ticket=ticket.id_ticket,
            type=TypeIntervention.CURATIF,
            date_planifiee=datetime.utcnow() + timedelta(days=2),
            statut_intervention="terminee",
        )
        db_session.add(intervention2)
        db_session.commit()
        
        # Create historique for intervention1 (assigned to current technician)
        historique1 = HistoriqueGlobal(
            code_banc=test_banc.code_banc,
            id_intervention=intervention1.id_intervention,
            type_action="Maintenance corrective",
            rapport_clean_ia="Rapport pour intervention 1",
            date_cloture=datetime.utcnow(),
            mttr_calcule=120,
        )
        db_session.add(historique1)
        
        # Create historique for intervention2 (assigned to other technician)
        historique2 = HistoriqueGlobal(
            code_banc=test_banc.code_banc,
            id_intervention=intervention2.id_intervention,
            type_action="Maintenance corrective",
            rapport_clean_ia="Rapport pour intervention 2",
            date_cloture=datetime.utcnow(),
            mttr_calcule=180,
        )
        db_session.add(historique2)
        db_session.commit()
        
        # Login as current technician
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": technicien_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # List historiques as technician
        response = client.get(
            "/api/v1/historiques/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        # Should only see historique for intervention1 (assigned to this technician)
        assert len(data) == 1
        assert data[0]["id_historique"] == historique1.id_historique
        assert data[0]["id_intervention"] == intervention1.id_intervention
    
    def test_technicien_cannot_access_other_technicien_history(self, client, db_session, technicien_user, other_technicien_user, manager_user, test_banc, test_ticket):
        """Test that technician cannot access history for interventions assigned to another technician."""
        # Create intervention assigned to other technician
        intervention = Intervention(
            id_technicien=other_technicien_user.id_user,
            id_manager=manager_user.id_user,
            id_ticket=test_ticket.id_ticket,
            type=TypeIntervention.CURATIF,
            date_planifiee=datetime.utcnow() + timedelta(days=1),
            statut_intervention="terminee",
        )
        db_session.add(intervention)
        db_session.commit()
        
        # Create historique for this intervention
        historique = HistoriqueGlobal(
            code_banc=test_banc.code_banc,
            id_intervention=intervention.id_intervention,
            type_action="Maintenance corrective",
            rapport_clean_ia="Rapport pour autre technicien",
            date_cloture=datetime.utcnow(),
            mttr_calcule=150,
        )
        db_session.add(historique)
        db_session.commit()
        
        # Login as current technician (not assigned to this intervention)
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": technicien_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Try to get historique by ID (should not have access)
        response = client.get(
            f"/api/v1/historiques/{historique.id_historique}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_admin_and_manager_can_see_all_history(self, client, db_session, admin_user, manager_user, technicien_user, other_technicien_user, test_banc, test_ticket):
        """Test that admin and manager can see all history regardless of technician assignment."""
        # Create interventions for different technicians
        intervention1 = Intervention(
            id_technicien=technicien_user.id_user,
            id_manager=manager_user.id_user,
            id_ticket=test_ticket.id_ticket,
            type=TypeIntervention.CURATIF,
            date_planifiee=datetime.utcnow() + timedelta(days=1),
            statut_intervention="terminee",
        )
        intervention2 = Intervention(
            id_technicien=other_technicien_user.id_user,
            id_manager=manager_user.id_user,
            id_ticket=test_ticket.id_ticket,
            type=TypeIntervention.CURATIF,
            date_planifiee=datetime.utcnow() + timedelta(days=2),
            statut_intervention="terminee",
        )
        db_session.add(intervention1)
        db_session.add(intervention2)
        db_session.commit()
        
        # Create historiques for both interventions
        historique1 = HistoriqueGlobal(
            code_banc=test_banc.code_banc,
            id_intervention=intervention1.id_intervention,
            type_action="Maintenance corrective 1",
            rapport_clean_ia="Rapport 1",
            date_cloture=datetime.utcnow(),
            mttr_calcule=120,
        )
        historique2 = HistoriqueGlobal(
            code_banc=test_banc.code_banc,
            id_intervention=intervention2.id_intervention,
            type_action="Maintenance corrective 2",
            rapport_clean_ia="Rapport 2",
            date_cloture=datetime.utcnow(),
            mttr_calcule=180,
        )
        db_session.add(historique1)
        db_session.add(historique2)
        db_session.commit()
        
        # Test as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        admin_token = login_response.json()["access_token"]
        
        response = client.get(
            "/api/v1/historiques/",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2  # Admin can see both
        
        # Test as manager
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": manager_user.email, "password": "password123"}
        )
        manager_token = login_response.json()["access_token"]
        
        response = client.get(
            "/api/v1/historiques/",
            headers={"Authorization": f"Bearer {manager_token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2  # Manager can see both