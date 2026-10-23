import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090D0B',
        card: {
          DEFAULT: '#111714',
          foreground: '#F1F5F2',
        },
        popover: {
          DEFAULT: '#16201B',
          foreground: '#F1F5F2',
        },
        primary: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#19261E',
          foreground: '#D7E5DC',
        },
        muted: {
          DEFAULT: '#16221B',
          foreground: '#8DA396',
        },
        accent: {
          DEFAULT: '#22362A',
          foreground: '#34D399',
        },
        destructive: {
          DEFAULT: '#BE123C',
          foreground: '#FFE4E6',
        },
        border: '#202E25',
        input: '#1A261F',
        ring: '#10B981',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
    },
  },
  plugins: [],
};

export default config;
