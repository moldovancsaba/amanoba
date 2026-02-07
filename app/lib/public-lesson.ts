/**
 * Public lesson data for GEO view pages.
 * Used by GET /api/courses/[courseId]/day/[dayNumber]/public and the view page.
 * No auth; only active courses and active lessons.
 */

import connectDB from '@/app/lib/mongodb';
import { Course, Lesson, type ICourse } from '@/app/lib/models';
import { resolveLessonForChildDay } from '@/app/lib/course-helpers';
import { canonicalLessonForDay, buildCanonicalLessonContent } from '@/app/lib/canonical-spec';

export interface PublicLessonData {
  course: {
    courseId: string;
    name: string;
    language: string;
    durationDays: number;
  };
  lesson: {
    title: string;
    content: string;
    dayNumber: number;
    lessonId: string;
  };
}

/**
 * Fetch lesson and course for public view. Returns null if course/lesson inactive or not found.
 */
export async function getPublicLessonData(
  courseId: string,
  dayNumber: number
): Promise<PublicLessonData | null> {
  await connectDB();

  const course = await Course.findOne({ courseId }).lean();
  if (!course || !(course as { isActive?: boolean }).isActive) {
    return null;
  }

  const totalDays = (course as { durationDays?: number }).durationDays ?? 30;
  if (dayNumber < 1 || dayNumber > totalDays) {
    return null;
  }

  const courseObj = course as {
    _id: unknown;
    courseId: string;
    name: string;
    language?: string;
    durationDays?: number;
    parentCourseId?: string;
    selectedLessonIds?: string[];
  };

  let lesson: { title: string; content: string; dayNumber: number; lessonId: string } | null = null;

  if (courseObj.parentCourseId && courseObj.selectedLessonIds?.length) {
    const resolved = await resolveLessonForChildDay(courseObj as unknown as ICourse, dayNumber);
    if (resolved && resolved.isActive !== false) {
      lesson = {
        title: resolved.title,
        content: resolved.content ?? '',
        dayNumber: resolved.dayNumber,
        lessonId: resolved.lessonId,
      };
    }
  } else {
    const doc = await Lesson.findOne({
      courseId: courseObj._id,
      dayNumber,
      isActive: true,
    }).lean();
    if (doc) {
      const d = doc as { title: string; content?: string; dayNumber: number; lessonId: string };
      lesson = {
        title: d.title,
        content: d.content ?? '',
        dayNumber: d.dayNumber,
        lessonId: d.lessonId,
      };
    }
  }

  if (!lesson) {
    const canonicalLesson = canonicalLessonForDay(courseObj, dayNumber);
    if (canonicalLesson) {
      lesson = {
        title: canonicalLesson.canonicalTitle ?? canonicalLesson.title ?? `Day ${dayNumber}`,
        content: buildCanonicalLessonContent(canonicalLesson),
        dayNumber,
        lessonId: `${courseObj.courseId}_DAY_${String(dayNumber).padStart(2, '0')}`,
      };
    }
  }

  if (!lesson) return null;

  return {
    course: {
      courseId: courseObj.courseId,
      name: courseObj.name ?? courseObj.courseId,
      language: courseObj.language ?? 'en',
      durationDays: totalDays,
    },
    lesson,
  };
}
