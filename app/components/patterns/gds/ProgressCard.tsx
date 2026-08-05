'use client';

import type { ReactNode } from 'react';
import { ProgressCard as GdsProgressCard } from '@sovereignsquad/gds-core/client';

/**
 * Props for {@link ProgressCard}.
 * 
 * @property {ReactNode} label - Card label (e.g., course name)
 * @property {ReactNode} value - Progress value (e.g., "3/10 days")
 * @property {number} progress - Progress percentage (0-100)
 * @property {ReactNode} [progressLabel] - Optional label displayed with progress bar (e.g., "30% complete")
 * @property {ReactNode} [detail] - Optional description text
 * @property {ReactNode} [action] - Optional action button (e.g., "Continue")
 * @property {string} [color] - Reserved for future use (not currently passed to GDS)
 * 
 * @example
 * ```tsx
 * <ProgressCard
 *   label="JavaScript Mastery"
 *   value="7/30 days"
 *   progress={23}
 *   progressLabel="23% complete"
 *   detail="Keep up the momentum!"
 *   action={<Button>Continue</Button>}
 * />
 * ```
 */
type ProgressCardProps = {
  label: ReactNode;
  value: ReactNode;
  progress: number;
  progressLabel?: ReactNode;
  detail?: ReactNode;
  action?: ReactNode;
  color?: string;
};

/**
 * Canonical progress card adapter for progress-focused metrics.
 * 
 * **Contract**: Display course/lesson progress with percentage bar and optional action.
 * 
 * **Server/Client Safety**: ⚠️ Client-only (uses GDS client component)
 * 
 * **Consuming Routes**:
 * - `/[locale]/dashboard` - Active course progress
 * - `/[locale]/my-courses` - Enrolled course progress list
 * - `/[locale]/profile/[playerId]` - Player course progress summary
 * 
 * **GDS Backing**: ✅ `@sovereignsquad/gds-core/client` `ProgressCard`
 * 
 * **Slots**:
 * - `label` (required): Course/item name
 * - `value` (required): Progress fraction (e.g., "3/10 days")
 * - `progress` (required): Percentage (0-100) for progress bar
 * - `progressLabel` (optional): Label with progress bar (e.g., "30% complete")
 * - `detail` (optional): Supporting description
 * - `action` (optional): CTA button (e.g., "Continue", "View")
 * 
 * **Progress Calculation**:
 * - Must be bounded: `[0, 100]`
 * - Typically: `(completedDays / totalDays) * 100`
 * - Value text should match numerator/denominator when applicable
 * 
 * **Accessibility**:
 * - Progress bar has semantic role (progressbar)
 * - Label and value provide context
 * - Action button is keyboard-navigable
 * 
 * **Performance**: Client-only due to GDS dependency
 * 
 * **Mobile Behavior**: Responsive card layout via GDS
 * 
 * @param props - {@link ProgressCardProps}
 * @returns Progress card backed by GDS
 * 
 * @see {@link MetricCard} for value-first metrics
 * @see {@link StateBlock} for loading/empty/error states
 * 
 * @remarks
 * Amanoba prop aliases over `@sovereignsquad/gds-core` `ProgressCard`.
 * Note: `color` prop is not currently passed to GDS.
 */
export function ProgressCard({
  label,
  value,
  progress,
  progressLabel,
  detail,
  action,
}: ProgressCardProps) {
  return (
    <GdsProgressCard
      label={typeof label === 'string' ? label : String(label)}
      value={value}
      progress={progress}
      progressLabel={progressLabel ? String(progressLabel) : undefined}
      description={detail}
      action={action}
    />
  );
}
