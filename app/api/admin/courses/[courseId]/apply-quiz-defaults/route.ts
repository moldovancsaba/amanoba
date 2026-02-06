/**
 * Admin Apply Quiz Defaults to All Lessons
 *
 * What: Sets every lesson's quizConfig.questionCount (and optionally poolSize) from course defaults.
 * Why: One-click to unify "number of questions" across all lessons from course settings.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Lesson } from '@/lib/models';
import { requireAdminOrEditor, getPlayerIdFromSession, isAdmin, canAccessCourse } from '@/lib/rbac';
import { logger } from '@/lib/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) return accessCheck;

    await connectDB();
    const { courseId } = await params;

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    if (!isAdmin(session) && !canAccessCourse(course, getPlayerIdFromSession(session))) {
      return NextResponse.json({ error: 'Forbidden', message: 'You do not have access to this course' }, { status: 403 });
    }

    const courseObj = course as { _id: unknown; defaultLessonQuizQuestionCount?: number; quizMaxWrongAllowed?: number };
    const defaultCount = courseObj.defaultLessonQuizQuestionCount;
    if (defaultCount == null || defaultCount < 1 || defaultCount > 50) {
      return NextResponse.json(
        { error: 'Set "Number of questions per lesson quiz (default)" (1–50) in Lesson quizzes and save the course first.' },
        { status: 400 }
      );
    }

    const lessons = await Lesson.find({ courseId: course._id }).lean();
    let updated = 0;
    for (const les of lessons) {
      const quizConfig = (les as { quizConfig?: { enabled?: boolean; questionCount?: number; poolSize?: number } }).quizConfig;
      if (!quizConfig || !quizConfig.enabled) continue;
      const currentCount = quizConfig.questionCount;
      if (currentCount === defaultCount) continue;
      const poolSize = Math.max(quizConfig.poolSize ?? 10, defaultCount);
      await Lesson.updateOne(
        { _id: (les as { _id: unknown })._id },
        {
          $set: {
            'quizConfig.questionCount': defaultCount,
            'quizConfig.poolSize': poolSize,
          },
        }
      );
      updated++;
    }

    logger.info({ courseId, defaultCount, lessonsTotal: lessons.length, updated }, 'Applied quiz defaults to lessons');

    return NextResponse.json({
      success: true,
      message: `Applied question count (${defaultCount}) to ${updated} lesson(s). Max wrong answers is already set at course level.`,
      updated,
      total: lessons.length,
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Apply quiz defaults failed');
    return NextResponse.json({ error: 'Failed to apply quiz defaults' }, { status: 500 });
  }
}
