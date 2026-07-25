"""Pydantic schemas for the ``AlertePredictive`` entity (see ERD.md / API_SPECIFICATION.md)."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AlertePredictiveBase(BaseModel):
    """Base schema shared by all AlertePredictive schemas."""

    code_banc: str = Field(..., description="Code unique du banc", examples=["BANC-001"])
    composant_cible: str = Field(..., description="Composant surveillé", examples=["Moteur", "Pompe"])
    probabilite_panne: float = Field(..., description="Probabilité estimée", ge=0.0, le=1.0, examples=[0.85])
    date_detection: datetime = Field(..., description="Date de détection")
    statut_alerte: str = Field(..., description="Statut de l'alerte", examples=["Nouvelle", "Validée", "Archivée"])


class AlertePredictiveCreate(AlertePredictiveBase):
    """Schema for creating a new AlertePredictive."""

    pass


class AlertePredictiveUpdate(BaseModel):
    """Schema for updating an existing AlertePredictive."""

    code_banc: str | None = Field(None, description="Code unique du banc", examples=["BANC-001"])
    composant_cible: str | None = Field(None, description="Composant surveillé", examples=["Moteur", "Pompe"])
    probabilite_panne: float | None = Field(None, description="Probabilité estimée", ge=0.0, le=1.0, examples=[0.85])
    date_detection: datetime | None = Field(None, description="Date de détection")
    statut_alerte: str | None = Field(None, description="Statut de l'alerte", examples=["Nouvelle", "Validée", "Archivée"])


class AlertePredictiveRead(AlertePredictiveBase):
    """Schema for reading an AlertePredictive (includes all fields)."""

    id_alerte: int = Field(..., description="Identifiant unique")

    model_config = ConfigDict(from_attributes=True)


class AlertePredictiveSimple(BaseModel):
    """Simplified schema for list endpoints."""

    id_alerte: int = Field(..., description="Identifiant unique")
    code_banc: str = Field(..., description="Code unique du banc", examples=["BANC-001"])
    composant_cible: str = Field(..., description="Composant surveillé", examples=["Moteur", "Pompe"])
    probabilite_panne: float = Field(..., description="Probabilité estimée", examples=[0.85])
    date_detection: datetime = Field(..., description="Date de détection")
    statut_alerte: str = Field(..., description="Statut de l'alerte", examples=["Nouvelle", "Validée", "Archivée"])

    model_config = ConfigDict(from_attributes=True)