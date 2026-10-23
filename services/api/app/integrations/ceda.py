from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class CedaMarketRecord(BaseModel):
    state: str
    district: str
    market: str
    commodity: str
    min_price: float
    max_price: float
    modal_price: float
    arrivals: float
    date: date

class CedaResponse(BaseModel):
    data: List[CedaMarketRecord]
    page: int
    total_pages: int
    has_next: bool

class NormalizedHistoricalMarketObservation(BaseModel):
    source: str = "ceda"
    state: str
    district: str
    market: str
    commodity: str
    min_price_inr_per_quintal: float
    max_price_inr_per_quintal: float
    modal_price_inr_per_quintal: float
    arrivals_tonnes: float
    observation_date: date

from .base import BaseAdapter, IntegrationError, ConfigurationError
import os

class CedaAdapter(BaseAdapter):
    """
    Adapter for CEDA API (Centre for Economic Data and Analysis).
    Requires CEDA_API_URL and CEDA_API_KEY environment variables.
    """

    def __init__(self, timeout: int = 15):
        base_url = os.getenv("CEDA_API_URL")
        self.api_key = os.getenv("CEDA_API_KEY")

        if not base_url or not self.api_key:
            raise ConfigurationError("CEDA_API_URL and CEDA_API_KEY must be set in environment variables to use the CEDA adapter.")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json"
        }

        super().__init__(base_url=base_url, timeout=timeout, headers=headers)

    async def get_historical_prices(
        self,
        commodity: str,
        state: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        page: int = 1
    ) -> List[NormalizedHistoricalMarketObservation]:
        """
        Fetch historical market prices from CEDA API.
        """
        params = {
            "commodity": commodity,
            "page": page
        }

        if state:
            params["state"] = state
        if start_date:
            params["start_date"] = start_date.isoformat()
        if end_date:
            params["end_date"] = end_date.isoformat()

        response = await self._get("/api/v1/mandi-prices", params=params)
        data = response.json()

        try:
            parsed_data = CedaResponse(**data)
            return self._normalize_response(parsed_data)
        except Exception as e:
            raise IntegrationError(f"Failed to parse CEDA response: {e}")

    def _normalize_response(self, data: CedaResponse) -> List[NormalizedHistoricalMarketObservation]:
        """
        Normalize the CEDA API response to standard NEXFIELD formats.
        """
        normalized_records = []
        for record in data.data:
            normalized_records.append(
                NormalizedHistoricalMarketObservation(
                    state=record.state,
                    district=record.district,
                    market=record.market,
                    commodity=record.commodity,
                    min_price_inr_per_quintal=record.min_price,
                    max_price_inr_per_quintal=record.max_price,
                    modal_price_inr_per_quintal=record.modal_price,
                    arrivals_tonnes=record.arrivals,
                    observation_date=record.date
                )
            )
        return normalized_records
