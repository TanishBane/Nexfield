/**
 * NEXFIELD Design System Tokens
 * Deep Charcoal, Forest Green, Restrained Emerald Accents, High APCA Contrast
 */
export const tokens = {
  colors: {
    // Surfaces
    background: {
      base: '#090D0B',     // Obsidian Dark Field
      raised: '#111714',   // Card Surface
      overlay: '#16201B',  // Dropdown / Popover
      muted: '#1B2620',    // Elevated Hover State
    },
    // Borders
    border: {
      subtle: '#1F2E25',
      default: '#273C30',
      active: '#3D5C4A',
    },
    // Typography
    text: {
      primary: '#F0F5F2',   // APCA High Contrast Lc > 90
      secondary: '#9BB1A4', // Subtitles & Meta
      muted: '#63796E',     // Disabled / Microtext
      accent: '#34D399',    // Key data highlights
    },
    // Brand Agronomic Green
    brand: {
      primary: '#10B981',   // Emerald Core
      bright: '#34D399',    // Hover / Highlights
      dark: '#059669',      // Active / Clicked
      forest: '#142E20',    // Badge Backgrounds
    },
    // Domain Semantic Accents
    semantic: {
      disease: {
        text: '#FB7185',
        bg: '#2A1116',
        border: '#4C1D24',
      },
      warning: {
        text: '#FBBF24',
        bg: '#2B210B',
        border: '#4D3A15',
      },
      hydrology: {
        text: '#38BDF8',
        bg: '#0C2333',
        border: '#163E5C',
      },
      harvest: {
        text: '#F59E0B',
        bg: '#2E220D',
        border: '#543D17',
      },
      spectral: {
        text: '#C084FC',
        bg: '#231536',
        border: '#3F2661',
      },
    },
  },
  typography: {
    fontSans: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    fontMono: 'var(--font-mono, "JetBrains Mono", "Fira Code", monospace)',
  },
  radius: {
    card: '0.75rem',      // 12px
    button: '0.5rem',     // 8px
    badge: '0.375rem',    // 6px
    inner: '0.375rem',    // Concentric nesting: child <= parent - gap
  },
} as const;
