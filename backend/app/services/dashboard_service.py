"""Service layer for the Dashboard aggregation (see API_SPECIFICATION.md)."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import Utilisateur
from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.dashboard import DashboardResponse


class DashboardService:
    """Business logic for dashboard data aggregation."""

    def __init__(self, db: Session) -> None:
        self._dashboard_repo = DashboardRepository(db)

    def get_dashboard_data(self, user: Utilisateur) -> DashboardResponse:
        """Return aggregated dashboard data from existing entities.
        
        Note: Dashboard is NOT a persistent entity - it only aggregates
        existing business data from 6 entities as per API_SPECIFICATION.md.
        """
        # Get counts from repository
        total_users = self._dashboard_repo.get_total_users()
        total_bancs = self._dashboard_repo.get_total_bancs()
        total_tickets = self._dashboard_repo.get_total_tickets()
        total_interventions = self._dashboard_repo.get_total_interventions()
        total_alertes = self._dashboard_repo.get_total_alertes()
        total_historiques = self._dashboard_repo.get_total_historiques()

        # Get detailed breakdowns
        user_counts = self._dashboard_repo.get_user_counts()
        banc_counts = self._dashboard_repo.get_banc_counts()
        ticket_counts = self._dashboard_repo.get_ticket_counts()

        # Manager KPIs
        taux_disponibilite_bancs = self._dashboard_repo.get_availability_rate()
        mttr_moyen = self._dashboard_repo.get_mttr()
        interventions_cloturees_mois = self._dashboard_repo.get_closed_interventions_this_month()

        # Build DashboardResponse
        return DashboardResponse(
            # Simple totals
            total_utilisateurs=total_users,
            total_bancs=total_bancs,
            total_tickets=total_tickets,
            total_interventions=total_interventions,
            total_alertes=total_alertes,
            total_historiques=total_historiques,

            # Status breakdowns
            bancs_operationnels=banc_counts.get("operationnel", 0),
            bancs_en_panne=banc_counts.get("en_panne", 0),
            bancs_en_maintenance=banc_counts.get("en_maintenance", 0),

            tickets_ouverts=ticket_counts.get("ouvert", 0),
            tickets_en_cours=ticket_counts.get("en_cours", 0),
            tickets_clotures=ticket_counts.get("cloture", 0),

            utilisateurs_administrateur=user_counts.get("administrateur", 0),
            utilisateurs_manager_maintenance=user_counts.get("manager_maintenance", 0),
            utilisateurs_technicien=user_counts.get("technicien", 0),
            utilisateurs_operateur_production=user_counts.get("operateur_production", 0),

            # Manager KPIs
            taux_disponibilite_bancs=taux_disponibilite_bancs,
            mttr_moyen=mttr_moyen,
            interventions_cloturees_mois=interventions_cloturees_mois,
        )


def get_dashboard_service(
    db: Annotated[Session, Depends(get_db)],
) -> DashboardService:
    """Dependency for obtaining a DashboardService instance."""
    return DashboardService(db)