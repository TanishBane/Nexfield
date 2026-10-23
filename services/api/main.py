"""
NEXFIELD FastAPI Backend Scaffolding
Managed exclusively by Developer B (OpenAI Codex / GitHub Copilot).
Conforms to docs/contracts/API_SPECIFICATION.md and AGENTS.md.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

app = FastAPI(
    title="NEXFIELD Agricultural Intelligence API",
    version="1.0.0",
    description="Backend services supporting farm command center, FieldSight vision, Twin biophysical simulator, and Mandi intelligence.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
async def get_system_meta():
    return {
        "success": True,
        "data": {
            "modules": [
                "control",
                "fieldsight",
                "twin",
                "intelligence",
                "ops",
                "markets",
            ],
            "governance": "AGENTS.md",
            "contracts": "docs/contracts/API_SPECIFICATION.md",
        },
        "meta": {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "version": "v1",
            "isFixture": False,
        },
    }
