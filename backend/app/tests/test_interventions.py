"""Unit tests for the Intervention endpoints."""

from datetime import datetime, timedelta
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.session import Base, get_db
from app.main import app
from app.models.enums import RoleUtilisateur, TypeIntervention
from app.models.intervention import Intervention
from app.models.test_bench import BancTestBDD
from app.models.ticket import TicketMaintenance
from app.models.user import Utilisateur


@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    """Provide an isolated in-memory SQLite database for each test."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    testing_session = sessionmaker(
        bind=engine, autocommit=False, autoflush=False, expire_on_commit=False
    )
    session = testing_session()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture
def test_client(db_session: Session) -> TestClient:
    """Provide a test client with isolated database."""
    def override_get_db() -> Generator[Session, None, None]:
        yield db_session
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.pop(get_db, None)


@pytest.fixture
def create_test_users(db_session: Session) -> dict[str, Utilisateur]:
    """Create test users with different roles."""
    users = {}
    
    # Create ADMINISTRATEUR
    admin = Utilisateur(
        nom="Admin",
        prenom="Test",
        email="admin@test.com",
        mot_de_passe_hash="hashed_password",
        role=RoleUtilisateur.ADMINISTRATEUR,
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    users["admin"] = admin
    
    # Create MANAGER_MAINTENANCE
    manager = Utilisateur(
        nom="Manager",
        prenom="Test",
        email="manager@test.com",
        mot_de_passe_hash="hashed_password",
        role=RoleUtilisateur.MANAGER_MAINTENANCE,
    )
    db_session.add(manager)
    db_session.commit()
    db_session.refresh(manager)
    users["manager"] = manager
    
    # Create TECHNICIEN
    technicien = Utilisateur(
        nom="Technicien",
        prenom="Test",
        email="technicien@test.com",
        mot_de_passe_hash="hashed_password",
        role=RoleUtilisateur.TECHNICIEN,
    )
    db_session.add(technicien)
    db_session.commit()
    db_session.refresh(technicien)
    users["technicien"] = technicien
    
    # Create OPERATEUR_PRODUCTION
    operateur = Utilisateur(
        nom="Operateur",
        prenom="Test",
        email="operateur@test.com",
        mot_de_passe_hash="hashed_password",
        role=RoleUtilisateur.OPERATEUR_PRODUCTION,
    )
    db_session.add(operateur)
    db_session.commit()
    db_session.refresh(operateur)
    users["operateur"] = operateur
    
    return users


@pytest.fixture
def create_test_banc(db_session: Session) -> BancTestBDD:
    """Create a test banc for intervention tests."""
    banc = BancTestBDD(
        code_banc="BANC001",
        nom="Banc de Test 1",
        emplacement="Atelier A",
        statut="OPERATIONNEL",
    )
    db_session.add(banc)
    db_session.commit()
    db_session.refresh(banc)
    return banc


@pytest.fixture
def create_test_ticket(db_session: Session, create_test_banc: BancTestBDD, create_test_users: dict) -> TicketMaintenance:
    """Create a test maintenance ticket."""
    ticket = TicketMaintenance(
        id_user=create_test_users["technicien"].id_user,
        code_banc=create_test_banc.code_banc,
        symptome="Panne moteur",
        criticite="HAUTE",
        date_creation=datetime.utcnow(),
        statut="OUVERT",
    )
    db_session.add(ticket)
    db_session.commit()
    db_session.refresh(ticket)
    return ticket


@pytest.fixture
def create_test_intervention(db_session: Session, create_test_users: dict, create_test_ticket: TicketMaintenance) -> Intervention:
    """Create a test intervention."""
    manager = create_test_users["manager"]
    technicien = create_test_users["technicien"]
    
    intervention = Intervention(
        id_technicien=technicien.id_user,
        id_manager=manager.id_user,
        id_ticket=create_test_ticket.id_ticket,
        type=TypeIntervention.CURATIF,
        date_planifiee=datetime.utcnow() + timedelta(days=1),
        duree_reparation=120,
        statut_intervention="PLANIFIEE",
    )
    db_session.add(intervention)
    db_session.commit()
    db_session.refresh(intervention)
    return intervention


def get_auth_token(user: Utilisateur) -> str:
    """Generate JWT token for a user."""
    from app.core.security import create_access_token
    return create_access_token(
        subject=str(user.id_user),
        additional_claims={"role": user.role.value},
    )


class TestInterventionEndpoints:
    """Test suite for Intervention endpoints."""
    
    def test_list_interventions_as_admin(self, test_client: TestClient, create_test_users: dict, create_test_intervention: Intervention):
        """Test that ADMINISTRATEUR can list interventions."""
        admin = create_test_users["admin"]
        token = get_auth_token(admin)
        
        response = test_client.get(
            "/api/v1/interventions/",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
    def test_list_interventions_as_manager(self, test_client: TestClient, create_test_users: dict, create_test_intervention: Intervention):
        """Test that MANAGER_MAINTENANCE can list interventions."""
        manager = create_test_users["manager"]
        token = get_auth_token(manager)
        
        response = test_client.get(
            "/api/v1/interventions/",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
    def test_list_interventions_as_technicien(self, test_client: TestClient, create_test_users: dict, create_test_intervention: Intervention):
        """Test that TECHNICIEN can list assigned interventions."""
        technicien = create_test_users["technicien"]
        token = get_auth_token(technicien)
        
        response = test_client.get(
            "/api/v1/interventions/",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
    def test_list_interventions_fails_as_operateur(self, test_client: TestClient, create_test_users: dict, create_test_intervention: Intervention):
        """Test that OPERATEUR_PRODUCTION cannot list interventions."""
        operateur = create_test_users["operateur"]
        token = get_auth_token(operateur)
        
        response = test_client.get(
            "/api/v1/interventions/",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 403  # Forbidden
        
    def test_get_intervention_by_id(self, test_client: TestClient, create_test_users: dict, create_test_intervention: Intervention):
        """Test getting a specific intervention by ID."""
        admin = create_test_users["admin"]
        token = get_auth_token(admin)
        
        response = test_client.get(
            f"/api/v1/interventions/{create_test_intervention.id_intervention}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["id_intervention"] == create_test_intervention.id_intervention
        assert data["id_technicien"] == create_test_intervention.id_technicien
        assert data["id_manager"] == create_test_intervention.id_manager
        
    def test_create_intervention_as_manager(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test that MANAGER_MAINTENANCE can create interventions."""
        manager = create_test_users["manager"]
        technicien = create_test_users["technicien"]
        token = get_auth_token(manager)
        
        intervention_data = {
            "id_technicien": technicien.id_user,
            "id_manager": manager.id_user,
            "id_ticket": create_test_ticket.id_ticket,
            "type": "CURATIF",
            "date_planifiee": (datetime.utcnow() + timedelta(days=2)).isoformat(),
            "duree_reparation": 180,
            "statut_intervention": "PLANIFIEE"
        }
        
        response = test_client.post(
            "/api/v1/interventions/",
            json=intervention_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["id_technicien"] == intervention_data["id_technicien"]
        assert data["type"] == intervention_data["type"]
        assert data["statut_intervention"] == intervention_data["statut_intervention"]
        
    def test_create_intervention_fails_as_admin(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test that ADMINISTRATEUR cannot create interventions (consultation only)."""
        admin = create_test_users["admin"]
        manager = create_test_users["manager"]
        technicien = create_test_users["technicien"]
        token = get_auth_token(admin)
        
        intervention_data = {
            "id_technicien": technicien.id_user,
            "id_manager": manager.id_user,
            "id_ticket": create_test_ticket.id_ticket,
            "type": "CURATIF",
            "date_planifiee": (datetime.utcnow() + timedelta(days=2)).isoformat(),
            "duree_reparation": 180,
            "statut_intervention": "PLANIFIEE"
        }
        
        response = test_client.post(
            "/api/v1/interventions/",
            json=intervention_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 403  # Forbidden
        
    def test_create_intervention_fails_as_technicien(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test that TECHNICIEN cannot create interventions."""
        technicien = create_test_users["technicien"]
        manager = create_test_users["manager"]
        token = get_auth_token(technicien)
        
        intervention_data = {
            "id_technicien": technicien.id_user,
            "id_manager": manager.id_user,
            "id_ticket": create_test_ticket.id_ticket,
            "type": "CURATIF",
            "date_planifiee": (datetime.utcnow() + timedelta(days=2)).isoformat(),
            "duree_reparation": 180,
            "statut_intervention": "PLANIFIEE"
        }
        
        response = test_client.post(
            "/api/v1/interventions/",
            json=intervention_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 403  # Forbidden
        
    def test_update_intervention_as_manager(self, test_client: TestClient, create_test_users: dict, create_test_intervention: Intervention):
        """Test that MANAGER_MAINTENANCE can update interventions."""
        manager = create_test_users["manager"]
        token = get_auth_token(manager)
        
        update_data = {
            "duree_reparation": 240,
            "statut_intervention": "EN_COURS"
        }
        
        response = test_client.put(
            f"/api/v1/interventions/{create_test_intervention.id_intervention}",
            json=update_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["duree_reparation"] == update_data["duree_reparation"]
        assert data["statut_intervention"] == update_data["statut_intervention"]
        
    def test_update_intervention_fails_as_admin(self, test_client: TestClient, create_test_users: dict, create_test_intervention: Intervention):
        """Test that ADMINISTRATEUR cannot update interventions (consultation only)."""
        admin = create_test_users["admin"]
        token = get_auth_token(admin)
        
        update_data = {
            "statut_intervention": "Admin trying to update"
        }
        
        response = test_client.put(
            f"/api/v1/interventions/{create_test_intervention.id_intervention}",
            json=update_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 403  # Forbidden
        
    def test_update_intervention_fails_as_technicien(self, test_client: TestClient, create_test_users: dict, create_test_intervention: Intervention):
        """Test that TECHNICIEN cannot update interventions (execution only)."""
        technicien = create_test_users["technicien"]
        token = get_auth_token(technicien)
        
        update_data = {
            "statut_intervention": "Technicien trying to update"
        }
        
        response = test_client.put(
            f"/api/v1/interventions/{create_test_intervention.id_intervention}",
            json=update_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 403  # Forbidden
        
    def test_filter_interventions_by_technicien(self, test_client: TestClient, create_test_users: dict, create_test_intervention: Intervention):
        """Test filtering interventions by technician ID."""
        admin = create_test_users["admin"]
        token = get_auth_token(admin)
        
        response = test_client.get(
            f"/api/v1/interventions/?id_technicien={create_test_intervention.id_technicien}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert all(intervention["id_technicien"] == create_test_intervention.id_technicien for intervention in data)
        
    def test_filter_interventions_by_ticket(self, test_client: TestClient, create_test_users: dict, create_test_intervention: Intervention):
        """Test filtering interventions by ticket ID."""
        admin = create_test_users["admin"]
        token = get_auth_token(admin)
        
        response = test_client.get(
            f"/api/v1/interventions/?id_ticket={create_test_intervention.id_ticket}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert all(intervention["id_ticket"] == create_test_intervention.id_ticket for intervention in data)
        
    def test_technician_view_assigned_interventions(self, test_client: TestClient, create_test_users: dict, create_test_intervention: Intervention):
        """Test that technicians can view their assigned interventions."""
        technicien = create_test_users["technicien"]
        token = get_auth_token(technicien)
        
        response = test_client.get(
            "/api/v1/interventions/technicien/mes-interventions",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert all(intervention["id_technicien"] == technicien.id_user for intervention in data)
        
    def test_technician_view_assigned_fails_for_non_technician(self, test_client: TestClient, create_test_users: dict):
        """Test that non-technicians cannot access technician-specific endpoint."""
        manager = create_test_users["manager"]
        token = get_auth_token(manager)
        
        response = test_client.get(
            "/api/v1/interventions/technicien/mes-interventions",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 403  # Forbidden
        
    def test_create_intervention_with_invalid_technician(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test that creating intervention with non-technician user fails."""
        manager = create_test_users["manager"]
        operateur = create_test_users["operateur"]  # Not a technician
        token = get_auth_token(manager)
        
        intervention_data = {
            "id_technicien": operateur.id_user,  # Operator, not technician
            "id_manager": manager.id_user,
            "id_ticket": create_test_ticket.id_ticket,
            "type": "CURATIF",
            "date_planifiee": (datetime.utcnow() + timedelta(days=2)).isoformat(),
            "duree_reparation": 180,
            "statut_intervention": "PLANIFIEE"
        }
        
        response = test_client.post(
            "/api/v1/interventions/",
            json=intervention_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 400  # Bad request - invalid technician
        
    def test_create_intervention_with_invalid_manager(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test that creating intervention with non-manager user fails."""
        technicien = create_test_users["technicien"]
        operateur = create_test_users["operateur"]  # Not a manager
        token = get_auth_token(operateur)
        
        intervention_data = {
            "id_technicien": technicien.id_user,
            "id_manager": operateur.id_user,  # Operator, not manager
            "id_ticket": create_test_ticket.id_ticket,
            "type": "CURATIF",
            "date_planifiee": (datetime.utcnow() + timedelta(days=2)).isoformat(),
            "duree_reparation": 180,
            "statut_intervention": "PLANIFIEE"
        }
        
        response = test_client.post(
            "/api/v1/interventions/",
            json=intervention_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        # Should fail at RBAC level (403) before validation (400)
        assert response.status_code == 403  # Forbidden - operator cannot create interventions