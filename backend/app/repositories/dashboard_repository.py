"""Repository for Dashboard data aggregation (see API_SPECIFICATION.md)."""

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.alerte import AlertePredictive
from app.models.historique import HistoriqueGlobal
from app.models.intervention import Intervention
from app.models.test_bench import BancTestBDD
from app.models.ticket import TicketMaintenance
from app.models.user import Utilisateur
from app.models.enums import RoleUtilisateur, StatutBanc, StatutTicket


class DashboardRepository:
    """Repository for Dashboard aggregation queries."""

    def __init__(self, session: Session):
        self.session = session

    def get_user_counts(self) -> dict:
        """Get counts of users by role."""
        # Count users by role using SQLAlchemy
        counts = {
            "administrateur": 0,
            "manager_maintenance": 0,
            "technicien": 0,
            "operateur_production": 0
        }
        
        for role in RoleUtilisateur:
            stmt = select(func.count()).select_from(Utilisateur).where(Utilisateur.role == role)
            count = self.session.scalar(stmt)
            role_name = role.name.lower()
            counts[role_name] = count or 0
        
        return counts

    def get_total_users(self) -> int:
        """Get total number of users."""
        stmt = select(func.count()).select_from(Utilisateur)
        return self.session.scalar(stmt) or 0

    def get_banc_counts(self) -> dict:
        """Get counts of test benches by status."""
        # Count bancs by status using SQLAlchemy
        counts = {
            "operationnel": 0,
            "en_panne": 0,
            "en_maintenance": 0
        }
        
        for status in StatutBanc:
            stmt = select(func.count()).select_from(BancTestBDD).where(BancTestBDD.statut == status)
            count = self.session.scalar(stmt)
            status_name = status.name.lower()
            counts[status_name] = count or 0
        
        return counts

    def get_total_bancs(self) -> int:
        """Get total number of test benches."""
        stmt = select(func.count()).select_from(BancTestBDD)
        return self.session.scalar(stmt) or 0

    def get_ticket_counts(self) -> dict:
        """Get counts of tickets by status."""
        # Count tickets by status using SQLAlchemy
        counts = {
            "ouvert": 0,
            "en_cours": 0,
            "cloture": 0
        }
        
        for status in StatutTicket:
            stmt = select(func.count()).select_from(TicketMaintenance).where(TicketMaintenance.statut == status)
            count = self.session.scalar(stmt)
            status_name = status.name.lower()
            counts[status_name] = count or 0
        
        return counts

    def get_total_tickets(self) -> int:
        """Get total number of tickets."""
        stmt = select(func.count()).select_from(TicketMaintenance)
        return self.session.scalar(stmt) or 0

    def get_total_interventions(self) -> int:
        """Get total number of interventions."""
        stmt = select(func.count()).select_from(Intervention)
        return self.session.scalar(stmt) or 0

    def get_total_alertes(self) -> int:
        """Get total number of predictive alerts."""
        stmt = select(func.count()).select_from(AlertePredictive)
        return self.session.scalar(stmt) or 0

    def get_total_historiques(self) -> int:
        """Get total number of history records."""
        stmt = select(func.count()).select_from(HistoriqueGlobal)
        return self.session.scalar(stmt) or 0

    def get_availability_rate(self) -> float:
        """Percentage of test benches in OPERATIONNEL status."""
        total_stmt = select(func.count()).select_from(BancTestBDD)
        total = self.session.scalar(total_stmt) or 0
        if total == 0:
            return 0.0
        operational_stmt = (
            select(func.count())
            .select_from(BancTestBDD)
            .where(BancTestBDD.statut == StatutBanc.OPERATIONNEL)
        )
        operational = self.session.scalar(operational_stmt) or 0
        return round((operational / total) * 100, 2)

    def get_mttr(self) -> float | None:
        """Average repair duration (hours) for closed interventions."""
        stmt = select(func.avg(Intervention.duree_reparation)).where(
            Intervention.statut_intervention == "Terminée",
            Intervention.duree_reparation.isnot(None),
        )
        avg = self.session.scalar(stmt)
        if avg is None:
            return None
        return round(float(avg), 2)

    def get_closed_interventions_this_month(self) -> int:
        """Number of interventions closed (Terminée) in the current month."""
        from datetime import datetime

        now = datetime.now()
        first_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        stmt = (
            select(func.count())
            .select_from(Intervention)
            .where(
                Intervention.statut_intervention == "Terminée",
                Intervention.date_planifiee >= first_of_month,
            )
        )
        return self.session.scalar(stmt) or 0