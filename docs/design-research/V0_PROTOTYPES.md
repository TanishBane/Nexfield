# v0 Prototype Interactions & Components

This document outlines the isolated React/TypeScript components generated using the v0 MCP for the NEXFIELD cinematic redesign lab.

## Overview
All components are housed in `prototypes/jules-design-lab/`. They are visually complete but functionally mocked, designed to demonstrate interactions and layout structures without complex dependencies.

### 1. Cinematic Hero (`cinematic-hero.tsx`)
- **Interaction:** Scroll-aware navigation and a prominent CTA with hover-state glow effects.
- **Visuals:** Uses CSS radial gradients and grids to simulate a 3D digital twin glow on an obsidian canvas `#090D0B`.
- **v0 URL:** [https://v0.app/chat/oVELgckZ2w0](https://v0.app/chat/oVELgckZ2w0)

### 2. Minimal Navigation Sidebar (`minimal-navigation-sidebar.tsx`)
- **Interaction:** Hover and active states for pillar navigation icons.
- **Visuals:** Frosted glassmorphism (`backdrop-blur-xl bg-[#16201B]/80`) providing a floating, unobtrusive interface over complex data.
- **Accessibility:** Uses standard HTML attributes (`aria-label`, `title`) for icon-only buttons to satisfy accessibility requirements.
- **v0 URL:** [https://v0.app/chat/iGU56ZM2oSN](https://v0.app/chat/iGU56ZM2oSN)

### 3. Scenario Controls (`scenario-controls.tsx`)
- **Interaction:** Draggable time/forecast slider and toggle switches for map layers.
- **Visuals:** A dense, high-contrast floating HUD panel (`bg-[#16201B]/90`) with tabular-num rendering for metric readouts.
- **v0 URL:** [https://v0.app/chat/ukxCrNjHPw2](https://v0.app/chat/ukxCrNjHPw2)

### 4. Image Inspection Workspace (`image-inspection-workspace.tsx`)
- **Interaction:** Split-pane layout with image zooming (+/- controls) and interactive tab switching on the pathology card.
- **Visuals:** High-contrast crimson (`#f05252`) alert states contrasting against the dark obsidian base. Simulates the Grad-CAM heatmap visualization.
- **v0 URL:** [https://v0.app/chat/dLbIWWYv1Ru](https://v0.app/chat/dLbIWWYv1Ru)

## Usage Note for Antigravity
These components are visual prototypes only. They simulate advanced interactions (like WebGL shaders or `react-resizable-panels`) using simpler CSS or standard flexbox equivalents to remain isolated in this lab environment. When integrating into `apps/web/`, swap out the dummy wrappers for actual `shadcn/ui` components or complex third-party dependencies as required by the production architecture.
