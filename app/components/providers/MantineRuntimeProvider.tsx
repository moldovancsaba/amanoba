'use client';

import { GdsProvider } from '@doneisbetter/gds-theme/client';
import type { ReactNode } from 'react';
import { amanobaMantineTheme } from '@/app/lib/ui/mantine-theme';

export function MantineRuntimeProvider({ children }: { children: ReactNode }) {
  return (
    <GdsProvider theme={amanobaMantineTheme} defaultColorScheme="dark">
      {children}
    </GdsProvider>
  );
}
