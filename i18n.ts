/**
 * i18n Configuration
 * 
 * What: Internationalization configuration for next-intl
 * Why: Centralized language configuration with Hungarian as default
 */

import { notFound } from 'next/navigation';
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
 */
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

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  };
});
