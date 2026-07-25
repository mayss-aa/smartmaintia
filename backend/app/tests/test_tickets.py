"""Unit tests for the TicketMaintenance endpoints."""

from datetime import datetime, timedelta
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.session import Base, get_db
from app.main import app
from app.models.enums import RoleUtilisateur, StatutTicket
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
    """Create a test banc for ticket tests."""
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
        id_user=create_test_users["admin"].id_user,
        code_banc=create_test_banc.code_banc,
        symptome="Panne moteur",
        criticite="HAUTE",
        date_creation=datetime.utcnow(),
        statut=StatutTicket.OUVERT,
    )
    db_session.add(ticket)
    db_session.commit()
    db_session.refresh(ticket)
    return ticket


def get_auth_token(user: Utilisateur) -> str:
    """Generate JWT token for a user."""
    from app.core.security import create_access_token
    return create_access_token(
        subject=str(user.id_user),
        additional_claims={"role": user.role.value},
    )


class TestTicketEndpoints:
    """Test suite for TicketMaintenance endpoints."""
    
    def test_list_tickets_as_admin(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test that ADMINISTRATEUR can list tickets."""
        admin = create_test_users["admin"]
        token = get_auth_token(admin)
        
        response = test_client.get(
            "/api/v1/tickets/",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
    def test_list_tickets_as_manager(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test that MANAGER_MAINTENANCE can list tickets."""
        manager = create_test_users["manager"]
        token = get_auth_token(manager)
        
        response = test_client.get(
            "/api/v1/tickets/",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
    def test_list_tickets_as_technicien(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test that TECHNICIEN can list tickets (affectés)."""
        technicien = create_test_users["technicien"]
        token = get_auth_token(technicien)
        
        response = test_client.get(
            "/api/v1/tickets/",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
    def test_list_tickets_as_operateur(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test that OPERATEUR_PRODUCTION can list tickets (own declarations)."""
        operateur = create_test_users["operateur"]
        token = get_auth_token(operateur)
        
        response = test_client.get(
            "/api/v1/tickets/",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
    def test_get_ticket_by_id(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test getting a specific ticket by ID."""
        admin = create_test_users["admin"]
        token = get_auth_token(admin)
        
        response = test_client.get(
            f"/api/v1/tickets/{create_test_ticket.id_ticket}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["id_ticket"] == create_test_ticket.id_ticket
        assert data["code_banc"] == create_test_ticket.code_banc
        assert data["symptome"] == create_test_ticket.symptome
        
    def test_create_ticket_as_operateur(self, test_client: TestClient, create_test_users: dict, create_test_banc: BancTestBDD):
        """Test that OPERATEUR_PRODUCTION can create tickets (incident declaration)."""
        operateur = create_test_users["operateur"]
        token = get_auth_token(operateur)
        
        ticket_data = {
            "code_banc": create_test_banc.code_banc,
            "symptome": "Bruit anormal",
            "criticite": "BASSE",
            "statut": "OUVERT"
        }
        
        response = test_client.post(
            "/api/v1/tickets/",
            json=ticket_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["code_banc"] == ticket_data["code_banc"]
        
    def test_create_ticket_fails_as_admin(self, test_client: TestClient, create_test_users: dict, create_test_banc: BancTestBDD):
        """Test that ADMINISTRATEUR cannot create tickets (consultation only)."""
        admin = create_test_users["admin"]
        token = get_auth_token(admin)
        
        ticket_data = {
            "code_banc": create_test_banc.code_banc,
            "symptome": "Test admin",
            "criticite": "MOYENNE",
            "statut": "OUVERT"
        }
        
        response = test_client.post(
            "/api/v1/tickets/",
            json=ticket_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 403  # Forbidden
        
    def test_create_ticket_fails_as_technicien(self, test_client: TestClient, create_test_users: dict, create_test_banc: BancTestBDD):
        """Test that TECHNICIEN cannot create tickets."""
        technicien = create_test_users["technicien"]
        token = get_auth_token(technicien)
        
        ticket_data = {
            "code_banc": create_test_banc.code_banc,
            "symptome": "Test technicien",
            "criticite": "MOYENNE",
            "statut": "OUVERT"
        }
        
        response = test_client.post(
            "/api/v1/tickets/",
            json=ticket_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 403  # Forbidden
        
    def test_update_ticket_as_manager(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test that MANAGER_MAINTENANCE can update tickets."""
        manager = create_test_users["manager"]
        token = get_auth_token(manager)
        
        update_data = {
            "symptome": "Symptôme mis à jour",
            "statut": "EN_COURS"
        }
        
        response = test_client.put(
            f"/api/v1/tickets/{create_test_ticket.id_ticket}",
            json=update_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["symptome"] == update_data["symptome"]
        assert data["statut"] == update_data["statut"]
        
    def test_update_ticket_fails_as_admin(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test that ADMINISTRATEUR cannot update tickets (consultation only)."""
        admin = create_test_users["admin"]
        token = get_auth_token(admin)
        
        update_data = {
            "symptome": "Admin trying to update"
        }
        
        response = test_client.put(
            f"/api/v1/tickets/{create_test_ticket.id_ticket}",
            json=update_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 403  # Forbidden
        
    def test_filter_tickets_by_banc(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test filtering tickets by banc code."""
        admin = create_test_users["admin"]
        token = get_auth_token(admin)
        
        response = test_client.get(
            f"/api/v1/tickets/?code_banc={create_test_ticket.code_banc}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert all(ticket["code_banc"] == create_test_ticket.code_banc for ticket in data)
        
    def test_filter_tickets_by_statut(self, test_client: TestClient, create_test_users: dict, create_test_ticket: TicketMaintenance):
        """Test filtering tickets by status."""
        admin = create_test_users["admin"]
        token = get_auth_token(admin)
        
        response = test_client.get(
            f"/api/v1/tickets/?statut={create_test_ticket.statut.value}",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) > 0
        assert all(ticket["statut"] == create_test_ticket.statut.value for ticket in data)