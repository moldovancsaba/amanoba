'use client';

import {
  AccessRecoveryPanel,
  type AccessRecoveryAction,
  type AccessRecoveryState,
} from '@gds/core';
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

function mapIssueToState(issue: CourseAccessRecoveryIssue): AccessRecoveryState {
  if (issue.status === 401 || issue.action === 'signin') return 'unauthenticated';
  if (issue.status === 403) return 'forbidden';
  if (issue.status === 404) return 'missing';
  return 'unavailable';
}

function continueAction(href: string): AccessRecoveryAction {
  return {
    action: 'start',
    onClick: () => {
      window.location.href = href;
    },
    color: 'amanoba',
    variant: 'filled',
  };
}

export default function CourseAccessRecoveryActions({
  issue,
  courseId,
  courseLanguage,
  signInHref,
  backLabel: _backLabel,
  backHref,
  onRetry,
}: CourseAccessRecoveryActionsProps) {
  const courseHref = backHref ?? `/${courseLanguage}/courses/${courseId}`;
  const continueHref =
    typeof issue.continueDay === 'number'
      ? `/${courseLanguage}/courses/${courseId}/day/${issue.continueDay}`
      : courseHref;

  const state = mapIssueToState(issue);

  const primaryAction: AccessRecoveryAction | null =
    issue.action === 'continue'
      ? continueAction(continueHref)
      : issue.action === 'signin'
        ? {
            action: 'login',
            onClick: () => {
              window.location.href = signInHref;
            },
            color: 'amanoba',
            variant: 'filled',
          }
        : issue.action === 'retry' && onRetry
          ? { action: 'refresh', onClick: onRetry, variant: 'light' }
          : null;

  const secondaryAction: AccessRecoveryAction | null =
    issue.action === 'course' || issue.action === 'continue' || issue.action === 'retry'
      ? {
          action: 'back',
          onClick: () => {
            window.location.href = courseHref;
          },
          variant: issue.action === 'course' ? 'filled' : 'default',
          color: issue.action === 'course' ? 'amanoba' : 'gray',
        }
      : {
          action: 'back',
          onClick: () => {
            window.location.href = courseHref;
          },
          variant: 'default',
          color: 'gray',
        };

  return (
    <AccessRecoveryPanel
      state={state}
      title={issue.title}
      description={issue.message}
      compact
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      onSignIn={() => {
        window.location.href = signInHref;
      }}
      onBack={() => {
        window.location.href = courseHref;
      }}
      onRetry={onRetry}
    />
  );
}
