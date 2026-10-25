/**
 * NEXFIELD Design System Tokens
 * Vivid farming palette with light surfaces and high-contrast text
 */
export const tokens = {
  colors: {
    // Surfaces
    background: {
      base: "#F7FAF2", // Light workspace canvas
      raised: "#FFFFFF", // Card Surface
      overlay: "#FFFFFF", // Dropdown / Popover
      muted: "#EDF4E7", // Elevated Hover State
    },
    // Borders
    border: {
      subtle: "#D1DDCD",
      default: "#B8CDB3",
      active: "#048547",
    },
    // Typography
    text: {
      primary: "#09251A", // Primary text on light surfaces
      secondary: "#46604D", // Subtitles & Meta
      muted: "#526750", // Disabled / Microtext
      accent: "#005B36", // Key data highlights
    },
    // Brand Agronomic Green & Editorial Earth
    brand: {
      primary: "#048547", // Emerald Core
      bright: "#005B36", // Hover / Highlights
      dark: "#059669", // Active / Clicked
      forest: "#142E20", // Badge Backgrounds
      // Project Earth Editorial Tokens
      warmIvory: "#F7FAF2", // Editorial surface & hero highlight
      forestGreen: "#173C2C", // Deep agricultural richness
      deepCharcoal: "#101713", // Foundation charcoal
      mutedGold: "#FFDB3D", // Harvest & grain accent
      softSage: "#D8EABF", // Muted flora & secondary meta
      warmWhite: "#FAF8F2", // High-contrast editorial text
    },
    // Domain Semantic Accents
    semantic: {
      disease: {
        text: "#BE123C",
        bg: "#FFF1F2",
        border: "#FDA4AF",
      },
      warning: {
        text: "#854D0E",
        bg: "#FFF5CA",
        border: "#EBD377",
      },
      hydrology: {
        text: "#075985",
        bg: "#E0F2FE",
        border: "#7DD3FC",
      },
      harvest: {
        text: "#9A3412",
        bg: "#FFF0DF",
        border: "#FDBA74",
      },
      spectral: {
        text: "#6B21A8",
        bg: "#F3E8FF",
        border: "#D8B4FE",
      },
    },
  },
  typography: {
    fontSans: 'var(--font-sans, "Gidole", sans-serif)',
    fontSerif: 'var(--font-serif, "Butler", Georgia, serif)',
    fontMono: 'var(--font-mono, "Gidole", sans-serif)',
  },
  radius: {
    card: "0.75rem", // 12px
    button: "0.5rem", // 8px
    badge: "0.375rem", // 6px
    inner: "0.375rem", // Concentric nesting: child <= parent - gap
  },
} as const;
