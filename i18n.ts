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
import { locales, type Locale } from '@/app/lib/i18n/locales';
export { locales, type Locale } from '@/app/lib/i18n/locales';

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
function deepMerge(base: Record<string, unknown>, override: Record<string, unknown> | undefined): Record<string, unknown> {
  if (Array.isArray(base)) return (override as Record<string, unknown>) ?? base;
  if (typeof base === 'object' && base !== null) {
    const result: Record<string, unknown> = { ...base };
    if (override && typeof override === 'object') {
      for (const key of Object.keys(override)) {
        const b = base[key];
        const o = override[key];
        const bObj = typeof b === 'object' && b !== null && !Array.isArray(b) ? b as Record<string, unknown> : {};
        const oObj = typeof o === 'object' && o !== null && !Array.isArray(o) ? o as Record<string, unknown> : undefined;
        result[key] = oObj !== undefined ? deepMerge(bObj, oObj) : (o ?? b);
      }
    }
    return result;
  }
  return override !== undefined ? (override as Record<string, unknown>) : base;
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
      
      // If we have translations from database, merge them with defaults to avoid missing-key display
      if (dbTranslations && Object.keys(dbTranslations).length > 0) {
        const defaultMessages = (await import(`./messages/${defaultLocale}.json`)).default;
        let resolvedMessages: Record<string, unknown> = {};
        if (resolvedLocale !== defaultLocale) {
          try {
            resolvedMessages = (await import(`./messages/${resolvedLocale}.json`)).default as Record<string, unknown>;
          } catch (_err) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`Missing locale file for ${resolvedLocale}, returning empty messages.`);
            }
            resolvedMessages = {};
          }
        }

        const base = (resolvedLocale === defaultLocale ? defaultMessages : resolvedMessages) as Record<string, unknown>;
        return {
          locale: resolvedLocale,
          messages: deepMerge(base, dbTranslations as Record<string, unknown>),
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
  const defaultMessages = (await import(`./messages/${defaultLocale}.json`)).default as Record<string, unknown>;
  let localeMessages: Record<string, unknown> = defaultMessages;
  if (resolvedLocale !== defaultLocale) {
    try {
      localeMessages = (await import(`./messages/${resolvedLocale}.json`)).default as Record<string, unknown>;
    } catch (_err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing locale file for ${resolvedLocale}, returning empty messages.`);
      }
      localeMessages = {};
    }
  }

  const messages =
    resolvedLocale === defaultLocale ? defaultMessages : localeMessages;

  return {
    locale: resolvedLocale,
    messages,
  };
});
