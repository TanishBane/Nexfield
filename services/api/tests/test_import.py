from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4
import pytest
from pydantic import ValidationError
from services.api.auth import Principal
from services.api.models import Farm, Field
from services.api.import_data import ImportRequest, ImportSummary, import_data, parse_date, parse_datetime
from datetime import date, datetime, timezone

def test_import_request_schema():
    req = ImportRequest(
        category="sensors",
        records=[
            {"timestamp": "2026-10-24 10:00:00", "moisture_percent": 35.5, "temp_c": 26.2},
            {"timestamp": "2026-10-24 11:00:00", "moisture_percent": 34.8, "temp_c": 27.1},
        ],
    )
    assert req.category == "sensors"
    assert len(req.records) == 2
    assert req.records[0]["moisture_percent"] == 35.5

def test_import_request_invalid_category():
    with pytest.raises(ValidationError):
        ImportRequest.model_validate({
            "category": "unsupported_type",
            "records": [],
        })

def test_import_summary_schema():
    summary = ImportSummary(
        category="expenses",
        imported_count=5,
        failed_count=1,
        errors=["Row #6: Amount must be positive"],
    )
    dumped = summary.model_dump(by_alias=True)
    assert dumped["category"] == "expenses"
    assert dumped["importedCount"] == 5
    assert dumped["failedCount"] == 1
    assert len(dumped["errors"]) == 1

def test_parse_datetime_utility():
    dt_str = "2026-10-24T05:30:00Z"
    parsed = parse_datetime(dt_str)
    assert parsed.year == 2026
    assert parsed.month == 10
    assert parsed.tzinfo is not None

def test_parse_date_utility():
    d_str = "2026-10-24"
    parsed = parse_date(d_str)
    assert parsed == date(2026, 10, 24)


@pytest.mark.asyncio
async def test_import_data_executes_insert_statement():
    farm_id = uuid4()
    user = Principal(user_id=uuid4())
    farm = Farm(id=farm_id, owner_id=user.user_id, name="Test Farm", location={}, total_area_hectares=10.0, soil_type="alluvial", primary_irrigation="canal")
    field = Field(id=uuid4(), farm_id=farm_id, name="Field 1", code="F-1", area_hectares=2.0, soil_metrics={})

    session = MagicMock()
    begin_mock = MagicMock()
    begin_mock.__aenter__ = AsyncMock()
    begin_mock.__aexit__ = AsyncMock()
    session.begin = MagicMock(return_value=begin_mock)

    session.scalar = AsyncMock(return_value=farm)
    scalars_mock = MagicMock()
    scalars_mock.__iter__ = MagicMock(return_value=iter([field]))
    session.scalars = AsyncMock(return_value=scalars_mock)
    session.execute = AsyncMock()
    session.flush = AsyncMock()

    request = MagicMock()
    request.state = MagicMock(request_id="test-req-id")

    req = ImportRequest(
        category="sensors",
        records=[{"timestamp": "2026-10-24 10:00:00", "moisture_percent": 35.5, "temp_c": 26.2}],
    )
    res = await import_data(farm_id, req, request, user, session)
    assert res.data.imported_count == 1
    assert session.execute.called
