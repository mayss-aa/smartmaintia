"""create banc_test_bdd table

Revision ID: 0002_create_banc_test_bdd
Revises: 0001_create_utilisateur
Create Date: 2026-01-02 00:00:00
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0002_create_banc_test_bdd"
down_revision: str = "0001_create_utilisateur"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Create the table with ENUM directly
    op.create_table(
        "banc_test_bdd",
        sa.Column("code_banc", sa.String(length=50), nullable=False),
        sa.Column("nom", sa.String(length=100), nullable=False),
        sa.Column("emplacement", sa.String(length=150), nullable=False),
        sa.Column(
            "statut",
            sa.Enum(
                "OPERATIONNEL",
                "EN_PANNE", 
                "EN_MAINTENANCE",
                name="statutbanc",
                native_enum=True,
            ),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("code_banc"),
    )
    
    # Create index for better query performance
    op.create_index(
        "ix_banc_test_bdd_code_banc", "banc_test_bdd", ["code_banc"], unique=True
    )


def downgrade() -> None:
    op.drop_index("ix_banc_test_bdd_code_banc", table_name="banc_test_bdd")
    op.drop_table("banc_test_bdd")