# ANTIGRAVITY HANDOFF: UX Quality Lab

This document outlines actionable recommendations for the Antigravity team to implement in the production application, based on the UX Lab's findings.

---

### 1. Resolve Duplicate Branding in Navigation
*   **Problem:** The public navbar currently renders the `NexfieldLogo` component (which includes the wordmark if `showWordmark=true`) and then manually adds another "NEXFIELD" text span next to it.
*   **Evidence:** Playwright test `Check public navigation for duplicate NEXFIELD wordmark` logic analysis.
*   **Affected Components:**
    *   `apps/web/components/layout/PublicNavbar.tsx`
    *   `apps/web/components/layout/PublicFooter.tsx`
*   **Recommended Solution:** Remove the hardcoded `<span className="font-extrabold...">NEXFIELD</span>` text from the `PublicNavbar` and `PublicFooter` where `NexfieldLogo` is already handling it, or pass `showWordmark={false}` to the logo component.
*   **Severity:** Medium (Brand integrity).
*   **Implementation Priority:** High.
*   **Verification:** Covered by `tests/ux-jules/regression.spec.ts` (Group B).

### 2. Implement Accessible Icon Buttons
*   **Problem:** Several icon-only buttons (like menu toggles or search triggers) lack `aria-label` attributes, making them invisible to screen readers.
*   **Evidence:** Accessibility audit (`ACCESSIBILITY_REPORT.md`).
*   **Affected Components:** Global headers, task drawers, and mobile navigation components.
*   **Recommended Solution:** Audit all instances of `<Button size="icon">` or bare `<button>` containing only icons. Add descriptive `aria-label` properties (e.g., `aria-label="Open search"`).
*   **Relevant Prototype Path:** See accessible patterns in `prototypes/jules-clarity/nexfield-navigation.tsx`.
*   **Severity:** Critical (A11y blocker).
*   **Implementation Priority:** High.

### 3. Adopt Wheat-Green Color System and Typography
*   **Problem:** Current UI uses generic dark colors and lacks a cohesive, ag-tech specific feel. Small text is difficult to read.
*   **Evidence:** Typography Review (`TYPOGRAPHY_REVIEW.md`).
*   **Affected Components:** Global layout, dashboard metrics.
*   **Recommended Solution:** Update Tailwind theme configuration to match the new tokens (`#08160F` background, `#E5B869` primary accent, `#F7F6F0` text). Ensure `tabular-nums` is applied to all metric values. Increase base small text size to 12px.
*   **Relevant Prototype Path:** Reference styling in `prototypes/jules-clarity/farm-overview.tsx`.
*   **Severity:** Medium (UX/UI Polish).
*   **Implementation Priority:** Medium.

### 4. Implement Contextual Task Drawer & Mobile Nav
*   **Problem:** Task management is currently disconnected. Mobile navigation needs optimization for field use.
*   **Evidence:** Stitch UI exploration and v0 prototyping.
*   **Affected Components:** `/control` and `/ops` page layouts.
*   **Recommended Solution:** Integrate the provided `FarmTaskDrawer` and `MobileBottomNavigation` components into the main AppShell.
*   **Relevant Prototype Path:**
    *   `prototypes/jules-clarity/farm-task-drawer.tsx`
    *   `prototypes/jules-clarity/mobile-bottom-navigation.tsx`
*   **Severity:** Low (Feature enhancement).
*   **Implementation Priority:** Low/Scheduled.
