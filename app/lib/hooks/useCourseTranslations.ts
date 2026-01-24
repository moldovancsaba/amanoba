/**
 * Custom Translation Hook for Course Pages
 * 
 * What: Provides translations based on course language instead of URL locale
 * Why: Course UI should match course language, not URL locale - prevents redirects and reloads
 * 
 * Usage:
 *   const { t, tCommon, courseLocale } = useCourseTranslations(courseLanguage);
 *   // Use t() and tCommon() as normal - they use course language
 */

'use client';

import { useState, useEffect } from 'react';
import { locales, type Locale } from '@/i18n';

interface Translations {
  [key: string]: any;
}

let translationCache: Record<string, Translations> = {};

/**
 * Load translations for a specific locale
 */
async function loadTranslations(locale: Locale): Promise<Translations> {
  // Check cache first
  if (translationCache[locale]) {
    return translationCache[locale];
  }

  try {
    const response = await fetch(`/api/translations?locale=${locale}`);
    if (response.ok) {
      const data = await response.json();
      if (data?.success && data?.messages) {
        translationCache[locale] = data.messages;
        return data.messages;
      }
    }
  } catch (error) {
    console.error(`Failed to load translations from API for locale ${locale}:`, error);
  }

  try {
    // Load from JSON files (client-side compatible)
    const messages = await import(`@/messages/${locale}.json`);
    translationCache[locale] = messages.default;
    return messages.default;
  } catch (error) {
    console.error(`Failed to load translations for locale ${locale}:`, error);
    return {};
  }
}

/**
 * Get nested value from translations object
 */
function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return path if not found (next-intl behavior)
    }
  }
  return typeof value === 'string' ? value : path;
}

/**
 * Custom translation hook that uses course language
 */
export function useCourseTranslations(courseLanguage: string | undefined, fallbackLocale?: string) {
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeLocale = (value: string | undefined): Locale | undefined => {
    if (!value) return undefined;
    const normalized = value.toLowerCase();
    if (locales.includes(normalized as Locale)) {
      return normalized as Locale;
    }
    const prefix = normalized.split(/[-_]/)[0];
    if (locales.includes(prefix as Locale)) {
      return prefix as Locale;
    }
    return undefined;
  };

  // Determine course locale (normalize locale variants like ar-SA)
  const resolvedFallback = normalizeLocale(fallbackLocale) || 'en';
  const courseLocale: Locale = normalizeLocale(courseLanguage) || resolvedFallback;

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      const loaded = await loadTranslations(courseLocale);
      if (mounted) {
        setTranslations(loaded);
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [courseLocale]);

  // Translation functions
  const t = (key: string, params?: Record<string, any>): string => {
    if (!translations || loading) {
      return key; // Return key while loading
    }

    const fullKey = `courses.${key}`;
    let value = getNestedValue(translations, fullKey);
    
    // If not found in courses namespace, try direct key
    if (value === fullKey) {
      value = getNestedValue(translations, key);
    }

    // Replace params if provided
    // Support both {param} and {{param}} formats (next-intl uses {{param}})
    if (params && typeof value === 'string') {
      // First replace double braces {{param}} (next-intl format)
      value = value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
      // Then replace single braces {param} (fallback format)
      value = value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  const tCommon = (key: string, params?: Record<string, any>): string => {
    if (!translations || loading) {
      return key;
    }

    const fullKey = `common.${key}`;
    let value = getNestedValue(translations, fullKey);
    
    // Replace params if provided
    // Support both {param} and {{param}} formats (next-intl uses {{param}})
    if (params && typeof value === 'string') {
      // First replace double braces {{param}} (next-intl format)
      value = value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
      // Then replace single braces {param} (fallback format)
      value = value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  return {
    t,
    tCommon,
    courseLocale,
    loading,
  };
}
