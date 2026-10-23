"""Tests for NEXFIELD Harvest Quality Intelligence Engine."""
import pytest
from uuid import uuid4

from services.api.harvest_quality import evaluate_harvest_quality_risk


def test_tomato_chilling_injury_detection():
    """Verify temperatures below 10°C trigger chilling injury warnings for tomatoes."""
    assessment = evaluate_harvest_quality_risk(
        commodity="Tomato",
        temp_c=6.5,
        rh_percent=92.0,
        moisture_percent=94.0,
        storage_days=4,
        storage_type="cold_storage_controlled",
    )
    assert assessment.commodity == "Tomato"
    assert assessment.risk_level in ("elevated", "critical")
    assert assessment.risk_score >= 45.0
    assert "Chilling Injury" in assessment.primary_risk_mechanism
    assert any(f.factor_name == "Storage Temperature" for f in assessment.contributing_factors)
    assert "FAO" in assessment.scientific_reference


def test_tomato_heat_and_vpd_degradation():
    """Verify high temp and low humidity accelerate transpiration and mold risk."""
    assessment = evaluate_harvest_quality_risk(
        commodity="Nashik San Marzano Tomato",
        temp_c=28.0,
        rh_percent=60.0,
        moisture_percent=91.0,
        storage_days=6,
        storage_type="ambient_godown",
    )
    assert assessment.risk_level in ("elevated", "critical")
    assert any("Humidity" in f.factor_name for f in assessment.contributing_factors)
    assert any("Temperature" in f.factor_name for f in assessment.contributing_factors)
    assert assessment.market_disposal_advice is not None


def test_tomato_optimal_storage():
    """Verify compliant cold chain (13°C, 92% RH) yields low risk."""
    assessment = evaluate_harvest_quality_risk(
        commodity="Tomato",
        temp_c=13.5,
        rh_percent=92.0,
        moisture_percent=94.5,
        storage_days=3,
        storage_type="cold_storage_controlled",
    )
    assert assessment.risk_level == "low"
    assert assessment.risk_score < 25.0
    assert len(assessment.contributing_factors) == 0


def test_wheat_high_moisture_spoilage():
    """Verify wheat grain moisture above 14% flags Aspergillus and spontaneous heating."""
    assessment = evaluate_harvest_quality_risk(
        commodity="Durum Wheat",
        temp_c=24.0,
        rh_percent=65.0,
        moisture_percent=15.2,
        storage_days=20,
        storage_type="silo_hermetic",
    )
    assert assessment.commodity == "Durum Wheat"
    assert assessment.risk_level in ("elevated", "critical")
    assert "Aspergillus" in assessment.primary_risk_mechanism or "Heating" in assessment.primary_risk_mechanism
    assert "moisture" in assessment.recommended_action.lower() or "aeration" in assessment.recommended_action.lower()


def test_rice_paddy_quality_assessment():
    """Verify paddy rice with excessive moisture (>14.5%) flags fissuring and HRR loss."""
    assessment = evaluate_harvest_quality_risk(
        commodity="Basmati Rice Paddy",
        temp_c=34.0,
        rh_percent=80.0,
        moisture_percent=15.5,
        storage_days=15,
        storage_type="ambient_godown",
    )
    assert assessment.risk_level in ("elevated", "critical")
    assert any("Paddy Moisture" in f.factor_name for f in assessment.contributing_factors)
    assert "fissuring" in assessment.contributing_factors[0].impact_description.lower()


def test_unsupported_commodity_transparency():
    """Verify unsupported commodity transparently reports insufficient data instead of fabricating scores."""
    assessment = evaluate_harvest_quality_risk(
        commodity="Dragonfruit",
        temp_c=15.0,
        rh_percent=85.0,
        moisture_percent=80.0,
        storage_days=5,
    )
    assert assessment.risk_level == "insufficient_data"
    assert assessment.risk_score == 0.0
    assert assessment.estimated_shelf_life_days_remaining is None
    assert "not yet calibrated" in assessment.primary_risk_mechanism.lower()
