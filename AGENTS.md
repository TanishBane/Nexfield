# AGENTS.md — Multi-Agent Collaboration Governance & Directory Ownership

**Project:** NEXFIELD (ADAPPT 5.0, Round 2, Domain 2: AI in Food Technology)  
**Repository:** `nexfield`  
**Effective Date:** October 2026  
**Status:** ACTIVE & MANDATORY FOR ALL AGENTS

---

## 1. Directory Ownership & Responsibility Matrix

| Path | Exclusive Owner | Authorized Agents | Prohibited Actions |
|---|---|---|---|
| `apps/web/**` | Developer A (Frontend Lead) | Google Antigravity | Developer B & Jules must NOT modify frontend code, layouts, or client state without assignment. |
| `packages/ui/**` | Developer A (Design System Lead) | Google Antigravity | Must not be altered without adhering to the shared design system tokens and APCA contrast rules. |
| `services/api/**` | Developer B (Backend Lead) | OpenAI Codex / GitHub Copilot | Developer A must NOT write backend database queries or Python route handlers. |
| `services/api/alembic/**` | Developer B (Database Architect) | OpenAI Codex | NO migrations may be committed by Developer A or Jules. |
| `data/fixtures/**` | Developer A & Jules | Antigravity, Jules | Must contain realistic, domain-accurate synthetic data clearly marked `isFixture: true`. Never pretend to be live sensor feeds. |
| `packages/contracts/**` | Shared Architecture Council | All Agents (by consensus) | Neither agent may unilaterally change schemas or payload field names. |
| `docs/contracts/**` | Shared Architecture Council | All Agents | Must strictly reflect `packages/contracts`. |
| `.github/workflows/**` | Developer A & Developer B | Antigravity, Codex | CI workflows must test real code; no fabricated test passes. |

---

## 2. Invariant Collaboration Laws

1. **Law of Autonomous Boundaries:**
   - Developer A implements user experience, 3D field visualizations, charts, client caching, forms, and responsive mobile-first UI.
   - Developer B implements FastAPI routing, SQLAlchemy ORM models, PostGIS spatial queries, ONNX/PyTorch model-serving, and Mandi scraping pipelines.
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
   - No agent may push, merge, or deploy to production without explicit user authorization.

---

## 3. Communication Protocol for Shared Work

When Developer B updates a backend endpoint:
1. Developer B verifies against `packages/contracts`.
2. Developer B runs backend unit tests in `services/api`.
3. Developer B documents the payload schema change in `docs/contracts/API_SPECIFICATION.md`.
4. Developer A reviews and updates the client hook in `apps/web/lib/api`.
