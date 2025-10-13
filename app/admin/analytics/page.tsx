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

import { useState } from 'react';
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
    metadata: any;
  }>;
}

interface AnalyticsSnapshot {
  _id: string;
  brandId: string;
  metricType: string;
  period: string;
  date: string;
  gameId?: string;
  data: any;
}

// Force dynamic rendering - this page requires runtime data
export const dynamic = 'force-dynamic';

export default function AdminAnalyticsPage() {
  // Skip during SSR/build
  if (typeof window === 'undefined') {
    return <div>Loading...</div>;
  }
  
  // Default to first brand for demo (in production, would use brand selector)
  const [brandId] = useState('679fca17f0f9b3c0e8c5a8a0'); // Amanoba brand ID from seed
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Fetch real-time stats
  const { data: realtimeData } = useQuery<RealTimeStats>({
    queryKey: ['analytics', 'realtime', brandId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics/realtime?brandId=${brandId}`);
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch active users data
  const { data: activeUsersData } = useQuery<AnalyticsSnapshot[]>({
    queryKey: ['analytics', 'active_users', brandId, period, dateRange],
    queryFn: async () => {
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
  });

  // Fetch game sessions data
  const { data: gameSessionsData } = useQuery<AnalyticsSnapshot[]>({
    queryKey: ['analytics', 'game_sessions', brandId, period, dateRange],
    queryFn: async () => {
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
  });

  // Fetch revenue data
  const { data: revenueData } = useQuery<AnalyticsSnapshot[]>({
    queryKey: ['analytics', 'revenue', brandId, period, dateRange],
    queryFn: async () => {
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
  });

  // Fetch engagement data
  const { data: engagementData } = useQuery<AnalyticsSnapshot[]>({
    queryKey: ['analytics', 'engagement', brandId, period, dateRange],
    queryFn: async () => {
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
  });

  // Fetch conversion data
  const { data: conversionsData } = useQuery<AnalyticsSnapshot[]>({
    queryKey: ['analytics', 'conversions', brandId, period, dateRange],
    queryFn: async () => {
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
  });

  // Transform data for charts
  const activeUsersChartData = activeUsersData?.map((snapshot) => ({
    date: new Date(snapshot.date).toLocaleDateString(),
    totalUsers: snapshot.data.totalUsers,
    newUsers: snapshot.data.newUsers,
    premiumUsers: snapshot.data.premiumUsers,
  }));

  const gameSessionsChartData = gameSessionsData?.reduce((acc, snapshot) => {
    const dateKey = new Date(snapshot.date).toLocaleDateString();
    const existing = acc.find((item) => item.date === dateKey);
    if (existing) {
      existing.sessions += snapshot.data.totalSessions;
      existing.points += snapshot.data.totalPoints;
    } else {
      acc.push({
        date: dateKey,
        sessions: snapshot.data.totalSessions,
        points: snapshot.data.totalPoints,
      });
    }
    return acc;
  }, [] as Array<{ date: string; sessions: number; points: number }>);

  const revenueChartData = revenueData?.map((snapshot) => ({
    date: new Date(snapshot.date).toLocaleDateString(),
    redemptions: snapshot.data.totalRedemptions,
    pointsRedeemed: snapshot.data.pointsRedeemed,
  }));

  const engagementChartData = engagementData?.map((snapshot) => ({
    date: new Date(snapshot.date).toLocaleDateString(),
    sessionsPerUser: snapshot.data.sessionsPerUser,
    avgDuration: snapshot.data.averageSessionDuration,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-300">Comprehensive metrics and insights</p>
        </header>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 flex gap-4 flex-wrap">
          <div>
            <label className="block text-white text-sm mb-1">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30"
            />
          </div>
          <div>
            <label className="block text-white text-sm mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30"
            />
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-gray-300 text-sm mb-1">Active Users (24h)</div>
            <div className="text-4xl font-bold text-white">
              {realtimeData?.last24Hours.activeUsers || 0}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {realtimeData?.last1Hour.activeUsers || 0} in last hour
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-gray-300 text-sm mb-1">Game Sessions (24h)</div>
            <div className="text-4xl font-bold text-white">
              {realtimeData?.last24Hours.gameSessions || 0}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {realtimeData?.current.activeSessions || 0} active now
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-gray-300 text-sm mb-1">Points Earned (24h)</div>
            <div className="text-4xl font-bold text-white">
              {realtimeData?.last24Hours.totalPointsEarned?.toLocaleString() || 0}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="text-gray-300 text-sm mb-1">Achievements (24h)</div>
            <div className="text-4xl font-bold text-white">
              {realtimeData?.last24Hours.achievementUnlocks || 0}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Users Chart */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Active Users Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activeUsersChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fff3" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                <Legend />
                <Line type="monotone" dataKey="totalUsers" stroke="#6366f1" strokeWidth={2} name="Total Users" />
                <Line type="monotone" dataKey="newUsers" stroke="#22c55e" strokeWidth={2} name="New Users" />
                <Line type="monotone" dataKey="premiumUsers" stroke="#f59e0b" strokeWidth={2} name="Premium" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Game Sessions Chart */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Game Sessions & Points</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gameSessionsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fff3" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                <Legend />
                <Bar dataKey="sessions" fill="#ec4899" name="Sessions" />
                <Bar dataKey="points" fill="#a855f7" name="Points Earned" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Reward Redemptions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fff3" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                <Legend />
                <Area type="monotone" dataKey="redemptions" stroke="#22c55e" fill="#22c55e88" name="Redemptions" />
                <Area type="monotone" dataKey="pointsRedeemed" stroke="#f59e0b" fill="#f59e0b88" name="Points Spent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Engagement Chart */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Player Engagement</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fff3" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                <Legend />
                <Line type="monotone" dataKey="sessionsPerUser" stroke="#6366f1" strokeWidth={2} name="Sessions/User" />
                <Line type="monotone" dataKey="avgDuration" stroke="#ec4899" strokeWidth={2} name="Avg Duration (s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Games */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-6">
          <h3 className="text-xl font-bold text-white mb-4">Top Games (24h)</h3>
          <div className="space-y-3">
            {realtimeData?.topGames.map((game, index) => (
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
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {realtimeData?.recentEvents.slice(0, 10).map((event) => (
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
