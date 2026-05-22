'use client';

import { MantineProvider, type CSSVariablesResolver } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { ReactNode } from 'react';
import { amanobaMantineTheme } from '@/app/lib/ui/mantine-theme';

const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {},
  light: {},
  dark: {
    '--mantine-color-text': theme.colors.gray[1],
    '--mantine-color-dimmed': theme.colors.gray[2],
  },
});

export function MantineRuntimeProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={amanobaMantineTheme} cssVariablesResolver={cssVariablesResolver} forceColorScheme="dark">
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
