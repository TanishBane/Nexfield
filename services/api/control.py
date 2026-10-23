"""Read-only Control telemetry endpoints backed by persisted observations."""
from datetime import datetime, timedelta, timezone
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .agriculture import observation_payload, owned_field
from .auth import Principal, get_principal
from .database import get_session
from .models import Observation
from .schemas import ApiMeta, ApiResponse, ErrorResponse, ObservationRead

router = APIRouter(
    prefix="/api/v1/control",
    tags=["Control"],
    responses={status: {"model": ErrorResponse} for status in (401, 404, 422, 503)},
)
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]
Timeframe = Literal["24h", "7d", "30d"]


@router.get(
    "/telemetry",
    response_model=ApiResponse[list[ObservationRead]],
    response_model_exclude_none=True,
)
async def telemetry(
    field_id: Annotated[UUID, Query(alias="fieldId")],
    request: Request,
    user: User,
    session: Session,
    timeframe: Timeframe = "24h",
) -> ApiResponse[list[ObservationRead]]:
    await owned_field(session, field_id, user)
    durations = {"24h": timedelta(hours=24), "7d": timedelta(days=7), "30d": timedelta(days=30)}
    since = datetime.now(timezone.utc) - durations[timeframe]
    observations = await session.scalars(
        select(Observation)
        .where(
            Observation.field_id == field_id,
            Observation.observed_at >= since,
        )
        .order_by(Observation.observed_at, Observation.id)
        .limit(1000)
    )
    return ApiResponse(
        data=[ObservationRead.model_validate(observation_payload(item)) for item in observations],
        meta=ApiMeta(request_id=request.state.request_id),
    )
