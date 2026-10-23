import pytest
import respx
import httpx
import os
from datetime import date
from app.integrations.agmarknet import AgmarknetAdapter
from app.integrations.base import ConfigurationError, IntegrationError

@pytest.fixture
def mock_env(monkeypatch):
    monkeypatch.setenv("AGMARKNET_API_URL", "https://api.example.gov.in/resource/test")
    monkeypatch.setenv("AGMARKNET_API_KEY", "test_key")

@pytest.fixture
def adapter(mock_env):
    return AgmarknetAdapter()

def test_missing_env_vars(monkeypatch):
    monkeypatch.delenv("AGMARKNET_API_URL", raising=False)
    with pytest.raises(ConfigurationError):
        AgmarknetAdapter()

@pytest.mark.asyncio
@respx.mock
async def test_get_daily_prices_success(adapter):
    mock_data = {
        "index_name": "test",
        "title": "test",
        "desc": "test",
        "created": 1,
        "updated": 1,
        "created_date": "test",
        "updated_date": "test",
        "active": "1",
        "visualizable": "1",
        "catalog_uuid": "test",
        "source": "test",
        "org_type": "test",
        "org": [],
        "sector": [],
        "field": [],
        "target_bucket": {},
        "message": "success",
        "version": "1.0",
        "status": "ok",
        "total": 1,
        "count": 1,
        "limit": "10",
        "offset": "0",
        "records": [
            {
                "state": "Punjab",
                "district": "Amritsar",
                "market": "Amritsar",
                "commodity": "Wheat",
                "variety": "Other",
                "grade": "FAQ",
                "arrival_date": "24/10/2026",
                "min_price": 2000.0,
                "max_price": 2200.0,
                "modal_price": 2100.0
            },
            {
                "state": "Haryana",
                "district": "Karnal",
                "market": "Karnal",
                "commodity": "Rice",
                "variety": "Basmati",
                "grade": "FAQ",
                "arrival_date": "2026-10-24",
                "min_price": 3000.0,
                "max_price": 3500.0,
                "modal_price": 3200.0
            }
        ]
    }

    # We must match the query parameters that the client actually sends.
    # We can use a regex to match the base url instead or just match any request to the base url.
    respx.get(url__startswith="https://api.example.gov.in/resource/test").respond(200, json=mock_data)

    result = await adapter.get_daily_prices(commodity="Wheat")

    assert len(result) == 2
    assert result[0].source == "agmarknet"
    assert result[0].state == "Punjab"
    assert result[0].modal_price_inr_per_quintal == 2100.0
    assert result[0].observation_date == date(2026, 10, 24) # Parsed from dd/mm/yyyy

    assert result[1].observation_date == date(2026, 10, 24) # Parsed from iso format

    await adapter.close()

@pytest.mark.asyncio
@respx.mock
async def test_get_daily_prices_invalid_data(adapter):
    respx.get(url__startswith="https://api.example.gov.in/resource/test").respond(200, json={"records": [{"invalid": "data"}]})

    with pytest.raises(IntegrationError):
        await adapter.get_daily_prices()

    await adapter.close()
