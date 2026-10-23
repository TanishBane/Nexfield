"""create farm expenses

Revision ID: 20261024_0006
Revises: 20261024_0005
Create Date: 2026-10-24
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20261024_0006"
down_revision: Union[str, None] = "20261024_0005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "farm_expenses",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("farm_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("field_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("cycle_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("category", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("amount_inr", sa.Float(), nullable=False),
        sa.Column("vendor", sa.String(), nullable=True),
        sa.Column("expense_date", sa.Date(), nullable=False),
        sa.Column("idempotency_key", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint(
            "category IN ('labor','seeds','fertilizer','pesticide','irrigation','equipment',"
            "'fuel','transport','storage','land_rent','other')",
            name="ck_farm_expenses_category",
        ),
        sa.CheckConstraint(
            "amount_inr > 0 AND amount_inr < 'Infinity'::float8",
            name="ck_farm_expenses_amount",
        ),
        sa.ForeignKeyConstraint(["farm_id"], ["farms.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["field_id"], ["fields.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["cycle_id"], ["crop_cycles.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("farm_id", "idempotency_key", name="uq_farm_expenses_idempotency"),
    )
    op.create_index("ix_farm_expenses_farm_id", "farm_expenses", ["farm_id"])
    op.create_index("ix_farm_expenses_farm_date", "farm_expenses", ["farm_id", "expense_date"])


def downgrade() -> None:
    op.drop_index("ix_farm_expenses_farm_date", table_name="farm_expenses")
    op.drop_index("ix_farm_expenses_farm_id", table_name="farm_expenses")
    op.drop_table("farm_expenses")
