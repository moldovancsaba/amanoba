import { describe, expect, it } from 'vitest';
import { calculateCurrentLessonDay, normalizeCourseDurationDays } from '@/app/lib/course-helpers';

describe('course length helpers', () => {
  it('normalizes course duration without imposing a 30 or 365 day cap', () => {
    expect(normalizeCourseDurationDays(1)).toBe(1);
    expect(normalizeCourseDurationDays(500)).toBe(500);
    expect(normalizeCourseDurationDays('12')).toBe(12);
    expect(normalizeCourseDurationDays(3.8)).toBe(3);
    expect(normalizeCourseDurationDays(0, 7)).toBe(7);
  });

  it('calculates the first incomplete lesson day for arbitrary course lengths', () => {
    expect(calculateCurrentLessonDay([], 1)).toBe(1);
    expect(calculateCurrentLessonDay([1], 1)).toBe(2);
    expect(calculateCurrentLessonDay([1, 2, 4], 5)).toBe(3);
    expect(calculateCurrentLessonDay(Array.from({ length: 500 }, (_, index) => index + 1), 500)).toBe(501);
  });
});
