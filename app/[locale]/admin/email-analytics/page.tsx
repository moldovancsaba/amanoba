/**
 * Admin Email Analytics Page
 */

'use client';

import { useMemo, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Center, Grid, Loader, Select, Stack, Text, Title } from '@mantine/core';
import { AdminPageHeader } from '@/app/components/patterns/AdminPageHeader';
import { IconCursorText, IconEye, IconSend } from '@tabler/icons-react';
import { DataToolbar } from '@/app/components/patterns/DataToolbar';
import { MetricCard } from '@/app/components/patterns/MetricCard';
import { ResponsiveDataView, type ResponsiveColumn } from '@/app/components/patterns/ResponsiveDataView';

interface EmailSummary {
  sent: number;
  opened: number;
  clicked: number;
  totalClicks: number;
  openRatePct: number;
  clickRatePct: number;
}

interface AnalyticsRow {
  sent: number;
  opened: number;
  clicked: number;
  clicks: number;
  openRatePct: number;
  clickRatePct: number;
}

interface ByTypeRow extends AnalyticsRow {
  type: string;
}

interface BySegmentRow extends AnalyticsRow {
  segment: string;
}

interface EmailAnalyticsData {
  success: boolean;
  period: { days: number; since: string };
  summary: EmailSummary;
  byType: ByTypeRow[];
  bySegment: BySegmentRow[];
}

function buildAnalyticsColumns(
  label: string,
  getLabel: (row: AnalyticsRow & { type?: string; segment?: string }) => string
): ResponsiveColumn<AnalyticsRow & { type?: string; segment?: string }>[] {
  return [
    {
      key: 'label',
      header: label,
      mobileLabel: label,
      cell: (row) => <Text fw={600}>{getLabel(row)}</Text>,
    },
    { key: 'sent', header: 'Sent', align: 'right', cell: (row) => row.sent },
    { key: 'opened', header: 'Opened', align: 'right', cell: (row) => row.opened },
    { key: 'clicked', header: 'Clicked', align: 'right', cell: (row) => row.clicked },
    { key: 'clicks', header: 'Clicks', align: 'right', cell: (row) => row.clicks },
    {
      key: 'openRate',
      header: 'Open %',
      mobileLabel: 'Open rate',
      align: 'right',
      cell: (row) => `${row.openRatePct}%`,
    },
    {
      key: 'clickRate',
      header: 'Click %',
      mobileLabel: 'Click rate',
      align: 'right',
      cell: (row) => `${row.clickRatePct}%`,
    },
  ];
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

  const typeColumns = useMemo(
    () => buildAnalyticsColumns('Type', (row) => row.type || ''),
    []
  );
  const segmentColumns = useMemo(
    () => buildAnalyticsColumns('Segment', (row) => row.segment || ''),
    []
  );

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
        <AdminPageHeader
          title={t('emailAnalytics')}
          description="Failed to load email analytics."
        />
      </Stack>
    );
  }

  const { period, summary, byType, bySegment } = data;

  return (
    <Stack p="md" gap="xl">
      <AdminPageHeader title={t('emailAnalytics')} />

      <DataToolbar title="Reporting period">
        <Select
          value={String(days)}
          onChange={(value) => setDays(Number(value || 30))}
          data={[
            { value: '7', label: 'Last 7 days' },
            { value: '30', label: 'Last 30 days' },
            { value: '90', label: 'Last 90 days' },
          ]}
          w={{ base: '100%', sm: 220 }}
        />
      </DataToolbar>

      <Text c="dimmed" size="sm">
        Period: {period.days} days since {new Date(period.since).toLocaleDateString()}. Completion emails only.
      </Text>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <MetricCard icon={<IconSend size={22} />} label="Sent" value={summary.sent} color="blue" />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={<IconEye size={22} />}
            label="Opened"
            value={summary.opened}
            detail={`${summary.openRatePct}% open rate`}
            color="green"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={<IconCursorText size={22} />}
            label="Clicked"
            value={summary.clicked}
            detail={`${summary.clickRatePct}% click rate`}
            color="yellow"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <MetricCard label="Total clicks" value={summary.totalClicks} color="amanoba" />
        </Grid.Col>
      </Grid>

      {byType.length > 0 ? (
        <Stack gap="sm">
          <Title order={2}>By email type</Title>
          <ResponsiveDataView
            rows={byType}
            columns={typeColumns}
            rowKey={(row) => row.type}
            minTableWidth={760}
            striped
            withTableBorder
            withColumnBorders
          />
        </Stack>
      ) : null}

      {bySegment.length > 0 ? (
        <Stack gap="sm">
          <Title order={2}>By segment</Title>
          <ResponsiveDataView
            rows={bySegment}
            columns={segmentColumns}
            rowKey={(row) => row.segment}
            minTableWidth={760}
            striped
            withTableBorder
            withColumnBorders
          />
        </Stack>
      ) : null}

      {summary.sent === 0 ? (
        <Text c="dimmed" size="sm">
          No tracked emails in this period. Completion emails with open/click tracking are recorded when sent.
        </Text>
      ) : null}
    </Stack>
  );
}
