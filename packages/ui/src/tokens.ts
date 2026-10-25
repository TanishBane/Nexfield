/**
 * NEXFIELD 2.0 Design System Tokens
 * Deep Charcoal, Forest Black, Restrained Emerald Accents, Wheat Gold, High APCA Contrast
 * Canonical definitions shared across @nexfield/ui and apps/web
 */

export const tokens = {
  colors: {
    // Surfaces
    background: {
      base: '#090D0B',     // Obsidian Dark Field (Canvas Base)
      subtle: '#0D1410',   // Subterranean Rows & Section Breaks
      raised: '#111714',   // Standard Card Surface
      overlay: '#16201B',  // Dropdown / Popover / Flyout
      muted: '#1B2721',    // Elevated Interactive Hover State
      active: '#22332A',   // Active / Selected Tab or Rail Item
    },
    // Borders & Dividers
    border: {
      subtle: '#18251E',   // Internal dividers & chart gridlines
      default: '#203127',  // Standard card boundaries & input borders
      strong: '#2E4638',   // Hovered card borders & active inputs
      active: '#3D5C4A',   // Active selected border
      focus: '#10B981',    // Accessible focus indicator
    },
    // Typography Tokens (APCA & WCAG 2.2 AA Compliant)
    text: {
      primary: '#F1F6F3',   // Primary text (Contrast ratio ~14.2:1)
      secondary: '#9BB1A4', // Subtitles & metadata (Contrast ratio ~6.2:1)
      muted: '#6D8577',     // Captions & secondary timestamps (Contrast ratio ~4.6:1)
      accent: '#34D399',    // Key data highlights (Contrast ratio ~12.4:1)
      wheat: '#D7B678',     // Harvest values & financial realization (Contrast ratio ~8.9:1)
      inverse: '#090D0B',   // Text on bright badges / CTAs
    },
    // Brand Agronomic Green & Editorial Earth
    brand: {
      primary: '#10B981',   // Emerald Core
      bright: '#34D399',    // Hover / Highlights
      dark: '#059669',      // Active Pressed State
      forest: '#163B2A',    // Deep Forest Green Fills
      subtleForest: '#0E241A',
      // Editorial Harvest & Earth Tokens
      wheatGold: '#D7B678', // Harvest & APMC Price Accent
      warmWheat: '#F2E5C9', // Editorial Highlight Text
      ivory: '#F9F6ED',     // Primary Serif Headline Text
      softSage: '#8FA396',  // Muted Flora Metadata
    },
    // Domain Semantic Accents & Status Indicators
    semantic: {
      disease: {
        text: '#FB7185',
        bg: '#2A1116',
        border: '#4C1D24',
        glow: 'rgba(251, 113, 133, 0.2)',
      },
      warning: {
        text: '#FBBF24',
        bg: '#2B210B',
        border: '#4D3A15',
        glow: 'rgba(251, 191, 36, 0.2)',
      },
      hydrology: {
        text: '#38BDF8',
        bg: '#0C2333',
        border: '#163E5C',
        glow: 'rgba(56, 189, 248, 0.2)',
      },
      harvest: {
        text: '#F59E0B',
        bg: '#2E220D',
        border: '#543D17',
        glow: 'rgba(245, 158, 11, 0.2)',
      },
      spectral: {
        text: '#A78BFA',
        bg: '#231536',
        border: '#3F2661',
        glow: 'rgba(167, 139, 250, 0.2)',
      },
      optimal: {
        text: '#34D399',
        bg: '#0E291C',
        border: '#1C5238',
        glow: 'rgba(52, 211, 153, 0.2)',
      },
    },
  },
  typography: {
    fontSans: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    fontSerif: 'var(--font-serif, "Instrument Serif", Georgia, serif)',
    fontMono: 'var(--font-mono, "JetBrains Mono", "Fira Code", monospace)',
  },
  radius: {
    outer: '1.5rem',     // 24px (Modals, Large Hero Panels)
    card: '1rem',        // 16px (Standard Bento Cards)
    subcard: '0.75rem',  // 12px (Nested Cards)
    button: '0.5rem',    // 8px (Buttons, Form Inputs)
    badge: '0.375rem',   // 6px (Badges, Tag Pills)
    pill: '9999px',      // Full rounded
  },
  shadows: {
    card: '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.02) inset',
    elevated: '0 10px 30px -4px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.04) inset',
    glowEmerald: '0 0 24px -4px rgba(16, 185, 129, 0.3)',
    glowGold: '0 0 24px -4px rgba(215, 182, 120, 0.25)',
  },
  animation: {
    fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
    slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

/**
 * Concentric Radius Helper
 * Enforces concentric nesting: r_inner = max(r_outer - padding, 4px)
 */
export function getConcentricRadius(outerPx: number, paddingPx: number): string {
  const inner = Math.max(outerPx - paddingPx, 4);
  return `${inner}px`;
}
