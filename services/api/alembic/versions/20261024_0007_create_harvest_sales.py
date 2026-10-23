"""create harvest sales

Revision ID: 20261024_0007
Revises: 20261024_0006
Create Date: 2026-10-24
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20261024_0007"
down_revision: Union[str, None] = "20261024_0006"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "harvest_sales",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("farm_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("batch_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("quantity_kg", sa.Float(), nullable=False),
        sa.Column("price_inr_per_quintal", sa.Float(), nullable=False),
        sa.Column("total_amount_inr", sa.Float(), nullable=False),
        sa.Column("buyer_entity", sa.String(), nullable=False),
        sa.Column("sale_date", sa.Date(), nullable=False),
        sa.Column("idempotency_key", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint(
            "quantity_kg > 0 AND quantity_kg < 'Infinity'::float8",
            name="ck_harvest_sales_quantity",
        ),
        sa.CheckConstraint(
            "price_inr_per_quintal > 0 AND price_inr_per_quintal < 'Infinity'::float8",
            name="ck_harvest_sales_price",
        ),
        sa.CheckConstraint(
            "total_amount_inr > 0 AND total_amount_inr < 'Infinity'::float8",
            name="ck_harvest_sales_total",
        ),
        sa.ForeignKeyConstraint(["farm_id"], ["farms.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["batch_id"], ["harvest_batches.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("farm_id", "idempotency_key", name="uq_harvest_sales_idempotency"),
    )
    op.create_index("ix_harvest_sales_farm_id", "harvest_sales", ["farm_id"])
    op.create_index("ix_harvest_sales_batch_id", "harvest_sales", ["batch_id"])
    op.create_index("ix_harvest_sales_farm_date", "harvest_sales", ["farm_id", "sale_date"])


def downgrade() -> None:
    op.drop_index("ix_harvest_sales_farm_date", table_name="harvest_sales")
    op.drop_index("ix_harvest_sales_batch_id", table_name="harvest_sales")
    op.drop_index("ix_harvest_sales_farm_id", table_name="harvest_sales")
    op.drop_table("harvest_sales")
