# NEXFIELD Typography Review

## Current State Analysis
The current application uses standard fonts with some dense layouts. The goal is to transition to the Project Earth 2.0 typographic system.

## Proposed Typographic System
1.  **Primary SaaS Font:** `Plus Jakarta Sans` (for readable, ergonomic body copy and structural elements).
2.  **Editorial Display:** `Space Grotesk` or `Instrument Serif` (for cinematic heroes and narrative sections).
3.  **Technical Numbers:** `JetBrains Mono` (specifically using `tabular-nums` for telemetry data, coordinates, and prices to prevent layout shift).

## Readability Evaluation
*   **13px:** Use for secondary labels, muted metadata, and minor status tags. Needs careful contrast monitoring.
*   **14px:** Standard body copy for dense data tables and secondary form descriptions.
*   **16px:** Primary body text for general reading and main form inputs. Excellent readability.
*   **18px:** Subheadings and emphasized lead paragraphs.
*   **24px:** Section headers and primary module titles.
*   **32px+:** Cinematic hero titles and major dashboard metrics.

## Identified Issues in Production
*   **Tiny Text:** Some telemetry badges and nested labels in the Command Center are too small (`< 11px`), making them hard to read in field conditions.
*   **Monospace Overuse:** Avoid using monospace for long reading text; reserve it strictly for quantitative data (numbers) and code.
*   **Contrast Issues:** Subtle gray text on dark forest backgrounds sometimes falls below WCAG AA requirements for small text.
*   **Line Length:** Narrative sections need `max-w-prose` constraints to prevent lines from exceeding 75 characters on large screens.

## Implementation Handoff Notes for Antigravity
*   Ensure `@font-face` or `next/font` definitions correctly load `Plus Jakarta Sans` and `JetBrains Mono`.
*   Apply `font-variant-numeric: tabular-nums;` (or the Tailwind `tabular-nums` class) to all live metrics, coordinates, and market prices.
*   Audit all text below 12px and bump the minimum readable size to 12px for critical interactive elements, reserving 10px-11px only for non-essential ornamental tags.
