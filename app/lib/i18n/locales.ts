/**
 * Shared locale definitions
 *
 * What: Single source of truth for supported locales
 * Why: Safe to import from client and server modules
 */

export const locales = ['hu', 'en', 'ar', 'hi', 'id', 'pt', 'vi', 'tr', 'bg', 'pl', 'ru', 'sw'] as const;
export type Locale = (typeof locales)[number];
