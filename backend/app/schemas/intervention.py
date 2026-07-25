"""Pydantic schemas for the Intervention entity."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import PrioriteIntervention, TypeIntervention


class InterventionRead(BaseModel):
    """Public representation of a maintenance intervention."""

    model_config = ConfigDict(from_attributes=True)

    id_intervention: int
    id_technicien: int
    id_manager: int
    id_ticket: Optional[int] = None
    id_alerte: Optional[int] = None
    type: TypeIntervention
    priorite: Optional[PrioriteIntervention] = None
    date_planifiee: datetime
    duree_reparation: Optional[int] = Field(None, ge=0)
    statut_intervention: str = Field(min_length=1, max_length=50)


class InterventionCreate(BaseModel):
    """Schema for creating a new maintenance intervention."""

    id_technicien: int
    id_manager: int
    id_ticket: Optional[int] = None
    id_alerte: Optional[int] = None
    type: TypeIntervention
    priorite: Optional[PrioriteIntervention] = None
    date_planifiee: datetime
    duree_reparation: Optional[int] = Field(None, ge=0)
    statut_intervention: str = Field(min_length=1, max_length=50)


class InterventionUpdate(BaseModel):
    """Schema for updating a maintenance intervention (all fields optional)."""

    id_technicien: Optional[int] = None
    id_manager: Optional[int] = None
    id_ticket: Optional[int] = None
    id_alerte: Optional[int] = None
    type: Optional[TypeIntervention] = None
    priorite: Optional[PrioriteIntervention] = None
    date_planifiee: Optional[datetime] = None
    duree_reparation: Optional[int] = Field(None, ge=0)
    statut_intervention: Optional[str] = Field(None, min_length=1, max_length=50)


class InterventionCompleteRequest(BaseModel):
    rapport: Optional[str] = None
    actions_realisees: Optional[str] = None
    commentaire: Optional[str] = None


class InterventionWithRelations(InterventionRead):
    """Intervention with related user information."""

    technicien_nom: str = Field(max_length=100)
    technicien_prenom: str = Field(max_length=100)
    manager_nom: str = Field(max_length=100)
    manager_prenom: str = Field(max_length=100)
    ticket_code_banc: Optional[str] = Field(None, max_length=50)
    rapport_clean_ia: Optional[str] = Field(None, description="Technician report from HistoriqueGlobal")