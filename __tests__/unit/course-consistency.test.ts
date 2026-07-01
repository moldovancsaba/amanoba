import { describe, it, expect } from 'vitest';
import { courseConsistencyPct } from '@/lib/gamification/leaderboard-calculator';

describe('courseConsistencyPct (no-missed-days score)', () => {
  it('is 100 when every reached day was completed', () => {
    expect(courseConsistencyPct([1, 2, 3, 4, 5])).toBe(100);
    expect(courseConsistencyPct([1])).toBe(100);
  });

  it('drops when days were skipped', () => {
    // reached day 5, completed 4 of them -> 80%
    expect(courseConsistencyPct([1, 2, 4, 5])).toBe(80);
    // reached day 10, completed 5 -> 50%
    expect(courseConsistencyPct([1, 2, 3, 4, 10])).toBe(50);
  });

  it('is order-independent (uses max as span)', () => {
    expect(courseConsistencyPct([5, 1, 3, 2, 4])).toBe(100);
  });

  it('returns 0 for empty progress', () => {
    expect(courseConsistencyPct([])).toBe(0);
  });
});
