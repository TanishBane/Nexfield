# Component & Pattern Recommendations

This document outlines recommended modern UI components and interaction patterns (inspired by sources like 21st.dev, Magic UI, and shadcn/ui) to elevate the NEXFIELD experience to a cinematic standard.

*Note: Antigravity will handle the actual integration and dependency management for the production environment.*

## 1. Cinematic Hero Layouts
- **Pattern:** Full-Bleed Spatial Backgrounds
- **Source Inspiration:** 21st.dev - `Hero Section with Background Glow` or similar WebGL backdrop integrations.
- **Integration:** Use behind the authenticated "Farm Overview" to create depth. The background should be a low-opacity rendering or abstract representation of the Digital Twin.
- **Key Feature:** Large, editorial typography for high-level metrics (e.g., "Field A requires irrigation in 4 hours").

## 2. Minimal & Spatial Navigation
- **Component:** Floating Dock / Minimal Sidebar
- **Source Inspiration:** 21st.dev - `Mac OS Dock` or shadcn/ui `Sidebar` (configured for minimal collapsed state).
- **Integration:** Replace the standard heavy top-nav with a floating dock at the bottom (mobile) or a collapsed pill-shaped sidebar (desktop).
- **Benefit:** Maximizes viewport for spatial data and charts; reduces dashboard clutter.

## 3. Image Inspection Workspace (FieldSight)
- **Component:** Split-Pane Resizable Layout
- **Source Inspiration:** shadcn/ui `Resizable` component (react-resizable-panels).
- **Integration:** For the FieldSight pathology view. Left pane: Large, zoomable crop image with CAM heatmap overlays. Right pane: Clinical diagnosis cards and ICAR prescriptions.
- **Benefit:** Professional, medical-grade feeling for crop analysis.

## 4. Scenario Controls & Telemetry
- **Component:** Glassmorphic Floating Cards
- **Source Inspiration:** UI labs exploring glassmorphism (backdrop-filter blur).
- **Integration:** Use these for the interactive scenario controls overlaid on the 3D Digital Twin.
- **Tokens:** Must strictly use the established background overlays (`#16201B` with opacity) and emerald accents to maintain brand consistency while achieving the "floating HUD" look.

## 5. Animated Data Visualizations
- **Component:** Number Ticker / Animated Counters
- **Source Inspiration:** Magic UI `Number Ticker` or framed framer-motion equivalents.
- **Integration:** Use for live telemetry updates in the Command Center (e.g., live temperature, moisture levels).
- **Requirement:** Must utilize the `tabular-nums` font feature to prevent layout jitter during animation.

## 6. Complex Data Tables (Ops & Markets)
- **Component:** Command Palette / Data Table with Faceted Search
- **Source Inspiration:** shadcn/ui `Data Table` (TanStack Table) & `Command` (cmdk).
- **Integration:** For the Markets and Ops ledger. Provide a keyboard-first navigation experience for power users managing large inventories or analyzing multiple Mandi prices.

## 7. Interactive Guided Demo
- **Component:** Joyride / Feature Tour Tooltips
- **Source Inspiration:** Libraries like `react-joyride` or custom framer-motion driven spotlight tooltips.
- **Integration:** Essential for the "Demo Mode." Guides the user through complex workflows (like running a deficit irrigation simulation) step-by-step using synthetic data.
