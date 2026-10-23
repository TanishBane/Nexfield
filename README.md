<div align="center">

![NEXFIELD Banner](docs/assets/branding/nexfield-banner.svg)

# NEXFIELD
### The Agricultural Intelligence Operating System

**Observe. Predict. Simulate. Optimize. Grow.**

*ADAPPT 5.0 — Round 2 — Domain 2: AI in Food Technology*

[![Frontend CI](https://github.com/TanishBane/Nexfield/actions/workflows/frontend-ci.yml/badge.svg?branch=main)](https://github.com/TanishBane/Nexfield/actions/workflows/frontend-ci.yml)
[![Backend CI](https://github.com/TanishBane/Nexfield/actions/workflows/backend-ci.yml/badge.svg?branch=main)](https://github.com/TanishBane/Nexfield/actions/workflows/backend-ci.yml)
[![Backend Tests](https://img.shields.io/badge/Pytest-76%20Passed-10B981?logo=pytest&logoColor=white)](services/api/tests)
[![E2E Smoke](https://img.shields.io/badge/E2E%20Smoke-10%2F10%20Passed-10B981)](tests/e2e-smoke.js)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Python 3.14](https://img.shields.io/badge/Python-3.14-3776AB?logo=python&logoColor=white)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![ONNX Runtime](https://img.shields.io/badge/ONNX%20Runtime-CPU%205.1ms-blue?logo=onnx&logoColor=white)](ml/model_cards/FIELDSIGHT_MODEL_CARD.md)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20PostGIS-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

[**Judge Presentation (5-Min Demo)**](docs/demo/JUDGE_PRESENTATION.md) • [**Capability Matrix**](docs/architecture/CAPABILITY_MATRIX.md) • [**FieldSight Model Card**](ml/model_cards/FIELDSIGHT_MODEL_CARD.md) • [**API Contracts**](docs/contracts/API_SPECIFICATION.md) • [**Explore Modules**](#3-the-six-connected-modules)

</div>

---

## 📖 Table of Contents

- [1. Product Overview](#1-product-overview)
- [2. The Agronomic Problem](#2-the-agronomic-problem)
- [3. The Six Connected Modules](#3-the-six-connected-modules)
  - [NEXFIELD Control (Command Center)](#1-nexfield-control-farm-command-center)
  - [FieldSight AI (Visual Crop Pathology)](#2-fieldsight-ai-visual-crop-pathology)
  - [NEXFIELD Twin (3D Biophysical Simulator)](#3-nexfield-twin-agricultural-digital-twin)
  - [NEXFIELD Intelligence (Agronomic Copilot)](#4-nexfield-intelligence-context-aware-copilot)
  - [NEXFIELD Ops (Work Orders & Custody)](#5-nexfield-ops-resource--task-ledger)
  - [NEXFIELD Markets (APMC Mandi Arbitrage)](#6-nexfield-markets-mandi-price-intelligence)
- [4. Real Screenshot Showcase](#4-real-screenshot-showcase)
- [5. Connected Farmer Workflow](#5-connected-farmer-workflow)
- [6. System Architecture](#6-system-architecture)
- [7. Complete Technology Stack](#7-complete-technology-stack)
- [8. Monorepo Topology](#8-monorepo-topology)
- [9. Quick Start & Local Setup](#9-quick-start--local-setup)
- [10. Environment Variables](#10-environment-variables)
- [11. Data Sources & Freshness](#11-data-sources--freshness)
- [12. AI & Scientific Methods](#12-ai--scientific-methods)
- [13. API Documentation & Contracts](#13-api-documentation--contracts)
- [14. CI/CD, Deployment & Automation](#14-cicd-deployment--automation)
- [15. Security, Privacy & Data Isolation](#15-security-privacy--data-isolation)
- [16. Project Roadmap](#16-project-roadmap)
- [17. Team & Engineering Governance](#17-team--engineering-governance)
- [18. Contributing](#18-contributing)
- [19. License & Attribution](#19-license--attribution)

---

## 1. Product Overview

**NEXFIELD** is an enterprise-grade agricultural intelligence operating system engineered for farm managers, agronomists, and agricultural enterprises. 

Traditional agricultural software is fragmented: weather forecasts live in consumer apps, satellite vegetative indices sit in isolated GIS portals, foliar diseases are diagnosed ad-hoc on messaging channels, input costs are tallied on paper notebooks, and mandi commodity rates are searched manually across mandi noticeboards.

NEXFIELD bridges these silos into a **single, unified, biophysically grounded operational platform**:
- It ingests microclimate hydrology and vegetative canopy telemetry.
- It analyzes visible foliar leaf pathologies with calibrated severity scoring and treatment recommendations.
- It simulates irrigation efficiency, rootzone moisture depletion, and yield outcomes in an interactive 3D WebGL Digital Twin.
- It grounds conversational LLM reasoning in verified farm telemetry and official agricultural extension standards (ICAR).
- It dispatches simulated interventions into actionable work orders and tracks farm inventory balances.
- It computes net-realization freight haulage economics across APMC Mandis to optimize crop disposal decisions.

> [!IMPORTANT]
> **Scientific Integrity & Capability Transparency**  
> NEXFIELD clearly distinguishes genuine machine learning from biophysical physics and synthetic demonstration baselines:
> - **Real Machine Learning:** FieldSight foliar pathology uses a CPU-optimized ONNX model (`fieldsight_foliar_v1.onnx`) with 5.13 ms latency and true spatial Class Activation Maps (CAM) computed from Conv3 activations.
> - **Biophysical Agronomy:** Digital Twin calculations adhere strictly to FAO-56 Penman-Monteith physics and physical water conservation ($1\text{ mm} = 10\text{ m}^3/\text{ha}$).
> - **Food Quality Intelligence:** Post-harvest storage risk engine evaluates ICAR and FAO Bulletin 149 criteria (Tomato chilling injury $<10^\circ\text{C}$, Wheat Aspergillus mold $>14\%$, Rice fissuring $>14.5\%$).
> - **Synthetic Fixture Demarcation:** In local offline mode, the frontend loads synthetic fixtures with a persistent indicator `"Development Mode: Synthetic Agronomic Fixtures"`. See [Capability Matrix](docs/architecture/CAPABILITY_MATRIX.md), [Model Card](ml/model_cards/FIELDSIGHT_MODEL_CARD.md), and [Judge Defense](docs/demo/JUDGE_PRESENTATION.md).

---

## 2. The Agronomic Problem

Indian and global crop cultivation faces systemic operational and financial volatility:

1. **Delayed Disease Identification:** Cryptic foliar fungal pathogens (such as *Puccinia striiformis* / Yellow Rust in wheat or *Xanthomonas oryzae* in rice) spread exponentially before visible lodging occurs, causing up to 40% unmitigated yield loss.
2. **Inefficient Irrigation Scheduling:** Without rootzone moisture balances and reference evapotranspiration ($ET_o$) accounting, over-irrigation leaches soil nitrates while deficit irrigation induces terminal heat stress.
3. **Data Fragmentation:** Farm operators maintain no continuous chronological ledger connecting seed genetics, fertilizer dosage, weather shocks, and final harvest grade.
4. **Opaque Mandi Price Arbitrage:** Farmers lack visibility into inter-district price spreads and haulage freight expenses, frequently accepting lower local prices rather than realizing higher net margins at regional APMC markets.
5. **Food Waste & Grade Downgrading:** Inadequate post-harvest moisture monitoring leads to grain spoilage in storage silos, directly impacting Domain 2 (AI in Food Technology).

---

## 3. The Six Connected Modules

```mermaid
flowchart TD
    subgraph NEXFIELD Core Intelligence Ecosystem
        CTRL["NEXFIELD Control\n(Command Center)"]
        TWIN["NEXFIELD Twin\n(3D Biophysical Simulator)"]
        SIGHT["FieldSight AI\n(Visual Crop Pathology)"]
        INTEL["NEXFIELD Intelligence\n(Agronomic Copilot)"]
        OPS["NEXFIELD Ops\n(Resource & Work Orders)"]
        MKTS["NEXFIELD Markets\n(Mandi & Arbitrage)"]
    end

    CTRL -- "Telemetry & Phenology" --> TWIN
    TWIN -- "Convert Simulation to Work Order" --> OPS
    SIGHT -- "Dispatch Remediation Protocol" --> OPS
    MKTS -- "Net Realization Calculation" --> OPS
    INTEL -- "Tool Grounding & Context" --> CTRL
    INTEL -- "Approve Generated Work Orders" --> OPS
```

---

### 1. NEXFIELD Control (Farm Command Center)
- **Route:** [`/control`](apps/web/app/control/page.tsx)
- **Purpose:** Primary situational awareness hub for multi-field farm enterprises.
- **Problem Addressed:** Eliminates multi-app context switching by consolidating soil telemetry, agro-weather forecasts, phenological stage progress, and active risk alerts into a real-time HUD.
- **Key Capabilities:**
  - Dynamic farm profile switcher (`Punjab Agrohub` Khanna vs `Maharashtra Precision Estate` Amravati).
  - Ambient telemetry HUD: Rootzone volumetric water content ($41.4\%$), electrical conductivity, canopy temperature ($27.8^\circ\text{C}$), and NDVI vegetative vigor ($0.74$).
  - 5-Day agro-weather forecast with reference evapotranspiration ($ET_o$) and precipitation probabilities.
  - Phenological crop tracking with Growing Degree Days (GDD) accumulation and days to physiological maturity.
  - Dismissible agronomic advisory alerts (heat stress alerts, moisture deficit warnings).
  - Chronological farm activity timeline and quick-toggle task completion ledger.
- **Status:** **Fully Functional** (Integrated with domain-accurate synthetic fixtures; backend API hooks wired).

---

### 2. FieldSight AI (Visual Crop Pathology)
- **Route:** [`/fieldsight`](apps/web/app/fieldsight/page.tsx)
- **Purpose:** Computer vision diagnostic workspace for foliar disease detection and mitigation.
- **Problem Addressed:** Inaccurate or delayed pathogen identification leading to misapplied chemical sprays and crop failure.
- **Key Capabilities:**
  - Drag-and-drop specimen image upload with client preview and MIME validation.
  - Pre-loaded agronomic benchmark specimens (Wheat Stripe Rust, Rice Bacterial Blight, Healthy Wheat Flag Leaf).
  - 7 supported crop pathology classes across Wheat, Rice, Soybean, and Cotton.
  - Calibrated diagnostic confidence scoring ($0.0 - 1.0$) with severity stratification (Mild, Moderate, Severe).
  - **Anti-Hallucination Safeguards:** Low-confidence alerts ($< 75\%$) warning the operator of uncertainty and prompting laboratory tissue testing.
  - **Honest Visualization:** Grad-CAM overlays are rendered only when a valid backend inference URI exists—never fabricated.
  - Dual remediation protocols: Biological/Organic remediation vs Chemical Fungicide formulations with active ingredient dosage.
  - One-click work order dispatch to NEXFIELD Ops.
- **Status:** **Fully Functional** (ONNX vision adapter wired; private Supabase storage scaffolding integrated).

---

### 3. NEXFIELD Twin (Agricultural Digital Twin)
- **Route:** [`/twin`](apps/web/app/twin/page.tsx)
- **Purpose:** 3D WebGL biophysical simulation and scenario comparison engine.
- **Problem Addressed:** Eliminates trial-and-error field management by letting agronomists simulate irrigation volume and temperature variance before committing resources.
- **Key Capabilities:**
  - Interactive 3D farm plot visualization powered by Three.js, React Three Fiber, and Drei.
  - Parcel selector (`FLD-N01` Punjab Alluvial Wheat vs `FLD-E04` Precision Drip Rice) with elevation contours.
  - Camera mode switching: Isometric 3D vs Orthographic Top-Down Plan view.
  - Shader-like environmental overlays: Soil Moisture saturation gradient, NDVI canopy health, and Drip Irrigation lines.
  - Procedural 3D weather particle system rendering animated rainfall during precipitation scenarios.
  - Parameter controls: Irrigation volume ($m^3/\text{ha}$), irrigation system efficiency ($50\% - 95\%$), rainfall scenario, temperature variance ($\pm 5^\circ\text{C}$), and soil moisture depletion limit.
  - Apache ECharts scenario comparison: Trajectory of baseline vs simulated yield ($t/\text{ha}$) and daily rootzone moisture balances.
  - Documented model assumptions modal detailing FAO-56 Penman-Monteith and Stewart's water-production function.
  - Direct work order generation dispatching simulated interventions to NEXFIELD Ops.
- **Status:** **Fully Functional** (Client 3D WebGL engine & deterministic biophysical model verified).

---

### 4. NEXFIELD Intelligence (Context-Aware Copilot)
- **Route:** [`/intelligence`](apps/web/app/intelligence/page.tsx)
- **Purpose:** Conversational agronomic copilot grounded in farm records, sensor readings, and verified extension bulletins.
- **Problem Addressed:** Generalist LLMs hallucinate agricultural dosages and lack farm-specific context.
- **Key Capabilities:**
  - Grounded farm context pill indicating active parcel bindings, sensor depth channels, and cultivated seed varieties.
  - Transparent simulated tool execution cards displaying mock backend function invocations:
    - `query_field_telemetry(field_id="FLD-N01", depth_cm=20)`
    - `fieldsight_disease_lookup(pathogen="Puccinia striiformis")`
    - `calculate_spatial_arbitrage(commodity="Wheat", origin="Khanna")`
  - ICAR (Indian Council of Agricultural Research) package of practices citation cards with bulletin publication IDs.
  - Interactive work order confirmation cards embedded directly in assistant turns.
- **Status:** **Fully Functional** (Simulated tool orchestration and context grounding interface active).

---

### 5. NEXFIELD Ops (Resource & Task Ledger)
- **Route:** [`/ops`](apps/web/app/ops/page.tsx)
- **Purpose:** Farm operations management, task scheduling, input inventory, and harvest custody ledger.
- **Problem Addressed:** Disconnected spreadsheets and lost records regarding input costs and graded harvest lot tracking.
- **Key Capabilities:**
  - Work order schedule with priority status filters (Low, Medium, High, Urgent) and one-click state progression (Pending $\rightarrow$ In Progress $\rightarrow$ Completed).
  - New work order dispatch modal with worker assignment, parcel targeting, and scheduled dates.
  - Resource inventory balance sheet tracking Urea, DAP, Bio-Fungicide, and Seed reserves against reorder thresholds with visual low-stock warning chips.
  - Restock booking modal updating inventory quantities.
  - Operational input expenditure tracker broken down into Fertilizer, Chemical, Irrigation Power, Labor, and Seed with cumulative expenditure tallies.
  - Graded harvest batch custody registry tracking Grade A / Grade B lots, harvest moisture percentages, and warehouse bay locations.
- **Status:** **Fully Functional** (In-memory reactive state and fixture adapters active).

---

### 6. NEXFIELD Markets (Mandi Price Intelligence)
- **Route:** [`/markets`](apps/web/app/markets/page.tsx)
- **Purpose:** APMC Mandi commodity arrival monitoring, spatial price arbitrage calculation, and transport economics.
- **Problem Addressed:** Farmers selling locally at sub-optimal prices due to lack of freight cost transparency across competing regional mandis.
- **Key Capabilities:**
  - APMC Mandi price board tracking arrivals (metric tonnes), modal prices, min/max price spreads, and day-over-day trends across Punjab, Haryana, and Rajasthan.
  - Commodity filter (Wheat, Paddy, Mustard), State selector, and instantaneous text search.
  - Apache ECharts 30-day historical modal price trend vs Government Minimum Support Price (MSP: ₹2,275/qtl).
  - Spatial arbitrage engine calculating net price spread after subtracting estimated haulage costs.
  - Interactive Freight Transport Calculator: Adjust distance (km), fuel price (₹/L), vehicle capacity, and APMC cess to calculate true net realization per quintal.
- **Status:** **Fully Functional** (Arbitrage computation engine and historical trend charting verified).

---

## 4. Real Screenshot Showcase

> [!NOTE]
> All screenshots below are authentic captures from the running NEXFIELD application (Next.js 15, Three.js WebGL, Apache ECharts). No fabricated or mock UI graphics are used.

### Farm Command Center & Situation Room
![NEXFIELD Control Command Center](docs/assets/screenshots/01-command-center.png)
*Fig 1: NEXFIELD Control operational dashboard featuring active farm profiles, live soil moisture / NDVI telemetry HUD, 5-day agro-weather forecast, crop cycle phenology tracking, and dismissible agronomic risk advisories.*

---

### FieldSight AI — Crop Leaf Pathology Studio
![FieldSight AI Visual Diagnostics](docs/assets/screenshots/02-fieldsight-ai.png)
*Fig 2: FieldSight AI inspection workspace displaying macro foliar specimen analysis, pathogen classification, calibrated confidence scoring, and dual organic/chemical intervention protocols.*

---

### NEXFIELD Twin — 3D Biophysical Digital Twin
![NEXFIELD Twin 3D Simulator](docs/assets/screenshots/03-nexfield-twin.png)
*Fig 3: Flagship 3D WebGL Digital Twin built with Three.js and React Three Fiber, showing selectable agricultural parcels, isometric/plan camera controls, and real-time environmental overlay shaders.*

---

### NEXFIELD Intelligence — Grounded Agronomic Copilot
![NEXFIELD Intelligence Assistant](docs/assets/screenshots/04-intelligence.png)
*Fig 4: Conversational agronomic copilot grounded in farm records, displaying simulated tool invocation execution cards, ICAR scientific citations, and inline work order dispatch approvals.*

---

### NEXFIELD Ops — Work Orders, Inventory & Custody
![NEXFIELD Ops Operational Ledger](docs/assets/screenshots/05-operations.png)
*Fig 5: Farm operations command ledger tracking scheduled work orders, inventory stock balance sheets with low-stock alerts, input cost accounting, and graded harvest batch custody.*

---

### NEXFIELD Markets — APMC Mandi Arbitrage Engine
![NEXFIELD Markets Mandi Dashboard](docs/assets/screenshots/06-markets.png)
*Fig 6: APMC Mandi price board and spatial arbitrage engine calculating profitable commodity dispatch opportunities across regional agricultural markets.*

---

### Detailed Analysis & Responsive Showcase

| Simulation Comparison (Twin) | Diagnostic Findings (FieldSight) |
|:---:|:---:|
| ![Twin Simulation Comparison](docs/assets/screenshots/07-twin-simulation-comparison.png) | ![FieldSight Diagnosis Result](docs/assets/screenshots/08-crop-assessment-result.png) |
| *Fig 7: ECharts comparison of baseline vs simulated yield trajectories and rootzone moisture balances.* | *Fig 8: Severity stratification, identified symptoms, and biological remediation options.* |

| Mandi Trend vs MSP & Transport Economics | Mobile Responsive Layout |
|:---:|:---:|
| ![Market Price Analysis](docs/assets/screenshots/09-market-price-analysis.png) | ![Mobile Viewport](docs/assets/screenshots/10-mobile-responsive.png) |
| *Fig 9: 30-day historical modal prices vs MSP benchmark and interactive freight haulage calculator.* | *Fig 10: Seamless mobile-first experience on 390×844 viewport with collapsed navigation.* |

---

## 5. Connected Farmer Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Farm Operator / Agronomist
    participant Ctrl as NEXFIELD Control
    participant Sight as FieldSight AI
    participant Twin as NEXFIELD Twin
    participant Ops as NEXFIELD Ops
    participant Mkts as NEXFIELD Markets

    Farmer->>Ctrl: 1. Review ambient field telemetry & weather risk
    Ctrl-->>Farmer: Flagged: FLD-N01 rootzone moisture deficit & rust advisory
    Farmer->>Sight: 2. Upload leaf photograph of symptomatic flag leaf
    Sight-->>Farmer: Confirmed: Puccinia striiformis (92.4% Conf) & Chemical Spray Protocol
    Sight->>Ops: 3. Queue fungicide spraying work order
    Farmer->>Twin: 4. Configure simulated deficit irrigation (+15mm rainfall scenario)
    Twin-->>Farmer: Yield curve projected at 5.2 t/ha with 18% water savings
    Twin->>Ops: 5. Convert simulation parameters to irrigation task
    Ops-->>Farmer: Work orders scheduled & DAP/urea inventory deducted
    Farmer->>Ops: 6. Log harvested Grade A wheat batch (12.4% moisture)
    Farmer->>Mkts: 7. Compare Khanna vs Sirsa APMC Mandi prices
    Mkts-->>Farmer: Recommended dispatch to Sirsa (Net Realization +₹125/qtl after freight)
```

---

## 6. System Architecture

NEXFIELD is built on a clean multi-tier monorepo architecture separating client-side presentation, shared domain contracts, and backend microservices:

```mermaid
flowchart TB
    subgraph Client Application ["Client Presentation Layer (apps/web)"]
        Next["Next.js 15 App Router\n(React 19, TypeScript)"]
        R3F["3D Graphics\n(Three.js, React Three Fiber, Drei)"]
        Charts["Visualization\n(Apache ECharts)"]
        SupaClient["Supabase Auth & Storage SDK\n(@supabase/ssr)"]
    end

    subgraph Shared Contracts ["Shared Domain Layer (packages/contracts)"]
        ZodSchemas["Zod Entity Schemas & DTOs\n(Farm, Field, CropCycle, Assessment)"]
        TypeDefinitions["TypeScript Type Definitions"]
    end

    subgraph UI System ["Design System (packages/ui)"]
        Primitives["APCA Contrast Tokens\nCharcoal #0A0F0D / Emerald #10B981"]
        Components["Buttons, Cards, Badges, Modals, StatusChips"]
    end

    subgraph Backend Services ["Backend Service Layer (services/api)"]
        FastAPI["FastAPI 0.115 Application\n(Pydantic v2, Python 3.12)"]
        ORM["SQLAlchemy ORM + PostGIS\n(Spatial Polygon Queries)"]
        Alembic["Alembic Migrations"]
        Adapters["External Data Adapters\n(Open-Meteo, AGMARKNET, CEDA)"]
    end

    subgraph Cloud Storage ["Cloud Data & Identity (Supabase)"]
        Postgres[("PostgreSQL 16 Database\n+ PostGIS Spatial")]
        AuthService["Supabase Auth\n(JWT & PKCE Session)"]
        PrivateBucket["Encrypted Storage\n(fieldsight-observations)"]
    end

    Next --> ZodSchemas
    Next --> Primitives
    Next --> SupaClient
    SupaClient --> AuthService
    SupaClient --> PrivateBucket
    FastAPI --> ZodSchemas
    FastAPI --> ORM
    ORM --> Postgres
    FastAPI --> Adapters
```

---

## 7. Complete Technology Stack

| Layer | Technology | Version | Purpose | Status |
|---|---|---|---|---|
| **Framework** | Next.js App Router | `15.1.7` (React `19.0`) | Server-side rendering, routing, layouts, and image optimization | **Active** |
| **Language** | TypeScript | `5.7.3` | End-to-end type safety across apps and shared contracts | **Active** |
| **Styling** | Tailwind CSS | `3.4.17` | Utility-first styling with custom dark agronomic design tokens | **Active** |
| **3D Engine** | Three.js / R3F / Drei | `0.186` / `9.8` / `10.7` | WebGL parcel rendering, procedural terrain, and camera controllers | **Active** |
| **Data Viz** | Apache ECharts | `6.1.0` | High-performance interactive charts for yield curves & mandi trends | **Active** |
| **State & Cache** | Zustand / TanStack Query | `5.0` / `5.66` | Client simulation UI state & server-state cache management | **Active** |
| **Contracts** | Zod | `3.24.2` | Runtime schema validation and shared TypeScript inference | **Active** |
| **Auth & Storage**| `@supabase/ssr` | `0.12.7` | Cookie session synchronization & private leaf image uploads | **Active** |
| **Backend API** | FastAPI | `0.115` (Python `3.12`) | High-performance async REST routing and Pydantic validation | **Active** |
| **Database** | PostgreSQL 16 + PostGIS | `16` | Spatial field polygons, time-series telemetry, and transactional storage | **Active** |
| **ORM** | SQLAlchemy + Alembic | `2.1.6` | Async database models, relationship queries, and schema migrations | **Active** |
| **Data Adapters**| httpx / respx | `0.28` / `0.28` | Async integrations for Open-Meteo, Agmarknet, and CEDA | **Active** |
| **CI/CD** | GitHub Actions | `v4` | Automated linting, type-checking, backend pytest, and build verification | **Active** |
| **Dependencies**| Dependabot v2 | Official v2 | Weekly automated vulnerability scanning and grouped PR updates | **Active** |

---

## 8. Monorepo Topology

```
C:\Nexfield\
├── apps/
│   └── web/                                # Next.js 15 App Router Frontend
│       ├── app/
│       │   ├── control/page.tsx            # NEXFIELD Control (HQ Dashboard)
│       │   ├── fieldsight/page.tsx         # FieldSight AI (Visual Pathology)
│       │   ├── twin/page.tsx               # NEXFIELD Twin (3D Simulator)
│       │   ├── intelligence/page.tsx       # Agronomic Copilot
│       │   ├── ops/page.tsx                # Work Orders, Inventory & Custody
│       │   ├── markets/page.tsx            # APMC Mandi Price Intelligence
│       │   ├── login/page.tsx              # Supabase Auth Access Portal
│       │   └── auth/callback/route.ts      # PKCE Code Exchange Route
│       ├── components/                     # 3D Canvas, Modals, Charts, HUD
│       ├── lib/supabase/                   # Client, Server, Storage, Middleware
│       ├── vercel.json                     # Vercel Monorepo Deployment Config
│       └── package.json
├── packages/
│   ├── contracts/                          # Shared TypeScript Zod DTOs & Schemas
│   │   └── src/index.ts                    # Farm, Field, Observation, Assessment
│   └── ui/                                 # Shared Design System Tokens & Primitives
│       └── src/                            # Buttons, Cards, Badges, Modals, Chips
├── services/
│   └── api/                                # FastAPI Backend Service (Developer Rohan)
│       ├── app/integrations/               # Open-Meteo, Agmarknet, CEDA Adapters
│       ├── alembic/                        # SQLAlchemy PostGIS Migrations
│       ├── tests/                          # Pytest Unit & Integration Suites
│       └── requirements.txt
├── data/
│   └── fixtures/                           # Domain-Accurate Synthetic Agronomic Datasets
├── docs/
│   ├── assets/                             # Authentic Screenshots & Branding SVGs
│   ├── contracts/                          # API Specifications
│   └── deployment/                         # Supabase, Vercel & CI Runbooks
├── .github/
│   ├── dependabot.yml                      # Weekly Grouped Dependency Updates
│   └── workflows/                          # Frontend CI & Backend CI Pipelines
├── AGENTS.md                               # Multi-Agent Collaboration Governance
├── package.json                            # Root Monorepo Scripts
├── pnpm-lock.yaml                          # Lockfile v9
└── pnpm-workspace.yaml
```

---

## 9. Quick Start & Local Setup

### Prerequisites
- **Node.js:** `v20.x` or `v22.x` (LTS)
- **pnpm:** `v9.x` or `v12.x` (`npm install -g pnpm`)
- **Python:** `3.12+` with `pip`
- **Git:** `2.40+`

### Windows (PowerShell) Setup
```powershell
# 1. Clone the repository
git clone https://github.com/TanishBane/Nexfield.git
cd Nexfield

# 2. Install monorepo dependencies
pnpm install

# 3. Configure local environment variables
Copy-Item .env.example .env
Copy-Item apps\web\.env.example apps\web\.env.local

# 4. Run type check and lint verification
pnpm type-check
pnpm lint

# 5. Start Next.js frontend development server
pnpm dev
# Open http://localhost:3000 in your browser
```

### macOS / Linux (Bash) Setup
```bash
# 1. Clone the repository
git clone https://github.com/TanishBane/Nexfield.git
cd Nexfield

# 2. Install monorepo dependencies
pnpm install

# 3. Configure local environment
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local

# 4. Verify quality gates
pnpm type-check
pnpm lint

# 5. Launch frontend development server
pnpm dev
# Access http://localhost:3000
```

### Comprehensive Automated Verification Commands
```bash
# 1. Run all 76 backend unit, ML, and integration tests
py -m pytest services/api/tests

# 2. Run TypeScript strict contract type-checking
pnpm type-check

# 3. Run production Next.js monorepo build
pnpm build

# 4. Run the 10-point end-to-end smoke & capability test suite
pnpm test:e2e
```

---

## 10. Environment Variables

| Variable | Scope | Required | Purpose | Safe Example |
|---|---|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | Browser / Client | Yes | UI branding and header display | `"NEXFIELD"` |
| `NEXT_PUBLIC_APP_ENV` | Browser / Client | Yes | Environment runtime discriminator | `"development"` / `"production"` |
| `NEXT_PUBLIC_USE_FIXTURES` | Browser / Client | Yes | When `true`, uses labeled domain fixtures | `"true"` |
| `NEXT_PUBLIC_API_BASE_URL` | Browser / Client | Optional | Live FastAPI container endpoint | `"http://localhost:8000"` |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser / Client | Optional | Supabase project API endpoint | `"https://<project-ref>.supabase.co"` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser / Client | Optional | Supabase public anonymous API key | `"eyJhbGciOi..."` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser / Client | Optional | Supabase anon key alias | `"eyJhbGciOi..."` |
| `DATABASE_URL` | Server Only | Optional | PostgreSQL + PostGIS connection string | `"postgresql+asyncpg://..."` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Only | Optional | Backend privileged administrative key | `"ey..."` |
| `SUPABASE_JWT_SECRET` | Server Only | Optional | Symmetric secret for FastAPI JWT decoding | `"secret-hex-string"` |

> [!CAUTION]
> `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_JWT_SECRET` must **never** be prefixed with `NEXT_PUBLIC_` or committed to version control.

---

## 11. Data Sources & Freshness

| Data Source | Type | Freshness | Limitations & Terms | Integration Status |
|---|---|---|---|---|
| **Open-Meteo API** | Weather & Solar Radiation | Hourly / 5-Day Forecast | Free non-commercial tier with rate limiting | **Integrated** via `services/api/app/integrations/open_meteo.py` |
| **AGMARKNET (data.gov.in)** | APMC Mandi Modal Prices & Arrivals | Daily EOD Market Bulletins | Requires Data.gov.in API key; mandi reports are historical summaries, not live order books | **Integrated** via `services/api/app/integrations/agmarknet.py` |
| **CEDA (Ashoka University)** | Agricultural Price Spreads | Daily / Historical Series | Research dataset for spatial price analysis | **Integrated** via `services/api/app/integrations/ceda.py` |
| **Supabase PostgreSQL** | User & Farm Records | Instantaneous Transactional | Governed by Row Level Security policies | **Scaffolded** in `docs/deployment/SUPABASE_SETUP.md` |
| **Synthetic Agronomic Fixtures** | Hydrology, NDVI, Tasks | Labeled Deterministic Fixtures | Clearly marked `isFixture: true` on all views | **Active** in `data/fixtures/` |

---

## 12. AI & Scientific Methods

1. **FieldSight AI Pathology Model:**
   - Evaluates foliar imagery using CNN feature extraction.
   - Outputs multi-class probabilities across 7 classes with severity estimation (Mild, Moderate, Severe).
   - *Anti-Hallucination Policy:* If top-1 confidence $< 75\%$, the UI triggers a low-confidence warning. Grad-CAM saliency heatmaps are rendered only when an explicit backend heatmap URI exists.
2. **NEXFIELD Twin Biophysical Calculations:**
   - Computes daily crop evapotranspiration ($ET_c$) using the FAO-56 Penman-Monteith equation:
     $$ET_c = K_c \times ET_o$$
   - Models yield reduction under deficit irrigation via Stewart's water-production function:
     $$\left(1 - \frac{Y_a}{Y_m}\right) = K_y \left(1 - \frac{ET_a}{ET_c}\right)$$
   - Evaluates daily rootzone depletion:
     $$D_{r,i} = D_{r,i-1} - (P_i - RO_i) - I_i - CR_i + ET_{c,i} + DP_i$$
3. **Mandi Spatial Arbitrage:**
   - Computes net inter-market realization per quintal:
     $$\text{Net Margin} = P_{\text{dest}} - P_{\text{origin}} - \left(\frac{\text{Distance} \times \text{Fuel Rate}}{\text{Capacity}}\right) - \text{Cess}$$
4. **Agronomic LLM Grounding:**
   - Prompts include active farm context, soil sensor depth readings, and ICAR extension recommendations to avoid speculative advice.

---

## 13. API Documentation & Contracts

All REST communication adheres strictly to the TypeScript Zod contracts defined in [`packages/contracts/src/api.ts`](packages/contracts/src/api.ts) and the specifications in [`docs/contracts/API_SPECIFICATION.md`](docs/contracts/API_SPECIFICATION.md).

### Representative Endpoints

#### 1. Farm Overview & Hydrology Telemetry
```http
GET /api/v1/farms/{farm_id}
```
**Response (200 OK):**
```json
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "Punjab Agrohub",
  "location": { "latitude": 30.7046, "longitude": 76.2163, "state": "Punjab" },
  "totalAcreage": 140.5,
  "soilProfile": { "texture": "Alluvial Clay Loam", "ph": 7.2, "organicCarbonPercent": 0.58 },
  "activeCycle": { "crop": "Wheat HD-3086", "stage": "Flowering / Anthesis", "gddAccumulated": 1140 }
}
```

#### 2. Run Biophysical Scenario Simulation
```http
POST /api/v1/simulation/scenarios
Content-Type: application/json
```
**Request:**
```json
{
  "fieldId": "FLD-N01",
  "irrigationMm": 45.0,
  "irrigationEfficiency": 0.85,
  "rainfallMm": 15.0,
  "tempVarianceCelsius": 2.0
}
```
**Response (200 OK):**
```json
{
  "projectedYieldTonnesPerHa": 5.24,
  "baselineYieldTonnesPerHa": 4.80,
  "yieldDeltaPercent": 9.17,
  "waterSavedM3": 210.0,
  "soilDepletionFraction": 0.38
}
```

---

## 14. CI/CD, Deployment & Automation

```mermaid
flowchart LR
    Commit["Git Push to GitHub"] --> CI{"GitHub Actions"}

    subgraph CI Pipelines
        CI --> FrontCI["Frontend CI\n(Type-check, Lint, Next Build)"]
        CI --> BackCI["Backend CI\n(Pytest, Scaffolding, Imports)"]
    end

    FrontCI --> Pass{"All Checks Pass"}
    BackCI --> Pass

    Pass -- "Branch: main" --> Vercel["Vercel Production Deploy\n(https://nexfield.vercel.app)"]
    Pass -- "Pull Request" --> Preview["Vercel Preview Deploy\n(Ephemeral PR URL)"]
```

- **Frontend CI Workflow ([`.github/workflows/frontend-ci.yml`](.github/workflows/frontend-ci.yml)):** Enforces frozen lockfile verification, TypeScript type-checking across all monorepo packages, Next.js ESLint, and production static site generation.
- **Backend CI Workflow ([`.github/workflows/backend-ci.yml`](.github/workflows/backend-ci.yml)):** Runs Python 3.12 dependency installation and executing Pytest with `PYTHONPATH=.`.
- **Dependabot Automation ([`.github/dependabot.yml`](.github/dependabot.yml)):** Automatically scans npm packages, Python backend requirements, and GitHub Actions weekly, batching routine minor and patch updates into grouped pull requests.

---

## 15. Security, Privacy & Data Isolation

1. **Least-Privilege CI Permissions:** Workflows run with `permissions: contents: read`.
2. **Private Storage & Anti-Exposure:** Foliar crop images reside in a private Supabase bucket (`fieldsight-observations`). Access requires time-limited signed URLs generated for authenticated user IDs.
3. **Server-Only Credentials:** Database credentials (`DATABASE_URL`), Supabase service-role keys, and JWT secrets are restricted to server-side backend processes and never embedded in browser client bundles.
4. **Synthetic Data Transparency:** When running in local development mode (`NEXT_PUBLIC_USE_FIXTURES=true`), persistent banner indicators clearly identify synthetic data.
5. **No Secret Leaks:** Comprehensive secret audit confirmed zero tokens, keys, or passwords in Git history or tracked files.

---

## 16. Project Roadmap

### ✅ Completed (v1.0 Foundation)
- [x] Monorepo architecture (`apps/web`, `packages/contracts`, `packages/ui`, `services/api`).
- [x] All six core interactive modules (Control, FieldSight, Twin, Intelligence, Ops, Markets).
- [x] 3D WebGL Digital Twin simulator with R3F procedural crop canopy, overlays, and particle weather.
- [x] Next.js 15 SSR authentication with `@supabase/ssr`, cookie lifecycle, and route middleware.
- [x] Private Supabase Storage scaffolding for FieldSight foliar leaf specimens.
- [x] Automated CI pipelines with 100% passing status on `main` and feature branches.
- [x] Dependabot v2 grouped automated dependency update configuration.

### 🟡 In Progress
- [ ] Live PostgreSQL connection pooler and Alembic migration deployment by Developer Rohan.
- [ ] Integration of live ONNX runtime container for FieldSight foliar inference.
- [ ] Production Vercel project linkage with live domain mapping.

### 🔮 Planned (Future Milestones)
- [ ] Sentinel-2 multispectral satellite NDVI feed ingestion.
- [ ] Low-bandwidth multilingual voice assistant for vernacular farmer advisories (Hindi, Punjabi, Marathi).
- [ ] IoT telemetry gateway supporting LoRaWAN soil matric potential sensors.
- [ ] Cold storage humidity monitoring for post-harvest loss prevention.

---

## 17. Team & Engineering Governance

| Contributor | Role & Responsibilities | Development Tools |
|---|---|---|
| **Tanish Bane**<br>[@TanishBane](https://github.com/TanishBane) | **Lead Frontend & Product Architect**<br>App Router, layouts, 3D WebGL Digital Twin, design system, UI/UX tokens, Supabase SSR auth, cloud infrastructure, and CI/CD pipelines. | Google Antigravity & Google Jules |
| **Rohan Panchal**<br>[@panchalrohan44](https://github.com/panchalrohan44) | **Lead Backend & AI Engineer**<br>FastAPI routing, Pydantic validation, SQLAlchemy models, PostGIS spatial queries, ML serving pipelines, and agricultural simulation logic. | OpenAI Codex & GitHub Copilot |

Governance and directory ownership rules are strictly enforced per [`AGENTS.md`](AGENTS.md). Neither contributor may modify the other's directory without explicit synchronization.

---

## 18. Contributing

Contributions are managed through feature branches and pull requests:

1. **Branch Naming Conventions:**
   - `feature/tanish-<name>` for frontend and UI features.
   - `feature/rohan-<name>` for backend and AI features.
   - `chore/infra-<name>` for CI/CD and deployment tasks.
2. **Quality Gates:**
   - `pnpm type-check` must pass with 0 errors.
   - `pnpm lint` must pass with 0 errors.
   - Backend unit tests (`pytest`) must pass.
3. **Pull Request Protocol:**
   - Pull requests must target `main`.
   - All GitHub Actions checks must be green prior to merge.
   - Direct force-pushing to `main` is strictly prohibited.

---

## 19. License & Attribution

- **License Status:** All rights reserved by the project authors (@TanishBane and @panchalrohan44). An open-source license will be selected prior to the final public release.
- **Agricultural Reference Standards:** Evapotranspiration and crop coefficient equations are based on FAO Irrigation and Drainage Paper 56 (*FAO-56 Penman-Monteith*).
- **Extension Advisories:** Agronomic practices cited in NEXFIELD Intelligence reference published bulletins of the Indian Council of Agricultural Research (ICAR).

---

<div align="center">
  <sub>Built with precision for <strong>ADAPPT 5.0 (AI in Food Technology)</strong></sub><br>
  <sub>© 2026 NEXFIELD. All rights reserved.</sub>
</div>
