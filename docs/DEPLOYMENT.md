# NEXFIELD — Deployment, Cloud Architecture & Operations

**Project:** NEXFIELD — The Agricultural Intelligence Operating System  
**Hackathon:** ADAPPT 5.0 — Round 2 — Domain 2: AI in Food Technology  
**Version:** 2.4.0  
**Authors:** Tanish Bane (@TanishBane) & Rohan Panchal (@panchalrohan44)

---

## 1. Cloud Architecture Topology

NEXFIELD is designed for high-availability, zero-maintenance cloud deployment leveraging modern serverless edge primitives and managed cloud databases:

```mermaid
flowchart TB
    subgraph Client ["Global Users / Mobile Devices"]
        Browser["Web Browser & PWA Clients"]
    end

    subgraph Vercel ["Vercel Edge Network (Global CDN)"]
        EdgeRoute["Edge Routing & Middleware (CVE-2025-29927 Guard)"]
        NextServer["Next.js 15.5 App Router SSR / ISR Engine"]
        StaticAssets["Static Image & Bundle Storage"]
    end

    subgraph BackendHost ["FastAPI Service Cluster (Container / Serverless)"]
        API["FastAPI 0.115 Async Service"]
        ONNXEngine["In-Process ONNX Runtime (CPU Optimized)"]
        ScraperWorker["Background APMC Mandi Sync Worker"]
    end

    subgraph SupabaseCloud ["Supabase Managed Cloud (AWS eu-west-1 / ap-south-1)"]
        AuthService["GoTrue JWT Authentication Service"]
        PostgresDB["PostgreSQL 15 Database Cluster"]
        PostGIS["PostGIS Spatial Extensions"]
        StorageBucket["S3-Compatible Object Storage (Scans & Heatmaps)"]
    end

    Browser <--> EdgeRoute
    EdgeRoute --> NextServer
    NextServer --> StaticAssets
    NextServer <--> API
    NextServer <--> AuthService
    NextServer <--> PostgresDB

    API --> ONNXEngine
    API --> ScraperWorker
    API <--> PostgresDB
    API <--> PostGIS
    API <--> StorageBucket
```

---

## 2. Environment Variables Configuration Matrix

| Variable Name | Required In | Default / Example Value | Description |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Web | `https://nexfield.app` | Canonical public application URL for redirects and metadata. |
| `NEXT_PUBLIC_USE_FIXTURES` | Web | `false` (Prod) / `true` (Dev) | When `true`, frontend loads offline baseline fixtures from `data/fixtures/`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Web & API | `https://xyz.supabase.co` | Supabase project API endpoint. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Web | `eyJhbGciOi...` | Supabase public anonymous key (enforces client RLS). |
| `SUPABASE_SERVICE_ROLE_KEY` | API (Backend) | `eyJhbGciOi...` | High-privilege backend key for admin tasks (NEVER expose to frontend). |
| `DATABASE_URL` | API | `postgresql://postgres:pwd@db.xyz.supabase.co:5432/postgres` | PostgreSQL connection string for SQLAlchemy engine. |
| `JWT_SECRET` | API | `super-secret-hex-string` | Secret key for verifying auth tokens. |
| `MODEL_PATH` | API | `ml/models/fieldsight_foliar_v1.onnx` | Path to compiled ONNX foliar diagnostic model. |
| `PORT` | API | `8000` | FastAPI server listening port. |

---

## 3. Vercel Deployment Guide (Frontend)

1. **Connect Repository:** Import `https://github.com/TanishBane/Nexfield` into Vercel Dashboard.
2. **Build & Development Settings:**
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Leave as `./` (monorepo root).
   - **Build Command:** `pnpm --filter web build`
   - **Output Directory:** `apps/web/.next`
   - **Install Command:** `pnpm install`
3. **Environment Variables:**
   - Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_USE_FIXTURES=false`.
4. **Deploy:** Click **Deploy**. Vercel will build the Next.js App Router application and distribute it across its global Edge Network.

---

## 4. Supabase Setup Guide (Database & Auth)

1. **Create Project:** Initialize a new PostgreSQL project in the Supabase Cloud dashboard.
2. **Enable Spatial Extensions:**
   Run the following query in the Supabase SQL Editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```
3. **Apply Database Migrations:**
   From your local development machine:
   ```powershell
   cd services/api
   alembic upgrade head
   ```
4. **Configure Authentication:**
   - Enable Email/Password authentication in the Supabase Auth settings.
   - Set Site URL to `https://nexfield.app` and Redirect URLs to `https://nexfield.app/auth/callback`.

---

## 5. Continuous Integration & Automation (GitHub Actions)

NEXFIELD executes automated CI workflows on every push and pull request to `main`:

```mermaid
flowchart LR
    Push["Push / Pull Request"] --> CI1["Frontend CI (frontend-ci.yml)"]
    Push --> CI2["Backend CI (backend-ci.yml)"]
    Push --> CI3["Smoke Suite (smoke.yml)"]

    CI1 --> V1["pnpm type-check"]
    CI1 --> V2["pnpm test (Vitest)"]
    CI1 --> V3["pnpm build"]

    CI2 --> P1["pytest (78 tests)"]
    CI2 --> P2["Pydantic validation"]
    CI2 --> P3["ONNX load check"]

    CI3 --> S1["10/10 Smoke Verifications"]
```

### Workflow Summary:
- **`frontend-ci.yml`:** Checks out code, sets up Node.js 20 & pnpm, verifies zero TypeScript compiler errors, runs Vitest unit tests, and verifies successful static and server Next.js build.
- **`backend-ci.yml`:** Checks out code, sets up Python 3.11, installs `services/api/requirements.txt`, executes all 78 pytest tests, and verifies database models.
- **`dependabot.yml`:** Weekly security audits and automated dependency upgrade PRs for npm and pip packages.

---

*Document maintained under NEXFIELD DevOps & Cloud Operations.*
