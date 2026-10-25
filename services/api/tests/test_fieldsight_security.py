"""Automated security tests for FieldSight AI image ingestion endpoint.

Tests SSRF immunity against loopback/private/link-local addresses, safe redirect handling,
streaming size limits, malformed payload detection, and valid image diagnosis.
"""
import base64
import io
from uuid import uuid4

import httpx
import numpy as np
import pytest
import respx
from PIL import Image

from services.api.main import app


def create_synthetic_leaf_bytes(color: tuple[int, int, int] = (34, 139, 34)) -> bytes:
    """Generates valid foliage JPEG bytes with natural texture variance."""
    arr = np.zeros((224, 224, 3), dtype=np.uint8)
    arr[:, :] = color
    # Add texture noise to exceed low-entropy std check (std > 0.04)
    noise = np.random.randint(-30, 30, (224, 224, 3))
    arr = np.clip(arr.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    img = Image.fromarray(arr, mode="RGB")
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    return buf.getvalue()


@pytest.fixture
def synthetic_leaf_data_uri() -> str:
    raw = create_synthetic_leaf_bytes()
    b64 = base64.b64encode(raw).decode("ascii")
    return f"data:image/jpeg;base64,{b64}"


@pytest.mark.asyncio
async def test_internal_and_loopback_destinations_blocked():
    """Verify that localhost, loopback, link-local, and private ranges are blocked (SSRF immunity)."""
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        disallowed_urls = [
            "http://127.0.0.1:80/specimen.jpg",
            "http://127.0.0.1:8080/specimen.jpg",
            "http://10.0.0.5/leaf.jpg",
            "http://172.16.0.1/leaf.jpg",
            "http://192.168.1.100/leaf.jpg",
            "http://169.254.169.254/latest/meta-data",
            "http://[::1]/leaf.jpg",
            "http://[::ffff:127.0.0.1]/leaf.jpg",
            "http://0.0.0.0:80/leaf.jpg",
        ]
        for url in disallowed_urls:
            resp = await client.post(
                "/api/v1/fieldsight/diagnose",
                json={
                    "imageUrl": url,
                    "cropSpecies": "Wheat HD-3086",
                },
            )
            assert resp.status_code == 422
            data = resp.json()
            assert data["error"]["code"] in ("SSRF_DISALLOWED_DESTINATION", "DISALLOWED_PORT")


@pytest.mark.asyncio
async def test_disallowed_ports_blocked():
    """Verify that dangerous internal ports (SSH, database, Redis, etc.) are blocked immediately."""
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        dangerous_ports = [22, 25, 5432, 6379, 8000, 27017]
        for port in dangerous_ports:
            resp = await client.post(
                "/api/v1/fieldsight/diagnose",
                json={
                    "imageUrl": f"http://93.184.216.34:{port}/leaf.jpg",
                    "cropSpecies": "Wheat HD-3086",
                },
            )
            assert resp.status_code == 422
            assert resp.json()["error"]["code"] == "DISALLOWED_PORT"


@pytest.mark.asyncio
async def test_malformed_image_data_rejected():
    """Verify that non-image payloads and corrupted image bytes are rejected."""
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # 1. Plain text masquerading as image
        fake_b64 = base64.b64encode(b"NOT_AN_IMAGE_PAYLOAD_AT_ALL" * 10).decode("ascii")
        resp = await client.post(
            "/api/v1/fieldsight/diagnose",
            json={
                "imageUrl": f"data:image/jpeg;base64,{fake_b64}",
                "cropSpecies": "Wheat HD-3086",
            },
        )
        assert resp.status_code == 422
        assert resp.json()["error"]["code"] == "INVALID_SPECIMEN_IMAGE"

        # 2. Corrupted base64
        resp = await client.post(
            "/api/v1/fieldsight/diagnose",
            json={
                "imageUrl": "data:image/jpeg;base64,!!!invalid-base64-character!!!",
                "cropSpecies": "Wheat HD-3086",
            },
        )
        assert resp.status_code == 422
        assert resp.json()["error"]["code"] == "INVALID_IMAGE_PAYLOAD"

        # 3. Payload smaller than minimum threshold (100 bytes)
        tiny_b64 = base64.b64encode(b"tiny").decode("ascii")
        resp = await client.post(
            "/api/v1/fieldsight/diagnose",
            json={
                "imageUrl": f"data:image/jpeg;base64,{tiny_b64}",
                "cropSpecies": "Wheat HD-3086",
            },
        )
        assert resp.status_code == 422
        assert resp.json()["error"]["code"] == "IMAGE_TOO_SMALL"


@pytest.mark.asyncio
@respx.mock
async def test_redirect_to_internal_destination_blocked():
    """Verify that a public URL redirecting to loopback/private range is caught and blocked."""
    # Mock external public URL redirecting to private AWS metadata / loopback
    respx.get("https://public-cdn.example.com/specimen.jpg").mock(
        return_value=httpx.Response(
            302,
            headers={"Location": "http://169.254.169.254/latest/meta-data"},
        )
    )

    # Use a public IP for the initial mock URL domain
    with pytest.MonkeyPatch.context() as mp:
        import socket
        orig_getaddrinfo = socket.getaddrinfo

        def mock_getaddrinfo(host, port, *args, **kwargs):
            if host == "public-cdn.example.com":
                return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("93.184.216.34", port))]
            return orig_getaddrinfo(host, port, *args, **kwargs)

        mp.setattr(socket, "getaddrinfo", mock_getaddrinfo)

        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
            resp = await client.post(
                "/api/v1/fieldsight/diagnose",
                json={
                    "imageUrl": "https://public-cdn.example.com/specimen.jpg",
                    "cropSpecies": "Wheat HD-3086",
                },
            )
            assert resp.status_code == 422
            assert resp.json()["error"]["code"] == "SSRF_DISALLOWED_DESTINATION"


@pytest.mark.asyncio
@respx.mock
async def test_too_many_redirects_blocked():
    """Verify that redirect loops (> 3 redirects) are terminated cleanly."""
    respx.get("https://public-cdn.example.com/step1").mock(return_value=httpx.Response(302, headers={"Location": "https://public-cdn.example.com/step2"}))
    respx.get("https://public-cdn.example.com/step2").mock(return_value=httpx.Response(302, headers={"Location": "https://public-cdn.example.com/step3"}))
    respx.get("https://public-cdn.example.com/step3").mock(return_value=httpx.Response(302, headers={"Location": "https://public-cdn.example.com/step4"}))
    respx.get("https://public-cdn.example.com/step4").mock(return_value=httpx.Response(302, headers={"Location": "https://public-cdn.example.com/step5"}))

    with pytest.MonkeyPatch.context() as mp:
        import socket
        def mock_getaddrinfo(host, port, *args, **kwargs):
            return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("93.184.216.34", port))]

        mp.setattr(socket, "getaddrinfo", mock_getaddrinfo)

        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
            resp = await client.post(
                "/api/v1/fieldsight/diagnose",
                json={
                    "imageUrl": "https://public-cdn.example.com/step1",
                    "cropSpecies": "Wheat HD-3086",
                },
            )
            assert resp.status_code == 422
            assert resp.json()["error"]["code"] == "TOO_MANY_REDIRECTS"


@pytest.mark.asyncio
@respx.mock
async def test_oversized_response_blocked_while_streaming():
    """Verify that payloads exceeding 10 MB are rejected during stream consumption."""
    # 1. Content-Length header exceeding limit
    respx.get("https://public-cdn.example.com/huge.jpg").mock(
        return_value=httpx.Response(
            200,
            headers={"Content-Length": str(15 * 1024 * 1024), "Content-Type": "image/jpeg"},
            content=b"",
        )
    )

    with pytest.MonkeyPatch.context() as mp:
        import socket
        def mock_getaddrinfo(host, port, *args, **kwargs):
            return [(socket.AF_INET, socket.SOCK_STREAM, 6, "", ("93.184.216.34", port))]

        mp.setattr(socket, "getaddrinfo", mock_getaddrinfo)

        async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
            resp = await client.post(
                "/api/v1/fieldsight/diagnose",
                json={
                    "imageUrl": "https://public-cdn.example.com/huge.jpg",
                    "cropSpecies": "Wheat HD-3086",
                },
            )
            assert resp.status_code == 422
            assert resp.json()["error"]["code"] == "IMAGE_TOO_LARGE"


@pytest.mark.asyncio
async def test_valid_image_diagnosis_succeeds(synthetic_leaf_data_uri: str):
    """Verify that genuine foliage images successfully execute the ONNX runtime pipeline."""
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        resp = await client.post(
            "/api/v1/fieldsight/diagnose",
            json={
                "imageUrl": synthetic_leaf_data_uri,
                "cropSpecies": "Wheat HD-3086",
                "scoutingNotes": "Field foliar sample from Sector Alpha",
            },
        )
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert "assessment" in data
        assert data["assessment"]["conditionName"]
        assert data["assessment"]["confidenceScore"] > 0
        assert "gradCamHeatmapUrl" in data
        assert "advisoryDisclaimer" in data
