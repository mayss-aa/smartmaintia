"""add_priorite_to_intervention

Adds the ``priorite`` column to the ``intervention`` table.

This column is part of the intended domain model: it is consumed by the
frontend Planning "Priorité" column and produced by the New Intervention
form (values BASSE / MOYENNE / HAUTE / CRITIQUE). The column was declared in
the SQLAlchemy model and Pydantic schemas but the corresponding migration had
never been applied to the database, causing an ``Unknown column
'intervention.priorite'`` error (HTTP 500) on every query loading interventions.

Revision ID: c6d74afa6133
Revises: f26b9a6ae4cd
Create Date: 2026-07-18 21:42:06.568723+00:00
"""
from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c6d74afa6133'
down_revision: str | None = 'f26b9a6ae4cd'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column('intervention', sa.Column('priorite', sa.String(length=50), nullable=True))


def downgrade() -> None:
    op.drop_column('intervention', 'priorite')
