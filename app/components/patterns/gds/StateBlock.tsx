'use client';

import type { ReactNode } from 'react';
import { Group } from '@mantine/core';
import {
  StateBlock as GdsStateBlock,
  type StateBlockVariant,
} from '@gds/core';

export type StateBlockKind = StateBlockVariant;

type StateBlockProps = {
  kind: StateBlockKind;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  compact?: boolean;
};

/** Amanoba API (`kind`) over canonical `@gds/core` `StateBlock` (`variant`). */
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
