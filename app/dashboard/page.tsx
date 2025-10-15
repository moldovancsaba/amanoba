'use client';

/**
 * Player Dashboard Page
 * 
 * Why: Central view for player progression, achievements, and stats
 * What: Comprehensive dashboard showing level, XP, points, achievements, and streaks
 */

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { ReferralCard } from '@/components/ReferralCard';

interface PlayerData {
  player: {
    id: string;
    displayName: string;
    isPremium: boolean;
    createdAt: string;
  };
  progression: {
    level: number;
    currentXP: number;
    xpToNextLevel: number;
    totalXP: number;
    currentTitle: string | null;
    totalGamesPlayed: number;
    totalGamesWon: number;
    winRate: number;
    bestStreak: number;
    currentStreak: number;
  };
  wallet: {
    currentBalance: number;
    lifetimeEarned: number;
    lifetimeSpent: number;
  };
  streaks: Array<{
    type: string;
    count: number;
    bestCount: number;
  }>;
  achievementStats: {
    unlocked: number;
    total: number;
    percentage: number;
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Why: Fetch player data when session is available
  useEffect(() => {
    const fetchPlayerData = async () => {
      if (status === 'loading') {
        return;
      }
      
      if (!session?.user?.id) {
        setError('No session found. Please sign in again.');
        setLoading(false);
        return;
      }
      
      try {
        const playerId = (session.user as any).playerId || (session.user as any).id;
        const response = await fetch(`/api/players/${playerId}`);
        
        if (response.ok) {
          const data = await response.json();
          setPlayerData(data);
        } else {
          setError('Failed to load player data');
        }
      } catch (err) {
        setError('Network error');
        console.error('Failed to fetch player data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [session, status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (error || !playerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to Load Dashboard
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { player, progression, wallet, streaks, achievementStats } = playerData;
  const xpProgress = progression ? (progression.currentXP / progression.xpToNextLevel) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-white/80 mt-1">Your progress at a glance</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/games"
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-medium"
              >
                🎮 Play Games
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="bg-red-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🎯</span>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              href="/games"
              className="block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold text-center hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              🎮 Play Games
            </Link>
            <Link
              href={`/api/players/${playerData.player.id}/achievements`}
              className="block bg-gradient-to-r from-pink-600 to-red-600 text-white px-6 py-3 rounded-lg font-bold text-center hover:from-pink-700 hover:to-red-700 transition-all"
            >
              🏆 View Achievements
            </Link>
            <Link
              href="/api/rewards"
              className="block bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 rounded-lg font-bold text-center hover:from-yellow-700 hover:to-orange-700 transition-all"
            >
              🎁 Redeem Rewards
            </Link>
          </div>
        </div>

        {/* Player Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-4xl">
                👤
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {player.displayName || 'Player'}
                </h2>
                {progression?.currentTitle && (
                  <div className="text-purple-600 font-medium">
                    {progression.currentTitle}
                  </div>
                )}
                <div className="text-gray-600 text-sm">
                  Member since {new Date(player.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {player.isPremium && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span>Premium</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Level Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-indigo-600 text-4xl mb-2">⚡</div>
            <div className="text-3xl font-bold text-gray-900">
              {progression?.level || 1}
            </div>
            <div className="text-gray-600">Level</div>
            {progression && (
              <>
                <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {progression.currentXP} / {progression.xpToNextLevel} XP
                </div>
              </>
            )}
          </div>

          {/* Points Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-purple-600 text-4xl mb-2">💎</div>
            <div className="text-3xl font-bold text-gray-900">
              {wallet?.currentBalance.toLocaleString() || 0}
            </div>
            <div className="text-gray-600">Points</div>
            {wallet && (
              <div className="text-xs text-gray-500 mt-4">
                Earned: {wallet.lifetimeEarned.toLocaleString()} • 
                Spent: {wallet.lifetimeSpent.toLocaleString()}
              </div>
            )}
          </div>

          {/* Achievements Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-pink-600 text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-gray-900">
              {achievementStats.unlocked}/{achievementStats.total}
            </div>
            <div className="text-gray-600">Achievements</div>
            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-red-500 h-full transition-all"
                style={{ width: `${achievementStats.percentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {achievementStats.percentage}% Complete
            </div>
          </div>

          {/* Win Rate Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-green-600 text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-gray-900">
              {progression?.winRate.toFixed(1) || 0}%
            </div>
            <div className="text-gray-600">Win Rate</div>
            {progression && (
              <div className="text-xs text-gray-500 mt-4">
                {progression.totalGamesWon} wins in {progression.totalGamesPlayed} games
              </div>
            )}
          </div>
        </div>

        {/* Streaks and Referrals Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Streaks Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔥</span>
              Streaks
            </h3>
            <div className="space-y-4">
              {streaks && streaks.length > 0 ? (
                streaks.map((streak, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {streak.type.replace('_', ' ')} Streak
                      </div>
                      <div className="text-sm text-gray-600">
                        Best: {streak.bestCount}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {streak.count}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No active streaks yet. Start playing to build streaks!
                </p>
              )}
            </div>
          </div>

          {/* Referral Card */}
          <ReferralCard />
        </div>
      </main>
    </div>
  );
}
