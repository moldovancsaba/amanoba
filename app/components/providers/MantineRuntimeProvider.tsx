'use client';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useTheme } from 'next-themes';
import { ReactNode } from 'react';
import { amanobaMantineTheme } from '@/app/lib/ui/mantine-theme';

export function MantineRuntimeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const colorScheme = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <MantineProvider theme={amanobaMantineTheme} forceColorScheme={colorScheme}>
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
