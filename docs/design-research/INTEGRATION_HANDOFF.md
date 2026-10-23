# NEXFIELD Frontend Integration Handoff

**To:** Tanish Bane (Antigravity Agent)
**From:** Jules (Design Systems Architect)
**Date:** October 2026

## Overview
Phase 1 of the NEXFIELD redesign ("Obsidian Biosphere") is complete. High-fidelity design concepts have been generated via Stitch, and isolated, implementable React components have been generated via v0.

**No existing production code in `apps/web/` or shared components in `packages/ui/` have been altered.**

## Artifacts Location
- **Design Strategy:** `docs/design-research/NEXFIELD_DESIGN_DIRECTION.md`
- **Stitch Concepts:** `docs/design-research/STITCH_OUTPUTS.md`
- **v0 Prototypes:** `docs/design-prototypes/control/` (Contains `.tsx` files)

## Integration Prioritization & Mapping

Please integrate the prototypes into `apps/web` in the following order. Note that the generated components use standard Tailwind classes, so ensure they align with the `tailwind.config.ts` mapping.

### P0 (Critical Path)
1. **App Shell (Sidebar & Header)**
   - *Prototype:* `NEXFIELDHeader` and `NEXFIELDSidebar` in `nexfield-dashboard.tsx`.
   - *Action:* Replace existing basic layout shell. Hook up existing Next.js `<Link>` routing.
2. **NEXFIELD Control Dashboard**
   - *Prototype:* `FarmOverviewDashboard` in `nexfield-dashboard.tsx`.
   - *Action:* Integrate into `apps/web/app/control/page.tsx`. Connect the mocked metrics to the actual fixture data.

### P1 (High Impact)
3. **NEXFIELD Markets Terminal**
   - *Prototype:* `MarketIntelligenceTerminal` in `nexfield-data-markets.tsx`.
   - *Action:* Integrate into `apps/web/app/markets/page.tsx`. Replace the placeholder SVG chart with the actual Recharts/Visx implementation using the same color tokens.
4. **FieldSight AI (Diagnostic Workflow)**
   - *Reference:* Stitch Screen ID `9c0a30e3180c479da803afc67c2c46ed`.
   - *Action:* Build the 3-column layout as designed in the Stitch mockups.

### P2 (Enhancements)
5. **NEXFIELD Ops Ledger**
   - *Prototype:* `OpsInventoryLedger` in `nexfield-data-markets.tsx`.
   - *Action:* Integrate into `apps/web/app/ops/page.tsx`.
6. **NEXFIELD Intelligence Chat**
   - *Prototype:* `IntelligenceChatInterface` in `nexfield-ai-auth.tsx`.
   - *Action:* Integrate into `apps/web/app/intelligence/page.tsx`. Wire up the input to the LLM backend. Ensure the "Tool execution chain" block accurately reflects actual server-side tool calls.

## Styling & Accessibility Notes
- **Tokens:** The v0 components hardcode some hex values (e.g., `bg-[#111714]`). When integrating into `apps/web`, map these to the existing Tailwind classes defined in `tailwind.config.ts` (e.g., `bg-card`, `text-primary`).
- **Typography:** Ensure `tabular-nums` is preserved on all financial and telemetry data tables.
- **Icons:** We are standardizing on `lucide-react`.
