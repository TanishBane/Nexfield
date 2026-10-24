# Antigravity Design Handoff: Cinematic Redesign

This document outlines the execution strategy for transitioning the isolated prototypes and concepts in `design/jules-cinematic-lab` into the production frontend (`apps/web/` and `packages/ui/`).

## 1. Prioritization Strategy: What to Implement First
1. **The Minimal Navigation Shell:** Replace the heavy top-navigation with the floating sidebar (see `minimal-navigation-sidebar.tsx`). This immediately frees up screen real estate and sets the "OS" tone.
2. **The Cinematic Hero (Public/Auth On-Ramp):** Implement the dark, glowing hero background and high-contrast typography (see `cinematic-hero.tsx`) to create a strong first impression.
3. **Typography Standardization:** Ensure all telemetry components, data tables, and HUDs are strictly using `tabular-nums` via the `font-mono` class (JetBrains Mono).

## 2. Preservation: Existing Components to Keep
- **Color Tokens:** The base `#0A0F0D` charcoal and `#10B981` emerald tokens in `packages/ui/src/tokens.ts` are excellent and remain the foundation.
- **Three.js WebGL Architecture:** The underlying logic for the 3D Digital Twin should remain untouched; we are only changing the *interface layers* that float above it.
- **API Hooks & Caching:** Do not touch the React Query / Supabase logic.

## 3. Reusable Prototype Components
The code in `prototypes/jules-design-lab/` is built for visual demonstration.
- The `CinematicHero` CSS gradients and masking logic are highly reusable.
- The `MinimalNavigationSidebar` structure is solid, though you should swap the dummy `cn` utility with the project's actual `lib/utils.ts`.
- The `ScenarioControls` layout is exact, but you must replace the dummy `<Slider>` and `<Switch>` with the actual `shadcn/ui` equivalents in `packages/ui/`.
- The `ImageInspectionWorkspace` uses flexbox for the split-pane. For production, consider using `react-resizable-panels` as specified in the component recommendations.

## 4. Required New Assets & Interactivity
- **WebGL Shaders:** The Stitch concepts suggest a procedural, neon-wireframe LiDAR shader for the Digital Twin background. A Three.js shader implementation will be required to match the visual fidelity of the mockups.
- **Animations:** Implement Framer Motion for the number tickers in the Command Center and the smooth expanding/collapsing of the navigation sidebar.

## 5. Information Architecture Flow
Refer to `NAVIGATION_BLUEPRINT.md`. The core shift is from a flat dashboard to a deeply contextual "Progressive Disclosure" model. The sidebar handles top-level routing, while contextual floating HUDs (like Scenario Controls) handle sub-interactions.

## 6. Verification Requirements
- **Accessibility (APCA):** Ensure the warm ivory text on the `#16201B` glassmorphic backgrounds maintains passing APCA contrast ratios.
- **Mobile Responsiveness:** The heavy 3D WebGL scenes and dense Command Center telemetry must gracefully degrade on mobile devices (e.g., swapping the floating sidebar for a bottom tab bar).
- **Performance:** Ensure the CSS backdrop-filters (blur) on the floating glassmorphic panels do not cause framerate drops over the active Three.js canvas. Use `will-change: transform` or fallback to solid colors if necessary.
