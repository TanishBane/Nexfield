# NEXFIELD 2.0 — MASTER DESIGN SYSTEM SPECIFICATION
**Version:** 2.0.0  
**Status:** Canonical & Mandatory across `apps/web` and `packages/ui`  
**Brand Identity:** The Agricultural Intelligence Operating System  
**Design Paradigm:** High-Precision Agronomic Software × Editorial Dignity × Scientific Transparency  

---

## 1. Design Philosophy & Foundations

NEXFIELD 2.0 is built for agriculturalists, precision agronomists, farm enterprise managers, and food-supply-chain analysts. It rejects generic AI SaaS aesthetics (gratuitous purple gradients, glowing neon orbs, decorative ungrounded metrics) in favor of:
1. **Calm Precision:** Deep carbon, obsidian, and forest-black surfaces that reduce eye fatigue during extended field or control-room monitoring.
2. **Editorial Dignity:** Timeless serif typography (`Instrument Serif`) for major public headings balanced with ultra-legible sans-serif typography (`Inter` / system-ui) and tabular numerals (`font-mono tabular-nums`).
3. **Domain Truth & Provenance:** Every metric, prediction, and scenario is explicitly labeled with its scientific origin (e.g., *ONNX Foliar Pathology v1*, *Stewart Water-Yield Model*, *Baseline Agronomic Fixture*).
4. **Concentric Geometry:** Nested radii follow strict mathematical nesting:
   $$r_{\text{inner}} = \max(r_{\text{outer}} - p, 4\text{px})$$
   where $p$ is the inner padding of the container.

---

## 2. Color Palette & Token Architecture

The token system uses a three-layer hierarchy:
`Primitive Tokens (Raw Hex)` → `Semantic Tokens (Role-based CSS Variables)` → `Component Tokens (Scoped to Primitives)`.

### 2.1 Surface Foundations
| Token | Hex | Role | Contrast vs `#090D0B` |
|---|---|---|---|
| `--surface-base` | `#090D0B` | Obsidian Dark Field / App Canvas Background | Base 0:1 |
| `--surface-subtle` | `#0D1410` | Section backgrounds & subtle table rows | Lc ~ 15 |
| `--surface-card` | `#111714` | Primary Card & Panel Container | Lc ~ 25 |
| `--surface-elevated` | `#16201B` | Dropdown menus, popovers, floating toolbars | Lc ~ 35 |
| `--surface-hover` | `#1B2721` | Interactive hover state for cards & list items | Lc ~ 45 |
| `--surface-active` | `#22332A` | Active / Selected tab or sidebar item | Lc ~ 55 |

### 2.2 Borders & Dividers
| Token | Hex | Role |
|---|---|---|
| `--border-subtle` | `#18251E` | Card internal dividers, subtle grid lines |
| `--border-default` | `#203127` | Standard card boundaries, input borders |
| `--border-strong` | `#2E4638` | Hovered cards, active form inputs |
| `--border-focus` | `#10B981` | Keyboard focus ring (`2px offset`) |

### 2.3 Brand Core & Editorial Accents
| Token | Hex | Role | Contrast vs `#090D0B` |
|---|---|---|---|
| `--emerald-primary` | `#10B981` | Brand core, primary actions, positive deltas | 9.8:1 (AAA) |
| `--emerald-bright` | `#34D399` | Hover highlights, active telemetry pulses | 12.4:1 (AAA) |
| `--emerald-forest` | `#163B2A` | Deep container fills, badge backgrounds | 2.5:1 (surfaces) |
| `--wheat-gold` | `#D7B678` | Harvest accent, grain crops, financial realization | 8.9:1 (AAA) |
| `--wheat-warm` | `#F2E5C9` | Editorial text highlights, pill badges | 13.6:1 (AAA) |
| `--wheat-ivory` | `#F9F6ED` | Primary editorial headline text | 15.1:1 (AAA) |

### 2.4 Typography & Text Tokens
| Token | Hex | Role | Contrast vs `#090D0B` |
|---|---|---|---|
| `--text-primary` | `#F1F6F3` | Primary body and card headings | 14.2:1 (AAA) |
| `--text-secondary` | `#9BB1A4` | Subtitles, descriptions, table headers | 6.2:1 (AA) |
| `--text-muted` | `#6D8577` | Captions, secondary timestamps, disabled labels | 4.6:1 (AA minimum) |
| `--text-accent` | `#34D399` | Highlighted values, key agricultural deltas | 12.4:1 (AAA) |

### 2.5 Semantic Status & Domain Signals
| Domain / Role | Text Hex | Background Hex | Border Hex | Icon |
|---|---|---|---|---|
| **Disease / Urgent** | `#FB7185` | `#2A1116` | `#4C1D24` | `AlertTriangle` / `Flame` |
| **Warning / Stress** | `#FBBF24` | `#2B210B` | `#4D3A15` | `AlertCircle` |
| **Hydrology / Moisture** | `#38BDF8` | `#0C2333` | `#163E5C` | `Droplets` |
| **Harvest / Storage** | `#F59E0B` | `#2E220D` | `#543D17` | `Warehouse` / `Wheat` |
| **Spectral / Biology** | `#A78BFA` | `#231536` | `#3F2661` | `Cpu` / `Layers` |
| **Optimal / Health** | `#34D399` | `#0E291C` | `#1C5238` | `CheckCircle2` |

---

## 3. Typography Scale & Font Pairing

1. **Editorial Display Headings (`font-serif`):**
   - Family: `Instrument Serif`, Georgia, serif
   - Weights: 400 (Regular), 400 Italic
   - Scale:
     - Hero H1: `text-4xl sm:text-6xl md:text-7xl` (`line-height: 1.05`)
     - Section H2: `text-2xl sm:text-4xl` (`line-height: 1.15`)
     - Feature H3: `text-xl sm:text-2xl` (`line-height: 1.25`)

2. **Operational Interface & Body (`font-sans`):**
   - Family: `Inter`, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
   - Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
   - Scale:
     - Base Body: `text-sm` (`14px`, `line-height: 1.5`)
     - Lead Text: `text-base sm:text-lg` (`16px-18px`, `line-height: 1.6`)
     - Small Meta: `text-xs` (`12px`, `line-height: 1.4`)
     - Micro Tag: `text-[11px]` (`11px`, `uppercase tracking-wider`)

3. **Telemetry & Computational Figures (`font-mono`):**
   - Family: `JetBrains Mono`, `Fira Code`, monospace
   - Features: `font-variant-numeric: tabular-nums` (prevents visual jumping on live number updates)
   - Applied to: Sensor readings (`41.4% VWC`), coordinates (`30.7046°N`), commodity prices (`₹2,450/q`), timestamps (`18:04:12 UTC`).

---

## 4. Spacing, Geometry & Radius Rules

### 4.1 Spacing Scale
- `space-1` = `4px`
- `space-2` = `8px`
- `space-3` = `12px`
- `space-4` = `16px`
- `space-6` = `24px`
- `space-8` = `32px`
- `space-12` = `48px`
- `space-16` = `64px`

### 4.2 Concentric Radii Law
- Outer Panel / Modal / Bento Shell: `rounded-3xl` (`24px`) with `p-6` (`24px`) → Inner elements: `rounded-xl` (`12px`) or `rounded-lg` (`8px`).
- Standard Card: `rounded-2xl` (`16px`) with `p-4` (`16px`) → Inner badges/buttons: `rounded-lg` (`8px`).
- Compact Item / Table Row: `rounded-lg` (`8px`) with `p-2` (`8px`) → Inner pills: `rounded-md` (`6px`).
- Badges & Status Pills: `rounded-full` (`9999px`) or `rounded-md` (`6px`).

---

## 5. Global Shell Architecture

### 5.1 Desktop Layout (`>= 1024px`)
- **Left Navigation Rail:** `w-64` (`256px`), fixed position, obsidian charcoal background with emerald branding, 6 unified module links with active state indicator, quick farm overview summary, and ADAPPT competition badge.
- **Top Header Bar:** `h-16` (`64px`), fixed sticky top, border-b with subtle green border, contains:
  1. Breadcrumbs path navigation.
  2. Synchronized Farm & Estate Selector (persists across all 6 modules).
  3. Global Command Palette (`⌘K` / `Ctrl+K`).
  4. Work Orders Task Drawer trigger with pending count pill.
  5. Demo Mode Transparency Badge & Reset Demo button.
- **Main Canvas:** `ml-64 pt-16 min-h-screen`, responsive container with max-width `max-w-7xl` or full-width dashboard layouts, with `p-6 lg:p-8`.

### 5.2 Mobile & Tablet Layout (`< 1024px`)
- **Top Mobile Header:** `h-14` (`56px`), streamlined with NEXFIELD brand, active farm badge, and slide-out navigation menu trigger.
- **Bottom Navigation Bar (`< 768px`):** Fixed bottom `h-16`, 5 core touch targets (`Overview`, `FieldSight`, `Twin 3D`, `Ops`, `Menu`) with safe area inset padding.
- **Slide-out Navigation Drawer:** Full-height drawer for accessing all 6 modules, Guided Demo, Data Center, Command Palette, and Demo State Reset.

---

## 6. The Six Re-engineered Product Workspaces

1. **NEXFIELD Control (`/control`):**
   - High-density operational bento-grid.
   - Estate Header: Synchronized farm identity, GPS coordinates, weather microclimate, and live telemetry timestamp.
   - Agronomic Priority Alerts: Dismissible high-urgency notifications with direct "Investigate" deep links.
   - Farm at a Glance: 4 standardized metric cards (Active Crop Cycle, Rootzone VWC %, Pending Work Orders, Storage Custody).
   - Spatial Parcel Matrix: Interactive field parcel breakdown with health index meters and crop phenology stage.
   - Quick Action Dispatch: One-click actions to run FieldSight analysis, open 3D Twin, dispatch work order, or review mandi arbitrage.

2. **FieldSight AI (`/fieldsight`):**
   - Dual-column clinical inspection studio.
   - Left Column: Specimen Inspection Frame with image upload, specimen selector gallery (Wheat Stripe Rust, Tomato Early Blight, Potato Late Blight, Healthy Foliage), and interactive Split Comparison Slider (Raw Macro Specimen vs Grad-CAM Pathological Heatmap).
   - Right Column: Diagnostic Analysis Report with classified condition, calibrated confidence score, pathogen taxon, morphological symptom checklist, and ICAR-aligned chemical/biological intervention protocols.

3. **NEXFIELD Twin (`/twin`):**
   - Interactive 3D WebGL biophysical field parcel viewer powered by Three.js / React Three Fiber / Drei.
   - Multi-layer visualization toggle: Soil Moisture Cutaway, Canopy NDVI Vigour, and Drip Irrigation Coverage.
   - Graceful 2D Elevation Fallback: Robust SVG/Canvas subterranean soil horizon cutaway when WebGL context is unavailable.
   - Parametric Scenario Controls: Target Irrigation Volume ($m^3/\text{ha}$), Split Nitrogen Top-Dressing ($kg\text{ N/ha}$), and Biostimulant Spray toggle.
   - Counterfactual Scenario Matrix: Side-by-side comparison table showing Baseline vs Deficit vs Optimized Precision scenarios with water savings ($L$) and yield deltas ($MT$).

4. **NEXFIELD Intelligence (`/intelligence`):**
   - Grounded conversational agronomic copilot.
   - State-synchronized Contextual Knowledge: Dynamically reflects the selected farm estate (Nashik Tomato vs Ludhiana Wheat), active growth stage, and sensor telemetry.
   - Starter Prompt Cards: Pre-computed domain queries for disease risk, irrigation withholding, mandi price arbitrage, and grain storage.
   - Interactive Tool Call Cards: Visual representation of tool execution states (Telemetry Query, Disease Saliency Lookup, Mandi Spread Calculation).
   - Collapsible Right Telemetry Rail: Live sensor context and ICAR citation references.

5. **NEXFIELD Ops (`/ops`):**
   - Agricultural workforce dispatch, stock ledger, and post-harvest food storage quality workspace.
   - Dual-mode Task View: Switchable between Structured Work Order List and Kanban Stage Board (Todo, In Progress, Completed).
   - Agrochemical Inventory Ledger: Stock tracking with visual reorder threshold meters and low-stock warnings.
   - Food Quality & Storage Custody: Grain silo equilibrium moisture tracking ($<14\%$) to prevent Aspergillus flavus aflatoxin contamination, and cold storage chilling-injury temperature monitoring.
   - Work Order Creation Modal: Modal to add customized tasks with category, priority, due date, and estimated budget.

6. **NEXFIELD Markets (`/markets`):**
   - Wholesale APMC mandi price arbitrage intelligence.
   - Terminal Mandi Spread Cards: Gross modal prices vs Net realization for nearby regional yards (Khanna, Rajpura, Sirhind, Nashik, Pimpalgaon).
   - Real-time Net Realization Calculator: Interactive freight cost engine deducting distance haulage, diesel freight rates, loading labor, and APMC market cess from gross sale value.
   - Interactive Mandi Proximity Radar: Visual distance-and-price matrix illustrating economic radius.
   - Historical Mandi Price Trend Chart: Clean ECharts line trajectory comparing actual modal price against Government Minimum Support Price (MSP).

---

## 7. Accessibility, Motion & Quality Invariants

1. **WCAG 2.2 AA Contrast Compliance:** All normal text exceeds 4.5:1; large headings and key data highlights exceed 7.0:1.
2. **Keyboard Traversal & Focus Indicators:** Every button, tab, slider, and input features `focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090D0B]`.
3. **Reduced Motion Respect (`prefers-reduced-motion`):** Ambient background drifts, 3D rotations, and card entrance animations automatically disable when reduced motion is requested.
4. **Zero-Login Integrity:** Preserves seamless, instant access for judges, evaluators, and public visitors without authentication roadblocks.
