/**
 * i18n Configuration
 * 
 * What: Internationalization configuration for next-intl
 * Why: Centralized language configuration with Hungarian as default
 * 
 * Note: Translations are now loaded from MongoDB Atlas database
 * Falls back to JSON files if database is unavailable
 */

import { getRequestConfig } from 'next-intl/server';

// Supported languages
// Why: Define available languages for the platform
export const locales = ['hu', 'en'] as const;
export type Locale = (typeof locales)[number];

// Default locale
// Why: Hungarian is the default language
export const defaultLocale: Locale = 'hu';

/**
 * Get request configuration
 * 
 * Why: Configure next-intl for server components
 * 
 * Note: The locale is automatically extracted from the URL by next-intl middleware
 * With localePrefix: 'always', the locale is always in the URL path
 * 
 * Translations are loaded from MongoDB Atlas database first, with fallback to JSON files
 */
function deepMerge(base: any, override: any): any {
  if (Array.isArray(base)) return override ?? base;
  if (typeof base === 'object' && base !== null) {
    const result: any = { ...base };
    if (override && typeof override === 'object') {
      for (const key of Object.keys(override)) {
        result[key] = deepMerge(base[key], override[key]);
      }
    }
    return result;
  }
  return override !== undefined ? override : base;
}

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is always defined - fallback to defaultLocale if missing
  // This handles edge cases where locale might not be extracted correctly
  const resolvedLocale = (locale && locales.includes(locale as Locale)) 
    ? locale 
    : defaultLocale;

  // Validate that the locale is valid
  if (!resolvedLocale || !locales.includes(resolvedLocale as Locale)) {
    // This should never happen, but provide a safe fallback
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default,
    };
  }

  // Try to load translations from MongoDB database (server-side only, runtime only)
  // Skip during build to prevent webpack from bundling mongoose
  // Only attempt at runtime when MONGODB_URI is available
  if (
    typeof window === 'undefined' && 
    process.env.MONGODB_URI && 
    process.env.NEXT_RUNTIME !== undefined // Only at runtime, not during build
  ) {
    try {
      // Dynamic import with string literal to prevent static analysis
      const translationModule = await import(
        /* webpackIgnore: true */ 
        '@/app/lib/i18n/translation-service'
      );
      const dbTranslations = await translationModule.getTranslationsForLocale(resolvedLocale);
      
      // If we have translations from database, use them
      if (dbTranslations && Object.keys(dbTranslations).length > 0) {
        return {
          locale: resolvedLocale,
          messages: dbTranslations,
        };
      }
    } catch (error) {
      // If database fetch fails, fall back to JSON files
      // Silently fail - JSON files are the reliable fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to load translations from database for locale ${resolvedLocale}, falling back to JSON files:`, error);
      }
    }
  }

  // Fallback to JSON files if database is unavailable or empty
  // Additionally, merge with default locale to avoid missing keys showing raw ids
  const defaultMessages = (await import(`./messages/${defaultLocale}.json`)).default;
  const localeMessages =
    resolvedLocale === defaultLocale
      ? defaultMessages
      : (await import(`./messages/${resolvedLocale}.json`)).default;

  const messages =
    resolvedLocale === defaultLocale ? defaultMessages : deepMerge(defaultMessages, localeMessages);

  return {
    locale: resolvedLocale,
    messages,
  };
});
