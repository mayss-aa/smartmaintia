"""Pydantic schemas for the HistoriqueGlobal entity."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class HistoriqueRead(BaseModel):
    """Public representation of a global history record."""

    model_config = ConfigDict(from_attributes=True)

    id_historique: int
    code_banc: str = Field(max_length=50)
    id_intervention: int
    type_action: str = Field(max_length=100)
    rapport_clean_ia: str
    date_cloture: datetime
    mttr_calcule: Optional[int] = Field(None, ge=0)