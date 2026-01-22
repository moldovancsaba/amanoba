/**
 * Locale Utility Helpers
 *
 * Provides small helpers used across course pages and redirect logic.
 */
export const supportedCourseLocales = ['hu', 'en', 'ru'] as const;
export type SupportedCourseLocale = (typeof supportedCourseLocales)[number];

export function getLocaleForLanguage(language?: string): SupportedCourseLocale {
  const normalized = (language || 'hu').toLowerCase();
  if (normalized === 'ru') return 'ru';
  if (normalized === 'en') return 'en';
  return 'hu';
}

export const localeFlags: Record<SupportedCourseLocale, string> = {
  hu: '🇭🇺',
  en: '🇬🇧',
  ru: '🇷🇺',
};

export const localeLabels: Record<SupportedCourseLocale, string> = {
  hu: 'Magyar',
  en: 'English',
  ru: 'Русский',
};
