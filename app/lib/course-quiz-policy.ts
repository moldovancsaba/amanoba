/**
 * Course-level lesson quiz policy resolver.
 *
 * What: Normalizes the canonical policy used by learner runtime and admin UI.
 * Why: Keeps quiz behavior authority at course level with legacy-field fallback.
 */

export type CourseQuizPolicyInput = {
  lessonQuizPolicy?: {
    enabled?: boolean;
    required?: boolean;
    questionCount?: number;
    shownAnswerCount?: number;
    maxWrongAllowed?: number;
    successThreshold?: number;
  };
  // Legacy course-level fields kept temporarily for compatibility.
  quizMaxWrongAllowed?: number;
  defaultLessonQuizQuestionCount?: number;
};

export type ResolvedCourseQuizPolicy = {
  enabled: boolean;
  required: boolean;
  questionCount: number;
  shownAnswerCount: number;
  maxWrongAllowed?: number;
  successThreshold: number;
};

const QUESTION_COUNT_MIN = 1;
const QUESTION_COUNT_MAX = 50;
const SHOWN_ANSWER_COUNT_MIN = 2;
const SHOWN_ANSWER_COUNT_MAX = 4;
const MAX_WRONG_MIN = 0;
const MAX_WRONG_MAX = 10;
const SUCCESS_THRESHOLD_MIN = 0;
const SUCCESS_THRESHOLD_MAX = 100;

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function normalizeOptionalInt(value: unknown, min: number, max: number): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  const normalized = Math.round(value);
  if (normalized < min || normalized > max) return undefined;
  return normalized;
}

export function resolveCourseQuizPolicy(course: CourseQuizPolicyInput): ResolvedCourseQuizPolicy {
  const policy = course.lessonQuizPolicy;
  const legacyQuestionCount = normalizeOptionalInt(
    course.defaultLessonQuizQuestionCount,
    QUESTION_COUNT_MIN,
    QUESTION_COUNT_MAX
  );
  const legacyMaxWrong = normalizeOptionalInt(
    course.quizMaxWrongAllowed,
    MAX_WRONG_MIN,
    MAX_WRONG_MAX
  );

  return {
    enabled: policy?.enabled !== false,
    required: policy?.required !== false,
    questionCount: clampInt(
      policy?.questionCount ?? legacyQuestionCount,
      QUESTION_COUNT_MIN,
      QUESTION_COUNT_MAX,
      5
    ),
    shownAnswerCount: clampInt(
      policy?.shownAnswerCount,
      SHOWN_ANSWER_COUNT_MIN,
      SHOWN_ANSWER_COUNT_MAX,
      3
    ),
    maxWrongAllowed: normalizeOptionalInt(
      policy?.maxWrongAllowed ?? legacyMaxWrong,
      MAX_WRONG_MIN,
      MAX_WRONG_MAX
    ),
    successThreshold: clampInt(
      policy?.successThreshold,
      SUCCESS_THRESHOLD_MIN,
      SUCCESS_THRESHOLD_MAX,
      70
    ),
  };
}

