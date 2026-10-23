"""Read-only Control endpoints backed by persisted agricultural records."""
from datetime import datetime, timedelta, timezone
from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .agriculture import observation_payload, owned_field
from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .models import CropCycle, Farm, Field, Observation
from .schemas import (
    ApiMeta,
    ApiResponse,
    CropCycleRead,
    ErrorResponse,
    FarmOverviewRead,
    FarmRead,
    FieldRead,
    ObservationRead,
)

router = APIRouter(
    prefix="/api/v1/control",
    tags=["Control"],
    responses={status: {"model": ErrorResponse} for status in (401, 404, 422, 503)},
)
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]
Timeframe = Literal["24h", "7d", "30d"]


@router.get(
    "/overview",
    response_model=ApiResponse[FarmOverviewRead],
    response_model_exclude_none=True,
)
async def overview(
    farm_id: Annotated[UUID, Query(alias="farmId")],
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[FarmOverviewRead]:
    farm = await session.scalar(
        select(Farm).where(
            Farm.id == farm_id,
            Farm.owner_id == user.user_id,
            Farm.archived_at.is_(None),
        )
    )
    if farm is None:
        raise ApiProblem(404, "FARM_NOT_FOUND", "Farm not found")

    fields = list(await session.scalars(
        select(Field).where(Field.farm_id == farm_id).order_by(Field.created_at, Field.id)
    ))
    field_ids = [field.id for field in fields]
    cycles: list[CropCycle] = []
    observations: list[Observation] = []
    if field_ids:
        cycles = list(await session.scalars(
            select(CropCycle)
            .where(CropCycle.field_id.in_(field_ids), CropCycle.status == "active")
            .order_by(CropCycle.sowing_date, CropCycle.id)
        ))
        since = datetime.now(timezone.utc) - timedelta(hours=24)
        observations = list(await session.scalars(
            select(Observation)
            .where(
                Observation.field_id.in_(field_ids),
                Observation.observed_at >= since,
            )
            .order_by(Observation.observed_at.desc(), Observation.id.desc())
            .limit(1000)
        ))

    data = FarmOverviewRead(
        farm=FarmRead.model_validate(farm),
        fields=[FieldRead.model_validate(field) for field in fields],
        active_crop_cycles=[CropCycleRead.model_validate(cycle) for cycle in cycles],
        recent_observations=[
            ObservationRead.model_validate(observation_payload(observation))
            for observation in observations
        ],
        unavailable_sources=["weather", "alerts", "tasks"],
    )
    return ApiResponse(data=data, meta=ApiMeta(request_id=request.state.request_id))


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
