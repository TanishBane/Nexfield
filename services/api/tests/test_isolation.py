from unittest.mock import AsyncMock, MagicMock
from uuid import UUID, uuid4
import pytest

from services.api.auth import Principal
from services.api.errors import ApiProblem
from services.api.farms import owned_farm
from services.api.models import Farm

@pytest.mark.asyncio
async def test_owned_farm_enforces_tenant_owner_isolation():
    user_a = Principal(user_id=UUID("00000000-0000-0000-0000-000000000001"))
    user_b = Principal(user_id=UUID("00000000-0000-0000-0000-000000000002"))
    farm_id = uuid4()

    # Mock session where farm is owned by User A
    session = MagicMock()

    # When user A requests: scalar returns the farm
    farm = Farm(id=farm_id, owner_id=user_a.user_id, name="User A Farm")
    session.scalar = AsyncMock(return_value=farm)

    result = await owned_farm(session, farm_id, user_a)
    assert result.id == farm_id
    assert result.owner_id == user_a.user_id

    # When user B requests: query with Farm.owner_id == user_b.user_id returns None in DB
    session.scalar = AsyncMock(return_value=None)
    with pytest.raises(ApiProblem) as exc_info:
        await owned_farm(session, farm_id, user_b)

    assert exc_info.value.status == 404
    assert exc_info.value.code == "FARM_NOT_FOUND"

def test_import_and_weather_routes_registered():
    from services.api.main import app

    paths = app.openapi()["paths"]
    assert "/api/v1/farms/{farm_id}/import" in paths
    assert "/api/v1/control/weather" in paths
    assert "/api/v1/farms" in paths
    assert "/api/v1/farms/{farm_id}/fields" in paths
    assert "/api/v1/fields/{field_id}/crop-cycles" in paths
    assert "/api/v1/fields/{field_id}/observations" in paths
