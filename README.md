# NEXFIELD

**AI-Powered Agricultural Intelligence Operating System**  
*ADAPPT 5.0 — Round 2 — Domain 2: AI in Food Technology*

NEXFIELD is an enterprise-grade agricultural operating system engineered to unify telemetry, computer vision diagnostics, scenario digital twins, conversational agronomy, resource operations, and spatial Mandi market arbitrage into a single coherent platform.

---

## 🌾 The Six Interconnected Modules

1. **NEXFIELD Control (`/control`):** Farm Command Center with multi-field soil hydrology, weather telemetry, microclimate risk index, and operational dispatch.
2. **FieldSight AI (`/fieldsight`):** Visual foliar pathology, pest infestation scoring, severity mapping with Grad-CAM overlays, and organic/chemical intervention protocols.
3. **NEXFIELD Twin (`/twin`):** 3D WebGL biophysical simulation engine modeling soil nitrogen depletion, dynamic irrigation schedules, carbon footprint, and yield outcome curves.
4. **NEXFIELD Intelligence (`/intelligence`):** Farm-context grounded agronomic LLM assistant citing peer-reviewed ICAR / agricultural extension advisories.
5. **NEXFIELD Ops (`/ops`):** Operational ledger for seed and fertilizer stocks, farm workforce work orders, cost allocation, and graded harvest batch custody.
6. **NEXFIELD Markets (`/markets`):** Mandi price telemetry, spatial arbitrage calculation (price spread minus freight and cess), and profit maximization recommendations.

---

## 🏛️ Monorepo Topology

```
nexfield/
├── apps/
│   └── web/                # Next.js 15+ App Router frontend (Supabase Auth, Three.js, ECharts)
├── services/
│   └── api/                # FastAPI backend service (PostGIS, SQLAlchemy, ML serving)
├── packages/
│   ├── contracts/          # Shared TypeScript DTOs, Zod validators, and entities
│   └── ui/                 # Shared design system components and token primitives
├── data/
│   └── fixtures/           # Labeled domain-accurate synthetic development fixtures
├── docs/
│   ├── contracts/          # API specifications and schemas
│   └── deployment/         # Cloud infrastructure, Supabase, Vercel & CI/CD guides
├── tests/
│   └── e2e/                # End-to-end test suites
└── .github/
    ├── dependabot.yml      # Automated Dependabot v2 grouping for npm, pip, and actions
    └── workflows/          # GitHub Actions CI for frontend and backend
```

---

## ☁️ Cloud Infrastructure & Deployment

Detailed operational guides are available in `docs/deployment/`:
- [Supabase Setup & Integration Guide](docs/deployment/SUPABASE_SETUP.md) — Auth, PostgreSQL + PostGIS, Private Storage, and FastAPI verification.
- [Vercel Deployment Guide](docs/deployment/VERCEL_SETUP.md) — pnpm monorepo deployment, environment variables, and preview URLs.
- [GitHub Actions CI Documentation](docs/deployment/GITHUB_ACTIONS.md) — Frontend & Backend CI workflows, concurrency, and security gates.
- [Dependabot Automation Guide](docs/deployment/DEPENDABOT.md) — Weekly dependency updates and grouped pull requests.

---

## 🚀 Quick Local Setup

### Prerequisites
- Node.js `20.x` or `24.x`
- pnpm `9.x` or `12.x`
- Python `3.12+` (for backend services)

### 1. Install Monorepo Dependencies
```bash
git clone https://github.com/TanishBane/Nexfield.git
cd nexfield
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
```

By default, `NEXT_PUBLIC_USE_FIXTURES=true` is enabled in `apps/web/.env.local`. This allows full interactive frontend development and testing with domain-accurate agronomic fixtures without requiring a live database or running backend.

### 3. Start Development Server
```bash
pnpm dev
# Frontend runs at http://localhost:3000
```

### 4. Code Quality & Pre-Flight Verification
```bash
# Type check all packages and apps
pnpm type-check

# Lint frontend Next.js application
pnpm lint

# Production build test
pnpm build
```

---

## 🤝 Multi-Agent Collaboration Governance

Review [`AGENTS.md`](AGENTS.md) and [`.github/copilot-instructions.md`](.github/copilot-instructions.md) before making architectural modifications:
- **Developer Tanish Bane (@TanishBane — Google Antigravity + Jules):** Leads frontend, layouts, Digital Twin visualizations, design system in `apps/web` and `packages/ui`, external data adapters, and cloud infrastructure.
- **Developer Rohan Panchal (@panchalrohan44 — OpenAI Codex / GitHub Copilot):** Leads backend architecture, PostGIS database models, ORM, and ML serving in `services/api`.
- **Shared Contracts:** Governed by consensus under `packages/contracts` and `docs/contracts`.
