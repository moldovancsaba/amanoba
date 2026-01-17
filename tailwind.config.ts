import type { Config } from 'tailwindcss'

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
        // Amanoba brand colors
        brand: {
          black: '#000000',
          darkGrey: '#2D2D2D',
          white: '#FFFFFF',
          accent: '#FAB908', // Yellow/Gold accent
        },
        // Primary uses accent color
        primary: {
          DEFAULT: '#FAB908',
          50: '#FEF9E7',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FAB908',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
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
    require('tailwindcss-animate'),
  ],
}

export default config
