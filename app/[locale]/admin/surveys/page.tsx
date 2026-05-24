/**
 * Admin Surveys Analytics Page
 * 
 * What: View survey response statistics and analytics
 * Why: Allows admins to understand user preferences and needs
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Card,
  Group,
  Loader,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconChartBar,
  IconCheck,
  IconClock,
  IconUsers,
} from '@tabler/icons-react';
import { ResponsiveDataView } from '@/app/components/patterns/ResponsiveDataView';

interface QuestionStats {
  question: string;
  type: string;
  answerCounts?: Record<string, number>;
  totalAnswers?: number;
  averageRating?: string;
  totalRatings?: number;
  minRating?: number | null;
  maxRating?: number | null;
}

interface SurveyAnalytics {
  survey: {
    surveyId: string;
    name: string;
    isActive?: boolean;
    isDefault?: boolean;
    description?: string;
    questionCount: number;
  };
  statistics: {
    totalResponses: number;
    completionRate: number;
    averageTimeSpent: number;
    skillLevelDistribution: Array<{ level: string; count: number }>;
    topInterests: Array<{ interest: string; count: number }>;
  };
  questionStats: Record<string, QuestionStats>;
  recentResponses: Array<{
    id: string;
    playerName: string;
    playerEmail: string | null;
    skillLevel: string | null;
    completedAt: string;
    timeSpentSeconds: number | null;
  }>;
}

export default function AdminSurveysPage() {
  const _locale = useLocale();
  const _t = useTranslations('admin');
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/surveys?surveyId=onboarding');
      const data = await response.json();

      if (data.success) {
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch survey analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleToggleSurvey = async (field: 'isActive' | 'isDefault') => {
    if (!analytics?.survey) return;

    try {
      setSaving(true);
      const newValue = !analytics.survey[field];
      const response = await fetch('/api/admin/surveys', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: analytics.survey.surveyId,
          [field]: newValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalytics({
          ...analytics,
          survey: {
            ...analytics.survey,
            [field]: newValue,
          },
        });
      } else {
        alert(data.error || 'Failed to update survey settings');
      }
    } catch (error) {
      console.error('Failed to update survey settings:', error);
      alert('Failed to update survey settings');
    } finally {
      setSaving(false);
    }
  };

  const recentResponseColumns = useMemo(
    () => [
      {
        key: 'player',
        header: 'Player',
        cell: (response: SurveyAnalytics['recentResponses'][number]) => (
          <Stack gap={2}>
            <Text size="sm">{response.playerName}</Text>
            {response.playerEmail ? (
              <Text c="dimmed" size="xs">
                {response.playerEmail}
              </Text>
            ) : null}
          </Stack>
        ),
      },
      {
        key: 'skill',
        header: 'Skill Level',
        mobileLabel: 'Skill',
        cell: (response: SurveyAnalytics['recentResponses'][number]) => (
          <Text size="sm" tt="capitalize">
            {response.skillLevel || 'N/A'}
          </Text>
        ),
      },
      {
        key: 'time',
        header: 'Time Spent',
        cell: (response: SurveyAnalytics['recentResponses'][number]) => (
          <Text size="sm">
            {response.timeSpentSeconds ? formatTime(response.timeSpentSeconds) : 'N/A'}
          </Text>
        ),
      },
      {
        key: 'completed',
        header: 'Completed At',
        cell: (response: SurveyAnalytics['recentResponses'][number]) => (
          <Text size="sm">{new Date(response.completedAt).toLocaleString()}</Text>
        ),
      },
    ],
    []
  );

  if (loading) {
    return (
      <Group justify="center" py="xl">
        <Loader color="amanoba" />
        <Text size="lg">Loading survey analytics...</Text>
      </Group>
    );
  }

  if (!analytics) {
    return (
      <Text ta="center" py="xl" size="lg">No survey data available</Text>
    );
  }

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={1}>Survey Analytics</Title>
        <Text c="dimmed">View survey response statistics and insights</Text>
      </Stack>

      <Card withBorder>
        <Stack gap="md">
          <Stack gap={4}>
            <Title order={2} size="h3">{analytics.survey.name}</Title>
            {analytics.survey.description ? <Text c="dimmed">{analytics.survey.description}</Text> : null}
            <Group gap="lg">
              <Text c="dimmed" size="sm">Survey ID: {analytics.survey.surveyId}</Text>
              <Text c="dimmed" size="sm">Questions: {analytics.survey.questionCount}</Text>
            </Group>
          </Stack>

          <Stack gap="sm">
            <Group justify="space-between" align="center">
              <Stack gap={2}>
                <Text fw={700}>Enable for New Users</Text>
                <Text c="dimmed" size="sm">
                {analytics.survey.isDefault ? 'Survey will be shown to new users' : 'Survey will not be shown to new users'}
                </Text>
              </Stack>
              <Switch
                checked={analytics.survey.isDefault || false}
                onChange={() => handleToggleSurvey('isDefault')}
                disabled={saving}
              />
            </Group>

            <Group justify="space-between" align="center">
              <Stack gap={2}>
                <Text fw={700}>Survey Active</Text>
                <Text c="dimmed" size="sm">
                {analytics.survey.isActive ? 'Survey is currently active' : 'Survey is disabled'}
                </Text>
              </Stack>
              <Switch
                checked={analytics.survey.isActive || false}
                onChange={() => handleToggleSurvey('isActive')}
                disabled={saving}
              />
            </Group>
          </Stack>
        </Stack>
      </Card>

      <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }}>
        {[
          { label: 'Total Responses', value: analytics.statistics.totalResponses, icon: IconUsers, color: 'amanoba' },
          { label: 'Completion Rate', value: `${analytics.statistics.completionRate}%`, icon: IconCheck, color: 'green' },
          { label: 'Avg. Time Spent', value: formatTime(analytics.statistics.averageTimeSpent), icon: IconClock, color: 'cyan' },
          { label: 'Questions', value: analytics.survey.questionCount, icon: IconChartBar, color: 'violet' },
        ].map((item) => {
          const ItemIcon = item.icon;
          return (
            <Card key={item.label} withBorder>
              <Group justify="space-between" mb="xs">
                <Text c="dimmed" size="sm" fw={700}>{item.label}</Text>
                <ThemeIcon color={item.color} variant="light">
                  <ItemIcon size={18} />
                </ThemeIcon>
              </Group>
              <Text size="xl" fw={800}>{item.value}</Text>
            </Card>
          );
        })}
      </SimpleGrid>

      {analytics.statistics.skillLevelDistribution.length > 0 && (
        <Card withBorder>
          <Stack gap="md">
            <Title order={2} size="h3">Skill Level Distribution</Title>
            <SimpleGrid cols={{ base: 1, md: 3 }}>
            {analytics.statistics.skillLevelDistribution.map((item) => (
              <Paper key={item.level} withBorder p="md">
                <Text c="dimmed" size="sm" tt="capitalize">{item.level}</Text>
                <Text size="xl" fw={800}>{item.count}</Text>
                <Text c="dimmed" size="xs">
                  {analytics.statistics.totalResponses > 0
                    ? Math.round((item.count / analytics.statistics.totalResponses) * 100)
                    : 0}%
                </Text>
              </Paper>
            ))}
            </SimpleGrid>
          </Stack>
        </Card>
      )}

      {analytics.statistics.topInterests.length > 0 && (
        <Card withBorder>
          <Stack gap="md">
            <Title order={2} size="h3">Top Interests</Title>
            <SimpleGrid cols={{ base: 2, md: 5 }}>
            {analytics.statistics.topInterests.map((item) => (
              <Paper key={item.interest} withBorder p="sm" ta="center">
                <Text size="sm" fw={800}>{item.count}</Text>
                <Text c="dimmed" size="xs" tt="capitalize">
                  {item.interest.replace(/_/g, ' ')}
                </Text>
              </Paper>
            ))}
            </SimpleGrid>
          </Stack>
        </Card>
      )}

      <Card withBorder>
        <Stack gap="md">
          <Title order={2} size="h3">Question Statistics</Title>
          {Object.entries(analytics.questionStats).map(([questionId, stats]) => (
            <Paper key={questionId} withBorder p="md">
              <Stack gap="sm">
              <Title order={3} size="h4">{stats.question}</Title>

              {stats.type === 'rating' && (
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text c="dimmed" size="sm">Average Rating</Text>
                    <Text size="sm" fw={800}>{stats.averageRating} / 5</Text>
                  </Group>
                  {stats.minRating !== null && stats.maxRating !== null && (
                    <Group justify="space-between">
                      <Text c="dimmed" size="xs">Range: {stats.minRating} - {stats.maxRating}</Text>
                      <Text c="dimmed" size="xs">{stats.totalRatings} responses</Text>
                    </Group>
                  )}
                </Stack>
              )}

              {(stats.type === 'single_choice' || stats.type === 'multiple_choice') &&
                stats.answerCounts && (
                  <Stack gap="sm">
                    {Object.entries(stats.answerCounts)
                      .sort(([, a], [, b]) => b - a)
                      .map(([value, count]) => {
                        const percentage =
                          stats.totalAnswers && stats.totalAnswers > 0
                            ? Math.round((count / stats.totalAnswers) * 100)
                            : 0;
                        return (
                          <Stack key={value} gap={4}>
                            <Group justify="space-between">
                              <Text c="dimmed" size="sm" tt="capitalize">
                                {value.replace(/_/g, ' ')}
                              </Text>
                              <Text size="sm" fw={800}>
                                {count} ({percentage}%)
                              </Text>
                            </Group>
                            <Progress color="amanoba" value={percentage} />
                          </Stack>
                        );
                      })}
                  </Stack>
                )}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Card>

      {analytics.recentResponses.length > 0 && (
        <Card withBorder>
          <Stack gap="md">
            <Title order={2} size="h3">Recent Responses</Title>
            <ResponsiveDataView
              rows={analytics.recentResponses}
              columns={recentResponseColumns}
              rowKey={(response) => response.id}
              minTableWidth={720}
              highlightOnHover
            />
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
