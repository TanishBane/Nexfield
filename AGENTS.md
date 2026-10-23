# AGENTS.md — Multi-Agent Collaboration Governance & Directory Ownership

**Project:** NEXFIELD (ADAPPT 5.0, Round 2, Domain 2: AI in Food Technology)  
**Repository:** `nexfield`  
**Effective Date:** October 2026  
**Status:** ACTIVE & MANDATORY FOR ALL AGENTS

---

## 1. Team Roles & Ownership Matrix

### Developer Z (Frontend Lead)
- **Primary AI Agents:** Google Antigravity (Interactive Product & UX) + Google Jules (Cloud Tasks & External Adapters)
- **Exclusive Directory Ownership:**
  - `apps/web/**`: Next.js App Router, layout shells, client stores, visual components
  - `packages/ui/**`: Design system tokens, reusable UI primitives, APCA-compliant elements
  - Digital Twin 3D visualizations, interactive telemetry HUDs, and client-side scenario controllers
- **Delegated to Jules:** Assigned external cloud adapter directories and integration testing suites

### Developer Y (Backend Lead)
- **Primary AI Agents:** OpenAI Codex (Architecture, ORM, Simulation) + GitHub Copilot (Code suggestions, tests)
- **Exclusive Directory Ownership:**
  - `services/api/**`: FastAPI routing, Pydantic v2 validation, model inference
  - `services/api/alembic/**`: SQLAlchemy database models and PostGIS migrations
  - Core AI/ML serving pipelines (PyTorch / ONNX Runtime) and Mandi scraping pipelines
  - Agricultural biophysical simulation logic

### Shared Architecture Council (Developer Z + Developer Y)
- **Co-Owned Paths:**
  - `packages/contracts/**`: Shared TypeScript Zod schemas, DTOs, and entity definitions
  - `docs/contracts/**`: API specifications, Markdown endpoints documentation
  - `data/fixtures/**`: Domain-accurate synthetic agronomic datasets marked `isFixture: true`
  - `.github/workflows/**`: CI/CD pipelines testing real code
- **Governance:** Neither developer may unilaterally alter schemas, database columns, or payload structures without consensus.

---

## 2. Directory Responsibility Matrix

| Path | Exclusive Owner | Authorized Agents | Prohibited Actions |
|---|---|---|---|
| `apps/web/**` | Developer Z | Google Antigravity | Developer Y must NOT modify frontend code, layouts, or client state without assignment. |
| `packages/ui/**` | Developer Z | Google Antigravity | Must not be altered without adhering to the shared design system tokens and APCA contrast rules. |
| `services/api/**` | Developer Y | OpenAI Codex / GitHub Copilot | Developer Z must NOT write backend database queries or Python route handlers. |
| `services/api/alembic/**` | Developer Y | OpenAI Codex | NO migrations may be committed by Developer Z or Jules. |
| `data/fixtures/**` | Developer Z & Jules | Antigravity, Jules | Must contain realistic, domain-accurate synthetic data clearly marked `isFixture: true`. Never pretend to be live sensor feeds. |
| `packages/contracts/**` | Shared Council | All Agents (by consensus) | Neither agent may unilaterally change schemas or payload field names. |
| `docs/contracts/**` | Shared Council | All Agents | Must strictly reflect `packages/contracts`. |
| `.github/workflows/**` | Developer Z & Developer Y | Antigravity, Codex | CI workflows must test real code; no fabricated test passes. |

---

## 3. Invariant Collaboration Laws

1. **Law of Autonomous Boundaries:**
   - Developer Z implements user experience, 3D field visualizations, charts, client caching, forms, and responsive mobile-first UI.
   - Developer Y implements FastAPI routing, SQLAlchemy ORM models, PostGIS spatial queries, ONNX/PyTorch model-serving, and Mandi scraping pipelines.
   - No agent may cross directory boundaries without an explicit multi-agent synchronization task.

2. **Law of Contract Truth:**
   - All REST communication and data structures MUST conform to the TypeScript Zod schemas in `packages/contracts` and the specifications in `docs/contracts/API_SPECIFICATION.md`.
   - If a new field is needed by the UI, propose it in `packages/contracts` first before consuming it.

3. **Law of Realistic Telemetry & Fixture Integrity:**
   - Do NOT create mock API responses that pretend to be live agricultural data.
   - When the backend is running in offline/local development mode (`NEXT_PUBLIC_USE_FIXTURES=true`), the frontend loads domain-accurate baseline fixtures from `data/fixtures/` and displays a persistent indicator: `"Development Mode: Synthetic Agronomic Fixtures"`.

4. **Law of Quality & Design Systems:**
   - Follow tokens strictly: base charcoal `#0A0F0D`, card `#111815`, emerald `#10B981`. No random hex colors.
   - Persistent chrome (nav, header, telemetry bar) must never change height or reflow on status updates.
   - Tabular figures (`tabular-nums`) for all numbers, coordinates, and prices.
   - Nested radii invariant: child radius must be $\le$ parent radius (`child_r = parent_r - padding`).

5. **Deployment & Git Safety:**
   - Both developers work on dedicated feature branches (`feature/z-frontend`, `feature/y-backend`).
   - No agent may push, merge, or deploy to production without explicit user authorization.

---

## 4. Communication Protocol for Shared Work

When Developer Y updates a backend endpoint:
1. Developer Y verifies against `packages/contracts`.
2. Developer Y runs backend unit tests in `services/api`.
3. Developer Y documents the payload schema change in `docs/contracts/API_SPECIFICATION.md`.
4. Developer Z reviews and updates the client hook in `apps/web/lib/api`.
