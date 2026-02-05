/**
 * Admin Home Dashboard
 * 
 * Overview dashboard showing key platform metrics, recent activity,
 * and quick action buttons for common admin tasks.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Users,
  Gamepad2,
  Trophy,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Plus,
} from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface DashboardStats {
  totalPlayers: number;
  activePlayers: number;
  totalGames: number;
  totalSessions: number;
  sessionsThisMonth: number;
  pointsEarned: number;
  pointsThisMonth: number;
  achievementsUnlocked: number;
  achievementsThisMonth: number;
  revenueThisMonth: number;
  growthRate: {
    players: number;
    sessions: number;
    achievements: number;
    points: number;
  };
  activeSessions: number;
  recentActivity?: Array<{
    type: string;
    message: string;
    time: string;
  }>;
}

export default function AdminDashboardPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemInfo, setSystemInfo] = useState<{
    version: string;
    environment: string;
    database: string;
    uptime: string;
  } | null>(null);

  useEffect(() => {
    fetchStats();
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const response = await fetch('/api/admin/system-info');
      const data = await response.json();
      if (data.success) {
        setSystemInfo(data.systemInfo);
      }
    } catch (err) {
      console.error('Failed to fetch system info:', err);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.error || 'Failed to load statistics');
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-brand-white text-xl">{tCommon('loading')}</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-400 text-xl mb-4">{error || tCommon('error')}</div>
        <button
          onClick={fetchStats}
          className="page-button-primary px-4 py-2"
        >
          {tCommon('retry')}
        </button>
      </div>
    );
  }

  // Format growth rate for display
  const formatGrowthRate = (rate: number) => {
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-white mb-2">{t('dashboardTitle')}</h1>
        <p className="text-brand-white/70">{t('dashboardDescription')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Players */}
        <div className="panel-on-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-accent/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-brand-accent" />
            </div>
            {stats.growthRate.players !== 0 && (
              <div className={`flex items-center gap-1 text-sm ${
                stats.growthRate.players >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                <ArrowUpRight className="w-4 h-4" />
                <span>{formatGrowthRate(stats.growthRate.players)}</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-brand-white mb-1">{stats.totalPlayers.toLocaleString()}</div>
          <div className="text-brand-white/70 text-sm">{t('totalPlayers')}</div>
          <div className="mt-2 text-xs text-brand-white/60">{stats.activePlayers} {t('activePlayers').toLowerCase()}</div>
        </div>

        {/* Game Sessions */}
        <div className="panel-on-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-accent/20 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-brand-accent" />
            </div>
            {stats.growthRate.sessions !== 0 && (
              <div className={`flex items-center gap-1 text-sm ${
                stats.growthRate.sessions >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                <ArrowUpRight className="w-4 h-4" />
                <span>{formatGrowthRate(stats.growthRate.sessions)}</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-brand-white mb-1">{stats.totalSessions.toLocaleString()}</div>
          <div className="text-brand-white/70 text-sm">{t('totalSessions')}</div>
          <div className="mt-2 text-xs text-brand-white/60">{stats.sessionsThisMonth.toLocaleString()} ez a hónap</div>
        </div>

        {/* Achievements */}
        <div className="panel-on-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-accent/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-brand-accent" />
            </div>
            {stats.growthRate.achievements !== 0 && (
              <div className={`flex items-center gap-1 text-sm ${
                stats.growthRate.achievements >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                <ArrowUpRight className="w-4 h-4" />
                <span>{formatGrowthRate(stats.growthRate.achievements)}</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-brand-white mb-1">{stats.achievementsUnlocked.toLocaleString()}</div>
          <div className="text-brand-white/70 text-sm">{t('achievementsUnlocked')}</div>
          <div className="mt-2 text-xs text-brand-white/60">{stats.achievementsThisMonth.toLocaleString()} ez a hónap</div>
        </div>

        {/* Points Economy */}
        <div className="panel-on-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-accent/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-brand-accent" />
            </div>
            {stats.growthRate.points !== 0 && (
              <div className={`flex items-center gap-1 text-sm ${
                stats.growthRate.points >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                <ArrowUpRight className="w-4 h-4" />
                <span>{formatGrowthRate(stats.growthRate.points)}</span>
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-brand-white mb-1">{stats.pointsEarned.toLocaleString()}</div>
          <div className="text-brand-white/70 text-sm">{t('pointsEarned')}</div>
          <div className="mt-2 text-xs text-brand-white/60">{stats.pointsThisMonth.toLocaleString()} ez a hónap</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="panel-on-dark p-6">
        <h2 className="text-xl font-bold text-brand-white mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href={`/${locale}/admin/games`}
            className="flex flex-col items-center gap-2 p-4 bg-brand-black/30 hover:bg-brand-black/50 rounded-lg transition-colors border border-brand-accent/20"
          >
            <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-brand-black" />
            </div>
            <span className="text-brand-white text-sm font-medium">{t('addGame')}</span>
          </Link>

          <Link
            href={`/${locale}/admin/achievements`}
            className="flex flex-col items-center gap-2 p-4 bg-brand-black/30 hover:bg-brand-black/50 rounded-lg transition-colors border border-brand-accent/20"
          >
            <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-brand-black" />
            </div>
            <span className="text-brand-white text-sm font-medium">{t('addAchievement')}</span>
          </Link>

          <Link
            href={`/${locale}/admin/rewards`}
            className="flex flex-col items-center gap-2 p-4 bg-brand-black/30 hover:bg-brand-black/50 rounded-lg transition-colors border border-brand-accent/20"
          >
            <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-brand-black" />
            </div>
            <span className="text-brand-white text-sm font-medium">{t('addReward')}</span>
          </Link>

          <Link
            href={`/${locale}/admin/players`}
            className="flex flex-col items-center gap-2 p-4 bg-brand-black/30 hover:bg-brand-black/50 rounded-lg transition-colors border border-brand-accent/20"
          >
            <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-brand-black" />
            </div>
            <span className="text-brand-white text-sm font-medium">{t('managePlayers')}</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="panel-on-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-brand-white">{t('recentActivity')}</h2>
            <Activity className="w-5 h-5 text-brand-white/70" />
          </div>
          <div className="space-y-3">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-brand-black/30 rounded-lg border border-brand-accent/10">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'player' ? 'bg-green-500' :
                    activity.type === 'achievement' ? 'bg-yellow-500' :
                    activity.type === 'game' ? 'bg-brand-accent' : 'bg-pink-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-brand-white text-sm">{activity.message}</p>
                    <p className="text-brand-white/60 text-xs mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-brand-white/70 text-sm text-center py-4">
                Nincs legutóbbi tevékenység
              </div>
            )}
          </div>
          <Link
            href={`/${locale}/admin/analytics`}
            className="block mt-4 text-center text-brand-accent hover:underline text-sm font-medium"
          >
            {t('viewAllActivity')} →
          </Link>
        </div>

        {/* Platform Health */}
        {/* NOTE: These metrics are currently placeholder values. To implement real metrics, we would need:
            - API response time tracking (middleware or monitoring service)
            - Database query performance monitoring (MongoDB Atlas metrics or custom tracking)
            - Error rate calculation (from EventLog or error tracking service)
            - Active connections monitoring (MongoDB connection pool metrics)
            This would require integration with a monitoring system like DataDog, New Relic, or custom EventLog analysis */}
        <div className="panel-on-dark p-6">
          <h2 className="text-xl font-bold text-brand-white mb-4">{t('platformHealth')}</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-brand-white/70">{t('apiResponseTime')}</span>
                <span className="text-green-500">{t('excellent')}</span>
              </div>
              <div className="h-2 bg-brand-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '95%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-brand-white/70">{t('databasePerformance')}</span>
                <span className="text-green-500">{t('good')}</span>
              </div>
              <div className="h-2 bg-brand-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '87%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-brand-white/70">{t('errorRate')}</span>
                <span className="text-green-500">{t('low')}</span>
              </div>
              <div className="h-2 bg-brand-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '98%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-brand-white/70">{t('activeConnections')}</span>
                <span className="text-yellow-500">{t('normal')}</span>
              </div>
              <div className="h-2 bg-brand-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: '72%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="panel-on-dark p-6">
        <h2 className="text-xl font-bold text-brand-white mb-4">{t('systemInformation')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-brand-white/70 text-sm mb-1">{t('version')}</div>
              <div className="text-brand-white font-mono">
                v{systemInfo?.version || '2.7.0'}
              </div>
            </div>
            <div>
              <div className="text-brand-white/70 text-sm mb-1">{t('environment')}</div>
              <div className="text-brand-white capitalize">
                {systemInfo?.environment || 'development'}
              </div>
            </div>
            <div>
              <div className="text-brand-white/70 text-sm mb-1">{t('database')}</div>
              <div className={`${
                systemInfo?.database === 'connected' ? 'text-green-500' : 'text-red-500'
              }`}>
                {systemInfo?.database === 'connected' ? t('connected') : t('disconnected')}
              </div>
            </div>
            <div>
              <div className="text-brand-white/70 text-sm mb-1">{t('uptime')}</div>
              <div className="text-brand-white">
                {systemInfo?.uptime ?? '—'}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
