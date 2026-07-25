"""Pydantic schemas for authentication (login request and token response)."""

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """Credentials submitted to the login endpoint."""

    email: EmailStr
    password: str = Field(min_length=1)


class Token(BaseModel):
    """JWT access token returned after a successful login."""

    access_token: str
    token_type: str = "bearer"
