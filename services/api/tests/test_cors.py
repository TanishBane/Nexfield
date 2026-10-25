import pytest
from httpx import ASGITransport, AsyncClient
from services.api.main import app

@pytest.mark.asyncio
async def test_cors_config_allowed_origin():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.options(
            "/api/v1/meta",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET"
            }
        )
        assert response.status_code == 200
        assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
        assert response.headers.get("access-control-allow-credentials") == "true"


@pytest.mark.asyncio
async def test_cors_config_vercel_production_origin():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.options(
            "/api/v1/meta",
            headers={
                "Origin": "https://nexfield-agritech.vercel.app",
                "Access-Control-Request-Method": "GET"
            }
        )
        assert response.status_code == 200
        assert response.headers.get("access-control-allow-origin") == "https://nexfield-agritech.vercel.app"
        assert response.headers.get("access-control-allow-credentials") == "true"


@pytest.mark.asyncio
async def test_cors_config_loopback_origin():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.options(
            "/api/v1/meta",
            headers={
                "Origin": "http://127.0.0.1:3000",
                "Access-Control-Request-Method": "GET"
            }
        )
        assert response.status_code == 200
        assert response.headers.get("access-control-allow-origin") == "http://127.0.0.1:3000"
        assert response.headers.get("access-control-allow-credentials") == "true"


@pytest.mark.asyncio
async def test_cors_config_unauthorized_origin():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.options(
            "/api/v1/meta",
            headers={
                "Origin": "https://evil.com",
                "Access-Control-Request-Method": "GET"
            }
        )
        assert response.status_code == 400
        assert "access-control-allow-origin" not in response.headers or response.headers.get("access-control-allow-origin") != "https://evil.com"
