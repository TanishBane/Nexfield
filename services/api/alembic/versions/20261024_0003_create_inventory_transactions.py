"""create inventory transactions

Revision ID: 20261024_0003
Revises: 20261024_0002
Create Date: 2026-10-24
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20261024_0003"
down_revision: Union[str, None] = "20261024_0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "inventory_transactions",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("farm_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("field_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("item_type", sa.String(), nullable=False),
        sa.Column("item_name", sa.String(), nullable=False),
        sa.Column("batch_number", sa.String(), nullable=True),
        sa.Column("transaction_type", sa.String(), nullable=False),
        sa.Column("quantity", sa.Float(), nullable=False),
        sa.Column("unit", sa.String(), nullable=False),
        sa.Column("unit_price_inr", sa.Float(), nullable=False),
        sa.Column("total_amount_inr", sa.Float(), nullable=False),
        sa.Column("balance_after_quantity", sa.Float(), nullable=False),
        sa.Column("supplier_or_vendor", sa.String(), nullable=True),
        sa.Column("transaction_date", sa.Date(), nullable=False),
        sa.Column("idempotency_key", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint(
            "item_type IN ('seed','chemical_fertilizer','organic_fertilizer','pesticide_fungicide',"
            "'fuel_diesel','machinery_spares')",
            name="ck_inventory_item_type",
        ),
        sa.CheckConstraint(
            "transaction_type IN ('purchase','usage','return','wastage_adjustment')",
            name="ck_inventory_transaction_type",
        ),
        sa.CheckConstraint("quantity > 0 AND quantity < 'Infinity'::float8", name="ck_inventory_quantity"),
        sa.CheckConstraint(
            "unit_price_inr > 0 AND unit_price_inr < 'Infinity'::float8",
            name="ck_inventory_unit_price",
        ),
        sa.CheckConstraint(
            "unit IN ('kg','liter','bag_50kg','unit','meter')",
            name="ck_inventory_unit",
        ),
        sa.ForeignKeyConstraint(["farm_id"], ["farms.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["field_id"], ["fields.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("farm_id", "idempotency_key", name="uq_inventory_idempotency"),
    )
    op.create_index("ix_inventory_transactions_farm_id", "inventory_transactions", ["farm_id"])
    op.create_index(
        "ix_inventory_farm_item_date",
        "inventory_transactions",
        ["farm_id", "item_name", "transaction_date"],
    )


def downgrade() -> None:
    op.drop_index("ix_inventory_farm_item_date", table_name="inventory_transactions")
    op.drop_index("ix_inventory_transactions_farm_id", table_name="inventory_transactions")
    op.drop_table("inventory_transactions")
