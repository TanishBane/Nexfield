"""FieldSight request validation and ownership boundary."""
from typing import Annotated

from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .models import Farm, Field
from .schemas import ApiMeta, ApiResponse, DiagnoseRequest, ErrorResponse

router = APIRouter(
    prefix="/api/v1/fieldsight",
    tags=["FieldSight AI"],
    responses={status: {"model": ErrorResponse} for status in (401, 403, 404, 422, 503)},
)
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]


@router.post(
    "/diagnose",
    response_model=ApiResponse[dict],
    response_model_exclude_none=True,
    responses={503: {"model": ErrorResponse}},
)
async def diagnose(
    body: DiagnoseRequest,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[dict]:
    field = await session.scalar(
        select(Field)
        .join(Farm, Farm.id == Field.farm_id)
        .where(
            Field.id == body.field_id,
            Farm.owner_id == user.user_id,
            Farm.archived_at.is_(None),
        )
    )
    if field is None:
        raise ApiProblem(404, "FIELD_NOT_FOUND", "Field not found")

    raise ApiProblem(
        503,
        "MODEL_UNAVAILABLE",
        "FieldSight inference is not configured; no diagnosis was produced",
    )
