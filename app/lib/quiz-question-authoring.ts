/**
 * Authoring and API validation for quiz questions against course shown-answer policy.
 */

export type QuestionAuthoringInput = {
  options?: string[];
  correctIndex?: number;
  correctAnswer?: string;
  wrongAnswers?: string[];
};

export const LEGACY_STORED_OPTIONS_MIN = 4;

export function clampShownAnswerCount(value: unknown, fallback = 3): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(2, Math.min(4, Math.round(value)));
}

export function minWrongAnswersForShownCount(shownAnswerCount: number): number {
  return clampShownAnswerCount(shownAnswerCount) - 1;
}

export function validateQuestionAuthoringInput(
  input: QuestionAuthoringInput,
  shownAnswerCount = 3
): { ok: true } | { ok: false; error: string } {
  const displayCount = clampShownAnswerCount(shownAnswerCount);
  const minWrongs = minWrongAnswersForShownCount(displayCount);

  const correctAnswer = typeof input.correctAnswer === 'string' ? input.correctAnswer.trim() : '';
  const wrongAnswers = Array.isArray(input.wrongAnswers)
    ? input.wrongAnswers.map((entry) => String(entry).trim()).filter(Boolean)
    : [];

  if (correctAnswer && wrongAnswers.length >= minWrongs) {
    const uniqueWrongs = new Set(wrongAnswers.map((entry) => entry.toLowerCase()));
    if (uniqueWrongs.size !== wrongAnswers.length) {
      return { ok: false, error: 'All wrongAnswers must be unique' };
    }
    if (wrongAnswers.some((entry) => entry.toLowerCase() === correctAnswer.toLowerCase())) {
      return { ok: false, error: 'wrongAnswers must not include the correctAnswer' };
    }
    return { ok: true };
  }

  const options = Array.isArray(input.options)
    ? input.options.map((entry) => String(entry).trim()).filter(Boolean)
    : [];

  if (options.length >= LEGACY_STORED_OPTIONS_MIN) {
    const uniqueOptions = new Set(options.map((entry) => entry.toLowerCase()));
    if (uniqueOptions.size !== options.length) {
      return { ok: false, error: 'All options must be unique' };
    }
    if (
      typeof input.correctIndex !== 'number' ||
      !Number.isInteger(input.correctIndex) ||
      input.correctIndex < 0 ||
      input.correctIndex >= options.length
    ) {
      return {
        ok: false,
        error: 'correctIndex must be between 0 and options.length - 1',
      };
    }
    return { ok: true };
  }

  return {
    ok: false,
    error: `Provide correctAnswer with at least ${minWrongs} wrongAnswers for ${displayCount} shown answers, or ${LEGACY_STORED_OPTIONS_MIN}+ stored options`,
  };
}

export function legacyOptionsValidationMessage(shownAnswerCount: number): string {
  const displayCount = clampShownAnswerCount(shownAnswerCount);
  return `Must provide at least ${LEGACY_STORED_OPTIONS_MIN} stored options (legacy bank format). Runtime shows ${displayCount} answers per course policy.`;
}
