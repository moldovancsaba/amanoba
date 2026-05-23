import { describe, expect, it } from 'vitest';
import { buildCourseQuizPolicyPackageFields, resolveCourseQuizPolicy } from '@/lib/course-quiz-policy';

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

describe('buildCourseQuizPolicyPackageFields', () => {
  it('exports canonical lessonQuizPolicy from stored course policy', () => {
    const fields = buildCourseQuizPolicyPackageFields({
      lessonQuizPolicy: {
        questionCount: 8,
        shownAnswerCount: 4,
        maxWrongAllowed: 2,
        successThreshold: 80,
      },
    });

    expect(fields.lessonQuizPolicy).toMatchObject({
      enabled: true,
      required: true,
      questionCount: 8,
      shownAnswerCount: 4,
      maxWrongAllowed: 2,
      successThreshold: 80,
    });
    expect(fields.quizMaxWrongAllowed).toBeUndefined();
  });

  it('imports legacy course fields into canonical lessonQuizPolicy without lesson quizConfig authority', () => {
    const fields = buildCourseQuizPolicyPackageFields({
      quizMaxWrongAllowed: 3,
      defaultLessonQuizQuestionCount: 9,
    });

    expect(fields.lessonQuizPolicy).toMatchObject({
      questionCount: 9,
      maxWrongAllowed: 3,
    });
    expect(fields.quizMaxWrongAllowed).toBe(3);
    expect(fields.defaultLessonQuizQuestionCount).toBe(9);
  });

  it('prefers explicit lessonQuizPolicy over legacy course fields in package import', () => {
    const fields = buildCourseQuizPolicyPackageFields({
      quizMaxWrongAllowed: 4,
      defaultLessonQuizQuestionCount: 12,
      lessonQuizPolicy: {
        questionCount: 6,
        maxWrongAllowed: 1,
      },
    });

    expect(fields.lessonQuizPolicy).toMatchObject({
      questionCount: 6,
      maxWrongAllowed: 1,
    });
  });
});
