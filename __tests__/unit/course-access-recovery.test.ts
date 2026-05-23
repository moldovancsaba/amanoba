import { describe, expect, it } from 'vitest';
import { resolveCourseAccessIssue } from '@/app/lib/course-access-recovery';

describe('resolveCourseAccessIssue', () => {
  it('maps anonymous lesson access to sign-in recovery', () => {
    const issue = resolveCourseAccessIssue(
      401,
      { success: false, error: 'Unauthorized', code: 'SIGN_IN_REQUIRED' },
      'en',
      'lesson'
    );

    expect(issue.code).toBe('SIGN_IN_REQUIRED');
    expect(issue.action).toBe('signin');
    expect(issue.title).toBe('Sign in required');
    expect(issue.message).toContain('Sign in to continue');
  });

  it('maps anonymous quiz access to sign-in recovery without raw Unauthorized text', () => {
    const issue = resolveCourseAccessIssue(
      401,
      { success: false, error: 'Unauthorized', code: 'SIGN_IN_REQUIRED' },
      'en',
      'quiz'
    );

    expect(issue.action).toBe('signin');
    expect(issue.message).toContain('quiz');
    expect(issue.message).not.toBe('Unauthorized');
  });

  it('keeps true lesson-not-found separate from sign-in', () => {
    const issue = resolveCourseAccessIssue(
      404,
      { success: false, error: 'Lesson not found', code: 'LESSON_NOT_FOUND' },
      'en',
      'lesson'
    );

    expect(issue.code).toBe('LESSON_NOT_FOUND');
    expect(issue.action).toBe('course');
    expect(issue.title).toBe('Lesson not found');
  });
});
