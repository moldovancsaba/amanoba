/**
 * Quiz question helpers: 3-option display (1 correct + 2 random wrong), correct-answer resolution.
 * Used by lesson quiz and final exam.
 */

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns the correct answer string for grading (works for both legacy and correctAnswer format).
 */
export function getCorrectAnswerString(q: { options?: string[]; correctIndex?: number; correctAnswer?: string }): string | undefined {
  if (q.correctAnswer && q.correctAnswer.trim()) return q.correctAnswer.trim();
  if (Array.isArray(q.options) && q.options.length > 0 && typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length) {
    return q.options[q.correctIndex]?.trim();
  }
  return undefined;
}

/**
 * Builds N display options: correct + (N-1) random wrong, shuffled.
 * Returns { options: string[N], correctAnswerValue: string }.
 * For legacy questions (4+ options), uses the wrong options from `options`.
 */
export function buildQuizOptions(
  q: { options?: string[]; correctIndex?: number; correctAnswer?: string; wrongAnswers?: string[] },
  shownAnswerCount = 3
): { options: string[]; correctAnswerValue: string } | null {
  const desiredCount = Math.max(2, Math.min(4, Math.round(shownAnswerCount)));
  const wrongsNeeded = desiredCount - 1;
  const correct = getCorrectAnswerString(q);
  if (!correct) return null;

  let wrongs: string[];
  if (Array.isArray(q.wrongAnswers) && q.wrongAnswers.length >= wrongsNeeded) {
    wrongs = q.wrongAnswers.filter((w) => w && String(w).trim() && String(w).trim() !== correct);
    if (wrongs.length < wrongsNeeded) return null;
  } else if (Array.isArray(q.options) && q.options.length >= 4 && typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length) {
    wrongs = q.options.filter((_, i) => i !== q.correctIndex).map((s) => String(s).trim()).filter(Boolean);
    if (wrongs.length < wrongsNeeded) return null;
  } else {
    return null;
  }

  const sampledWrong = shuffle(wrongs).slice(0, wrongsNeeded);
  const finalOptions = shuffle([correct, ...sampledWrong]);
  return { options: finalOptions, correctAnswerValue: correct };
}

/**
 * Backward-compatible alias for 3-option quiz rendering.
 */
export function buildThreeOptions(
  q: { options?: string[]; correctIndex?: number; correctAnswer?: string; wrongAnswers?: string[] }
): { options: string[]; correctAnswerValue: string } | null {
  return buildQuizOptions(q, 3);
}
