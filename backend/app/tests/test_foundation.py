"""Smoke tests for the backend technical foundation.

These tests verify that the application boots, the documentation is exposed,
the system endpoints respond and the JWT utilities work. They do not test any
business feature (none exists at this stage).
"""

from fastapi.testclient import TestClient

from app.config.settings import settings
from app.core.security import create_access_token, decode_access_token
from app.main import app

client = TestClient(app)


def test_root_endpoint() -> None:
    response = client.get("/")
    assert response.status_code == 200
    body = response.json()
    assert body["name"] == settings.APP_NAME
    assert body["version"] == settings.APP_VERSION


def test_health_endpoint() -> None:
    response = client.get(f"{settings.API_V1_PREFIX}/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_openapi_schema_available() -> None:
    response = client.get(f"{settings.API_V1_PREFIX}/openapi.json")
    assert response.status_code == 200
    assert response.json()["info"]["title"] == settings.APP_NAME


def test_swagger_docs_available() -> None:
    response = client.get("/docs")
    assert response.status_code == 200


def test_jwt_roundtrip() -> None:
    token = create_access_token("technical-check")
    payload = decode_access_token(token)
    assert payload["sub"] == "technical-check"
    assert "exp" in payload
