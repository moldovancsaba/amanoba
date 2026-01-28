'use client';

/**
 * User Dashboard Page
 * 
 * Why: Central view for user progression, achievements, and stats
 * What: Comprehensive dashboard showing level, XP, points, achievements, and streaks
 */

import { useEffect, useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import { ReferralCard } from '@/components/ReferralCard';
import Logo from '@/components/Logo';
import Icon, { 
  MdMenuBook, 
  MdAutoStories, 
  MdSportsEsports, 
  MdBarChart, 
  MdEmojiEvents, 
  MdGpsFixed, 
  MdMap, 
  MdEmojiEvents as MdMedal, 
  MdCardGiftcard, 
  MdPerson, 
  MdStar, 
  MdTrendingUp, 
  MdLocalFireDepartment,
  MdDiamond
} from '@/components/Icon';

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
  courseStats?: {
    quizzesCompleted: number;
    lessonsCompleted: number;
    coursesEnrolled: number;
    coursesCompleted: number;
    totalCourseXP: number;
    totalCoursePoints: number;
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const hasCheckedSurvey = useRef(false);
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const tGames = useTranslations('games');
  const tLeaderboard = useTranslations('leaderboard');
  const tChallenges = useTranslations('challenges');
  const tQuests = useTranslations('quests');
  const tAchievements = useTranslations('achievements');
  const tRewards = useTranslations('rewards');
  const tCourses = useTranslations('courses');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<{
    courses: boolean;
    myCourses: boolean;
    games: boolean;
    stats: boolean;
    leaderboards: boolean;
    challenges: boolean;
    quests: boolean;
    achievements: boolean;
    rewards: boolean;
  } | null>(null);

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
        if (process.env.NODE_ENV === 'development') console.log('Dashboard data refreshed:', data);
        
        // ONBOARDING REDIRECT DISABLED - Will be re-enabled after fixing issues
        // Check if player needs to complete survey
        // Only check once per session and only if we're actually on dashboard
        // DISABLED: if (typeof window !== 'undefined' && pathname?.includes('/dashboard')) {
        //   const urlParams = new URLSearchParams(window.location.search);
        //   const surveyCompleted = urlParams.get('surveyCompleted') === 'true';
        //   
        //   // If we just completed the survey, don't redirect
        //   if (surveyCompleted) {
        //     hasCheckedSurvey.current = true;
        //     // Clean up the URL
        //     window.history.replaceState({}, '', window.location.pathname);
        //   } else if (!hasCheckedSurvey.current && data.player && !data.player.surveyCompleted) {
        //     hasCheckedSurvey.current = true;
        //     // Use replace instead of push to prevent back button issues and redirect loops
        //     router.replace(`/${locale}/onboarding`);
        //     return;
        //   } else {
        //     hasCheckedSurvey.current = true;
        //   }
        // } else {
        //   hasCheckedSurvey.current = true;
        // }
        hasCheckedSurvey.current = true;
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

  const fetchRecommendations = async () => {
    if (status === 'loading' || !session) return;
    
    try {
      setLoadingRecommendations(true);
      const response = await fetch('/api/courses/recommendations?limit=3');
      const data = await response.json();
      
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    fetchPlayerData();
    fetchFeatureFlags();
    fetchRecommendations();
  }, [session, status]);

  const fetchFeatureFlags = async () => {
    try {
      const response = await fetch('/api/feature-flags');
      const data = await response.json();
      if (data.success && data.featureFlags?.features) {
        setFeatureFlags(data.featureFlags.features);
      }
    } catch (error) {
      console.error('Failed to fetch feature flags:', error);
      // Default to course features enabled
      setFeatureFlags({
        courses: true,
        myCourses: true,
        games: false,
        stats: false,
        leaderboards: false,
        challenges: false,
        quests: false,
        achievements: false,
        rewards: false,
      });
    }
  };

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
              {tAuth('signOut')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { player, progression, wallet, streaks, achievementStats, courseStats } = playerData;
  const xpProgress = progression ? (progression.currentXP / progression.xpToNextLevel) * 100 : 0;

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent sticky top-0 z-40 mobile-sticky-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center gap-3">
              <Logo size="md" showText={false} linkTo="/dashboard" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-white leading-tight">
                  {t('title')}
                </h1>
                <p className="text-brand-white/80 mt-1 text-sm sm:text-base">{t('yourLearningJourney')}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  setLoading(true);
                  fetchPlayerData();
                }}
                className="bg-brand-accent text-brand-black px-4 py-3 sm:py-2 rounded-lg hover:bg-brand-primary-400 transition-colors font-bold text-center mobile-full-width"
              >
                🔄 {t('refresh')}
              </button>
              <LocaleLink
                href="/courses"
                className="bg-brand-accent text-brand-black px-4 py-3 sm:py-2 rounded-lg hover:bg-brand-primary-400 transition-colors font-bold text-center mobile-full-width"
              >
                📚 {t('browseCourses')}
              </LocaleLink>
              {session?.user && (() => {
                const userRole = (session.user as { role?: string }).role;
                // Debug: log role for troubleshooting (remove in production if needed)
                if (process.env.NODE_ENV === 'development') {
                  console.log('User role in session:', userRole, 'Full user:', session.user);
                }
                return userRole === 'admin';
              })() && (
                <LocaleLink
                  href="/admin"
                  className="bg-brand-primary-600 text-brand-white px-4 py-3 sm:py-2 rounded-lg hover:bg-brand-primary-700 transition-colors font-bold text-center mobile-full-width"
                >
                  ⚙️ Admin
                </LocaleLink>
              )}
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}/auth/signin` })}
                className="bg-brand-darkGrey text-brand-white px-4 py-3 sm:py-2 rounded-lg hover:bg-brand-secondary-700 transition-colors font-medium text-center mobile-full-width"
              >
                🚪 {tAuth('signOut')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Quick Actions - Learning First */}
        <div className="bg-brand-white rounded-xl shadow-lg p-6 mb-8 border-2 border-brand-accent">
          <h3 className="text-xl font-bold text-brand-black mb-4 flex items-center gap-2">
            <Icon icon={MdMenuBook} size={20} className="inline-block mr-2" />
            {t('startLearning')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-3 dashboard-grid">
            {featureFlags?.courses && (
              <LocaleLink
                href="/courses"
                className="block bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-all text-sm transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Icon icon={MdMenuBook} size={18} />
                {t('courses')}
              </LocaleLink>
            )}
            {featureFlags?.myCourses && (
              <LocaleLink
                href="/my-courses"
                className="block bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-all text-sm transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Icon icon={MdAutoStories} size={18} />
                {t('myCourses')}
              </LocaleLink>
            )}
            {featureFlags?.games && (
              <LocaleLink
                href="/games"
                className="block bg-brand-darkGrey text-brand-white px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-secondary-700 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Icon icon={MdSportsEsports} size={18} />
                {tGames('title')}
              </LocaleLink>
            )}
            {featureFlags?.stats && (
              <LocaleLink
                href="/stats"
                className="block bg-brand-darkGrey text-brand-white px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-secondary-700 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Icon icon={MdBarChart} size={18} />
                {t('statistics')}
              </LocaleLink>
            )}
            {featureFlags?.leaderboards && (
              <LocaleLink
                href="/leaderboards"
                className="block bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Icon icon={MdEmojiEvents} size={18} />
                {tLeaderboard('title')}
              </LocaleLink>
            )}
            {featureFlags?.challenges && (
              <LocaleLink
                href="/challenges"
                className="block bg-brand-darkGrey text-brand-white px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-secondary-700 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Icon icon={MdGpsFixed} size={18} />
                {tChallenges('title')}
              </LocaleLink>
            )}
            {featureFlags?.quests && (
              <LocaleLink
                href="/quests"
                className="block bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Icon icon={MdMap} size={18} />
                {tQuests('title')}
              </LocaleLink>
            )}
            {featureFlags?.achievements && (
              <LocaleLink
                href="/achievements"
                className="block bg-brand-darkGrey text-brand-white px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-secondary-700 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Icon icon={MdMedal} size={18} />
                {tAchievements('title')}
              </LocaleLink>
            )}
            {featureFlags?.rewards && (
              <LocaleLink
                href="/rewards"
                className="block bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Icon icon={MdCardGiftcard} size={18} />
                {tRewards('title')}
              </LocaleLink>
            )}
          </div>
        </div>

        {/* Course Recommendations */}
        {featureFlags?.courses && recommendations.length > 0 && (
          <div className="bg-brand-white rounded-xl shadow-lg p-6 mb-8 border-2 border-brand-accent">
            <h3 className="text-xl font-bold text-brand-black mb-4 flex items-center gap-2">
              <Icon icon={MdMenuBook} size={20} className="text-brand-accent" />
              {t('recommendedCourses')}
            </h3>
            {loadingRecommendations ? (
              <div className="text-center py-8 text-brand-darkGrey">
                {t('loading')}...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 dashboard-grid-3">
                {recommendations.map((course) => (
                  <LocaleLink
                    key={course.courseId}
                    href={`/courses/${course.courseId}`}
                    className="block bg-brand-darkGrey/5 rounded-lg p-4 border-2 border-brand-darkGrey/20 hover:border-brand-accent transition-all hover:shadow-lg"
                  >
                    {course.thumbnail && (
                      <div className="w-full h-32 bg-brand-darkGrey rounded-lg mb-3 overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h4 className="font-bold text-brand-black text-lg mb-2 line-clamp-2">
                      {course.name}
                    </h4>
                    <p className="text-sm text-brand-darkGrey line-clamp-2 mb-3">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-brand-darkGrey">
                      <span>{course.durationDays} {tCourses('days') || 'days'}</span>
                      {course.requiresPremium && (
                        <span className="bg-brand-accent text-brand-black px-2 py-1 rounded font-bold">
                          {tCommon('premium')}
                        </span>
                      )}
                    </div>
                  </LocaleLink>
                ))}
              </div>
            )}
            <div className="mt-4 text-center">
              <LocaleLink
                href="/courses"
                className="inline-block bg-brand-accent text-brand-black px-6 py-2 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
              >
                {t('viewAllCourses')} →
              </LocaleLink>
            </div>
          </div>
        )}

        {/* Player Header Card */}
        <div className="bg-brand-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-brand-accent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center">
                <Icon icon={MdPerson} size={48} className="text-brand-black" />
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
                <Icon icon={MdStar} size={24} />
                <span>{tCommon('premium')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 dashboard-grid-2">
          {/* Learning Level Card */}
          <div className="bg-brand-white rounded-xl shadow-lg p-6 border-2 border-brand-accent">
            <Icon icon={MdMenuBook} size={48} className="text-brand-accent mb-2" />
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
            <Icon icon={MdDiamond} size={48} className="text-brand-accent mb-2" />
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
            <Icon icon={MdEmojiEvents} size={48} className="text-brand-accent mb-2" />
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
            <Icon icon={MdTrendingUp} size={48} className="text-brand-accent mb-2" />
            <div className="text-3xl font-bold text-brand-black">
              {courseStats?.quizzesCompleted || 0}
            </div>
            <div className="text-brand-darkGrey">{t('assessmentsCompleted')}</div>
            {courseStats && (
              <div className="text-xs text-brand-darkGrey mt-4">
                {courseStats.lessonsCompleted} {t('lessonsCompleted')} • {courseStats.coursesEnrolled} {t('coursesEnrolled')}
              </div>
            )}
          </div>
        </div>

        {/* Streaks and Referrals Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 dashboard-grid-2">
          {/* Streaks Card */}
          <div className="bg-brand-white rounded-xl shadow-lg p-6 border-2 border-brand-accent">
            <h3 className="text-xl font-bold text-brand-black mb-4 flex items-center gap-2">
              <Icon icon={MdLocalFireDepartment} size={24} className="text-brand-accent" />
              {t('streaks')}
            </h3>
            <div className="space-y-4">
              {streaks && streaks.length > 0 ? (
                streaks.map((streak, index) => {
                  const labelMap: Record<string, string> = {
                    daily_login: t('dailyLoginStreak'),
                    win: t('winStreak'),
                  };
                  const streakLabel = labelMap[streak.type] ?? streak.type.replace('_', ' ');

                  return (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-brand-black">
                          {streakLabel}
                        </div>
                        <div className="text-sm text-brand-darkGrey">
                          Legjobb: {streak.bestCount}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-brand-accent">
                        {streak.count}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-brand-darkGrey text-center py-4">
                  <p className="mb-3">{t('noActiveStreaks')}</p>
                  <LocaleLink
                    href="/courses"
                    className="inline-block bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors text-sm"
                  >
                    <Icon icon={MdMenuBook} size={16} className="inline-block mr-1" />
                    {t('enrollInCourse')}
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
