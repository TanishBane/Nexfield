# 21ST.DEV COMPONENT INTEGRATION ARCHITECTURE

**Project:** NEXFIELD — The Agricultural Intelligence Operating System  
**Lead Designer & Architect:** Tanish Bane (@TanishBane)  
**Tooling:** `@21st-dev/cli` v0.0.17  
**Design Context:** `.21st/design.json` & `.21st/DESIGN.md`  
**Status:** Verified & Operational

---

## 1. Skill Discovery vs. 21st.dev Component Retrieval

In modern agentic development workflows, two distinct layers must never be conflated:

| Dimension | Skill Discovery (`find-skills`) | 21st.dev CLI (`@21st-dev/cli`) |
|---|---|---|
| **Purpose** | Discovers, audits, and installs agent capability instruction packages (skills) into `.agents/skills/`. | Searches, inspects, and retrieves production React/Tailwind visual component primitives from the 21st.dev catalog. |
| **Artifact** | Markdown skill definitions, execution scripts, and API contracts. | TSX components, Framer Motion animations, and shadcn-compatible UI primitives. |
| **Command Execution** | `npx.cmd --yes skills add <source>` | `npx.cmd --yes @21st-dev/cli get <component-id>` |
| **Installed Location** | `.agents/skills/<skill-name>/SKILL.md` | `apps/web/components/ui/` or `packages/ui/src/` |

---

## 2. Authentication & Account Context

The 21st CLI is authenticated under the product lead's GitHub identity:

```bash
$ npx.cmd --yes @21st-dev/cli whoami
Logged in as tanishbane (ID: 0a996da6-c875-4fc1-a9f7-66a70e7a1772)
Email: tanishbane99@gmail.com

$ npx.cmd --yes @21st-dev/cli usage
Plan: free
Component Generations: 0/0 remaining (resets in 8 days)
Free Component Retrievals: 2/2 remaining
```

### Free Tier Management & Resilient Adaptation:
While automated AI-generation credits are zero on the free tier, NEXFIELD leverages 21st.dev's **Design Context Engine** (`init --design-context`) to map 21st catalog inspiration directly to our localized Project Earth design tokens.

---

## 3. Design Context Architecture (`.21st/`)

The repository includes a dedicated design context for 21st.dev at `.21st/`:

### 1. `.21st/design.json`
Specifies font definitions, color palettes, and container rules:
```json
{
  "$schema": "https://21st.dev/schema/design.json",
  "name": "Project Earth",
  "framework": "nextjs-app-router",
  "styling": "tailwind",
  "tokens": {
    "colors": {
      "background": "#090D0B",
      "card": "#101713",
      "border": "#1F2E25",
      "primary": "#10B981",
      "accent": "#C2A06A",
      "text": "#FAF8F2",
      "muted": "#9BB1A4"
    },
    "typography": {
      "display": "Instrument Serif",
      "sans": "Manrope",
      "mono": "JetBrains Mono"
    }
  }
}
```

### 2. `.21st/DESIGN.md`
Provides comprehensive behavioral constraints for any component pulled or generated:
- Dark earth palette strictly enforced (`#090D0B` canvas, `#101713` card, `#1F2E25` border).
- Strict avoidance of generic neon glows or random floating particles.
- Tabular figures (`tabular-nums`) mandatory for all agricultural sensor readouts, coordinates, and rupee currency metrics.
- Optical nested radii rule: $r_{\text{child}} \le r_{\text{parent}} - p$.

---

## 4. Component Adaptation Workflow

When adapting a component from the 21st catalog into NEXFIELD:

1. **Token Substitution:**
   - Replace generic Tailwind neutrals (`zinc-900`, `slate-950`) with NEXFIELD earth tokens (`bg-[#090D0B]`, `bg-[#101713]`, `border-[#1F2E25]`).
   - Replace standard blues (`blue-500`) with domain-accurate vadose sky (`#38BDF8`) or foliar emerald (`#10B981`).
2. **Typography Alignment:**
   - Display headings receive `font-serif tracking-tight text-[#FAF8F2]`.
   - UI labels and controls receive `font-sans text-[#9BB1A4]`.
   - Numerical telemetry, IDs, and financial figures receive `font-mono tabular-nums`.
3. **Accessibility Verification:**
   - Ensure interactive states provide `focus-visible:ring-2 focus-visible:ring-emerald-500/60`.
   - Ensure APCA contrast between text and background exceeds 75 for body copy.
