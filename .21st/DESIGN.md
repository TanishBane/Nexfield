# NEXFIELD — Design Context & Editorial System

**Positioning:** The Agricultural Intelligence Operating System  
**Tagline:** Observe. Predict. Simulate. Optimize. Grow.  
**Lead:** Tanish Bane (@TanishBane)  
**Hackathon:** ADAPPT 5.0 — Domain 2: AI in Food Technology  

---

## 1. Visual Philosophy: Natural, Precise, Immersive, Intelligent

NEXFIELD rejects the generic dark-mode AI SaaS aesthetic of blinding neon lasers, purple blobs, and crowded HUD clutter. 
Instead, NEXFIELD derives its identity from:
- **High-End Agricultural & Environmental Editorial:** The warmth of cultivated earth, morning light on foliage, crisp architectural elevations.
- **Scientific Cartography:** Clean lines, topographic contour gradients, legible geospatial coordinates.
- **Modern Calm SaaS:** Generous breathing room, clear typographic hierarchies, progressive disclosure.

---

## 2. Core Color Palette & Materials

| Token | Hex | Role | Contrast / APCA |
|---|---|---|---|
| **Warm Ivory** | `#F3E9D6` | Public editorial accents, hero highlights, light-accent badges | Warm, natural earth tone |
| **Forest Green** | `#173C2C` | Deep canopy backgrounds, structured cards, secondary brand | Restrained, organic richness |
| **Deep Charcoal / Obsidian** | `#101713` / `#090D0B` | Foundation canvas, command center background | Lc > 90 contrast against `#F0F5F2` |
| **Muted Gold** | `#C2A06A` | Harvest markers, grain indicators, subtle badge highlights | Elegant agrarian craft |
| **Soft Sage** | `#A7B5A0` | Subtitles, secondary metadata, inactive borders | Serene readability |
| **Warm White** | `#FAF8F2` | Primary typography on dark surfaces | Razor-sharp legibility |
| **Emerald Core** | `#10B981` | Interactive affordances, status signals, active state | Sparing, disciplined focus |

---

## 3. Typographic System

- **Editorial Display:** `Instrument Serif` (Italic & Regular) — for evocative headlines, section introductions, and story markers.
- **Product Interface:** `Manrope` / `Inter` — geometric precision, open counters, exceptional microtext legibility.
- **Technical & Scientific:** `JetBrains Mono` / `Geist Mono` with `tabular-nums` — coordinates, sensor telemetry, rupee spreads, soil matrices.

---

## 4. Invariants & Rules

1. **The Law of Progressive Disclosure:**
   Never confront the farmer with 50 telemetry points simultaneously. Surface the farm identity, today's 3 actionable priorities, and composite health first; provide rich nested routes for deep analytical drills.
2. **The Nested Radius Invariant:**
   `child_r <= parent_r - padding`. Inner buttons and badges must never have larger corner curvature than their enclosing card.
3. **Tabular Numerals Invariant:**
   Every price, percentage, moisture index, and coordinate must use `font-mono tabular-nums`.
4. **Motion with Intent:**
   Use GSAP ScrollTrigger for editorial narrative reveals and spring physics for interactive drawer/modal states. Respect `prefers-reduced-motion`.
