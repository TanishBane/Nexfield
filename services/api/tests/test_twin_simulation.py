"""Automated tests for NEXFIELD Twin simulation and water calculations."""
from uuid import uuid4

import httpx
import pytest

from services.api.main import app
from services.api.twin import calculate_simulation_scenario, estimate_irrigation_volume


def test_estimate_irrigation_volume_is_scheduled_depth_not_fao56():
    """Confirms scheduled irrigation volume explicitly declares its scope and assumptions."""
    estimate = estimate_irrigation_volume(
        field_area_hectares=2.4,
        irrigation_schedule_days=[3, 7, 12, 18],
        irrigation_volume_m3_per_ha=320.0,
    )
    # 2.4 ha * 4 events * 320 m3/ha = 3072.0 m3
    assert estimate.total_irrigation_volume_m3 == 3072.0
    assert estimate.irrigation_events == 4
    assert "not modeled" in estimate.assumption.lower()


@pytest.mark.asyncio
async def test_twin_simulate_returns_defensible_scenario():
    """Verify that /api/v1/twin/simulate calculates a scientifically defensible scenario."""
    field_id = uuid4()
    cycle_id = uuid4()

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post(
            "/api/v1/twin/simulate",
            json={
                "fieldId": str(field_id),
                "cycleId": str(cycle_id),
                "title": "Optimized Deficit Irrigation Trial",
                "interventions": {
                    "irrigationScheduleDays": [3, 7, 12, 18],
                    "irrigationVolumeM3PerHa": 350.0,
                    "nitrogenTopDressingKgPerHa": 65.0,
                    "biostimulantApplied": True,
                },
                "fieldAreaHectares": 2.4,
            },
        )
        assert resp.status_code == 200
        payload = resp.json()
        data = payload["data"]
        meta = payload["meta"]

        # Validate contract structure
        assert data["fieldId"] == str(field_id)
        assert data["cycleId"] == str(cycle_id)
        assert "baselineParameters" in data
        assert "projectedOutcomes" in data

        outcomes = data["projectedOutcomes"]
        assert outcomes["estimatedYieldMtPerHa"] > 3.0
        assert outcomes["baselineYieldMtPerHa"] == 5.12
        assert outcomes["waterUseEfficiencyScore"] > 0
        assert len(outcomes["confidenceInterval"]) == 2
        assert outcomes["confidenceInterval"][0] < outcomes["confidenceInterval"][1]
        assert meta["isFixture"] is False


@pytest.mark.asyncio
async def test_twin_water_deficit_penalty_response():
    """Verifies that adequate irrigation yields higher than severe deficit irrigation."""
    field_id = uuid4()
    cycle_id = uuid4()

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # Severe deficit: only 1 event with 50 m3/ha
        deficit_resp = await client.post(
            "/api/v1/twin/simulate",
            json={
                "fieldId": str(field_id),
                "cycleId": str(cycle_id),
                "title": "Deficit Irrigation",
                "interventions": {
                    "irrigationScheduleDays": [1],
                    "irrigationVolumeM3PerHa": 50.0,
                    "nitrogenTopDressingKgPerHa": 30.0,
                    "biostimulantApplied": False,
                },
            },
        )
        assert deficit_resp.status_code == 200
        deficit_yield = deficit_resp.json()["data"]["projectedOutcomes"]["estimatedYieldMtPerHa"]

        # Adequate irrigation: 4 events with 350 m3/ha
        optimal_resp = await client.post(
            "/api/v1/twin/simulate",
            json={
                "fieldId": str(field_id),
                "cycleId": str(cycle_id),
                "title": "Optimal Irrigation",
                "interventions": {
                    "irrigationScheduleDays": [3, 7, 12, 18],
                    "irrigationVolumeM3PerHa": 350.0,
                    "nitrogenTopDressingKgPerHa": 65.0,
                    "biostimulantApplied": True,
                },
            },
        )
        assert optimal_resp.status_code == 200
        optimal_yield = optimal_resp.json()["data"]["projectedOutcomes"]["estimatedYieldMtPerHa"]

        assert optimal_yield > deficit_yield
