import pytest
from httpx import ASGITransport, AsyncClient
from main import app

@pytest.mark.asyncio
async def test_meta_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/meta")
        assert response.status_code == 200
        data = response.json()

        assert data["success"] is True

        assert "data" in data
        assert data["data"]["modules"] == [
            "control",
            "fieldsight",
            "twin",
            "intelligence",
            "ops",
            "markets",
        ]
        assert data["data"]["governance"] == "AGENTS.md"
        assert data["data"]["contracts"] == "docs/contracts/API_SPECIFICATION.md"

        assert "meta" in data
        assert "timestamp" in data["meta"]
        assert data["meta"]["version"] == "v1"
        assert data["meta"]["isFixture"] is False
