import type { ReactNode } from 'react';
import { Alert, Card, Group, Loader, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import type { MantineColor } from '@mantine/core';

type StateBlockKind = 'loading' | 'empty' | 'error' | 'permission' | 'success' | 'info';

const kindColor: Record<StateBlockKind, MantineColor> = {
  loading: 'amanoba',
  empty: 'gray',
  error: 'red',
  permission: 'yellow',
  success: 'green',
  info: 'blue',
};

type StateBlockProps = {
  kind: StateBlockKind;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  compact?: boolean;
};

export function StateBlock({
  kind,
  title,
  description,
  icon,
  action,
  secondaryAction,
  compact = false,
}: StateBlockProps) {
  const color = kindColor[kind];

  if (kind === 'error') {
    return (
      <Alert color={color} variant="light" title={title} icon={icon}>
        <Stack gap="sm">
          {description ? <Text size="sm">{description}</Text> : null}
          {action || secondaryAction ? (
            <Group gap="sm">
              {action}
              {secondaryAction}
            </Group>
          ) : null}
        </Stack>
      </Alert>
    );
  }

  return (
    <Card padding={compact ? 'lg' : 'xl'} withBorder>
      <Stack align="center" ta="center" gap="md">
        {kind === 'loading' ? (
          <Loader color={color} size="sm" />
        ) : icon ? (
          <ThemeIcon color={color} variant="light" size={compact ? 48 : 64} radius="xl">
            {icon}
          </ThemeIcon>
        ) : null}
        <Stack gap={4}>
          <Title order={compact ? 3 : 2} size={compact ? 'h4' : 'h3'}>
            {title}
          </Title>
          {description ? <Text c="dimmed">{description}</Text> : null}
        </Stack>
        {action || secondaryAction ? (
          <Group gap="sm" justify="center">
            {action}
            {secondaryAction}
          </Group>
        ) : null}
      </Stack>
    </Card>
  );
}
