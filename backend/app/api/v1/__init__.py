"""API version 1 package."""
from app.api.v1 import auth, alertes, historiques, interventions, planning, roles, system, test_benches, tickets, users

__all__ = ["auth", "alertes", "historiques", "interventions", "planning", "roles", "system", "test_benches", "tickets", "users"]