/**
 * Inject course from JSON package into the database
 *
 * Runs the same logic as POST /api/admin/courses/import (merge/upsert) without auth.
 * Use to verify import flow or seed from an export file.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/inject-course-from-json.ts <path-to-export.json>
 *
 * Example:
 *   npx tsx --env-file=.env.local scripts/inject-course-from-json.ts "$HOME/Downloads/SPORT_SALES_NETWORK_EUROPE_2026_EN_export_2026-02-06_FIXED_MARKDOWN.json"
 *
 * Requires: MONGODB_URI in .env.local (or .env). Overwrites existing course by courseId.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion, Brand } from '../app/lib/models';
import { QuestionDifficulty, QuizQuestionType } from '../app/lib/models';

const CREATED_BY = 'inject-course-from-json';

interface PackageLesson {
  lessonId: string;
  dayNumber?: number;
  language?: string;
  title?: string;
  content?: string;
  emailSubject?: string;
  emailBody?: string;
  quizConfig?: unknown;
  unlockConditions?: Record<string, unknown>;
  pointsReward?: number;
  xpReward?: number;
  isActive?: boolean;
  displayOrder?: number;
  metadata?: Record<string, unknown>;
  translations?: Record<string, unknown>;
  quizQuestions?: Array<{
    uuid?: string;
    question?: string;
    options?: string[];
    correctIndex?: number;
    correctAnswer?: string;
    wrongAnswers?: string[];
    difficulty?: string;
    category?: string;
    isActive?: boolean;
    questionType?: string;
    hashtags?: string[];
  }>;
}

const VALID_QUESTION_TYPES = new Set(Object.values(QuizQuestionType));
function normalizeQuestionType(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  return VALID_QUESTION_TYPES.has(value as QuizQuestionType) ? value : undefined;
}

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) {
    console.error('Usage: npx tsx --env-file=.env.local scripts/inject-course-from-json.ts <path-to-export.json>');
    process.exit(1);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(resolve(jsonPath), 'utf-8'));
  } catch (e) {
    console.error('Failed to read or parse JSON:', e);
    process.exit(1);
  }

  const body = raw as Record<string, unknown>;
  const courseData =
    body.courseData != null && typeof body.courseData === 'object'
      ? (body.courseData as { course: Record<string, unknown>; lessons?: PackageLesson[] })
      : body.course != null && typeof body.course === 'object'
        ? {
            course: body.course as Record<string, unknown>,
            lessons: Array.isArray(body.lessons) ? (body.lessons as PackageLesson[]) : [],
          }
        : null;

  if (!courseData?.course?.courseId) {
    console.error('Invalid package: need course (with courseId) and lessons.');
    process.exit(1);
  }

  await connectDB();

  const brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) {
    console.error('Brand "amanoba" not found.');
    process.exit(1);
  }

  const { course: courseInfo, lessons: lessonsRaw = [] } = courseData;
  const lessons: PackageLesson[] = Array.isArray(lessonsRaw) ? lessonsRaw : [];
  const courseId = courseInfo.courseId as string;
  const existingCourse = await Course.findOne({ courseId });

  const prerequisiteCourseIds =
    Array.isArray(courseInfo.prerequisiteCourseIds) && courseInfo.prerequisiteCourseIds.length > 0
      ? (courseInfo.prerequisiteCourseIds as unknown[])
          .map((id: unknown) => {
            try {
              return new mongoose.Types.ObjectId(String(id));
            } catch {
              return null;
            }
          })
          .filter(Boolean) as mongoose.Types.ObjectId[]
      : undefined;

  const courseSet: Record<string, unknown> = {
    courseId: courseInfo.courseId,
    durationDays: courseInfo.durationDays ?? 30,
    isActive: courseInfo.isActive !== undefined ? courseInfo.isActive : true,
    requiresPremium: courseInfo.requiresPremium !== undefined ? courseInfo.requiresPremium : false,
    pointsConfig: courseInfo.pointsConfig ?? { completionPoints: 1000, lessonPoints: 50, perfectCourseBonus: 500 },
    xpConfig: courseInfo.xpConfig ?? { completionXP: 500, lessonXP: 25 },
    metadata: courseInfo.metadata || {},
    translations: courseInfo.translations ? new Map(Object.entries(courseInfo.translations as Record<string, unknown>)) : new Map(),
    discussionEnabled: courseInfo.discussionEnabled ?? false,
    leaderboardEnabled: courseInfo.leaderboardEnabled ?? false,
    studyGroupsEnabled: courseInfo.studyGroupsEnabled ?? false,
    ccsId: courseInfo.ccsId ?? undefined,
    prerequisiteCourseIds: prerequisiteCourseIds ?? undefined,
    prerequisiteEnforcement: courseInfo.prerequisiteEnforcement ?? undefined,
    quizMaxWrongAllowed: courseInfo.quizMaxWrongAllowed !== undefined ? courseInfo.quizMaxWrongAllowed : undefined,
    defaultLessonQuizQuestionCount: courseInfo.defaultLessonQuizQuestionCount !== undefined ? courseInfo.defaultLessonQuizQuestionCount : undefined,
    certification: courseInfo.certification ?? undefined,
  };
  if (courseInfo.name !== undefined && courseInfo.name !== null) courseSet.name = String(courseInfo.name);
  else if (!existingCourse) courseSet.name = courseId;
  if (courseInfo.description !== undefined && courseInfo.description !== null) courseSet.description = String(courseInfo.description);
  else if (!existingCourse) courseSet.description = '';
  if (courseInfo.language !== undefined && courseInfo.language !== null) courseSet.language = String(courseInfo.language);
  else if (!existingCourse) courseSet.language = 'hu';
  if (courseInfo.thumbnail !== undefined && courseInfo.thumbnail !== null) courseSet.thumbnail = String(courseInfo.thumbnail);
  if (!existingCourse) courseSet.brandId = brand._id;

  const course = await Course.findOneAndUpdate(
    { courseId },
    { $set: courseSet },
    { upsert: true, new: true, setDefaultsOnInsert: true, omitUndefined: true }
  );

  let lessonsCreated = 0;
  let lessonsUpdated = 0;
  let questionsCreated = 0;
  let questionsUpdated = 0;

  for (const lessonData of lessons) {
    const existed = await Lesson.exists({ lessonId: lessonData.lessonId });
    const lesson = await Lesson.findOneAndUpdate(
      { lessonId: lessonData.lessonId },
      {
        $set: {
          lessonId: lessonData.lessonId,
          courseId: course._id,
          dayNumber: lessonData.dayNumber ?? 1,
          language: lessonData.language ?? 'hu',
          title: lessonData.title ?? '',
          content: lessonData.content ?? '',
          emailSubject: lessonData.emailSubject ?? '',
          emailBody: lessonData.emailBody ?? '',
          quizConfig: lessonData.quizConfig ?? null,
          unlockConditions: lessonData.unlockConditions ?? {},
          pointsReward: lessonData.pointsReward ?? 0,
          xpReward: lessonData.xpReward ?? 0,
          isActive: lessonData.isActive !== undefined ? lessonData.isActive : true,
          displayOrder: lessonData.displayOrder ?? lessonData.dayNumber ?? 1,
          metadata: lessonData.metadata ?? {},
          translations: lessonData.translations ? new Map(Object.entries(lessonData.translations)) : new Map(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (existed) lessonsUpdated++;
    else lessonsCreated++;

    const quizQuestions = lessonData.quizQuestions || [];
    for (const questionData of quizQuestions) {
      const matchByUuid =
        questionData.uuid &&
        (await QuizQuestion.findOne({
          lessonId: lessonData.lessonId,
          courseId: course._id,
          uuid: questionData.uuid,
        }));
      const matchByQuestion =
        !matchByUuid &&
        (await QuizQuestion.findOne({
          lessonId: lessonData.lessonId,
          courseId: course._id,
          question: questionData.question,
        }));
      const existingQuestion = matchByUuid ?? matchByQuestion;

      const basePayload = {
        question: questionData.question ?? '',
        options: questionData.options ?? [],
        correctIndex: questionData.correctIndex ?? 0,
        correctAnswer: questionData.correctAnswer ?? undefined,
        wrongAnswers: Array.isArray(questionData.wrongAnswers) ? questionData.wrongAnswers : undefined,
        difficulty: (questionData.difficulty as QuestionDifficulty) ?? 'MEDIUM',
        category: questionData.category ?? 'Course Specific',
        isActive: questionData.isActive !== undefined ? questionData.isActive : true,
        lessonId: lessonData.lessonId,
        courseId: course._id,
        isCourseSpecific: true,
        uuid: questionData.uuid ?? undefined,
        questionType: normalizeQuestionType(questionData.questionType) ?? undefined,
        hashtags: questionData.hashtags ?? undefined,
      };
      const updatePayload = { ...basePayload, 'metadata.updatedAt': new Date() };

      if (existingQuestion) {
        await QuizQuestion.updateOne({ _id: existingQuestion._id }, { $set: updatePayload });
        questionsUpdated++;
      } else {
        await QuizQuestion.create({
          ...basePayload,
          showCount: 0,
          correctCount: 0,
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: CREATED_BY,
          },
        });
        questionsCreated++;
      }
    }
  }

  console.log('Import complete.');
  console.log('Course:', course.courseId, course.name);
  console.log('Lessons:', lessonsCreated, 'created,', lessonsUpdated, 'updated');
  console.log('Questions:', questionsCreated, 'created,', questionsUpdated, 'updated');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
