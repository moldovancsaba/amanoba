/**
 * Admin Vote Aggregates Page
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Group,
  Loader,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { AdminPageHeader } from '@/app/components/patterns/AdminPageHeader';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { DataToolbar } from '@/app/components/patterns/DataToolbar';
import { ResponsiveDataView } from '@/app/components/patterns/ResponsiveDataView';
import { StateBlock } from '@/app/components/patterns/StateBlock';

interface AggregateRow {
  targetType: string;
  targetId: string;
  sum: number;
  up: number;
  down: number;
  count: number;
}

export default function AdminVotesPage() {
  const [aggregates, setAggregates] = useState<AggregateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetType, setTargetType] = useState<string | null>('');

  useEffect(() => {
    setLoading(true);
    const params = targetType ? `?targetType=${encodeURIComponent(targetType)}` : '';
    fetch(`/api/admin/votes/aggregates${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.aggregates)) {
          setAggregates(data.aggregates);
        } else {
          setAggregates([]);
        }
      })
      .catch(() => setAggregates([]))
      .finally(() => setLoading(false));
  }, [targetType]);

  const columns = useMemo(
    () => [
      {
        key: 'type',
        header: 'Type',
        mobileLabel: 'Type',
        cell: (row: AggregateRow) => (
          <Badge variant="light" color="gray">
            {row.targetType}
          </Badge>
        ),
      },
      {
        key: 'target',
        header: 'Target ID',
        mobileLabel: 'Target',
        cell: (row: AggregateRow) => (
          <Text size="sm" ff="monospace" lineClamp={2}>
            {row.targetId}
          </Text>
        ),
      },
      {
        key: 'sum',
        header: 'Sum',
        align: 'right' as const,
        cell: (row: AggregateRow) => <Text fw={600}>{row.sum}</Text>,
      },
      {
        key: 'up',
        header: (
          <Group gap={4} justify="flex-end" wrap="nowrap">
            <IconThumbUp size={14} /> Up
          </Group>
        ),
        mobileLabel: 'Up',
        align: 'right' as const,
        cell: (row: AggregateRow) => (
          <Text c="green" ta="right">
            {row.up}
          </Text>
        ),
      },
      {
        key: 'down',
        header: (
          <Group gap={4} justify="flex-end" wrap="nowrap">
            <IconThumbDown size={14} /> Down
          </Group>
        ),
        mobileLabel: 'Down',
        align: 'right' as const,
        cell: (row: AggregateRow) => (
          <Text c="yellow" ta="right">
            {row.down}
          </Text>
        ),
      },
      {
        key: 'count',
        header: 'Count',
        align: 'right' as const,
        cell: (row: AggregateRow) => <Text ta="right">{row.count}</Text>,
      },
    ],
    []
  );

  return (
    <Stack gap="lg" maw={1200}>
      <AdminPageHeader
        title="Vote aggregates"
        description="Course, lesson, and question votes (up/down). Vote reset on lesson update when content changes."
      />

      <DataToolbar title="Filter by type">
        <Select
          placeholder="All"
          clearable
          value={targetType}
          onChange={setTargetType}
          data={[
            { value: 'course', label: 'Course' },
            { value: 'lesson', label: 'Lesson' },
            { value: 'question', label: 'Question' },
          ]}
          w={{ base: '100%', sm: 220 }}
        />
      </DataToolbar>

      {loading ? (
        <Group gap="sm">
          <Loader size="sm" />
          <Text c="dimmed">Loading…</Text>
        </Group>
      ) : aggregates.length === 0 ? (
        <StateBlock kind="empty" title="No vote data yet" description="Aggregates appear after learners vote on content." />
      ) : (
        <ResponsiveDataView
          rows={aggregates}
          columns={columns}
          rowKey={(row, index) => `${row.targetType}-${row.targetId}-${index}`}
          minTableWidth={640}
          striped
          withTableBorder
          withColumnBorders
        />
      )}
    </Stack>
  );
}
