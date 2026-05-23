import type { ReactNode } from 'react';
import { Card, Progress, Stack, Text, ThemeIcon } from '@mantine/core';
import type { MantineColor } from '@mantine/core';

type MetricCardProps = {
  icon?: ReactNode;
  value: ReactNode;
  label: ReactNode;
  detail?: ReactNode;
  progress?: number;
  color?: MantineColor;
};

export function MetricCard({ icon, value, label, detail, progress, color = 'amanoba' }: MetricCardProps) {
  return (
    <Card padding="lg" withBorder>
      <Stack gap="sm">
        {icon ? (
          <ThemeIcon color={color} variant="light" size={48} radius="xl">
            {icon}
          </ThemeIcon>
        ) : null}
        <Text size="2rem" fw={800} lh={1}>
          {value}
        </Text>
        <Text c="dimmed">{label}</Text>
        {typeof progress === 'number' ? <Progress value={progress} color={color} radius="xl" /> : null}
        {detail ? (
          <Text size="xs" c="dimmed">
            {detail}
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}
