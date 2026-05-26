'use client';

import type { ReactNode } from 'react';
import { MetricCard as GdsMetricCard } from '@doneisbetter/gds-core/client';

type MetricCardProps = {
  icon?: ReactNode;
  value: ReactNode;
  label: ReactNode;
  detail?: ReactNode;
  progress?: number;
  color?: string;
};

/** Amanoba prop names over `@doneisbetter/gds-core` `MetricCard` (progress is not part of GDS MetricCard). */
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
