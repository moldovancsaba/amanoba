/**
 * Course Lessons API
 *
 * What: REST endpoint to get all lessons for a course (for table of contents)
 * Why: Allows students to see what lessons are included in a course
 *
 * Child courses (parentCourseId + selectedLessonIds): returns parent lessons
 * in selectedLessonIds order with dayNumber 1..N so the TOC shows the real outline.
 */

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '@/lib/models';
import { logger } from '@/lib/logger';
import { canonicalLessonSpecsForCourse } from '@/lib/canonical-spec';
import { resolveCourseQuizPolicy } from '@/lib/course-quiz-policy';

type LessonRow = {
  lessonId: string;
  dayNumber: number;
  title: string;
  estimatedMinutes?: number;
  hasQuiz: boolean;
};

/**
 * GET /api/courses/[courseId]/lessons
 *
 * What: Get all lessons for a course (public endpoint for table of contents)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    await connectDB();
    const { courseId } = await params;

    const course = await Course.findOne({ courseId }).lean();
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const co = course as {
      _id: unknown;
      parentCourseId?: string;
      selectedLessonIds?: string[];
      ccsId?: string;
      language?: string;
    };
    let lessons: LessonRow[];
    let usedCanonicalFallback = false;

    if (co.parentCourseId && co.selectedLessonIds?.length) {
      // Child course: resolve parent lessons by selectedLessonIds, order by selection, dayNumber 1..N
      const ids = co.selectedLessonIds
        .filter((id): id is string => typeof id === 'string' && !!id)
        .map((id) => new mongoose.Types.ObjectId(id));
      const byId = await Lesson.find({ _id: { $in: ids }, isActive: true })
        .select('lessonId dayNumber title metadata.estimatedMinutes quizConfig')
        .lean();
      const orderMap = new Map(ids.map((id, i) => [id.toString(), i]));
      const sorted = [...byId].sort(
        (a, b) =>
          (orderMap.get(String((a as { _id: unknown })._id)) ?? 0) -
          (orderMap.get(String((b as { _id: unknown })._id)) ?? 0)
      );
      lessons = sorted.map((l, i) => ({
        lessonId: (l as { lessonId: string }).lessonId,
        dayNumber: i + 1,
        title: (l as { title: string }).title,
        estimatedMinutes: (l as { metadata?: { estimatedMinutes?: number } }).metadata?.estimatedMinutes,
        hasQuiz: false,
      }));
    } else {
      const raw = await Lesson.find({
        courseId: course._id,
        isActive: true,
      })
        .select('lessonId dayNumber title metadata.estimatedMinutes quizConfig')
        .sort({ dayNumber: 1 })
        .lean();
      lessons = raw.map((l) => ({
        lessonId: l.lessonId,
        dayNumber: l.dayNumber,
        title: l.title,
        estimatedMinutes: l.metadata?.estimatedMinutes,
        hasQuiz: false,
      }));
    }

    if (!co.parentCourseId && lessons.length === 0) {
      const canonicalLessons = canonicalLessonSpecsForCourse(course);
      if (canonicalLessons.length > 0) {
        lessons = canonicalLessons.map((lesson) => ({
          lessonId: `${course.courseId}_DAY_${String(lesson.dayNumber).padStart(2, '0')}`,
          dayNumber: lesson.dayNumber,
          title: lesson.canonicalTitle ?? lesson.title ?? `Day ${lesson.dayNumber}`,
          estimatedMinutes: lesson.estimatedMinutes,
          hasQuiz: lesson.hasQuiz ?? true,
        }));
        usedCanonicalFallback = true;
      }
    }

    const quizPolicy = resolveCourseQuizPolicy(course as Parameters<typeof resolveCourseQuizPolicy>[0]);
    if (quizPolicy.enabled && lessons.length > 0) {
      const lessonIds = Array.from(new Set(lessons.map((l) => l.lessonId).filter(Boolean)));
      if (lessonIds.length > 0) {
        const activeQuizByLesson = await QuizQuestion.aggregate([
          {
            $match: {
              courseId: course._id,
              isCourseSpecific: true,
              isActive: true,
              lessonId: { $in: lessonIds },
            },
          },
          { $group: { _id: '$lessonId', count: { $sum: 1 } } },
        ]);
        const lessonIdsWithQuiz = new Set(
          activeQuizByLesson
            .filter((row: { count?: number }) => typeof row.count === 'number' && row.count > 0)
            .map((row: { _id: unknown }) => String(row._id))
        );
        lessons = lessons.map((lesson) => ({
          ...lesson,
          hasQuiz: lessonIdsWithQuiz.has(lesson.lessonId),
        }));
      }
    }

    const logData: Record<string, unknown> = { courseId, lessonCount: lessons.length };
    if (usedCanonicalFallback) {
      logData.source = 'canonical';
    }
    logger.info(logData, 'Fetched course lessons for table of contents');

    return NextResponse.json({
      success: true,
      lessons,
      count: lessons.length,
    });
  } catch (error) {
    logger.error({ error, courseId: (await params).courseId }, 'Failed to fetch course lessons');
    return NextResponse.json({ error: 'Failed to fetch course lessons' }, { status: 500 });
  }
}
