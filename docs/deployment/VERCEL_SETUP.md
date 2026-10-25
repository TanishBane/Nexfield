# NEXFIELD — Vercel Deployment & Continuous Delivery Guide

**Document Purpose:** Complete specification and runbook for deploying the NEXFIELD Next.js 15 App Router frontend to Vercel within our pnpm monorepo architecture.

---

## 1. Architecture Overview

NEXFIELD is structured as a pnpm workspace monorepo:
```
nexfield/
├── apps/
│   └── web/            <-- Deployed to Vercel
├── packages/
│   ├── contracts/      <-- Shared TypeScript Zod schemas (workspace dependency)
│   └── ui/             <-- Shared React design system (workspace dependency)
├── services/
│   └── api/            <-- FastAPI backend (deployed separately to container cloud)
├── pnpm-lock.yaml      <-- Root monorepo lockfile (v9)
└── pnpm-workspace.yaml
```

**Key Principle:** Vercel deploys only `apps/web` while resolving workspace dependencies from `packages/contracts` and `packages/ui`. The FastAPI backend is never deployed as Next.js API routes.

---

## 2. Vercel Project Configuration

### Connecting via GitHub Integration
1. Log into [Vercel Dashboard](https://vercel.com) using the GitHub account (`@TanishBane`).
2. Click **Add New... > Project** and import the private repository: `TanishBane/Nexfield`.
3. In the **Configure Project** screen, configure the following settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click "Edit" and select: `apps/web`
     *(Vercel automatically detects the root pnpm workspace above `apps/web`)*
   - **Build Command:** Override with:
     ```bash
     pnpm --filter @nexfield/contracts build && pnpm --filter @nexfield/ui build && next build
     ```
   - **Output Directory:** Default (`.next`)
   - **Install Command:** Default (`pnpm install`)
   - **Node.js Version:** `20.x` or `22.x`

---

## 3. Environment Variables Configuration

In **Project Settings > Environment Variables**, configure the following variables across **Production**, **Preview**, and **Development**:

| Variable Name | Environments | Value / Description | Example Value |
|---|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | All | Application Title | `NEXFIELD` |
| `NEXT_PUBLIC_APP_ENV` | Production / Preview | Target Environment | `production` / `preview` |
| `NEXT_PUBLIC_USE_FIXTURES` | All | Enable public agronomic demo mode | `true` |
| `NEXT_PUBLIC_API_BASE_URL` | Optional | Optional Stateless FastAPI URL | `http://localhost:8000` |

> **Public Demo Note:** In public demonstration mode, no Supabase credentials or database URLs are required on Vercel. All 6 core modules render out-of-the-box with domain-accurate agronomic fixtures.

> [!CAUTION]
> **Security Invariant:** Never set `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, or `SUPABASE_JWT_SECRET` in Vercel environment variables. Those are server-only secrets for Developer Rohan's FastAPI backend.

---

## 4. Public Demonstration URL Routing

In public demonstration mode:
- No authentication callbacks or OAuth redirects are required.
- All primary routes (`/control`, `/twin`, `/fieldsight`, `/intelligence`, `/ops`, `/markets`) are served publicly.
- Legacy auth bookmarks (`/login`, `/signup`, `/onboarding`, `/forgot-password`) are cleanly redirected via HTTP 307 middleware to `/control`.
- The official production deployment domain remains: `https://nexfield-agritech.vercel.app`.
  *(Note: `nexfield.vercel.app` is an unrelated third-party gaming domain and must never be referenced).*

---

## 5. Automated CI/CD Workflow with GitHub

- **Production Deployment:** Any merge to the `main` branch automatically builds and deploys to your assigned production URL.
- **Pull Request Previews:** Any pull request branch (e.g. `feature/tanish-frontend` or documentation branches) generates an ephemeral preview deployment with a distinct URL.
- **Vercel Checks:** Deployment status appears as an automatic commit check directly on GitHub pull requests.

---

## 6. Pre-Flight Verification Checklist

Before reporting deployment completion:
- [x] Monorepo dependencies (`@nexfield/contracts`, `@nexfield/ui`) build successfully before `next build`.
- [x] Static pages compile with zero TypeScript errors (`tsc --noEmit`).
- [x] Next.js linting passes with zero errors (`next lint`).
- [x] All 6 module routes (`/control`, `/twin`, `/fieldsight`, `/markets`, `/ops`, `/intelligence`) and `/login` are reachable.
- [x] No private secrets or database connection strings leak into client bundles.
- [x] Offline fallback (`NEXT_PUBLIC_USE_FIXTURES=true`) ensures stable demonstration when the backend API container is restarting or offline.
