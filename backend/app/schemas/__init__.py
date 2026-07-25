"""Pydantic schemas package."""

from app.schemas.auth import LoginRequest, Token
from app.schemas.alerte import (
    AlertePredictiveCreate,
    AlertePredictiveRead,
    AlertePredictiveUpdate,
    AlertePredictiveSimple,
)
from app.schemas.dashboard import DashboardResponse
from app.schemas.historique import HistoriqueRead
from app.schemas.intervention import (
    InterventionCreate,
    InterventionRead,
    InterventionUpdate,
)
from app.schemas.planning import PlanningCreate, PlanningRead, PlanningUpdate
from app.schemas.test_bench import (
    BancTestBDDCreate,
    BancTestBDDRead,
    BancTestBDDUpdate,
)
from app.schemas.ticket import TicketMaintenanceCreate, TicketMaintenanceRead, TicketMaintenanceUpdate
from app.schemas.user import UtilisateurCreate, UtilisateurRead, UtilisateurUpdate

__all__ = [
    "LoginRequest",
    "Token",
    "UtilisateurCreate",
    "UtilisateurRead",
    "UtilisateurUpdate",
    "BancTestBDDCreate",
    "BancTestBDDRead",
    "BancTestBDDUpdate",
    "TicketMaintenanceCreate",
    "TicketMaintenanceRead",
    "TicketMaintenanceUpdate",
    "InterventionCreate",
    "InterventionRead",
    "InterventionUpdate",
    "PlanningCreate",
    "PlanningRead",
    "PlanningUpdate",
    "HistoriqueRead",
    "AlertePredictiveCreate",
    "AlertePredictiveRead",
    "AlertePredictiveUpdate",
    "AlertePredictiveSimple",
    "DashboardResponse",
]
