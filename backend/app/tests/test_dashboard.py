"""Tests for Dashboard aggregation endpoints (see API_SPECIFICATION.md)."""

import pytest
from datetime import datetime, timedelta
from fastapi import status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.enums import RoleUtilisateur, StatutBanc, StatutTicket, TypeIntervention
from app.models.alerte import AlertePredictive
from app.models.historique import HistoriqueGlobal
from app.models.intervention import Intervention
from app.models.test_bench import BancTestBDD
from app.models.ticket import TicketMaintenance
from app.models.user import Utilisateur


class TestDashboardAggregation:
    """Test suite for Dashboard GET /dashboard endpoint."""

    @pytest.fixture
    def admin_user(self, db_session: Session) -> Utilisateur:
        """Create an admin user for testing."""
        user = Utilisateur(
            nom="Admin",
            prenom="Dashboard",
            email="admin.dashboard@test.com",
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
            prenom="Dashboard",
            email="manager.dashboard@test.com",
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
            prenom="Dashboard",
            email="technicien.dashboard@test.com",
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
            prenom="Dashboard",
            email="operator.dashboard@test.com",
            mot_de_passe_hash=hash_password("password123"),
            role=RoleUtilisateur.OPERATEUR_PRODUCTION,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    @pytest.fixture
    def test_users(self, db_session: Session) -> list[Utilisateur]:
        """Create users for all roles for testing."""
        users = []
        roles = [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MANAGER_MAINTENANCE,
                RoleUtilisateur.TECHNICIEN, RoleUtilisateur.OPERATEUR_PRODUCTION]
        
        for i, role in enumerate(roles):
            user = Utilisateur(
                nom=f"Test{role.name}",
                prenom=f"User{i}",
                email=f"{role.name.lower()}.dashboard{i}@test.com",
                mot_de_passe_hash=hash_password("password123"),
                role=role,
            )
            db_session.add(user)
            users.append(user)
        
        db_session.commit()
        for user in users:
            db_session.refresh(user)
        return users

    @pytest.fixture
    def test_bancs(self, db_session: Session) -> list[BancTestBDD]:
        """Create test benches with different statuses for testing."""
        bancs = []
        statuses = [StatutBanc.OPERATIONNEL, StatutBanc.EN_PANNE, StatutBanc.EN_MAINTENANCE]
        
        for i, status in enumerate(statuses):
            banc = BancTestBDD(
                code_banc=f"DASHBANC{i:03d}",
                nom=f"Dashboard Test Bench {i}",
                emplacement=f"Zone {chr(65+i)}",
                statut=status,
            )
            db_session.add(banc)
            bancs.append(banc)
        
        db_session.commit()
        for banc in bancs:
            db_session.refresh(banc)
        return bancs

    @pytest.fixture
    def test_tickets(self, db_session: Session, test_bancs: list[BancTestBDD], test_users: list[Utilisateur]) -> list[TicketMaintenance]:
        """Create test tickets with different statuses for testing."""
        tickets = []
        statuses = [StatutTicket.OUVERT, StatutTicket.EN_COURS, StatutTicket.CLOTURE]
        
        for i, status in enumerate(statuses):
            ticket = TicketMaintenance(
                id_user=test_users[0].id_user,
                code_banc=test_bancs[i % len(test_bancs)].code_banc,
                symptome=f"Symptom {i} for dashboard testing",
                criticite="High" if i % 2 == 0 else "Medium",
                date_creation=datetime.utcnow() - timedelta(days=i),
                statut=status,
            )
            db_session.add(ticket)
            tickets.append(ticket)
        
        db_session.commit()
        for ticket in tickets:
            db_session.refresh(ticket)
        return tickets

    @pytest.fixture
    def test_interventions(self, db_session: Session, test_tickets: list[TicketMaintenance], 
                          test_users: list[Utilisateur]) -> list[Intervention]:
        """Create test interventions for testing."""
        interventions = []
        
        # Find technicien and manager users
        technicien = next(u for u in test_users if u.role == RoleUtilisateur.TECHNICIEN)
        manager = next(u for u in test_users if u.role == RoleUtilisateur.MANAGER_MAINTENANCE)
        
        for i in range(3):
            intervention = Intervention(
                id_technicien=technicien.id_user,
                id_manager=manager.id_user,
                id_ticket=test_tickets[i].id_ticket,
                type=TypeIntervention.CURATIF,
                date_planifiee=datetime.utcnow() + timedelta(days=i+1),
                duree_reparation=120,
                statut_intervention="Planifiée",
            )
            db_session.add(intervention)
            interventions.append(intervention)
        
        db_session.commit()
        for intervention in interventions:
            db_session.refresh(intervention)
        return interventions

    @pytest.fixture
    def test_alertes(self, db_session: Session, test_bancs: list[BancTestBDD]) -> list[AlertePredictive]:
        """Create test predictive alerts for testing."""
        alertes = []
        
        for i in range(2):
            alerte = AlertePredictive(
                code_banc=test_bancs[i].code_banc,
                composant_cible=f"Component {i}",
                probabilite_panne=0.85 - (i * 0.1),
                date_detection=datetime.utcnow() - timedelta(hours=i),
                statut_alerte="Nouvelle",
            )
            db_session.add(alerte)
            alertes.append(alerte)
        
        db_session.commit()
        for alerte in alertes:
            db_session.refresh(alerte)
        return alertes

    @pytest.fixture
    def test_historiques(self, db_session: Session, test_interventions: list[Intervention], 
                        test_bancs: list[BancTestBDD]) -> list[HistoriqueGlobal]:
        """Create test history records for testing."""
        historiques = []
        
        for i, intervention in enumerate(test_interventions):
            historique = HistoriqueGlobal(
                code_banc=test_bancs[i % len(test_bancs)].code_banc,
                id_intervention=intervention.id_intervention,
                type_action="Réparation",
                rapport_clean_ia=f"Rapport IA pour intervention {intervention.id_intervention}",
                date_cloture=datetime.utcnow() - timedelta(days=2),
                mttr_calcule=95 + i*10,
            )
            db_session.add(historique)
            historiques.append(historique)
        
        db_session.commit()
        for historique in historiques:
            db_session.refresh(historique)
        return historiques

    def test_get_dashboard_requires_auth(self, client):
        """Test that accessing dashboard requires authentication."""
        response = client.get("/api/v1/dashboard/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_dashboard_admin_can_access(self, client, admin_user, test_users, test_bancs,
                                           test_tickets, test_interventions, test_alertes, test_historiques):
        """Test that admin can access dashboard and see correct aggregated data."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get dashboard
        response = client.get(
            "/api/v1/dashboard/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        
        # Check totals match test data
        assert data["total_utilisateurs"] == 5  # 4 from test_users + 1 admin_user
        assert data["total_bancs"] == 3  # test_bancs
        assert data["total_tickets"] == 3  # test_tickets
        assert data["total_interventions"] == 3  # test_interventions
        assert data["total_alertes"] == 2  # test_alertes
        assert data["total_historiques"] == 3  # test_historiques
        
        # Check user role breakdown
        assert data["utilisateurs_administrateur"] == 2  # admin_user + 1 from test_users
        assert data["utilisateurs_manager_maintenance"] == 1  # from test_users
        assert data["utilisateurs_technicien"] == 1  # from test_users
        assert data["utilisateurs_operateur_production"] == 1  # from test_users
        
        # Check banc status breakdown
        # We created 1 of each status in test_bancs
        assert data["bancs_operationnels"] == 1
        assert data["bancs_en_panne"] == 1
        assert data["bancs_en_maintenance"] == 1
        
        # Check ticket status breakdown
        # We created 1 of each status in test_tickets
        assert data["tickets_ouverts"] == 1
        assert data["tickets_en_cours"] == 1
        assert data["tickets_clotures"] == 1

    def test_get_dashboard_manager_can_access(self, client, manager_user):
        """Test that manager can access dashboard."""
        # Login as manager
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": manager_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get dashboard
        response = client.get(
            "/api/v1/dashboard/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        # Should return data structure even if empty
        assert "total_utilisateurs" in data
        assert "total_bancs" in data
        assert "total_tickets" in data
        assert "total_interventions" in data
        assert "total_alertes" in data
        assert "total_historiques" in data

    def test_get_dashboard_technicien_cannot_access(self, client, technicien_user):
        """Test that technicien cannot access dashboard."""
        # Login as technicien
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": technicien_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get dashboard
        response = client.get(
            "/api/v1/dashboard/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "Only Administrators and Managers can consult the dashboard" in response.json()["detail"]

    def test_get_dashboard_operator_cannot_access(self, client, operator_user):
        """Test that operator cannot access dashboard."""
        # Login as operator
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": operator_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get dashboard
        response = client.get(
            "/api/v1/dashboard/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "Only Administrators and Managers can consult the dashboard" in response.json()["detail"]

    def test_dashboard_empty_data(self, client, admin_user):
        """Test dashboard with empty database returns zeros."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get dashboard
        response = client.get(
            "/api/v1/dashboard/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        
        # All counts should be 0 in empty database (except admin_user)
        assert data["total_utilisateurs"] == 1  # only admin_user
        assert data["total_bancs"] == 0
        assert data["total_tickets"] == 0
        assert data["total_interventions"] == 0
        assert data["total_alertes"] == 0
        assert data["total_historiques"] == 0
        
        # User role breakdown
        assert data["utilisateurs_administrateur"] == 1  # admin_user
        assert data["utilisateurs_manager_maintenance"] == 0
        assert data["utilisateurs_technicien"] == 0
        assert data["utilisateurs_operateur_production"] == 0
        
        # All status breakdowns should be 0
        assert data["bancs_operationnels"] == 0
        assert data["bancs_en_panne"] == 0
        assert data["bancs_en_maintenance"] == 0
        
        assert data["tickets_ouverts"] == 0
        assert data["tickets_en_cours"] == 0
        assert data["tickets_clotures"] == 0

    def test_dashboard_data_structure(self, client, admin_user):
        """Test that dashboard response structure matches schema."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get dashboard
        response = client.get(
            "/api/v1/dashboard/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        
        # Check all fields from DashboardResponse schema are present
        required_fields = [
            "total_utilisateurs", "total_bancs", "total_tickets",
            "total_interventions", "total_alertes", "total_historiques",
            "bancs_operationnels", "bancs_en_panne", "bancs_en_maintenance",
            "tickets_ouverts", "tickets_en_cours", "tickets_clotures",
            "utilisateurs_administrateur", "utilisateurs_manager_maintenance",
            "utilisateurs_technicien", "utilisateurs_operateur_production"
        ]
        
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
            assert isinstance(data[field], int), f"Field {field} should be integer, got {type(data[field])}"

    def test_dashboard_only_get_method_allowed(self, client, admin_user):
        """Test that only GET method is allowed for dashboard endpoint."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Try POST - should return 405
        response = client.post(
            "/api/v1/dashboard/",
            json={},
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
        
        # Try PUT - should return 405
        response = client.put(
            "/api/v1/dashboard/",
            json={},
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
        
        # Try DELETE - should return 405
        response = client.delete(
            "/api/v1/dashboard/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_dashboard_no_query_params_needed(self, client, admin_user):
        """Test that dashboard endpoint doesn't require query parameters."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get dashboard without any query params
        response = client.get(
            "/api/v1/dashboard/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        
        # Get dashboard with query params (should ignore them)
        response = client.get(
            "/api/v1/dashboard/?skip=10&limit=50",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK

    def test_dashboard_aggregates_existing_data_only(self, client, admin_user, db_session: Session):
        """Test that dashboard only aggregates from existing 6 entities (no AI, prediction, etc.)."""
        # Login as admin
        login_response = client.post(
            "/api/v1/auth/login",
            json={"email": admin_user.email, "password": "password123"}
        )
        token = login_response.json()["access_token"]
        
        # Get dashboard
        response = client.get(
            "/api/v1/dashboard/",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        
        # Verify no AI/prediction fields exist
        ai_fields = [
            "predictions", "recommendations", "analytics", "kpis",
            "charts", "machine_learning", "llm", "rag", "langchain",
            "anomaly_detection", "forecast", "trends"
        ]
        
        for field in ai_fields:
            assert field not in data, f"Dashboard should not contain AI field: {field}"