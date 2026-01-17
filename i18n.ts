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
export default getRequestConfig(async ({ requestLocale }) => {
  // Use requestLocale if available, otherwise fallback to defaultLocale
  // This handles cases where locale might not be in the request context
  let locale = requestLocale || defaultLocale;
  
  // Validate that the locale is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
