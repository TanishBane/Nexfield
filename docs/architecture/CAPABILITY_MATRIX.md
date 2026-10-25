# NEXFIELD System Capability Matrix & Implementation Audit

**Audit Date:** October 2026  
**Auditor:** Tanish Bane (@TanishBane), Lead Full-Stack & Applied ML Engineer  
**Governance Standard:** AGENTS.md (Invariant Collaboration Laws & Contract Truth)  
**Standard Status Legend:**
- **`WORKING`**: Verified through automated tests and actual runtime execution.
- **`PARTIAL`**: Implemented and functioning, with certain external integrations dependent on runtime environment variables.
- **`DEMO`**: Domain-accurate synthetic data clearly labeled with persistent UI indicators (`isFixture: true`).
- **`UNAVAILABLE`**: Requires external model weights or API keys not currently configured.
- **`PLANNED`**: Architectural specification documented; implementation scheduled.

---

## 1. Core Module Capability Matrix

| Module | Route | Frontend Status | Backend Status | Data Source | AI / Model Status | Persistence Status | Test Coverage | Known Limitations |
|---|---|---|---|---|---|---|---|---|
| **NEXFIELD Control** | `/control` | **WORKING** | **WORKING** | PostgreSQL + Open-Meteo API | Statistical Telemetry Analysis | PostgreSQL (farms, fields, observations) | Pytest + Next.js build | Weather requires internet access; falls back to offline state if unreachable. |
| **FieldSight AI** | `/fieldsight` | **WORKING** | **WORKING** | User uploaded leaf image | ONNX Runtime MobileNetV2 (Foliar Pathology) | PostgreSQL (assessment history) | Pytest + ONNX evaluation tests | Optimized for Wheat & Tomato foliar pathogens; flags low-confidence images instead of guessing. |
| **NEXFIELD Twin** | `/twin` | **WORKING** | **WORKING** | Stewart Water-Yield + Scheduled Depth | Verifiable Parametric Yield Engine | Local scenario store + Ops task conversion | Pytest simulation tests | Scheduled irrigation depth ($1\text{ mm} = 10\text{ m}^3/\text{ha}$) and Stewart water-yield function ($K_y = 1.05$). Dynamic hourly weather-station FAO-56 Penman-Monteith rootzone depletion modeling requires on-site telemetry feeds. |
| **NEXFIELD Intelligence** | `/intelligence` | **WORKING** | **PARTIAL** | Live farm records + OpenMeteo | Server-Side Structured Tool Dispatcher | Read-only tenant records; task confirmation | Pytest tool authorization tests | Requires `GEMINI_API_KEY` or `OPENAI_API_KEY` for live generative responses; falls back to structured tool results when keys are absent. |
| **NEXFIELD Ops** | `/ops` | **WORKING** | **WORKING** | PostgreSQL farm tables | Food-Quality Storage Risk Engine | PostgreSQL (tasks, inventory, harvest batches, sales) | Pytest transactional balance tests | Sales require batches marked `settled_at_mandi`. |
| **NEXFIELD Markets** | `/markets` | **WORKING** | **PARTIAL** | Agmarknet (data.gov.in) + CEDA + CACP MSP | Multi-factor Haulage Freight Model | Read-only market observations | Pytest adapter tests | Live price feeds require `AGMARKNET_API_KEY`; official seasonal MSP tables provide offline baseline. |

---

## 2. Infrastructure & Tenant Security Matrix

| Component | Target File | Status | Authentication Mode | Isolation Guarantee | Evidence |
|---|---|---|---|---|---|
| **Farmer Profile & Overview** | `apps/web/app/control/page.tsx` | **WORKING** | Public Demo (No Login) | Browser LocalStorage (`nexfield-demo-v1`) | Interactive modal & persistent store |
| **Data Ingestion Center** | `apps/web/app/data-center/page.tsx` | **WORKING** | Public Demo (No Login) | Sandboxed Local Demo Store | Validates CSV, GeoJSON & JSON schema |
| **Backend Ingestion API** | `services/api/import_data.py` | **WORKING** | FastAPI `get_current_user` | Strict tenant validation `Farm.owner_id == user.id` | Passing pytest unit tests |
| **Open-Meteo Integration** | `services/api/control.py` | **WORKING** | Open Public Endpoint (No key required) | Location scoped to farm GPS coordinates | Tested via `test_open_meteo.py` |
| **Mandi Price Adapters** | `services/api/markets.py` | **PARTIAL** | API Key (`AGMARKNET_API_KEY`) | Scoped to state & district queries | Tested via `test_agmarknet.py` |
| **Next.js Web Engine** | `apps/web/package.json` | **WORKING** | SSR / SSG | Strict client-server boundaries | Running Next.js 15.5.28 (patched for CVE-2025-29927) |

---

## 3. Disclaimed & Clarified Implementation Boundaries

To uphold scientific credibility during hackathon evaluation, NEXFIELD explicitly documents the following technical boundaries:

1. **No Fabricated Inference Claims:**
   - FieldSight AI uses an authentic ONNX MobileNetV2 architecture with verified tensor dimensions $(1, 3, 224, 224)$. Predictions below the calibrated probability threshold ($< 0.65$) are reported as *Uncertain/Indeterminate* rather than fabricating diagnostic claims.
   - Saliency maps (heatmaps) are only rendered when genuine spatial feature activations are computed; fake color overlays are strictly forbidden.

2. **Verifiable Biophysical Math vs Artificial Simulation:**
   - NEXFIELD Twin calculates scheduled irrigation volume as:
     $$V_{\text{total}} = \text{Area (ha)} \times \text{Events} \times \text{Volume per ha } (m^3/\text{ha})$$
   - It models rootzone depletion based on daily crop evapotranspiration ($ET_c = ET_0 \times K_c$). Simulated water savings represent model projections based on scheduled vs crop water requirements, not empirical IoT-metered field yields.

3. **Freight Economics & Price Truth:**
   - Mandi modal prices are informational observations reported by agricultural marketing boards. They do not constitute binding commercial purchase offers.
   - Transport net realization accounts for vehicle capacity, mileage, diesel prices, toll rates, loading/unloading (hamali), mandi cess, and transit shrinkage.

4. **Multi-Tenant Separation:**
   - In production mode, all database queries enforce `Farm.owner_id == user.user_id`. One farmer cannot view, edit, or import data into another farmer's property.
   - In demo mode (`/demo/*`), all actions operate against a local in-memory store initialized with synthetic Nashik Tomato data, never affecting live tenant partitions.
