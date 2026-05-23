import { describe, expect, it } from 'vitest';
import {
  minWrongAnswersForShownCount,
  validateQuestionAuthoringInput,
} from '@/lib/quiz-question-authoring';

describe('quiz-question-authoring', () => {
  it('accepts legacy stored options with 4+ entries', () => {
    const result = validateQuestionAuthoringInput(
      {
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 1,
      },
      3
    );
    expect(result.ok).toBe(true);
  });

  it('accepts correctAnswer + wrongAnswers for policy shown count', () => {
    const result = validateQuestionAuthoringInput(
      {
        correctAnswer: 'Right',
        wrongAnswers: ['Wrong one', 'Wrong two'],
      },
      3
    );
    expect(result.ok).toBe(true);
  });

  it('requires more wrongAnswers when shown answer count is 4', () => {
    expect(minWrongAnswersForShownCount(4)).toBe(3);
    const result = validateQuestionAuthoringInput(
      {
        correctAnswer: 'Right',
        wrongAnswers: ['Wrong one', 'Wrong two'],
      },
      4
    );
    expect(result.ok).toBe(false);
  });
});
