from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Any
from datetime import datetime, date
import logging

logger = logging.getLogger(__name__)

class AgmarknetRecord(BaseModel):
    state: str
    district: str
    market: str
    commodity: str
    variety: str
    grade: str
    arrival_date: str
    min_price: float
    max_price: float
    modal_price: float

    @field_validator("arrival_date", mode="before")
    def parse_date(cls, v):
        try:
            return datetime.strptime(v, "%d/%m/%Y").date().isoformat()
        except ValueError:
            return v

class AgmarknetResponse(BaseModel):
    records: List[AgmarknetRecord]

    model_config = {
        "extra": "ignore"  # Ignore all the extra irrelevant metadata fields returned by the API
    }

class NormalizedMarketObservation(BaseModel):
    source: str = "agmarknet"
    state: str
    district: str
    market: str
    commodity: str
    min_price_inr_per_quintal: float
    max_price_inr_per_quintal: float
    modal_price_inr_per_quintal: float
    observation_date: date

from .base import BaseAdapter, IntegrationError, ConfigurationError
import os

class AgmarknetAdapter(BaseAdapter):
    """
    Adapter for Agmarknet API via data.gov.in
    Requires AGMARKNET_API_URL and AGMARKNET_API_KEY environment variables.
    """

    def __init__(self, timeout: int = 10):
        base_url = os.getenv("AGMARKNET_API_URL")
        self.api_key = os.getenv("AGMARKNET_API_KEY")

        if not base_url or not self.api_key:
            raise ConfigurationError("AGMARKNET_API_URL and AGMARKNET_API_KEY must be set in environment variables.")

        super().__init__(base_url=base_url, timeout=timeout)

    async def get_daily_prices(self, commodity: Optional[str] = None, state: Optional[str] = None, district: Optional[str] = None, market: Optional[str] = None, limit: int = 10) -> List[NormalizedMarketObservation]:
        """
        Fetch daily market prices, optionally filtered.
        """
        params = {
            "api-key": self.api_key,
            "format": "json",
            "limit": limit
        }

        if commodity:
            params["filters[commodity]"] = commodity
        if state:
            params["filters[state]"] = state
        if district:
            params["filters[district]"] = district
        if market:
            params["filters[market]"] = market

        response = await self._get("", params=params)
        data = response.json()

        try:
            parsed_data = AgmarknetResponse(**data)
            return self._normalize_response(parsed_data)
        except Exception as e:
            raise IntegrationError(f"Failed to parse Agmarknet response: {e}")

    def _normalize_response(self, data: AgmarknetResponse) -> List[NormalizedMarketObservation]:
        """
        Normalize the Agmarknet API response to standard NEXFIELD formats.
        """
        normalized_records = []
        for record in data.records:
            try:
                if isinstance(record.arrival_date, str) and "-" in record.arrival_date:
                    obs_date = date.fromisoformat(record.arrival_date)
                else:
                    obs_date = datetime.strptime(record.arrival_date, "%d/%m/%Y").date()
            except Exception as e:
                # Do not confuse data ingestion timestamps with actual agricultural observation timestamps.
                logger.warning(f"Skipping record due to invalid arrival_date format: {record.arrival_date}")
                continue

            normalized_records.append(
                NormalizedMarketObservation(
                    state=record.state,
                    district=record.district,
                    market=record.market,
                    commodity=record.commodity,
                    min_price_inr_per_quintal=record.min_price,
                    max_price_inr_per_quintal=record.max_price,
                    modal_price_inr_per_quintal=record.modal_price,
                    observation_date=obs_date
                )
            )
        return normalized_records
