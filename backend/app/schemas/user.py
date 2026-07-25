"""Pydantic schemas for the Utilisateur entity (read-only for authentication)."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.enums import RoleUtilisateur


class UtilisateurRead(BaseModel):
    """Public representation of a user (never exposes the password hash)."""

    model_config = ConfigDict(from_attributes=True)

    id_user: int
    nom: str
    prenom: str
    email: EmailStr
    role: RoleUtilisateur


class UtilisateurCreate(BaseModel):
    """Schema for creating a new user."""

    nom: str = Field(min_length=1, max_length=100)
    prenom: str = Field(min_length=1, max_length=100)
    email: EmailStr = Field(max_length=150)
    password: str = Field(min_length=6, max_length=72)
    role: RoleUtilisateur


class UtilisateurUpdate(BaseModel):
    """Schema for updating a user (all fields optional)."""

    nom: str | None = Field(None, min_length=1, max_length=100)
    prenom: str | None = Field(None, min_length=1, max_length=100)
    email: EmailStr | None = Field(None, max_length=150)
    password: str | None = Field(None, min_length=6, max_length=72)
    role: RoleUtilisateur | None = None
