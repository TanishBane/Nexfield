import pytest
import respx
import httpx
from datetime import date
from app.integrations.open_meteo import OpenMeteoAdapter
from app.integrations.base import IntegrationError, DataUnavailableError, RateLimitError

@pytest.fixture
def adapter():
    return OpenMeteoAdapter()

@pytest.mark.asyncio
@respx.mock
async def test_get_forecast_success(adapter):
    mock_data = {
        "latitude": 52.52,
        "longitude": 13.41,
        "generationtime_ms": 0.25,
        "utc_offset_seconds": 0,
        "timezone": "GMT",
        "timezone_abbreviation": "GMT",
        "elevation": 38.0,
        "hourly": {
            "time": ["2023-10-01T00:00", "2023-10-01T01:00"],
            "temperature_2m": [15.0, 14.5],
            "relative_humidity_2m": [80.0, 82.0],
            "rain": [0.0, 1.2],
            "wind_speed_10m": [10.0, 12.0],
            "et0_fao_evapotranspiration": [0.1, 0.2]
        },
        "daily": {
            "time": ["2023-10-01", "2023-10-02"],
            "temperature_2m_max": [20.0, 22.0],
            "temperature_2m_min": [10.0, 11.0],
            "rain_sum": [5.0, 0.0],
            "et0_fao_evapotranspiration": [2.5, 3.0]
        }
    }

    respx.get(adapter.FORECAST_URL).respond(200, json=mock_data)

    result = await adapter.get_forecast(lat=52.52, lon=13.41)

    assert result.source == "open-meteo"
    assert result.latitude == 52.52
    assert len(result.hourly_observations) == 2
    assert len(result.daily_observations) == 2
    assert result.hourly_observations[0].temperature_celsius == 15.0
    assert result.daily_observations[0].max_temperature_celsius == 20.0

    await adapter.close()

@pytest.mark.asyncio
@respx.mock
async def test_get_historical_success(adapter):
    mock_data = {
        "latitude": 52.52,
        "longitude": 13.41,
        "generationtime_ms": 0.25,
        "utc_offset_seconds": 0,
        "timezone": "GMT",
        "timezone_abbreviation": "GMT",
        "elevation": 38.0,
        "daily": {
            "time": ["2023-01-01"],
            "temperature_2m_max": [5.0],
            "temperature_2m_min": [-2.0],
            "rain_sum": [1.0],
            "et0_fao_evapotranspiration": [0.5]
        }
    }

    respx.get(adapter.ARCHIVE_URL).respond(200, json=mock_data)

    result = await adapter.get_historical(
        lat=52.52, lon=13.41, start_date=date(2023, 1, 1), end_date=date(2023, 1, 1)
    )

    assert len(result.daily_observations) == 1
    assert result.daily_observations[0].max_temperature_celsius == 5.0

    await adapter.close()

@pytest.mark.asyncio
@respx.mock
async def test_rate_limit(adapter):
    respx.get(adapter.FORECAST_URL).respond(429)

    with pytest.raises(RateLimitError):
        await adapter.get_forecast(lat=52.52, lon=13.41)

    await adapter.close()

@pytest.mark.asyncio
@respx.mock
async def test_data_unavailable(adapter):
    respx.get(adapter.FORECAST_URL).respond(404)

    with pytest.raises(DataUnavailableError):
        await adapter.get_forecast(lat=52.52, lon=13.41)

    await adapter.close()

@pytest.mark.asyncio
@respx.mock
async def test_invalid_data(adapter):
    respx.get(adapter.FORECAST_URL).respond(200, json={"invalid": "data"})

    with pytest.raises(IntegrationError):
        await adapter.get_forecast(lat=52.52, lon=13.41)

    await adapter.close()
