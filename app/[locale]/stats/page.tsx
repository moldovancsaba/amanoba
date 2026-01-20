'use client';

/**
 * Player Statistics Page
 * 
 * Purpose: Display comprehensive player statistics and analytics
 * Why: Helps players track their progress and identify areas for improvement
 * 
 * Features from original Madoku:
 * - Overall stats (games played, win rate, average time)
 * - Game-specific stats (per game type)
 * - ELO progression chart
 * - Best performances
 * - Activity heatmap
 * - Achievement progress
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import { getEloRank, getEloIcon } from '@/lib/gamification/elo-calculator';

interface PlayerStats {
  overall: {
    totalGamesPlayed: number;
    totalWins: number;
    totalLosses: number;
    totalDraws: number;
    winRate: number;
    averageSessionTime: number;
    totalPlayTime: number;
    currentStreak: number;
    bestStreak: number;
  };
  gameSpecific: {
    [gameKey: string]: {
      gamesPlayed: number;
      wins: number;
      losses: number;
      draws: number;
      bestScore: number;
      averageScore: number;
      fastestWin?: number;
      highestAccuracy?: number;
      elo?: number;
    };
  };
  level: number;
  currentXP: number;
  totalXP: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
}

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('stats');
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

    fetchStats();
  }, [session, status, router, locale]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const user = session?.user as { id?: string; playerId?: string };
      const playerId = user.playerId || user.id;
      
      if (!playerId) {
        throw new Error(t('noPlayerId'));
      }

      // Why: Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`/api/profile/${playerId}?t=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch stats:', response.status, errorText);
        throw new Error(t('failedToLoad'));
      }

      const data = await response.json();
      const profile = data.profile || data; // Handle both wrapped and unwrapped response
      
      // Transform API response to PlayerStats structure
      setStats({
        overall: {
          totalGamesPlayed: profile.statistics?.totalGamesPlayed || 0,
          totalWins: profile.statistics?.totalWins || 0,
          totalLosses: profile.statistics?.totalLosses || 0,
          totalDraws: profile.statistics?.totalDraws || 0,
          winRate: profile.statistics?.winRate || 0,
          averageSessionTime: profile.statistics?.averageSessionTime || 0,
          totalPlayTime: profile.statistics?.totalPlayTime || 0,
          currentStreak: profile.streaks?.win?.current || 0,
          bestStreak: profile.streaks?.win?.longest || 0,
        },
        gameSpecific: profile.progression?.gameSpecificStats || {},
        level: profile.progression?.level || 1,
        currentXP: profile.progression?.currentXP || 0,
        totalXP: profile.progression?.totalXP || 0,
        achievementsUnlocked: profile.achievements?.unlocked || 0,
        achievementsTotal: profile.achievements?.total || 0,
      });
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      if (err instanceof Error && err.name === 'AbortError') {
        setError(t('requestTimedOut'));
      } else {
        setError((err as Error).message || t('failedToLoad'));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number): string => {
    if (!ms) return t('notAvailable');
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-accent mx-auto mb-4"></div>
          <p className="text-xl">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="page-shell flex items-center justify-center p-4">
        <div className="page-card max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">😕 {t('unableToLoad')}</h2>
          <p className="text-brand-darkGrey mb-6">{error || t('failedToLoad')}</p>
          <LocaleLink href="/dashboard" className="page-button-primary inline-block">
            {t('backToDashboard')}
          </LocaleLink>
        </div>
      </div>
    );
  }

  const achievementProgress = stats.achievementsTotal > 0 
    ? ((stats.achievementsUnlocked / stats.achievementsTotal) * 100).toFixed(0)
    : 0;

  return (
    <div className="page-shell">
      <header className="page-header mobile-sticky-header">
        <div className="page-container py-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-white flex items-center gap-2 leading-tight">
                <span>📊</span>
                {t('pageTitle')}
              </h1>
              <p className="text-brand-white/80 mt-1 text-sm sm:text-base">{t('pageSubtitle')}</p>
            </div>
            <LocaleLink href="/dashboard" className="page-button-secondary">
              ← {t('backToDashboard')}
            </LocaleLink>
          </div>
        </div>
      </header>

      <main className="page-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 dashboard-grid-2">
          <div className="page-card p-6">
            <div className="text-brand-darkGrey text-sm mb-2">{t('level')}</div>
            <div className="text-4xl font-bold text-brand-black mb-2">⚡ {stats.level}</div>
            <div className="text-brand-darkGrey text-sm">{stats.currentXP} / 100 XP</div>
            <div className="mt-2 h-2 bg-brand-darkGrey/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-accent"
                style={{ width: `${stats.currentXP}%` }}
              />
            </div>
          </div>

          <div className="page-card p-6">
            <div className="text-brand-darkGrey text-sm mb-2">{t('gamesPlayed')}</div>
            <div className="text-4xl font-bold text-brand-black mb-2">🎮 {stats.overall.totalGamesPlayed}</div>
            <div className="text-brand-darkGrey text-sm">
              {stats.overall.totalWins}W / {stats.overall.totalLosses}L / {stats.overall.totalDraws}D
            </div>
          </div>

          <div className="page-card p-6">
            <div className="text-brand-darkGrey text-sm mb-2">{t('winRate')}</div>
            <div className="text-4xl font-bold text-brand-black mb-2">🏆 {stats.overall.winRate}%</div>
            <div className="text-brand-darkGrey text-sm">
              {stats.overall.totalWins} {t('victories')}
            </div>
          </div>

          <div className="page-card p-6">
            <div className="text-brand-darkGrey text-sm mb-2">{t('streak')}</div>
            <div className="text-4xl font-bold text-brand-black mb-2">🔥 {stats.overall.currentStreak}</div>
            <div className="text-brand-darkGrey text-sm">
              {t('best')}: {stats.overall.bestStreak}
            </div>
          </div>
        </div>

        <div className="page-card p-6 mb-8">
          <h2 className="text-2xl font-bold text-brand-black mb-6">🎯 {t('gameSpecificStats')}</h2>
          
          {Object.keys(stats.gameSpecific).length === 0 ? (
            <p className="text-brand-darkGrey text-center py-8">{t('noGameStats')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 dashboard-grid-3">
              {Object.entries(stats.gameSpecific).map(([gameKey, gameStats]) => (
                <div 
                  key={gameKey}
                  className="bg-brand-darkGrey/5 rounded-xl p-4 border border-brand-darkGrey/20"
                >
                  <h3 className="text-lg font-semibold text-brand-black mb-3 capitalize">{gameKey}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-brand-darkGrey">
                      <span>{t('gamesPlayed')}:</span>
                      <span className="font-semibold">{gameStats.gamesPlayed}</span>
                    </div>
                    
                    <div className="flex justify-between text-brand-darkGrey">
                      <span>{t('winRate')}:</span>
                      <span className="font-semibold">
                        {gameStats.gamesPlayed > 0 
                          ? ((gameStats.wins / gameStats.gamesPlayed) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-brand-darkGrey">
                      <span>{t('bestScore')}:</span>
                      <span className="font-semibold">{gameStats.bestScore || 0}</span>
                    </div>
                    
                    {gameStats.highestAccuracy !== undefined && (
                      <div className="flex justify-between text-brand-darkGrey">
                        <span>{t('bestAccuracy')}:</span>
                        <span className="font-semibold">{gameStats.highestAccuracy.toFixed(1)}%</span>
                      </div>
                    )}
                    
                    {gameStats.fastestWin && (
                      <div className="flex justify-between text-brand-darkGrey">
                        <span>{t('fastestWin')}:</span>
                        <span className="font-semibold">{formatTime(gameStats.fastestWin)}</span>
                      </div>
                    )}
                    
                    {gameStats.elo && (
                      <div className="mt-3 pt-3 border-t border-brand-darkGrey/20">
                        <div className="flex justify-between items-center">
                          <span className="text-brand-darkGrey">{t('eloRating')}:</span>
                          <span className="text-xl font-bold text-brand-black">
                            {getEloIcon(gameStats.elo)} {gameStats.elo}
                          </span>
                        </div>
                        <div className="text-center mt-1">
                          <span className="text-xs text-brand-darkGrey">{getEloRank(gameStats.elo)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 dashboard-grid-2">
          <div className="page-card p-6">
            <h2 className="text-2xl font-bold text-brand-black mb-4">🏅 {t('achievements')}</h2>
            
            <div className="text-center py-8">
              <div className="text-6xl font-bold text-brand-black mb-2">
                {achievementProgress}%
              </div>
              <div className="text-brand-darkGrey text-lg mb-4">
                {t('unlockedCount', {
                  unlocked: stats.achievementsUnlocked,
                  total: stats.achievementsTotal,
                })}
              </div>
              <div className="max-w-xs mx-auto h-3 bg-brand-darkGrey/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-accent"
                  style={{ width: `${achievementProgress}%` }}
                />
              </div>
            </div>
            
            <LocaleLink href="/achievements" className="page-button-primary w-full text-center mt-4 block">
              {t('viewAllAchievements')}
            </LocaleLink>
          </div>

          <div className="page-card p-6">
            <h2 className="text-2xl font-bold text-brand-black mb-4">⏱️ {t('playTime')}</h2>
            
            <div className="space-y-4">
              <div className="bg-brand-darkGrey/5 rounded-lg p-4 border border-brand-darkGrey/20">
                <div className="text-brand-darkGrey text-sm mb-2">{t('totalPlayTime')}</div>
                <div className="text-3xl font-bold text-brand-black">
                  {formatTime(stats.overall.totalPlayTime)}
                </div>
              </div>
              
              <div className="bg-brand-darkGrey/5 rounded-lg p-4 border border-brand-darkGrey/20">
                <div className="text-brand-darkGrey text-sm mb-2">{t('averageSession')}</div>
                <div className="text-3xl font-bold text-brand-black">
                  {formatTime(stats.overall.averageSessionTime)}
                </div>
              </div>
              
              <div className="bg-brand-darkGrey/5 rounded-lg p-4 border border-brand-darkGrey/20">
                <div className="text-brand-darkGrey text-sm mb-2">{t('sessionsPlayed')}</div>
                <div className="text-3xl font-bold text-brand-black">
                  {stats.overall.totalGamesPlayed}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
