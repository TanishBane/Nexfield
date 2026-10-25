from types import SimpleNamespace
from uuid import UUID

import httpx
import pytest
from fastapi import Request
from fastapi.security import HTTPAuthorizationCredentials

from services.api.auth import get_principal
from services.api.errors import ApiProblem


def make_request(client: httpx.AsyncClient) -> Request:
    scope = {"type": "http", "app": SimpleNamespace(
        state=SimpleNamespace(
            settings=SimpleNamespace(
                supabase_url="https://auth.example.test",
                supabase_anon_key=SimpleNamespace(get_secret_value=lambda: "anon-key"),
            ),
            auth_client=client,
        )
    )}
    return Request(scope)


@pytest.mark.asyncio
async def test_principal_forwards_bearer_token():
    seen = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["authorization"] = request.headers["Authorization"]
        seen["apikey"] = request.headers["apikey"]
        return httpx.Response(200, json={"id": "00000000-0000-0000-0000-000000000001"})

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        principal = await get_principal(
            make_request(client),
            HTTPAuthorizationCredentials(scheme="Bearer", credentials="user-token"),
        )

    assert principal.user_id == UUID("00000000-0000-0000-0000-000000000001")
    assert seen == {"authorization": "Bearer user-token", "apikey": "anon-key"}


@pytest.mark.asyncio
async def test_invalid_supabase_session_is_unauthenticated():
    async def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(401)

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(ApiProblem) as caught:
            await get_principal(
                make_request(client),
                HTTPAuthorizationCredentials(scheme="Bearer", credentials="expired"),
            )

    assert caught.value.status == 401


@pytest.mark.asyncio
async def test_public_demo_mode_yields_demo_principal():
    scope = {
        "type": "http",
        "headers": [(b"x-demo-mode", b"public-demonstration")],
        "app": SimpleNamespace(state=SimpleNamespace(settings=SimpleNamespace(supabase_url=None, supabase_anon_key=None))),
    }
    req = Request(scope)
    principal = await get_principal(req, None)
    assert principal.user_id == UUID("00000000-0000-0000-0000-000000000001")
