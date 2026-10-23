"""Real market-data provider boundary.

No fixture or synthetic price is returned when the external adapter is absent.
"""
from typing import Annotated, Protocol

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .schemas import ApiMeta, ApiResponse, ErrorResponse, MarketQuery


class MarketDataProvider(Protocol):
    async def prices(self, query: MarketQuery) -> list[dict]:
        """Return provenance-bearing market observations."""

    async def arbitrage(self, commodity: str, origin_mandi: str) -> list[dict]:
        """Return adapter-backed arbitrage comparisons."""


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
    raise ApiProblem(
        503,
        "MARKET_DATA_UNAVAILABLE",
        "Market data provider is not configured; no price was produced",
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
    raise ApiProblem(
        503,
        "MARKET_DATA_UNAVAILABLE",
        "Market data provider is not configured; no arbitrage result was produced",
    )
