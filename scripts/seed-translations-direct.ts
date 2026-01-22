/**
 * Seed Translations Script (Direct MongoDB Access)
 * 
 * What: Seeds translations from JSON files into MongoDB
 * Why: Initial population of translation database
 * 
 * Usage: npm run seed:translations
 * 
 * Note: This script directly accesses MongoDB to avoid server-only restrictions
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local explicitly to match other seed scripts
config({ path: resolve(process.cwd(), '.env.local') });
import mongoose from 'mongoose';
import { Translation } from '../app/lib/models';
import { logger } from '../app/lib/logger';
import fs from 'fs';
import path from 'path';

const locales = ['hu', 'en', 'ru'];
const messagesDir = path.join(process.cwd(), 'messages');

async function seedTranslations() {
  logger.info('Starting translation seeding...');
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI not defined in .env.local');
  }
  await mongoose.connect(mongoUri);

  for (const locale of locales) {
    const filePath = path.join(messagesDir, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
      logger.warn(`Translation file not found for locale: ${locale}. Skipping.`);
      continue;
    }

    const messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Flatten nested object
    function flatten(obj: any, prefix = '', namespace?: string): Array<{ key: string; locale: string; value: string; namespace?: string }> {
      const result: Array<{ key: string; locale: string; value: string; namespace?: string }> = [];
      
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Nested object, recurse
          result.push(...flatten(value, fullKey, namespace || key));
        } else {
          // Leaf value
          result.push({
            key: fullKey,
            locale,
            value: String(value),
            namespace: namespace || (prefix ? prefix.split('.')[0] : undefined),
          });
        }
      }
      
      return result;
    }

    const flatTranslations = flatten(messages);

    // Upsert translations
    for (const translation of flatTranslations) {
      await Translation.findOneAndUpdate(
        { locale: translation.locale, namespace: translation.namespace || 'common', key: translation.key },
        {
          locale: translation.locale,
          namespace: translation.namespace || 'common',
          key: translation.key,
          value: translation.value,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      logger.debug(`Seeded: ${locale}.${translation.namespace || 'common'}.${translation.key}`);
    }
    logger.info(`Seeding complete for locale: ${locale} (${flatTranslations.length} translations)`);
  }

  logger.info('All translations seeded successfully.');
  process.exit(0);
}

seedTranslations().catch((error) => {
  logger.error({ error }, 'Translation seeding failed');
  process.exit(1);
});
