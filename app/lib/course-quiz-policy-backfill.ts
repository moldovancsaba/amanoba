/**
 * Course quiz policy backfill planner.
 *
 * What: Derives canonical course.lessonQuizPolicy from legacy course fields and lesson quizConfig.
 * Why: One-time/repeatable migration with explicit conflict reporting when lessons diverge.
 */

import {
  buildCourseQuizPolicyPackageFields,
  resolveCourseQuizPolicy,
  toStoredLessonQuizPolicy,
  type CourseQuizPolicyInput,
  type StoredLessonQuizPolicy,
} from '@/lib/course-quiz-policy';

export type LessonQuizBehavior = {
  enabled: boolean;
  required: boolean;
  questionCount: number;
  successThreshold: number;
};

export type FieldConflict = {
  field: keyof LessonQuizBehavior | 'maxWrongAllowed';
  groups: Array<{ value: string; lessonIds: string[]; count: number }>;
};

export type CourseQuizPolicyBackfillPlan = {
  courseId: string;
  action: 'skip_has_explicit_policy' | 'skip_no_sources' | 'apply' | 'apply_with_conflicts';
  currentPolicy: StoredLessonQuizPolicy;
  proposedPolicy: StoredLessonQuizPolicy;
  changed: boolean;
  lessonCount: number;
  behaviorLessonCount: number;
  conflicts: FieldConflict[];
  divergentLessonIds: string[];
};

type LessonInput = { lessonId: string; quizConfig?: unknown };

function normalizeBehaviorPart(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function extractLessonQuizBehavior(quizConfig: unknown): LessonQuizBehavior | null {
  if (quizConfig == null || typeof quizConfig !== 'object') return null;
  const cfg = quizConfig as Record<string, unknown>;
  const hasBehaviorField =
    cfg.questionCount !== undefined ||
    cfg.successThreshold !== undefined ||
    cfg.required !== undefined ||
    cfg.enabled !== undefined;
  if (!hasBehaviorField) return null;

  return {
    enabled: cfg.enabled !== false,
    required: cfg.required !== false,
    questionCount: normalizeBehaviorPart(cfg.questionCount, 5, 1, 50),
    successThreshold: normalizeBehaviorPart(cfg.successThreshold, 70, 0, 100),
  };
}

function behaviorKey(behavior: LessonQuizBehavior): string {
  return JSON.stringify(behavior);
}

function pickModeBoolean(values: boolean[], strictDefault: boolean): boolean {
  const counts = new Map<boolean, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return strictDefault;
  if (sorted.length === 1) return sorted[0][0];
  const topCount = sorted[0][1];
  const tied = sorted.filter((entry) => entry[1] === topCount).map((entry) => entry[0]);
  if (tied.length === 1) return tied[0];
  return strictDefault;
}

function pickModeNumber(values: number[], strictDefault: number, prefer: 'higher' | 'lower'): number {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return strictDefault;
  if (sorted.length === 1) return sorted[0][0];
  const topCount = sorted[0][1];
  const tied = sorted.filter((entry) => entry[1] === topCount).map((entry) => entry[0]);
  if (tied.length === 1) return tied[0];
  return prefer === 'higher' ? Math.max(...tied) : Math.min(...tied);
}

function buildFieldConflicts(
  behaviors: Array<{ lessonId: string; behavior: LessonQuizBehavior }>
): FieldConflict[] {
  const fields: Array<keyof LessonQuizBehavior> = [
    'enabled',
    'required',
    'questionCount',
    'successThreshold',
  ];
  const conflicts: FieldConflict[] = [];

  for (const field of fields) {
    const groups = new Map<string, { lessonIds: string[]; count: number }>();
    for (const entry of behaviors) {
      const value = String(entry.behavior[field]);
      const existing = groups.get(value);
      if (existing) {
        existing.lessonIds.push(entry.lessonId);
        existing.count += 1;
      } else {
        groups.set(value, { lessonIds: [entry.lessonId], count: 1 });
      }
    }
    if (groups.size <= 1) continue;
    conflicts.push({
      field,
      groups: [...groups.entries()]
        .map(([value, meta]) => ({ value, lessonIds: meta.lessonIds, count: meta.count }))
        .sort((a, b) => b.count - a.count),
    });
  }

  return conflicts;
}

export function courseHasExplicitLessonQuizPolicy(course: CourseQuizPolicyInput): boolean {
  const policy = course.lessonQuizPolicy;
  if (!policy || typeof policy !== 'object') return false;
  return (
    policy.questionCount !== undefined ||
    policy.successThreshold !== undefined ||
    policy.shownAnswerCount !== undefined ||
    policy.maxWrongAllowed !== undefined ||
    policy.enabled === false ||
    policy.required === false
  );
}

export function buildCourseQuizPolicyBackfillPlan(input: {
  courseId: string;
  course: CourseQuizPolicyInput;
  lessons: LessonInput[];
  force?: boolean;
}): CourseQuizPolicyBackfillPlan {
  const { courseId, course, lessons, force = false } = input;
  const currentPolicy = toStoredLessonQuizPolicy(resolveCourseQuizPolicy(course));

  if (courseHasExplicitLessonQuizPolicy(course) && !force) {
    return {
      courseId,
      action: 'skip_has_explicit_policy',
      currentPolicy,
      proposedPolicy: currentPolicy,
      changed: false,
      lessonCount: lessons.length,
      behaviorLessonCount: 0,
      conflicts: [],
      divergentLessonIds: [],
    };
  }

  const behaviorLessons = lessons
    .map((lesson) => ({
      lessonId: lesson.lessonId,
      behavior: extractLessonQuizBehavior(lesson.quizConfig),
    }))
    .filter((entry): entry is { lessonId: string; behavior: LessonQuizBehavior } => entry.behavior != null);

  const signatureGroups = new Map<string, string[]>();
  for (const entry of behaviorLessons) {
    const key = behaviorKey(entry.behavior);
    const group = signatureGroups.get(key) ?? [];
    group.push(entry.lessonId);
    signatureGroups.set(key, group);
  }

  const divergentLessonIds =
    signatureGroups.size > 1
      ? [...new Set(behaviorLessons.map((entry) => entry.lessonId))]
      : [];

  if (behaviorLessons.length > 0) {
    const derived = {
      enabled: pickModeBoolean(
        behaviorLessons.map((entry) => entry.behavior.enabled),
        true
      ),
      required: pickModeBoolean(
        behaviorLessons.map((entry) => entry.behavior.required),
        true
      ),
      questionCount: pickModeNumber(
        behaviorLessons.map((entry) => entry.behavior.questionCount),
        5,
        'lower'
      ),
      successThreshold: pickModeNumber(
        behaviorLessons.map((entry) => entry.behavior.successThreshold),
        70,
        'higher'
      ),
    };
    const conflicts = buildFieldConflicts(behaviorLessons);
    const proposedInput: CourseQuizPolicyInput = {
      ...course,
      lessonQuizPolicy: {
        ...course.lessonQuizPolicy,
        ...derived,
        shownAnswerCount: course.lessonQuizPolicy?.shownAnswerCount,
        maxWrongAllowed: course.lessonQuizPolicy?.maxWrongAllowed ?? course.quizMaxWrongAllowed,
      },
    };

    const proposedPolicy = buildCourseQuizPolicyPackageFields(proposedInput).lessonQuizPolicy;
    const changed = JSON.stringify(proposedPolicy) !== JSON.stringify(currentPolicy);

    return {
      courseId,
      action: conflicts.length > 0 || divergentLessonIds.length > 0 ? 'apply_with_conflicts' : 'apply',
      currentPolicy,
      proposedPolicy,
      changed,
      lessonCount: lessons.length,
      behaviorLessonCount: behaviorLessons.length,
      conflicts,
      divergentLessonIds,
    };
  }

  const fallbackFields = buildCourseQuizPolicyPackageFields(course);
  if (
    behaviorLessons.length === 0 &&
    course.quizMaxWrongAllowed === undefined &&
    course.defaultLessonQuizQuestionCount === undefined &&
    !course.lessonQuizPolicy
  ) {
    return {
      courseId,
      action: 'skip_no_sources',
      currentPolicy,
      proposedPolicy: currentPolicy,
      changed: false,
      lessonCount: lessons.length,
      behaviorLessonCount: 0,
      conflicts: [],
      divergentLessonIds: [],
    };
  }

  const proposedPolicy = fallbackFields.lessonQuizPolicy;
  const changed = JSON.stringify(proposedPolicy) !== JSON.stringify(currentPolicy);

  return {
    courseId,
    action: 'apply',
    currentPolicy,
    proposedPolicy,
    changed,
    lessonCount: lessons.length,
    behaviorLessonCount: 0,
    conflicts: [],
    divergentLessonIds: [],
  };
}
