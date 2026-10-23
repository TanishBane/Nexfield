"""Farm records only. Identity and login remain managed by Supabase Auth."""
from datetime import date, datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import CheckConstraint, Date, DateTime, Float, ForeignKey, Index, Integer, String, UniqueConstraint, func
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


class CropCycle(Base):
    __tablename__ = "crop_cycles"
    __table_args__ = (
        CheckConstraint(
            "season IN ('kharif','rabi','zaid')",
            name="ck_crop_cycles_season",
        ),
        CheckConstraint(
            "status IN ('planned','active','harvested','failed')",
            name="ck_crop_cycles_status",
        ),
        CheckConstraint(
            "current_growth_stage IN ('seedling_germination','tillering','vegetative_growth',"
            "'flowering_panicle','grain_filling','physiological_maturity','harvest_ready')",
            name="ck_crop_cycles_growth_stage",
        ),
        CheckConstraint("target_yield_metric_tons > 0", name="ck_crop_cycles_target_yield"),
        CheckConstraint(
            "actual_yield_metric_tons IS NULL OR actual_yield_metric_tons > 0",
            name="ck_crop_cycles_actual_yield",
        ),
        CheckConstraint(
            "stage_progress_percent >= 0 AND stage_progress_percent <= 100",
            name="ck_crop_cycles_progress",
        ),
        CheckConstraint(
            "health_index_score >= 0 AND health_index_score <= 100",
            name="ck_crop_cycles_health",
        ),
        Index("ix_crop_cycles_field_status", "field_id", "status"),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    field_id: Mapped[UUID] = mapped_column(ForeignKey("fields.id", ondelete="RESTRICT"), index=True)
    crop_name: Mapped[str] = mapped_column(String)
    variety: Mapped[str] = mapped_column(String)
    season: Mapped[str] = mapped_column(String)
    sowing_date: Mapped[date] = mapped_column(Date)
    expected_harvest_date: Mapped[date] = mapped_column(Date)
    actual_harvest_date: Mapped[date | None] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String)
    target_yield_metric_tons: Mapped[float] = mapped_column(Float)
    actual_yield_metric_tons: Mapped[float | None] = mapped_column(Float)
    current_growth_stage: Mapped[str] = mapped_column(String)
    stage_progress_percent: Mapped[float] = mapped_column(Float)
    health_index_score: Mapped[float] = mapped_column(Float, server_default="85")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Observation(Base):
    __tablename__ = "observations"
    __table_args__ = (
        CheckConstraint(
            "observation_type IN ('iot_sensor_telemetry','satellite_ndvi','scouting_note',"
            "'weather_station','drone_multispectral')",
            name="ck_observations_type",
        ),
        Index("ix_observations_field_timestamp", "field_id", "observed_at"),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    field_id: Mapped[UUID] = mapped_column(ForeignKey("fields.id", ondelete="RESTRICT"), index=True)
    cycle_id: Mapped[UUID | None] = mapped_column(ForeignKey("crop_cycles.id", ondelete="SET NULL"))
    observer_id: Mapped[UUID | None] = mapped_column(nullable=True)
    observation_type: Mapped[str] = mapped_column(String)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    metrics: Mapped[dict[str, float | str]] = mapped_column(JSONB)
    notes: Mapped[str | None] = mapped_column(String)
    geo_tag: Mapped[dict[str, float] | None] = mapped_column(JSONB)
    media_urls: Mapped[list[str] | None] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
