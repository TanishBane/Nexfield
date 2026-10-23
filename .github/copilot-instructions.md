# GitHub Copilot & Codex Instructions for NEXFIELD Backend (Developer B)

**Role:** Backend Architect, ML Systems Lead, and Database Engineer  
**Primary Ownership:** `services/api/**`, database migrations, ML inference pipelines  
**Project:** NEXFIELD (ADAPPT 5.0, Round 2, Domain 2: AI in Food Technology)

---

## 1. Scope & Directory Boundaries

- You exclusively own and edit `services/api/`.
- Do NOT edit files in `apps/web/` or `packages/ui/` (managed by Developer A).
- Consult `docs/contracts/API_SPECIFICATION.md` and `packages/contracts/src/entities.ts` for all payload schemas and naming conventions before writing FastAPI route handlers or Pydantic models.
- If you need schema changes, propose them in `packages/contracts` and coordinate with Developer A.

---

## 2. Technical Stack & Invariants

- **Language:** Python 3.11+ / 3.12
- **Framework:** FastAPI with asynchronous handlers (`async def`)
- **Validation:** Pydantic v2 schemas (`model_config = ConfigDict(...)`)
- **ORM & Database:** SQLAlchemy 2.0 with async engine (`asyncpg`) and PostgreSQL + PostGIS extension
- **Migrations:** Alembic (stored in `services/api/alembic/`)
- **AI/ML Serving:** PyTorch / ONNX Runtime with non-blocking execution (use `run_in_executor` or Celery/background workers for image inference)
- **Units & Standards:**
  - Latitude / Longitude: WGS84, SRID 4326 for PostGIS geometry/geography.
  - Land Area: Hectares (`ha`).
  - Weights: Metric Tons (`MT`) for yield, Quintals (`100 kg`) for Mandi prices.
  - Currency: Indian Rupees (`INR`).

---

## 3. Mandatory Envelope Pattern

Every FastAPI response must conform to the unified envelope:
```python
from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, Any

T = TypeVar("T")

class ApiMeta(BaseModel):
    timestamp: str
    version: str = "v1"
    isFixture: bool = False
    requestId: Optional[str] = None

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T
    error: Optional[dict] = None
    meta: ApiMeta
```

---

## 4. Database Migrations

- Always generate migrations using `alembic revision --autogenerate -m "descriptive_name"`.
- Review the generated migration file for PostGIS geometry columns and index definitions.
- Never write ad-hoc schema modifications in migration files that drop tables without backwards compatibility.

---

## 5. Testing & Verification

- Place backend unit and integration tests in `services/api/tests/`.
- Run tests via `pytest -v`.
- Do not fabricate test results or skip failing assertions.
