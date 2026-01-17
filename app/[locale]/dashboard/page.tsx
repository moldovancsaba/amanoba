'use client';

/**
 * Player Dashboard Page
 * 
 * Why: Central view for player progression, achievements, and stats
 * What: Comprehensive dashboard showing level, XP, points, achievements, and streaks
 */

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import { ReferralCard } from '@/components/ReferralCard';
import Logo from '@/components/Logo';

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
  const locale = useLocale();
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Why: Fetch player data when session is available or on manual refresh
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
      const user = session.user as { id?: string; playerId?: string };
      const playerId = user.playerId || user.id;
      // Why: Add timestamp to bust any caching
      const response = await fetch(`/api/players/${playerId}?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlayerData(data);
        console.log('Dashboard data refreshed:', data);
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

  useEffect(() => {
    fetchPlayerData();
  }, [session, status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-brand-white text-2xl font-bold animate-pulse">
          {t('loading')}
        </div>
      </div>
    );
  }

  if (error || !playerData) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="bg-brand-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-brand-accent">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-brand-black mb-4">
            {t('unableToLoad')}
          </h2>
          <p className="text-brand-darkGrey mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchPlayerData();
              }}
              className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-xl font-bold hover:bg-brand-primary-400 transition-all"
            >
              {t('retry')}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}/auth/signin` })}
              className="inline-block bg-brand-darkGrey text-brand-white px-6 py-3 rounded-xl font-bold hover:bg-brand-secondary-700 transition-colors"
            >
              {tCommon('auth.signOut')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { player, progression, wallet, streaks, achievementStats } = playerData;
  const xpProgress = progression ? (progression.currentXP / progression.xpToNextLevel) * 100 : 0;

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Logo size="md" showText={true} linkTo="/dashboard" />
              <div>
                <h1 className="text-3xl font-bold text-brand-white">{t('title')}</h1>
                <p className="text-brand-white/80 mt-1">{t('yourLearningJourney')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setLoading(true);
                  fetchPlayerData();
                }}
                className="bg-brand-accent text-brand-black px-4 py-2 rounded-lg hover:bg-brand-primary-400 transition-colors font-medium font-bold"
              >
                🔄 {t('refresh')}
              </button>
              <LocaleLink
                href="/courses"
                className="bg-brand-accent text-brand-black px-4 py-2 rounded-lg hover:bg-brand-primary-400 transition-colors font-medium font-bold"
              >
                📚 {t('browseCourses')}
              </LocaleLink>
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}/auth/signin` })}
                className="bg-brand-darkGrey text-brand-white px-4 py-2 rounded-lg hover:bg-brand-secondary-700 transition-colors font-medium"
              >
                🚪 {tCommon('auth.signOut')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions - Learning First */}
        <div className="bg-brand-white rounded-xl shadow-lg p-6 mb-8 border-2 border-brand-accent">
          <h3 className="text-xl font-bold text-brand-black mb-4 flex items-center gap-2">
            <span>📚</span>
            {t('startLearning')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3">
            <LocaleLink
              href="/courses"
              className="block bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-all text-sm transform hover:scale-105"
            >
              📚 {t('courses')}
            </LocaleLink>
            <LocaleLink
              href="/my-courses"
              className="block bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-all text-sm transform hover:scale-105"
            >
              📖 {t('myCourses')}
            </LocaleLink>
            <LocaleLink
              href="/games"
              className="block bg-brand-darkGrey text-brand-white px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-secondary-700 transition-all text-sm"
            >
              🎮 {tCommon('games.title')}
            </LocaleLink>
            <LocaleLink
              href="/stats"
              className="block bg-brand-darkGrey text-brand-white px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-secondary-700 transition-all text-sm"
            >
              📊 {t('statistics')}
            </LocaleLink>
            <LocaleLink
              href="/leaderboards"
              className="block bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-all text-sm"
            >
              🏆 {tCommon('leaderboard.title')}
            </LocaleLink>
            <LocaleLink
              href="/challenges"
              className="block bg-brand-darkGrey text-brand-white px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-secondary-700 transition-all text-sm"
            >
              🎯 {tCommon('challenges.title')}
            </LocaleLink>
            <LocaleLink
              href="/quests"
              className="block bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-all text-sm"
            >
              🗺️ {tCommon('quests.title')}
            </LocaleLink>
            <LocaleLink
              href="/achievements"
              className="block bg-brand-darkGrey text-brand-white px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-secondary-700 transition-all text-sm"
            >
              🏅 {tCommon('achievements.title')}
            </LocaleLink>
            <LocaleLink
              href="/rewards"
              className="block bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-all text-sm"
            >
              🎁 {tCommon('rewards.title')}
            </LocaleLink>
          </div>
        </div>

        {/* Player Header Card */}
        <div className="bg-brand-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-brand-accent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center text-4xl">
                👤
              </div>
              <div>
                <h2 className="text-2xl font-bold text-brand-black">
                  {player.displayName || 'Player'}
                </h2>
                {progression?.currentTitle && (
                  <div className="text-brand-accent font-medium">
                    {progression.currentTitle}
                  </div>
                )}
                <div className="text-brand-darkGrey text-sm">
                  {t('memberSince')} {new Date(player.createdAt).toLocaleDateString('hu-HU')}
                </div>
              </div>
            </div>
            {player.isPremium && (
              <div className="bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span>{tCommon('premium')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Learning Level Card */}
          <div className="bg-brand-white rounded-xl shadow-lg p-6 border-2 border-brand-accent">
            <div className="text-brand-accent text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold text-brand-black">
              {progression?.level || 1}
            </div>
            <div className="text-brand-darkGrey">{t('learningLevel')}</div>
            {progression && (
              <>
                <div className="mt-4 bg-brand-darkGrey/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-accent h-full transition-all"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <div className="text-xs text-brand-darkGrey mt-1">
                  {progression.currentXP} / {progression.xpToNextLevel} {t('learningPoints')}
                </div>
              </>
            )}
          </div>

          {/* Points Card */}
          <div className="bg-brand-white rounded-xl shadow-lg p-6 border-2 border-brand-accent">
            <div className="text-brand-accent text-4xl mb-2">💎</div>
            <div className="text-3xl font-bold text-brand-black">
              {wallet?.currentBalance.toLocaleString() || 0}
            </div>
            <div className="text-brand-darkGrey">{t('points')}</div>
            {wallet && (
              <div className="text-xs text-brand-darkGrey mt-4">
                {t('earned')}: {wallet.lifetimeEarned.toLocaleString()} • 
                {t('spent')}: {wallet.lifetimeSpent.toLocaleString()}
              </div>
            )}
          </div>

          {/* Achievements Card */}
          <div className="bg-brand-white rounded-xl shadow-lg p-6 border-2 border-brand-accent">
            <div className="text-brand-accent text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-brand-black">
              {achievementStats.unlocked}/{achievementStats.total}
            </div>
            <div className="text-brand-darkGrey">{t('achievements')}</div>
            <div className="mt-4 bg-brand-darkGrey/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-accent h-full transition-all"
                style={{ width: `${achievementStats.percentage}%` }}
              />
            </div>
            <div className="text-xs text-brand-darkGrey mt-1">
              {achievementStats.percentage}% {t('complete')}
            </div>
          </div>

          {/* Course Progress Card */}
          <div className="bg-brand-white rounded-xl shadow-lg p-6 border-2 border-brand-accent">
            <div className="text-brand-accent text-4xl mb-2">📈</div>
            <div className="text-3xl font-bold text-brand-black">
              {progression?.totalGamesPlayed || 0}
            </div>
            <div className="text-brand-darkGrey">{t('assessmentsCompleted')}</div>
            {progression && (
              <div className="text-xs text-brand-darkGrey mt-4">
                {t('keepLearning')}
              </div>
            )}
          </div>
        </div>

        {/* Streaks and Referrals Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Streaks Card */}
          <div className="bg-brand-white rounded-xl shadow-lg p-6 border-2 border-brand-accent">
            <h3 className="text-xl font-bold text-brand-black mb-4 flex items-center gap-2">
              <span>🔥</span>
              {t('streaks')}
            </h3>
            <div className="space-y-4">
              {streaks && streaks.length > 0 ? (
                streaks.map((streak, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-brand-black capitalize">
                        {streak.type.replace('_', ' ')} {t('streaks')}
                      </div>
                      <div className="text-sm text-brand-darkGrey">
                        Legjobb: {streak.bestCount}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-brand-accent">
                      {streak.count}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-brand-darkGrey text-center py-4">
                  <p className="mb-3">{t('noActiveStreaks')}</p>
                  <LocaleLink
                    href="/courses"
                    className="inline-block bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors text-sm"
                  >
                    📚 {t('enrollInCourse')}
                  </LocaleLink>
                </div>
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
