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
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    fetchStats();
  }, [session, status, router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const playerId = session?.user?.id;
      
      if (!playerId) {
        throw new Error('No player ID found');
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
        throw new Error(`Failed to fetch player stats: ${response.status}`);
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
      
      console.log('Stats loaded:', stats);
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number): string => {
    if (!ms) return 'N/A';
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">😕 Unable to Load Statistics</h2>
          <p className="text-white/80 mb-6">{error || 'Failed to load player statistics'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate derived stats
  const gamesToNextLevel = Math.ceil((100 - stats.currentXP) / 20); // Rough estimate
  const achievementProgress = stats.achievementsTotal > 0 
    ? ((stats.achievementsUnlocked / stats.achievementsTotal) * 100).toFixed(0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-white/80 hover:text-white flex items-center gap-2 mb-4 transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">📊 Player Statistics</h1>
          <p className="text-white/70 text-lg">Track your progress and performance</p>
        </div>

        {/* Overall Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Level */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-white/70 text-sm mb-2">Level</div>
            <div className="text-4xl font-bold text-white mb-2">⚡ {stats.level}</div>
            <div className="text-white/60 text-sm">{stats.currentXP} / 100 XP</div>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${stats.currentXP}%` }}
              />
            </div>
          </div>

          {/* Total Games */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-white/70 text-sm mb-2">Games Played</div>
            <div className="text-4xl font-bold text-white mb-2">🎮 {stats.overall.totalGamesPlayed}</div>
            <div className="text-white/60 text-sm">
              {stats.overall.totalWins}W / {stats.overall.totalLosses}L / {stats.overall.totalDraws}D
            </div>
          </div>

          {/* Win Rate */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-white/70 text-sm mb-2">Win Rate</div>
            <div className="text-4xl font-bold text-white mb-2">🏆 {stats.overall.winRate}%</div>
            <div className="text-white/60 text-sm">
              {stats.overall.totalWins} victories
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-white/70 text-sm mb-2">Streak</div>
            <div className="text-4xl font-bold text-white mb-2">🔥 {stats.overall.currentStreak}</div>
            <div className="text-white/60 text-sm">
              Best: {stats.overall.bestStreak}
            </div>
          </div>
        </div>

        {/* Game-Specific Stats */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">🎯 Game-Specific Stats</h2>
          
          {Object.keys(stats.gameSpecific).length === 0 ? (
            <p className="text-white/60 text-center py-8">No game-specific stats yet. Start playing!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.gameSpecific).map(([gameKey, gameStats]) => (
                <div 
                  key={gameKey}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <h3 className="text-lg font-semibold text-white mb-3 capitalize">{gameKey}</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/80">
                      <span>Games Played:</span>
                      <span className="font-semibold">{gameStats.gamesPlayed}</span>
                    </div>
                    
                    <div className="flex justify-between text-white/80">
                      <span>Win Rate:</span>
                      <span className="font-semibold">
                        {gameStats.gamesPlayed > 0 
                          ? ((gameStats.wins / gameStats.gamesPlayed) * 100).toFixed(1)
                          : 0}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-white/80">
                      <span>Best Score:</span>
                      <span className="font-semibold">{gameStats.bestScore || 0}</span>
                    </div>
                    
                    {gameStats.highestAccuracy !== undefined && (
                      <div className="flex justify-between text-white/80">
                        <span>Best Accuracy:</span>
                        <span className="font-semibold">{gameStats.highestAccuracy.toFixed(1)}%</span>
                      </div>
                    )}
                    
                    {gameStats.fastestWin && (
                      <div className="flex justify-between text-white/80">
                        <span>Fastest Win:</span>
                        <span className="font-semibold">{formatTime(gameStats.fastestWin)}</span>
                      </div>
                    )}
                    
                    {gameStats.elo && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">ELO Rating:</span>
                          <span className="text-xl font-bold text-white">
                            {getEloIcon(gameStats.elo)} {gameStats.elo}
                          </span>
                        </div>
                        <div className="text-center mt-1">
                          <span className="text-xs text-white/60">{getEloRank(gameStats.elo)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements & Play Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Achievements Progress */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🏅 Achievements</h2>
            
            <div className="text-center py-8">
              <div className="text-6xl font-bold text-white mb-2">
                {achievementProgress}%
              </div>
              <div className="text-white/70 text-lg mb-4">
                {stats.achievementsUnlocked} / {stats.achievementsTotal} Unlocked
              </div>
              <div className="max-w-xs mx-auto h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-600"
                  style={{ width: `${achievementProgress}%` }}
                />
              </div>
            </div>
            
            <button
              onClick={() => router.push('/achievements')}
              className="w-full mt-4 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white font-semibold"
            >
              View All Achievements
            </button>
          </div>

          {/* Play Time */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">⏱️ Play Time</h2>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/70 text-sm mb-2">Total Play Time</div>
                <div className="text-3xl font-bold text-white">
                  {formatTime(stats.overall.totalPlayTime)}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/70 text-sm mb-2">Average Session</div>
                <div className="text-3xl font-bold text-white">
                  {formatTime(stats.overall.averageSessionTime)}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white/70 text-sm mb-2">Sessions Played</div>
                <div className="text-3xl font-bold text-white">
                  {stats.overall.totalGamesPlayed}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
