'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Badge, Box, Group, Image as MantineImage, Progress, Stack, Text } from '@mantine/core';
import type { MantineColor } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';
import { PublicProductCard } from '@doneisbetter/gds-core/client';

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

export type CourseCardProps = {
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

function toPlainText(value: ReactNode, fallback: string) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
}

function renderBadgeRow(badges: CourseBadge[]) {
  if (badges.length === 0) return null;

  return (
    <Group gap="xs">
      {badges.map((badge, index) => (
        <Badge
          key={`${toPlainText(badge.label, `badge-${index}`)}-${index}`}
          color={badge.color ?? 'gray'}
          variant={badge.variant ?? 'light'}
          leftSection={badge.leftSection}
        >
          {badge.label}
        </Badge>
      ))}
    </Group>
  );
}

function renderImage(thumbnail: string | null | undefined, thumbnailAlt: string, fallbackLabel?: ReactNode, compact?: boolean) {
  if (thumbnail) {
    return (
      <MantineImage
        component={Image}
        src={thumbnail}
        alt={thumbnailAlt}
        height={compact ? 128 : 190}
        width={640}
        fit="cover"
      />
    );
  }

  if (!fallbackLabel) return undefined;

  return (
    <Box bg="ink.7" h={compact ? 128 : 190}>
      <Stack h="100%" align="center" justify="center" gap="xs">
        <IconBook size={compact ? 30 : 38} color="white" />
        <Text c="gray.3">{fallbackLabel}</Text>
      </Stack>
    </Box>
  );
}

function renderDescription(description: ReactNode, badges: CourseBadge[]) {
  const badgeRow = renderBadgeRow(badges);
  if (!badgeRow) return description;

  return (
    <Stack gap="sm">
      {badgeRow}
      {description ? <Text c="dimmed" size="sm">{description}</Text> : null}
    </Stack>
  );
}

function renderProgress(progress?: CourseProgress) {
  if (!progress) return undefined;

  return (
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
      {progress.detail ? progress.detail : null}
    </Stack>
  );
}

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
  const metadata = metrics.map((metric, index) => ({
    label: toPlainText(metric.label, `Metric ${index + 1}`),
    value: metric.value,
  }));

  return (
    <PublicProductCard
      title={toPlainText(title, 'Course')}
      description={renderDescription(description, badges)}
      image={renderImage(thumbnail, thumbnailAlt, fallbackLabel, compact)}
      helperText={progress ? `${toPlainText(progress.label, 'Progress')}: ${Math.round(progress.value)}%` : undefined}
      helperKind={progress ? 'supporting' : undefined}
      inventoryNote={renderProgress(progress)}
      pickupNote={notice}
      metadata={metadata}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      compact={compact}
    />
  );
}
