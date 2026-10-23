1. **Understand Requirements**
   - Goal: Implement agricultural data adapters for Open-Meteo, Agmarknet, and CEDA.
   - Location: `services/api/app/integrations/`
   - Tech stack: Python, HTTPX, Pydantic.
   - Key requirements: Typed adapters, environment-based API credentials, input validation, timeout handling, rate-limit handling, data source metadata, cache-aware responses, date/unit normalization, explicit errors for unavailable data.
   - Output: Source files, dedicated integration tests (fixture-backed testing, separate from production clients), documentation, environment variables, example response schemas, known restrictions, usage/attribution requirements, instructions for FastAPI routes integration.

2. **Open-Meteo Implementation**
   - Build an adapter using HTTPX and Pydantic for `https://api.open-meteo.com/v1/forecast` and `https://archive-api.open-meteo.com/v1/archive`.
   - Support variables: Temperature, Humidity, Rainfall, Forecast periods, Wind, Reference evapotranspiration.
   - Implement date and unit normalization.
   - Handle timeouts and validation.

3. **Agmarknet Implementation**
   - Research/Identify a reliable API for Agmarknet or a robust scraping/data-fetching method (since Agmarknet usually lacks a simple REST API). *Wait, the task says "using official government data sources", but also "implement Indian mandi-price data ingestion". Need to design an adapter that can fetch/parse data based on Commodity, State, District, Market, Min/Max/Modal prices, and date.* Given it's an integration, I will build an adapter that calls the official Government of India data portal (data.gov.in) if available, or outlines the scraping parameters. Usually, `data.gov.in` provides an API for daily mandi prices. Let's use `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070` (or similar Agmarknet dataset) as the reference point, requiring an API key.

4. **CEDA Implementation**
   - Research CEDA (Centre for Economic Data and Analysis) API. CEDA provides historical price data. I will design a structured HTTPX adapter pointing to their documented endpoints, adhering to validation.
   - "Validate endpoint documentation and terms before implementation." Need to add checks or placeholders.

5. **Tests & Documentation**
   - Create `services/api/tests/integrations/` with `test_open_meteo.py`, `test_agmarknet.py`, and `test_ceda.py`. Use `respx` or `pytest-httpx` for mocking responses.
   - Create `services/api/app/integrations/README.md` containing documentation, usage, and integration instructions for Z.

6. **Create PR**
   - I will create a git branch `feature/jules-data-adapters`.
   - Commit files.
   - Call `pre_commit_instructions`.
   - Submit.
