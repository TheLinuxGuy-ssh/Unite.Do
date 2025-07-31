import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#fcef30',
          hover: '#fff468',
        },
        dashboard: {
          light: {
            bg: '#FFFFFF',
            surface: '#F9FAFB',
            border: '#E5E7EB',
            text: {
              primary: '#111827',
              secondary: '#6B7280',
            },
            success: '#22C55E',
            warning: '#fcef30',
            error: '#EF4444',
            tag: {
              bg: '#FEF9C3',
              text: '#A16207',
            },
          },
          dark: {
            bg: '#121212',
            surface: '#1E1E1E',
            border: '#333333',
            text: {
              primary: '#E0E0E0',
              secondary: '#A0A0A0',
            },
            success: '#4CAF50',
            warning: '#fcef30',
            error: '#EF4444',
            tag: {
              bg: '#333333',
              text: '#fcef30',
            },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
