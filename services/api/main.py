"""NEXFIELD FastAPI application."""
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from uuid import uuid4

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings
from .database import Database
from .errors import install_error_handlers
from .farms import router as farms_router
from .fieldsight import router as fieldsight_router
from .fields import router as fields_router
from .agriculture import router as agriculture_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = Settings()
    app.state.settings = settings
    app.state.database = Database(settings)
    app.state.auth_client = httpx.AsyncClient(timeout=httpx.Timeout(10.0, connect=5.0))
    try:
        yield
    finally:
        await app.state.auth_client.aclose()
        await app.state.database.close()


app = FastAPI(
    title="NEXFIELD Agricultural Intelligence API",
    version="1.0.0",
    description="Backend services supporting NEXFIELD agricultural intelligence modules.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=Settings().cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Confirm-Delete", "X-Request-ID"],
)


@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    request.state.request_id = request.headers.get("X-Request-ID") or str(uuid4())
    response = await call_next(request)
    response.headers["X-Request-ID"] = request.state.request_id
    return response


@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": "nexfield-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "environment": "development",
        "version": "1.0.0",
    }


@app.get("/api/v1/meta", tags=["System"])
async def get_system_meta(request: Request):
    return {
        "success": True,
        "data": {
            "modules": ["control", "fieldsight", "twin", "intelligence", "ops", "markets"],
            "governance": "AGENTS.md",
            "contracts": "docs/contracts/API_SPECIFICATION.md",
        },
        "error": None,
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
            "version": "v1",
            "isFixture": False,
            "requestId": request.state.request_id,
        },
    }


install_error_handlers(app)
app.include_router(farms_router)
app.include_router(fields_router)
app.include_router(fieldsight_router)
app.include_router(agriculture_router)
