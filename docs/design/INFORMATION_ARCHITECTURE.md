# INFORMATION ARCHITECTURE & NAVIGATION — PROJECT EARTH

**Project:** NEXFIELD — The Agricultural Intelligence Operating System  
**Lead Designer & Architect:** Tanish Bane (@TanishBane)  
**Version:** 2.0.0  
**Status:** Canonical & Active

---

## 1. Global Architectural Duality

NEXFIELD establishes a rigorous architectural separation between two fundamental user contexts:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      NEXFIELD DIGITAL ECOSYSTEM                        │
├───────────────────────────────────┬────────────────────────────────────┤
│         PUBLIC EXPERIENCE         │        WORKSPACE EXPERIENCE        │
│    (Editorial / Marketing / Tour) │   (SaaS / Field Ops / Analytics)   │
├───────────────────────────────────┼────────────────────────────────────┤
│ • PublicNavbar with blur backdrop │ • Uncrowded Collapsible Sidebar    │
│ • Full-bleed narrative sections   │ • Telemetry Header & FastNav (⌘K)  │
│ • Interactive live widget samples │ • Dynamic Breadcrumbs Navigation   │
│ • PublicFooter with open links    │ • Persistent Fixture Indicators    │
│ • No left sidebar; clean reading  │ • Multi-tenant farm switcher       │
└───────────────────────────────────┴────────────────────────────────────┘
```

The unified layout shell in `apps/web/components/layout/AppShell.tsx` dynamically detects the current route and automatically injects the appropriate navigation chrome without layout jitter or content reflow.

---

## 2. Public Experience Sitemap

The public website serves farmers, agronomists, investors, and ADAPPT 5.0 evaluators with deep technical clarity:

| Route | Title | Key Interactive Components | Target Audience |
|---|---|---|---|
| `/` | The Land (Hero & Overview) | GSAP ScrollTrigger, Live Telemetry Ticker, Interactive Leaf Scanner, FAO-56 Slider, Mandi Arbitrage Calculator | All Visitors & Evaluators |
| `/platform` | Architecture & Modules | High-level 6-module architecture matrix & pipeline specs | Agronomists & CTOs |
| `/platform/control` | Command Center Deep-Dive | Vadose telemetry metrics, multi-depth soil strata diagrams | Farm Managers |
| `/platform/fieldsight` | FieldSight AI Diagnostics | Foliar pathology specs, MobileNetV4 vs ResNet-50 benchmarks | Plant Pathologists |
| `/platform/twin` | Digital Twin 3D Simulator | WebGL biophysical mesh rendering specs, Campbell-Norman water flow equations | Irrigation Engineers |
| `/platform/intelligence`| Agronomic Copilot | ICAR advisory knowledge base, retrieval-augmented reasoning | Farm Decision Makers |
| `/platform/operations`  | Farm Operations & Silos | Equilibrium moisture curves, cold chain preservation specs | Post-Harvest Teams |
| `/platform/markets`     | Mandi Arbitrage Engine | Spatial price discovery, freight cost deduction matrix | Agricultural Traders |
| `/how-it-works`         | 5-Stage Agronomic Journey | Observe -> Predict -> Simulate -> Optimize -> Grow loop | General Audience |
| `/solutions`            | Agronomic Challenges | Water Scarcity, Foliar Epidemics, Post-Harvest Spoilage solutions | Farm Owners & Co-ops |
| `/about`                | Team, Mission & Open Code | ADAPPT 5.0 Domain 2 statement, Tanish Bane & Rohan Panchal bios, MIT License | Hackathon Judges |
| `/demo`                 | Interactive Guided Tour | 8-step live walkthrough entry point with Nashik Tomato Estate | All Users |
| `/login`                | Authenticated Portal | Tenant sign-in & Supabase authentication | Registered Tenants |

---

## 3. Workspace Information Architecture

The internal workspace interface is streamlined to eliminate visual noise and reduce cognitive load during high-stakes farm operations.

### Uncrowded Sidebar Categorization:
Previously, the sidebar suffered from repetitive branding prefixes ("NEXFIELD Control", "NEXFIELD Twin", "NEXFIELD FieldSight"). In Project Earth, items are cleanly grouped into three intuitive functional tiers:

```
[OBSERVATION & TWIN]
├── Command Center (/control or /demo/control)
├── FieldSight AI (/fieldsight or /demo/fieldsight)
└── Digital Twin (/twin or /demo/twin)

[INTELLIGENCE & OPS]
├── Agronomic Copilot (/intelligence or /demo/intelligence)
├── Farm Operations (/ops or /demo/ops)
└── Mandi Markets (/markets or /demo/markets)

[DATA & SETTINGS]
├── Data Center (/data-center)
├── Audit Logs (/audit-logs)
└── Workspace Settings (/settings)
```

---

## 4. Universal Keyboard Navigation & Command Palette (`Ctrl+K` / `Cmd+K`)

NEXFIELD implements a state-of-the-art Command Palette (`apps/web/components/navigation/CommandPalette.tsx`) providing sub-second keyboard traversal across the entire application:

- **Shortcut:** `Cmd+K` (macOS) / `Ctrl+K` (Windows & Linux).
- **Global Availability:** Accessible anywhere within both public and workspace views.
- **Search Capabilities:**
  - Jump directly to any of the 6 core modules.
  - Switch between active farm properties or demo estates.
  - Quick-execute actions (e.g., toggle drip irrigation, open foliar leaf scanner, calculate mandi freight).
  - Search documentation, ICAR advisory articles, and system audit logs.

---

## 5. Hierarchical Orientation: Breadcrumbs

Implemented in `apps/web/components/navigation/Breadcrumbs.tsx`, breadcrumbs dynamically compute the location path from the Next.js App Router pathname:

`Workspace > Nashik Tomato Estate > Field Sector 2-B > Digital Twin`

Each crumb is keyboard-focusable, APCA-contrast verified, and provides immediate upward traversal without relying on the browser's back button.

---

## 6. Progressive Disclosure Architecture

To prevent data overwhelm:
1. **Level 1 (Glanceable Summary):** Command Center Farm Hero + Today's 3 Priorities + 94/100 Farm Health Composite Gauge.
2. **Level 2 (Diagnostic Overview):** Six module cards routing to specialized domains.
3. **Level 3 (Deep Sensor Strata):** Collapsible panel revealing NPK chemistry, root-zone matric potential (-33 kPa), 4-stage phenology bar, and verified audit log.
