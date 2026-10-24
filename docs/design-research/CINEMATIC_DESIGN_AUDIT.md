# NEXFIELD Cinematic Design Audit

## 1. Current Design System Tokens

The existing application relies on a strictly defined set of tokens (`packages/ui/src/tokens.ts` and `apps/web/app/globals.css`).

- **Backgrounds:** `Obsidian Dark Field` (#090D0B) serves as the primary canvas. Cards and elevated surfaces use slightly lighter shades (`#111714` and `#1B2620`).
- **Typography:** The text colors are designed for high APCA contrast. Primary text is `#F0F5F2` (Lc > 90), supported by secondary `#9BB1A4` and muted `#63796E`. Tabular figures (`tabular-nums`) are enforced for telemetry data to prevent layout shift during updates.
- **Brand Colors:** The primary action color is `Emerald Core` (#10B981), with brighter (`#34D399`) and darker (`#059669`) variants for interaction states.
- **Semantic Colors:** Explicit palettes exist for domain-specific states (disease, warning, hydrology, harvest, spectral), combining text, background, and border colors for consistent badging and alerts.
- **Geometry:** Border radii follow a strict concentric nesting rule: `child_r <= parent_r - gap`. The base card radius is `12px` (0.75rem).

## 2. Identified Navigation and Visual-Hierarchy Problems

Based on the prompt and project structure (`apps/web/app/`), the current routing includes: `auth`, `control`, `data-center`, `demo`, `fieldsight`, `intelligence`, `login`, `markets`, `onboarding`, `ops`, and `twin`.

**Key Issues:**
1. **Flat Architecture:** The current structure suggests a flat or overwhelming top-level navigation. Agricultural SaaS platforms often suffer from "dashboard fatigue" where too many complex tools (FieldSight, Twin, Markets, Control) are presented simultaneously.
2. **Lack of Cinematic On-Ramp:** The transition from a public marketing state to an authenticated, data-dense workspace requires a smoother, more editorial "cinematic" approach. The current application likely drops users straight into dense telemetry.
3. **Information Density:** High-contrast dark themes with complex data (charts, 3D canvases) need significant negative space to breathe. The current structure implies a need for "progressive disclosure," revealing advanced tools only when necessary.
4. **Mobile Experience:** Complex 3D digital twins and large ECharts dashboards typically degrade poorly on mobile without a dedicated minimal navigation strategy.

## 3. Cinematic Redesign Goals

To elevate NEXFIELD into a sophisticated, cinematic agricultural OS:

- **Editorial Composition:** Introduce larger, more expressive typography for high-level farm metrics, acting as "chapter headings" before diving into dense data tables.
- **Warm Ivory & Gold Accents:** While respecting the existing charcoal and emerald palette, introduce subtle warm ivory (for primary display text) and gold accents (for premium/critical alerts or AI insights) to break the monochromatic green/black feel and add a "cinematic" warmth.
- **Spatial Navigation:** Move away from standard top-bars to spatial navigation panels (e.g., floating sidebars or contextual bottom sheets on mobile) that float above the 3D Digital Twin and data layers.
- **Guided Workspaces:** Separate the experience into distinct mental models: The "Overview" (Hero/Cinematic), the "Workspace" (Dense/Analytical), and the "Control" (Action-oriented).

## 4. Constraint Discoveries

- **Strict Adherence:** We must not modify existing `apps/web/` or `packages/ui/` files. All new concepts must be built using the established tokens as a foundation but extended visually in prototypes.
- **Accessibility:** High APCA contrast must be maintained. Interactive elements must have clear affordances and focus states.
