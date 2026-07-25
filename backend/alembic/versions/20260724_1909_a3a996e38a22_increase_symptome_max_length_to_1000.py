"""increase_symptome_max_length_to_1000

Revision ID: a3a996e38a22
Revises: 0005_add_id_user_to_ticket
Create Date: 2026-07-24 19:09:38.208798+00:00
"""
from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'a3a996e38a22'
down_revision: str | None = '0005_add_id_user_to_ticket'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.alter_column('ticket_maintenance', 'symptome',
               existing_type=mysql.VARCHAR(length=255),
               type_=sa.String(length=1000),
               existing_nullable=False)


def downgrade() -> None:
    op.alter_column('ticket_maintenance', 'symptome',
               existing_type=sa.String(length=1000),
               type_=mysql.VARCHAR(length=255),
               existing_nullable=False)
