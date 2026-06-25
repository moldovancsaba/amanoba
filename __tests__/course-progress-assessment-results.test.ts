import { describe, expect, it } from 'vitest';
import {
  hasAssessmentResultForDay,
  hasAssessmentResultsForEveryDay,
  setAssessmentResultForDay,
} from '@/lib/course-progress-assessment-results';

describe('course progress assessment result helpers', () => {
  it('supports Mongoose Map values', () => {
    const results = new Map<string, unknown>([
      ['1', 'assessment-1'],
      ['2', 'assessment-2'],
      ['3', 'assessment-3'],
    ]);

    expect(hasAssessmentResultForDay(results, 2)).toBe(true);
    expect(hasAssessmentResultsForEveryDay(results, 3)).toBe(true);
  });

  it('supports lean Mongo object values from production', () => {
    const results = {
      1: 'assessment-1',
      2: 'assessment-2',
      3: 'assessment-3',
    };

    expect(hasAssessmentResultForDay(results, '2')).toBe(true);
    expect(hasAssessmentResultsForEveryDay(results, 3)).toBe(true);
  });

  it('fails closed when a required day is missing', () => {
    const results = {
      1: 'assessment-1',
      3: 'assessment-3',
    };

    expect(hasAssessmentResultsForEveryDay(results, 3)).toBe(false);
  });

  it('sets values without assuming Map shape', () => {
    const objectResults = { 1: 'assessment-1' };
    const updatedObject = setAssessmentResultForDay(objectResults, 2, 'assessment-2');
    expect(hasAssessmentResultsForEveryDay(updatedObject, 2)).toBe(true);

    const mapResults = new Map<string, unknown>();
    const updatedMap = setAssessmentResultForDay(mapResults, 1, 'assessment-1');
    expect(hasAssessmentResultForDay(updatedMap, 1)).toBe(true);
  });
});
