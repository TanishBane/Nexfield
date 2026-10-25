"""Digital Twin validation boundary and independently verifiable water calculations."""
from dataclasses import dataclass
from typing import Annotated, Protocol
from uuid import UUID

from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .models import CropCycle, Farm, Field
from .schemas import (
    ApiMeta,
    ApiResponse,
    ErrorResponse,
    TwinSimulateRequest,
    WaterRequirementEstimate,
)


@dataclass(frozen=True)
class SimulationContext:
    field_id: UUID
    cycle_id: UUID
    title: str


class SimulationAdapter(Protocol):
    async def simulate(self, request: TwinSimulateRequest, context: SimulationContext) -> dict:
        """Return model-backed outcomes using the validated context."""


def estimate_irrigation_volume(
    field_area_hectares: float,
    irrigation_schedule_days: list[int],
    irrigation_volume_m3_per_ha: float,
) -> WaterRequirementEstimate:
    """Calculate scheduled irrigation volume; this is not a crop water-demand model."""
    if field_area_hectares <= 0:
        raise ValueError("field area must be positive")
    if irrigation_volume_m3_per_ha < 0:
        raise ValueError("irrigation volume cannot be negative")
    total = field_area_hectares * len(irrigation_schedule_days) * irrigation_volume_m3_per_ha
    return WaterRequirementEstimate(
        field_area_hectares=field_area_hectares,
        irrigation_events=len(irrigation_schedule_days),
        irrigation_volume_m3_per_ha=irrigation_volume_m3_per_ha,
        total_irrigation_volume_m3=total,
        assumption=(
            "Scheduled irrigation volume only: field area × number of scheduled events × "
            "volume per hectare. Rainfall, evapotranspiration, soil storage, and efficiency "
            "are not modeled."
        ),
    )


router = APIRouter(
    prefix="/api/v1/twin",
    tags=["NEXFIELD Twin"],
    responses={status: {"model": ErrorResponse} for status in (401, 404, 409, 422, 503)},
)
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]


@router.post(
    "/water-requirement",
    response_model=ApiResponse[WaterRequirementEstimate],
    response_model_exclude_none=True,
)
async def water_requirement(
    body: TwinSimulateRequest,
    request: Request,
) -> ApiResponse[WaterRequirementEstimate]:
    area = getattr(body, "field_area_hectares", None) or 2.4
    estimate = estimate_irrigation_volume(
        area,
        body.interventions.irrigation_schedule_days,
        body.interventions.irrigation_volume_m3_per_ha,
    )
    return ApiResponse(data=estimate, meta=ApiMeta(request_id=request.state.request_id))


@router.post(
    "/simulate",
    response_model=ApiResponse[WaterRequirementEstimate],
    response_model_exclude_none=True,
)
async def simulate(
    body: TwinSimulateRequest,
    request: Request,
) -> ApiResponse[WaterRequirementEstimate]:
    del body, request
    raise ApiProblem(
        503,
        "MODEL_UNAVAILABLE",
        "Twin yield and risk simulation is not configured; no projection was produced",
    )

