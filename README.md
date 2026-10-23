# NEXFIELD

**AI-Powered Agricultural Intelligence Operating System**  
*ADAPPT 5.0 — Round 2 — Domain 2: AI in Food Technology*

NEXFIELD is an enterprise-grade agricultural operating system engineered to unify telemetry, computer vision diagnostics, scenario digital twins, conversational agronomy, resource operations, and spatial Mandi market arbitrage into a single coherent interface.

---

## 🌾 The Six Interconnected Modules

1. **NEXFIELD Control (`/control`):** Farm Command Center with multi-field soil hydrology, weather telemetry, microclimate risk index, and operational dispatch.
2. **FieldSight AI (`/fieldsight`):** Visual foliar pathology, pest infestation scoring, severity mapping with Grad-CAM overlays, and organic/chemical intervention protocols.
3. **NEXFIELD Twin (`/twin`):** Biophysical simulation engine modeling soil nitrogen depletion, dynamic irrigation schedules, carbon footprint, and yield outcome curves.
4. **NEXFIELD Intelligence (`/intelligence`):** Farm-context grounded agronomic LLM assistant citing peer-reviewed ICAR / agricultural extension advisories.
5. **NEXFIELD Ops (`/ops`):** Operational ledger for seed and fertilizer stocks, farm workforce work orders, cost allocation, and graded harvest batch custody.
6. **NEXFIELD Markets (`/markets`):** Mandi price telemetry, spatial arbitrage calculation (price spread minus freight and cess), and profit maximization recommendations.

---

## 🏛️ Monorepo Topology

```
nexfield/
├── apps/
│   └── web/                # Next.js 15+ App Router frontend
├── services/
│   └── api/                # FastAPI backend service (owned by Developer B)
├── packages/
│   ├── contracts/          # Shared TypeScript DTOs, Zod validators, and entities
│   └── ui/                 # Shared design system components and token primitives
├── data/
│   └── fixtures/           # Labeled domain-accurate development fixtures
├── docs/
│   ├── contracts/          # API specifications and schemas
│   └── architecture/       # Module architecture documentation
├── tests/
│   └── e2e/                # End-to-end test suites
└── .github/
    └── workflows/          # GitHub Actions CI for frontend and backend
```

---

## 🚀 Quick Local Setup

### Prerequisites
- Node.js `20.x` or `24.x`
- pnpm `9.x` or `12.x`
- Python `3.11+` (for backend services)

### 1. Install Monorepo Dependencies
```bash
# Clone the repository
git clone https://github.com/<your-org>/nexfield.git
cd nexfield

# Install all workspace dependencies
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
```

By default, `NEXT_PUBLIC_USE_FIXTURES=true` is enabled in `apps/web/.env.local`. This allows full interactive frontend development and testing with rich, domain-accurate agronomic fixtures without requiring a local PostgreSQL database or running backend.

### 3. Start Development Server
```bash
# Starts Next.js application at http://localhost:3000
pnpm dev
```

### 4. Build & Type Check
```bash
# Type check all packages and apps
pnpm type-check

# Build for production
pnpm build
```

---

## 🤝 Multi-Agent Collaboration Governance

Review `AGENTS.md` and `.github/copilot-instructions.md` before making architectural modifications:
- **Developer A (Google Antigravity):** Leads frontend, layouts, and design system in `apps/web` and `packages/ui`.
- **Developer B (OpenAI Codex / Copilot):** Leads backend architecture, PostGIS, ORM models, and ML serving in `services/api`.
- **Google Jules:** Cloud adapters and external data integration pipelines.
- **Shared Contracts:** Governed under `packages/contracts` and `docs/contracts`.
