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
| `NEXT_PUBLIC_USE_FIXTURES` | Preview / Staging | Enable synthetic agronomic fallback | `true` (set `false` when live API linked) |
| `NEXT_PUBLIC_SUPABASE_URL` | All | Supabase Project REST Endpoint | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | All | Supabase Client Public Key | `eyJhb...` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Supabase Client Public Key (alias) | `eyJhb...` |
| `NEXT_PUBLIC_API_BASE_URL` | Production | Live FastAPI Container URL | `https://api.nexfield.ag` |
| `NEXT_PUBLIC_API_BASE_URL` | Preview | Staging FastAPI URL / Local Mock | `https://api-staging.nexfield.ag` |

> [!CAUTION]
> **Security Invariant:** Never set `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, or `SUPABASE_JWT_SECRET` in Vercel environment variables. Those are server-only secrets for Developer Rohan's FastAPI backend.

---

## 4. Supabase Auth Redirect URI Configuration

For authentication callbacks (email confirmations, OAuth, and magic links) to function across deployments:

1. Navigate to **Supabase Dashboard > Authentication > URL Configuration**.
2. **Site URL:**
   Set to the production Vercel domain:
   ```
   https://nexfield.vercel.app
   ```
3. **Redirect URLs:**
   Add the following patterns to allow local and preview environments:
   ```
   http://localhost:3000/**
   https://nexfield.vercel.app/**
   https://*-tanishbane.vercel.app/**
   ```
   *(The wildcard pattern matches unique pull-request preview branches automatically created by Vercel).*

---

## 5. Automated CI/CD Workflow with GitHub

- **Production Deployment:** Any merge to the `main` branch automatically builds and deploys to the production URL (`https://nexfield.vercel.app`).
- **Pull Request Previews:** Any pull request branch (e.g. `chore/tanish-cloud-infrastructure` or feature branches) generates an ephemeral preview deployment with a distinct URL.
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
