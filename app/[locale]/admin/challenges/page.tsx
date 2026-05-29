/**
 * Admin Challenges Management Page
 *
 * What: Manage daily challenges in the platform.
 * Why: Allows admins to view and manage daily challenges.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { DataToolbar } from '@/app/components/patterns/DataToolbar';
import { useTranslations } from 'next-intl';
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
import { AdminPageHeader } from '@/app/components/patterns/AdminPageHeader';
import { IconCalendar, IconTarget } from '@tabler/icons-react';

interface Challenge {
  _id: string;
  date: string;
  type: string;
  difficulty: string;
  title: string;
  description: string;
  requirement: {
    target: number;
  };
  rewards: {
    points: number;
    xp: number;
  };
  availability: {
    isActive: boolean;
    startTime: string;
    endTime: string;
  };
  completions: {
    total: number;
    percentage: number;
  };
}

const difficultyColors: Record<string, string> = {
  easy: 'green',
  medium: 'yellow',
  hard: 'red',
};

export default function AdminChallengesPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateFilter) {
        params.append('date', dateFilter);
      }
      if (difficultyFilter !== 'all') {
        params.append('difficulty', difficultyFilter);
      }

      const response = await fetch(`/api/admin/challenges?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setChallenges(data.challenges || []);
      }
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, difficultyFilter]);

  useEffect(() => {
    void fetchChallenges();
  }, [fetchChallenges]);

  if (loading) {
    return (
      <Center mih={400}>
        <Loader />
      </Center>
    );
  }

  const activeChallenges = challenges.filter((challenge) => challenge.availability.isActive).length;
  const averageCompletion =
    challenges.length > 0
      ? challenges.reduce((sum, challenge) => sum + challenge.completions.percentage, 0) /
        challenges.length
      : 0;

  return (
    <Stack gap="xl">
      <AdminPageHeader
        title={t('challengesManagement')}
        description={t('challengesDescription')}
      />

      <DataToolbar title={t('challengesManagement')}>
        <TextInput
          type="date"
          leftSection={<IconCalendar size={18} />}
          value={dateFilter}
          onChange={(event) => setDateFilter(event.currentTarget.value)}
          w={{ base: '100%', sm: 200 }}
        />
        <Select
          value={difficultyFilter}
          onChange={(value) => setDifficultyFilter(value || 'all')}
          data={[
            { value: 'all', label: t('allDifficulties') },
            { value: 'easy', label: t('easy') },
            { value: 'medium', label: t('medium') },
            { value: 'hard', label: t('hard') },
          ]}
          w={{ base: '100%', sm: 200 }}
          allowDeselect={false}
        />
      </DataToolbar>

      <Stack gap="md">
        {challenges.length === 0 ? (
          <Card withBorder p="xl">
            <Text ta="center" c="dimmed">
              {tCommon('noDataFound')}
            </Text>
          </Card>
        ) : (
          challenges.map((challenge) => (
            <Card key={challenge._id} withBorder p="lg">
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Group align="flex-start">
                    <ThemeIcon variant="light">
                      <IconTarget size={18} />
                    </ThemeIcon>
                    <div>
                      <Group gap="sm">
                        <Title order={3}>{challenge.title}</Title>
                        <Badge color={difficultyColors[challenge.difficulty] || 'gray'}>
                          {challenge.difficulty}
                        </Badge>
                      </Group>
                      <Text c="dimmed" size="sm">
                        {challenge.description}
                      </Text>
                    </div>
                  </Group>
                  <Stack gap={0} align="flex-end">
                    <Text size="sm" c="dimmed">
                      {t('completionRate')}
                    </Text>
                    <Text fw={700} size="xl" c="green">
                      {challenge.completions.percentage.toFixed(1)}%
                    </Text>
                    <Text size="xs" c="dimmed">
                      {challenge.completions.total} {t('players')}
                    </Text>
                  </Stack>
                </Group>

                <Grid>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput label={tCommon('type')} value={challenge.type.replace(/_/g, ' ')} readOnly />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput label="Cel" value={String(challenge.requirement.target)} readOnly />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <TextInput
                      label={t('rewards')}
                      value={`${challenge.rewards.points} pont, ${challenge.rewards.xp} XP`}
                      readOnly
                    />
                  </Grid.Col>
                </Grid>

                <Group justify="space-between">
                  <Text size="xs" c="dimmed">
                    {new Date(challenge.availability.startTime).toLocaleString('hu-HU')} -{' '}
                    {new Date(challenge.availability.endTime).toLocaleString('hu-HU')}
                  </Text>
                  <Badge color={challenge.availability.isActive ? 'green' : 'gray'}>
                    {challenge.availability.isActive ? tCommon('active') : tCommon('inactive')}
                  </Badge>
                </Group>
              </Stack>
            </Card>
          ))
        )}
      </Stack>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">{t('totalChallenges')}</Text>
            <Text size="xl" fw={700}>{challenges.length}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">{tCommon('active')}</Text>
            <Text size="xl" fw={700} c="green">{activeChallenges}</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder>
            <Text size="sm" c="dimmed">{t('avgCompletion')}</Text>
            <Text size="xl" fw={700}>{averageCompletion.toFixed(1)}%</Text>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
