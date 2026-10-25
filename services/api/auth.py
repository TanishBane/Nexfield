"""Validate bearer credentials; no client claim or header bypasses."""
from dataclasses import dataclass
from typing import Annotated
from uuid import UUID

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .errors import ApiProblem

bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class Principal:
    user_id: UUID


async def get_principal(
    request: Request,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> Principal:
    del request
    if credentials is None:
        raise ApiProblem(401, "UNAUTHENTICATED", "A valid user bearer token is required")
    raise ApiProblem(503, "AUTH_UNAVAILABLE", "Authentication service is not configured in public demo mode")
