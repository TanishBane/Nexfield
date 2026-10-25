import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: { "18": "4.5rem", "15": "3.75rem", "4.5": "1.125rem" },
      colors: {
        background: "#F7FAF2",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#09251A",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#09251A",
        },
        primary: {
          DEFAULT: "#048547",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E5F0D8",
          foreground: "#09251A",
        },
        muted: {
          DEFAULT: "#EDF4E7",
          foreground: "#46604D",
        },
        accent: {
          DEFAULT: "#FFDB3D",
          foreground: "#005B36",
        },
        destructive: {
          DEFAULT: "#BE123C",
          foreground: "#FFE4E6",
        },
        border: "#D1DDCD",
        input: "#D1DDCD",
        ring: "#2D6546",
        // Forest Green & Wheat Gold Brand Palette
        forest: {
          DEFAULT: "#163B2A",
          deep: "#163B2A",
          agri: "#2D6546",
          dark: "#0E241A",
          subtle: "#1C4230",
        },
        wheat: {
          DEFAULT: "#FFDB3D",
          gold: "#FFDB3D",
          warm: "#FFF0A6",
          ivory: "#F7FAF2",
        },
        brand: {
          deepForest: "#163B2A",
          agriGreen: "#2D6546",
          wheatGold: "#FFDB3D",
          warmWheat: "#FFF0A6",
          ivory: "#F7FAF2",
          deepText: "#17251B",
        },
        // Project Earth Editorial Tokens
        earth: {
          ivory: "#F7FAF2",
          forest: "#163B2A",
          agri: "#2D6546",
          charcoal: "#0F1612",
          gold: "#FFDB3D",
          wheat: "#FFF0A6",
          sage: "#46604D",
          white: "#FAF8F2",
          text: "#17251B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-serif)", "Butler", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
    },
  },
  plugins: [],
};

export default config;
