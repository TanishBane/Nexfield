# Vivid farming UI

Branch: feature/codex-vivid-ui-pr
Date: 25 October 2026

## Visual direction

A complete visual refresh of the public pages, farm navigation, module introductions, shared controls, and demo workspaces. Leaf green, sunflower yellow, sky blue, orange, pink, and lilac replace the dark editorial palette. Headings use plain language.

Butler and Gidole are downloaded from DaFont and self-hosted. Real farming photographs are downloaded from Unsplash, with source records and photographer credits. Direct Google Images access was unavailable; web image search supplied the stock photographs.

## Implementation

- Home: photo-led split hero, six farm tools, setup steps, sample-farm invitation, native FAQ disclosures.
- Public: shared responsive navigation and footer; platform detail pages use a common template.
- Workspace: light canvas, green sidebar, compact tablet icon rail, colored module introductions, responsive bottom navigation, clear demo banner.
- Public demo: navigation follows the current no-account flow, with a persistent sample-data banner and the existing estate selector and browser persistence. Removed sign-in routes remain removed.
- Accessibility: skip links, visible focus, Escape dismissal, overlay focus management, reduced-motion support.
- Navigation: command search opens with Ctrl/Cmd+K and preserves demo destinations.
- 3D: local Gidole labels and on-demand rendering; continuous frames only for the rain simulation when reduced motion is off.

## Original redesign validation

Desktop and 390px mobile route checks found no horizontal overflow across 25 page/viewport combinations. The 3D page separately rendered at both sizes without runtime errors. Thirteen browser interaction checks passed, including mobile navigation, focus restoration, FAQ expansion, demo selection, password visibility, command search, demo reset, and protected-route redirects.

Type checks and the full production build passed, including Next.js lint, type validation, and generation of all 34 static pages. Those checks ran before main moved to a public demo. The PR integration checks below supersede auth-specific checks.

Existing staged changes in auth hooks and API security were preserved in the original workspace and excluded from this PR. The PR was prepared in an isolated worktree on the latest main, preserving upstream public demo behavior, model provenance, WebGL fallback, and form label associations. No production deployment was performed.

## Assets and design context

- apps/web/public/fonts/SOURCES.md
- apps/web/public/images/farming/SOURCES.md
- .21st/design.json
- .21st/DESIGN.md

Browser captures and local audit scripts are under the ignored .playwright-results directory.
