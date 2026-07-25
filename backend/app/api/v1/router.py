"""Aggregate router for API version 1.

Registers the technical system router and the authentication router. Other
business routers (users, bancs, tickets, interventions, planning, alertes,
historiques, dashboard, ai) will be included here in later sprints.
"""

from fastapi import APIRouter

from app.api.v1 import auth, alertes, dashboard, historiques, interventions, planning, roles, system, test_benches, tickets, users

api_router = APIRouter()
api_router.include_router(system.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(roles.router)
api_router.include_router(test_benches.router)
api_router.include_router(tickets.router)
api_router.include_router(interventions.router)
api_router.include_router(planning.router)
api_router.include_router(historiques.router)
api_router.include_router(alertes.router)
api_router.include_router(dashboard.router)
