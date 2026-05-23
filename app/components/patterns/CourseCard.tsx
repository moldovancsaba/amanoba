import type { ReactNode } from 'react';
import Image from 'next/image';
import { Badge, Box, Card, Group, Image as MantineImage, Paper, Progress, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import type { MantineColor } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';

type CourseMetric = {
  label: ReactNode;
  value: ReactNode;
};

type CourseProgress = {
  label?: ReactNode;
  value: number;
  detail?: ReactNode;
};

type CourseBadge = {
  label: ReactNode;
  color?: MantineColor;
  variant?: 'light' | 'filled' | 'outline' | 'dot' | 'default' | 'transparent' | 'white';
  leftSection?: ReactNode;
};

type CourseCardProps = {
  title: ReactNode;
  description?: ReactNode;
  thumbnail?: string | null;
  thumbnailAlt?: string;
  fallbackLabel?: ReactNode;
  badges?: CourseBadge[];
  metrics?: CourseMetric[];
  progress?: CourseProgress;
  notice?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  compact?: boolean;
};

export function CourseCard({
  title,
  description,
  thumbnail,
  thumbnailAlt = 'Course',
  fallbackLabel,
  badges = [],
  metrics = [],
  progress,
  notice,
  primaryAction,
  secondaryAction,
  compact = false,
}: CourseCardProps) {
  return (
    <Card padding={compact ? 'md' : 'lg'} withBorder>
      <Stack gap="md" h="100%">
        {thumbnail ? (
          <Card.Section>
            <MantineImage
              component={Image}
              src={thumbnail}
              alt={thumbnailAlt}
              height={compact ? 128 : 190}
              width={640}
              fit="cover"
            />
          </Card.Section>
        ) : fallbackLabel ? (
          <Card.Section>
            <Box bg="ink.7" h={compact ? 128 : 190}>
              <Stack h="100%" align="center" justify="center" gap="xs">
                <IconBook size={compact ? 30 : 38} color="white" />
                <Text c="gray.3">{fallbackLabel}</Text>
              </Stack>
            </Box>
          </Card.Section>
        ) : null}

        <Stack gap="md" flex={1}>
          {badges.length > 0 ? (
            <Group gap="xs">
              {badges.map((badge, index) => (
                <Badge
                  key={`${String(badge.label)}-${index}`}
                  color={badge.color ?? 'gray'}
                  variant={badge.variant ?? 'light'}
                  leftSection={badge.leftSection}
                >
                  {badge.label}
                </Badge>
              ))}
            </Group>
          ) : null}

          <Stack gap={6} flex={1}>
            <Title order={compact ? 3 : 2} size={compact ? 'h4' : 'h3'} lineClamp={2}>
              {title}
            </Title>
            {description ? (
              <Text c="dimmed" size={compact ? 'sm' : undefined} lineClamp={compact ? 2 : 3}>
                {description}
              </Text>
            ) : null}
          </Stack>

          {metrics.length > 0 ? (
            <SimpleGrid cols={Math.min(metrics.length, 3)} spacing="xs">
              {metrics.map((metric, index) => (
                <Paper key={`${String(metric.label)}-${index}`} p="sm" withBorder>
                  <Text size="xs" c="dimmed">
                    {metric.label}
                  </Text>
                  <Text fw={700}>{metric.value}</Text>
                </Paper>
              ))}
            </SimpleGrid>
          ) : null}

          {progress ? (
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" fw={700}>
                  {progress.label ?? 'Progress'}
                </Text>
                <Text size="sm" c="dimmed">
                  {Math.round(progress.value)}%
                </Text>
              </Group>
              <Progress value={progress.value} color="amanoba" radius="xl" />
              {progress.detail ? (
                <Text size="xs" c="dimmed">
                  {progress.detail}
                </Text>
              ) : null}
            </Stack>
          ) : null}

          {notice}

          {primaryAction || secondaryAction ? (
            <Group grow gap="sm" align="stretch">
              {primaryAction}
              {secondaryAction}
            </Group>
          ) : null}
        </Stack>
      </Stack>
    </Card>
  );
}
