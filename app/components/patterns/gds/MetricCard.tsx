'use client';

import type { ReactNode } from 'react';
import { MetricCard as GdsMetricCard } from '@doneisbetter/gds-core/client';

/**
 * Props for {@link MetricCard}.
 * 
 * @property {ReactNode} [icon] - Optional icon displayed above label
 * @property {ReactNode} value - Primary metric value (large, prominent)
 * @property {ReactNode} label - Metric label (describes what value represents)
 * @property {ReactNode} [detail] - Optional description text below label
 * @property {number} [progress] - Reserved for future use (not currently passed to GDS)
 * @property {string} [color] - Reserved for future use (not currently passed to GDS)
 * 
 * @example
 * ```tsx
 * <MetricCard
 *   icon={<IconFlame size={20} />}
 *   value="42"
 *   label="Day Streak"
 *   detail="Keep going!"
 * />
 * ```
 */
type MetricCardProps = {
  icon?: ReactNode;
  value: ReactNode;
  label: ReactNode;
  detail?: ReactNode;
  progress?: number;
  color?: string;
};

/**
 * Canonical metric card adapter for value-first summary surfaces.
 * 
 * **Contract**: Display single numeric/text metric with optional icon and description.
 * 
 * **Server/Client Safety**: ⚠️ Client-only (uses GDS client component)
 * 
 * **Consuming Routes**:
 * - `/[locale]/dashboard` - XP, points, level, streak metrics
 * - `/[locale]/stats` - Performance statistics
 * - `/[locale]/profile/[playerId]` - Player stats display
 * 
 * **GDS Backing**: ✅ `@doneisbetter/gds-core/client` `MetricCard`
 * 
 * **Slots**:
 * - `icon` (optional): Icon above label
 * - `value` (required): Large numeric/text value
 * - `label` (required): Metric name
 * - `detail` (optional): Supporting description
 * 
 * **Accessibility**:
 * - Value and label have semantic relationship
 * - Icon is decorative (does not carry meaning alone)
 * 
 * **Performance**: Client-only due to GDS dependency
 * 
 * **Mobile Behavior**: Responsive card layout via GDS
 * 
 * @param props - {@link MetricCardProps}
 * @returns Metric card backed by GDS
 * 
 * @see {@link ProgressCard} for progress-focused metrics
 * @see {@link StateBlock} for loading/empty/error states
 * 
 * @remarks
 * Amanoba prop names over `@doneisbetter/gds-core` `MetricCard`.
 * Note: `progress` and `color` props are not currently passed to GDS.
 */
export function MetricCard({ icon, value, label, detail }: MetricCardProps) {
  return (
    <GdsMetricCard
      label={typeof label === 'string' ? label : String(label)}
      value={value}
      description={detail}
      icon={icon}
    />
  );
}
