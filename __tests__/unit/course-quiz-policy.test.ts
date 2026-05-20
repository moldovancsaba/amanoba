import { describe, expect, it } from 'vitest';
import { resolveCourseQuizPolicy } from '@/lib/course-quiz-policy';

describe('resolveCourseQuizPolicy', () => {
  it('prefers the canonical course lessonQuizPolicy over legacy course fallbacks', () => {
    const policy = resolveCourseQuizPolicy({
      defaultLessonQuizQuestionCount: 12,
      quizMaxWrongAllowed: 4,
      lessonQuizPolicy: {
        questionCount: 7,
        shownAnswerCount: 4,
        maxWrongAllowed: 1,
        successThreshold: 85,
      },
    });

    expect(policy).toMatchObject({
      enabled: true,
      required: true,
      questionCount: 7,
      shownAnswerCount: 4,
      maxWrongAllowed: 1,
      successThreshold: 85,
    });
  });

  it('keeps legacy course fields as compatibility fallbacks only', () => {
    const policy = resolveCourseQuizPolicy({
      defaultLessonQuizQuestionCount: 9,
      quizMaxWrongAllowed: 2,
      lessonQuizPolicy: {
        shownAnswerCount: 3,
      },
    });

    expect(policy).toMatchObject({
      questionCount: 9,
      shownAnswerCount: 3,
      maxWrongAllowed: 2,
    });
  });
});
