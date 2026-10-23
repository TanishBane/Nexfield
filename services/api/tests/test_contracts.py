from datetime import datetime, timezone
from uuid import uuid4

import pytest
from pydantic import ValidationError

from services.api.schemas import ApiMeta, FarmCreate, FarmPatch, FieldCreate, FieldPatch, GeoLocation


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


def test_api_meta_serializes_contract_aliases_and_utc_timestamp():
    meta = ApiMeta(
        request_id=str(uuid4()),
        timestamp=datetime(2026, 10, 24, 0, 0, tzinfo=timezone.utc).isoformat(),
    )

    serialized = meta.model_dump(mode="json", by_alias=True)
    assert serialized["requestId"]
    assert serialized["isFixture"] is False
