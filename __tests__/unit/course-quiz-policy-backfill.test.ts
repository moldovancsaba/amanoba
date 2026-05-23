import { describe, expect, it } from 'vitest';
import {
  buildCourseQuizPolicyBackfillPlan,
  courseHasExplicitLessonQuizPolicy,
  extractLessonQuizBehavior,
} from '@/lib/course-quiz-policy-backfill';

describe('course-quiz-policy-backfill', () => {
  it('extracts behavior fields from legacy lesson quizConfig', () => {
    expect(
      extractLessonQuizBehavior({
        enabled: true,
        required: true,
        questionCount: 7,
        successThreshold: 80,
        poolSize: 10,
      })
    ).toMatchObject({
      questionCount: 7,
      successThreshold: 80,
    });
  });

  it('skips courses that already have explicit lessonQuizPolicy unless forced', () => {
    const plan = buildCourseQuizPolicyBackfillPlan({
      courseId: 'TEST_COURSE',
      course: {
        lessonQuizPolicy: { questionCount: 6, shownAnswerCount: 3, successThreshold: 70 },
      },
      lessons: [
        {
          lessonId: 'L1',
          quizConfig: { enabled: true, required: true, questionCount: 9, successThreshold: 70, poolSize: 10 },
        },
      ],
    });

    expect(plan.action).toBe('skip_has_explicit_policy');
    expect(plan.changed).toBe(false);
  });

  it('derives most-common lesson behavior and reports conflicts', () => {
    const plan = buildCourseQuizPolicyBackfillPlan({
      courseId: 'TEST_COURSE',
      course: {},
      lessons: [
        {
          lessonId: 'L1',
          quizConfig: { enabled: true, required: true, questionCount: 7, successThreshold: 70, poolSize: 10 },
        },
        {
          lessonId: 'L2',
          quizConfig: { enabled: true, required: true, questionCount: 7, successThreshold: 70, poolSize: 10 },
        },
        {
          lessonId: 'L3',
          quizConfig: { enabled: true, required: true, questionCount: 5, successThreshold: 90, poolSize: 10 },
        },
      ],
      force: true,
    });

    expect(plan.action).toBe('apply_with_conflicts');
    expect(plan.proposedPolicy.questionCount).toBe(7);
    expect(plan.proposedPolicy.successThreshold).toBe(70);
    expect(plan.conflicts.length).toBeGreaterThan(0);
    expect(courseHasExplicitLessonQuizPolicy({ lessonQuizPolicy: { questionCount: 6 } })).toBe(true);
  });
});
