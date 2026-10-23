import io
import numpy as np
from PIL import Image
import pytest

from services.api.ml.inference import CLASSES, FieldSightInferenceEngine

def make_test_image(pattern: str = "wheat_stripe_rust") -> bytes:
    """Generates synthetic RGB leaf bytes for testing."""
    img = np.zeros((224, 224, 3), dtype=np.uint8)
    img[:, :] = [35, 140, 35]  # Green base

    if pattern == "wheat_stripe_rust":
        # Yellow linear stripes
        for x in (60, 100, 140):
            img[20:200, x:x+6] = [225, 175, 25]
    elif pattern == "low_entropy":
        # Uniform solid white (no texture)
        img[:, :] = [255, 255, 255]

    buf = io.BytesIO()
    Image.fromarray(img).save(buf, format="JPEG")
    return buf.getvalue()

def test_inference_engine_loads_onnx_model():
    engine = FieldSightInferenceEngine.get_instance()
    assert engine.session is not None
    assert engine.model_version == "fieldsight_vision_v1_onnx"

def test_inference_engine_predicts_wheat_stripe_rust():
    engine = FieldSightInferenceEngine.get_instance()
    leaf_bytes = make_test_image("wheat_stripe_rust")
    pred = engine.predict(leaf_bytes, crop_context="Wheat")

    assert pred["detected_class"] in CLASSES
    assert pred["confidence"] > 0.0
    assert pred["confidence"] <= 1.0
    assert "inference_time_ms" in pred
    assert pred["inference_time_ms"] > 0
    assert pred["heatmap_overlay_url"].startswith("data:image/png;base64,")
    assert len(pred["top_predictions"]) <= 3
    assert "mitigation_protocol" in pred

def test_inference_engine_rejects_blank_low_entropy_images():
    engine = FieldSightInferenceEngine.get_instance()
    blank_bytes = make_test_image("low_entropy")
    with pytest.raises(ValueError) as exc_info:
        engine.predict(blank_bytes)
    assert "entropy" in str(exc_info.value).lower() or "texture" in str(exc_info.value).lower()

def test_inference_respects_crop_context():
    engine = FieldSightInferenceEngine.get_instance()
    leaf_bytes = make_test_image("wheat_stripe_rust")

    pred_wheat = engine.predict(leaf_bytes, crop_context="Wheat")
    assert pred_wheat["detected_class"].startswith("Wheat")

    pred_tomato = engine.predict(leaf_bytes, crop_context="Tomato")
    assert pred_tomato["detected_class"].startswith("Tomato")
