/**
 * Course AI Autopilot
 *
 * What: Create import-ready course packages and maintenance plans using local AI.
 * Why: Consolidates course creation and low-risk course maintenance into one workflow.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/course-ai-autopilot.ts create --topic "AI for sales" --language en --days 7 --apply
 *   npx tsx --env-file=.env.local scripts/course-ai-autopilot.ts maintain --course-id AI_30_NAP --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import mongoose from 'mongoose';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';
import { generateCoursePackage, generateCourseMaintenancePlan } from '../app/lib/ai/course-automation';
import { syncCourseDurationToLessons, reSyncChildFromParent } from '../app/lib/course-helpers';
import { resolveLocalLLMProvider } from '../app/lib/ai/local-llm';

type Mode = 'create' | 'maintain';

function readArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function normalizeCourseId(value: string): string {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_]+/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
}

function usage(): never {
  console.error([
    'Usage:',
    '  create   --topic "AI for sales" --language en [--course-id AI_FOR_SALES] [--days 7] [--audience "..."] [--out path] [--apply]',
    '  maintain --course-id AI_30_NAP [--out path] [--apply]',
    '',
    'Provider:',
    '  LLM_PROVIDER=ollama|openai, or OLLAMA_MODEL / OLLAMA_BASE_URL for local mode.',
  ].join('\n'));
  process.exit(1);
}

function resolveMode(): Mode {
  const raw = process.argv[2];
  if (raw === 'create' || raw === 'maintain') return raw;
  usage();
}

function defaultOutPath(prefix: string, courseId: string): string {
  const outDir = join(process.cwd(), 'docs', 'course-ai');
  mkdirSync(outDir, { recursive: true });
  return join(outDir, `${prefix}-${normalizeCourseId(courseId)}.json`);
}

async function runCreate(): Promise<void> {
  const topic = readArg('--topic');
  const language = readArg('--language') || 'hu';
  const courseId = readArg('--course-id');
  const audience = readArg('--audience');
  const outcome = readArg('--outcome');
  const days = readArg('--days') ? Number(readArg('--days')) : undefined;
  const ccsId = readArg('--ccs-id');
  const tone = readArg('--tone');
  const seoFocus = readArg('--seo-focus');
  const apply = hasFlag('--apply');
  const outPath = readArg('--out') || defaultOutPath('course-package', courseId || topic || 'draft');

  if (!topic) {
    usage();
  }

  const provider = resolveLocalLLMProvider();
  const brief = {
    topic,
    language,
    courseId: courseId ? normalizeCourseId(courseId) : undefined,
    audience,
    outcome,
    days,
    ccsId: ccsId ? normalizeCourseId(ccsId) : undefined,
    requiresPremium: hasFlag('--premium') ? true : undefined,
    certificateEnabled: hasFlag('--certificate') ? true : undefined,
    tone,
    seoFocus,
  };

  const coursePackage = await generateCoursePackage(brief, provider);
  writeFileSync(outPath, JSON.stringify(coursePackage, null, 2) + '\n', 'utf8');
  console.log(`✅ Generated course package with ${provider}`);
  console.log(`   Course: ${String(coursePackage.course.courseId)} (${String(coursePackage.course.language)})`);
  console.log(`   Lessons: ${coursePackage.lessons.length}`);
  console.log(`   Package: ${outPath}`);

  if (!apply) {
    console.log('\nNext step: import this package with the existing importer:');
    console.log(`   npx tsx --env-file=.env.local scripts/inject-course-from-json.ts ${outPath}`);
    return;
  }

  console.log('\nApplying package to the database...');
  execFileSync(
    'npx',
    ['tsx', '--env-file=.env.local', 'scripts/inject-course-from-json.ts', outPath],
    { stdio: 'inherit', cwd: process.cwd() }
  );

  console.log('\nRunning quiz regeneration for the generated course...');
  execFileSync(
    'npx',
    ['tsx', '--env-file=.env.local', 'scripts/process-course-questions-generic.ts', String(coursePackage.course.courseId)],
    { stdio: 'inherit', cwd: process.cwd() }
  );

  console.log('\nRunning post-import course sync...');
  await connectDB();
  const course = await Course.findOne({ courseId: coursePackage.course.courseId });
  if (course) {
    await syncCourseDurationToLessons(course as never);
  }

  await mongoose.disconnect();
}

async function runMaintain(): Promise<void> {
  const courseId = readArg('--course-id');
  const outPath = readArg('--out') || defaultOutPath('maintenance-plan', courseId || 'course');
  const apply = hasFlag('--apply');

  if (!courseId) {
    usage();
  }

  await connectDB();
  const course = await Course.findOne({ courseId: normalizeCourseId(courseId) }).lean();
  if (!course) {
    throw new Error(`Course not found: ${courseId}`);
  }

  const lessons = await Lesson.find({ courseId: course._id }).sort({ dayNumber: 1, displayOrder: 1 }).lean();
  const questions = await QuizQuestion.find({ courseId: course._id, isActive: true }).lean();

  const lessonStats = lessons.map((lesson) => {
    const lessonQuestions = questions.filter((question) => String(question.lessonId) === String(lesson.lessonId));
    return {
      lessonId: String(lesson.lessonId),
      dayNumber: Number(lesson.dayNumber || 0),
      title: String(lesson.title || ''),
      language: String(lesson.language || course.language || 'hu'),
      isActive: lesson.isActive !== false,
      questionCount: lessonQuestions.length,
      activeQuestionCount: lessonQuestions.filter((question) => question.isActive !== false).length,
      qualitySignals: {
        hasContent: Boolean(String(lesson.content || '').trim()),
        hasEmailBody: Boolean(String(lesson.emailBody || '').trim()),
      },
    };
  });

  const maintenancePlan = await generateCourseMaintenancePlan(
    {
      course: {
        courseId: String(course.courseId),
        name: String(course.name || ''),
        language: String(course.language || 'hu'),
        durationDays: Number(course.durationDays || 1),
        isActive: course.isActive !== false,
        requiresPremium: course.requiresPremium === true,
        ccsId: course.ccsId ? String(course.ccsId) : undefined,
        parentCourseId: course.parentCourseId ? String(course.parentCourseId) : undefined,
        selectedLessonIds: Array.isArray(course.selectedLessonIds) ? course.selectedLessonIds.map(String) : undefined,
        lessonQuizPolicy: course.lessonQuizPolicy || undefined,
      },
      lessons: lessonStats,
      summary: {
        totalLessons: lessons.length,
        totalQuestions: questions.length,
        childCourse: Boolean(course.parentCourseId),
      },
    },
    resolveLocalLLMProvider()
  );

  writeFileSync(outPath, JSON.stringify(maintenancePlan, null, 2) + '\n', 'utf8');
  console.log(`✅ Generated maintenance plan for ${course.courseId}`);
  console.log(`   Plan: ${outPath}`);
  console.log(`   Actions: ${maintenancePlan.actions.length}`);
  console.log(`   Next step: ${maintenancePlan.nextStep}`);

  if (!apply) {
    return;
  }

  console.log('\nApplying low-risk maintenance actions...');

  if (course.parentCourseId) {
    const result = await reSyncChildFromParent(course as never);
    if (result) {
      console.log(`   Resynced child course; removed ${result.removedLessonIds.length} missing lesson references.`);
    }
  }

  const needsQuestionRefresh = lessonStats.some((lesson) => lesson.activeQuestionCount < 7);
  if (needsQuestionRefresh) {
    console.log('   Regenerating course questions with the existing quality pipeline...');
    execFileSync(
      'npx',
      ['tsx', '--env-file=.env.local', 'scripts/process-course-questions-generic.ts', String(course.courseId)],
      { stdio: 'inherit', cwd: process.cwd() }
    );
  }

  const refreshedCourse = await Course.findOne({ courseId: course.courseId });
  if (refreshedCourse) {
    await syncCourseDurationToLessons(refreshedCourse as never);
  }

  await mongoose.disconnect();
}

async function main() {
  const mode = resolveMode();
  if (mode === 'create') {
    await runCreate();
    return;
  }
  await runMaintain();
}

main().catch((error) => {
  console.error('Course AI autopilot failed:', error);
  mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
