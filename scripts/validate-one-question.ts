/**
 * Validate One Question (Tiny-loop QA)
 *
 * Loads a single question from the DB by lesson and index, runs the quality validator,
 * and prints pass/fail and errors. Use after seeding one question to check before moving on.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/validate-one-question.ts --lesson-id LESSON_ID --question-index I
 *
 * Example (DONE_BETTER_2026_EN day 5, 3rd question, 0-based index 2):
 *   npx tsx --env-file=.env.local scripts/validate-one-question.ts --lesson-id DONE_BETTER_2026_EN_DAY_05 --question-index 2
 *
 * Reference: 2026_course_quality_prompt.md, docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';
import { validateQuestionQuality } from './question-quality-validator';

function getArg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i === -1) return undefined;
  return process.argv[i + 1];
}

const LESSON_ID = getArg('--lesson-id');
const QUESTION_INDEX = (() => {
  const v = getArg('--question-index');
  if (v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
})();

async function main() {
  if (!LESSON_ID || QUESTION_INDEX === undefined) {
    console.error('Usage: npx tsx --env-file=.env.local scripts/validate-one-question.ts --lesson-id LESSON_ID --question-index I');
    process.exit(1);
  }

  await connectDB();

  const lesson = await Lesson.findOne({ lessonId: LESSON_ID }).select('title content courseId').lean();
  if (!lesson) {
    console.error(`Lesson not found: ${LESSON_ID}`);
    process.exit(1);
  }

  const course = await Course.findOne({ _id: lesson.courseId }).select('language').lean();
  const language = course?.language ?? 'en';

  const questions = await QuizQuestion.find({
    lessonId: LESSON_ID,
    isActive: true,
  })
    .sort({ displayOrder: 1, _id: 1 })
    .lean();

  const q = questions[QUESTION_INDEX];
  if (!q) {
    console.error(`No question at index ${QUESTION_INDEX} (lesson has ${questions.length} questions, indices 0..${questions.length - 1})`);
    process.exit(1);
  }

  const result = validateQuestionQuality(
    q.question ?? '',
    q.options ?? [],
    (q.questionType as any) ?? 'application',
    (q.difficulty as any) ?? 'MEDIUM',
    language,
    lesson.title ?? '',
    lesson.content ?? ''
  );

  console.log(`Lesson: ${LESSON_ID}`);
  console.log(`Question index: ${QUESTION_INDEX} (displayOrder ${(q as any).displayOrder ?? '?'})`);
  console.log(`Question: ${(q.question ?? '').substring(0, 80)}${(q.question ?? '').length > 80 ? '...' : ''}`);
  console.log('');
  if (result.isValid) {
    console.log('✅ PASS');
    if (result.warnings.length) console.log('Warnings:', result.warnings);
  } else {
    console.log('❌ FAIL');
    console.log('Errors:', result.errors);
    if (result.warnings.length) console.log('Warnings:', result.warnings);
  }

  process.exit(result.isValid ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
