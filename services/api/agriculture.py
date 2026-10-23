"""Owner-scoped crop-cycle and environmental-observation records."""
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .models import CropCycle, Farm, Field, Observation
from .schemas import (
    ApiMeta,
    ApiResponse,
    CropCycleCreate,
    CropCyclePatch,
    CropCycleRead,
    ErrorResponse,
    ObservationCreate,
    ObservationRead,
)

router = APIRouter(tags=["Agriculture"], responses={
    status: {"model": ErrorResponse} for status in (401, 404, 409, 422, 503)
})
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]


async def owned_field(session: AsyncSession, field_id: UUID, user: Principal) -> Field:
    field = await session.scalar(
        select(Field)
        .join(Farm, Farm.id == Field.farm_id)
        .where(
            Field.id == field_id,
            Farm.owner_id == user.user_id,
            Farm.archived_at.is_(None),
        )
    )
    if field is None:
        raise ApiProblem(404, "FIELD_NOT_FOUND", "Field not found")
    return field


def metadata(request: Request) -> ApiMeta:
    return ApiMeta(request_id=request.state.request_id)


@router.post(
    "/api/v1/fields/{field_id}/crop-cycles",
    status_code=201,
    response_model=ApiResponse[CropCycleRead],
    response_model_exclude_none=True,
)
async def create_crop_cycle(
    field_id: UUID,
    body: CropCycleCreate,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[CropCycleRead]:
    async with session.begin():
        field = await owned_field(session, field_id, user)
        cycle = CropCycle(field_id=field.id, **body.model_dump(mode="python"))
        session.add(cycle)
        await session.flush()
        await session.refresh(cycle)
        if cycle.status == "active":
            farm = await session.scalar(select(Farm).where(Farm.id == field.farm_id).with_for_update())
            farm.active_crop_cycle_count += 1
        result = CropCycleRead.model_validate(cycle)
    return ApiResponse(data=result, meta=metadata(request))


@router.get(
    "/api/v1/fields/{field_id}/crop-cycles",
    response_model=ApiResponse[list[CropCycleRead]],
    response_model_exclude_none=True,
)
async def list_crop_cycles(
    field_id: UUID,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[list[CropCycleRead]]:
    await owned_field(session, field_id, user)
    cycles = await session.scalars(
        select(CropCycle).where(CropCycle.field_id == field_id).order_by(CropCycle.sowing_date, CropCycle.id)
    )
    return ApiResponse(
        data=[CropCycleRead.model_validate(cycle) for cycle in cycles],
        meta=metadata(request),
    )


@router.patch(
    "/api/v1/crop-cycles/{cycle_id}",
    response_model=ApiResponse[CropCycleRead],
    response_model_exclude_none=True,
)
async def update_crop_cycle(
    cycle_id: UUID,
    body: CropCyclePatch,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[CropCycleRead]:
    async with session.begin():
        cycle = await session.scalar(
            select(CropCycle)
            .join(Field, Field.id == CropCycle.field_id)
            .join(Farm, Farm.id == Field.farm_id)
            .where(
                CropCycle.id == cycle_id,
                Farm.owner_id == user.user_id,
                Farm.archived_at.is_(None),
            )
            .with_for_update()
        )
        if cycle is None:
            raise ApiProblem(404, "CROP_CYCLE_NOT_FOUND", "Crop cycle not found")
        old_status = cycle.status
        for key, value in body.model_dump(mode="python", exclude_unset=True).items():
            setattr(cycle, key, value)
        if body.status is not None and body.status != old_status:
            farm = await session.scalar(
                select(Farm)
                .join(Field, Field.farm_id == Farm.id)
                .where(Field.id == cycle.field_id)
                .with_for_update()
            )
            if old_status == "active" and body.status != "active":
                farm.active_crop_cycle_count = max(0, farm.active_crop_cycle_count - 1)
            elif old_status != "active" and body.status == "active":
                farm.active_crop_cycle_count += 1
        await session.flush()
        await session.refresh(cycle)
        result = CropCycleRead.model_validate(cycle)
    return ApiResponse(data=result, meta=metadata(request))


@router.post(
    "/api/v1/fields/{field_id}/observations",
    status_code=201,
    response_model=ApiResponse[ObservationRead],
    response_model_exclude_none=True,
)
async def create_observation(
    field_id: UUID,
    body: ObservationCreate,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[ObservationRead]:
    async with session.begin():
        await owned_field(session, field_id, user)
        if body.cycle_id is not None:
            cycle = await session.scalar(
                select(CropCycle).where(
                    CropCycle.id == body.cycle_id,
                    CropCycle.field_id == field_id,
                )
            )
            if cycle is None:
                raise ApiProblem(409, "CROP_CYCLE_MISMATCH", "Observation cycle does not belong to this field")
        values = body.model_dump(mode="python")
        values["observed_at"] = values.pop("timestamp")
        if values.get("geo_tag") is not None:
            values["geo_tag"] = values["geo_tag"].model_dump(mode="json")
        if values.get("media_urls") is not None:
            values["media_urls"] = [str(url) for url in values["media_urls"]]
        observation = Observation(field_id=field_id, **values)
        session.add(observation)
        await session.flush()
        await session.refresh(observation)
        result = ObservationRead.model_validate(observation_payload(observation))
    return ApiResponse(data=result, meta=metadata(request))


@router.get(
    "/api/v1/fields/{field_id}/observations",
    response_model=ApiResponse[list[ObservationRead]],
    response_model_exclude_none=True,
)
async def list_observations(
    field_id: UUID,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[list[ObservationRead]]:
    await owned_field(session, field_id, user)
    observations = await session.scalars(
        select(Observation)
        .where(Observation.field_id == field_id)
        .order_by(Observation.observed_at.desc(), Observation.id.desc())
    )
    data = [ObservationRead.model_validate(observation_payload(observation)) for observation in observations]
    return ApiResponse(data=data, meta=metadata(request))


def observation_payload(observation: Observation) -> dict:
    return {
        "id": observation.id,
        "field_id": observation.field_id,
        "cycle_id": observation.cycle_id,
        "observer_id": observation.observer_id,
        "observation_type": observation.observation_type,
        "timestamp": observation.observed_at,
        "metrics": observation.metrics,
        "notes": observation.notes,
        "geo_tag": observation.geo_tag,
        "media_urls": observation.media_urls,
        "created_at": observation.created_at,
    }
