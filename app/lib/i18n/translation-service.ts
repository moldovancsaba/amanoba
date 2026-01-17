/**
 * Translation Service
 * 
 * What: Fetches translations from MongoDB and formats them for next-intl
 * Why: Centralized translation management from database
 * 
 * Note: This is a server-only module - it should never be imported in client components
 */

import 'server-only';

import connectDB from '../mongodb';
import { Translation } from '../models';
import { logger } from '../logger';

/**
 * Get all translations for a locale
 * 
 * @param locale - Language code (e.g., 'hu', 'en')
 * @returns Nested object structure compatible with next-intl
 */
export async function getTranslationsForLocale(locale: string): Promise<Record<string, any>> {
  try {
    await connectDB();

    const translations = await Translation.find({ locale }).lean();

    // Transform flat translations into nested structure
    // Key format: "namespace.key" or just "key"
    const result: Record<string, any> = {};

    for (const translation of translations) {
      const { key, value, namespace } = translation;

      if (namespace) {
        // If namespace exists, nest under namespace
        if (!result[namespace]) {
          result[namespace] = {};
        }
        // Handle nested keys like "common.appName"
        const keyParts = key.split('.');
        if (keyParts.length > 1) {
          // If key already has namespace, use it
          const actualNamespace = keyParts[0];
          const actualKey = keyParts.slice(1).join('.');
          if (!result[actualNamespace]) {
            result[actualNamespace] = {};
          }
          setNestedValue(result[actualNamespace], actualKey, value);
        } else {
          result[namespace][key] = value;
        }
      } else {
        // No namespace, handle nested keys
        const keyParts = key.split('.');
        if (keyParts.length > 1) {
          const namespace = keyParts[0];
          const actualKey = keyParts.slice(1).join('.');
          if (!result[namespace]) {
            result[namespace] = {};
          }
          setNestedValue(result[namespace], actualKey, value);
        } else {
          result[key] = value;
        }
      }
    }

    return result;
  } catch (error) {
    logger.error({ error, locale }, 'Failed to fetch translations from database');
    // Fallback to empty object
    return {};
  }
}

/**
 * Helper: Set nested value in object
 */
function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

/**
 * Seed translations from JSON file
 * 
 * @param locale - Language code
 * @param translations - Translation object from JSON file
 */
export async function seedTranslations(
  locale: string,
  translations: Record<string, any>
): Promise<void> {
  try {
    await connectDB();

    const flatTranslations: Array<{ key: string; locale: string; value: string; namespace?: string }> = [];

    // Flatten nested object
    function flatten(obj: any, prefix = '', namespace?: string): void {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Nested object, recurse
          flatten(value, fullKey, namespace || key);
        } else {
          // Leaf value
          flatTranslations.push({
            key: fullKey,
            locale,
            value: String(value),
            namespace: namespace || (prefix ? prefix.split('.')[0] : undefined),
          });
        }
      }
    }

    flatten(translations);

    // Upsert translations
    for (const translation of flatTranslations) {
      await Translation.findOneAndUpdate(
        { locale: translation.locale, key: translation.key },
        {
          ...translation,
          metadata: {
            lastUpdated: new Date(),
            source: 'seed',
          },
        },
        { upsert: true, new: true }
      );
    }

    logger.info({ locale, count: flatTranslations.length }, 'Translations seeded successfully');
  } catch (error) {
    logger.error({ error, locale }, 'Failed to seed translations');
    throw error;
  }
}
