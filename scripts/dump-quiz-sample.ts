/**
 * Dump a single lesson's quiz as a readable sample (for review after pipeline run).
 * Usage: npx tsx --env-file=.env.local scripts/dump-quiz-sample.ts LESSON_ID [--out path]
 * Example: npx tsx --env-file=.env.local scripts/dump-quiz-sample.ts GEO_SHOPIFY_30_EN_DAY_11
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { writeFileSync, mkdirSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

const LESSON_ID = process.argv[2];
const outArg = process.argv.indexOf('--out');
const OUT_DIR = outArg >= 0 && process.argv[outArg + 1]
  ? resolve(process.argv[outArg + 1])
  : join(process.cwd(), 'scripts', 'reports');

async function main() {
  if (!LESSON_ID) {
    console.error('Usage: npx tsx --env-file=.env.local scripts/dump-quiz-sample.ts LESSON_ID [--out path]');
    process.exit(1);
  }
  await connectDB();
  const lesson = await Lesson.findOne({ lessonId: LESSON_ID }).select('title dayNumber courseId').lean();
  if (!lesson) {
    console.error('Lesson not found:', LESSON_ID);
    process.exit(1);
  }
  const course = await Course.findOne({ _id: lesson.courseId }).select('courseId name language').lean();
  const questions = await QuizQuestion.find({
    lessonId: LESSON_ID,
    isActive: true,
  })
    .sort({ displayOrder: 1, _id: 1 })
    .select('question options correctIndex questionType difficulty')
    .lean();

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sample = {
    generatedAt: new Date().toISOString(),
    courseId: course?.courseId,
    courseName: course?.name,
    language: course?.language,
    lessonId: LESSON_ID,
    dayNumber: lesson.dayNumber,
    title: lesson.title,
    questionCount: questions.length,
    questions: questions.map((q, i) => ({
      index: i + 1,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      questionType: q.questionType,
      difficulty: q.difficulty,
    })),
  };
  mkdirSync(OUT_DIR, { recursive: true });
  const jsonPath = join(OUT_DIR, `quiz-sample__${LESSON_ID}__${stamp}.json`);
  writeFileSync(jsonPath, JSON.stringify(sample, null, 2));
  console.log('Sample written:', jsonPath);
  console.log(`${questions.length} questions for ${lesson.title}`);
  process.exit(0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
