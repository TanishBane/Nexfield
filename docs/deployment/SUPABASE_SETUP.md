# NEXFIELD — Supabase Cloud Architecture & Authentication Runbook

**Project:** NEXFIELD — The Agricultural Intelligence Operating System  
**Positioning:** Observe. Predict. Simulate. Optimize. Grow.  
**Repository:** `https://github.com/TanishBane/Nexfield`  
**Owner:** Tanish Bane (@TanishBane) & Rohan Panchal (@panchalrohan44)  
**Status:** PRODUCTION READY

---

## 1. Architectural Overview

NEXFIELD employs an enterprise-grade Supabase authentication and identity architecture:
1. **Next.js 15.5 App Router SSR Authentication (`@supabase/ssr`):** Cookie-backed PKCE session lifecycle supporting email/password registration, email verification, Google OAuth, password recovery, and middleware token refresh.
2. **Multi-Tenant Agronomic Isolation:** Protected SaaS modules (`/control`, `/twin`, `/fieldsight`, `/intelligence`, `/ops`, `/markets`, `/data-center`) strictly require active sessions and authorized farm IDs. Unauthenticated visitors are routed to `/login?redirectTo=...`.
3. **Dedicated Public Demo Mode (`/demo/*`):** Zero-friction public preview workspace backed by domain-accurate synthetic agronomic fixtures (`data/fixtures/`) and clear fixture indicators.
4. **FastAPI Authorization Barrier:** FastAPI routes validate Supabase bearer JWTs against the Supabase Auth verification endpoint (`/auth/v1/user`), enforcing row-level farm ownership (`Farm.owner_id == user_id`).

```mermaid
flowchart TD
    subgraph Frontend ["NEXFIELD Web (Next.js 15.5 App Router)"]
        Login["/login\n(Google OAuth & Email/Pass)"]
        Forgot["/forgot-password\n(Recovery Email)"]
        Update["/update-password\n(Argon2 / bcrypt)"]
        Callback["/auth/callback\n(PKCE Code Exchange)"]
        Protected["Protected SaaS Hub\n(/control, /twin, /ops...)"]
        Demo["Public Demo Hub\n(/demo/*)"]
    end

    subgraph SupabasePlatform ["Supabase Cloud Platform"]
        AuthSvc["Supabase Auth\n(PKCE + Google OAuth)"]
        CookieHydration["@supabase/ssr\n(Session Cookies)"]
        Storage["Private Storage\n(fieldsight-observations)"]
        Postgres[("PostgreSQL 16\n+ PostGIS Spatial")]
    end

    subgraph Backend ["FastAPI API Service (Developer Rohan)"]
        Verify["auth.py / get_principal\n(Verify Bearer Token)"]
        OpsRouter["ops.py / twin.py / intelligence.py\n(Tenant Ownership Invariants)"]
    end

    Login -- "OAuth PKCE / Password" --> AuthSvc
    Forgot -- "resetPasswordForEmail" --> AuthSvc
    AuthSvc -- "Redirect ?code=..." --> Callback
    Callback -- "exchangeCodeForSession" --> CookieHydration
    CookieHydration -- "Enforce Session" --> Protected
    Protected -- "Authorization: Bearer <JWT>" --> Verify
    Verify -- "user_id Principal" --> OpsRouter
    OpsRouter --> Postgres
```

---

## 2. Environment Variables Configuration

### A. Frontend (`apps/web/.env.local` & Vercel)
```env
NEXT_PUBLIC_APP_NAME="NEXFIELD"
NEXT_PUBLIC_APP_ENV="production"
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"

# Set to 'false' in production with live Supabase & FastAPI
NEXT_PUBLIC_USE_FIXTURES="false"

# Supabase Client Credentials (Public / Safe for Browser SDK)
NEXT_PUBLIC_SUPABASE_URL="https://<your-project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-supabase-anon-key>"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="<your-supabase-anon-key>"
```

### B. Backend (`services/api/.env` - Server Only)
```env
API_PORT=8000
API_HOST="0.0.0.0"
DEBUG=false

# Supabase Server Secrets (NEVER expose to frontend)
SUPABASE_URL="https://<your-project-ref>.supabase.co"
SUPABASE_ANON_KEY="<your-supabase-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<your-service-role-secret-key>"
SUPABASE_JWT_SECRET="<your-jwt-secret-from-dashboard>"

# PostgreSQL Connection String with PostGIS
DATABASE_URL="postgresql+asyncpg://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?ssl=require"
```

---

## 3. Google OAuth 2.0 Integration Checklist

### Step 1: Google Cloud Console Configuration
1. Navigate to the [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Configure the **OAuth Consent Screen**:
   - User Type: **External**
   - App Name: `NEXFIELD`
   - User Support Email: your team email
   - Developer Contact Email: your team email
3. Create an **OAuth 2.0 Client ID**:
   - Application Type: **Web application**
   - Name: `NEXFIELD Web Client`
   - **Authorized JavaScript Origins:**
     - `http://localhost:3000` (Local development)
     - `https://nexfield-agritech.vercel.app` (Official Vercel production deployment)
   - **Authorized Redirect URIs:**
     - `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
4. Copy the generated **Client ID** and **Client Secret**.

### Step 2: Supabase Dashboard Provider Setup
1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and navigate to your project.
2. Go to **Authentication > Providers > Google**.
3. Toggle Google to **Enabled**.
4. Paste the **Client ID** and **Client Secret** obtained from Google Cloud Console.
5. Click **Save**.

### Step 3: Supabase URL Configuration (Redirects & Origins)
1. In the Supabase Dashboard, go to **Authentication > URL Configuration**.
2. Set **Site URL** to:
   ```
   https://nexfield-agritech.vercel.app
   ```
3. In **Redirect URLs**, add the following allowlisted patterns:
   - `http://localhost:3000/**`
   - `http://localhost:3000/auth/callback`
   - `https://nexfield-agritech.vercel.app/**`
   - `https://nexfield-agritech.vercel.app/auth/callback`
4. Click **Save**.

---

## 4. Authentication Routing & Security Invariants

| Route | Access Policy | Behavior |
|---|---|---|
| `/` | Public | Editorial landing page & positioning manifesto |
| `/demo/*` | Public | Zero-auth interactive demo workspace backed by fixtures |
| `/login` | Public | 2-column authentication portal (Google OAuth + Email/Pass). If already authenticated, redirects to `/control`. |
| `/forgot-password` | Public | Dispatches single-use PKCE recovery email |
| `/update-password` | Auth Recovery | Validates recovery session token and updates password via Argon2 / bcrypt |
| `/auth/callback` | Server Route | Exchanges PKCE `code` or OTP `token_hash` for session; validates `next` parameter against open redirects |
| `/onboarding` | Protected | Multi-step farm provisioning requiring authenticated session; acquires real device GPS coordinates or district centroid |
| `/control`, `/twin`, `/fieldsight`, `/ops`, `/markets`, `/intelligence`, `/data-center` | Protected | Strictly requires validated Supabase JWT session cookie; unauthenticated users redirect to `/login?redirectTo=...` |

### Open Redirect Defense
The OAuth callback route (`apps/web/app/auth/callback/route.ts`) strictly sanitizes the `next` query parameter:
- Only relative paths starting with a single forward slash (`/`) are accepted.
- Protocol-relative URLs (`//attacker.com`) are stripped and reset to `/control`.
- Backslash bypass attempts (`\attacker.com`, `/\attacker.com`) are stripped.
- Explicit URI schemes (`https:`, `http:`, `javascript:`, `data:`) are stripped.
- Fallback default: `/control`.

---

## 5. Storage Row-Level Security (RLS)

The private bucket `fieldsight-observations` stores foliar disease specimens for CNN inference.
Execute this policy in the Supabase SQL Editor:

```sql
-- 1. Ensure private bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fieldsight-observations',
  'fieldsight-observations',
  false,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Allow authenticated users to upload into their own folder
CREATE POLICY "Allow authenticated user foliar uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'fieldsight-observations' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Allow users to read their own uploaded foliar specimens
CREATE POLICY "Allow users to view own foliar specimens"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'fieldsight-observations' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 6. Verification & Automated Test Runbook

Execute the complete test suite to verify full-stack invariant integrity:

```bash
# 1. Type check all TypeScript packages
pnpm type-check

# 2. Run Vitest unit tests (storage & auth invariants)
pnpm test

# 3. Run FastAPI backend unit tests (auth & tenant isolation)
py -m pytest services/api

# 4. Run Playwright End-to-End browser authentication tests
node tests/test-auth-flows.js

# 5. Build Next.js production bundle
pnpm --filter web build
```
