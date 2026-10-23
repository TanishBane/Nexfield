"""Owner-scoped CRUD. No administration or client-selected owner bypass."""
from datetime import datetime, timezone
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Query, Request
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .models import Farm, Field
from .schemas import ApiMeta, ApiResponse, ErrorResponse, FarmCreate, FarmPatch, FarmRead, Pagination

router = APIRouter(prefix="/api/v1/farms", tags=["Farms"],
                   responses={status: {"model": ErrorResponse} for status in (401, 403, 404, 409, 422, 503)})
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]


def metadata(request: Request, pagination: Pagination | None = None) -> ApiMeta:
    return ApiMeta(request_id=request.state.request_id, pagination=pagination)


async def owned_farm(session: AsyncSession, farm_id: UUID, user: Principal, *, lock: bool = False) -> Farm:
    statement = select(Farm).where(Farm.id == farm_id, Farm.owner_id == user.user_id, Farm.archived_at.is_(None))
    if lock:
        statement = statement.with_for_update()
    farm = await session.scalar(statement)
    if farm is None:
        raise ApiProblem(404, "FARM_NOT_FOUND", "Farm not found")
    return farm


@router.post("", status_code=201, response_model=ApiResponse[FarmRead], response_model_exclude_none=True)
async def create_farm(body: FarmCreate, request: Request, user: User, session: Session) -> ApiResponse[FarmRead]:
    async with session.begin():
        values = body.model_dump(mode="json")
        values["location"] = body.location.model_dump(mode="json", by_alias=True)
        farm = Farm(**values, owner_id=user.user_id)
        session.add(farm)
        await session.flush()
        result = FarmRead.model_validate(farm)
    return ApiResponse(data=result, meta=metadata(request))


@router.get("", response_model=ApiResponse[list[FarmRead]], response_model_exclude_none=True)
async def list_farms(request: Request, user: User, session: Session,
                     page: Annotated[int, Query(ge=1, le=100000)] = 1,
                     limit: Annotated[int, Query(ge=1, le=100)] = 20) -> ApiResponse[list[FarmRead]]:
    scope = (Farm.owner_id == user.user_id, Farm.archived_at.is_(None))
    total = await session.scalar(select(func.count()).select_from(Farm).where(*scope))
    farms = await session.scalars(select(Farm).where(*scope).order_by(Farm.created_at, Farm.id)
                                  .offset((page - 1) * limit).limit(limit))
    return ApiResponse(data=[FarmRead.model_validate(farm) for farm in farms],
                       meta=metadata(request, Pagination(page=page, limit=limit, total=total or 0)))


@router.get("/{farm_id}", response_model=ApiResponse[FarmRead], response_model_exclude_none=True)
async def get_farm(farm_id: UUID, request: Request, user: User, session: Session) -> ApiResponse[FarmRead]:
    farm = await owned_farm(session, farm_id, user)
    return ApiResponse(data=FarmRead.model_validate(farm), meta=metadata(request))


@router.patch("/{farm_id}", response_model=ApiResponse[FarmRead], response_model_exclude_none=True)
async def update_farm(farm_id: UUID, body: FarmPatch, request: Request, user: User, session: Session) -> ApiResponse[FarmRead]:
    async with session.begin():
        farm = await owned_farm(session, farm_id, user, lock=True)
        if body.total_area_hectares is not None:
            field_area = await session.scalar(select(func.coalesce(func.sum(Field.area_hectares), 0)).where(Field.farm_id == farm_id))
            if body.total_area_hectares < field_area:
                raise ApiProblem(409, "AREA_BELOW_FIELDS", "Farm area cannot be smaller than its recorded field area")
        values = body.model_dump(mode="json", exclude_unset=True)
        if body.location is not None:
            values["location"] = body.location.model_dump(mode="json", by_alias=True)
        for key, value in values.items():
            setattr(farm, key, value)
        await session.flush()
        await session.refresh(farm)
        result = FarmRead.model_validate(farm)
    return ApiResponse(data=result, meta=metadata(request))


@router.delete("/{farm_id}", response_model=ApiResponse[FarmRead], response_model_exclude_none=True)
async def archive_farm(farm_id: UUID, request: Request, user: User, session: Session,
                       confirmation: Annotated[str | None, Header(alias="X-Confirm-Delete")] = None) -> ApiResponse[FarmRead]:
    async with session.begin():
        farm = await owned_farm(session, farm_id, user, lock=True)
        if confirmation != str(farm_id):
            raise ApiProblem(409, "CONFIRMATION_REQUIRED", "Confirm farm archival with X-Confirm-Delete set to the farm ID")
        farm.archived_at = datetime.now(timezone.utc)
        await session.flush()
        await session.refresh(farm)
        result = FarmRead.model_validate(farm)
    # Archive instead of deleting dependent field records.
    return ApiResponse(data=result, meta=metadata(request))
