import { describe, it, expect } from 'vitest';
import { difficultyForAccuracy } from '@/lib/games/adaptive-difficulty';

describe('difficultyForAccuracy', () => {
  it('serves EASY for weak recent accuracy', () => {
    expect(difficultyForAccuracy(0)).toBe('EASY');
    expect(difficultyForAccuracy(49)).toBe('EASY');
  });

  it('serves MEDIUM in the middle band', () => {
    expect(difficultyForAccuracy(50)).toBe('MEDIUM');
    expect(difficultyForAccuracy(69)).toBe('MEDIUM');
  });

  it('serves HARD for strong accuracy', () => {
    expect(difficultyForAccuracy(70)).toBe('HARD');
    expect(difficultyForAccuracy(84)).toBe('HARD');
  });

  it('serves EXPERT for mastery', () => {
    expect(difficultyForAccuracy(85)).toBe('EXPERT');
    expect(difficultyForAccuracy(100)).toBe('EXPERT');
  });
});
