"""Camel-case DTOs compatible with packages/contracts; writes are additive proposals."""
from datetime import date, datetime, timezone
from typing import Annotated, Any, Generic, Literal, TypeVar
from uuid import UUID

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, HttpUrl, StrictStr, field_serializer, model_validator
from pydantic.alias_generators import to_camel


class ContractModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True,
                              from_attributes=True, extra="forbid", allow_inf_nan=False)


SoilType = Literal["alluvial", "black_cotton", "red_loamy", "laterite", "clay_loam", "sandy_loam"]
IrrigationSource = Literal["canal", "borewell", "drip_irrigation", "sprinkler", "rainfed"]
CropSeason = Literal["kharif", "rabi", "zaid"]
CropCycleStatus = Literal["planned", "active", "harvested", "failed"]
GrowthStage = Literal[
    "seedling_germination",
    "tillering",
    "vegetative_growth",
    "flowering_panicle",
    "grain_filling",
    "physiological_maturity",
    "harvest_ready",
]
ObservationType = Literal[
    "iot_sensor_telemetry",
    "satellite_ndvi",
    "scouting_note",
    "weather_station",
    "drone_multispectral",
]
PositiveArea = Annotated[float, Field(gt=0, strict=True)]
FarmName = Annotated[StrictStr, Field(min_length=2)]


class GeoLocation(ContractModel):
    latitude: Annotated[float, Field(ge=-90, le=90, strict=True)]
    longitude: Annotated[float, Field(ge=-180, le=180, strict=True)]
    address: StrictStr
    state: StrictStr
    district: StrictStr
    pin_code: StrictStr


class FarmCreate(ContractModel):
    name: FarmName
    location: GeoLocation
    total_area_hectares: PositiveArea
    soil_type: SoilType
    primary_irrigation: IrrigationSource
    boundary_geo_json: dict[str, Any] | None = None

    @model_validator(mode="after")
    def meaningful_name(self) -> "FarmCreate":
        if len(self.name.strip()) < 2:
            raise ValueError("name must contain at least two non-padding characters")
        return self


class FarmPatch(ContractModel):
    name: FarmName | None = None
    location: GeoLocation | None = None
    total_area_hectares: PositiveArea | None = None
    soil_type: SoilType | None = None
    primary_irrigation: IrrigationSource | None = None
    boundary_geo_json: dict[str, Any] | None = None

    @model_validator(mode="after")
    def valid_patch(self) -> "FarmPatch":
        if not self.model_fields_set:
            raise ValueError("Provide at least one writable farm field")
        for name in self.model_fields_set - {"boundary_geo_json"}:
            if getattr(self, name) is None:
                raise ValueError(f"{name} cannot be null")
        if self.name is not None and len(self.name.strip()) < 2:
            raise ValueError("name must contain at least two non-padding characters")
        return self


class RecordTimestamps(ContractModel):
    created_at: AwareDatetime
    updated_at: AwareDatetime

    @field_serializer("created_at", "updated_at")
    def utc_timestamp(self, value: datetime) -> str:
        # z.string().datetime() requires Z unless offset support is explicitly enabled.
        return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


class FarmRead(RecordTimestamps):
    id: UUID
    owner_id: UUID
    name: str
    location: GeoLocation
    total_area_hectares: PositiveArea
    soil_type: SoilType
    primary_irrigation: IrrigationSource
    boundary_geo_json: dict[str, Any] | None = None
    active_crop_cycle_count: int = Field(ge=0)


class DiagnoseRequest(ContractModel):
    field_id: UUID
    cycle_id: UUID | None = None
    image_url: HttpUrl
    crop_species: Annotated[StrictStr, Field(min_length=2, max_length=100)]
    scouting_notes: Annotated[StrictStr, Field(max_length=2000)] | None = None


class SoilMetrics(ContractModel):
    ph: float = Field(ge=0, le=14)
    organic_carbon_percent: float = Field(ge=0, le=10)
    nitrogen_kg_per_ha: float = Field(ge=0)
    phosphorus_kg_per_ha: float = Field(ge=0)
    potassium_kg_per_ha: float = Field(ge=0)
    electrical_conductivity_ds_m: float = Field(ge=0, alias="electricalConductivityDsM")
    moisture_percent: float = Field(ge=0, le=100)
    last_sampled_date: AwareDatetime

    @field_serializer("last_sampled_date")
    def utc_timestamp(self, value: datetime) -> str:
        return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


FieldName = Annotated[StrictStr, Field(min_length=1, max_length=100)]
FieldCode = Annotated[StrictStr, Field(min_length=1, max_length=50)]


class FieldCreate(ContractModel):
    name: FieldName
    code: FieldCode
    area_hectares: PositiveArea
    soil_metrics: SoilMetrics
    polygon_coordinates: list[tuple[float, float]] | None = None


class FieldPatch(ContractModel):
    name: FieldName | None = None
    code: FieldCode | None = None
    area_hectares: PositiveArea | None = None
    soil_metrics: SoilMetrics | None = None
    polygon_coordinates: list[tuple[float, float]] | None = None

    @model_validator(mode="after")
    def valid_patch(self) -> "FieldPatch":
        if not self.model_fields_set:
            raise ValueError("Provide at least one writable field")
        return self


class FieldRead(RecordTimestamps):
    id: UUID
    farm_id: UUID
    name: str = Field(min_length=1)
    code: str = Field(min_length=1)
    area_hectares: PositiveArea
    soil_metrics: SoilMetrics
    polygon_coordinates: list[tuple[float, float]] | None = None


class CropCycleCreate(ContractModel):
    crop_name: Annotated[StrictStr, Field(min_length=2, max_length=100)]
    variety: Annotated[StrictStr, Field(min_length=1, max_length=100)]
    season: CropSeason
    sowing_date: date
    expected_harvest_date: date
    status: CropCycleStatus = "planned"
    target_yield_metric_tons: Annotated[float, Field(gt=0, strict=True)]
    current_growth_stage: GrowthStage
    health_index_score: Annotated[float, Field(ge=0, le=100, strict=True)] = 85

    @model_validator(mode="after")
    def valid_dates(self) -> "CropCycleCreate":
        if self.expected_harvest_date < self.sowing_date:
            raise ValueError("expected harvest date cannot precede sowing date")
        return self


class CropCyclePatch(ContractModel):
    status: CropCycleStatus | None = None
    actual_harvest_date: date | None = None
    actual_yield_metric_tons: Annotated[float, Field(gt=0, strict=True)] | None = None
    current_growth_stage: GrowthStage | None = None
    stage_progress_percent: Annotated[float, Field(ge=0, le=100, strict=True)] | None = None
    health_index_score: Annotated[float, Field(ge=0, le=100, strict=True)] | None = None

    @model_validator(mode="after")
    def valid_patch(self) -> "CropCyclePatch":
        if not self.model_fields_set:
            raise ValueError("Provide at least one writable crop-cycle field")
        return self


class CropCycleRead(RecordTimestamps):
    id: UUID
    field_id: UUID
    crop_name: str = Field(min_length=2)
    variety: str = Field(min_length=1)
    season: CropSeason
    sowing_date: date
    expected_harvest_date: date
    actual_harvest_date: date | None = None
    status: CropCycleStatus
    target_yield_metric_tons: PositiveArea
    actual_yield_metric_tons: PositiveArea | None = None
    current_growth_stage: GrowthStage
    stage_progress_percent: float = Field(ge=0, le=100)
    health_index_score: float = Field(ge=0, le=100)


class GeoTag(ContractModel):
    latitude: float = Field(ge=-90, le=90, strict=True)
    longitude: float = Field(ge=-180, le=180, strict=True)


class ObservationCreate(ContractModel):
    cycle_id: UUID | None = None
    observer_id: UUID | None = None
    observation_type: ObservationType
    timestamp: AwareDatetime
    metrics: dict[str, float | StrictStr]
    notes: Annotated[StrictStr, Field(max_length=5000)] | None = None
    geo_tag: GeoTag | None = None
    media_urls: list[HttpUrl] | None = None


class ObservationRead(ContractModel):
    id: UUID
    field_id: UUID
    cycle_id: UUID | None = None
    observer_id: UUID | None = None
    observation_type: ObservationType
    timestamp: AwareDatetime
    metrics: dict[str, float | str]
    notes: str | None = None
    geo_tag: GeoTag | None = None
    media_urls: list[HttpUrl] | None = None
    created_at: AwareDatetime

    @field_serializer("timestamp", "created_at")
    def utc_observation_timestamp(self, value: datetime) -> str:
        return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


class FarmOverviewRead(ContractModel):
    farm: FarmRead
    fields: list[FieldRead]
    active_crop_cycles: list[CropCycleRead]
    recent_observations: list[ObservationRead]
    unavailable_sources: list[Literal["weather", "alerts", "tasks"]] = Field(default_factory=list)


class TwinInterventions(ContractModel):
    irrigation_schedule_days: list[Annotated[int, Field(ge=0, le=365, strict=True)]]
    irrigation_volume_m3_per_ha: Annotated[float, Field(ge=0, strict=True)]
    nitrogen_top_dressing_kg_per_ha: Annotated[float, Field(ge=0, strict=True)]
    biostimulant_applied: bool


class TwinSimulateRequest(ContractModel):
    field_id: UUID
    cycle_id: UUID
    title: Annotated[StrictStr, Field(min_length=3, max_length=200)]
    interventions: TwinInterventions


class WaterRequirementEstimate(ContractModel):
    field_area_hectares: PositiveArea
    irrigation_events: int = Field(ge=0)
    irrigation_volume_m3_per_ha: float = Field(ge=0)
    total_irrigation_volume_m3: float = Field(ge=0)
    assumption: str


InventoryItemType = Literal[
    "seed",
    "chemical_fertilizer",
    "organic_fertilizer",
    "pesticide_fungicide",
    "fuel_diesel",
    "machinery_spares",
]
InventoryTransactionType = Literal["purchase", "usage", "return", "wastage_adjustment"]
InventoryUnit = Literal["kg", "liter", "bag_50kg", "unit", "meter"]


class InventoryTransactionCreate(ContractModel):
    field_id: UUID | None = None
    item_type: InventoryItemType
    item_name: Annotated[StrictStr, Field(min_length=2, max_length=200)]
    batch_number: Annotated[StrictStr, Field(max_length=100)] | None = None
    transaction_type: InventoryTransactionType
    quantity: Annotated[float, Field(gt=0, strict=True)]
    unit: InventoryUnit
    unit_price_inr: Annotated[float, Field(gt=0, strict=True)]
    supplier_or_vendor: Annotated[StrictStr, Field(max_length=200)] | None = None
    date: date
    idempotency_key: Annotated[StrictStr, Field(min_length=8, max_length=100)]


class InventoryTransactionRead(ContractModel):
    id: UUID
    farm_id: UUID
    field_id: UUID | None = None
    item_type: InventoryItemType
    item_name: str
    batch_number: str | None = None
    transaction_type: InventoryTransactionType
    quantity: float = Field(gt=0)
    unit: InventoryUnit
    unit_price_inr: float = Field(gt=0)
    total_amount_inr: float = Field(gt=0)
    balance_after_quantity: float = Field(ge=0)
    supplier_or_vendor: str | None = None
    date: date
    created_at: AwareDatetime


class InventoryBalanceRead(ContractModel):
    item_type: InventoryItemType
    item_name: str
    unit: InventoryUnit
    balance_quantity: float = Field(ge=0)
    total_purchased_amount_inr: float = Field(ge=0)
    last_transaction_date: date


TaskCategory = Literal[
    "irrigation",
    "fertilization",
    "spraying_pest_control",
    "crop_scouting",
    "harvesting",
    "equipment_maintenance",
    "soil_testing",
]
TaskPriority = Literal["low", "medium", "high", "urgent"]
TaskStatus = Literal["todo", "in_progress", "completed", "cancelled"]


class FarmTaskCreate(ContractModel):
    field_id: UUID | None = None
    title: Annotated[StrictStr, Field(min_length=3, max_length=200)]
    description: Annotated[StrictStr, Field(max_length=5000)] | None = None
    category: TaskCategory
    priority: TaskPriority
    assigned_to_user_id: UUID | None = None
    assigned_to_name: Annotated[StrictStr, Field(max_length=200)] | None = None
    due_date: date
    cost_estimate_inr: Annotated[float, Field(ge=0, strict=True)] | None = None


class FarmTaskPatch(ContractModel):
    title: Annotated[StrictStr, Field(min_length=3, max_length=200)] | None = None
    description: Annotated[StrictStr, Field(max_length=5000)] | None = None
    priority: TaskPriority | None = None
    status: TaskStatus | None = None
    assigned_to_user_id: UUID | None = None
    assigned_to_name: Annotated[StrictStr, Field(max_length=200)] | None = None
    due_date: date | None = None
    actual_cost_inr: Annotated[float, Field(ge=0, strict=True)] | None = None

    @model_validator(mode="after")
    def valid_patch(self) -> "FarmTaskPatch":
        if not self.model_fields_set:
            raise ValueError("Provide at least one writable task field")
        return self


class FarmTaskRead(RecordTimestamps):
    id: UUID
    farm_id: UUID
    field_id: UUID | None = None
    title: str = Field(min_length=3)
    description: str | None = None
    category: TaskCategory
    priority: TaskPriority
    status: TaskStatus
    assigned_to_user_id: UUID | None = None
    assigned_to_name: str | None = None
    due_date: date
    completed_at: AwareDatetime | None = None
    cost_estimate_inr: float | None = Field(default=None, ge=0)
    actual_cost_inr: float | None = Field(default=None, ge=0)


QualityGrade = Literal[
    "Grade_A_Export",
    "Grade_B_Domestic_Premium",
    "Grade_C_Standard_Mandi",
    "Grade_D_Processing_Feed",
]
DispatchStatus = Literal[
    "in_warehouse_storage",
    "consignment_booked",
    "in_transit",
    "settled_at_mandi",
]


class HarvestBatchCreate(ContractModel):
    field_id: UUID
    cycle_id: UUID
    batch_code: Annotated[StrictStr, Field(min_length=4, max_length=100)]
    harvest_date: date
    total_quantity_kg: Annotated[float, Field(gt=0, strict=True)]
    quality_grade: QualityGrade
    moisture_content_percent: Annotated[float, Field(ge=0, le=40, strict=True)]
    foreign_matter_percent: Annotated[float, Field(ge=0, le=20, strict=True)]
    storage_warehouse: Annotated[StrictStr, Field(min_length=1, max_length=200)]
    target_mandi_price_inr_per_quintal: Annotated[float, Field(gt=0, strict=True)] | None = None


class HarvestBatchPatch(ContractModel):
    storage_warehouse: Annotated[StrictStr, Field(min_length=1, max_length=200)] | None = None
    dispatch_status: DispatchStatus | None = None
    sold_price_inr_per_quintal: Annotated[float, Field(gt=0, strict=True)] | None = None
    buyer_entity: Annotated[StrictStr, Field(max_length=200)] | None = None

    @model_validator(mode="after")
    def valid_patch(self) -> "HarvestBatchPatch":
        if not self.model_fields_set:
            raise ValueError("Provide at least one writable harvest-batch field")
        return self


class HarvestBatchRead(RecordTimestamps):
    id: UUID
    farm_id: UUID
    field_id: UUID
    cycle_id: UUID
    batch_code: str = Field(min_length=4)
    crop_name: str = Field(min_length=2)
    variety: str = Field(min_length=1)
    harvest_date: date
    total_quantity_kg: float = Field(gt=0)
    quality_grade: QualityGrade
    moisture_content_percent: float = Field(ge=0, le=40)
    foreign_matter_percent: float = Field(ge=0, le=20)
    storage_warehouse: str
    dispatch_status: DispatchStatus
    target_mandi_price_inr_per_quintal: float | None = Field(default=None, gt=0)
    sold_price_inr_per_quintal: float | None = Field(default=None, gt=0)
    buyer_entity: str | None = None


ExpenseCategory = Literal[
    "labor",
    "seeds",
    "fertilizer",
    "pesticide",
    "irrigation",
    "equipment",
    "fuel",
    "transport",
    "storage",
    "land_rent",
    "other",
]


class FarmExpenseCreate(ContractModel):
    field_id: UUID | None = None
    cycle_id: UUID | None = None
    category: ExpenseCategory
    description: Annotated[StrictStr, Field(min_length=2, max_length=500)]
    amount_inr: Annotated[float, Field(gt=0, strict=True)]
    vendor: Annotated[StrictStr, Field(max_length=200)] | None = None
    date: date
    idempotency_key: Annotated[StrictStr, Field(min_length=8, max_length=100)]


class FarmExpenseRead(ContractModel):
    id: UUID
    farm_id: UUID
    field_id: UUID | None = None
    cycle_id: UUID | None = None
    category: ExpenseCategory
    description: str
    amount_inr: float = Field(gt=0)
    vendor: str | None = None
    date: date
    idempotency_key: str
    created_at: AwareDatetime


class HarvestSaleCreate(ContractModel):
    batch_id: UUID
    quantity_kg: Annotated[float, Field(gt=0, strict=True)]
    price_inr_per_quintal: Annotated[float, Field(gt=0, strict=True)]
    buyer_entity: Annotated[StrictStr, Field(min_length=2, max_length=200)]
    date: date
    idempotency_key: Annotated[StrictStr, Field(min_length=8, max_length=100)]


class HarvestSaleRead(ContractModel):
    id: UUID
    farm_id: UUID
    batch_id: UUID
    quantity_kg: float = Field(gt=0)
    price_inr_per_quintal: float = Field(gt=0)
    total_amount_inr: float = Field(gt=0)
    buyer_entity: str
    date: date
    idempotency_key: str
    created_at: AwareDatetime


class OpsFinancialSummaryRead(ContractModel):
    farm_id: UUID
    current_season_total_expenses_inr: float
    projected_revenue_inr: float
    estimated_net_profit_inr: float
    expense_breakdown: dict[str, float]
    inventory_valuation_inr: float


class Pagination(ContractModel):
    page: int = Field(gt=0)
    limit: int = Field(gt=0)
    total: int = Field(ge=0)


class ApiMeta(ContractModel):
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"))
    version: Literal["v1"] = "v1"
    is_fixture: bool = False
    request_id: str
    pagination: Pagination | None = None


class ApiError(ContractModel):
    code: str
    message: str
    details: list[dict[str, Any]] | None = None


T = TypeVar("T")


class ApiResponse(ContractModel, Generic[T]):
    success: bool = True
    data: T
    error: ApiError | None = None
    meta: ApiMeta


class ErrorResponse(ContractModel):
    success: Literal[False] = False
    data: None = None
    error: ApiError
    meta: ApiMeta
