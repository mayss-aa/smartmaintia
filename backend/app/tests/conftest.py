"""Shared pytest fixtures.

An isolated in-memory SQLite database is used so authentication tests do not
depend on a running MySQL server. The application's ``get_db`` dependency is
overridden to use this test session.
"""

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.security import hash_password
from app.database.session import Base, get_db
from app.main import app
from app.models.enums import RoleUtilisateur
from app.models.user import Utilisateur

TEST_PASSWORD = "Str0ngPassw0rd!"
TEST_EMAIL = "admin@smartmaint.example.com"


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
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


@pytest.fixture()
def seeded_user(db_session: Session) -> Utilisateur:
    user = Utilisateur(
        nom="Admin",
        prenom="Root",
        email=TEST_EMAIL,
        mot_de_passe_hash=hash_password(TEST_PASSWORD),
        role=RoleUtilisateur.ADMINISTRATEUR,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.pop(get_db, None)
