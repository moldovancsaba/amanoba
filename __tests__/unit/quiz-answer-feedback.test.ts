import { describe, expect, it } from 'vitest';
import { buildQuizAnswerExplanation } from '@/app/lib/quiz-answer-feedback';

describe('buildQuizAnswerExplanation', () => {
  it('prefers authored explanations when available', () => {
    expect(
      buildQuizAnswerExplanation({
        authoredExplanation: 'Review the lesson rule about when this phrase applies.',
        questionType: 'application',
      })
    ).toBe('Review the lesson rule about when this phrase applies.');
  });

  it('falls back to a question-type hint when no authored explanation exists', () => {
    expect(
      buildQuizAnswerExplanation({
        questionType: 'best_practice',
      })
    ).toBe(
      'Look for the option that matches the recommended practice from the lesson, not the tempting shortcut.'
    );
  });

  it('returns null when neither authored content nor a supported hint exists', () => {
    expect(buildQuizAnswerExplanation({ questionType: 'unknown-type' })).toBeNull();
    expect(buildQuizAnswerExplanation({})).toBeNull();
  });
});
