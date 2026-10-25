---
description: Review a NEXFIELD change for product consistency, contract correctness, security, accessibility and verification evidence.
---

# NEXFIELD final review

Review the current working diff against `main` and `AGENTS.md`. Do not modify files unless explicitly asked to fix findings.

1. Confirm the selected Vivid Farming UI direction is preserved, with responsive layout, meaningful interactions, visible focus and reduced-motion behavior.
2. Check whether any fixture/fallback values are misrepresented as live data, inference, market feeds or measured agronomic results.
3. Check the zero-login public-demo model and browser-local persistence are described correctly.
4. Inspect API/schema compatibility, image-fetch SSRF protections, authorization boundaries and error handling if relevant files changed.
5. Check shared contract and fixture ownership rules before accepting any cross-cutting schema changes.
6. Run relevant type-check, lint, unit/API tests, production build and E2E checks available in the repository. Capture real output; never infer a pass from a command being launched.
7. Review Markdown links, SVG/image paths, Mermaid syntax and event claims if documentation changed.
8. Report findings by severity with file and line references, then give a clear merge recommendation. Do not merge, push, force-push or deploy unless explicitly authorized.
