"""Unit tests for multi-factor market economics and official CACP MSP schedule."""
import pytest
from httpx import ASGITransport, AsyncClient

from services.api.main import app
from services.api.markets import (
    CACP_MSP_BENCHMARKS,
    calculate_transport_freight_economics,
)


def test_transport_freight_economics_single_trip():
    """Verify fuel, toll, hamali, mandi cess (1.5%), and shrinkage (1%) calculations."""
    res = calculate_transport_freight_economics(
        modal_price_inr_per_quintal=2580.0,
        distance_km=50.0,
        lot_quantity_quintals=100.0,
        vehicle_type="medium_truck",  # capacity: 100 q, 4.5 km/L
        diesel_price_inr_per_liter=90.0,
        driver_bhatta_inr=600.0,
        tolls_inr=0.0,  # auto-estimated: (50 - 20) * 1.5 = 45 INR
        loading_unloading_hamali_per_quintal_inr=12.0,
        mandi_fee_percent=1.5,
        shrinkage_loss_percent=1.0,
    )

    assert res["trips_required"] == 1
    assert res["total_round_trip_distance_km"] == 100.0
    assert res["fuel_liters_consumed"] == round(100.0 / 4.5, 2)
    assert res["hamali_labor_per_quintal_inr"] == 12.0
    # 1.5% of 2580 = 38.70 INR/q
    assert res["mandi_fee_per_quintal_inr"] == 38.70
    # 1.0% of 2580 = 25.80 INR/q
    assert res["shrinkage_loss_per_quintal_inr"] == 25.80
    assert res["gross_revenue_inr"] == 258000.0
    assert res["net_realization_per_quintal_inr"] < 2580.0
    assert res["net_realization_percent"] > 90.0
    assert "Profitable" in res["profitability_verdict"]


def test_transport_freight_multi_trip():
    """Verify consignment exceeding capacity triggers multiple trips."""
    res = calculate_transport_freight_economics(
        modal_price_inr_per_quintal=2000.0,
        distance_km=40.0,
        lot_quantity_quintals=150.0,
        vehicle_type="medium_truck",  # capacity: 100 q -> 2 trips required
        diesel_price_inr_per_liter=90.0,
        driver_bhatta_inr=600.0,
    )

    assert res["trips_required"] == 2
    # 2 trips * (40 * 2) = 160 km
    assert res["total_round_trip_distance_km"] == 160.0
    assert res["driver_bhatta_total_inr"] == 2 * 600.0


def test_cacp_msp_benchmarks_accuracy():
    """Verify authoritative CACP benchmarks for Wheat and Paddy match official Gazette."""
    wheat_26 = next(
        r for r in CACP_MSP_BENCHMARKS if r["commodity"] == "Wheat" and r["marketing_season"] == "RMS 2026-27"
    )
    assert wheat_26["msp_inr_per_quintal"] == 2585.0

    wheat_24 = next(
        r for r in CACP_MSP_BENCHMARKS if r["commodity"] == "Wheat" and r["marketing_season"] == "RMS 2024-25"
    )
    assert wheat_24["msp_inr_per_quintal"] == 2275.0

    paddy_24 = next(
        r for r in CACP_MSP_BENCHMARKS if r["commodity"] == "Paddy (Common)" and r["marketing_season"] == "KMS 2024-25"
    )
    assert paddy_24["msp_inr_per_quintal"] == 2300.0

    tomato = next(r for r in CACP_MSP_BENCHMARKS if "Tomato" in r["commodity"])
    assert tomato["msp_inr_per_quintal"] is None
    assert "Non-MSP" in tomato["statutory_status"]


@pytest.mark.asyncio
async def test_markets_msp_endpoint():
    """Verify GET /api/v1/markets/msp-benchmarks returns data."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver",
    ) as client:
        res = await client.get("/api/v1/markets/msp-benchmarks")
        assert res.status_code == 200
        payload = res.json()
        assert payload["success"] is True
        assert len(payload["data"]) >= 8
        assert any(r["commodity"] == "Wheat" for r in payload["data"])

        # Filter by commodity
        wheat_res = await client.get("/api/v1/markets/msp-benchmarks?commodity=Wheat")
        assert wheat_res.status_code == 200
        wheat_data = wheat_res.json()["data"]
        assert all(w["commodity"] == "Wheat" for w in wheat_data)
