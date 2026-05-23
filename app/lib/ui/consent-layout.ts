/**
 * Shared spacing: add consent banner height to fixed mobile CTAs and scroll padding.
 */

export const CONSENT_BANNER_HEIGHT_VAR = 'var(--consent-banner-height, 0px)';

/** Bottom offset for fixed mobile action bars (Affix). */
export const MOBILE_FIXED_CTA_BOTTOM = `calc(12px + ${CONSENT_BANNER_HEIGHT_VAR})`;

/** Main content padding when a mobile Affix CTA is visible (~100px bar + 12px gap). */
export const MOBILE_COURSE_DETAIL_BOTTOM_PADDING = `calc(112px + ${CONSENT_BANNER_HEIGHT_VAR})`;

/** Extra catalog bottom padding so last card CTAs clear the consent banner. */
export const CATALOG_BOTTOM_PADDING = `calc(32px + ${CONSENT_BANNER_HEIGHT_VAR})`;
