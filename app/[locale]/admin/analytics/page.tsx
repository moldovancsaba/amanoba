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
import { useQuery } from '@tanstack/react-query';
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
      <div className="page-shell p-6">
        <div className="page-container">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-brand-white mb-2">Analytics Dashboard</h1>
            <p className="text-brand-white/70">Comprehensive metrics and insights</p>
          </header>
          <div className="page-card-dark p-6">
            <div className="text-center text-brand-white">
              <div className="inline-block w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Loading analytics data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if brandId failed to load
  if (brandIdError || !brandId) {
    return (
      <div className="page-shell p-6">
        <div className="page-container">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-brand-white mb-2">Analytics Dashboard</h1>
            <p className="text-brand-white/70">Comprehensive metrics and insights</p>
          </header>
          <div className="page-card-dark p-6">
            <div className="text-center">
              <div className="text-red-400 text-xl mb-4">{brandIdError || 'Failed to load brand information'}</div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell p-6">
      <div className="page-container">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-brand-white mb-2">Analytics Dashboard</h1>
          <p className="text-brand-white/70">Comprehensive metrics and insights</p>
        </header>

        {/* Controls */}
        <div className="page-card-dark p-4 mb-6 flex gap-4 flex-wrap">
          <div>
            <label className="block text-brand-white text-sm mb-1">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="px-4 py-2 rounded-lg bg-brand-black/30 text-brand-white border border-brand-darkGrey/50"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-brand-white text-sm mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-4 py-2 rounded-lg bg-brand-black/30 text-brand-white border border-brand-darkGrey/50"
            />
          </div>
          <div>
            <label className="block text-brand-white text-sm mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-4 py-2 rounded-lg bg-brand-black/30 text-brand-white border border-brand-darkGrey/50"
            />
          </div>
        </div>

        {/* Error Display */}
        {realtimeError && (
          <div className="page-card-dark p-4 mb-6 bg-red-900/20 border border-red-500/50">
            <div className="text-red-400 font-semibold mb-1">Error Loading Analytics</div>
            <div className="text-red-300 text-sm">
              {realtimeError instanceof Error ? realtimeError.message : 'Unknown error occurred'}
            </div>
          </div>
        )}

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="page-card-dark p-6">
            <div className="text-gray-300 text-sm mb-1">Active Users (24h)</div>
            <div className="text-4xl font-bold text-white">
              {realtimeData?.last24Hours?.activeUsers || 0}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {realtimeData?.last1Hour?.activeUsers || 0} in last hour
            </div>
          </div>
          <div className="page-card-dark p-6">
            <div className="text-gray-300 text-sm mb-1">Game Sessions (24h)</div>
            <div className="text-4xl font-bold text-white">
              {realtimeData?.last24Hours?.gameSessions || 0}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {realtimeData?.current?.activeSessions || 0} active now
            </div>
          </div>
          <div className="page-card-dark p-6">
            <div className="text-gray-300 text-sm mb-1">Points Earned (24h)</div>
            <div className="text-4xl font-bold text-white">
              {realtimeData?.last24Hours?.totalPointsEarned?.toLocaleString() || 0}
            </div>
          </div>
          <div className="page-card-dark p-6">
            <div className="text-gray-300 text-sm mb-1">Achievements (24h)</div>
            <div className="text-4xl font-bold text-white">
              {realtimeData?.last24Hours?.achievementUnlocks || 0}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Users Chart */}
          <div className="page-card-dark p-6">
            <h3 className="text-xl font-bold text-white mb-4">Active Users Trend</h3>
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
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                <p>No data available for the selected period</p>
              </div>
            )}
          </div>

          {/* Game Sessions Chart */}
          <div className="page-card-dark p-6">
            <h3 className="text-xl font-bold text-white mb-4">Game Sessions & Points</h3>
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
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                <p>No data available for the selected period</p>
              </div>
            )}
          </div>

          {/* Revenue Chart */}
          <div className="page-card-dark p-6">
            <h3 className="text-xl font-bold text-white mb-4">Reward Redemptions</h3>
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
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                <p>No data available for the selected period</p>
              </div>
            )}
          </div>

          {/* Engagement Chart */}
          <div className="page-card-dark p-6">
            <h3 className="text-xl font-bold text-white mb-4">Player Engagement</h3>
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
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                <p>No data available for the selected period</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Games */}
        <div className="page-card-dark p-6 mt-6">
          <h3 className="text-xl font-bold text-white mb-4">Top Games (24h)</h3>
          {realtimeData?.topGames && realtimeData.topGames.length > 0 ? (
            <div className="space-y-3">
              {realtimeData.topGames.map((game, index) => (
              <div key={game._id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-indigo-400">#{index + 1}</div>
                  <div>
                    <div className="text-white font-semibold">{game._id}</div>
                    <div className="text-gray-400 text-sm">{game.sessionCount} sessions</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{game.totalPoints.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">points earned</div>
                </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>No game sessions in the last 24 hours</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="page-card-dark p-6 mt-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          {realtimeData?.recentEvents && realtimeData.recentEvents.length > 0 ? (
            <div className="space-y-2">
              {realtimeData.recentEvents.slice(0, 10).map((event) => (
              <div key={event._id} className="flex items-center justify-between bg-white/5 rounded-lg p-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${getEventColor(event.eventType)}`}></div>
                  <span className="text-white">{formatEventType(event.eventType)}</span>
                </div>
                <div className="text-gray-400">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getEventColor(eventType: string): string {
  const colors: Record<string, string> = {
    player_registered: 'bg-green-400',
    game_played: 'bg-blue-400',
    achievement_unlocked: 'bg-yellow-400',
    points_earned: 'bg-purple-400',
    reward_redeemed: 'bg-pink-400',
    level_up: 'bg-orange-400',
  };
  return colors[eventType] || 'bg-gray-400';
}

function formatEventType(eventType: string): string {
  return eventType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
