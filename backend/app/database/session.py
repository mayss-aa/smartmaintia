"""SQLAlchemy engine, session factory and declarative base.

This module provides the technical database foundation only. No business
model is declared here; ORM models will be added in later tasks and must
inherit from :class:`Base`.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config.settings import settings

# The engine is created lazily; no connection is opened until first use.
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    echo=settings.DEBUG,
    future=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Declarative base class for all SQLAlchemy ORM models."""


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency yielding a database session and closing it afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
