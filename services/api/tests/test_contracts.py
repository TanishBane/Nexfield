from datetime import datetime, timezone
from uuid import uuid4

import pytest
from pydantic import ValidationError

from services.api.schemas import (
    ApiMeta,
    CropCycleCreate,
    FarmCreate,
    FarmPatch,
    FieldCreate,
    FieldPatch,
    GeoLocation,
    ObservationCreate,
)


def location() -> dict[str, object]:
    return {
        "latitude": 18.52,
        "longitude": 73.85,
        "address": "Pune",
        "state": "Maharashtra",
        "district": "Pune",
        "pinCode": "411001",
    }


def test_farm_create_accepts_contract_camel_case_and_serializes_it():
    farm = FarmCreate(
        name="Demo Farm",
        location=location(),
        totalAreaHectares=4.5,
        soilType="black_cotton",
        primaryIrrigation="drip_irrigation",
    )

    assert farm.model_dump(by_alias=True)["totalAreaHectares"] == 4.5
    assert farm.model_dump(by_alias=True)["primaryIrrigation"] == "drip_irrigation"
    assert farm.location.pin_code == "411001"


@pytest.mark.parametrize(
    "payload",
    [
        {"name": "   ", "location": location(), "totalAreaHectares": 1, "soilType": "alluvial",
         "primaryIrrigation": "rainfed"},
        {"name": "Valid", "location": location(), "totalAreaHectares": 0, "soilType": "alluvial",
         "primaryIrrigation": "rainfed"},
        {"name": "Valid", "location": location(), "totalAreaHectares": 1, "soilType": "unknown",
         "primaryIrrigation": "rainfed"},
    ],
)
def test_farm_create_rejects_invalid_domain_values(payload):
    with pytest.raises(ValidationError):
        FarmCreate.model_validate(payload)


def test_farm_patch_requires_a_writable_field():
    with pytest.raises(ValidationError):
        FarmPatch.model_validate({})


def test_field_create_accepts_soil_metrics_aliases():
    field = FieldCreate(
        name="North Parcel",
        code="N-01",
        areaHectares=1.25,
        soilMetrics={
            "ph": 6.8,
            "organicCarbonPercent": 1.2,
            "nitrogenKgPerHa": 80,
            "phosphorusKgPerHa": 25,
            "potassiumKgPerHa": 120,
            "electricalConductivityDsM": 0.4,
            "moisturePercent": 42,
            "lastSampledDate": "2026-10-24T00:00:00Z",
        },
    )

    assert field.area_hectares == 1.25
    assert field.soil_metrics.electrical_conductivity_ds_m == 0.4


def test_field_patch_requires_a_writable_field():
    with pytest.raises(ValidationError):
        FieldPatch.model_validate({})


def test_crop_cycle_rejects_harvest_before_sowing():
    with pytest.raises(ValidationError):
        CropCycleCreate(
            cropName="Wheat",
            variety="HD-2967",
            season="rabi",
            sowingDate="2026-11-15",
            expectedHarvestDate="2026-10-15",
            targetYieldMetricTons=3,
            currentGrowthStage="seedling_germination",
        )


def test_observation_requires_timezone_aware_timestamp_and_typed_metrics():
    observation = ObservationCreate(
        observationType="iot_sensor_telemetry",
        timestamp="2026-10-24T00:00:00Z",
        metrics={"moisturePercent": 41.5, "sensorStatus": "ok"},
    )

    assert observation.metrics["moisturePercent"] == 41.5
    assert observation.timestamp.tzinfo is not None


def test_control_timeframe_contract_is_bounded():
    from services.api.main import app

    parameter = next(
        item
        for item in app.openapi()["paths"]["/api/v1/control/telemetry"]["get"]["parameters"]
        if item["name"] == "timeframe"
    )
    assert parameter["schema"]["enum"] == ["24h", "7d", "30d"]


def test_control_overview_exposes_unavailable_sources_explicitly():
    from services.api.main import app

    schema = app.openapi()["components"]["schemas"]["FarmOverviewRead"]
    assert "unavailableSources" in schema["properties"]


def test_twin_water_estimate_uses_explicit_scheduled_volume_assumption():
    from services.api.twin import estimate_irrigation_volume

    estimate = estimate_irrigation_volume(2.5, [10, 20, 30], 100)

    assert estimate.total_irrigation_volume_m3 == 750
    assert "not modeled" in estimate.assumption


def test_twin_request_rejects_negative_intervention_values():
    from services.api.schemas import TwinSimulateRequest

    with pytest.raises(ValidationError):
        TwinSimulateRequest(
            fieldId=uuid4(),
            cycleId=uuid4(),
            title="Water scenario",
            interventions={
                "irrigationScheduleDays": [10],
                "irrigationVolumeM3PerHa": -1,
                "nitrogenTopDressingKgPerHa": 10,
                "biostimulantApplied": False,
            },
        )


def test_twin_water_requirement_route_is_registered():
    from services.api.main import app

    assert "/api/v1/twin/water-requirement" in app.openapi()["paths"]


def test_inventory_rejects_non_positive_quantity_and_uses_inr_fields():
    from services.api.schemas import InventoryTransactionCreate

    with pytest.raises(ValidationError):
        InventoryTransactionCreate(
            itemType="seed",
            itemName="Wheat seed",
            transactionType="purchase",
            quantity=0,
            unit="kg",
            unitPriceInr=45,
            date="2026-10-24",
            idempotencyKey="purchase-0001",
        )


def test_inventory_routes_are_registered():
    from services.api.main import app

    paths = app.openapi()["paths"]
    assert "/api/v1/ops/inventory" in paths
    assert "/api/v1/ops/inventory/transactions" in paths


def test_task_status_transition_contract_is_represented():
    from services.api.schemas import FarmTaskCreate, FarmTaskPatch

    task = FarmTaskCreate(
        title="Irrigate north field",
        category="irrigation",
        priority="high",
        dueDate="2026-10-25",
    )
    assert task.due_date.isoformat() == "2026-10-25"
    assert FarmTaskPatch(status="completed").status == "completed"


def test_task_routes_are_registered():
    from services.api.main import app

    paths = app.openapi()["paths"]
    assert "/api/v1/ops/tasks" in paths
    assert "/api/v1/ops/tasks/{task_id}" in paths


def test_harvest_batch_contract_validates_units_and_status():
    from services.api.schemas import HarvestBatchCreate, HarvestBatchPatch

    batch = HarvestBatchCreate(
        fieldId="11111111-1111-1111-1111-111111111111",
        cycleId="22222222-2222-2222-2222-222222222222",
        batchCode="WHEAT-001",
        harvestDate="2026-10-24",
        totalQuantityKg=1250.5,
        qualityGrade="Grade_A_Export",
        moistureContentPercent=12.5,
        foreignMatterPercent=1.0,
        storageWarehouse="North Warehouse",
    )
    assert batch.total_quantity_kg == 1250.5
    assert HarvestBatchPatch(dispatchStatus="consignment_booked").dispatch_status == "consignment_booked"


def test_harvest_batch_routes_are_registered():
    from services.api.main import app

    paths = app.openapi()["paths"]
    assert "/api/v1/ops/harvest-batches" in paths
    assert "/api/v1/ops/harvest-batches/{batch_id}" in paths


def test_expense_contract_requires_positive_inr_and_idempotency_key():
    from services.api.schemas import FarmExpenseCreate

    expense = FarmExpenseCreate(
        category="fertilizer",
        description="Nitrogen application",
        amountInr=1250.0,
        date="2026-10-24",
        idempotencyKey="expense-0001",
    )
    assert expense.amount_inr == 1250.0
    with pytest.raises(ValidationError):
        FarmExpenseCreate(
            category="fertilizer",
            description="Nitrogen application",
            amountInr=0,
            date="2026-10-24",
            idempotencyKey="expense-0002",
        )


def test_expense_routes_are_registered():
    from services.api.main import app

    paths = app.openapi()["paths"]
    assert "/api/v1/ops/expenses" in paths


def test_sale_contract_calculates_quantity_in_kg_and_price_per_quintal():
    from services.api.schemas import HarvestSaleCreate

    sale = HarvestSaleCreate(
        batchId="11111111-1111-1111-1111-111111111111",
        quantityKg=250,
        priceInrPerQuintal=2450,
        buyerEntity="Pune Mandi Buyer",
        date="2026-10-24",
        idempotencyKey="sale-0001",
    )
    assert sale.quantity_kg == 250
    assert sale.price_inr_per_quintal == 2450


def test_sale_routes_are_registered():
    from services.api.main import app

    assert "/api/v1/ops/sales" in app.openapi()["paths"]


def test_api_meta_serializes_contract_aliases_and_utc_timestamp():
    meta = ApiMeta(
        request_id=str(uuid4()),
        timestamp=datetime(2026, 10, 24, 0, 0, tzinfo=timezone.utc).isoformat(),
    )

    serialized = meta.model_dump(mode="json", by_alias=True)
    assert serialized["requestId"]
    assert serialized["isFixture"] is False
