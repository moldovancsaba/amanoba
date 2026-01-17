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
 */
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
