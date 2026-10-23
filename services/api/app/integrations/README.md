# NEXFIELD Data Integrations

This module contains the external API data adapters for NEXFIELD, providing robust retrieval mechanisms for weather and agricultural market data.

## Supported Data Sources

1. **Open-Meteo (`OpenMeteoAdapter`)**
   - Retrieves live weather forecasts and historical archive data.
   - Requires no API credentials for non-commercial use.
   - Normalizes data to metric/standard NEXFIELD units (Celsius, mm, km/h).

2. **Agmarknet (`AgmarknetAdapter`)**
   - Retrieves official Indian mandi price data via `data.gov.in`.
   - Requires environment variables: `AGMARKNET_API_URL` and `AGMARKNET_API_KEY`.
   - Normalizes variables like date strings and handles structural variances safely.

3. **CEDA (`CedaAdapter`)**
   - Retrieves historical mandi prices and arrival volumes from the Centre for Economic Data and Analysis.
   - Requires environment variables: `CEDA_API_URL` and `CEDA_API_KEY`.
   - Features explicit errors when access is unauthorized or unavailable.

## Known API Restrictions
- Open-Meteo: The free tier allows 10,000 API calls per day. Ensure cache usage if production queries scale up.
- Agmarknet: The data.gov.in API is rate-limited. Batch queries or limit counts where appropriate.
- CEDA: Access may require institutional approval or paid tiers. Ensure API terms are respected.

## Environment Variables

Include these in the backend `.env` file:
```env
AGMARKNET_API_URL="https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
AGMARKNET_API_KEY="your-agmarknet-api-key"

CEDA_API_URL="https://ceda.ashoka.edu.in"
CEDA_API_KEY="your-ceda-api-key"
```

## Example Response Schema (Weather)
```json
{
  "source": "open-meteo",
  "latitude": 52.52,
  "longitude": 13.41,
  "hourly_observations": [
    {
      "timestamp": "2023-10-01T00:00:00",
      "temperature_celsius": 15.0,
      "humidity_percent": 80.0,
      "rainfall_mm": 0.0,
      "wind_speed_kmh": 10.0,
      "evapotranspiration_mm": 0.1
    }
  ],
  "daily_observations": [...]
}
```

## Instructions for Developer Y & Z

**Integration into FastAPI Routes:**
1. Import the adapters from `app.integrations`.
2. Wrap adapter calls in caching logic (e.g., Redis or in-memory LRU) since some APIs are rate-limited.
3. Catch `IntegrationError`, `DataUnavailableError`, and `RateLimitError` explicitly in FastAPI routes to return proper 4xx/5xx HTTP codes rather than unhandled 500s.
4. Convert normalized outputs (e.g., `NormalizedMarketObservation`) into the overarching `ApiResponse<T>` envelope specified in `packages/contracts`.
5. Ensure that when `NEXT_PUBLIC_USE_FIXTURES=true` is set, these live API adapters are bypassed entirely in favor of synthetic fixtures.
