from datetime import datetime, timedelta, timezone
from uuid import uuid4
import pytest

from services.api.insights import detect_agricultural_anomalies

def test_detect_anomalies_empty_or_normal_returns_zero():
    field_id = uuid4()
    # Normal diurnal cycle between 38% and 41%
    base_time = datetime(2026, 10, 24, 0, 0, tzinfo=timezone.utc)
    obs = []
    for h in range(12):
        t = base_time + timedelta(hours=h)
        # Slow natural drop of 0.2% per hour
        m = 41.0 - (h * 0.2)
        obs.append({
            "timestamp": t.isoformat(),
            "metrics": {"moisture_percent": m, "temp_c": 22.0 + (h * 0.5)},
        })

    anomalies = detect_agricultural_anomalies(field_id, "North Sector", obs)
    assert len(anomalies) == 0

def test_physical_bound_violation():
    field_id = uuid4()
    now = datetime(2026, 10, 24, 12, 0, tzinfo=timezone.utc)
    obs = [
        {"timestamp": (now - timedelta(hours=2)).isoformat(), "metrics": {"moisture_percent": 38.0}},
        {"timestamp": (now - timedelta(hours=1)).isoformat(), "metrics": {"moisture_percent": 37.8}},
        {"timestamp": now.isoformat(), "metrics": {"moisture_percent": 2.1}},  # Physically impossible topsoil VWC
    ]

    anomalies = detect_agricultural_anomalies(field_id, "North Sector", obs)
    assert any(a.anomaly_type == "PHYSICAL_BOUND_VIOLATION" for a in anomalies)
    bound_anomaly = next(a for a in anomalies if a.anomaly_type == "PHYSICAL_BOUND_VIOLATION")
    assert bound_anomaly.severity == "critical"
    assert bound_anomaly.category == "sensor_hardware"
    assert bound_anomaly.observed_value == 2.1

def test_stale_sensor_zero_variance_freeze():
    field_id = uuid4()
    now = datetime(2026, 10, 24, 8, 0, tzinfo=timezone.utc)
    obs = []
    # 10 identical readings
    for i in range(10):
        t = now - timedelta(hours=10 - i)
        obs.append({"timestamp": t.isoformat(), "metrics": {"moisture_percent": 36.45}})

    anomalies = detect_agricultural_anomalies(field_id, "East Plot", obs)
    assert any(a.anomaly_type == "STALE_SENSOR_OUTPUT" for a in anomalies)
    freeze = next(a for a in anomalies if a.anomaly_type == "STALE_SENSOR_OUTPUT")
    assert freeze.category == "sensor_hardware"
    assert freeze.severity == "warning"

def test_rapid_moisture_depletion():
    field_id = uuid4()
    t1 = datetime(2026, 10, 24, 10, 0, tzinfo=timezone.utc)
    t2 = datetime(2026, 10, 24, 11, 0, tzinfo=timezone.utc)
    t3 = datetime(2026, 10, 24, 12, 0, tzinfo=timezone.utc)
    obs = [
        {"timestamp": t1.isoformat(), "metrics": {"moisture_percent": 42.0}},
        {"timestamp": t2.isoformat(), "metrics": {"moisture_percent": 41.5}},
        {"timestamp": t3.isoformat(), "metrics": {"moisture_percent": 34.0}},  # Drops 7.5% in 1 hour
    ]

    anomalies = detect_agricultural_anomalies(field_id, "Sector Alpha", obs)
    assert any(a.anomaly_type == "RAPID_MOISTURE_DEPLETION" for a in anomalies)
    rapid = next(a for a in anomalies if a.anomaly_type == "RAPID_MOISTURE_DEPLETION")
    assert rapid.category == "agronomic_risk"
    assert rapid.severity == "critical"
    assert "leakage" in rapid.recommended_verification.lower() or "lateral" in rapid.recommended_verification.lower()

def test_handles_out_of_order_and_missing_data():
    field_id = uuid4()
    t1 = datetime(2026, 10, 24, 10, 0, tzinfo=timezone.utc)
    t2 = datetime(2026, 10, 24, 11, 0, tzinfo=timezone.utc)
    t3 = datetime(2026, 10, 24, 12, 0, tzinfo=timezone.utc)
    # Passed out of order, with one corrupt entry
    obs = [
        {"timestamp": t3.isoformat(), "metrics": {"moisture_percent": 40.0}},
        {"timestamp": t1.isoformat(), "metrics": {"moisture_percent": "corrupt_string"}},
        {"timestamp": t2.isoformat(), "metrics": {"moisture_percent": 40.5}},
    ]

    # Should not crash and should parse valid records chronologically
    anomalies = detect_agricultural_anomalies(field_id, "Test Field", obs)
    assert isinstance(anomalies, list)

def test_insights_routes_registered():
    from services.api.main import app

    paths = app.openapi()["paths"]
    assert "/api/v1/control/insights" in paths
    assert "/api/v1/control/insights/convert-to-task" in paths
