import type { ReactNode } from 'react';
import { Box, Container, Stack } from '@mantine/core';
import type { MantineSize } from '@mantine/core';

type AuthShellProps = {
  children: ReactNode;
  footer?: ReactNode;
  alert?: ReactNode;
  size?: MantineSize;
};

/**
 * Centered auth/onboarding page shell: dark background, constrained width, optional alert + footer.
 */
export function AuthShell({ children, footer, alert, size = 'xs' }: AuthShellProps) {
  return (
    <Box bg="ink.9" mih="100vh" py={{ base: 'lg', sm: 'xl' }} px="md">
      <Container size={size}>
        <Stack gap="xl">
          {alert}
          {children}
          {footer}
        </Stack>
      </Container>
    </Box>
  );
}
