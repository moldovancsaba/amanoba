/**
 * Course helpers for parent/child and short courses.
 * Used by day API, certification, and admin.
 */

import connectDB from './mongodb';
import { Course, Lesson } from './models';
import type { ICourse } from './models/course';
import { canonicalLessonSpecsForCourse } from './canonical-spec';

export type CourseLengthSource = 'child-selection' | 'lessons' | 'canonical' | 'duration-fallback';

export interface CourseLength {
  totalDays: number;
  source: CourseLengthSource;
}

export function normalizeCourseDurationDays(value: unknown, fallback = 1): number {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric < 1) {
    return fallback;
  }

  return Math.floor(numeric);
}

export function calculateCurrentLessonDay(completedDays: number[], totalDays: number): number {
  const normalizedTotal = normalizeCourseDurationDays(totalDays);
  if (!completedDays || completedDays.length === 0) {
    return 1;
  }

  const completed = new Set(
    completedDays
      .filter((day) => Number.isFinite(day) && day >= 1)
      .map((day) => Math.floor(day))
  );

  for (let day = 1; day <= normalizedTotal; day += 1) {
    if (!completed.has(day)) {
      return day;
    }
  }

  return normalizedTotal + 1;
}

/**
 * Resolve the learner-facing course length from the actual lesson set.
 * Stored durationDays is only a fallback for empty/draft courses.
 */
export async function resolveCourseLength(
  course: ICourse | { _id?: unknown; durationDays?: number; parentCourseId?: string; selectedLessonIds?: string[]; ccsId?: string; language?: string } | null
): Promise<CourseLength> {
  if (!course) {
    return { totalDays: 1, source: 'duration-fallback' };
  }

  if (course.parentCourseId && Array.isArray(course.selectedLessonIds) && course.selectedLessonIds.length > 0) {
    return { totalDays: course.selectedLessonIds.length, source: 'child-selection' };
  }

  if (course._id) {
    await connectDB();
    const lastLesson = await Lesson.findOne({ courseId: course._id, isActive: true })
      .sort({ dayNumber: -1 })
      .select('dayNumber')
      .lean();
    const lastLessonDay = (lastLesson as { dayNumber?: number } | null)?.dayNumber;
    if (typeof lastLessonDay === 'number' && lastLessonDay >= 1) {
      return { totalDays: Math.floor(lastLessonDay), source: 'lessons' };
    }
  }

  const canonicalLessons = canonicalLessonSpecsForCourse(course);
  const canonicalLastDay = canonicalLessons.at(-1)?.dayNumber;
  if (typeof canonicalLastDay === 'number' && canonicalLastDay >= 1) {
    return { totalDays: Math.floor(canonicalLastDay), source: 'canonical' };
  }

  return {
    totalDays: normalizeCourseDurationDays(course.durationDays),
    source: 'duration-fallback',
  };
}

export async function syncCourseDurationToLessons(
  course: ICourse | { _id?: unknown; courseId?: string; durationDays?: number } | null
): Promise<number | null> {
  if (!course?._id) return null;

  const lastLesson = await Lesson.findOne({ courseId: course._id, isActive: true })
    .sort({ dayNumber: -1 })
    .select('dayNumber')
    .lean();
  const nextDuration = normalizeCourseDurationDays((lastLesson as { dayNumber?: number } | null)?.dayNumber, 1);

  await Course.findByIdAndUpdate(
    course._id,
    { $set: { durationDays: nextDuration } },
    { runValidators: true }
  );

  return nextDuration;
}

/**
 * Return the parent course doc if this course is a child (has parentCourseId), else null.
 */
export async function getParentCourse(course: ICourse | { parentCourseId?: string } | null) {
  if (!course?.parentCourseId) return null;
  await connectDB();
  const parent = await Course.findOne({ courseId: course.parentCourseId.toUpperCase() }).lean();
  return parent;
}

/** Result of checking child sync status against parent lessons. */
export interface ChildSyncStatus {
  /** 'synced' if all selectedLessonIds exist on parent; 'out_of_sync' if any missing or explicitly marked. */
  status: 'synced' | 'out_of_sync';
  /** Parent lesson _ids that are in selectedLessonIds but no longer exist on parent. */
  missingLessonIds?: string[];
  lastSyncedAt?: Date | null;
}

/**
 * For a child course, check whether selectedLessonIds still match parent lessons.
 * Returns status and any missing lesson ids. Does not modify the course.
 */
export async function getChildSyncStatus(
  childCourse: ICourse | { parentCourseId?: string; selectedLessonIds?: string[]; syncStatus?: string; lastSyncedAt?: Date } | null
): Promise<ChildSyncStatus | null> {
  if (!childCourse?.parentCourseId || !childCourse?.selectedLessonIds?.length) return null;
  await connectDB();
  const parent = await Course.findOne({ courseId: childCourse.parentCourseId.toUpperCase() }).lean();
  if (!parent) return { status: 'out_of_sync', missingLessonIds: childCourse.selectedLessonIds, lastSyncedAt: (childCourse as ICourse).lastSyncedAt };
  const parentId = (parent as { _id: unknown })._id;
  const existingIds = new Set(
    (await Lesson.find({ courseId: parentId }).select('_id').lean()).map((l) => String((l as { _id: unknown })._id))
  );
  const missing = childCourse.selectedLessonIds.filter((id) => !existingIds.has(String(id)));
  const status =
    (childCourse as ICourse).syncStatus === 'out_of_sync' || missing.length > 0 ? 'out_of_sync' : 'synced';
  return {
    status,
    ...(missing.length ? { missingLessonIds: missing } : {}),
    lastSyncedAt: (childCourse as ICourse).lastSyncedAt ?? null,
  };
}

/**
 * Re-sync a child course from parent: validate selectedLessonIds, remove any that no longer exist on parent,
 * then set syncStatus = 'synced' and lastSyncedAt = now. Returns updated course and list of removed ids.
 */
export async function reSyncChildFromParent(
  childCourse: ICourse | { _id?: unknown; courseId?: string; parentCourseId?: string; selectedLessonIds?: string[] }
): Promise<{ course: ICourse; removedLessonIds: string[] } | null> {
  if (!childCourse?.parentCourseId || !childCourse?.selectedLessonIds?.length) return null;
  await connectDB();
  const parent = await Course.findOne({ courseId: childCourse.parentCourseId.toUpperCase() }).lean();
  if (!parent) return null;
  const parentId = (parent as { _id: unknown })._id;
  const existingLessons = await Lesson.find({ courseId: parentId }).select('_id').lean();
  const existingIds = new Set(existingLessons.map((l) => String((l as { _id: unknown })._id)));
  const validIds = childCourse.selectedLessonIds!.filter((id) => existingIds.has(String(id)));
  const removed = childCourse.selectedLessonIds!.filter((id) => !existingIds.has(String(id)));
  const updated = await Course.findOneAndUpdate(
    { courseId: (childCourse as ICourse).courseId },
    {
      $set: {
        selectedLessonIds: validIds,
        syncStatus: 'synced' as const,
        lastSyncedAt: new Date(),
      },
    },
    { new: true, runValidators: true }
  ).lean();
  return updated ? { course: updated as unknown as ICourse, removedLessonIds: removed } : null;
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
