"""Authorized Intelligence provider boundary.

The LLM provider is intentionally not configured here; this module never fabricates
answers when no provider is available.
"""
from typing import Annotated, Protocol
from uuid import UUID

from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .models import Farm, Field
from .schemas import ApiMeta, ApiResponse, ErrorResponse, IntelligenceChatRequest


class IntelligenceProvider(Protocol):
    async def answer(self, request: IntelligenceChatRequest, farm_id: UUID) -> dict:
        """Return a provider-grounded answer with citations."""


router = APIRouter(
    prefix="/api/v1/intelligence",
    tags=["NEXFIELD Intelligence"],
    responses={status: {"model": ErrorResponse} for status in (401, 404, 422, 503)},
)
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]


@router.post(
    "/chat",
    response_model=ApiResponse[dict],
    response_model_exclude_none=True,
)
async def chat(
    body: IntelligenceChatRequest,
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[dict]:
    farm = await session.scalar(
        select(Farm).where(
            Farm.id == body.farm_id,
            Farm.owner_id == user.user_id,
            Farm.archived_at.is_(None),
        )
    )
    if farm is None:
        raise ApiProblem(404, "FARM_NOT_FOUND", "Farm not found")
    if body.field_id is not None:
        field = await session.scalar(
            select(Field).where(Field.id == body.field_id, Field.farm_id == body.farm_id)
        )
        if field is None:
            raise ApiProblem(404, "FIELD_NOT_FOUND", "Field not found")
    raise ApiProblem(
        503,
        "LLM_UNAVAILABLE",
        "Intelligence provider is not configured; no answer was produced",
    )
