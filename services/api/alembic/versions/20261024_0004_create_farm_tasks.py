"""create farm tasks

Revision ID: 20261024_0004
Revises: 20261024_0003
Create Date: 2026-10-24
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20261024_0004"
down_revision: Union[str, None] = "20261024_0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "farm_tasks",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("farm_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("field_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.String(), nullable=True),
        sa.Column("category", sa.String(), nullable=False),
        sa.Column("priority", sa.String(), nullable=False),
        sa.Column("status", sa.String(), server_default="todo", nullable=False),
        sa.Column("assigned_to_user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("assigned_to_name", sa.String(), nullable=True),
        sa.Column("due_date", sa.Date(), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("cost_estimate_inr", sa.Float(), nullable=True),
        sa.Column("actual_cost_inr", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint(
            "category IN ('irrigation','fertilization','spraying_pest_control','crop_scouting',"
            "'harvesting','equipment_maintenance','soil_testing')",
            name="ck_farm_tasks_category",
        ),
        sa.CheckConstraint("priority IN ('low','medium','high','urgent')", name="ck_farm_tasks_priority"),
        sa.CheckConstraint(
            "status IN ('todo','in_progress','completed','cancelled')",
            name="ck_farm_tasks_status",
        ),
        sa.CheckConstraint(
            "cost_estimate_inr IS NULL OR cost_estimate_inr >= 0",
            name="ck_farm_tasks_estimated_cost",
        ),
        sa.CheckConstraint(
            "actual_cost_inr IS NULL OR actual_cost_inr >= 0",
            name="ck_farm_tasks_actual_cost",
        ),
        sa.ForeignKeyConstraint(["farm_id"], ["farms.id"], ondelete="RESTRICT"),
        sa.ForeignKeyConstraint(["field_id"], ["fields.id"], ondelete="RESTRICT"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_farm_tasks_farm_id", "farm_tasks", ["farm_id"])
    op.create_index("ix_farm_tasks_farm_status_due", "farm_tasks", ["farm_id", "status", "due_date"])


def downgrade() -> None:
    op.drop_index("ix_farm_tasks_farm_status_due", table_name="farm_tasks")
    op.drop_index("ix_farm_tasks_farm_id", table_name="farm_tasks")
    op.drop_table("farm_tasks")
