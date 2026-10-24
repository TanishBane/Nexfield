# TYPOGRAPHY HIERARCHY & SPECIFICATION — PROJECT EARTH

**Project:** NEXFIELD — The Agricultural Intelligence Operating System  
**Lead Designer & Architect:** Tanish Bane (@TanishBane)  
**Version:** 2.0.0  
**Status:** Canonical & Active

---

## 1. The Tri-Font Typographic Architecture

NEXFIELD employs a carefully balanced three-font system to delineate storytelling, system navigation, and rigorous scientific telemetry:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        INSTRUMENT SERIF                                │
│       Editorial Gravitas · Agricultural Heritage · Narrative Arc       │
├────────────────────────────────────────────────────────────────────────┤
│                             MANROPE                                    │
│       Ergonomic Legibility · UI Navigation · Form Controls & Body      │
├────────────────────────────────────────────────────────────────────────┤
│                         JETBRAINS MONO                                 │
│   Tabular Sensor Metrics · Coordinates · APMC Spreads · Provenance     │
└────────────────────────────────────────────────────────────────────────┘
```

### 1. Instrument Serif (Display)
- **Source:** Google Fonts via `next/font/google`
- **Weights:** Regular (400), Italic (400)
- **Role:** Hero headlines, editorial section titles, quotes, storytelling accents.
- **Character:** Warm, authoritative, timeless — evokes agronomic journals, botanical classification compendiums, and natural history literature.
- **Styling Rules:** Pair with tight letter-spacing (`tracking-tight`) and generous line heights (`leading-[1.1]`). Often emphasized with italicized gold accents (`text-[#C2A06A] italic font-normal`).

### 2. Manrope (Interface Sans)
- **Source:** Google Fonts via `next/font/google`
- **Weights:** Medium (500), SemiBold (600), Bold (700), ExtraBold (800)
- **Role:** Application chrome, body copy, interactive buttons, modal headers, navigation links.
- **Character:** Geometric yet humanist; open apertures ensure crisp legibility on sunlight-reflective mobile displays in field environments.
- **Styling Rules:** Body copy uses `text-sm sm:text-base text-[#9BB1A4] leading-relaxed`.

### 3. JetBrains Mono (Technical Monospace)
- **Source:** Google Fonts via `next/font/google`
- **Weights:** Regular (400), Medium (500), Bold (700)
- **Role:** Sensor readings (moisture %, NDVI, EC), GPS coordinates, rupee market spreads (`₹2,450/qtl`), timestamps, and provenance badges.
- **Character:** Unmistakable technical authority, generous x-height, distinct glyph differentiation (`0` vs `O`, `1` vs `l`).
- **Strict Invariant:** Must ALWAYS be paired with `tabular-nums` to prevent numerical layout shift during live telemetry polling.

---

## 2. Zero-FOUT Loading Strategy & Next.js 15 Implementation

Typography is configured at module scope in `apps/web/app/layout.tsx`:

```tsx
import { Instrument_Serif, Manrope, JetBrains_Mono } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});
```

### CSS Variables Binding:
Injected into the root `<body>` tag:
```tsx
<body className={`${manrope.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans bg-[#090D0B] text-[#FAF8F2] antialiased`}>
```

And mapped in `apps/web/tailwind.config.ts`:
```ts
fontFamily: {
  serif: ['var(--font-serif)', 'serif'],
  sans: ['var(--font-sans)', 'sans-serif'],
  mono: ['var(--font-mono)', 'monospace'],
}
```

---

## 3. Typographic Scale Ladder

| Style Class | Font Family | Size (px) | Line Height | Tracking | APCA $L_c$ vs `#090D0B` | Usage Example |
|---|---|---|---|---|---|---|
| **Display 1** | `font-serif` | 72px / 4.5rem | 1.08 | `-0.025em` | 104 (Pure Ivory) | Hero Main Title |
| **Display 2** | `font-serif` | 48px / 3.0rem | 1.15 | `-0.02em` | 104 | Section Titles |
| **Heading 1** | `font-serif` | 32px / 2.0rem | 1.25 | `-0.015em` | 104 | Feature Section Headers |
| **Heading 2** | `font-sans` | 24px / 1.5rem | 1.35 | `-0.01em` | 100 | Card & Modal Titles |
| **Subhead** | `font-sans` | 18px / 1.125rem | 1.50 | `normal` | 82 (Soft Sage) | Lead Paragraphs |
| **Body** | `font-sans` | 14px / 0.875rem | 1.60 | `normal` | 72 | General Descriptive Text |
| **Data Metric** | `font-mono tabular-nums` | 24px / 1.5rem | 1.00 | `normal` | 104 | Telemetry HUD Numbers |
| **Label / Tag** | `font-mono` | 11px / 0.6875rem | 1.00 | `0.1em` | 55 (Dim Silver) | Badges, Micro-metadata |

---

## 4. Optical Sizing & Tabular Figure Guarantee

### Real-Time Numerical Stability:
When live sensors poll every 2 seconds, proportional figures (e.g., standard numbers in Arial or Helvetica) cause cards and table rows to vibrate horizontally as digits change from `1` to `8`.

In NEXFIELD:
- Every data readout uses Tailwind's `tabular-nums` class.
- All sensor values (e.g., `41.4%`, `0.81`, `₹2,450/qtl`) reserve identical monospace character cells, ensuring complete visual stability.
