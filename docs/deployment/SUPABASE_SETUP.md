# NEXFIELD — Supabase Cloud Architecture & Integration Guide

**Document Purpose:** Complete specification and setup runbook for Supabase integration across the NEXFIELD operating system, including Next.js 15 SSR authentication, private foliar image storage, Row-Level Security (RLS) policies, and backend FastAPI coordination for Developer Rohan (@panchalrohan44).

---

## 1. Architectural Role of Supabase in NEXFIELD

Supabase serves three core infrastructure functions for NEXFIELD:
1. **Identity & Authentication Provider:** Manages agronomist and farm operator identity with JWT issuance, PKCE email/password auth, and session cookie lifecycle via `@supabase/ssr`.
2. **PostgreSQL 16 + PostGIS Spatial Database:** Authoritative relational store holding field spatial polygons, crop cycles, sensor telemetry, and mandi market observations. Managed exclusively via SQLAlchemy and Alembic by Developer Rohan.
3. **Private Object Storage:** Dedicated encrypted bucket (`fieldsight-observations`) storing foliar crop disease specimens for FieldSight visual diagnostics.

```mermaid
flowchart LR
    subgraph Client Layer
        Web["NEXFIELD Web (Next.js 15)"]
    end

    subgraph Supabase Platform
        Auth["Supabase Auth\n(JWT Provider)"]
        DB[("PostgreSQL 16\n+ PostGIS")]
        Storage["Private Storage\n(fieldsight-observations)"]
    end

    subgraph Backend Layer
        API["FastAPI Backend\n(Developer Rohan)"]
    end

    Web -- "@supabase/ssr (PKCE)" --> Auth
    Web -- "Signed URLs / User Path" --> Storage
    Web -- "Authorization: Bearer <JWT>" --> API
    API -- "Verify JWT (JWKS / Secret)" --> Auth
    API -- "SQLAlchemy + asyncpg" --> DB
```

---

## 2. Setting Up the Supabase Project

1. Log into the [Supabase Dashboard](https://app.supabase.com) using the project owner account.
2. Click **New Project**:
   - **Name:** `nexfield-dev` (or `nexfield-prod` for production)
   - **Database Password:** Generate a high-entropy string (store securely in team password manager).
   - **Region:** `ap-south-1` (Mumbai) — minimizes latency for Indian agricultural telemetry and APMC Mandi feeds.
   - **Pricing Plan:** Free / Pro Tier.
3. Once provisioned, navigate to **Project Settings > API**:
   - Copy **Project URL** (`https://<project-ref>.supabase.co`).
   - Copy **anon public** key (`eyJhb...`).
   - Copy **service_role** secret (keep strictly server-side; NEVER expose to git or client).

---

## 3. Database & Spatial Extensions (PostGIS)

NEXFIELD requires spatial polygon capabilities for parcel boundaries (`FLD-N01`, `FLD-E04`).

1. In Supabase Dashboard, navigate to **Database > Extensions**.
2. Enable **`postgis`**:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```
3. Enable other essential extensions:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   ```

---

## 4. Private Storage Configuration (`fieldsight-observations`)

FieldSight visual pathology uploads high-resolution foliar images for CNN inference.
**Rule:** Farm imagery must never reside in a public bucket.

1. Navigate to **Storage > Create a new bucket**:
   - **Bucket Name:** `fieldsight-observations`
   - **Public bucket:** **OFF (Private)**
   - **Allowed MIME types:** `image/jpeg, image/png, image/webp`
   - **Max file size:** `10 MB`
2. **Storage Row Level Security (RLS) Policies:**
   Execute the following SQL in **SQL Editor**:
   ```sql
   -- 1. Enable RLS on storage.objects
   -- (Enabled by default in Supabase)

   -- 2. Allow authenticated users to upload only into their own user-scoped directory
   CREATE POLICY "Allow authenticated user foliar uploads"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'fieldsight-observations' AND
     (storage.foldername(name))[1] = auth.uid()::text
   );

   -- 3. Allow users to read their own uploaded specimens
   CREATE POLICY "Allow users to view own foliar specimens"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (
     bucket_id = 'fieldsight-observations' AND
     (storage.foldername(name))[1] = auth.uid()::text
   );

   -- 4. Allow backend service_role full administrative access
   CREATE POLICY "Allow service_role full storage management"
   ON storage.objects FOR ALL
   TO service_role
   USING (true)
   WITH CHECK (true);
   ```

---

## 5. Frontend Next.js 15 SSR Integration

Frontend components access Supabase using `@supabase/ssr` with cookie storage:
- **Browser Client:** [`apps/web/lib/supabase/client.ts`](file:///C:/Nexfield/apps/web/lib/supabase/client.ts)
- **Server Client:** [`apps/web/lib/supabase/server.ts`](file:///C:/Nexfield/apps/web/lib/supabase/server.ts) (supports Next.js 15 async `cookies()`)
- **Session Middleware:** [`apps/web/lib/supabase/middleware.ts`](file:///C:/Nexfield/apps/web/lib/supabase/middleware.ts) & [`apps/web/middleware.ts`](file:///C:/Nexfield/apps/web/middleware.ts)
- **Private Storage Uploader:** [`apps/web/lib/supabase/storage.ts`](file:///C:/Nexfield/apps/web/lib/supabase/storage.ts)
- **Auth Interface:** [`apps/web/app/login/page.tsx`](file:///C:/Nexfield/apps/web/app/login/page.tsx) & PKCE code callback at [`apps/web/app/auth/callback/route.ts`](file:///C:/Nexfield/apps/web/app/auth/callback/route.ts)

### Environment Variables
Configure the following in `.env.local` or Vercel:
```env
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="<anon-key>"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"
```

---

## 6. Handoff Specification for Developer Rohan (@panchalrohan44)

Developer Rohan exclusively owns the FastAPI backend (`services/api/**`), database models, and Alembic migrations.

### A. Database Connection Strings
Supabase provides two connection modes:
1. **Direct Connection (Session Mode — port 5432):**
   Recommended for Alembic migrations and persistent backend services:
   ```env
   DATABASE_URL="postgresql+asyncpg://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?ssl=require"
   ```
2. **Transaction Pooler Connection (Supavisor — port 6543):**
   Recommended for high-concurrency serverless / containerized endpoints:
   ```env
   DATABASE_URL="postgresql+asyncpg://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?ssl=require"
   ```

### B. FastAPI JWT Verification Strategy
When the frontend issues REST requests to FastAPI, it passes the Supabase session token in the HTTP header:
```http
Authorization: Bearer <access_token>
```

FastAPI should verify this token using `PyJWT` or `fastapi-jwt-auth` by either:
1. **JWKS Verification (Recommended / Asymmetric):**
   Fetch public keys from:
   `https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json`
   Validate `aud = "authenticated"` and `iss = "https://<project-ref>.supabase.co/auth/v1"`.
2. **HMAC Secret Verification (Symmetric):**
   Use `SUPABASE_JWT_SECRET` from **Project Settings > API > JWT Secret**:
   ```python
   import jwt
   from fastapi import Depends, HTTPException, Security
   from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

   security = HTTPBearer()

   def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
       token = credentials.credentials
       try:
           payload = jwt.decode(
               token,
               SUPABASE_JWT_SECRET,
               algorithms=["HS256"],
               audience="authenticated"
           )
           user_id: str = payload.get("sub")
           return user_id
       except jwt.PyJWTError:
           raise HTTPException(status_code=401, detail="Invalid Supabase authentication credentials")
   ```

### C. Database Migrations via Alembic
Rohan's Alembic migrations should run against Supabase PostgreSQL:
```bash
cd services/api
alembic upgrade head
```
All table schemas should include `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()` and `user_id UUID REFERENCES auth.users(id)` where user data isolation is required.
