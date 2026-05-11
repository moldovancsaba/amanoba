/**
 * Practice Hub shared helpers
 *
 * What: Shared types and validation for Practice Hub telemetry and rewards
 * Why: Keeps client and server in sync for mode ids, query params, and reward rules
 */

export const PRACTICE_MODE_IDS = ['continue-next', 'quiz-recovery', 'stale-refresh'] as const;
export type PracticeModeId = (typeof PRACTICE_MODE_IDS)[number];

export const PRACTICE_COMPLETION_TRIGGERS = ['lesson_completed', 'quiz_passed'] as const;
export type PracticeCompletionTrigger = (typeof PRACTICE_COMPLETION_TRIGGERS)[number];

export const PRACTICE_TRACK_EVENTS = [
  'viewed',
  'recommendation_opened',
  'completion_recorded',
  'reward_granted',
] as const;
export type PracticeTrackEvent = (typeof PRACTICE_TRACK_EVENTS)[number];

export type PracticeContext = {
  mode: PracticeModeId;
  courseId: string;
  lessonDay: number;
};

export const PRACTICE_HUB_QUIZ_RECOVERY_REWARD = {
  points: 3,
  xp: 3,
} as const;

export function isPracticeModeId(value: unknown): value is PracticeModeId {
  return typeof value === 'string' && (PRACTICE_MODE_IDS as readonly string[]).includes(value);
}

export function isPracticeCompletionTrigger(value: unknown): value is PracticeCompletionTrigger {
  return typeof value === 'string' && (PRACTICE_COMPLETION_TRIGGERS as readonly string[]).includes(value);
}

export function parsePracticeContext(input: unknown): PracticeContext | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;
  if (!isPracticeModeId(raw.mode)) return null;
  if (typeof raw.courseId !== 'string' || raw.courseId.length === 0) return null;
  if (typeof raw.lessonDay !== 'number' || !Number.isInteger(raw.lessonDay) || raw.lessonDay < 1) return null;

  return {
    mode: raw.mode,
    courseId: raw.courseId,
    lessonDay: raw.lessonDay,
  };
}

export function readPracticeContextFromSearchParams(
  params: { get(name: string): string | null }
): PracticeContext | null {
  const mode = params.get('practiceMode');
  const courseId = params.get('practiceCourseId');
  const lessonDayValue = params.get('practiceDay');
  if (!isPracticeModeId(mode) || !courseId || !lessonDayValue) return null;

  const lessonDay = Number.parseInt(lessonDayValue, 10);
  if (!Number.isInteger(lessonDay) || lessonDay < 1) return null;

  return {
    mode,
    courseId,
    lessonDay,
  };
}

export function appendPracticeContextToHref(baseHref: string, context: PracticeContext): string {
  const separator = baseHref.includes('?') ? '&' : '?';
  const params = new URLSearchParams({
    practiceMode: context.mode,
    practiceCourseId: context.courseId,
    practiceDay: String(context.lessonDay),
  });
  return `${baseHref}${separator}${params.toString()}`;
}

export function isPracticeRewardEligible(
  context: PracticeContext,
  trigger: PracticeCompletionTrigger
): boolean {
  return context.mode === 'quiz-recovery' && trigger === 'quiz_passed';
}
