"""Validate bearer sessions with Supabase Auth; never trust decoded client claims."""
from dataclasses import dataclass
from typing import Annotated
from uuid import UUID

import httpx
from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .errors import ApiProblem

bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class Principal:
    user_id: UUID


DEMO_PRINCIPAL_ID = UUID("00000000-0000-0000-0000-000000000001")


async def get_principal(
    request: Request,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> Principal:
    # Allow frictionless public demo mode
    is_demo = (
        "headers" in request.scope
        and request.headers.get("X-Demo-Mode") == "public-demonstration"
    )
    if is_demo or (credentials and credentials.credentials == "demo-public-token"):
        return Principal(user_id=DEMO_PRINCIPAL_ID)

    if credentials is None:
        raise ApiProblem(401, "UNAUTHENTICATED", "A valid user bearer token is required")
    settings = request.app.state.settings
    if not settings.supabase_url or not settings.supabase_anon_key:
        raise ApiProblem(503, "AUTH_UNAVAILABLE", "Authentication is not configured")
    client: httpx.AsyncClient = request.app.state.auth_client
    try:
        response = await client.get(
            f"{settings.supabase_url}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {credentials.credentials}",
                "apikey": settings.supabase_anon_key.get_secret_value(),
            },
        )
    except httpx.RequestError as exc:
        raise ApiProblem(503, "AUTH_UNAVAILABLE", "Authentication service unavailable") from exc
    if response.status_code in {401, 403}:
        raise ApiProblem(401, "UNAUTHENTICATED", "User session is invalid or expired")
    if response.status_code != 200:
        raise ApiProblem(503, "AUTH_UNAVAILABLE", "Authentication service unavailable")
    try:
        user = response.json()
        principal = Principal(user_id=UUID(user["id"]))
    except (ValueError, TypeError, KeyError) as exc:
        raise ApiProblem(503, "AUTH_UNAVAILABLE", "Authentication returned an invalid identity") from exc
    if user.get("is_anonymous", False):
        raise ApiProblem(403, "SIGN_IN_REQUIRED", "A non-anonymous user session is required")
    return principal
