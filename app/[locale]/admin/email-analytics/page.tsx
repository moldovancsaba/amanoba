/**
 * Admin Email Analytics Page
 *
 * What: Displays email sent/open/click analytics by type and segment.
 * Why: Enables admins to monitor email engagement.
 */

'use client';

import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import {
  Card,
  Center,
  Grid,
  Group,
  Loader,
  Select,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCursorText, IconEye, IconMail, IconSend } from '@tabler/icons-react';

interface EmailSummary {
  sent: number;
  opened: number;
  clicked: number;
  totalClicks: number;
  openRatePct: number;
  clickRatePct: number;
}

interface ByTypeRow {
  type: string;
  sent: number;
  opened: number;
  clicked: number;
  clicks: number;
  openRatePct: number;
  clickRatePct: number;
}

interface BySegmentRow {
  segment: string;
  sent: number;
  opened: number;
  clicked: number;
  clicks: number;
  openRatePct: number;
  clickRatePct: number;
}

interface EmailAnalyticsData {
  success: boolean;
  period: { days: number; since: string };
  summary: EmailSummary;
  byType: ByTypeRow[];
  bySegment: BySegmentRow[];
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon?: ReactNode;
  label: string;
  value: number;
  detail?: string;
}) {
  return (
    <Card withBorder>
      <Stack gap={4}>
        <Group gap="xs" c="dimmed">
          {icon}
          <Text size="sm">{label}</Text>
        </Group>
        <Text size="xl" fw={700}>
          {value}
        </Text>
        {detail ? <Text size="sm" c="yellow">{detail}</Text> : null}
      </Stack>
    </Card>
  );
}

function AnalyticsTable<T extends { sent: number; opened: number; clicked: number; clicks: number; openRatePct: number; clickRatePct: number }>({
  title,
  label,
  rows,
  getKey,
}: {
  title: string;
  label: string;
  rows: T[];
  getKey: (row: T) => string;
}) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <Stack gap="sm">
      <Title order={2}>{title}</Title>
      <Table.ScrollContainer minWidth={760}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{label}</Table.Th>
              <Table.Th>Sent</Table.Th>
              <Table.Th>Opened</Table.Th>
              <Table.Th>Clicked</Table.Th>
              <Table.Th>Clicks</Table.Th>
              <Table.Th>Open %</Table.Th>
              <Table.Th>Click %</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => (
              <Table.Tr key={getKey(row)}>
                <Table.Td>{getKey(row)}</Table.Td>
                <Table.Td>{row.sent}</Table.Td>
                <Table.Td>{row.opened}</Table.Td>
                <Table.Td>{row.clicked}</Table.Td>
                <Table.Td>{row.clicks}</Table.Td>
                <Table.Td>{row.openRatePct}%</Table.Td>
                <Table.Td>{row.clickRatePct}%</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
}

export default function AdminEmailAnalyticsPage() {
  const t = useTranslations('admin');
  const [data, setData] = useState<EmailAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/email-analytics?days=${days}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <Center mih={200}>
        <Loader />
      </Center>
    );
  }

  if (!data) {
    return (
      <Stack p="md">
        <Title order={1}>{t('emailAnalytics')}</Title>
        <Text c="dimmed">Failed to load email analytics.</Text>
      </Stack>
    );
  }

  const { period, summary, byType, bySegment } = data;

  return (
    <Stack p="md" gap="xl">
      <Group justify="space-between" align="flex-end">
        <Group>
          <ThemeIcon variant="light" size="lg">
            <IconMail size={22} />
          </ThemeIcon>
          <Title order={1}>{t('emailAnalytics')}</Title>
        </Group>
        <Select
          value={String(days)}
          onChange={(value) => setDays(Number(value || 30))}
          data={[
            { value: '7', label: 'Last 7 days' },
            { value: '30', label: 'Last 30 days' },
            { value: '90', label: 'Last 90 days' },
          ]}
        />
      </Group>

      <Text c="dimmed" size="sm">
        Period: {period.days} days since {new Date(period.since).toLocaleDateString()}.
        Completion emails only.
      </Text>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <MetricCard icon={<IconSend size={16} />} label="Sent" value={summary.sent} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={<IconEye size={16} />}
            label="Opened"
            value={summary.opened}
            detail={`${summary.openRatePct}% open rate`}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={<IconCursorText size={16} />}
            label="Clicked"
            value={summary.clicked}
            detail={`${summary.clickRatePct}% click rate`}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Total clicks" value={summary.totalClicks} />
        </Grid.Col>
      </Grid>

      <AnalyticsTable title="By email type" label="Type" rows={byType} getKey={(row) => row.type} />
      <AnalyticsTable title="By segment" label="Segment" rows={bySegment} getKey={(row) => row.segment} />

      {summary.sent === 0 ? (
        <Text c="dimmed" size="sm">
          No tracked emails in this period. Completion emails with open/click tracking are recorded when sent.
        </Text>
      ) : null}
    </Stack>
  );
}
