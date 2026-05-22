'use client';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { ReactNode } from 'react';
import { amanobaMantineTheme } from '@/app/lib/ui/mantine-theme';

export function MantineRuntimeProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={amanobaMantineTheme} forceColorScheme="dark">
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
