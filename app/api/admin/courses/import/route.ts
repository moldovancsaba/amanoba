/**
 * Admin Course Import API
 *
 * What: Imports a course from a single JSON package (v2 format). New course = create. Overwrite = merge (preserves stats).
 * Why: Backup/restore and content updates without losing progress, upvotes, certificates, shorts.
 * See docs/COURSE_PACKAGE_FORMAT.md.
 *
 * UI uses JSON only. Accepts:
 * - JSON body: { courseData: {...}, overwrite: boolean } (or raw { course, lessons, overwrite? })
 * - Multipart form with .zip file (API backward compatibility; not offered in UI).
 */

import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, QuizQuestion, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';
import { QuestionDifficulty, QuizQuestionType } from '@/lib/models';
import mongoose from 'mongoose';

const VALID_QUESTION_TYPES = new Set(Object.values(QuizQuestionType));
function normalizeQuestionType(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  return VALID_QUESTION_TYPES.has(value as QuizQuestionType) ? value : undefined;
}

/** Shape of a lesson as stored in the course package (JSON/ZIP). */
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

/**
 * POST /api/admin/courses/import
 *
 * Body: JSON { courseData, overwrite } (standard). Or multipart form with .zip (API-only).
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let courseData: { course: Record<string, unknown>; lessons?: PackageLesson[] };
    let overwrite = false;

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') ?? formData.get('package');
      const overwriteStr = formData.get('overwrite');
      overwrite = overwriteStr === 'true' || overwriteStr === '1';

      if (!file || typeof file === 'string') {
        return NextResponse.json({ error: 'No file provided. Send multipart form with "file" (ZIP package).' }, { status: 400 });
      }
      const blob = file as Blob;
      const name = (file as File).name || '';
      if (!name.toLowerCase().endsWith('.zip')) {
        return NextResponse.json({ error: 'File must be a .zip package. Use Export as ZIP first.' }, { status: 400 });
      }
      const buf = Buffer.from(await blob.arrayBuffer());
      const zip = await JSZip.loadAsync(buf);
      const packageFile = zip.file('package.json');
      const courseFile = zip.file('course.json');
      const lessonsFile = zip.file('lessons.json');
      if (packageFile) {
        const packageStr = await packageFile.async('string');
        const pkg = JSON.parse(packageStr) as Record<string, unknown>;
        const course = (pkg.course ?? pkg) as Record<string, unknown>;
        const lessons = (Array.isArray(pkg.lessons) ? pkg.lessons : []) as PackageLesson[];
        if (!course?.courseId) {
          return NextResponse.json({ error: 'Invalid package: package.json must contain course (with courseId) and lessons' }, { status: 400 });
        }
        courseData = { course, lessons };
        logger.info({ courseId: course.courseId, overwrite }, 'Admin importing from ZIP package (single package.json)');
      } else if (courseFile && lessonsFile) {
        const courseStr = await courseFile.async('string');
        const lessonsStr = await lessonsFile.async('string');
        const course = JSON.parse(courseStr) as Record<string, unknown>;
        const lessons = JSON.parse(lessonsStr) as PackageLesson[];
        courseData = { course, lessons };
        logger.info({ courseId: course.courseId, overwrite }, 'Admin importing from ZIP package (manifest + course + lessons)');
      } else {
        return NextResponse.json({ error: 'Invalid package: provide package.json (single file with course + lessons) or manifest.json + course.json + lessons.json' }, { status: 400 });
      }
    } else {
      const body = (await request.json()) as Record<string, unknown>;
      overwrite = body.overwrite === true;
      // Accept either { courseData: { course, lessons }, overwrite } or raw package { course, lessons, overwrite? }
      if (body.courseData != null && typeof body.courseData === 'object') {
        courseData = body.courseData as { course: Record<string, unknown>; lessons?: PackageLesson[] };
      } else if (body.course != null && typeof body.course === 'object') {
        courseData = {
          course: body.course as Record<string, unknown>,
          lessons: Array.isArray(body.lessons) ? (body.lessons as PackageLesson[]) : [],
        };
        logger.info({ courseId: (body.course as Record<string, unknown>).courseId, overwrite }, 'Admin importing from single JSON (raw package body)');
      } else {
        courseData = undefined as unknown as { course: Record<string, unknown>; lessons?: PackageLesson[] };
      }
    }

    if (!courseData || !courseData.course) {
      return NextResponse.json({ error: 'Invalid course data. Send JSON with course (with courseId) and lessons, or wrap in courseData.' }, { status: 400 });
    }

    const brand = await Brand.findOne({ slug: 'amanoba' });
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const { course: courseInfo, lessons: lessonsRaw = [] } = courseData;
    const lessons: PackageLesson[] = Array.isArray(lessonsRaw) ? lessonsRaw : [];
    const courseId = courseInfo.courseId;

    const existingCourse = await Course.findOne({ courseId });
    if (existingCourse && !overwrite) {
      return NextResponse.json(
        { error: `Course ${courseId} already exists. Use overwrite=true to merge (preserves stats).` },
        { status: 409 }
      );
    }

    // Resolve prerequisiteCourseIds to ObjectIds if present
    const prerequisiteCourseIds =
      Array.isArray(courseInfo.prerequisiteCourseIds) && courseInfo.prerequisiteCourseIds.length > 0
        ? courseInfo.prerequisiteCourseIds
            .map((id: unknown) => {
              try {
                return new mongoose.Types.ObjectId(String(id));
              } catch {
                return null;
              }
            })
            .filter(Boolean) as mongoose.Types.ObjectId[]
        : undefined;

    // Course content/config payload (merge-safe: only set provided fields so package name/description etc. apply exactly)
    const courseSet: Record<string, unknown> = {
      courseId: courseInfo.courseId,
      durationDays: courseInfo.durationDays ?? 30,
      isActive: courseInfo.isActive !== undefined ? courseInfo.isActive : true,
      requiresPremium: courseInfo.requiresPremium !== undefined ? courseInfo.requiresPremium : false,
      pointsConfig: courseInfo.pointsConfig ?? { completionPoints: 1000, lessonPoints: 50, perfectCourseBonus: 500 },
      xpConfig: courseInfo.xpConfig ?? { completionXP: 500, lessonXP: 25 },
      metadata: courseInfo.metadata || {},
      translations: courseInfo.translations ? new Map(Object.entries(courseInfo.translations)) : new Map(),
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
    // Apply string content exactly when provided (preserves – vs - and avoids overwriting with undefined)
    if (courseInfo.name !== undefined && courseInfo.name !== null) {
      courseSet.name = String(courseInfo.name);
    } else if (!existingCourse) {
      courseSet.name = courseId;
    }
    if (courseInfo.description !== undefined && courseInfo.description !== null) {
      courseSet.description = String(courseInfo.description);
    } else if (!existingCourse) {
      courseSet.description = '';
    }
    if (courseInfo.language !== undefined && courseInfo.language !== null) {
      courseSet.language = String(courseInfo.language);
    } else if (!existingCourse) {
      courseSet.language = 'hu';
    }
    if (courseInfo.thumbnail !== undefined && courseInfo.thumbnail !== null) {
      courseSet.thumbnail = String(courseInfo.thumbnail);
    }
    if (!existingCourse) {
      courseSet.brandId = brand._id;
    }

    const course = await Course.findOneAndUpdate(
      { courseId },
      { $set: courseSet },
      { upsert: true, new: true, setDefaultsOnInsert: true, omitUndefined: true }
    );

    logger.info({ courseId, overwrite }, 'Course created/updated during import (merge)');

    let lessonsCreated = 0;
    let lessonsUpdated = 0;
    let questionsCreated = 0;
    let questionsUpdated = 0;

    for (const lessonData of lessons) {
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

      if (lesson.isNew) lessonsCreated++;
      else lessonsUpdated++;

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
              createdBy: session.user.email || 'import',
            },
          });
          questionsCreated++;
        }
      }
    }

    logger.info(
      {
        courseId,
        lessonsCreated,
        lessonsUpdated,
        questionsCreated,
        questionsUpdated,
        overwrite,
      },
      'Admin imported course'
    );

    const message = !existingCourse
      ? 'Course created'
      : overwrite
        ? 'Course merged (content updated; progress, votes, certificates preserved)'
        : 'Course imported';
    return NextResponse.json({
      success: true,
      message,
      course: {
        courseId: course.courseId,
        name: course.name,
      },
      stats: {
        lessonsCreated,
        lessonsUpdated,
        questionsCreated,
        questionsUpdated,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to import course');
    return NextResponse.json({ error: 'Failed to import course', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
