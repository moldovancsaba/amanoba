/**
 * Seed-time course quiz governance helpers.
 *
 * What: Central defaults for seed/import scripts.
 * Why: Lesson quiz behavior authority lives on course.lessonQuizPolicy; lesson.quizConfig is compatibility-only.
 */

import {
  buildCourseQuizPolicyPackageFields,
  type StoredLessonQuizPolicy,
} from '@/lib/course-quiz-policy';

export const DEFAULT_SEED_LESSON_QUIZ_POLICY: StoredLessonQuizPolicy = {
  enabled: true,
  required: true,
  questionCount: 7,
  shownAnswerCount: 3,
  successThreshold: 70,
};

export function applySeedCourseQuizPolicy<T extends Record<string, unknown>>(
  coursePayload: T,
  overrides?: Partial<StoredLessonQuizPolicy>
): T & { lessonQuizPolicy: StoredLessonQuizPolicy } {
  const fields = buildCourseQuizPolicyPackageFields({
    lessonQuizPolicy: { ...DEFAULT_SEED_LESSON_QUIZ_POLICY, ...overrides },
  });
  return {
    ...coursePayload,
    lessonQuizPolicy: fields.lessonQuizPolicy,
  };
}

/** Strip behavior-heavy lesson quizConfig before seed/import persistence. */
export function normalizeSeedLessonQuizConfig<T extends { quizConfig?: unknown }>(
  lesson: T
): T & { quizConfig: null } {
  return {
    ...lesson,
    quizConfig: null,
  };
}
