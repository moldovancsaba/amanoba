import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

// What: Tailwind CSS configuration for Amanoba unified platform
// Why: Provides design system with custom animations, colors, and responsive breakpoints for games and gamification UI
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      fontFamily: {
        // Map Tailwind font-sans to next/font variables for global consistency
        sans: [
          'var(--font-noto-sans)',
          'var(--font-inter)',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        semantic: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          error: 'var(--color-error)',
          info: 'var(--color-info)',
        },
        // Amanoba brand colors — source of truth: app/design-system.css
        brand: {
          black: 'var(--color-surface-shell)',
          darkGrey: 'var(--color-surface-panel)',
          white: 'var(--color-surface-card)',
          accent: 'var(--cta-bg)',
          surface: {
            shell: 'var(--color-surface-shell)',
            panel: 'var(--color-surface-panel)',
            card: 'var(--color-surface-card)',
            subtle: 'var(--color-surface-subtle)',
          },
          text: {
            primary: 'var(--color-text-primary)',
            inverse: 'var(--color-text-inverse)',
            muted: 'var(--color-text-muted)',
            subtle: 'var(--color-text-subtle)',
          },
          border: {
            strong: 'var(--color-border-strong)',
            subtle: 'var(--color-border-subtle)',
          },
          primary: {
            400: 'var(--cta-bg-hover)',
          },
          secondary: {
            50: 'var(--color-secondary-50)',
            100: 'var(--color-secondary-100)',
            200: 'var(--color-secondary-200)',
            300: 'var(--color-secondary-300)',
            400: 'var(--color-secondary-400)',
            500: 'var(--color-secondary-500)',
            600: 'var(--color-secondary-600)',
            700: 'var(--color-secondary-700)',
            800: 'var(--color-secondary-800)',
            900: 'var(--color-secondary-900)',
          },
        },
        // Primary palette from design-system.css (CTAs and primary actions)
        primary: {
          DEFAULT: 'var(--cta-bg)',
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--cta-bg-hover)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        // Secondary uses dark grey
        secondary: {
          DEFAULT: '#2D2D2D',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#2D2D2D',
          900: '#1F2937',
        },
        // External brand colors (avoid inline hex in UI)
        social: {
          linkedin: 'var(--color-linkedin)',
          linkedinHover: 'var(--color-linkedin-hover)',
          google: {
            blue: 'var(--color-google-blue)',
            green: 'var(--color-google-green)',
            yellow: 'var(--color-google-yellow)',
            red: 'var(--color-google-red)',
          },
        },
      },
      animation: {
        'bounce-in': 'bounce-in 0.6s ease-out',
        'fade-in': 'fade-in 0.3s ease-in',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-down': 'slide-down 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      // Responsive breakpoints documentation
      // Mobile: < 640px (sm)
      // Tablet: 640px - 1024px (sm to lg)
      // Desktop: > 1024px (lg+)
    },
  },
  plugins: [
    tailwindcssAnimate,
  ],
}

export default config
