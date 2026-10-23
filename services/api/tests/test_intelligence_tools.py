"""Unit tests for NEXFIELD Intelligence Tools & Server-Side Dispatcher."""
from uuid import uuid4
import pytest
from httpx import ASGITransport, AsyncClient

from services.api.intelligence import (
    simulate_irrigation_intervention,
    tool_get_harvest_quality_risk,
    tool_get_mandi_prices,
)
from services.api.main import app


def test_simulate_irrigation_intervention_calculation():
    """Verify physical water deficit and pump run hours calculation."""
    # Current moisture: 30%, Target: 40%, Root zone: 30 cm
    # Deficit: 10%
    # Depth: (10 / 100) * 300 mm = 30.0 mm
    # Volume: 30.0 * 10 = 300.0 m³/ha
    # Pump runtime at 15 m³/h: 300 / 15 = 20.0 hours
    res = simulate_irrigation_intervention(
        current_moisture_pct=30.0,
        target_moisture_pct=40.0,
        root_zone_depth_cm=30.0,
    )
    assert res["moisture_deficit_pct"] == 10.0
    assert res["required_water_depth_mm"] == 30.0
    assert res["required_volume_m3_per_ha"] == 300.0
    assert res["estimated_pump_run_hours_at_15m3h"] == 20.0
    assert "300.0 m³/ha" in res["recommendation"]


def test_simulate_irrigation_zero_deficit():
    """Verify withholding advice when soil moisture satisfies target."""
    res = simulate_irrigation_intervention(
        current_moisture_pct=45.0,
        target_moisture_pct=40.0,
        root_zone_depth_cm=30.0,
    )
    assert res["moisture_deficit_pct"] == 0.0
    assert res["required_volume_m3_per_ha"] == 0.0
    assert res["estimated_pump_run_hours_at_15m3h"] == 0.0
    assert "withhold irrigation" in res["recommendation"].lower()


def test_tool_get_harvest_quality_risk():
    """Verify post-harvest tool returns ICAR/FAO grounded risk assessment."""
    res = tool_get_harvest_quality_risk(
        commodity="Tomato",
        temp_c=28.0,
        rh_percent=60.0,
        moisture_percent=92.0,
        storage_days=5,
    )
    assert res["commodity"] == "Tomato"
    assert res["risk_level"] in ("elevated", "critical")
    assert res["risk_score"] > 40.0
    assert len(res["contributing_factors"]) > 0


def test_tool_get_mandi_prices_and_msp():
    """Verify mandi price retrieval and CACP MSP comparison."""
    wheat = tool_get_mandi_prices(commodity="Wheat")
    assert wheat["commodity"] == "Wheat"
    assert wheat["modal_price_inr_per_quintal"] > 0
    assert wheat["official_msp_inr_per_quintal"] == 2585.0
    assert "Khanna" in wheat["primary_benchmark_market"]

    tomato = tool_get_mandi_prices(commodity="Tomato")
    assert tomato["official_msp_inr_per_quintal"] is None
    assert "Nashik" in tomato["primary_benchmark_market"] or "Pimpalgaon" in tomato["primary_benchmark_market"]


@pytest.mark.asyncio
async def test_intelligence_routes_registered():
    """Verify intelligence routes are registered in FastAPI openapi."""
    paths = app.openapi()["paths"]
    assert "/api/v1/intelligence/chat" in paths
    assert "/api/v1/intelligence/tools/execute" in paths
