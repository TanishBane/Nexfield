"""Owner-scoped field CRUD."""
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Request
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .models import Farm, Field
from .schemas import ApiMeta, ApiResponse, ErrorResponse, FieldCreate, FieldPatch, FieldRead

router = APIRouter(
    prefix="/api/v1/farms/{farm_id}/fields",
    tags=["Fields"],
    responses={status: {"model": ErrorResponse} for status in (401, 404, 409, 422, 503)},
)
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]


async def owned_farm(
    session: AsyncSession,
    farm_id: UUID,
    user: Principal,
    *,
    lock: bool = False,
) -> Farm:
    statement = select(Farm).where(
        Farm.id == farm_id,
        Farm.owner_id == user.user_id,
        Farm.archived_at.is_(None),
    )
    if lock:
        statement = statement.with_for_update()
    farm = await session.scalar(statement)
    if farm is None:
        raise ApiProblem(404, "FARM_NOT_FOUND", "Farm not found")
    return farm


def metadata(request: Request) -> ApiMeta:
    return ApiMeta(request_id=request.state.request_id)


@router.post("", status_code=201, response_model=ApiResponse[FieldRead], response_model_exclude_none=True)
async def create_field(
    farm_id: UUID,
    body: FieldCreate,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[FieldRead]:
    async with session.begin():
        farm = await owned_farm(session, farm_id, user, lock=True)
        used_area = await session.scalar(
            select(func.coalesce(func.sum(Field.area_hectares), 0)).where(Field.farm_id == farm_id)
        )
        if used_area + body.area_hectares > farm.total_area_hectares:
            raise ApiProblem(409, "AREA_EXCEEDS_FARM", "Field area cannot exceed available farm area")
        field = Field(
            farm_id=farm_id,
            **body.model_dump(mode="json", by_alias=False),
        )
        session.add(field)
        await session.flush()
        await session.refresh(field)
        result = FieldRead.model_validate(field)
    return ApiResponse(data=result, meta=metadata(request))


@router.get("", response_model=ApiResponse[list[FieldRead]], response_model_exclude_none=True)
async def list_fields(
    farm_id: UUID,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[list[FieldRead]]:
    await owned_farm(session, farm_id, user)
    fields = await session.scalars(
        select(Field).where(Field.farm_id == farm_id).order_by(Field.created_at, Field.id)
    )
    return ApiResponse(
        data=[FieldRead.model_validate(field) for field in fields],
        meta=metadata(request),
    )


@router.get("/{field_id}", response_model=ApiResponse[FieldRead], response_model_exclude_none=True)
async def get_field(
    farm_id: UUID,
    field_id: UUID,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[FieldRead]:
    await owned_farm(session, farm_id, user)
    field = await session.scalar(select(Field).where(Field.id == field_id, Field.farm_id == farm_id))
    if field is None:
        raise ApiProblem(404, "FIELD_NOT_FOUND", "Field not found")
    return ApiResponse(data=FieldRead.model_validate(field), meta=metadata(request))


@router.patch("/{field_id}", response_model=ApiResponse[FieldRead], response_model_exclude_none=True)
async def update_field(
    farm_id: UUID,
    field_id: UUID,
    body: FieldPatch,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[FieldRead]:
    async with session.begin():
        farm = await owned_farm(session, farm_id, user, lock=True)
        field = await session.scalar(
            select(Field).where(Field.id == field_id, Field.farm_id == farm_id).with_for_update()
        )
        if field is None:
            raise ApiProblem(404, "FIELD_NOT_FOUND", "Field not found")
        if body.area_hectares is not None:
            other_area = await session.scalar(
                select(func.coalesce(func.sum(Field.area_hectares), 0)).where(
                    Field.farm_id == farm_id,
                    Field.id != field_id,
                )
            )
            if other_area + body.area_hectares > farm.total_area_hectares:
                raise ApiProblem(409, "AREA_EXCEEDS_FARM", "Field area cannot exceed available farm area")
        for key, value in body.model_dump(mode="json", exclude_unset=True).items():
            setattr(field, key, value)
        await session.flush()
        await session.refresh(field)
        result = FieldRead.model_validate(field)
    return ApiResponse(data=result, meta=metadata(request))


@router.delete("/{field_id}", response_model=ApiResponse[FieldRead], response_model_exclude_none=True)
async def delete_field(
    farm_id: UUID,
    field_id: UUID,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[FieldRead]:
    async with session.begin():
        await owned_farm(session, farm_id, user, lock=True)
        field = await session.scalar(
            select(Field).where(Field.id == field_id, Field.farm_id == farm_id).with_for_update()
        )
        if field is None:
            raise ApiProblem(404, "FIELD_NOT_FOUND", "Field not found")
        result = FieldRead.model_validate(field)
        await session.delete(field)
    return ApiResponse(data=result, meta=metadata(request))
