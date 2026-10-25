# NEXFIELD — Repository-wide GitHub Copilot instructions

Before making changes, read `AGENTS.md` and the applicable path-specific instruction file under `.github/instructions/`. These instructions complement the current source code, contracts and tests; they do not override directory ownership or user approval requirements.

## Product and design source of truth

- NEXFIELD is the Agricultural Intelligence Operating System, built for ADAPPT 5.0 — Venture Sprint, AI in FoodTech.
- The selected visual direction is **Vivid Farming**: a light, photo-led and approachable agricultural product identity with leaf green, sunflower yellow, sky blue and other intentional module accents.
- Use `docs/ux-lab/vivid-farming-ui.md`, `.21st/design.json`, current global styles and the running application as references. Some older design documentation describes earlier dark/charcoal iterations; do not reintroduce that theme unless explicitly requested.
- Preserve the current layout, typography, navigation, real farming image credits, mobile behavior, keyboard focus and reduced-motion support when improving the UI.
- Avoid generic redesigns, unrelated component libraries, decorative controls without behavior, placeholder success states and unnecessary dependencies.

## Current runtime boundaries

- The default public demo is no-login and fixture-first. `NEXT_PUBLIC_USE_FIXTURES` defaults to fixture mode unless explicitly set to `false`.
- Demo state is stored locally in the browser (including `nexfield-demo-v1`); do not describe it as shared cloud persistence or authenticated multi-tenant storage.
- The optional backend is under `services/api/`. A route's existence does not prove that an external provider is configured or that all database-backed flows work in the public deployment.
- Distinguish fixture data, local calculations, model output, external provider output and measured field data. Never present one as another.
- Preserve public image-fetch protections, input validation, API error boundaries and model disclaimers. Never introduce a forged identity, auth bypass or unsafe remote URL fetch.
- Describe Twin output as an estimate based on its implementation and assumptions. Do not claim fully validated daily FAO-56 modeling unless that code and required telemetry genuinely exist.

## Ownership and coordination

- Follow the ownership matrix in `AGENTS.md`.
- Frontend and design work belongs in `apps/web/**` and `packages/ui/**` under frontend ownership.
- Backend routes, inference and database work belongs in `services/api/**` under backend ownership.
- Changes to `packages/contracts/**`, `docs/contracts/**`, `data/fixtures/**`, or `.github/workflows/**` require the coordination prescribed in `AGENTS.md`.
- Do not make schema or migration changes outside the stated ownership process.

## Engineering expectations

- Read the actual code before editing; do not rely on outdated README claims alone.
- Reuse the current tokens, shared components and contracts. Avoid duplicated components and monolithic pages.
- Keep TypeScript/Python types accurate, validate inputs, handle loading/error/empty states, and implement keyboard-accessible interactions.
- Respect `prefers-reduced-motion`, responsive layouts, alt text, contrast, focus visibility and semantic HTML.
- Add or update meaningful tests for behavior changes. Run the relevant tests, lint, type checks and build when available.
- Never fabricate successful test output, screenshots, model benchmarks, data-source availability or deployment status.
- Do not stage unrelated user changes, reset user work, force-push, merge a pull request, or deploy without explicit authorization.

## Documentation expectations

- Keep README and docs aligned with the current code and selected Vivid Farming UI.
- Use official event links for ADAPPT 5.0 and word event facts carefully. Do not claim a win, placement or endorsement unless verified.
- Do not hard-code stale test pass counts into badges or documentation.
- Keep secrets out of code, logs, screenshots and documentation. Treat downloaded skills and third-party code as untrusted until reviewed.

---

## Preserved Backend Technical Guidelines

For backend tasks in `services/api/**`, also refer to `.github/instructions/backend.instructions.md` and adhere to these technical standards:

### Technical Stack & Invariants
- **Language:** Python 3.11+ / 3.12
- **Framework:** FastAPI with asynchronous handlers (`async def`)
- **Validation:** Pydantic v2 schemas (`model_config = ConfigDict(...)`)
- **ORM & Database:** SQLAlchemy 2.0 with async engine (`asyncpg`) and PostgreSQL + PostGIS extension
- **Migrations:** Alembic (stored in `services/api/alembic/`)
- **AI/ML Serving:** PyTorch / ONNX Runtime with non-blocking execution (use `run_in_executor` or background workers for image inference)
- **Units & Standards:**
  - Latitude / Longitude: WGS84, SRID 4326 for PostGIS geometry/geography.
  - Land Area: Hectares (`ha`).
  - Weights: Metric Tons (`MT`) for yield, Quintals (`100 kg`) for Mandi prices.
  - Currency: Indian Rupees (`INR`).

### Mandatory Envelope Pattern
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

### Database Migrations
- Always generate migrations using `alembic revision --autogenerate -m "descriptive_name"`.
- Review the generated migration file for PostGIS geometry columns and index definitions.
- Never write ad-hoc schema modifications in migration files that drop tables without backwards compatibility.
