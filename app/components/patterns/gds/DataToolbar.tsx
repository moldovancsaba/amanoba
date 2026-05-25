import type { ReactNode } from 'react';
import { Group, Paper, Stack, Text } from '@mantine/core';

type DataToolbarProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  layout?: 'inline' | 'stack';
};

export function DataToolbar({ children, title, description, layout = 'inline' }: DataToolbarProps) {
  return (
    <Paper bg="ink.8" p="md" withBorder>
      <Stack gap="md">
        {title || description ? (
          <Stack gap={4}>
            {title ? <Text fw={700}>{title}</Text> : null}
            {description ? (
              <Text size="sm" c="dimmed">
                {description}
              </Text>
            ) : null}
          </Stack>
        ) : null}
        {layout === 'stack' ? (
          <Stack gap="md">{children}</Stack>
        ) : (
          <Group align="flex-end" gap="md" wrap="wrap">
            {children}
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
