"""Pydantic schemas for Planning operations.

The planning is not a separate entity but derived from Intervention records
that have `date_planifiee` and `id_technicien` (see DATABASE.md).
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import PrioriteIntervention, TypeIntervention


class PlanningRead(BaseModel):
    """Schema for reading planned interventions (planning view)."""
    
    id_intervention: int = Field(..., description="Intervention ID")
    id_technicien: int = Field(..., description="Technician ID")
    id_manager: int = Field(..., description="Manager ID")
    id_ticket: Optional[int] = Field(None, description="Associated ticket ID")
    id_alerte: Optional[int] = Field(None, description="Associated alert ID")
    type: TypeIntervention = Field(..., description="Type of intervention")
    priorite: Optional[PrioriteIntervention] = Field(None, description="Priority level")
    date_planifiee: datetime = Field(..., description="Planned date")
    duree_reparation: Optional[int] = Field(None, description="Reparation duration in minutes")
    statut_intervention: str = Field(..., description="Intervention status")
    
    # Related data for planning display
    technicien_nom: str = Field(..., description="Technician last name")
    technicien_prenom: str = Field(..., description="Technician first name")
    manager_nom: str = Field(..., description="Manager last name")
    manager_prenom: str = Field(..., description="Manager first name")
    ticket_code_banc: Optional[str] = Field(None, description="Associated banc code")
    banc_nom: Optional[str] = Field(None, description="Banc name")
    banc_emplacement: Optional[str] = Field(None, description="Banc location")
    
    model_config = ConfigDict(from_attributes=True)


class PlanningCreate(BaseModel):
    """Schema for creating a planned intervention.
    
    Creates a new Intervention with planned status.
    """
    
    id_technicien: int = Field(..., description="Technician ID", gt=0)
    id_manager: int = Field(..., description="Manager ID", gt=0)
    id_ticket: Optional[int] = Field(None, description="Associated ticket ID", gt=0)
    id_alerte: Optional[int] = Field(None, description="Associated alert ID", gt=0)
    type: TypeIntervention = Field(..., description="Type of intervention")
    date_planifiee: datetime = Field(..., description="Planned date")
    duree_reparation: Optional[int] = Field(None, description="Reparation duration in minutes", gt=0)
    statut_intervention: str = Field(
        "planifié", 
        description="Intervention status (default: planifié)",
        pattern="^planifié$"  # Only "planifié" status for planning entries
    )


class PlanningUpdate(BaseModel):
    """Schema for updating a planned intervention.
    
    Updates an existing Intervention that is part of planning.
    """
    
    id_technicien: Optional[int] = Field(None, description="Technician ID", gt=0)
    id_manager: Optional[int] = Field(None, description="Manager ID", gt=0)
    type: Optional[TypeIntervention] = Field(None, description="Type of intervention")
    date_planifiee: Optional[datetime] = Field(None, description="Planned date")
    duree_reparation: Optional[int] = Field(None, description="Reparation duration in minutes", gt=0)
    statut_intervention: Optional[str] = Field(
        None, 
        description="Intervention status",
        pattern="^(planifié|en_cours|terminé|annulé)$"
    )


class PlanningFilter(BaseModel):
    """Schema for filtering planning entries."""
    
    date_debut: Optional[datetime] = Field(None, description="Start date filter")
    date_fin: Optional[datetime] = Field(None, description="End date filter")
    id_technicien: Optional[int] = Field(None, description="Filter by technician ID")
    type_intervention: Optional[TypeIntervention] = Field(None, description="Filter by type")
    statut_intervention: Optional[str] = Field(
        None, 
        description="Filter by status",
        pattern="^(planifié|en_cours|terminé|annulé)$"
    )
