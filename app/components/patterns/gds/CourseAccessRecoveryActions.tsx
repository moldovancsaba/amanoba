'use client';

import {
  AccessRecoveryPanel,
  type AccessRecoveryAction,
  type AccessRecoveryState,
} from '@doneisbetter/gds-core/client';
import type { CourseAccessRecoveryIssue } from '@/app/lib/course-access-recovery';

/**
 * Props for {@link CourseAccessRecoveryActions}.
 * 
 * @property {CourseAccessRecoveryIssue} issue - Access issue resolved from API (see {@link resolveCourseAccessIssue})
 * @property {string} courseId - Course identifier for fallback navigation
 * @property {string} courseLanguage - Course language for locale-aware routing
 * @property {string} signInHref - Sign-in page URL (with callback)
 * @property {string} backLabel - Label for back/cancel action (currently unused, reserved)
 * @property {string} [backHref] - Optional override for back navigation (defaults to course overview)
 * @property {string} [signInLabel] - Reserved for future use
 * @property {string} [continueLabel] - Reserved for future use
 * @property {() => void} [onRetry] - Optional retry callback (for retryable errors)
 * 
 * @example
 * ```tsx
 * const issue = resolveCourseAccessIssue(401, { code: 'SIGN_IN_REQUIRED' }, 'en', 'lesson');
 * 
 * <CourseAccessRecoveryActions
 *   issue={issue}
 *   courseId="JS101"
 *   courseLanguage="en"
 *   signInHref="/en/auth/signin?callbackUrl=/en/courses/JS101/day/1"
 *   backLabel="Back"
 *   onRetry={() => refetch()}
 * />
 * ```
 */
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

/**
 * Maps course access issue to GDS AccessRecoveryState.
 * 
 * **Mapping**:
 * - 401 or 'signin' action → 'unauthenticated'
 * - 403 → 'forbidden'
 * - 404 → 'missing'
 * - Other → 'unavailable'
 * 
 * @param issue - Course access recovery issue
 * @returns GDS AccessRecoveryState
 */
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

/**
 * Canonical course access recovery adapter for gated routes and permission states.
 * 
 * **Contract**: Display unified recovery UI for protected lesson/quiz routes.
 * 
 * **Server/Client Safety**: ⚠️ Client-only (uses GDS client component, window.location)
 * 
 * **Consuming Routes**:
 * - `/[locale]/courses/[courseId]/day/[dayNumber]/(enrolled)/page` - Lesson access
 * - `/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page` - Quiz access
 * 
 * **GDS Backing**: ✅ `@doneisbetter/gds-core/client` `AccessRecoveryPanel`
 * 
 * **Access Issue Taxonomy** (from {@link resolveCourseAccessIssue}):
 * - `SIGN_IN_REQUIRED` (401) → 'signin' action → Sign in to continue
 * - `COURSE_NOT_FOUND` (404) → 'course' action → Return to catalog
 * - `LESSON_NOT_FOUND` (404) → 'course' action → Return to course overview
 * - `INVALID_DAY_NUMBER` → 'course' action → Return to course overview
 * - `LESSON_LOCKED` (403) → 'continue' action → Continue from saved progress
 * - `NETWORK_ERROR` (0) → 'retry' action → Retry request
 * - Other → 'retry' or 'course' based on status
 * 
 * **Recovery Actions**:
 * - `signin`: Navigate to sign-in page with callback
 * - `continue`: Navigate to saved progress day
 * - `retry`: Call onRetry callback (if provided)
 * - `course`: Return to course overview
 * 
 * **State Mapping to GDS**:
 * - 401 / 'signin' → 'unauthenticated'
 * - 403 → 'forbidden'
 * - 404 → 'missing'
 * - Other → 'unavailable'
 * 
 * **Primary Action Priority**:
 * 1. 'continue' → Start button (navigate to continueDay)
 * 2. 'signin' → Login button (navigate to sign-in)
 * 3. 'retry' (+ onRetry) → Refresh button (call onRetry)
 * 4. null (no primary action)
 * 
 * **Secondary Action**:
 * - Always: Back button (navigate to course overview)
 * - Style varies: filled+primary (if action='course'), default otherwise
 * 
 * **Accessibility**:
 * - GDS AccessRecoveryPanel provides semantic structure
 * - Title and description from issue (localized)
 * - Actions keyboard-navigable
 * 
 * **Performance**: Client-only due to GDS and window.location
 * 
 * **Mobile Behavior**: Compact layout, responsive via GDS
 * 
 * @param props - {@link CourseAccessRecoveryActionsProps}
 * @returns Access recovery panel backed by GDS
 * 
 * @see {@link resolveCourseAccessIssue} in `app/lib/course-access-recovery.ts`
 * @see {@link StateBlock} for general loading/empty/error states
 * 
 * @remarks
 * Maps Amanoba course API codes to GDS AccessRecoveryPanel state.
 * Always compact layout. Title/message from issue (pre-localized).
 */
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
