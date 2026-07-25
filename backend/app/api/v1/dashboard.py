"""REST endpoints for Dashboard aggregation (see API_SPECIFICATION.md)."""

from fastapi import APIRouter, Depends
from app.dependencies.rbac import require_dashboard_consultation
from app.models.user import Utilisateur
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import DashboardService, get_dashboard_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get(
    "/",
    response_model=DashboardResponse,
    summary="Get dashboard aggregated data",
    description="""Return aggregated dashboard data from existing business entities.
    
    Dashboard is NOT a persistent entity - it only aggregates existing data from:
    - Utilisateur
    - BancTestBDD
    - TicketMaintenance
    - Intervention
    - AlertePredictive
    - HistoriqueGlobal
    
    Only Administrators and Managers can consult the dashboard.
    """,
)
def get_dashboard(
    service: DashboardService = Depends(get_dashboard_service),
    current_user: Utilisateur = Depends(require_dashboard_consultation),
) -> DashboardResponse:
    """Get aggregated dashboard data from existing entities."""
    return service.get_dashboard_data(user=current_user)