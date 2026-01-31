/**
 * Certificate image default colors
 *
 * What: Single source for default certificate PNG colors when Brand.themeColors are not set
 * Why: Both certificate image APIs (profile/[playerId]/certificate/[courseId]/image and
 *      certificates/[slug]/image) need the same palette; Brand overrides at runtime.
 *
 * Colors align with design-system (THEME_COLOR = CTA gold) and app-url (SECONDARY_HEX).
 */

import { SECONDARY_HEX, THEME_COLOR } from '@/app/lib/constants/app-url';

/** Default certificate image colors (used when Brand.themeColors not available). Aligns with design-system. */
export const CERT_COLORS_DEFAULT = {
  bgStart: '#1a1a1a',
  bgMid: SECONDARY_HEX,
  border: THEME_COLOR,
  borderMuted: `${THEME_COLOR}4D`,
  titleGradientEnd: THEME_COLOR,
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  accent: THEME_COLOR,
  footer: '#999999',
} as const;

export type CertColors = { [K in keyof typeof CERT_COLORS_DEFAULT]: string };
