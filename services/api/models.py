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


class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"
    __table_args__ = (
        CheckConstraint(
            "item_type IN ('seed','chemical_fertilizer','organic_fertilizer','pesticide_fungicide',"
            "'fuel_diesel','machinery_spares')",
            name="ck_inventory_item_type",
        ),
        CheckConstraint(
            "transaction_type IN ('purchase','usage','return','wastage_adjustment')",
            name="ck_inventory_transaction_type",
        ),
        CheckConstraint("quantity > 0 AND quantity < 'Infinity'::float8", name="ck_inventory_quantity"),
        CheckConstraint("unit_price_inr > 0 AND unit_price_inr < 'Infinity'::float8", name="ck_inventory_unit_price"),
        CheckConstraint(
            "unit IN ('kg','liter','bag_50kg','unit','meter')",
            name="ck_inventory_unit",
        ),
        UniqueConstraint("farm_id", "idempotency_key", name="uq_inventory_idempotency"),
        Index("ix_inventory_farm_item_date", "farm_id", "item_name", "transaction_date"),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    farm_id: Mapped[UUID] = mapped_column(ForeignKey("farms.id", ondelete="RESTRICT"), index=True)
    field_id: Mapped[UUID | None] = mapped_column(ForeignKey("fields.id", ondelete="RESTRICT"))
    item_type: Mapped[str] = mapped_column(String)
    item_name: Mapped[str] = mapped_column(String)
    batch_number: Mapped[str | None] = mapped_column(String)
    transaction_type: Mapped[str] = mapped_column(String)
    quantity: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String)
    unit_price_inr: Mapped[float] = mapped_column(Float)
    total_amount_inr: Mapped[float] = mapped_column(Float)
    balance_after_quantity: Mapped[float] = mapped_column(Float)
    supplier_or_vendor: Mapped[str | None] = mapped_column(String)
    transaction_date: Mapped[date] = mapped_column(Date)
    idempotency_key: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class FarmTask(Base):
    __tablename__ = "farm_tasks"
    __table_args__ = (
        CheckConstraint(
            "category IN ('irrigation','fertilization','spraying_pest_control','crop_scouting',"
            "'harvesting','equipment_maintenance','soil_testing')",
            name="ck_farm_tasks_category",
        ),
        CheckConstraint(
            "priority IN ('low','medium','high','urgent')",
            name="ck_farm_tasks_priority",
        ),
        CheckConstraint(
            "status IN ('todo','in_progress','completed','cancelled')",
            name="ck_farm_tasks_status",
        ),
        CheckConstraint(
            "cost_estimate_inr IS NULL OR cost_estimate_inr >= 0",
            name="ck_farm_tasks_estimated_cost",
        ),
        CheckConstraint(
            "actual_cost_inr IS NULL OR actual_cost_inr >= 0",
            name="ck_farm_tasks_actual_cost",
        ),
        Index("ix_farm_tasks_farm_status_due", "farm_id", "status", "due_date"),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    farm_id: Mapped[UUID] = mapped_column(ForeignKey("farms.id", ondelete="RESTRICT"), index=True)
    field_id: Mapped[UUID | None] = mapped_column(ForeignKey("fields.id", ondelete="RESTRICT"))
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str | None] = mapped_column(String)
    category: Mapped[str] = mapped_column(String)
    priority: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, server_default="todo")
    assigned_to_user_id: Mapped[UUID | None] = mapped_column(nullable=True)
    assigned_to_name: Mapped[str | None] = mapped_column(String)
    due_date: Mapped[date] = mapped_column(Date)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    cost_estimate_inr: Mapped[float | None] = mapped_column(Float)
    actual_cost_inr: Mapped[float | None] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class HarvestBatch(Base):
    __tablename__ = "harvest_batches"
    __table_args__ = (
        UniqueConstraint("farm_id", "batch_code", name="uq_harvest_batches_farm_code"),
        CheckConstraint("total_quantity_kg > 0 AND total_quantity_kg < 'Infinity'::float8", name="ck_harvest_batches_quantity"),
        CheckConstraint("moisture_content_percent >= 0 AND moisture_content_percent <= 40", name="ck_harvest_batches_moisture"),
        CheckConstraint("foreign_matter_percent >= 0 AND foreign_matter_percent <= 20", name="ck_harvest_batches_foreign_matter"),
        CheckConstraint(
            "quality_grade IN ('Grade_A_Export','Grade_B_Domestic_Premium',"
            "'Grade_C_Standard_Mandi','Grade_D_Processing_Feed')",
            name="ck_harvest_batches_quality_grade",
        ),
        CheckConstraint(
            "dispatch_status IN ('in_warehouse_storage','consignment_booked','in_transit','settled_at_mandi')",
            name="ck_harvest_batches_dispatch_status",
        ),
        CheckConstraint(
            "target_mandi_price_inr_per_quintal IS NULL OR target_mandi_price_inr_per_quintal > 0",
            name="ck_harvest_batches_target_price",
        ),
        CheckConstraint(
            "sold_price_inr_per_quintal IS NULL OR sold_price_inr_per_quintal > 0",
            name="ck_harvest_batches_sold_price",
        ),
        Index("ix_harvest_batches_farm_date", "farm_id", "harvest_date"),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    farm_id: Mapped[UUID] = mapped_column(ForeignKey("farms.id", ondelete="RESTRICT"), index=True)
    field_id: Mapped[UUID] = mapped_column(ForeignKey("fields.id", ondelete="RESTRICT"))
    cycle_id: Mapped[UUID] = mapped_column(ForeignKey("crop_cycles.id", ondelete="RESTRICT"))
    batch_code: Mapped[str] = mapped_column(String)
    crop_name: Mapped[str] = mapped_column(String)
    variety: Mapped[str] = mapped_column(String)
    harvest_date: Mapped[date] = mapped_column(Date)
    total_quantity_kg: Mapped[float] = mapped_column(Float)
    quality_grade: Mapped[str] = mapped_column(String)
    moisture_content_percent: Mapped[float] = mapped_column(Float)
    foreign_matter_percent: Mapped[float] = mapped_column(Float)
    storage_warehouse: Mapped[str] = mapped_column(String)
    dispatch_status: Mapped[str] = mapped_column(String, server_default="in_warehouse_storage")
    target_mandi_price_inr_per_quintal: Mapped[float | None] = mapped_column(Float)
    sold_price_inr_per_quintal: Mapped[float | None] = mapped_column(Float)
    buyer_entity: Mapped[str | None] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class FarmExpense(Base):
    __tablename__ = "farm_expenses"
    __table_args__ = (
        CheckConstraint(
            "category IN ('labor','seeds','fertilizer','pesticide','irrigation','equipment',"
            "'fuel','transport','storage','land_rent','other')",
            name="ck_farm_expenses_category",
        ),
        CheckConstraint("amount_inr > 0 AND amount_inr < 'Infinity'::float8", name="ck_farm_expenses_amount"),
        UniqueConstraint("farm_id", "idempotency_key", name="uq_farm_expenses_idempotency"),
        Index("ix_farm_expenses_farm_date", "farm_id", "expense_date"),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    farm_id: Mapped[UUID] = mapped_column(ForeignKey("farms.id", ondelete="RESTRICT"), index=True)
    field_id: Mapped[UUID | None] = mapped_column(ForeignKey("fields.id", ondelete="RESTRICT"))
    cycle_id: Mapped[UUID | None] = mapped_column(ForeignKey("crop_cycles.id", ondelete="RESTRICT"))
    category: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    amount_inr: Mapped[float] = mapped_column(Float)
    vendor: Mapped[str | None] = mapped_column(String)
    expense_date: Mapped[date] = mapped_column(Date)
    idempotency_key: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
