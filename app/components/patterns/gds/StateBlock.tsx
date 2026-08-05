'use client';

import type { ReactNode } from 'react';
import { Group } from '@mantine/core';
import {
  StateBlock as GdsStateBlock,
  type StateBlockVariant,
} from '@sovereignsquad/gds-core/client';

/**
 * Re-exported GDS state block variant type.
 * 
 * Available variants: 'loading', 'empty', 'error', 'info', 'success', 'warning', 'permission'
 */
export type StateBlockKind = StateBlockVariant;

/**
 * Props for {@link StateBlock}.
 * 
 * @property {StateBlockKind} kind - State variant (loading, empty, error, info, success, warning, permission)
 * @property {string} title - Primary state message
 * @property {ReactNode} [description] - Optional detailed explanation
 * @property {ReactNode} [icon] - Optional custom icon (overrides default variant icon)
 * @property {ReactNode} [action] - Optional primary action button
 * @property {ReactNode} [secondaryAction] - Optional secondary action button
 * @property {boolean} [compact=false] - Compact layout (smaller spacing, left-aligned actions)
 * 
 * @example
 * ```tsx
 * <StateBlock
 *   kind="empty"
 *   title="No courses yet"
 *   description="Start by enrolling in your first course"
 *   action={<Button>Browse Courses</Button>}
 *   compact={false}
 * />
 * ```
 */
type StateBlockProps = {
  kind: StateBlockKind;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  compact?: boolean;
};

/**
 * Canonical state block adapter for loading, empty, error, and informational states.
 * 
 * **Contract**: Display route/section state with optional actions and custom messaging.
 * 
 * **Server/Client Safety**: ⚠️ Client-only (uses GDS client component)
 * 
 * **Consuming Routes**:
 * - `/[locale]/dashboard` - Loading, empty course states
 * - `/[locale]/courses` - Loading, error, empty catalog states
 * - `/[locale]/my-courses` - Empty enrolled courses
 * - `/[locale]/saved` - Empty saved lessons
 * - `/[locale]/practice` - Empty practice hub
 * - `/[locale]/stats` - Loading stats
 * - Profile/quiz/course pages - Various loading and error states
 * 
 * **GDS Backing**: ✅ `@sovereignsquad/gds-core/client` `StateBlock`
 * 
 * **Variants**:
 * - `loading`: Spinner + "Loading..." (or custom title)
 * - `empty`: Icon + empty message + CTA
 * - `error`: Error icon + error message + retry action
 * - `info`: Info icon + informational message
 * - `success`: Success icon + success message
 * - `warning`: Warning icon + warning message
 * - `permission`: Lock icon + permission denied message
 * 
 * **Slots**:
 * - `icon` (optional): Custom icon (overrides variant default)
 * - `title` (required): State title
 * - `description` (optional): Supporting text
 * - `action` (optional): Primary CTA button
 * - `secondaryAction` (optional): Secondary CTA button
 * 
 * **Layout Modes**:
 * - `compact={false}` (default): Full-page state (centered, spacious)
 * - `compact={true}`: Inline/section state (left-aligned, minimal spacing)
 * 
 * **Accessibility**:
 * - Semantic role based on variant (status, alert, etc.)
 * - Actions are keyboard-navigable
 * - Icon + title provide context
 * 
 * **Performance**: Client-only due to GDS dependency
 * 
 * **Mobile Behavior**: Responsive layout via GDS
 * 
 * @param props - {@link StateBlockProps}
 * @returns State block backed by GDS
 * 
 * @see {@link MetricCard} for value-first metrics
 * @see {@link ProgressCard} for progress-focused metrics
 * 
 * @remarks
 * Amanoba API (`kind`) over canonical `@sovereignsquad/gds-core` `StateBlock` (`variant`).
 * Actions are horizontally grouped and centered (full) or left-aligned (compact).
 */
export function StateBlock({
  kind,
  title,
  description,
  icon,
  action,
  secondaryAction,
  compact = false,
}: StateBlockProps) {
  const mergedAction =
    action || secondaryAction ? (
      <Group gap="sm" justify={compact ? 'flex-start' : 'center'}>
        {action}
        {secondaryAction}
      </Group>
    ) : undefined;

  return (
    <GdsStateBlock
      variant={kind}
      title={title}
      description={description}
      icon={icon}
      action={mergedAction}
      compact={compact}
    />
  );
}
