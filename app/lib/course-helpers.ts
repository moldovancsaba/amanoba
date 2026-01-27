/**
 * Course helpers for parent/child and short courses.
 * Used by day API, certification, and admin.
 */

import connectDB from './mongodb';
import { Course, Lesson } from './models';
import type { ICourse } from './models/course';

/**
 * Return the parent course doc if this course is a child (has parentCourseId), else null.
 */
export async function getParentCourse(course: ICourse | { parentCourseId?: string } | null) {
  if (!course?.parentCourseId) return null;
  await connectDB();
  const parent = await Course.findOne({ courseId: course.parentCourseId.toUpperCase() }).lean();
  return parent;
}

/**
 * For a child course, return the parent Lesson for that child "day".
 * Uses selectedLessonIds[dayNumber - 1] as the parent lesson _id.
 * Returns null if not a child, or day out of range, or lesson not found.
 */
export async function resolveLessonForChildDay(
  childCourse: ICourse | null,
  dayNumber: number
): Promise<{ _id: unknown; lessonId: string; courseId: unknown; dayNumber: number; title: string; content?: string; [k: string]: unknown } | null> {
  if (!childCourse?.parentCourseId || !childCourse?.selectedLessonIds?.length) return null;
  const idx = dayNumber - 1;
  if (idx < 0 || idx >= childCourse.selectedLessonIds.length) return null;
  const lessonId = childCourse.selectedLessonIds[idx];
  if (!lessonId) return null;
  await connectDB();
  const lesson = await Lesson.findById(lessonId).lean();
  return lesson as { _id: unknown; lessonId: string; courseId: unknown; dayNumber: number; title: string; content?: string; [k: string]: unknown } | null;
}
