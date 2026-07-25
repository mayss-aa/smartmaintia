"""Pydantic schemas for the BancTestBDD entity."""

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import StatutBanc


class BancTestBDDRead(BaseModel):
    """Public representation of a test bench."""

    model_config = ConfigDict(from_attributes=True)

    code_banc: str = Field(max_length=50)
    nom: str = Field(min_length=1, max_length=100)
    emplacement: str = Field(min_length=1, max_length=150)
    statut: StatutBanc


class BancTestBDDCreate(BaseModel):
    """Schema for creating a new test bench."""

    code_banc: str = Field(min_length=1, max_length=50)
    nom: str = Field(min_length=1, max_length=100)
    emplacement: str = Field(min_length=1, max_length=150)
    statut: StatutBanc


class BancTestBDDUpdate(BaseModel):
    """Schema for updating a test bench (all fields optional)."""

    nom: str | None = Field(None, min_length=1, max_length=100)
    emplacement: str | None = Field(None, min_length=1, max_length=150)
    statut: StatutBanc | None = None
