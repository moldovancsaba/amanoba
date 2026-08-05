'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import { Badge, Box, Group, Image as MantineImage, Progress, Stack, Text } from '@mantine/core';
import type { MantineColor } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';
import { PublicProductCard } from '@sovereignsquad/gds-core/client';

/**
 * Course metric (label-value pair).
 * 
 * @property {ReactNode} label - Metric label (e.g., "Duration")
 * @property {ReactNode} value - Metric value (e.g., "30 days")
 */
type CourseMetric = {
  label: ReactNode;
  value: ReactNode;
};

/**
 * Course progress data.
 * 
 * @property {ReactNode} [label="Progress"] - Progress label
 * @property {number} value - Progress percentage (0-100)
 * @property {ReactNode} [detail] - Optional detail text below progress bar
 */
type CourseProgress = {
  label?: ReactNode;
  value: number;
  detail?: ReactNode;
};

/**
 * Course badge (premium, enrolled, completed, etc.).
 * 
 * @property {ReactNode} label - Badge text
 * @property {MantineColor} [color="gray"] - Badge color
 * @property {string} [variant="light"] - Badge variant
 * @property {ReactNode} [leftSection] - Optional icon before text
 */
type CourseBadge = {
  label: ReactNode;
  color?: MantineColor;
  variant?: 'light' | 'filled' | 'outline' | 'dot' | 'default' | 'transparent' | 'white';
  leftSection?: ReactNode;
};

/**
 * Props for {@link CourseCard}.
 * 
 * @property {ReactNode} title - Course title
 * @property {ReactNode} [description] - Course description
 * @property {string | null} [thumbnail] - Course thumbnail URL
 * @property {string} [thumbnailAlt="Course"] - Thumbnail alt text
 * @property {ReactNode} [fallbackLabel] - Label for fallback icon when no thumbnail
 * @property {CourseBadge[]} [badges=[]] - Status badges (premium, enrolled, etc.)
 * @property {CourseMetric[]} [metrics=[]] - Course metrics (duration, lessons, etc.)
 * @property {CourseProgress} [progress] - Progress data (if enrolled)
 * @property {ReactNode} [notice] - Important notice (e.g., certification available)
 * @property {ReactNode} [primaryAction] - Primary CTA button (e.g., "Enroll", "Continue")
 * @property {ReactNode} [secondaryAction] - Secondary CTA button (e.g., "View Details")
 * @property {boolean} [compact=false] - Compact layout (shorter image, less padding)
 * 
 * @example Catalog variant
 * ```tsx
 * <CourseCard
 *   title="JavaScript Mastery"
 *   description="Learn modern JavaScript"
 *   thumbnail="/images/js-course.jpg"
 *   badges={[{ label: "Premium", color: "yellow" }]}
 *   metrics={[{ label: "Duration", value: "30 days" }]}
 *   primaryAction={<Button>Enroll</Button>}
 * />
 * ```
 * 
 * @example Enrolled variant
 * ```tsx
 * <CourseCard
 *   title="JavaScript Mastery"
 *   description="Learn modern JavaScript"
 *   thumbnail="/images/js-course.jpg"
 *   badges={[{ label: "Enrolled", color: "green" }]}
 *   progress={{ label: "Progress", value: 45, detail: "Day 14/30" }}
 *   primaryAction={<Button>Continue</Button>}
 * />
 * ```
 */
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

/**
 * Canonical course card adapter for catalog, enrolled, and progress contexts.
 * 
 * **Contract**: Unified course card for discovery, enrollment, and progress tracking.
 * 
 * **Server/Client Safety**: ⚠️ Client-only (uses GDS client component)
 * 
 * **Consuming Routes**:
 * - `/[locale]/courses` - Course catalog (discovery)
 * - `/[locale]/my-courses` - Enrolled courses (progress)
 * - `/[locale]/dashboard` - Active course progress
 * 
 * **GDS Backing**: ✅ `@sovereignsquad/gds-core/client` `PublicProductCard`
 * 
 * **Variant Usage Patterns**:
 * 
 * **Catalog variant** (discovery):
 * - `badges`: Premium, language, level
 * - `metrics`: Duration, lessons, difficulty
 * - `primaryAction`: "Enroll" or "View Details"
 * - `progress`: null (not enrolled)
 * - `notice`: Optional special offer or featured label
 * 
 * **Enrolled variant** (my-courses):
 * - `badges`: Enrolled, In Progress, Completed
 * - `progress`: Current progress (days completed / total days)
 * - `primaryAction`: "Continue" or "Resume"
 * - `secondaryAction`: "View Certificate" (if completed)
 * - `notice`: Optional milestone or achievement notice
 * 
 * **Progress variant** (dashboard):
 * - Same as enrolled variant, optimized for dashboard context
 * - Emphasizes progress and "Continue" action
 * - Optional `compact={true}` for dense layouts
 * 
 * **Slots**:
 * - `thumbnail` or fallback (IconBook + fallbackLabel)
 * - `badges` (above description)
 * - `title` (h3, from GDS)
 * - `description` (below badges)
 * - `metrics` (GDS metadata: label-value pairs)
 * - `progress` (custom progress bar + detail)
 * - `notice` (GDS pickupNote: important messages)
 * - `primaryAction` + `secondaryAction` (CTAs)
 * 
 * **Progress Calculation**:
 * - Must be bounded: `[0, 100]`
 * - Displayed rounded: `Math.round(progress.value)`
 * - Typically: `(completedDays / totalDays) * 100`
 * 
 * **Image Handling**:
 * - If `thumbnail` provided: Next.js Image with fit="cover"
 * - If null and `fallbackLabel` provided: IconBook + label on dark background
 * - Height: 190px (default) or 128px (compact)
 * 
 * **Badge Priority**:
 * - Catalog: Premium/Free first, then language/level
 * - Enrolled: Status first (Enrolled/Completed), then others
 * - Max 2-3 badges for readability
 * 
 * **Accessibility**:
 * - Title is semantic h3 (from GDS)
 * - Progress text not conveyed by color alone (includes label + percentage)
 * - Badges readable by screen readers
 * - Actions keyboard-navigable
 * - Thumbnail has alt text
 * 
 * **Performance**: Client-only due to GDS dependency
 * 
 * **Mobile Behavior**:
 * - Responsive card layout via GDS
 * - Compact mode available for dense grids
 * - Touch targets adequate (GDS enforced)
 * 
 * @param props - {@link CourseCardProps}
 * @returns Course card backed by GDS PublicProductCard
 * 
 * @see {@link MetricCard} for standalone metrics
 * @see {@link ProgressCard} for standalone progress display
 * 
 * @remarks
 * Maps Amanoba course data to GDS `PublicProductCard`.
 * Badges rendered above description. Progress rendered as inventoryNote.
 * Metrics mapped to GDS metadata array. Notice mapped to pickupNote.
 */
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
