---
applyTo: "apps/web/**, packages/ui/**"
---

# NEXFIELD frontend instructions

- Preserve the selected Vivid Farming direction: light canvas, farm photography, leaf-green navigation and purposeful sunflower/sky/module accents. The current source is `docs/ux-lab/vivid-farming-ui.md`, `.21st/design.json`, current CSS and running UI; old dark-theme documentation is not the active visual specification.
- Respect the existing Next.js App Router, shared `@nexfield/ui` primitives, React, TypeScript, Zustand, TanStack Query and established import aliases.
- Keep page-level orchestration separate from reusable UI primitives. Prefer a shared component only when multiple screens need the same behavior or visual pattern.
- Do not present fixture-backed values as live telemetry, real market data, or live AI output. Keep provenance and sample-data labels visible.
- The public demo is zero-login and uses browser-local state. Do not reintroduce Supabase auth flows or remote persistence unless specifically approved and coordinated.
- Do not change API payloads ad hoc. Use `packages/contracts` and coordinate schema changes with the backend owner.
- Build every important screen for mobile, tablet and desktop. Prevent overflow, clipped controls and chart truncation.
- Use semantic HTML, labels, visible focus, keyboard support, appropriate contrast, reduced motion, and accessible dialog behavior.
- Avoid inert buttons and fake success. Every visible action must work or be clearly unavailable.
- Run the frontend type-check, lint, relevant Vitest tests and production build. Report exact outcomes.
