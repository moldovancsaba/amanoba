'use client';

import type { ReactNode } from 'react';
import { ProgressCard as GdsProgressCard } from '@doneisbetter/gds-core/client';

type ProgressCardProps = {
  label: ReactNode;
  value: ReactNode;
  progress: number;
  progressLabel?: ReactNode;
  detail?: ReactNode;
  action?: ReactNode;
  color?: string;
};

/** Amanoba prop aliases over `@doneisbetter/gds-core` `ProgressCard`. */
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
