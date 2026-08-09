/**
 * Translation Quality Validation Script
 * 
 * Validates translated content against STRICT quality standards.
 * Detects language leakage, checks structure completeness, enforces quality thresholds.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { enforceLessonQuality, enforceQuizQuestionQuality, EnforcementLevel } from '../../app/lib/content-quality/enforcement';

interface ValidationReport {
  language: string;
  overall_status: 'pass' | 'fail';
  lessons: Array<{
    lessonId: string;
    title: string;
    quality_score: number;
    enforcement_action: string;
    language_leakage: {
      detected: boolean;
      suspicious_words: string[];
    };
    errors: string[];
    warnings: string[];
  }>;
  quiz_questions: Array<{
    uuid: string;
    question_preview: string;
    quality_score: number;
    enforcement_action: string;
    errors: string[];
  }>;
  summary: {
    total_units: number;
    passed: number;
    failed: number;
    avg_quality_score: number;
  };
}

/**
 * Detect potential English leakage in translated content
 */
function detectEnglishLeakage(content: string, targetLanguage: string): {
  detected: boolean;
  suspicious_words: string[];
} {
  if (targetLanguage === 'en') {
    return { detected: false, suspicious_words: [] };
  }

  // Common English words that shouldn't appear in translations
  const commonEnglishWords = [
    'the', 'is', 'are', 'was', 'were', 'have', 'has', 'had',
    'this', 'that', 'these', 'those', 'will', 'would', 'should',
    'could', 'can', 'may', 'might', 'must', 'what', 'where',
    'when', 'why', 'how', 'who', 'which', 'there', 'here'
  ];

  // Allowed English technical terms (not counted as leakage)
  const allowedTechnicalTerms = [
    'AI', 'ML', 'API', 'SDK', 'UI', 'UX', 'cloud', 'data',
    'software', 'hardware', 'app', 'web', 'online', 'email'
  ];

  const words = content.toLowerCase().match(/\b[a-z]+\b/g) || [];
  const suspicious: string[] = [];

  for (const word of words) {
    if (word.length > 2 && 
        commonEnglishWords.includes(word) && 
        !allowedTechnicalTerms.includes(word.toUpperCase())) {
      if (!suspicious.includes(word)) {
        suspicious.push(word);
      }
    }
  }

  return {
    detected: suspicious.length > 5, // Threshold: >5 suspicious words
    suspicious_words: suspicious.slice(0, 10) // Show first 10
  };
}

async function validateTranslation(
  translatedJSON: any,
  targetLanguage: string
): Promise<ValidationReport> {
  const report: ValidationReport = {
    language: targetLanguage,
    overall_status: 'pass',
    lessons: [],
    quiz_questions: [],
    summary: { total_units: 0, passed: 0, failed: 0, avg_quality_score: 0 }
  };

  console.log(`\nValidating translation for language: ${targetLanguage}`);
  console.log('='.repeat(70));

  // Validate lessons
  const lessonUnits = translatedJSON.units.filter((u: any) => u.type === 'lesson_content');
  console.log(`\nValidating ${lessonUnits.length} lessons...`);

  for (const unit of lessonUnits) {
    const leakage = detectEnglishLeakage(unit.content.content || '', targetLanguage);

    const validation = enforceLessonQuality({
      lessonId: unit.metadata.lessonId,
      dayNumber: unit.metadata.dayNumber,
      language: targetLanguage,
      title: unit.content.title,
      content: unit.content.content,
      emailSubject: unit.content.emailSubject,
      emailBody: unit.content.emailBody,
      pointsReward: 100,
      xpReward: 50,
      isActive: true,
      displayOrder: 1
    }, EnforcementLevel.STRICT);

    const lessonResult = {
      lessonId: unit.metadata.lessonId,
      title: unit.content.title || 'Untitled',
      quality_score: validation.validation.qualityScore || 0,
      enforcement_action: validation.enforcement.action,
      language_leakage: leakage,
      errors: validation.validation.errors || [],
      warnings: validation.validation.warnings || []
    };

    report.lessons.push(lessonResult);

    const passed = validation.allowed && !leakage.detected;
    if (passed) {
      report.summary.passed++;
      console.log(`  ✓ ${lessonResult.title} (Score: ${lessonResult.quality_score})`);
    } else {
      report.summary.failed++;
      report.overall_status = 'fail';
      console.log(`  ✗ ${lessonResult.title} (Score: ${lessonResult.quality_score})`);
      if (leakage.detected) {
        console.log(`    Language leakage detected: ${leakage.suspicious_words.join(', ')}`);
      }
      if (lessonResult.errors.length > 0) {
        console.log(`    Errors: ${lessonResult.errors.length}`);
      }
    }
  }

  // Validate quiz questions
  const quizUnits = translatedJSON.units.filter((u: any) => u.type === 'quiz_question');
  console.log(`\nValidating ${quizUnits.length} quiz questions...`);

  for (const unit of quizUnits) {
    const validation = enforceQuizQuestionQuality({
      uuid: unit.id,
      question: unit.content.question,
      correctAnswer: unit.content.correctAnswer,
      wrongAnswers: unit.content.wrongAnswers,
      explanation: unit.content.explanation,
      difficulty: unit.metadata.difficulty || 'MEDIUM',
      category: unit.metadata.category || 'Course Specific',
      questionType: 'application',
      hashtags: [],
      isCourseSpecific: true,
      isActive: true,
      showCount: 0,
      correctCount: 0
    }, {
      level: EnforcementLevel.STRICT,
      context: 'translation_validation',
      enforcedBy: 'system',
      expectedLanguage: targetLanguage
    });

    const quizResult = {
      uuid: unit.id,
      question_preview: (unit.content.question || '').substring(0, 60),
      quality_score: validation.validation.qualityScore || 0,
      enforcement_action: validation.enforcement.action,
      errors: validation.validation.errors || []
    };

    report.quiz_questions.push(quizResult);

    if (validation.allowed) {
      report.summary.passed++;
      console.log(`  ✓ Quiz (Score: ${quizResult.quality_score})`);
    } else {
      report.summary.failed++;
      report.overall_status = 'fail';
      console.log(`  ✗ Quiz (Score: ${quizResult.quality_score})`);
    }
  }

  // Calculate summary
  report.summary.total_units = report.lessons.length + report.quiz_questions.length;
  const allScores = [
    ...report.lessons.map(l => l.quality_score),
    ...report.quiz_questions.map(q => q.quality_score)
  ];
  report.summary.avg_quality_score = allScores.length > 0
    ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
    : 0;

  return report;
}

async function main() {
  const args = process.argv.slice(2);
  const inputIndex = args.indexOf('--input');
  const languageIndex = args.indexOf('--language');

  if (inputIndex === -1 || languageIndex === -1) {
    console.error('Usage: npm run translate:validate -- --input TRANSLATED_JSON --language LANG_CODE');
    console.error('Example: npm run translate:validate -- --input translated/AI_DUMMIES_1DAY_ES.json --language es');
    process.exit(1);
  }

  const inputPath = args[inputIndex + 1];
  const language = args[languageIndex + 1];

  try {
    console.log('='.repeat(70));
    console.log('Translation Quality Validation');
    console.log('='.repeat(70));

    const translatedJSON = JSON.parse(readFileSync(inputPath, 'utf-8'));
    const report = await validateTranslation(translatedJSON, language);

    // Save report
    const reportPath = inputPath.replace('.json', '_validation_report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('\n' + '='.repeat(70));
    console.log('VALIDATION SUMMARY');
    console.log('='.repeat(70));
    console.log(`Language: ${report.language}`);
    console.log(`Overall Status: ${report.overall_status.toUpperCase()}`);
    console.log(`Total Units: ${report.summary.total_units}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Average Quality Score: ${report.summary.avg_quality_score}/100`);
    console.log(`Report saved: ${reportPath}`);
    console.log('='.repeat(70));

    process.exit(report.overall_status === 'pass' ? 0 : 1);
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

main();
