"""add_id_user_to_ticket_maintenance

Adds the ``id_user`` foreign-key column to the ``ticket_maintenance``
table so that every ticket created by a Production Operator is
permanently linked to its author.

Revision ID: 0005_add_id_user_to_ticket
Revises: c6d74afa6133
Create Date: 2026-07-19 13:30:00.000000+00:00
"""
from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0005_add_id_user_to_ticket'
down_revision: str | None = 'c6d74afa6133'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        'ticket_maintenance',
        sa.Column('id_user', sa.Integer(), nullable=False),
    )
    op.create_foreign_key(
        'fk_ticket_maintenance_id_user',
        'ticket_maintenance',
        'utilisateur',
        ['id_user'],
        ['id_user'],
    )


def downgrade() -> None:
    op.drop_constraint('fk_ticket_maintenance_id_user', 'ticket_maintenance', type_='foreignkey')
    op.drop_column('ticket_maintenance', 'id_user')
