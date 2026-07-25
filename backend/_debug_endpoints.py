"""Temporary end-to-end verification of Dashboard Manager endpoints.

Uses FastAPI TestClient against the real MySQL database. Verifies that no
endpoint returns HTTP 500, and that RBAC still returns 403 where expected.
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def login(email: str, password: str) -> str:
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert resp.status_code == 200, f"login failed: {resp.status_code} {resp.text}"
    return resp.json()["access_token"]


def check(name: str, method: str, url: str, token: str, expected: set[int]) -> None:
    headers = {"Authorization": f"Bearer {token}"}
    resp = client.request(method, url, headers=headers)
    status = resp.status_code
    ok = status in expected
    flag = "OK " if ok else "!!!"
    print(f"[{flag}] {method} {url} -> {status} (expected {sorted(expected)})")
    if status == 500:
        print("      500 BODY:", resp.text[:500])


def main() -> None:
    print("=== MANAGER (admin+manager access) ===")
    manager = login("manager@example.com", "Manager123!")
    check("dashboard", "GET", "/api/v1/dashboard/", manager, {200})
    check("planning", "GET", "/api/v1/planning/", manager, {200})
    check("interventions", "GET", "/api/v1/interventions/", manager, {200})
    check("tickets", "GET", "/api/v1/tickets/", manager, {200})
    check("alertes", "GET", "/api/v1/alertes/", manager, {200})
    check("historiques", "GET", "/api/v1/historiques/", manager, {200})
    check("users", "GET", "/api/v1/users/", manager, {200, 403})

    print("\n=== ADMIN ===")
    admin = login("admin@example.com", "Admin123!")
    check("dashboard", "GET", "/api/v1/dashboard/", admin, {200})
    check("planning", "GET", "/api/v1/planning/", admin, {200})
    check("interventions", "GET", "/api/v1/interventions/", admin, {200})
    check("users", "GET", "/api/v1/users/", admin, {200})

    print("\n=== TECHNICIEN (limited) ===")
    tech = login("technicien@example.com", "Tech123!")
    check("dashboard(403)", "GET", "/api/v1/dashboard/", tech, {403})
    check("planning", "GET", "/api/v1/planning/", tech, {200, 403})
    check("mon-planning", "GET", "/api/v1/planning/technicien/mon-planning", tech, {200})
    check("mes-interventions", "GET", "/api/v1/interventions/technicien/mes-interventions", tech, {200})

    print("\n=== OPERATEUR (limited) ===")
    op = login("operateur@example.com", "Operateur123!")
    check("dashboard(403)", "GET", "/api/v1/dashboard/", op, {403})
    check("tickets", "GET", "/api/v1/tickets/", op, {200, 403})


if __name__ == "__main__":
    main()
