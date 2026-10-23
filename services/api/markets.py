"""Real market-data provider boundary integrating Agmarknet and CEDA adapters.

Features:
- Live/configured Agmarknet & CEDA adapter routing with honest provider boundary
- Multi-factor Freight & Haulage Economics engine (fuel, tolls, bhatta, hamali, mandi cess 1.5%, shrinkage loss 1%)
- Official CACP Minimum Support Price (MSP) reference schedule (Wheat RMS 2024-25 ₹2,275, RMS 2026-27 ₹2,585, Paddy ₹2,300)
"""
import math
import os
from datetime import datetime, timezone
from typing import Annotated, Any, Dict, List, Literal, Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, Query, Request
from pydantic import Field
from sqlalchemy.ext.asyncio import AsyncSession

from .app.integrations.agmarknet import AgmarknetAdapter
from .app.integrations.base import ConfigurationError, IntegrationError
from .app.integrations.ceda import CedaAdapter
from .auth import Principal, get_principal
from .database import get_session
from .errors import ApiProblem
from .schemas import ApiMeta, ApiResponse, ContractModel, ErrorResponse, MarketQuery

router = APIRouter(
    prefix="/api/v1/markets",
    tags=["NEXFIELD Markets"],
    responses={status: {"model": ErrorResponse} for status in (401, 422, 503)},
)
User = Annotated[Principal, Depends(get_principal)]
Session = Annotated[AsyncSession, Depends(get_session)]

VehicleType = Literal["light_commercial_vehicle", "tractor_trolley", "medium_truck", "heavy_truck"]


class FreightCalculationRequest(ContractModel):
    modal_price_inr_per_quintal: float = Field(gt=0, description="Gross APMC modal price per quintal in INR")
    distance_km: float = Field(ge=0, description="One-way haulage distance in kilometers")
    lot_quantity_quintals: float = Field(gt=0, description="Consignment weight in quintals (100 kg)")
    vehicle_type: VehicleType = "medium_truck"
    diesel_price_inr_per_liter: float = Field(default=90.0, gt=0)
    driver_bhatta_inr: float = Field(default=500.0, ge=0)
    tolls_inr: float = Field(default=0.0, ge=0)
    loading_unloading_hamali_per_quintal_inr: float = Field(default=12.0, ge=0)
    mandi_fee_percent: float = Field(default=1.5, ge=0, le=10.0)
    shrinkage_loss_percent: float = Field(default=1.0, ge=0, le=10.0)


VEHICLE_SPECS: Dict[VehicleType, Dict[str, Any]] = {
    "light_commercial_vehicle": {
        "name": "Light Commercial Vehicle (e.g. Bolero Maxi Truck / Tata 407)",
        "capacity_quintals": 25.0,
        "fuel_efficiency_km_per_liter": 11.0,
        "typical_bhatta_inr": 400.0,
    },
    "tractor_trolley": {
        "name": "Standard Agricultural Tractor-Trolley (45 HP)",
        "capacity_quintals": 50.0,
        "fuel_efficiency_km_per_liter": 6.0,
        "typical_bhatta_inr": 350.0,
    },
    "medium_truck": {
        "name": "Medium 6-Wheeler Freight Carrier (10 Ton GVW)",
        "capacity_quintals": 100.0,
        "fuel_efficiency_km_per_liter": 4.5,
        "typical_bhatta_inr": 600.0,
    },
    "heavy_truck": {
        "name": "Heavy Multi-Axle 10-Wheeler Truck (25 Ton GVW)",
        "capacity_quintals": 250.0,
        "fuel_efficiency_km_per_liter": 3.2,
        "typical_bhatta_inr": 800.0,
    },
}

CACP_MSP_BENCHMARKS: List[Dict[str, Any]] = [
    {
        "commodity": "Wheat",
        "variety": "Milling / Common",
        "marketing_season": "RMS 2026-27",
        "crop_year": "2025-26",
        "msp_inr_per_quintal": 2585.0,
        "cost_a2_fl_inr": 1260.0,
        "margin_over_cost_pct": 105.2,
        "procurement_agency": "Food Corporation of India (FCI)",
        "statutory_status": "Approved by CCEA (Cabinet Committee on Economic Affairs)",
    },
    {
        "commodity": "Wheat",
        "variety": "Milling / Common",
        "marketing_season": "RMS 2024-25",
        "crop_year": "2023-24",
        "msp_inr_per_quintal": 2275.0,
        "cost_a2_fl_inr": 1128.0,
        "margin_over_cost_pct": 101.7,
        "procurement_agency": "Food Corporation of India (FCI)",
        "statutory_status": "Historical Procurement Season Benchmark",
    },
    {
        "commodity": "Paddy (Common)",
        "variety": "Common Grade",
        "marketing_season": "KMS 2024-25",
        "crop_year": "2024-25",
        "msp_inr_per_quintal": 2300.0,
        "cost_a2_fl_inr": 1438.0,
        "margin_over_cost_pct": 60.0,
        "procurement_agency": "FCI / State Civil Supplies Agencies",
        "statutory_status": "Active Kharif Statutory Floor Price",
    },
    {
        "commodity": "Paddy (Grade A)",
        "variety": "Fine Grain",
        "marketing_season": "KMS 2024-25",
        "crop_year": "2024-25",
        "msp_inr_per_quintal": 2320.0,
        "cost_a2_fl_inr": 1438.0,
        "margin_over_cost_pct": 61.3,
        "procurement_agency": "FCI / State Civil Supplies Agencies",
        "statutory_status": "Active Kharif Statutory Floor Price",
    },
    {
        "commodity": "Gram (Chana)",
        "variety": "Desi Standard",
        "marketing_season": "RMS 2024-25",
        "crop_year": "2023-24",
        "msp_inr_per_quintal": 5440.0,
        "cost_a2_fl_inr": 3400.0,
        "margin_over_cost_pct": 60.0,
        "procurement_agency": "NAFED (Price Support Scheme)",
        "statutory_status": "Active Rabi Statutory Floor Price",
    },
    {
        "commodity": "Mustard / Rapeseed",
        "variety": "Standard Black / Yellow",
        "marketing_season": "RMS 2024-25",
        "crop_year": "2023-24",
        "msp_inr_per_quintal": 5650.0,
        "cost_a2_fl_inr": 2855.0,
        "margin_over_cost_pct": 97.9,
        "procurement_agency": "NAFED / State Federations",
        "statutory_status": "Active Rabi Statutory Floor Price",
    },
    {
        "commodity": "Soybean (Yellow)",
        "variety": "Oilseed Standard",
        "marketing_season": "KMS 2024-25",
        "crop_year": "2024-25",
        "msp_inr_per_quintal": 4892.0,
        "cost_a2_fl_inr": 3261.0,
        "margin_over_cost_pct": 50.0,
        "procurement_agency": "NAFED (Price Support Scheme)",
        "statutory_status": "Active Kharif Statutory Floor Price",
    },
    {
        "commodity": "Maize",
        "variety": "Yellow Grain",
        "marketing_season": "KMS 2024-25",
        "crop_year": "2024-25",
        "msp_inr_per_quintal": 2225.0,
        "cost_a2_fl_inr": 1483.0,
        "margin_over_cost_pct": 50.0,
        "procurement_agency": "FCI / NAFED",
        "statutory_status": "Active Kharif Statutory Floor Price",
    },
    {
        "commodity": "Tomato (Horticultural)",
        "variety": "Hybrid Red / San Marzano",
        "marketing_season": "Perennial / Continuous",
        "crop_year": "2024-26",
        "msp_inr_per_quintal": None,
        "cost_a2_fl_inr": None,
        "margin_over_cost_pct": 0.0,
        "procurement_agency": "Operation Greens (MoFPI) / TOP Price Stabilisation Buffer",
        "statutory_status": "Non-MSP Horticultural Commodity (Regulated via APMC Daily Open Auction & MIS Schemes)",
    },
]


def calculate_transport_freight_economics(
    modal_price_inr_per_quintal: float,
    distance_km: float,
    lot_quantity_quintals: float,
    vehicle_type: VehicleType = "medium_truck",
    diesel_price_inr_per_liter: float = 90.0,
    driver_bhatta_inr: float = 500.0,
    tolls_inr: float = 0.0,
    loading_unloading_hamali_per_quintal_inr: float = 12.0,
    mandi_fee_percent: float = 1.5,
    shrinkage_loss_percent: float = 1.0,
) -> Dict[str, Any]:
    """Calculate multi-factor freight haulage economics, deductions, and net farmer realization."""
    specs = VEHICLE_SPECS.get(vehicle_type, VEHICLE_SPECS["medium_truck"])
    capacity = specs["capacity_quintals"]
    efficiency = specs["fuel_efficiency_km_per_liter"]

    trips = math.ceil(lot_quantity_quintals / capacity)
    round_trip_km = distance_km * 2.0
    total_km = round(trips * round_trip_km, 1)

    fuel_liters = round(total_km / efficiency, 2)
    fuel_cost = round(fuel_liters * diesel_price_inr_per_liter, 2)
    fuel_cost_per_q = round(fuel_cost / lot_quantity_quintals, 2)

    # Toll estimation: if not supplied, estimate highway toll (~1.5 INR/km beyond 20 km)
    if tolls_inr > 0:
        total_tolls = round(trips * tolls_inr, 2)
    else:
        total_tolls = round(trips * max(0.0, distance_km - 20.0) * 1.5, 2)
    toll_per_q = round(total_tolls / lot_quantity_quintals, 2)

    total_driver_bhatta = round(trips * driver_bhatta_inr, 2)
    driver_per_q = round(total_driver_bhatta / lot_quantity_quintals, 2)

    hamali_per_q = round(loading_unloading_hamali_per_quintal_inr, 2)
    total_hamali = round(hamali_per_q * lot_quantity_quintals, 2)

    mandi_fee_per_q = round(modal_price_inr_per_quintal * (mandi_fee_percent / 100.0), 2)
    total_mandi_fee = round(mandi_fee_per_q * lot_quantity_quintals, 2)

    shrinkage_loss_per_q = round(modal_price_inr_per_quintal * (shrinkage_loss_percent / 100.0), 2)
    total_shrinkage = round(shrinkage_loss_per_q * lot_quantity_quintals, 2)

    total_deductions_per_q = round(
        fuel_cost_per_q + toll_per_q + driver_per_q + hamali_per_q + mandi_fee_per_q + shrinkage_loss_per_q, 2
    )
    total_deductions = round(
        fuel_cost + total_tolls + total_driver_bhatta + total_hamali + total_mandi_fee + total_shrinkage, 2
    )

    gross_revenue = round(modal_price_inr_per_quintal * lot_quantity_quintals, 2)
    net_realization_per_q = round(modal_price_inr_per_quintal - total_deductions_per_q, 2)
    net_revenue = round(net_realization_per_q * lot_quantity_quintals, 2)
    net_realization_pct = round((net_realization_per_q / modal_price_inr_per_quintal) * 100.0, 2)

    verdict = (
        "Highly Profitable Realization"
        if net_realization_pct >= 90.0
        else "Viable Arbitrage Corridor"
        if net_realization_pct >= 80.0
        else "Marginal Corridor (High Freight & Cess Erosion)"
        if net_realization_pct >= 65.0
        else "Unviable Corridors (Logistics Outweighs Farmgate Spread)"
    )

    return {
        "vehicle_type": vehicle_type,
        "vehicle_name": specs["name"],
        "vehicle_capacity_quintals": capacity,
        "trips_required": trips,
        "one_way_distance_km": distance_km,
        "total_round_trip_distance_km": total_km,
        "fuel_efficiency_km_per_liter": efficiency,
        "fuel_liters_consumed": fuel_liters,
        "fuel_cost_inr": fuel_cost,
        "fuel_cost_per_quintal_inr": fuel_cost_per_q,
        "toll_charges_total_inr": total_tolls,
        "toll_charges_per_quintal_inr": toll_per_q,
        "driver_bhatta_total_inr": total_driver_bhatta,
        "driver_bhatta_per_quintal_inr": driver_per_q,
        "hamali_labor_total_inr": total_hamali,
        "hamali_labor_per_quintal_inr": hamali_per_q,
        "mandi_fee_total_inr": total_mandi_fee,
        "mandi_fee_per_quintal_inr": mandi_fee_per_q,
        "mandi_fee_percent": mandi_fee_percent,
        "shrinkage_loss_total_inr": total_shrinkage,
        "shrinkage_loss_per_quintal_inr": shrinkage_loss_per_q,
        "shrinkage_loss_percent": shrinkage_loss_percent,
        "gross_modal_price_inr_per_quintal": modal_price_inr_per_quintal,
        "gross_revenue_inr": gross_revenue,
        "total_deductions_per_quintal_inr": total_deductions_per_q,
        "total_deductions_inr": total_deductions,
        "net_realization_per_quintal_inr": net_realization_per_q,
        "net_revenue_inr": net_revenue,
        "net_realization_percent": net_realization_pct,
        "profitability_verdict": verdict,
    }


# ==============================================================================
# ROUTE HANDLERS
# ==============================================================================


@router.post("/calculate-freight", response_model=ApiResponse[Dict[str, Any]])
async def calculate_freight_endpoint(
    body: FreightCalculationRequest,
    request: Request,
    user: User,
) -> ApiResponse[Dict[str, Any]]:
    """Calculate verified multi-factor transport haulage economics and farmer net realization."""
    del user
    res = calculate_transport_freight_economics(
        modal_price_inr_per_quintal=body.modal_price_inr_per_quintal,
        distance_km=body.distance_km,
        lot_quantity_quintals=body.lot_quantity_quintals,
        vehicle_type=body.vehicle_type,
        diesel_price_inr_per_liter=body.diesel_price_inr_per_liter,
        driver_bhatta_inr=body.driver_bhatta_inr,
        tolls_inr=body.tolls_inr,
        loading_unloading_hamali_per_quintal_inr=body.loading_unloading_hamali_per_quintal_inr,
        mandi_fee_percent=body.mandi_fee_percent,
        shrinkage_loss_percent=body.shrinkage_loss_percent,
    )
    return ApiResponse(
        data=res,
        meta=ApiMeta(
            request_id=getattr(request.state, "request_id", str(uuid4())),
            is_fixture=False,
        ),
    )


@router.get("/msp-benchmarks", response_model=ApiResponse[List[Dict[str, Any]]])
async def get_msp_benchmarks(
    request: Request,
    commodity: Optional[str] = Query(None, description="Filter by crop commodity"),
    marketing_season: Optional[str] = Query(None, description="Filter by season (e.g. RMS 2026-27, KMS 2024-25)"),
) -> ApiResponse[List[Dict[str, Any]]]:
    """Retrieve authoritative official CACP Minimum Support Price benchmarks."""
    results = CACP_MSP_BENCHMARKS
    if commodity:
        comm_clean = commodity.lower().strip()
        results = [r for r in results if comm_clean in r["commodity"].lower()]
    if marketing_season:
        season_clean = marketing_season.lower().strip()
        results = [r for r in results if season_clean in r["marketing_season"].lower()]

    return ApiResponse(
        data=results,
        meta=ApiMeta(
            request_id=getattr(request.state, "request_id", str(uuid4())),
            is_fixture=False,
        ),
    )


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

    # 1. Try Agmarknet Adapter if configured
    if os.getenv("AGMARKNET_API_URL") and os.getenv("AGMARKNET_API_KEY"):
        try:
            adapter = AgmarknetAdapter()
            records = await adapter.get_daily_prices(commodity=commodity, state=state, district=district)
            data = [r.model_dump(mode="json") for r in records]
            return ApiResponse(data=data, meta=ApiMeta(request_id=request.state.request_id))
        except (ConfigurationError, IntegrationError) as exc:
            raise ApiProblem(503, "MARKET_DATA_UNAVAILABLE", f"Agmarknet provider error: {exc}")

    # 2. Try CEDA Adapter if configured
    if os.getenv("CEDA_API_URL") and os.getenv("CEDA_API_KEY"):
        try:
            adapter = CedaAdapter()
            records = await adapter.get_historical_prices(commodity=commodity, state=state)
            data = [r.model_dump(mode="json") for r in records]
            return ApiResponse(data=data, meta=ApiMeta(request_id=request.state.request_id))
        except (ConfigurationError, IntegrationError) as exc:
            raise ApiProblem(503, "MARKET_DATA_UNAVAILABLE", f"CEDA provider error: {exc}")

    raise ApiProblem(
        503,
        "MARKET_DATA_UNAVAILABLE",
        "Market data provider is not configured in this environment (requires AGMARKNET_API_KEY or CEDA_API_KEY); no synthetic price was produced.",
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
    if os.getenv("AGMARKNET_API_URL") and os.getenv("AGMARKNET_API_KEY"):
        try:
            adapter = AgmarknetAdapter()
            records = await adapter.get_daily_prices(commodity=commodity, limit=20)
            data = [r.model_dump(mode="json") for r in records]
            return ApiResponse(data=data, meta=ApiMeta(request_id=request.state.request_id))
        except (ConfigurationError, IntegrationError) as exc:
            raise ApiProblem(503, "MARKET_DATA_UNAVAILABLE", f"Arbitrage calculation failed: {exc}")

    raise ApiProblem(
        503,
        "MARKET_DATA_UNAVAILABLE",
        "Market data provider is not configured; no arbitrage result was produced",
    )
