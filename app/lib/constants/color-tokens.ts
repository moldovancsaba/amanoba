/**
 * Color tokens for non-CSS rendering contexts
 *
 * What: Centralized raw color/shadow literals for contexts that cannot rely on CSS variables:
 * - Emails (HTML strings)
 * - OpenGraph / certificate images (next/og ImageResponse)
 * - Chart palettes (Recharts)
 * - Game persona colors (UI-visible)
 *
 * Why: Layout grammar forbids scattered inline literals; keep them in one explicit token source.
 */

import { SECONDARY_HEX, THEME_COLOR } from '@/app/lib/constants/app-url';

export const BRAND_COLORS = {
  black: '#000000',
  white: '#ffffff',
  darkGrey: SECONDARY_HEX,
  accent: THEME_COLOR,
  ctaText: '#111827',
} as const;

export const EMAIL_THEME_DEFAULT = {
  ctaBg: BRAND_COLORS.accent,
  ctaText: BRAND_COLORS.ctaText,
  bodyText: '#333333',
  muted: '#666666',
  border: '#dddddd',
  pageBg: '#f5f5f5',
  cardBg: '#ffffff',
  cardRadius: '12px',
  cardShadow: '0 2px 8px rgba(0,0,0,0.06)',
  wrapperBg: '#f9fafb',
  wrapperShadow: '0 1px 3px rgba(0,0,0,0.08)',
} as const;

export const CHART_THEME = {
  gridStroke: '#ffffff33',
  axisStroke: '#ffffff',
  tooltipBg: '#1f2937',
  series: ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#a855f7'],
  seriesWithAlpha: (hex: string, alpha = '88') => `${hex}${alpha}` as string,
} as const;

export const GAME_AI_PERSONAS = {
  1: [
    { name: 'TinyBot', emoji: '🤖', color: '#0086d1' },
    { name: 'MiloBit', emoji: '🦾', color: '#888888' },
    { name: 'KittenBot', emoji: '🐱', color: '#ac6e2f' },
  ],
  2: [
    { name: 'GearHead', emoji: '🤖', color: '#aaaaaa' },
    { name: 'DroneX', emoji: '🚁', color: '#3944bc' },
    { name: 'TabMaster', emoji: '😺', color: '#fba834' },
  ],
  3: [
    { name: 'Proxima', emoji: '💡', color: '#b9e937' },
    { name: 'Helix', emoji: '🤖', color: '#607274' },
    { name: 'Whiskers', emoji: '😺', color: '#a48f55' },
  ],
} as const;

export const DEFAULT_BRAND_THEME_COLORS = {
  primary: BRAND_COLORS.black,
  secondary: BRAND_COLORS.darkGrey,
  accent: BRAND_COLORS.accent,
} as const;

export const SEMANTIC_COLORS = {
  error: '#ef4444',
} as const;
