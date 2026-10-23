"""create farms and fields

Revision ID: 20261024_0001
Revises:
Create Date: 2026-10-24
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20261024_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "farms",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("location", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("total_area_hectares", sa.Float(), nullable=False),
        sa.Column("soil_type", sa.String(), nullable=False),
        sa.Column("primary_irrigation", sa.String(), nullable=False),
        sa.Column("boundary_geo_json", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("active_crop_cycle_count", sa.Integer(), server_default="0", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("archived_at", sa.DateTime(timezone=True), nullable=True),
        sa.CheckConstraint("length(trim(name)) >= 2", name="ck_farms_name"),
        sa.CheckConstraint(
            "total_area_hectares > 0 AND total_area_hectares < 'Infinity'::float8",
            name="ck_farms_area",
        ),
        sa.CheckConstraint(
            "soil_type IN ('alluvial','black_cotton','red_loamy','laterite','clay_loam','sandy_loam')",
            name="ck_farms_soil_type",
        ),
        sa.CheckConstraint(
            "primary_irrigation IN ('canal','borewell','drip_irrigation','sprinkler','rainfed')",
            name="ck_farms_irrigation",
        ),
        sa.CheckConstraint("active_crop_cycle_count >= 0", name="ck_farms_cycle_count"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_farms_owner_active", "farms", ["owner_id", "archived_at"])

    op.create_table(
        "fields",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("farm_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("code", sa.String(), nullable=False),
        sa.Column("area_hectares", sa.Float(), nullable=False),
        sa.Column("soil_metrics", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("polygon_coordinates", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint(
            "length(trim(name)) >= 1 AND length(trim(code)) >= 1",
            name="ck_fields_labels",
        ),
        sa.CheckConstraint(
            "area_hectares > 0 AND area_hectares < 'Infinity'::float8",
            name="ck_fields_area",
        ),
        sa.ForeignKeyConstraint(["farm_id"], ["farms.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("farm_id", "code", name="uq_fields_farm_code"),
    )
    op.create_index("ix_fields_farm_id", "fields", ["farm_id"])


def downgrade() -> None:
    op.drop_index("ix_fields_farm_id", table_name="fields")
    op.drop_table("fields")
    op.drop_index("ix_farms_owner_active", table_name="farms")
    op.drop_table("farms")
