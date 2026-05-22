/**
 * Admin Quests Page
 *
 * What: Quest management interface for admins.
 * Why: Allows admins to view and manage quests.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Badge,
  Card,
  Center,
  Grid,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconAward, IconListDetails, IconSearch } from '@tabler/icons-react';

interface Quest {
  _id: string;
  title: string;
  description: string;
  category: string;
  totalSteps: number;
  rewards: {
    completionPoints: number;
    completionXP: number;
  };
  requirements: {
    isPremiumOnly: boolean;
  };
  availability: {
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    isRepeatable: boolean;
  };
  statistics: {
    totalStarted: number;
    totalCompleted: number;
    completionRate: number;
  };
  createdAt: string;
}

export default function AdminQuestsPage() {
  const _locale = useLocale();
  const _t = useTranslations('admin');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const fetchQuests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());

      const response = await fetch(`/api/admin/quests?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load quests');
      }
      setQuests(data.quests || []);
    } catch (error) {
      console.error('Failed to fetch quests:', error);
      setError('Unable to load quests right now.');
      setQuests([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    void fetchQuests();
  }, [fetchQuests]);

  if (loading) {
    return (
      <Center mih={400}>
        <Loader />
      </Center>
    );
  }

  return (
    <Stack gap="xl">
      <div>
        <Title order={1}>Quest Management</Title>
        <Text c="dimmed">View and manage quests on the platform</Text>
      </div>

      <Group align="flex-end">
        <TextInput
          flex={1}
          leftSection={<IconSearch size={18} />}
          label="Search"
          placeholder="Search quests..."
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
        <Select
          label="Status"
          value={statusFilter}
          onChange={(value) => setStatusFilter((value as 'all' | 'active' | 'inactive') || 'all')}
          data={[
            { value: 'all', label: 'All Quests' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      </Group>

      {error ? (
        <Card withBorder>
          <Text c="red">{error}</Text>
        </Card>
      ) : null}

      {quests.length === 0 ? (
        <Card withBorder p="xl">
          <Stack align="center" gap="sm">
            <ThemeIcon variant="light" size="xl">
              <IconListDetails size={28} />
            </ThemeIcon>
            <Title order={3}>No Quests Found</Title>
            <Text c="dimmed" ta="center">
              {search.trim() || statusFilter !== 'all'
                ? 'No quests match the current filters.'
                : 'No quests have been created yet.'}
            </Text>
          </Stack>
        </Card>
      ) : (
        <Grid>
          {quests.map((quest) => (
            <Grid.Col key={quest._id} span={{ base: 12, md: 6, lg: 4 }}>
              <Card withBorder h="100%">
                <Stack gap="md">
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <Title order={3}>{quest.title}</Title>
                      <Text c="dimmed" size="sm" lineClamp={2}>
                        {quest.description}
                      </Text>
                    </div>
                    <Badge color={quest.availability.isActive ? 'green' : 'gray'}>
                      {quest.availability.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Group>

                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconListDetails size={16} />
                      <Text size="sm" c="dimmed">{quest.totalSteps} steps</Text>
                    </Group>
                    <Group gap="xs">
                      <IconAward size={16} />
                      <Text size="sm" c="dimmed">{quest.rewards.completionPoints} points</Text>
                    </Group>
                    {quest.requirements.isPremiumOnly ? <Badge variant="light">Premium Only</Badge> : null}
                  </Stack>

                  {quest.statistics ? (
                    <Card withBorder>
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">Started: {quest.statistics.totalStarted}</Text>
                        <Text size="xs" c="dimmed">Completed: {quest.statistics.totalCompleted}</Text>
                        <Text size="xs" c="dimmed">Rate: {quest.statistics.completionRate.toFixed(1)}%</Text>
                      </Stack>
                    </Card>
                  ) : null}
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
