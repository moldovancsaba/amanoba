/**
 * AI-Assisted Translation Generation Script
 * 
 * Generates translations using GPT-4 with glossary-assisted term consistency.
 * Preserves markdown structure, metadata, and relationships.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import connectDB from '../../app/lib/mongodb';
import { GlossaryEntry } from '../../app/lib/models';

interface TranslationUnit {
  type: 'course_metadata' | 'lesson_content' | 'quiz_question';
  id: string;
  source_language: 'en';
  content: {
    name?: string;
    description?: string;
    title?: string;
    content?: string;
    emailSubject?: string;
    emailBody?: string;
    question?: string;
    correctAnswer?: string;
    wrongAnswers?: string[];
    explanation?: string;
  };
  metadata: {
    dayNumber?: number;
    lessonId?: string;
    courseId?: string;
    difficulty?: string;
    category?: string;
  };
}

interface ExtractedCourse {
  courseId: string;
  ccsId: string;
  source_language: 'en';
  units: TranslationUnit[];
  word_count: number;
  estimated_cost_usd: number;
}

interface TranslatedCourse extends Omit<ExtractedCourse, 'source_language'> {
  target_language: string;
  translation_metadata: {
    translated_at: string;
    translation_method: 'ai_assisted' | 'human_review';
    glossary_terms_used: number;
    total_units: number;
  };
}

/**
 * Load glossary terms for target language
 */
async function loadGlossary(targetLanguage: string): Promise<Map<string, string>> {
  await connectDB();
  
  const entries = await GlossaryEntry.find({}).lean();
  const glossary = new Map<string, string>();
  
  for (const entry of entries) {
    const translation = (entry.translations as any)[targetLanguage];
    if (translation) {
      glossary.set(entry.term_en, translation);
    }
  }
  
  console.log(`Loaded ${glossary.size} glossary terms for ${targetLanguage}`);
  return glossary;
}

/**
 * Mock translation function (simulates GPT-4 translation)
 * 
 * In production, this would call OpenAI GPT-4 API with:
 * - System prompt: "Translate from English to {language}. Use these glossary terms: {terms}"
 * - User prompt: {text to translate}
 * - Temperature: 0.3 (consistent translations)
 * 
 * For this POC, we'll use placeholder translations with glossary terms.
 */
async function translateText(
  text: string,
  targetLanguage: string,
  glossary: Map<string, string>
): Promise<string> {
  if (!text || text.trim().length === 0) {
    return text;
  }

  // In production, this would be:
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4',
  //   messages: [
  //     { role: 'system', content: `Translate from English to ${languageName}. Use these glossary terms: ${glossaryPrompt}` },
  //     { role: 'user', content: text }
  //   ],
  //   temperature: 0.3
  // });
  // return response.choices[0].message.content;

  // POC: Return placeholder with language prefix
  let translated = `[${targetLanguage.toUpperCase()}] ${text}`;
  
  // Replace glossary terms
  for (const [englishTerm, translatedTerm] of glossary.entries()) {
    const regex = new RegExp(`\\b${englishTerm}\\b`, 'gi');
    translated = translated.replace(regex, translatedTerm);
  }
  
  return translated;
}

/**
 * Translate a single content unit
 */
async function translateUnit(
  unit: TranslationUnit,
  targetLanguage: string,
  glossary: Map<string, string>
): Promise<TranslationUnit> {
  const translatedContent: any = {};
  
  for (const [key, value] of Object.entries(unit.content)) {
    if (typeof value === 'string') {
      translatedContent[key] = await translateText(value, targetLanguage, glossary);
    } else if (Array.isArray(value)) {
      // Translate arrays (e.g., wrongAnswers)
      translatedContent[key] = await Promise.all(
        value.map(item => translateText(item, targetLanguage, glossary))
      );
    } else {
      translatedContent[key] = value;
    }
  }
  
  return {
    ...unit,
    content: translatedContent,
  };
}

/**
 * Generate translation for entire course
 */
async function generateTranslation(
  extractedJSON: ExtractedCourse,
  targetLanguage: string
): Promise<TranslatedCourse> {
  console.log(`\nGenerating ${targetLanguage} translation...`);
  console.log('='.repeat(70));
  
  // Load glossary
  const glossary = await loadGlossary(targetLanguage);
  
  // Translate all units
  const translatedUnits: TranslationUnit[] = [];
  let completedUnits = 0;
  
  for (const unit of extractedJSON.units) {
    const translated = await translateUnit(unit, targetLanguage, glossary);
    translatedUnits.push(translated);
    completedUnits++;
    
    if (completedUnits % 5 === 0) {
      console.log(`  Translated ${completedUnits}/${extractedJSON.units.length} units...`);
    }
  }
  
  console.log(`  ✓ Translated ${completedUnits}/${extractedJSON.units.length} units`);
  
  return {
    courseId: `${extractedJSON.courseId}_${targetLanguage.toUpperCase()}`,
    ccsId: extractedJSON.ccsId,
    target_language: targetLanguage,
    units: translatedUnits,
    word_count: extractedJSON.word_count,
    estimated_cost_usd: extractedJSON.estimated_cost_usd,
    translation_metadata: {
      translated_at: new Date().toISOString(),
      translation_method: 'ai_assisted',
      glossary_terms_used: glossary.size,
      total_units: translatedUnits.length,
    },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const inputIndex = args.indexOf('--input');
  const languageIndex = args.indexOf('--language');
  const outputIndex = args.indexOf('--output');

  if (inputIndex === -1 || languageIndex === -1) {
    console.error('Usage: npm run translate:generate -- --input EXTRACTED_JSON --language LANG_CODE [--output OUTPUT_PATH]');
    console.error('Example: npm run translate:generate -- --input output/translate/AI_DUMMIES_1DAY.json --language es');
    process.exit(1);
  }

  const inputPath = args[inputIndex + 1];
  const targetLanguage = args[languageIndex + 1];
  const outputPath = outputIndex !== -1 
    ? args[outputIndex + 1] 
    : inputPath.replace('/translate/', '/translated/').replace('.json', `_${targetLanguage.toUpperCase()}.json`);

  try {
    console.log('='.repeat(70));
    console.log('AI-Assisted Translation Generation');
    console.log('='.repeat(70));
    console.log(`Input: ${inputPath}`);
    console.log(`Target Language: ${targetLanguage}`);
    console.log(`Output: ${outputPath}`);

    // Load extracted course
    const extractedJSON: ExtractedCourse = JSON.parse(readFileSync(inputPath, 'utf-8'));
    
    // Generate translation
    const translatedCourse = await generateTranslation(extractedJSON, targetLanguage);
    
    // Save to file
    writeFileSync(outputPath, JSON.stringify(translatedCourse, null, 2));

    console.log('\n' + '='.repeat(70));
    console.log('Translation Generation Complete');
    console.log('='.repeat(70));
    console.log(`  Course: ${translatedCourse.courseId}`);
    console.log(`  CCS ID: ${translatedCourse.ccsId}`);
    console.log(`  Language: ${translatedCourse.target_language}`);
    console.log(`  Units Translated: ${translatedCourse.translation_metadata.total_units}`);
    console.log(`  Glossary Terms Used: ${translatedCourse.translation_metadata.glossary_terms_used}`);
    console.log(`  Translation Method: ${translatedCourse.translation_metadata.translation_method}`);
    console.log(`  Output: ${outputPath}`);
    console.log('='.repeat(70));
    console.log('\n⚠️  NOTE: This is a POC translation with placeholder text.');
    console.log('   For production, replace translateText() with OpenAI GPT-4 API calls.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Translation generation failed:', error);
    process.exit(1);
  }
}

main();
