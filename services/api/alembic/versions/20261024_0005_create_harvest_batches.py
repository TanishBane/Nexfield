"""create harvest batches

Revision ID: 20261024_0005
Revises: 20261024_0004
Create Date: 2026-10-24
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20261024_0005"
down_revision: Union[str, None] = "20261024_0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "harvest_batches",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("farm_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("field_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("cycle_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("batch_code", sa.String(), nullable=False),
        sa.Column("crop_name", sa.String(), nullable=False),
        sa.Column("variety", sa.String(), nullable=False),
        sa.Column("harvest_date", sa.Date(), nullable=False),
        sa.Column("total_quantity_kg", sa.Float(), nullable=False),
        sa.Column("quality_grade", sa.String(), nullable=False),
        sa.Column("moisture_content_percent", sa.Float(), nullable=False),
        sa.Column("foreign_matter_percent", sa.Float(), nullable=False),
        sa.Column("storage_warehouse", sa.String(), nullable=False),
        sa.Column("dispatch_status", sa.String(), server_default="in_warehouse_storage", nullable=False),
        sa.Column("target_mandi_price_inr_per_quintal", sa.Float(), nullable=True),
        sa.Column("sold_price_inr_per_quintal", sa.Float(), nullable=True),
        sa.Column("buyer_entity", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("total_quantity_kg > 0 AND total_quantity_kg < 'Infinity'::float8", name="ck_harvest_batches_quantity"),
        sa.CheckConstraint("moisture_content_percent >= 0 AND moisture_content_percent <= 40", name="ck_harvest_batches_moisture"),
        sa.CheckConstraint("foreign_matter_percent >= 0 AND foreign_matter_percent <= 20", name="ck_harvest_batches_foreign_matter"),
        sa.CheckConstraint(
            "quality_grade IN ('Grade_A_Export','Grade_B_Domestic_Premium','Grade_C_Standard_Mandi','Grade_D_Processing_Feed')",
            name="ck_harvest_batches_quality_grade",
        ),
        sa.CheckConstraint(
            "dispatch_status IN ('in_warehouse_storage','consignment_booked','in_transit','settled_at_mandi')",
            name="ck_harvest_batches_dispatch_status",
        ),
        sa.CheckConstraint(
            "target_mandi_price_inr_per_quintal IS NULL OR target_mandi_price_inr_per_quintal > 0",
            name="ck_harvest_batches_target_price",
        ),
        sa.CheckConstraint(
            "sold_price_inr_per_quintal IS NULL OR sold_price_inr_per_quintal > 0",
            name="ck_harvest_batches_sold_price",
        ),
        sa.ForeignKeyConstraint(["farm_id"], ["farms.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["field_id"], ["fields.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["cycle_id"], ["crop_cycles.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("farm_id", "batch_code", name="uq_harvest_batches_farm_code"),
    )
    op.create_index("ix_harvest_batches_farm_id", "harvest_batches", ["farm_id"])
    op.create_index("ix_harvest_batches_farm_date", "harvest_batches", ["farm_id", "harvest_date"])


def downgrade() -> None:
    op.drop_index("ix_harvest_batches_farm_date", table_name="harvest_batches")
    op.drop_index("ix_harvest_batches_farm_id", table_name="harvest_batches")
    op.drop_table("harvest_batches")
