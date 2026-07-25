"""create utilisateur table

Revision ID: 0001_create_utilisateur
Revises:
Create Date: 2026-01-01 00:00:00
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0001_create_utilisateur"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "utilisateur",
        sa.Column("id_user", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("nom", sa.String(length=100), nullable=False),
        sa.Column("prenom", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=150), nullable=False),
        sa.Column("mot_de_passe_hash", sa.String(length=255), nullable=False),
        sa.Column(
            "role",
            sa.Enum(
                "ADMINISTRATEUR",
                "MANAGER_MAINTENANCE",
                "TECHNICIEN",
                "OPERATEUR_PRODUCTION",
                name="roleutilisateur",
            ),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id_user"),
    )
    op.create_index(
        "ix_utilisateur_email", "utilisateur", ["email"], unique=True
    )


def downgrade() -> None:
    op.drop_index("ix_utilisateur_email", table_name="utilisateur")
    op.drop_table("utilisateur")
