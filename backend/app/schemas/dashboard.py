"""Pydantic schemas for Dashboard aggregation (see API_SPECIFICATION.md)."""

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import RoleUtilisateur, StatutBanc, StatutTicket


class DashboardResponse(BaseModel):
    """Dashboard response aggregating existing business data."""

    # Simple counts from existing entities (directly derivable)
    total_utilisateurs: int = Field(0, description="Total number of users")
    total_bancs: int = Field(0, description="Total number of test benches")
    total_tickets: int = Field(0, description="Total number of maintenance tickets")
    total_interventions: int = Field(0, description="Total number of interventions")
    total_alertes: int = Field(0, description="Total number of predictive alerts")
    total_historiques: int = Field(0, description="Total number of history records")

    # Status breakdowns that can be directly derived from existing fields
    bancs_operationnels: int = Field(0, description="Number of operational benches")
    bancs_en_panne: int = Field(0, description="Number of benches in failure")
    bancs_en_maintenance: int = Field(0, description="Number of benches in maintenance")

    tickets_ouverts: int = Field(0, description="Number of open tickets")
    tickets_en_cours: int = Field(0, description="Number of tickets in progress")
    tickets_clotures: int = Field(0, description="Number of closed tickets")

    utilisateurs_administrateur: int = Field(0, description="Number of administrators")
    utilisateurs_manager_maintenance: int = Field(0, description="Number of maintenance managers")
    utilisateurs_technicien: int = Field(0, description="Number of technicians")
    utilisateurs_operateur_production: int = Field(0, description="Number of production operators")

    # Manager KPIs
    taux_disponibilite_bancs: float = Field(0.0, description="Percentage of operational test benches")
    mttr_moyen: float | None = Field(None, description="Mean Time To Repair (hours)")
    interventions_cloturees_mois: int = Field(0, description="Number of closed interventions this month")

    model_config = ConfigDict(from_attributes=True)