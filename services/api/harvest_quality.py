"""NEXFIELD Harvest Quality Intelligence — Post-Harvest Food Spoilage & Quality Risk Engine.

Commodity-specific post-harvest preservation metrics adhering to FAO & ICAR storage criteria:
- Perishable horticulture (Tomato: chilling injury, transpiration loss, ethylene decay)
- Cereal grains (Wheat: equilibrium moisture content, Aspergillus mold threshold, hot-spotting)
- Paddy / Rice (Basmati: grain yellowing, fissuring, safe milling moisture)
"""
from datetime import date, datetime, timedelta, timezone
from typing import Annotated, Any, Dict, List, Literal, Optional
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .farms import owned_farm
from .models import Farm, FarmTask, HarvestBatch
from .schemas import ApiMeta, ApiResponse, ContractModel, ErrorResponse

router = APIRouter(
    prefix="/api/v1/ops/harvest-quality",
    tags=["Harvest Quality Intelligence"],
    responses={status: {"model": ErrorResponse} for status in (401, 404, 422, 503)},
)
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]

QualityRiskLevel = Literal["low", "moderate", "elevated", "critical", "insufficient_data"]


class QualityContributingFactor(ContractModel):
    factor_name: str
    observed_value: float
    safe_threshold_range: str
    impact_description: str


class HarvestQualityAssessment(ContractModel):
    batch_id: Optional[UUID] = None
    batch_code: Optional[str] = None
    commodity: str
    variety: Optional[str] = None
    risk_level: QualityRiskLevel
    risk_score: float  # 0.0 - 100.0 (Heuristic risk index; not an empirical probability)
    estimated_shelf_life_days_remaining: Optional[int] = None
    primary_risk_mechanism: str
    contributing_factors: List[QualityContributingFactor]
    recommended_action: str
    recommended_task_title: Optional[str] = None
    recommended_task_category: str = "equipment_maintenance"
    market_disposal_advice: Optional[str] = None
    scientific_reference: str
    assessment_timestamp: str


class AssessQualityRequest(ContractModel):
    batch_id: Optional[UUID] = None
    commodity: str
    variety: Optional[str] = None
    storage_temperature_c: float
    storage_relative_humidity_percent: float
    current_moisture_percent: float
    storage_duration_days: int
    storage_type: str = "ambient_godown"  # cold_storage_controlled, ventilated_crate, ambient_godown, silo_hermetic


def evaluate_harvest_quality_risk(
    commodity: str,
    temp_c: float,
    rh_percent: float,
    moisture_percent: float,
    storage_days: int,
    storage_type: str = "ambient_godown",
    batch_id: Optional[UUID] = None,
    batch_code: Optional[str] = None,
    variety: Optional[str] = None,
) -> HarvestQualityAssessment:
    """Evaluates commodity-specific storage physics and biological degradation risks."""
    comm_lower = commodity.lower().strip()
    factors: List[QualityContributingFactor] = []
    now_iso = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    # 1. TOMATO (Perishable horticultural produce)
    if "tomato" in comm_lower:
        risk_score = 15.0
        primary_risk = "Normal post-harvest transpiration"
        shelf_life_days = max(0, 18 - storage_days)
        ref = "FAO Horticultural Post-Harvest Handling Bulletin 149 / ICAR-IIHR Tomato Storage Protocol"

        # Check Chilling Injury (Temp < 10.0 C)
        if temp_c < 10.0:
            risk_score += 45.0
            primary_risk = "Foliar Chilling Injury (Pitting & Ripening Arrest)"
            factors.append(
                QualityContributingFactor(
                    factor_name="Storage Temperature",
                    observed_value=temp_c,
                    safe_threshold_range="12.5°C - 15.0°C",
                    impact_description="Temperatures below 10°C damage cellular membrane integrity, inducing surface pitting and water-soaked breakdown.",
                )
            )

        # Check Heat Decay Acceleration (Temp > 22.0 C)
        elif temp_c > 22.0:
            excess_temp = temp_c - 22.0
            risk_score += min(excess_temp * 4.5, 40.0)
            primary_risk = "Thermal Softening & Respiration Acceleration"
            shelf_life_days = max(1, int(shelf_life_days * 0.4))
            factors.append(
                QualityContributingFactor(
                    factor_name="Storage Temperature",
                    observed_value=temp_c,
                    safe_threshold_range="12.5°C - 15.0°C",
                    impact_description="Elevated temperature accelerates ethylene generation and fungal spore germination (Alternaria / Botrytis rot).",
                )
            )

        # Check Relative Humidity (Vapor Pressure Deficit)
        if rh_percent < 85.0:
            risk_score += 20.0
            factors.append(
                QualityContributingFactor(
                    factor_name="Relative Humidity",
                    observed_value=rh_percent,
                    safe_threshold_range="90% - 95% RH",
                    impact_description="Dry air drives rapid transpirational weight loss, flaccidity, and fruit shriveling.",
                )
            )
        elif rh_percent > 96.0 and temp_c > 18.0:
            risk_score += 25.0
            factors.append(
                QualityContributingFactor(
                    factor_name="Relative Humidity & Condensation",
                    observed_value=rh_percent,
                    safe_threshold_range="90% - 95% RH",
                    impact_description="Free condensation on fruit epidermis promotes fungal rhizopus soft rot.",
                )
            )

        # Check Storage Duration
        if storage_days > 14:
            risk_score += min((storage_days - 14) * 4.0, 30.0)
            factors.append(
                QualityContributingFactor(
                    factor_name="Storage Duration",
                    observed_value=float(storage_days),
                    safe_threshold_range="≤ 14 days",
                    impact_description="Exceeds standard firm ripe commercial storage window; progressive senescent breakdown expected.",
                )
            )

        risk_score = min(max(risk_score, 0.0), 100.0)
        risk_level: QualityRiskLevel = (
            "critical" if risk_score >= 70.0 else "elevated" if risk_score >= 45.0 else "moderate" if risk_score >= 25.0 else "low"
        )

        advice = (
            "Prioritize immediate wholesale dispatch at local APMC mandi within 24–48 hours to prevent grade downgrading from Grade A to Grade C processing."
            if risk_score >= 50.0
            else "Batch condition stable for planned distribution window."
        )

        return HarvestQualityAssessment(
            batch_id=batch_id,
            batch_code=batch_code,
            commodity=commodity,
            variety=variety or "Hybrid Red",
            risk_level=risk_level,
            risk_score=round(risk_score, 1),
            estimated_shelf_life_days_remaining=shelf_life_days,
            primary_risk_mechanism=primary_risk,
            contributing_factors=factors,
            recommended_action=(
                "Inspect crates for epidermal water-soaking and verify refrigeration airflow."
                if risk_score >= 45.0
                else "Maintain ambient evaporative cooling and inspect in 3 days."
            ),
            recommended_task_title=f"Conduct crate decay inspection for {batch_code or commodity}",
            recommended_task_category="crop_scouting",
            market_disposal_advice=advice,
            scientific_reference=ref,
            assessment_timestamp=now_iso,
        )

    # 2. WHEAT (Hygroscopic cereal grain)
    elif "wheat" in comm_lower:
        risk_score = 10.0
        primary_risk = "Equilibrium grain storage"
        shelf_life_days = max(30, 365 - (storage_days * 2))
        ref = "ICAR-IIWBR Grain Storage Guidelines / Codex Alimentarius Standard 199-1995"

        # Moisture content check
        if moisture_percent > 14.0:
            excess_m = moisture_percent - 14.0
            risk_score += 30.0 + min(excess_m * 15.0, 50.0)
            primary_risk = "Grain Heating & Aspergillus Mold Spoilage"
            shelf_life_days = min(shelf_life_days, 30)
            factors.append(
                QualityContributingFactor(
                    factor_name="Grain Moisture Content",
                    observed_value=moisture_percent,
                    safe_threshold_range="< 12.0% (Safe equilibrium)",
                    impact_description="Moisture above 14% triggers grain metabolic respiration, spontaneous heating hot-spots, and mycotoxin formation.",
                )
            )
        elif moisture_percent > 12.5:
            risk_score += 20.0
            factors.append(
                QualityContributingFactor(
                    factor_name="Grain Moisture Content",
                    observed_value=moisture_percent,
                    safe_threshold_range="< 12.0%",
                    impact_description="Elevated moisture creates favorable conditions for primary insect pests (Sitophilus granarius).",
                )
            )

        # Storage temperature check
        if temp_c > 30.0:
            risk_score += 18.0
            factors.append(
                QualityContributingFactor(
                    factor_name="Ambient Silo Temperature",
                    observed_value=temp_c,
                    safe_threshold_range="< 25.0°C",
                    impact_description="Elevated storage temperature accelerates gluten protein degradation and lipid rancidity in milling flour.",
                )
            )

        risk_score = min(max(risk_score, 0.0), 100.0)
        risk_level = "critical" if risk_score >= 65.0 else "elevated" if risk_score >= 40.0 else "moderate" if risk_score >= 20.0 else "low"

        return HarvestQualityAssessment(
            batch_id=batch_id,
            batch_code=batch_code,
            commodity=commodity,
            variety=variety or "Milling Grade",
            risk_level=risk_level,
            risk_score=round(risk_score, 1),
            estimated_shelf_life_days_remaining=shelf_life_days,
            primary_risk_mechanism=primary_risk,
            contributing_factors=factors,
            recommended_action=(
                "Initiate silo blower mechanical aeration or sun-dry grain lot to drive moisture below 12.0%."
                if moisture_percent > 12.5
                else "Silo conditions compliant with ICAR long-term reserve grain standards."
            ),
            recommended_task_title=f"Sample grain moisture & check aeration for {batch_code or commodity}",
            recommended_task_category="equipment_maintenance",
            market_disposal_advice=(
                "Grain moisture exceeds standard procurement spec (12.0%); mandis will dock dockage/cleaning fees unless dried before arrival."
                if moisture_percent > 12.5
                else "Eligible for premium Grade A export or FCI mill quality procurement."
            ),
            scientific_reference=ref,
            assessment_timestamp=now_iso,
        )

    # 3. PADDY / BASMATI RICE
    elif "rice" in comm_lower or "paddy" in comm_lower:
        risk_score = 12.0
        primary_risk = "Grain moisture equilibrium"
        shelf_life_days = max(45, 270 - storage_days)
        ref = "ICAR-NRRI Cuttack Paddy Storage Handbook / IRRI Postharvest Compendium"

        if moisture_percent > 14.5:
            risk_score += 50.0
            primary_risk = "Grain Yellowing, Stacking Fissures & Fungal Decay"
            factors.append(
                QualityContributingFactor(
                    factor_name="Paddy Moisture",
                    observed_value=moisture_percent,
                    safe_threshold_range="12.0% - 13.0%",
                    impact_description="Moisture above 14.5% causes internal fissuring during milling, reducing head rice recovery (HRR) by 15-25%.",
                )
            )

        if temp_c > 32.0 and rh_percent > 75.0:
            risk_score += 25.0
            factors.append(
                QualityContributingFactor(
                    factor_name="Storage Heat & Humidity",
                    observed_value=temp_c,
                    safe_threshold_range="< 28°C, < 70% RH",
                    impact_description="High enthalpy ambient conditions induce grain fermentation and yellow enzymatic discoloration.",
                )
            )

        risk_score = min(max(risk_score, 0.0), 100.0)
        risk_level = "critical" if risk_score >= 65.0 else "elevated" if risk_score >= 40.0 else "moderate" if risk_score >= 20.0 else "low"

        return HarvestQualityAssessment(
            batch_id=batch_id,
            batch_code=batch_code,
            commodity=commodity,
            variety=variety or "PB-1121",
            risk_level=risk_level,
            risk_score=round(risk_score, 1),
            estimated_shelf_life_days_remaining=shelf_life_days,
            primary_risk_mechanism=primary_risk,
            contributing_factors=factors,
            recommended_action="Turn grain bags and ventilate storage godown.",
            recommended_task_title=f"Aerate and inspect paddy stack for {batch_code or commodity}",
            recommended_task_category="equipment_maintenance",
            market_disposal_advice="Maintain moisture at 12.5% for maximum Basmati export premium.",
            scientific_reference=ref,
            assessment_timestamp=now_iso,
        )

    # 4. UNSUPPORTED COMMODITY (Transparently disclaimed)
    return HarvestQualityAssessment(
        batch_id=batch_id,
        batch_code=batch_code,
        commodity=commodity,
        variety=variety,
        risk_level="insufficient_data",
        risk_score=0.0,
        estimated_shelf_life_days_remaining=None,
        primary_risk_mechanism="Commodity reference parameters not yet calibrated in NEXFIELD registry",
        contributing_factors=[],
        recommended_action=f"Consult regional agricultural extension bulletin for specific post-harvest handling of {commodity}.",
        recommended_task_title=None,
        recommended_task_category="crop_scouting",
        market_disposal_advice="Standard market timing recommended.",
        scientific_reference="NEXFIELD Multi-Commodity Post-Harvest Roadmap (Active calibration for Tomato, Wheat, Rice).",
        assessment_timestamp=now_iso,
    )


@router.post(
    "/assess",
    response_model=ApiResponse[HarvestQualityAssessment],
    response_model_exclude_none=True,
)
async def assess_quality(
    body: AssessQualityRequest,
    request: Request,
    user: User,
) -> ApiResponse[HarvestQualityAssessment]:
    """Calculates defensible post-harvest quality risk and shelf-life projections."""
    del user
    assessment = evaluate_harvest_quality_risk(
        commodity=body.commodity,
        temp_c=body.storage_temperature_c,
        rh_percent=body.storage_relative_humidity_percent,
        moisture_percent=body.current_moisture_percent,
        storage_days=body.storage_duration_days,
        storage_type=body.storage_type,
        batch_id=body.batch_id,
        variety=body.variety,
    )
    return ApiResponse(data=assessment, meta=ApiMeta(request_id=request.state.request_id))


@router.get(
    "/batches",
    response_model=ApiResponse[List[HarvestQualityAssessment]],
    response_model_exclude_none=True,
)
async def list_batch_quality_assessments(
    farm_id: Annotated[UUID, Query(alias="farmId")],
    request: Request,
    user: User,
    session: Session,
) -> ApiResponse[List[HarvestQualityAssessment]]:
    """Retrieve quality assessments for all registered batches under the authorized farm."""
    await owned_farm(session, farm_id, user)

    batches = list(
        await session.scalars(
            select(HarvestBatch)
            .where(HarvestBatch.farm_id == farm_id)
            .order_by(HarvestBatch.harvest_date.desc())
        )
    )

    assessments: List[HarvestQualityAssessment] = []
    today = date.today()

    for b in batches:
        days_stored = max((today - b.harvest_date).days, 0)
        # Standard warehouse ambient conditions if not individually instrumented
        temp_c = 18.5 if "cold" in b.storage_warehouse.lower() else 24.5
        rh_pct = 92.0 if "tomato" in b.crop_name.lower() else 65.0

        assessment = evaluate_harvest_quality_risk(
            commodity=b.crop_name,
            temp_c=temp_c,
            rh_percent=rh_pct,
            moisture_percent=b.moisture_content_percent,
            storage_days=days_stored,
            storage_type="cold_storage_controlled" if "cold" in b.storage_warehouse.lower() else "ambient_godown",
            batch_id=b.id,
            batch_code=b.batch_code,
            variety=b.variety,
        )
        assessments.append(assessment)

    return ApiResponse(data=assessments, meta=ApiMeta(request_id=request.state.request_id))
