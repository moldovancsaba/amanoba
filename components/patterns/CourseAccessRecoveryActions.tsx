'use client';

import { Button, Group } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';
import type { CourseAccessRecoveryIssue } from '@/app/lib/course-access-recovery';

type CourseAccessRecoveryActionsProps = {
  issue: CourseAccessRecoveryIssue;
  courseId: string;
  courseLanguage: string;
  signInHref: string;
  backLabel: string;
  backHref?: string;
  signInLabel?: string;
  continueLabel?: string;
  onRetry?: () => void;
};

export default function CourseAccessRecoveryActions({
  issue,
  courseId,
  courseLanguage,
  signInHref,
  backLabel,
  backHref,
  signInLabel = 'Sign in',
  continueLabel = 'Continue course',
  onRetry,
}: CourseAccessRecoveryActionsProps) {
  const courseHref = backHref ?? `/${courseLanguage}/courses/${courseId}`;
  const continueHref =
    typeof issue.continueDay === 'number'
      ? `/${courseLanguage}/courses/${courseId}/day/${issue.continueDay}`
      : courseHref;

  return (
    <Group>
      {issue.action === 'signin' ? (
        <Button component={LocaleLink} href={signInHref} color="amanoba">
          {signInLabel}
        </Button>
      ) : null}
      {issue.action === 'retry' && onRetry ? (
        <Button onClick={onRetry} variant="outline" leftSection={<IconRefresh size={16} />}>
          Retry
        </Button>
      ) : null}
      {issue.action === 'continue' ? (
        <Button component={LocaleLink} href={continueHref} color="amanoba">
          {continueLabel}
        </Button>
      ) : null}
      <Button
        component={LocaleLink}
        href={courseHref}
        variant={issue.action === 'course' ? 'filled' : 'outline'}
        color={issue.action === 'course' ? 'amanoba' : 'gray'}
      >
        {backLabel}
      </Button>
    </Group>
  );
}
