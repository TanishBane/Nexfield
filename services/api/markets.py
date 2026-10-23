"""Real market-data provider boundary integrating Agmarknet and CEDA adapters.

No fixture or synthetic price is returned when external adapters are absent.
"""
import os
from typing import Annotated, Protocol

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from .app.integrations.agmarknet import AgmarknetAdapter
from .app.integrations.base import ConfigurationError, IntegrationError
from .app.integrations.ceda import CedaAdapter
from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .schemas import ApiMeta, ApiResponse, ErrorResponse, MarketQuery

router = APIRouter(
    prefix="/api/v1/markets",
    tags=["NEXFIELD Markets"],
    responses={status: {"model": ErrorResponse} for status in (401, 422, 503)},
)
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]


@router.get("/prices", response_model=ApiResponse[list[dict]])
async def prices(
    request: Request,
    user: User,
    session: Session,
    commodity: Annotated[str, Query(min_length=2, max_length=100)],
    state: Annotated[str, Query(min_length=2, max_length=100)],
    district: Annotated[str, Query(min_length=2, max_length=100)],
) -> ApiResponse[list[dict]]:
    del user, session
    MarketQuery(commodity=commodity, state=state, district=district)

    # 1. Try Agmarknet Adapter if configured
    if os.getenv("AGMARKNET_API_URL") and os.getenv("AGMARKNET_API_KEY"):
        try:
            adapter = AgmarknetAdapter()
            records = await adapter.get_daily_prices(commodity=commodity, state=state, district=district)
            data = [r.model_dump(mode="json") for r in records]
            return ApiResponse(data=data, meta=ApiMeta(request_id=request.state.request_id))
        except (ConfigurationError, IntegrationError) as exc:
            raise ApiProblem(503, "MARKET_DATA_UNAVAILABLE", f"Agmarknet provider error: {exc}")

    # 2. Try CEDA Adapter if configured
    if os.getenv("CEDA_API_URL") and os.getenv("CEDA_API_KEY"):
        try:
            adapter = CedaAdapter()
            records = await adapter.get_historical_prices(commodity=commodity, state=state)
            data = [r.model_dump(mode="json") for r in records]
            return ApiResponse(data=data, meta=ApiMeta(request_id=request.state.request_id))
        except (ConfigurationError, IntegrationError) as exc:
            raise ApiProblem(503, "MARKET_DATA_UNAVAILABLE", f"CEDA provider error: {exc}")

    raise ApiProblem(
        503,
        "MARKET_DATA_UNAVAILABLE",
        "Market data provider is not configured in this environment (requires AGMARKNET_API_KEY or CEDA_API_KEY); no synthetic price was produced.",
    )


@router.get("/arbitrage", response_model=ApiResponse[list[dict]])
async def arbitrage(
    request: Request,
    user: User,
    session: Session,
    commodity: Annotated[str, Query(min_length=2, max_length=100)],
    origin_mandi: Annotated[str, Query(min_length=2, max_length=100, alias="originMandi")],
) -> ApiResponse[list[dict]]:
    del user, session
    if os.getenv("AGMARKNET_API_URL") and os.getenv("AGMARKNET_API_KEY"):
        try:
            adapter = AgmarknetAdapter()
            records = await adapter.get_daily_prices(commodity=commodity, limit=20)
            data = [r.model_dump(mode="json") for r in records]
            return ApiResponse(data=data, meta=ApiMeta(request_id=request.state.request_id))
        except (ConfigurationError, IntegrationError) as exc:
            raise ApiProblem(503, "MARKET_DATA_UNAVAILABLE", f"Arbitrage calculation failed: {exc}")

    raise ApiProblem(
        503,
        "MARKET_DATA_UNAVAILABLE",
        "Market data provider is not configured; no arbitrage result was produced",
    )
