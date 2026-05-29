/**
 * Admin Analytics Dashboard
 * 
 * Comprehensive dashboard displaying all analytics metrics with interactive charts.
 * Uses Recharts for data visualization and TanStack Query for data fetching.
 * 
 * Features:
 * - Real-time stats (last 24 hours, last 1 hour, current)
 * - Historical trends (DAU/WAU/MAU, game sessions, revenue)
 * - Retention cohort analysis
 * - Engagement metrics
 * - Conversion funnels
 * - Top games and rewards
 * - Recent activity feed
 */

'use client';

import { useState, useEffect } from 'react';
import { DataToolbar } from '@/app/components/patterns/DataToolbar';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Button,
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
import { IconRefresh } from '@tabler/icons-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_THEME } from '@/app/lib/constants/color-tokens';

interface RealTimeStats {
  last24Hours: {
    activeUsers: number;
    gameSessions: number;
    achievementUnlocks: number;
    rewardRedemptions: number;
    totalPointsEarned: number;
  };
  last1Hour: {
    activeUsers: number;
    gameSessions: number;
  };
  current: {
    activeSessions: number;
  };
  topGames: Array<{
    _id: string;
    sessionCount: number;
    totalPoints: number;
  }>;
  recentEvents: Array<{
    _id: string;
    eventType: string;
    playerId: string;
    timestamp: string;
    metadata: Record<string, unknown>;
  }>;
}

interface AnalyticsSnapshot {
  _id: string;
  brandId: string;
  metricType: string;
  period: string;
  date: string;
  gameId?: string;
  data: Record<string, unknown>;
}

// Force dynamic rendering - this page requires runtime data
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function AdminAnalyticsPage() {
  // Why: All hooks must be called unconditionally at the top level
  // Fetch brand ID from database (default brand)
  const [brandId, setBrandId] = useState<string | null>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const [loadingBrandId, setLoadingBrandId] = useState(true);
  const [brandIdError, setBrandIdError] = useState<string | null>(null);

  // Fetch default brand ID on mount
  useEffect(() => {
    const fetchBrandId = async () => {
      try {
        setLoadingBrandId(true);
        setBrandIdError(null);
        const res = await fetch('/api/admin/brands?default=true');
        if (!res.ok) {
          console.error('Failed to fetch brand ID:', res.status, res.statusText);
          // Try to get brand by slug as fallback
          const fallbackRes = await fetch('/api/admin/brands');
          if (fallbackRes.ok) {
            const fallbackJson = await fallbackRes.json();
            if (fallbackJson.success && fallbackJson.brands && fallbackJson.brands.length > 0) {
              // Find amanoba brand or use first active brand
              const amanobaBrand = fallbackJson.brands.find((b: { slug?: string }) => b.slug === 'amanoba') || 
                                  fallbackJson.brands.find((b: { isActive?: boolean }) => b.isActive);
              if (amanobaBrand) {
                // Convert ObjectId to string if needed
                const brandIdValue = amanobaBrand._id?.toString() || amanobaBrand._id;
                setBrandId(brandIdValue);
                setLoadingBrandId(false);
                return;
              }
            }
          }
          setBrandIdError('Failed to load brand information. Please refresh the page.');
          setLoadingBrandId(false);
          return;
        }
        const json = await res.json();
        if (json.success && json.brands && json.brands.length > 0) {
          // Convert ObjectId to string if needed
          const brandIdValue = json.brands[0]._id?.toString() || json.brands[0]._id;
          setBrandId(brandIdValue);
        } else {
          console.error('No brands found in response:', json);
          setBrandIdError('No brands found. Please contact support.');
        }
      } catch (error) {
        console.error('Failed to fetch brand ID:', error);
        setBrandIdError('Failed to load analytics. Please refresh the page.');
      } finally {
        setLoadingBrandId(false);
      }
    };
    fetchBrandId();
  }, []);

  // Fetch real-time stats (only if brandId is available)
  const { data: realtimeData, error: realtimeError } = useQuery<RealTimeStats>({
    queryKey: ['analytics', 'realtime', brandId],
    queryFn: async () => {
      if (!brandId) return null;
      const res = await fetch(`/api/admin/analytics/realtime?brandId=${brandId}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!brandId,
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch active users data
  const { data: activeUsersData } = useQuery<AnalyticsSnapshot[]>({
    queryKey: ['analytics', 'active_users', brandId, period, dateRange],
    queryFn: async () => {
      if (!brandId) return [];
      const params = new URLSearchParams({
        brandId,
        metricType: 'active_users',
        period,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const res = await fetch(`/api/admin/analytics?${params}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!brandId,
  });

  // Fetch game sessions data
  const { data: gameSessionsData } = useQuery<AnalyticsSnapshot[]>({
    queryKey: ['analytics', 'game_sessions', brandId, period, dateRange],
    queryFn: async () => {
      if (!brandId) return [];
      const params = new URLSearchParams({
        brandId,
        metricType: 'game_sessions',
        period,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const res = await fetch(`/api/admin/analytics?${params}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!brandId,
  });

  // Fetch revenue data
  const { data: revenueData } = useQuery<AnalyticsSnapshot[]>({
    queryKey: ['analytics', 'revenue', brandId, period, dateRange],
    queryFn: async () => {
      if (!brandId) return [];
      const params = new URLSearchParams({
        brandId,
        metricType: 'revenue',
        period,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const res = await fetch(`/api/admin/analytics?${params}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!brandId,
  });

  // Fetch engagement data
  const { data: engagementData } = useQuery<AnalyticsSnapshot[]>({
    queryKey: ['analytics', 'engagement', brandId, period, dateRange],
    queryFn: async () => {
      if (!brandId) return [];
      const params = new URLSearchParams({
        brandId,
        metricType: 'engagement',
        period,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const res = await fetch(`/api/admin/analytics?${params}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!brandId,
  });

  // Fetch conversion data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: conversionsData } = useQuery<AnalyticsSnapshot[]>({
    queryKey: ['analytics', 'conversions', brandId, period, dateRange],
    queryFn: async () => {
      if (!brandId) return [];
      const params = new URLSearchParams({
        brandId,
        metricType: 'conversions',
        period,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      const res = await fetch(`/api/admin/analytics?${params}`);
      const json = await res.json();
      return json.data;
    },
    enabled: !!brandId,
  });

  // Transform data for charts
  const activeUsersChartData = activeUsersData?.map((snapshot) => ({
    date: new Date(snapshot.date).toLocaleDateString(),
    totalUsers: (snapshot.data.totalUsers as number) || 0,
    newUsers: (snapshot.data.newUsers as number) || 0,
    premiumUsers: (snapshot.data.premiumUsers as number) || 0,
  }));

  const gameSessionsChartData = gameSessionsData?.reduce((acc, snapshot) => {
    const dateKey = new Date(snapshot.date).toLocaleDateString();
    const existing = acc.find((item) => item.date === dateKey);
    if (existing) {
      existing.sessions += (snapshot.data.totalSessions as number) || 0;
      existing.points += (snapshot.data.totalPoints as number) || 0;
    } else {
      acc.push({
        date: dateKey,
        sessions: (snapshot.data.totalSessions as number) || 0,
        points: (snapshot.data.totalPoints as number) || 0,
      });
    }
    return acc;
  }, [] as Array<{ date: string; sessions: number; points: number }>);

  const revenueChartData = revenueData?.map((snapshot) => ({
    date: new Date(snapshot.date).toLocaleDateString(),
    redemptions: (snapshot.data.totalRedemptions as number) || 0,
    pointsRedeemed: (snapshot.data.pointsRedeemed as number) || 0,
  }));

  const engagementChartData = engagementData?.map((snapshot) => ({
    date: new Date(snapshot.date).toLocaleDateString(),
    sessionsPerUser: (snapshot.data.sessionsPerUser as number) || 0,
    avgDuration: (snapshot.data.averageSessionDuration as number) || 0,
  }));

  // Show loading state if brandId is not yet loaded
  if (loadingBrandId) {
    return (
      <Center mih={400}>
        <Stack align="center">
          <Loader />
          <Text>Loading analytics data...</Text>
        </Stack>
      </Center>
    );
  }

  // Show error state if brandId failed to load
  if (brandIdError || !brandId) {
    return (
      <Stack gap="xl">
        <AdminPageHeader
          title="Analytics Dashboard"
          description="Comprehensive metrics and insights"
        />
        <Alert color="red" title={brandIdError || 'Failed to load brand information'}>
          <Button leftSection={<IconRefresh size={18} />} onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
        <AdminPageHeader
          title="Analytics Dashboard"
          description="Comprehensive metrics and insights"
        />

        <DataToolbar title="Reporting period" layout="stack">
          <Group align="flex-end" wrap="wrap">
            <Select
              label="Period"
              value={period}
              onChange={(value) => setPeriod((value as 'daily' | 'weekly' | 'monthly') || 'daily')}
              data={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
              w={{ base: '100%', sm: 180 }}
            />
            <TextInput
              label="Start Date"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.currentTarget.value })}
              w={{ base: '100%', sm: 180 }}
            />
            <TextInput
              type="date"
              label="End Date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.currentTarget.value })}
              w={{ base: '100%', sm: 180 }}
            />
          </Group>
        </DataToolbar>

        {/* Error Display */}
        {realtimeError && (
          <Alert color="red" title="Error Loading Analytics">
              {realtimeError instanceof Error ? realtimeError.message : 'Unknown error occurred'}
          </Alert>
        )}

        {/* Real-time Stats */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card withBorder>
            <Text c="dimmed" size="sm">Active Users (24h)</Text>
            <Text size="xl" fw={700}>
              {realtimeData?.last24Hours?.activeUsers || 0}
            </Text>
            <Text size="xs" c="dimmed">
              {realtimeData?.last1Hour?.activeUsers || 0} in last hour
            </Text>
          </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card withBorder>
            <Text c="dimmed" size="sm">Game Sessions (24h)</Text>
            <Text size="xl" fw={700}>
              {realtimeData?.last24Hours?.gameSessions || 0}
            </Text>
            <Text size="xs" c="dimmed">
              {realtimeData?.current?.activeSessions || 0} active now
            </Text>
          </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card withBorder>
            <Text c="dimmed" size="sm">Points Earned (24h)</Text>
            <Text size="xl" fw={700}>
              {realtimeData?.last24Hours?.totalPointsEarned?.toLocaleString() || 0}
            </Text>
          </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <Card withBorder>
            <Text c="dimmed" size="sm">Achievements (24h)</Text>
            <Text size="xl" fw={700}>
              {realtimeData?.last24Hours?.achievementUnlocks || 0}
            </Text>
          </Card>
          </Grid.Col>
        </Grid>

        {/* Charts */}
        <Grid>
          {/* Active Users Chart */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card withBorder>
            <Title order={3}>Active Users Trend</Title>
            {activeUsersChartData && activeUsersChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activeUsersChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridStroke} />
                  <XAxis dataKey="date" stroke={CHART_THEME.axisStroke} />
                  <YAxis stroke={CHART_THEME.axisStroke} />
                  <Tooltip contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: 'none' }} />
                  <Legend />
                  <Line type="monotone" dataKey="totalUsers" stroke={CHART_THEME.series[0]} strokeWidth={2} name="Total Users" />
                  <Line type="monotone" dataKey="newUsers" stroke={CHART_THEME.series[1]} strokeWidth={2} name="New Users" />
                  <Line type="monotone" dataKey="premiumUsers" stroke={CHART_THEME.series[2]} strokeWidth={2} name="Premium" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Center h={300}><Text c="dimmed">No data available for the selected period</Text></Center>
            )}
          </Card>
          </Grid.Col>

          {/* Game Sessions Chart */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card withBorder>
            <Title order={3}>Game Sessions & Points</Title>
            {gameSessionsChartData && gameSessionsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gameSessionsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridStroke} />
                  <XAxis dataKey="date" stroke={CHART_THEME.axisStroke} />
                  <YAxis stroke={CHART_THEME.axisStroke} />
                  <Tooltip contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: 'none' }} />
                  <Legend />
                  <Bar dataKey="sessions" fill={CHART_THEME.series[3]} name="Sessions" />
                  <Bar dataKey="points" fill={CHART_THEME.series[4]} name="Points Earned" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Center h={300}><Text c="dimmed">No data available for the selected period</Text></Center>
            )}
          </Card>
          </Grid.Col>

          {/* Revenue Chart */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card withBorder>
            <Title order={3}>Reward Redemptions</Title>
            {revenueChartData && revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridStroke} />
                  <XAxis dataKey="date" stroke={CHART_THEME.axisStroke} />
                  <YAxis stroke={CHART_THEME.axisStroke} />
                  <Tooltip contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: 'none' }} />
                  <Legend />
                  <Area type="monotone" dataKey="redemptions" stroke={CHART_THEME.series[1]} fill={CHART_THEME.seriesWithAlpha(CHART_THEME.series[1])} name="Redemptions" />
                  <Area type="monotone" dataKey="pointsRedeemed" stroke={CHART_THEME.series[2]} fill={CHART_THEME.seriesWithAlpha(CHART_THEME.series[2])} name="Points Spent" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Center h={300}><Text c="dimmed">No data available for the selected period</Text></Center>
            )}
          </Card>
          </Grid.Col>

          {/* Engagement Chart */}
          <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card withBorder>
            <Title order={3}>Player Engagement</Title>
            {engagementChartData && engagementChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridStroke} />
                  <XAxis dataKey="date" stroke={CHART_THEME.axisStroke} />
                  <YAxis stroke={CHART_THEME.axisStroke} />
                  <Tooltip contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: 'none' }} />
                  <Legend />
                  <Line type="monotone" dataKey="sessionsPerUser" stroke={CHART_THEME.series[0]} strokeWidth={2} name="Sessions/User" />
                  <Line type="monotone" dataKey="avgDuration" stroke={CHART_THEME.series[3]} strokeWidth={2} name="Avg Duration (s)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Center h={300}><Text c="dimmed">No data available for the selected period</Text></Center>
            )}
          </Card>
          </Grid.Col>
        </Grid>

        {/* Top Games */}
        <Card withBorder>
          <Title order={3}>Top Games (24h)</Title>
          {realtimeData?.topGames && realtimeData.topGames.length > 0 ? (
            <Stack gap="sm" mt="md">
              {realtimeData.topGames.map((game, index) => (
              <Card key={game._id} withBorder>
                <Group justify="space-between">
                <Group>
                  <ThemeIcon variant="light">#{index + 1}</ThemeIcon>
                  <div>
                    <Text fw={600}>{game._id}</Text>
                    <Text c="dimmed" size="sm">{game.sessionCount} sessions</Text>
                  </div>
                </Group>
                <div>
                  <Text fw={600} ta="right">{game.totalPoints.toLocaleString()}</Text>
                  <Text c="dimmed" size="sm">points earned</Text>
                </div>
                </Group>
              </Card>
              ))}
            </Stack>
          ) : (
            <Text c="dimmed" ta="center" py="xl">No game sessions in the last 24 hours</Text>
          )}
        </Card>

        {/* Recent Activity */}
        <Card withBorder>
          <Title order={3}>Recent Activity</Title>
          {realtimeData?.recentEvents && realtimeData.recentEvents.length > 0 ? (
            <Stack gap="xs" mt="md">
              {realtimeData.recentEvents.slice(0, 10).map((event) => (
              <Card key={event._id} withBorder>
                <Group justify="space-between">
                <Group>
                  <ThemeIcon color={getEventColor(event.eventType)} size="sm" radius="xl" />
                  <Text>{formatEventType(event.eventType)}</Text>
                </Group>
                <Text c="dimmed" size="sm">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </Text>
                </Group>
              </Card>
              ))}
            </Stack>
          ) : (
            <Text c="dimmed" ta="center" py="xl">No recent activity</Text>
          )}
        </Card>
    </Stack>
  );
}

function getEventColor(eventType: string): string {
  const colors: Record<string, string> = {
    player_registered: 'green',
    game_played: 'cyan',
    achievement_unlocked: 'yellow',
    points_earned: 'violet',
    reward_redeemed: 'pink',
    level_up: 'orange',
  };
  return colors[eventType] || 'gray';
}

function formatEventType(eventType: string): string {
  return eventType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
