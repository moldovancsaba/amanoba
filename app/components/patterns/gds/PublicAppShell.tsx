import type { ReactNode } from 'react';
import Image from 'next/image';
import { Box, Container, Group, Paper, Stack, Text } from '@mantine/core';

type PublicAppShellProps = {
  children: ReactNode;
  headerActions: ReactNode;
  appName?: string;
  tagline?: string;
  brand?: ReactNode;
  footer?: ReactNode;
};

export function PublicAppShell({
  children,
  headerActions,
  appName,
  tagline,
  brand,
  footer,
}: PublicAppShellProps) {
  return (
    <Box bg="ink.9" mih="100vh">
      <Paper component="header" bg="ink.8" radius={0} withBorder>
        <Container size="xl" py="md">
          <Group justify="space-between" align="center" gap="md">
            {brand ?? (
              <Group gap="sm" wrap="nowrap" miw={0}>
                <Image src="/amanoba_logo.png" alt="Amanoba Logo" width={48} height={48} priority />
                {appName ? (
                  <Stack gap={0} visibleFrom="xs">
                    <Text component="span" fw={700} size="lg" c="white">
                      {appName}
                    </Text>
                    {tagline ? (
                      <Text size="sm" c="gray.3">
                        {tagline}
                      </Text>
                    ) : null}
                  </Stack>
                ) : null}
              </Group>
            )}
            <Group gap="sm" justify="flex-end" wrap="wrap">
              {headerActions}
            </Group>
          </Group>
        </Container>
      </Paper>

      {children}

      {footer ? (
        <Box component="footer" bd="1px 0 0 0 solid var(--mantine-color-ink-6)">
          {footer}
        </Box>
      ) : null}
    </Box>
  );
}
