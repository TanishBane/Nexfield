"""create crop cycles and observations

Revision ID: 20261024_0002
Revises: 20261024_0001
Create Date: 2026-10-24
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20261024_0002"
down_revision: Union[str, None] = "20261024_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "crop_cycles",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("field_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("crop_name", sa.String(), nullable=False),
        sa.Column("variety", sa.String(), nullable=False),
        sa.Column("season", sa.String(), nullable=False),
        sa.Column("sowing_date", sa.Date(), nullable=False),
        sa.Column("expected_harvest_date", sa.Date(), nullable=False),
        sa.Column("actual_harvest_date", sa.Date(), nullable=True),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("target_yield_metric_tons", sa.Float(), nullable=False),
        sa.Column("actual_yield_metric_tons", sa.Float(), nullable=True),
        sa.Column("current_growth_stage", sa.String(), nullable=False),
        sa.Column("stage_progress_percent", sa.Float(), nullable=False),
        sa.Column("health_index_score", sa.Float(), server_default="85", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("season IN ('kharif','rabi','zaid')", name="ck_crop_cycles_season"),
        sa.CheckConstraint("status IN ('planned','active','harvested','failed')", name="ck_crop_cycles_status"),
        sa.CheckConstraint(
            "current_growth_stage IN ('seedling_germination','tillering','vegetative_growth',"
            "'flowering_panicle','grain_filling','physiological_maturity','harvest_ready')",
            name="ck_crop_cycles_growth_stage",
        ),
        sa.CheckConstraint("target_yield_metric_tons > 0", name="ck_crop_cycles_target_yield"),
        sa.CheckConstraint(
            "actual_yield_metric_tons IS NULL OR actual_yield_metric_tons > 0",
            name="ck_crop_cycles_actual_yield",
        ),
        sa.CheckConstraint(
            "stage_progress_percent >= 0 AND stage_progress_percent <= 100",
            name="ck_crop_cycles_progress",
        ),
        sa.CheckConstraint("health_index_score >= 0 AND health_index_score <= 100", name="ck_crop_cycles_health"),
        sa.ForeignKeyConstraint(["field_id"], ["fields.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_crop_cycles_field_id", "crop_cycles", ["field_id"])
    op.create_index("ix_crop_cycles_field_status", "crop_cycles", ["field_id", "status"])

    op.create_table(
        "observations",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("field_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("cycle_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("observer_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("observation_type", sa.String(), nullable=False),
        sa.Column("observed_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("metrics", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("notes", sa.String(), nullable=True),
        sa.Column("geo_tag", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("media_urls", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint(
            "observation_type IN ('iot_sensor_telemetry','satellite_ndvi','scouting_note',"
            "'weather_station','drone_multispectral')",
            name="ck_observations_type",
        ),
        sa.ForeignKeyConstraint(["cycle_id"], ["crop_cycles.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["field_id"], ["fields.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_observations_field_id", "observations", ["field_id"])
    op.create_index("ix_observations_field_timestamp", "observations", ["field_id", "observed_at"])


def downgrade() -> None:
    op.drop_index("ix_observations_field_timestamp", table_name="observations")
    op.drop_index("ix_observations_field_id", table_name="observations")
    op.drop_table("observations")
    op.drop_index("ix_crop_cycles_field_status", table_name="crop_cycles")
    op.drop_index("ix_crop_cycles_field_id", table_name="crop_cycles")
    op.drop_table("crop_cycles")
