type AssessmentResultsLike =
  | Map<string, unknown>
  | Record<string, unknown>
  | Array<[string, unknown]>
  | null
  | undefined;

export function hasAssessmentResultForDay(
  assessmentResults: AssessmentResultsLike,
  dayNumber: number | string
): boolean {
  if (!assessmentResults) {
    return false;
  }

  const dayKey = String(dayNumber);

  if (assessmentResults instanceof Map) {
    return assessmentResults.has(dayKey);
  }

  if (Array.isArray(assessmentResults)) {
    return assessmentResults.some(([key]) => String(key) === dayKey);
  }

  if (typeof assessmentResults === 'object') {
    return Object.prototype.hasOwnProperty.call(assessmentResults, dayKey);
  }

  return false;
}

export function hasAssessmentResultsForEveryDay(
  assessmentResults: AssessmentResultsLike,
  totalDays: number
): boolean {
  return totalDays > 0 && Array.from({ length: totalDays }, (_, index) => index + 1)
    .every((dayNumber) => hasAssessmentResultForDay(assessmentResults, dayNumber));
}

export function setAssessmentResultForDay(
  assessmentResults: AssessmentResultsLike,
  dayNumber: number | string,
  value: unknown
): Map<string, unknown> | Record<string, unknown> {
  const dayKey = String(dayNumber);

  if (assessmentResults instanceof Map) {
    assessmentResults.set(dayKey, value);
    return assessmentResults;
  }

  if (assessmentResults && typeof assessmentResults === 'object' && !Array.isArray(assessmentResults)) {
    assessmentResults[dayKey] = value;
    return assessmentResults;
  }

  const nextAssessmentResults = new Map<string, unknown>();
  nextAssessmentResults.set(dayKey, value);
  return nextAssessmentResults;
}
