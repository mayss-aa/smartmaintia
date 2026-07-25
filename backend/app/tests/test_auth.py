"""Tests for the authentication module (login and current user)."""

from fastapi.testclient import TestClient

from app.config.settings import settings
from app.models.user import Utilisateur
from app.tests.conftest import TEST_EMAIL, TEST_PASSWORD

LOGIN_URL = f"{settings.API_V1_PREFIX}/auth/login"
ME_URL = f"{settings.API_V1_PREFIX}/auth/me"


def test_login_success_returns_token(
    client: TestClient, seeded_user: Utilisateur
) -> None:
    response = client.post(
        LOGIN_URL, json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


def test_login_wrong_password_returns_401(
    client: TestClient, seeded_user: Utilisateur
) -> None:
    response = client.post(
        LOGIN_URL, json={"email": TEST_EMAIL, "password": "wrong-password"}
    )
    assert response.status_code == 401


def test_login_unknown_user_returns_401(client: TestClient) -> None:
    response = client.post(
        LOGIN_URL, json={"email": "ghost@smartmaint.example.com", "password": "whatever"}
    )
    assert response.status_code == 401


def test_login_invalid_email_returns_422(client: TestClient) -> None:
    response = client.post(
        LOGIN_URL, json={"email": "not-an-email", "password": "whatever"}
    )
    assert response.status_code == 422


def test_me_with_valid_token_returns_user(
    client: TestClient, seeded_user: Utilisateur
) -> None:
    login = client.post(
        LOGIN_URL, json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    token = login.json()["access_token"]

    response = client.get(ME_URL, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    body = response.json()
    assert body["email"] == TEST_EMAIL
    assert body["role"] == "ADMINISTRATEUR"
    assert body["id_user"] == seeded_user.id_user
    assert "mot_de_passe_hash" not in body


def test_me_without_token_returns_401(client: TestClient) -> None:
    response = client.get(ME_URL)
    assert response.status_code == 401


def test_me_with_invalid_token_returns_401(client: TestClient) -> None:
    response = client.get(
        ME_URL, headers={"Authorization": "Bearer not-a-valid-token"}
    )
    assert response.status_code == 401
