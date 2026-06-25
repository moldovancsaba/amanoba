import {
  getMapLikeValue,
  hasMapLikeKey,
  setMapLikeValue,
  type MapLike,
} from '@/lib/map-like';

type AssessmentResultsLike =
  | MapLike
  | Array<[string, unknown]>;

export function hasAssessmentResultForDay(
  assessmentResults: AssessmentResultsLike,
  dayNumber: number | string
): boolean {
  return hasMapLikeKey(assessmentResults, String(dayNumber));
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
): Map<string | number, unknown> | Record<string, unknown> {
  return setMapLikeValue(assessmentResults, String(dayNumber), value);
}

export function getAssessmentResultForDay(
  assessmentResults: AssessmentResultsLike,
  dayNumber: number | string
): unknown {
  return getMapLikeValue(assessmentResults, String(dayNumber));
}
