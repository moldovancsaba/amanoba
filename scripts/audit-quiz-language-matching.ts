/**
 * DEEP AUDIT: Quiz Question Language Matching
 * 
 * Purpose: Verify that ALL quiz questions are in the SAME language as their course/lesson
 * Why: Critical requirement - questions must match course language
 * 
 * What this audits:
 * 1. Check existing database questions - verify language matches lessonId language
 * 2. Check seed scripts - verify all questions are in correct language
 * 3. Report any mismatches
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

const COURSE_ID_BASE = 'PRODUCTIVITY_2026';
const LANGUAGES = ['HU', 'EN', 'TR', 'BG', 'PL', 'VI', 'ID', 'AR', 'PT', 'HI'];

interface LanguageMismatch {
  questionId: string;
  lessonId: string;
  expectedLanguage: string;
  actualLanguage: string;
  questionText: string;
}

interface AuditResult {
  day: number;
  language: string;
  lessonId: string;
  courseId: string;
  questionCount: number;
  mismatches: LanguageMismatch[];
  hasEnglishFallback: boolean;
}

/**
 * Detect language from text (basic heuristics)
 */
function detectLanguage(text: string): string {
  // Hungarian indicators
  if (/[áéíóöőúüű]/.test(text) || text.includes('szerint') || text.includes('lecke')) return 'HU';
  
  // Turkish indicators
  if (/[çğıöşü]/.test(text) || text.includes('Derse göre') || text.includes('nedir')) return 'TR';
  
  // Bulgarian indicators (Cyrillic)
  if (/[а-яА-Я]/.test(text)) return 'BG';
  
  // Polish indicators
  if (/[ąćęłńóśźż]/.test(text) || text.includes('Według lekcji')) return 'PL';
  
  // Vietnamese indicators
  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/.test(text) || text.includes('Theo bài học')) return 'VI';
  
  // Indonesian indicators
  if (text.includes('Menurut pelajaran') || text.includes('Menurut')) return 'ID';
  
  // Arabic indicators (RTL)
  if (/[ا-ي]/.test(text) || text.includes('وفقًا للدرس')) return 'AR';
  
  // Portuguese indicators
  if (/[ãõáéíóúâêôç]/.test(text) || text.includes('De acordo com a lição')) return 'PT';
  
  // Hindi indicators (Devanagari)
  if (/[अ-ह]/.test(text) || text.includes('पाठ के अनुसार')) return 'HI';
  
  // Default to English if no indicators found
  return 'EN';
}

async function auditQuizLanguageMatching() {
  try {
    await connectDB();
    console.log('🔍 DEEP AUDIT: Quiz Question Language Matching\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const results: AuditResult[] = [];
    const allMismatches: LanguageMismatch[] = [];

    // Check Days 1-30
    for (let day = 1; day <= 30; day++) {
      for (const lang of LANGUAGES) {
        const courseId = `${COURSE_ID_BASE}_${lang}`;
        const lessonId = `${COURSE_ID_BASE}_${lang}_DAY_${day}`;

        // Find lesson
        const lesson = await Lesson.findOne({ lessonId }).lean();
        if (!lesson) {
          continue; // Skip if lesson doesn't exist
        }

        // Find all questions for this lesson
        const questions = await QuizQuestion.find({
          lessonId,
          isCourseSpecific: true,
        }).lean();

        if (questions.length === 0) {
          continue; // Skip if no questions
        }

        const mismatches: LanguageMismatch[] = [];
        let hasEnglishFallback = false;

        // Check each question
        for (const q of questions) {
          const detectedLang = detectLanguage(q.question);
          
          // Expected language from lessonId (extract from lessonId: PRODUCTIVITY_2026_HU_DAY_12 -> HU)
          const expectedLang = lang;
          
          if (detectedLang !== expectedLang) {
            mismatches.push({
              questionId: q._id.toString(),
              lessonId: lessonId,
              expectedLanguage: expectedLang,
              actualLanguage: detectedLang,
              questionText: q.question.substring(0, 100) + '...',
            });
            allMismatches.push({
              questionId: q._id.toString(),
              lessonId: lessonId,
              expectedLanguage: expectedLang,
              actualLanguage: detectedLang,
              questionText: q.question.substring(0, 100) + '...',
            });
          }
          
          // Check if using English fallback
          if (detectedLang === 'EN' && expectedLang !== 'EN') {
            hasEnglishFallback = true;
          }
        }

        if (questions.length > 0) {
          results.push({
            day,
            language: lang,
            lessonId,
            courseId,
            questionCount: questions.length,
            mismatches,
            hasEnglishFallback,
          });
        }
      }
    }

    // Report results
    console.log('\n📊 AUDIT RESULTS:\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    let totalQuestions = 0;
    let totalMismatches = 0;
    let daysWithIssues = new Set<number>();

    for (const result of results) {
      totalQuestions += result.questionCount;
      if (result.mismatches.length > 0 || result.hasEnglishFallback) {
        totalMismatches += result.mismatches.length;
        daysWithIssues.add(result.day);
        
        console.log(`⚠️  Day ${result.day} - ${result.language}:`);
        console.log(`   Lesson: ${result.lessonId}`);
        console.log(`   Questions: ${result.questionCount}`);
        if (result.mismatches.length > 0) {
          console.log(`   ❌ LANGUAGE MISMATCHES: ${result.mismatches.length}`);
          result.mismatches.slice(0, 3).forEach(m => {
            console.log(`      - Expected: ${m.expectedLanguage}, Detected: ${m.actualLanguage}`);
            console.log(`        Q: ${m.questionText}`);
          });
        }
        if (result.hasEnglishFallback) {
          console.log(`   ⚠️  Using English fallback (some questions may be in English instead of ${result.language})`);
        }
        console.log('');
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════════\n');
    console.log(`📈 SUMMARY:\n`);
    console.log(`   Total questions audited: ${totalQuestions}`);
    console.log(`   Total language mismatches: ${totalMismatches}`);
    console.log(`   Days with issues: ${daysWithIssues.size} (${Array.from(daysWithIssues).sort((a,b) => a-b).join(', ')})`);
    
    if (totalMismatches === 0 && daysWithIssues.size === 0) {
      console.log(`\n✅ ALL QUESTIONS MATCH THEIR COURSE LANGUAGE!\n`);
    } else {
      console.log(`\n❌ ISSUES FOUND - Questions need language correction!\n`);
    }

    // Now check seed scripts
    console.log('\n═══════════════════════════════════════════════════════════════\n');
    console.log('🔍 CHECKING SEED SCRIPTS...\n');

    const fs = require('fs');
    const path = require('path');
    const scriptsDir = path.join(process.cwd(), 'scripts');
    const seedFiles = fs.readdirSync(scriptsDir)
      .filter((f: string) => f.startsWith('seed-day') && f.includes('enhanced') && f.endsWith('.ts'));

    let scriptIssues = 0;
    for (const file of seedFiles) {
      const filePath = path.join(scriptsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Check if file has empty language arrays
      const emptyLangMatches = content.match(/(TR|BG|PL|VI|ID|AR|PT|HI):\s*\[\s*\]/g);
      if (emptyLangMatches) {
        console.log(`⚠️  ${file}: Has empty language arrays: ${emptyLangMatches.length} languages missing`);
        scriptIssues += emptyLangMatches.length;
      }
      
      // Check for English fallback comments
      if (content.includes('Fallback to EN') || content.includes('using English as fallback')) {
        console.log(`⚠️  ${file}: Contains English fallback logic`);
        scriptIssues++;
      }
    }

    if (scriptIssues === 0) {
      console.log('✅ All seed scripts have proper language structure\n');
    } else {
      console.log(`\n❌ ${scriptIssues} issues found in seed scripts\n`);
    }

    process.exit(totalMismatches > 0 || scriptIssues > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

auditQuizLanguageMatching();
