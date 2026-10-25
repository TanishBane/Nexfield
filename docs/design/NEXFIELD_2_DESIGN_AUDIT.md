# NEXFIELD 2.0 — COMPREHENSIVE PRODUCT DESIGN AUDIT
**Date:** October 25, 2026  
**Auditor:** Principal Product Designer, Senior Frontend Architect & QA Lead (Antigravity)  
**Target:** NEXFIELD — The Agricultural Intelligence Operating System  
**Baseline Live Deployment:** https://nexfield-agritech.vercel.app  
**Starting Commit:** `a911135cafcceaed94b2d6bc9d17195261364ee8`

---

## 1. Existing Architecture Overview

NEXFIELD is structured as a pnpm monorepo containing:
- `apps/web`: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Zustand client stores (`useDemoStore`), TanStack React Query, Three.js / React Three Fiber / Drei, ECharts, Lucide icons, and GSAP.
- `packages/contracts`: Zod schema definitions (`@nexfield/contracts`) defining canonical entity DTOs for Farms, Fields, Crop Cycles, Soil Metrics, Telemetry, Simulation Scenarios, Diagnostics, Market Prices, and Task Work Orders.
- `packages/ui`: Design tokens and foundational UI components (`@nexfield/ui`), including buttons, cards, status badges, metric cards, and input primitives.
- `services/api`: FastAPI Python backend for high-performance ONNX foliar disease diagnostic inference (`services/api/fieldsight.py`), biophysical crop simulation modeling (`services/api/twin.py`), and market analytics, operating in zero-login public demonstration mode.

---

## 2. Complete Route Inventory

| Route | Role / Scope | Rendering Mode | Current Visual / UX Assessment |
|---|---|---|---|
| `/` | Public Homepage & Brand Story | Static / ISR | Editorial serif typography, subtle ambient background, high-level metrics ticker. **Flaws:** Ticker text wraps awkwardly ("₹2,450 / qtl" split across lines, truncated "VADOSE MATRIX POTE..."). 3 competing CTAs in hero. |
| `/platform` | Architectural Overview | Static | Informative overview of 6 modules. Needs interactive architecture diagram and deeper visual hierarchy. |
| `/how-it-works` | 5-Step Agronomic Journey | Static | Clean vertical timeline of agronomic loop. Step cards feel generic and lack live interactive previews. |
| `/about` | Mission, Science & ICAR Context | Static | Text-heavy editorial layout. Needs team, scientific credentials, and technology pedigree cards. |
| `/solutions` | Farm Types & Enterprise Profiles | Static | Static feature comparison matrix. Needs interactive farm-scale configurator. |
| `/demo` | Guided Evaluator Tour (7 Steps) | Client | Interactive step carousel. Navigating sends user to full modules but lacks in-place walkthrough overlay. |
| `/control` | Command Center (Module 1) | Client | Operational dashboard with farm switcher, telemetry HUD, alerts, quick actions. **Flaws:** Farm selector header ("Nashik") does not match active card state ("GreenValley Ludhiana"). Monospace metrics have inconsistent vertical rhythm. Empty space below quick actions. |
| `/fieldsight` | FieldSight AI (Module 2) | Client | Foliar pathology studio with ONNX inference & Grad-CAM. **Flaws:** Specimen inspection displays generic SVG icon rather than real pathological foliage photography. No interactive zoom/pan or split-view comparison slider. Empty dashed upload container dominates view. Sidebar still labeled "Crop Health". |
| `/twin` | 3D Biophysical Twin (Module 3) | Client | Three.js WebGL parcel simulation with Stewart water-yield modeling. **Flaws:** Canvas turns black when WebGL context fails in headless/constrained environments; lacks rich 2D interactive canvas fallback. Sliders lack side-by-side scenario comparison table. Cut off on mobile. |
| `/intelligence` | Agronomic Copilot (Module 4) | Client | Conversational LLM copilot grounded in farm telemetry. **Flaws:** Critical context mismatch: chat message hardcoded to Punjab / Wheat while right context panel displays Nashik / Tomato. Tools list is static/non-interactive. No message export or feedback actions. Sidebar labeled "Insights". |
| `/ops` | Farm Operations & Stock (Module 5) | Client | Task work orders, chemical inventory ledger, expenses, harvest custody. **Flaws:** Stat card text truncates and overlaps badge ("Seed, chemical &..." overlaps "Burn Rate Normal"). Work orders display duplicate title and description. Lacks Kanban board view and harvest storage quality telemetry. |
| `/markets` | APMC Market Intelligence (Module 6) | Client | Mandi price arbitrage, net realization engine, freight models. **Flaws:** Historical price chart title overlaps with subtitle ("Market: Khanna Mandi"). Legend dots overlap price axis numbers. Calculation panel truncated on desktop. Lacks spatial mandi yard proximity radar. |
| `/data-center` | Synthetic Fixture Inspector | Client | Data table view of local fixtures. Plain styling. |
| `/demo/control` .. `/demo/markets` | Guided Sub-Routes | Client | Mirror modules wrapped with Guided Demo floating step drawer. |

---

## 3. Shared Components and Reusable Patterns

Existing shared assets in `apps/web/components`:
1. `layout/Header.tsx`: Top bar with farm selector dropdown, Command Palette trigger (`⌘K`), Tasks badge, Demo Mode indicator, and Reset Demo modal.
2. `layout/Sidebar.tsx`: Left rail navigation with 6 core modules, farm data link, and ADAPPT competition badge.
3. `layout/AppShell.tsx`: Responsive shell wrapping workspace routes with top header, sidebar, and contextual task drawer.
4. `layout/MobileNavBar.tsx`: Bottom navigation bar for mobile devices (`390px` - `768px`).
5. `layout/ContextualTaskDrawer.tsx`: Slide-over drawer for viewing active tasks and rapid task completion.
6. `navigation/CommandPalette.tsx`: `cmdk`-based dialog for quick navigation across modules and actions.
7. `branding/NexfieldLogo.tsx`: SVG brand mark with seed/sprout geometry.
8. `demo/DemoBanner.tsx`: Persistent fixture indicator ensuring zero-login transparency.

---

## 4. Visual Inconsistencies and Their Locations

1. **Module Naming Mismatch:**
   - Sidebar displays: `Overview`, `Crop Health`, `Digital Twin`, `Insights`, `Operations`, `Markets`.
   - Page Titles display: `Command Center`, `FieldSight AI`, `NEXFIELD Twin`, `NEXFIELD Intelligence`, `NEXFIELD Ops`, `NEXFIELD Markets`.
   - Breadcrumbs display: `Command Center`, `Crop Inspection Studio`, `Digital Twin 3D`, `Agronomic Copilot`, `Farm Operations`, `Mandi Arbitrage`.
   - *Fix:* Unify terminology into a cohesive hierarchy: Primary Brand Name (`NEXFIELD Twin`), Functional Descriptor (`3D Biophysical Simulator`), and consistent navigation labels.

2. **Telemetry Bar Clipping & Awkward Wrapping (`/`):**
   - In `apps/web/components/branding/CinematicEntrance.tsx` and `MetricTickerBar.tsx`:
   - "₹2,450 / qtl" wraps "qtl" to line 2.
   - "VADOSE MATRIX POTE..." truncates text.
   - *Fix:* Use responsive flex-wrap containers with min-width clamping, abbreviated units (`₹2,450/q`), and standard tooltip disclosure for extended descriptions.

3. **Metric Card Label Overlap (`/ops`):**
   - In `apps/web/app/ops/page.tsx`, the subtitle paragraph overlaps the badge component on desktop `1440px`.
   - *Fix:* Use dedicated flex-col layout with `justify-between` and proper vertical spacing.

4. **Chart Title & Legend Collision (`/markets`):**
   - In `apps/web/components/modules/markets/MarketTrendChart.tsx`, the chart title and subtitle collide with the ECharts legend and y-axis tick labels.
   - *Fix:* Reconfigure ECharts grid padding (`top: 60`, `left: 55`, `right: 25`, `bottom: 40`), reposition legend below title, and enable responsive SVG rendering.

5. **Inconsistent Border Radius and Nested Radii:**
   - Some cards use `rounded-2xl` (`16px`) with inner buttons at `rounded-xl` (`12px`), while others use `rounded-lg` with `rounded-md`.
   - *Fix:* Apply concentric radii rule: $r_{\text{inner}} = \max(r_{\text{outer}} - \text{padding}, 4\text{px})$.

---

## 5. Functional Issues Discovered During Inspection

1. **Farm Context Desynchronization (`/control` and `/intelligence`):**
   - When switching farms via the header dropdown, `/intelligence` retains hardcoded Punjab text in the initial assistant message while the context sidebar displays Maharashtra.
   - `/control` overview card doesn't immediately reflect farm coordinate changes in some client renders.
   - *Fix:* Connect the initial message generator and overview cards directly to Zustand reactive state (`activeFarm = useDemoStore((s) => s.farms.find(f => f.id === s.activeFarmId))`).

2. **FieldSight AI Specimen Image Deficiency (`/fieldsight`):**
   - The inspection frame displays a blank SVG leaf icon instead of realistic photographic specimens with actual foliar pathology.
   - *Fix:* Provide an interactive specimen library with high-resolution macro foliar samples (Wheat Stripe Rust, Tomato Early Blight, Potato Late Blight, Healthy Wheat) and interactive overlay comparison (raw image vs Grad-CAM heatmap).

3. **Digital Twin WebGL Failure & Fallback (`/twin`):**
   - When WebGL is disabled or fails to initialize, the viewport remains an empty black box without explanatory messaging or a 2D topographic/soil cutaway fallback.
   - *Fix:* Implement graceful WebGL detection with an interactive 2D SVG/Canvas agronomic field elevation cutaway fallback.

4. **Missing Task Management Features (`/ops`):**
   - Task list is purely a flat list without a Kanban view, task priority filtering, or due date sorting.
   - *Fix:* Implement dual-mode view (List / Kanban Board), quick status toggling, and complete work order creation modal.

5. **Markets Realization Calculation Transparency (`/markets`):**
   - Transport calculation doesn't clearly display formula steps (Gross Revenue minus Mandi Cess minus Diesel Freight minus Loading Labor).
   - *Fix:* Add an interactive step-by-step realization breakdown card with interactive sliders for distance, freight rate, and vehicle tare.

---

## 6. Accessibility Deficiencies (WCAG 2.2 AA)

1. **Contrast Deficits on Subtitles:**
   - Text color `#63796E` against `#090D0B` yields a contrast ratio of ~3.8:1, failing WCAG AA (4.5:1 for normal text).
   - *Fix:* Upgrade muted secondary text tokens to `#9BB1A4` (6.2:1) and secondary titles to `#CADCD1` (10.5:1).

2. **Interactive Elements Without Visible Focus Rings:**
   - Several custom buttons and tab pills omit `focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2`.
   - *Fix:* Standardize all clickable primitives to include consistent, high-visibility focus indicators.

3. **Keyboard Accessibility in Modals and Drawers:**
   - Escape key does not consistently dismiss the `ContextualTaskDrawer` or `FarmProfileModal`.
   - *Fix:* Add `useEffect` event listeners for `Escape` key handling and focus restoration.

4. **Color-Only Status Indicators:**
   - Some risk badges rely purely on red/amber color without text labels or distinct icons.
   - *Fix:* Combine icons (AlertTriangle, CheckCircle, Info), text labels, and semantic colors.

---

## 7. Responsive Layout Problems

1. **Mobile Header Overcrowding (`390px`):**
   - The top header attempts to render navigation tabs, search trigger, and farm selector simultaneously, resulting in horizontal clipping.
   - *Fix:* On mobile viewports (`< 768px`), simplify the top header to: Brand Logo + Active Farm Badge + Hamburger / Drawer trigger. Move search, tasks, and reset demo into the slide-out navigation drawer.

2. **Mobile Digital Twin Sliders Cut Off:**
   - Twin simulation parameters on mobile push the 3D canvas out of view, forcing deep vertical scrolling.
   - *Fix:* Implement an intuitive tabbed layout on mobile: `[3D Scene] [Parameters] [Outcomes]`.

3. **Mobile Table Horizontal Scrolling:**
   - Operations stock ledger and market prices clip off-screen without scroll hints.
   - *Fix:* Implement custom card layouts for mobile while preserving horizontal scroll containers with scroll affordance shadows.

---

## 8. Existing Features That Must Be Preserved

1. **Zero-Login Public Demo Architecture:** No login barriers, no fake auth headers, pure client-side persistence via `localStorage` (`nexfield-demo-v1`).
2. **FieldSight AI SSRF & Payload Protection:** Strict IP validation, DNS resolution checks, streaming 10 MB limit, and format verification in `services/api/fieldsight.py`.
3. **Stateless Stewart Water-Yield Biophysical Simulation:** Monotonic crop yield response formulas ($K_y = 1.05$) in `services/api/twin.py`.
4. **Data Provenance & Contract Truth:** Clear visual labels distinguishing baseline fixtures (`isFixture: true`) from live model inference.
5. **Brand Color Palette Foundations:** Obsidian charcoal (`#090D0B`), Card surfaces (`#111714`), Emerald (`#10B981`), Wheat Gold (`#D7B678`), Ivory text (`#F1F5F2`).

---

## 9. Current Design Strengths Worth Retaining

1. **Atmospheric Dark Palette:** Deep botanical tones feel serious, scientific, and premium.
2. **Editorial Serif Accents:** `Instrument Serif` for hero display headings brings distinction from generic SaaS.
3. **Tabular Numerals (`font-mono tabular-nums`):** Prevents layout jitter during live telemetry updates.
4. **Rich Agronomic Domain Accuracy:** Real ICAR wheat/tomato varieties (HD-3086, Abhinav F1), specific mandis (Khanna, Rajpura, Nashik), and physiological metrics (VWC %, VPD, leaf temperature, transpiration).

---

## 10. Prioritized Implementation Strategy

1. **Phase 2 (Design System):** Upgrade tokens, create comprehensive component library in `packages/ui` and `apps/web/components/ui/2.0`.
2. **Phase 3 (Global Shell):** Re-architect desktop and mobile shells, top bar, sidebar, command palette, and unified notifications.
3. **Phase 4 (Public Website):** Redesign Homepage, About, How It Works, Platform, Solutions, and Guided Demo.
4. **Phase 5–10 (Six Core Modules):** Transform Control, FieldSight, Twin, Intelligence, Ops, and Markets into enterprise-grade workspaces.
5. **Phase 11–13 (Refinement & Verification):** Test all viewports, execute Vitest, Playwright E2E, TypeScript, and ESLint, commit in logical phases, push to `feat/nexfield-2-enterprise-ui-overhaul`, and open PR #64.
