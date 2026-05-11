/**
 * Quiz answer feedback helpers
 *
 * What: Builds bounded answer explanations for lesson-quiz feedback
 * Why: Keeps mistake feedback grounded in authored content with safe fallbacks
 */

type QuestionTypeHint =
  | 'definition'
  | 'concept'
  | 'application'
  | 'critical-thinking'
  | 'best_practice'
  | 'diagnostic'
  | 'metric';

const QUESTION_TYPE_HINTS: Record<QuestionTypeHint, string> = {
  definition: 'Review the lesson definition for this term and compare it with the answer choices.',
  concept: 'Go back to the core concept in the lesson and check which option matches that idea.',
  application: 'Focus on how the lesson applies the concept in context, not just the keyword match.',
  'critical-thinking': 'Eliminate the options that conflict with the lesson logic, then compare the remaining choice to the main idea.',
  best_practice: 'Look for the option that matches the recommended practice from the lesson, not the tempting shortcut.',
  diagnostic: 'Use the main signal from the lesson to rule out the distractors before picking the answer.',
  metric: 'Check which metric or measurable signal the lesson used for this case before answering.',
};

function normalizeExplanation(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function buildQuizAnswerExplanation(input: {
  authoredExplanation?: unknown;
  questionType?: unknown;
}): string | null {
  const authoredExplanation = normalizeExplanation(input.authoredExplanation);
  if (authoredExplanation) {
    return authoredExplanation;
  }

  if (typeof input.questionType !== 'string') {
    return null;
  }

  return QUESTION_TYPE_HINTS[input.questionType as QuestionTypeHint] ?? null;
}
