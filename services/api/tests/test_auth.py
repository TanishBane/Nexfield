from types import SimpleNamespace
import pytest
from fastapi import Request
from fastapi.security import HTTPAuthorizationCredentials

from services.api.auth import get_principal
from services.api.errors import ApiProblem


def make_request(headers: list[tuple[bytes, bytes]] | None = None) -> Request:
    scope = {
        "type": "http",
        "headers": headers or [],
        "app": SimpleNamespace(
            state=SimpleNamespace(
                settings=SimpleNamespace(),
            )
        ),
    }
    return Request(scope)


@pytest.mark.asyncio
async def test_unauthenticated_request_raises_401():
    req = make_request()
    with pytest.raises(ApiProblem) as caught:
        await get_principal(req, None)
    assert caught.value.status == 401
    assert caught.value.code == "UNAUTHENTICATED"


@pytest.mark.asyncio
async def test_token_provided_without_auth_service_raises_503():
    req = make_request()
    with pytest.raises(ApiProblem) as caught:
        await get_principal(
            req,
            HTTPAuthorizationCredentials(scheme="Bearer", credentials="any-token"),
        )
    assert caught.value.status == 503
    assert caught.value.code == "AUTH_UNAVAILABLE"


@pytest.mark.asyncio
async def test_demo_mode_header_is_not_bypassed():
    req = make_request(headers=[(b"x-demo-mode", b"public-demonstration")])
    with pytest.raises(ApiProblem) as caught:
        await get_principal(req, None)
    assert caught.value.status == 401
    assert caught.value.code == "UNAUTHENTICATED"


@pytest.mark.asyncio
async def test_demo_public_token_is_not_bypassed():
    req = make_request()
    with pytest.raises(ApiProblem) as caught:
        await get_principal(
            req,
            HTTPAuthorizationCredentials(scheme="Bearer", credentials="demo-public-token"),
        )
    assert caught.value.status == 503
    assert caught.value.code == "AUTH_UNAVAILABLE"
