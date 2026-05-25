import type { ReactNode } from 'react';
import { Card, Group, Progress, Stack, Text } from '@mantine/core';
import type { MantineColor } from '@mantine/core';

type ProgressCardProps = {
  label: ReactNode;
  value: ReactNode;
  progress: number;
  progressLabel?: ReactNode;
  detail?: ReactNode;
  action?: ReactNode;
  color?: MantineColor;
};

/** Course/quest progress metric aligned with GDS ProgressCard semantics. */
export function ProgressCard({
  label,
  value,
  progress,
  progressLabel,
  detail,
  action,
  color = 'amanoba',
}: ProgressCardProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <Card padding="lg" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={4}>
            <Text size="sm" c="dimmed" fw={600}>
              {label}
            </Text>
            <Text size="xl" fw={800} lh={1.2}>
              {value}
            </Text>
          </Stack>
          {action}
        </Group>
        {detail ? (
          <Text size="sm" c="dimmed">
            {detail}
          </Text>
        ) : null}
        <Stack gap={6}>
          <Group justify="space-between" gap="sm">
            <Text size="sm" fw={500}>
              {progressLabel ?? label}
            </Text>
            <Text size="sm" c="dimmed">
              {Math.round(clamped)}%
            </Text>
          </Group>
          <Progress value={clamped} color={color} radius="xl" />
        </Stack>
      </Stack>
    </Card>
  );
}
