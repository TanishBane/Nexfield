import logging
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from starlette.exceptions import HTTPException

from .schemas import ApiError, ApiMeta, ErrorResponse

logger = logging.getLogger(__name__)


class ApiProblem(Exception):
    def __init__(self, status: int, code: str, message: str) -> None:
        self.status, self.code, self.message = status, code, message


def problem_response(request: Request, status: int, code: str, message: str,
                     details: list[dict[str, Any]] | None = None) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "unknown")
    body = ErrorResponse(error=ApiError(code=code, message=message, details=details),
                         meta=ApiMeta(request_id=request_id)).model_dump(mode="json", by_alias=True)
    if details is None:
        body["error"].pop("details")
    body["meta"].pop("pagination", None)
    headers = {"WWW-Authenticate": "Bearer"} if status == 401 else None
    return JSONResponse(status_code=status, content=body, headers=headers)


def install_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ApiProblem)
    async def domain_error(request: Request, exc: ApiProblem) -> JSONResponse:
        return problem_response(request, exc.status, exc.code, exc.message)

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
        # Never echo rejected input, tokens, or exception contexts.
        details = [{"location": list(e["loc"]), "message": e["msg"], "type": e["type"]} for e in exc.errors()]
        return problem_response(request, 422, "VALIDATION_ERROR", "Request validation failed", details)

    @app.exception_handler(HTTPException)
    async def http_error(request: Request, exc: HTTPException) -> JSONResponse:
        return problem_response(request, exc.status_code, f"HTTP_{exc.status_code}", str(exc.detail))

    @app.exception_handler(IntegrityError)
    async def integrity_error(request: Request, exc: IntegrityError) -> JSONResponse:
        return problem_response(request, 409, "RECORD_CONFLICT", "The change conflicts with existing records")

    @app.exception_handler(SQLAlchemyError)
    async def database_error(request: Request, exc: SQLAlchemyError) -> JSONResponse:
        logger.error("Database error request_id=%s type=%s",
                     getattr(request.state, "request_id", "unknown"), type(exc).__name__)
        return problem_response(request, 503, "DATABASE_UNAVAILABLE", "Database operation unavailable")

    @app.exception_handler(Exception)
    async def unexpected_error(request: Request, exc: Exception) -> JSONResponse:
        logger.error("Unhandled error request_id=%s type=%s",
                     getattr(request.state, "request_id", "unknown"), type(exc).__name__)
        return problem_response(request, 500, "INTERNAL_ERROR", "An unexpected error occurred")
