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
import type { Locale } from '@/i18n';

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
    // Load from JSON files (client-side compatible)
    const messages = await import(`@/messages/${locale}.json`);
    translationCache[locale] = messages.default;
    return messages.default;
  } catch (error) {
    console.error(`Failed to load translations for locale ${locale}:`, error);
    // Fallback to English if locale fails
    if (locale !== 'en') {
      const fallback = await import(`@/messages/en.json`);
      return fallback.default;
    }
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
export function useCourseTranslations(courseLanguage: string | undefined) {
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine course locale (fallback to 'en' if invalid)
  const courseLocale: Locale = 
    courseLanguage === 'hu' || courseLanguage === 'en' 
      ? (courseLanguage as Locale)
      : 'en';

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
    if (params && typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
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
    if (params && typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
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
