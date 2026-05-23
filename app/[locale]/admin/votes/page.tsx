/**
 * Admin Vote Aggregates Page
 */

'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Group,
  Loader,
  Select,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';
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

  return (
    <Stack gap="lg" maw={1200}>
      <Stack gap={4}>
        <Title order={1}>Vote aggregates</Title>
        <Text c="dimmed" size="sm">
          Course, lesson, and question votes (up/down). Vote reset on lesson update when content changes.
        </Text>
      </Stack>

      <Group>
        <Select
          label="Filter by type"
          placeholder="All"
          clearable
          value={targetType}
          onChange={setTargetType}
          data={[
            { value: 'course', label: 'Course' },
            { value: 'lesson', label: 'Lesson' },
            { value: 'question', label: 'Question' },
          ]}
          w={220}
        />
      </Group>

      {loading ? (
        <Group gap="sm">
          <Loader size="sm" />
          <Text c="dimmed">Loading…</Text>
        </Group>
      ) : aggregates.length === 0 ? (
        <StateBlock kind="empty" title="No vote data yet" description="Aggregates appear after learners vote on content." />
      ) : (
        <Table.ScrollContainer minWidth={640}>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Type</Table.Th>
                <Table.Th>Target ID</Table.Th>
                <Table.Th ta="right">Sum</Table.Th>
                <Table.Th ta="right">
                  <Group gap={4} justify="flex-end" wrap="nowrap">
                    <IconThumbUp size={14} /> Up
                  </Group>
                </Table.Th>
                <Table.Th ta="right">
                  <Group gap={4} justify="flex-end" wrap="nowrap">
                    <IconThumbDown size={14} /> Down
                  </Group>
                </Table.Th>
                <Table.Th ta="right">Count</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {aggregates.map((row, index) => (
                <Table.Tr key={`${row.targetType}-${row.targetId}-${index}`}>
                  <Table.Td>
                    <Badge variant="light" color="gray">
                      {row.targetType}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace" lineClamp={1} maw={280}>
                      {row.targetId}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text fw={600}>{row.sum}</Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text c="green">{row.up}</Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text c="yellow">{row.down}</Text>
                  </Table.Td>
                  <Table.Td ta="right">{row.count}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </Stack>
  );
}
