"""Pydantic schemas for the TicketMaintenance entity."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import StatutTicket


class TicketMaintenanceRead(BaseModel):
    """Public representation of a maintenance ticket."""

    model_config = ConfigDict(from_attributes=True)

    id_ticket: int
    code_banc: str = Field(max_length=50)
    symptome: str = Field(min_length=1, max_length=1000)
    criticite: str = Field(min_length=1, max_length=50)
    date_creation: datetime
    statut: StatutTicket


class TicketMaintenanceCreate(BaseModel):
    """Schema for creating a new maintenance ticket."""

    code_banc: str = Field(min_length=1, max_length=50)
    symptome: str = Field(min_length=1, max_length=1000)
    criticite: str = Field(min_length=1, max_length=50)
    statut: StatutTicket = StatutTicket.OUVERT


class TicketMaintenanceUpdate(BaseModel):
    """Schema for updating a maintenance ticket (all fields optional)."""

    symptome: Optional[str] = Field(None, min_length=1, max_length=1000)
    criticite: Optional[str] = Field(None, min_length=1, max_length=50)
    statut: Optional[StatutTicket] = None


class TicketMaintenanceWithBanc(TicketMaintenanceRead):
    """Ticket with banc information."""

    banc_nom: str = Field(max_length=100)
    banc_emplacement: str = Field(max_length=150)
    banc_statut: str = Field(max_length=20)