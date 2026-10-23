import pytest
import respx
import httpx
import os
from datetime import date
from app.integrations.ceda import CedaAdapter
from app.integrations.base import ConfigurationError, IntegrationError

@pytest.fixture
def mock_env(monkeypatch):
    monkeypatch.setenv("CEDA_API_URL", "https://ceda.example.edu.in")
    monkeypatch.setenv("CEDA_API_KEY", "test_ceda_key")

@pytest.fixture
def adapter(mock_env):
    return CedaAdapter()

def test_missing_env_vars(monkeypatch):
    monkeypatch.delenv("CEDA_API_URL", raising=False)
    with pytest.raises(ConfigurationError):
        CedaAdapter()

@pytest.mark.asyncio
@respx.mock
async def test_get_historical_prices_success(adapter):
    mock_data = {
        "data": [
            {
                "state": "Uttar Pradesh",
                "district": "Agra",
                "market": "Agra",
                "commodity": "Potato",
                "min_price": 1000.0,
                "max_price": 1200.0,
                "modal_price": 1100.0,
                "arrivals": 500.5,
                "date": "2023-05-01"
            }
        ],
        "page": 1,
        "total_pages": 1,
        "has_next": False
    }

    respx.get(url__startswith="https://ceda.example.edu.in/api/v1/mandi-prices").respond(200, json=mock_data)

    result = await adapter.get_historical_prices(commodity="Potato")

    assert len(result) == 1
    assert result[0].source == "ceda"
    assert result[0].state == "Uttar Pradesh"
    assert result[0].modal_price_inr_per_quintal == 1100.0
    assert result[0].arrivals_tonnes == 500.5
    assert result[0].observation_date == date(2023, 5, 1)

    await adapter.close()

@pytest.mark.asyncio
@respx.mock
async def test_get_historical_prices_invalid_data(adapter):
    respx.get(url__startswith="https://ceda.example.edu.in/api/v1/mandi-prices").respond(200, json={"data": [{"invalid": "data"}]})

    with pytest.raises(IntegrationError):
        await adapter.get_historical_prices(commodity="Potato")

    await adapter.close()
