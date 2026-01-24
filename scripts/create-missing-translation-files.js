/**
 * Create Missing Translation Files
 * 
 * Generates complete translation files for: vi, id, ar, pt, hi
 * Based on English template with comprehensive translations
 */

const fs = require('fs');
const path = require('path');

const enTranslations = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'messages/en.json'), 'utf-8')
);

// Comprehensive translation dictionaries
// These are high-quality, native-level translations for all UI strings

const translationMaps = {
  vi: require('./translation-dictionaries/vi.json'),
  id: require('./translation-dictionaries/id.json'),
  ar: require('./translation-dictionaries/ar.json'),
  pt: require('./translation-dictionaries/pt.json'),
  hi: require('./translation-dictionaries/hi.json'),
};

// Function to recursively translate an object
function translateObject(obj, translations, prefix = '') {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Nested object - recurse
      result[key] = translateObject(value, translations, fullKey);
    } else if (typeof value === 'string') {
      // String value - translate if available
      const translated = getNestedValue(translations, fullKey);
      result[key] = translated !== undefined ? translated : value;
    } else {
      // Other types - keep as is
      result[key] = value;
    }
  }
  
  return result;
}

function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

// Generate translation files for each missing language
const missingLanguages = ['vi', 'id', 'ar', 'pt', 'hi'];

for (const lang of missingLanguages) {
  try {
    const translations = translationMaps[lang];
    if (!translations) {
      console.log(`⚠️  No translation dictionary found for ${lang}, creating from English template...`);
      // Create a placeholder file that can be filled in later
      const placeholder = JSON.parse(JSON.stringify(enTranslations));
      fs.writeFileSync(
        path.join(process.cwd(), 'messages', `${lang}.json`),
        JSON.stringify(placeholder, null, 2),
        'utf-8'
      );
      console.log(`✅ Created placeholder ${lang}.json (needs translation)`);
      continue;
    }
    
    const translated = translateObject(enTranslations, translations);
    fs.writeFileSync(
      path.join(process.cwd(), 'messages', `${lang}.json`),
      JSON.stringify(translated, null, 2),
      'utf-8'
    );
    console.log(`✅ Created messages/${lang}.json`);
  } catch (error) {
    console.error(`❌ Failed to create ${lang}.json:`, error.message);
    // Create placeholder file as fallback
    const placeholder = JSON.parse(JSON.stringify(enTranslations));
    fs.writeFileSync(
      path.join(process.cwd(), 'messages', `${lang}.json`),
      JSON.stringify(placeholder, null, 2),
      'utf-8'
    );
    console.log(`⚠️  Created placeholder ${lang}.json (needs manual translation)`);
  }
}

console.log('\n✅ Translation file generation complete!');
console.log('Note: If placeholder files were created, they need to be translated manually.');
