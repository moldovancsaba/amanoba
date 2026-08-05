/**
 * Content Quality Validation Script
 *
 * What: Command-line script to validate lesson and quiz content quality
 * Why: Enable CI/CD integration and manual quality checks
 *
 * Usage:
 * npx tsx scripts/validate-content-quality.ts --file course-package.json
 * npx tsx scripts/validate-content-quality.ts --dir ./courses
 * npx tsx scripts/validate-content-quality.ts --lesson lesson.json --strict
 */

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import {
  validateLesson,
  validateQuizQuestion,
  validateQuizDistribution,
  type LessonValidatorInput,
  type QuizQuestionValidatorInput,
} from '../app/lib/validators/content-standards';
import {
  enforceCourseQuality,
  EnforcementLevel,
  type BatchEnforcementResult,
} from '../app/lib/content-quality/enforcement';

const program = new Command();

program
  .name('validate-content-quality')
  .description('Validate lesson and quiz content quality')
  .version('1.0.0');

program
  .option('-f, --file <path>', 'Validate a single course package JSON file')
  .option('-d, --dir <path>', 'Validate all JSON files in a directory')
  .option('-l, --lesson <path>', 'Validate a single lesson JSON file')
  .option('-q, --quiz <path>', 'Validate a single quiz question JSON file')
  .option('--strict', 'Use STRICT enforcement level (default)')
  .option('--moderate', 'Use MODERATE enforcement level')
  .option('--permissive', 'Use PERMISSIVE enforcement level')
  .option('--json', 'Output results as JSON')
  .option('--fail-on-warning', 'Exit with error code on warnings (not just errors)')
  .parse(process.argv);

const options = program.opts();

// Determine enforcement level
let enforcementLevel = EnforcementLevel.STRICT;
if (options.moderate) {
  enforcementLevel = EnforcementLevel.MODERATE;
} else if (options.permissive) {
  enforcementLevel = EnforcementLevel.PERMISSIVE;
}

interface ValidationSummary {
  totalFiles: number;
  passedFiles: number;
  failedFiles: number;
  warnings: number;
  errors: number;
  overallQualityScore: number;
  files: Array<{
    path: string;
    passed: boolean;
    qualityScore?: number;
    errors?: string[];
    warnings?: string[];
  }>;
}

/**
 * Validate a course package file
 */
function validateCoursePackage(filePath: string): BatchEnforcementResult {
  const content = fs.readFileSync(filePath, 'utf-8');
  const packageData = JSON.parse(content);

  // Extract lessons from package format
  let lessons = packageData.lessons || [];
  if (!Array.isArray(lessons) && packageData.course && packageData.course.lessons) {
    lessons = packageData.course.lessons;
  }

  // Run batch enforcement
  const result = enforceCourseQuality(lessons, {
    level: enforcementLevel,
    context: 'cli_validation',
    enforcedBy: 'content-quality-script',
    expectedLanguage: packageData.course?.language || packageData.language || 'en',
  });

  return result;
}

/**
 * Validate a single lesson file
 */
function validateLessonFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lesson = JSON.parse(content) as Partial<LessonValidatorInput>;

  const result = validateLesson(lesson);
  return result;
}

/**
 * Validate a single quiz question file
 */
function validateQuizFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const question = JSON.parse(content) as Partial<QuizQuestionValidatorInput>;

  const result = validateQuizQuestion(question);
  return result;
}

/**
 * Main validation logic
 */
async function main() {
  const summary: ValidationSummary = {
    totalFiles: 0,
    passedFiles: 0,
    failedFiles: 0,
    warnings: 0,
    errors: 0,
    overallQualityScore: 0,
    files: [],
  };

  try {
    if (options.file) {
      // Validate single course package
      console.log(`\n📋 Validating course package: ${options.file}`);
      console.log(`   Enforcement level: ${enforcementLevel}\n`);

      const result = validateCoursePackage(options.file);

      summary.totalFiles = 1;
      summary.overallQualityScore = result.summary.overallQualityScore;

      if (result.allowed) {
        summary.passedFiles = 1;
        console.log('✅ Course package passed quality gates\n');
      } else {
        summary.failedFiles = 1;
        console.log('❌ Course package FAILED quality gates\n');
      }

      // Print summary
      console.log('📊 Summary:');
      console.log(`   Total lessons: ${result.summary.totalLessons}`);
      console.log(`   Passed lessons: ${result.summary.passedLessons}`);
      console.log(`   Blocked lessons: ${result.summary.blockedLessons}`);
      console.log(`   Total questions: ${result.summary.totalQuestions}`);
      console.log(`   Passed questions: ${result.summary.passedQuestions}`);
      console.log(`   Blocked questions: ${result.summary.blockedQuestions}`);
      console.log(`   Overall quality score: ${result.summary.overallQualityScore.toFixed(1)}/100\n`);

      if (result.recommendations.length > 0) {
        console.log('💡 Recommendations:');
        result.recommendations.forEach((rec) => console.log(`   ${rec}`));
        console.log();
      }

      // Show lesson-level issues
      const blockedLessons = result.lessons.filter((l) => !l.allowed);
      if (blockedLessons.length > 0) {
        console.log('❌ Blocked Lessons:');
        blockedLessons.forEach((lesson) => {
          console.log(`   • ${lesson.lessonId}: ${lesson.enforcement.reason}`);
          if (lesson.validation.errors.length > 0) {
            lesson.validation.errors.forEach((err) => console.log(`     - ${err}`));
          }
        });
        console.log();
      }

      // Show question-level issues
      for (const [lessonId, questions] of Object.entries(result.questions)) {
        const blockedQuestions = questions.filter((q) => !q.allowed);
        if (blockedQuestions.length > 0) {
          console.log(`❌ Blocked Questions in ${lessonId}:`);
          blockedQuestions.forEach((q, idx) => {
            console.log(`   • Question ${idx + 1}: ${q.enforcement.reason}`);
            if (q.validation.errors.length > 0) {
              q.validation.errors.slice(0, 2).forEach((err) => console.log(`     - ${err}`));
            }
          });
          console.log();
        }
      }

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      }

      // Exit with appropriate code
      if (!result.allowed) {
        process.exit(1);
      }
    } else if (options.dir) {
      // Validate directory of JSON files
      console.log(`\n📂 Validating directory: ${options.dir}\n`);

      const files = fs.readdirSync(options.dir).filter((f) => f.endsWith('.json'));
      summary.totalFiles = files.length;

      for (const file of files) {
        const filePath = path.join(options.dir, file);
        console.log(`\n📄 ${file}`);

        try {
          const result = validateCoursePackage(filePath);
          summary.overallQualityScore += result.summary.overallQualityScore;

          if (result.allowed) {
            summary.passedFiles++;
            console.log(`   ✅ Passed (score: ${result.summary.overallQualityScore.toFixed(1)})`);
            summary.files.push({
              path: filePath,
              passed: true,
              qualityScore: result.summary.overallQualityScore,
            });
          } else {
            summary.failedFiles++;
            console.log(`   ❌ Failed (score: ${result.summary.overallQualityScore.toFixed(1)})`);
            console.log(`      Blocked: ${result.summary.blockedLessons} lessons, ${result.summary.blockedQuestions} questions`);
            summary.files.push({
              path: filePath,
              passed: false,
              qualityScore: result.summary.overallQualityScore,
              errors: result.recommendations,
            });
          }
        } catch (error) {
          summary.failedFiles++;
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.log(`   ❌ Error: ${errorMessage}`);
          summary.files.push({
            path: filePath,
            passed: false,
            errors: [errorMessage],
          });
        }
      }

      summary.overallQualityScore = summary.totalFiles > 0 ? summary.overallQualityScore / summary.totalFiles : 0;

      console.log('\n\n📊 Overall Summary:');
      console.log(`   Total files: ${summary.totalFiles}`);
      console.log(`   Passed: ${summary.passedFiles}`);
      console.log(`   Failed: ${summary.failedFiles}`);
      console.log(`   Average quality score: ${summary.overallQualityScore.toFixed(1)}/100\n`);

      if (options.json) {
        console.log(JSON.stringify(summary, null, 2));
      }

      if (summary.failedFiles > 0) {
        process.exit(1);
      }
    } else if (options.lesson) {
      // Validate single lesson
      console.log(`\n📝 Validating lesson: ${options.lesson}\n`);

      const result = validateLessonFile(options.lesson);
      summary.totalFiles = 1;
      summary.overallQualityScore = result.qualityScore;

      if (result.isValid) {
        summary.passedFiles = 1;
        console.log(`✅ Lesson passed (score: ${result.qualityScore.toFixed(1)})\n`);
      } else {
        summary.failedFiles = 1;
        console.log(`❌ Lesson failed (score: ${result.qualityScore.toFixed(1)})\n`);
      }

      if (result.errors.length > 0) {
        console.log('❌ Errors:');
        result.errors.forEach((err) => console.log(`   • ${err}`));
        console.log();
      }

      if (result.warnings.length > 0) {
        console.log('⚠️  Warnings:');
        result.warnings.forEach((warn) => console.log(`   • ${warn}`));
        console.log();
      }

      if (result.details.missingSections.length > 0) {
        console.log('📋 Missing Sections:');
        result.details.missingSections.forEach((section) => console.log(`   • ${section}`));
        console.log();
      }

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      }

      if (!result.isValid || (options.failOnWarning && result.warnings.length > 0)) {
        process.exit(1);
      }
    } else if (options.quiz) {
      // Validate single quiz question
      console.log(`\n❓ Validating quiz question: ${options.quiz}\n`);

      const result = validateQuizFile(options.quiz);
      summary.totalFiles = 1;
      summary.overallQualityScore = result.qualityScore;

      if (result.isValid) {
        summary.passedFiles = 1;
        console.log(`✅ Question passed (score: ${result.qualityScore.toFixed(1)})\n`);
      } else {
        summary.failedFiles = 1;
        console.log(`❌ Question failed (score: ${result.qualityScore.toFixed(1)})\n`);
      }

      if (result.errors.length > 0) {
        console.log('❌ Errors:');
        result.errors.forEach((err) => console.log(`   • ${err}`));
        console.log();
      }

      if (result.warnings.length > 0) {
        console.log('⚠️  Warnings:');
        result.warnings.forEach((warn) => console.log(`   • ${warn}`));
        console.log();
      }

      console.log('📊 Details:');
      console.log(`   Standalone: ${result.details.standaloneComprehensible ? '✅' : '❌'}`);
      console.log(`   Natural language: ${result.details.naturalLanguage ? '✅' : '⚠️'}`);
      console.log(`   Plausible distractors: ${result.details.plausibleDistractors ? '✅' : '⚠️'}`);
      console.log(`   Type: ${result.details.questionType}`);
      console.log(`   Difficulty: ${result.details.difficulty}\n`);

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      }

      if (!result.isValid || (options.failOnWarning && result.warnings.length > 0)) {
        process.exit(1);
      }
    } else {
      console.error('❌ Error: Please specify --file, --dir, --lesson, or --quiz');
      program.help();
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Validation Error:');
    console.error(error);
    process.exit(1);
  }
}

main();
