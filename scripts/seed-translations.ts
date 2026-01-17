/**
 * Seed Translations Script
 * 
 * What: Seeds translations from JSON files into MongoDB
 * Why: Initial population of translation database
 * 
 * Usage: npm run seed:translations
 */

import { seedTranslations } from '../app/lib/i18n/translation-service';
import huTranslations from '../messages/hu.json';
import enTranslations from '../messages/en.json';

async function main() {
  try {
    console.log('Seeding translations...');

    // Seed Hungarian translations
    console.log('Seeding Hungarian translations...');
    await seedTranslations('hu', huTranslations as Record<string, any>);
    console.log('✅ Hungarian translations seeded');

    // Seed English translations
    console.log('Seeding English translations...');
    await seedTranslations('en', enTranslations as Record<string, any>);
    console.log('✅ English translations seeded');

    console.log('✅ All translations seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed translations:', error);
    process.exit(1);
  }
}

main();
