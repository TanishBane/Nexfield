"""Farm records only. Identity and login remain managed by Supabase Auth."""
from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, Index, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Farm(Base):
    __tablename__ = "farms"
    __table_args__ = (
        CheckConstraint("length(trim(name)) >= 2", name="ck_farms_name"),
        CheckConstraint("total_area_hectares > 0 AND total_area_hectares < 'Infinity'::float8", name="ck_farms_area"),
        CheckConstraint("soil_type IN ('alluvial','black_cotton','red_loamy','laterite','clay_loam','sandy_loam')", name="ck_farms_soil_type"),
        CheckConstraint("primary_irrigation IN ('canal','borewell','drip_irrigation','sprinkler','rainfed')", name="ck_farms_irrigation"),
        CheckConstraint("active_crop_cycle_count >= 0", name="ck_farms_cycle_count"),
        Index("ix_farms_owner_active", "owner_id", "archived_at"),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    # Verified external identity, not a foreign key into a provider-managed table.
    owner_id: Mapped[UUID] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String)
    location: Mapped[dict[str, Any]] = mapped_column(JSONB)
    total_area_hectares: Mapped[float] = mapped_column(Float)
    soil_type: Mapped[str] = mapped_column(String)
    primary_irrigation: Mapped[str] = mapped_column(String)
    boundary_geo_json: Mapped[dict[str, Any] | None] = mapped_column(JSONB)
    active_crop_cycle_count: Mapped[int] = mapped_column(default=0, server_default="0")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    archived_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Field(Base):
    __tablename__ = "fields"
    __table_args__ = (
        UniqueConstraint("farm_id", "code", name="uq_fields_farm_code"),
        CheckConstraint("length(trim(name)) >= 1 AND length(trim(code)) >= 1", name="ck_fields_labels"),
        CheckConstraint("area_hectares > 0 AND area_hectares < 'Infinity'::float8", name="ck_fields_area"),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    farm_id: Mapped[UUID] = mapped_column(ForeignKey("farms.id", ondelete="RESTRICT"), index=True)
    name: Mapped[str] = mapped_column(String)
    code: Mapped[str] = mapped_column(String)
    area_hectares: Mapped[float] = mapped_column(Float)
    # SoilMetricsSchema's named units; no fabricated default sensor readings.
    soil_metrics: Mapped[dict[str, Any]] = mapped_column(JSONB)
    polygon_coordinates: Mapped[list[list[float]] | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
