/**
 * Course catalog language resolution (P0 global audit)
 *
 * What: Resolve course name/description for a given locale from course.translations
 * Why: Ensures catalog and emails show course text in the user's language when available
 */

import type { Locale } from '@/app/lib/i18n/locales';

type TranslationsMap =
  | Map<string, { name: string; description: string }>
  | Record<string, { name: string; description: string }>
  | null
  | undefined;

export type CourseForLocale = {
  name: string;
  description: string;
  language: string;
  translations?: TranslationsMap;
};

function getTranslation(
  translations: TranslationsMap,
  locale: Locale
): { name: string; description: string } | undefined {
  if (!translations) return undefined;
  if (translations instanceof Map) {
    return translations.get(locale);
  }
  return (translations as Record<string, { name: string; description: string }>)[locale];
}

/**
 * Resolve course name for display/email in the given locale.
 * Uses course.translations[locale] when present, otherwise course.name.
 */
export function resolveCourseNameForLocale(
  course: CourseForLocale,
  locale: Locale
): string {
  const t = getTranslation(course.translations ?? undefined, locale);
  return t?.name ?? course.name;
}

/**
 * Resolve course description for display/email in the given locale.
 * Uses course.translations[locale] when present, otherwise course.description.
 */
export function resolveCourseDescriptionForLocale(
  course: CourseForLocale,
  locale: Locale
): string {
  const t = getTranslation(course.translations ?? undefined, locale);
  return t?.description ?? course.description;
}
