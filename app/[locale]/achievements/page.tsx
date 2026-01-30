'use client';

/**
 * Achievements Page
 * 
 * Why: Display player achievements with beautiful UI instead of raw JSON
 * What: Shows unlocked and locked achievements with progress tracking
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Lock, CheckCircle, ChevronLeft, Sparkles } from 'lucide-react';
import { LocaleLink } from '@/components/LocaleLink';
import Icon, { MdEmojiEvents, MdSentimentDissatisfied, MdDiamond, MdBolt, MdStar } from '@/components/Icon';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  xp: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  progressPercentage?: number;
}

interface AchievementsData {
  achievements: Achievement[];
  stats: {
    total: number;
    unlocked: number;
    percentage: number;
  };
}

const TIER_COLORS = {
  bronze: 'from-stone-500 to-stone-700',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-slate-300 to-slate-500',
  platinum: 'from-purple-400 to-purple-600',
};

export default function AchievementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('achievements');
  const tCommon = useTranslations('common');
  const tDashboard = useTranslations('dashboard');
  const [achievementsData, setAchievementsData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

    const fetchAchievements = async () => {
      try {
        const user = session.user as { id?: string; playerId?: string };
        const playerId = user.playerId || user.id;
        
        // Why: Add timeout to prevent infinite loading
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const response = await fetch(`/api/players/${playerId}/achievements?t=${Date.now()}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch achievements:', response.status, errorText);
          throw new Error(`Failed to load achievements: ${response.status}`);
        }
        
        const data = await response.json();
        setAchievementsData(data);
      } catch (err) {
        console.error('Achievement fetch error:', err);
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load achievements');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [session, status, router, locale]);

  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-brand-white text-2xl">{t('loading')}</div>
      </div>
    );
  }

  // Error state
  if (error || !achievementsData) {
    return (
      <div className="page-shell flex items-center justify-center p-4">
        <div className="page-card p-8 max-w-md w-full text-center">
          <Icon icon={MdSentimentDissatisfied} size={64} className="text-brand-darkGrey mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-brand-black mb-4">{t('unableToLoad')}</h2>
          <p className="text-brand-darkGrey mb-6">{error}</p>
          <LocaleLink
            href="/dashboard"
            className="page-button-primary inline-block"
          >
            {tDashboard('backToDashboard')}
          </LocaleLink>
        </div>
      </div>
    );
  }

  const { achievements, stats } = achievementsData;
  const categories = ['all', ...new Set(achievements.map(a => a.category))];
  
  const filteredAchievements = filterCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === filterCategory);

  const unlockedAchievements = filteredAchievements.filter(a => a.isUnlocked);
  const lockedAchievements = filteredAchievements.filter(a => !a.isUnlocked);

  return (
    <div className="page-shell">
      {/* Header */}
      <header className="page-header">
        <div className="page-container py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-brand-white flex items-center gap-3">
                <Icon icon={MdEmojiEvents} size={40} />
                {t('title')}
              </h1>
              <p className="text-brand-white/80 mt-1">{t('description')}</p>
            </div>
            <LocaleLink
              href="/dashboard"
              className="page-button-secondary border-2 border-brand-darkGrey flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              {tCommon('dashboard')}
            </LocaleLink>
          </div>
        </div>
      </header>

      <main className="page-container py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="page-card p-6">
            <Icon icon={MdEmojiEvents} size={36} className="text-brand-darkGrey mb-2" />
            <div className="text-3xl font-bold text-brand-black">
              {stats.unlocked}/{stats.total}
            </div>
            <div className="text-brand-darkGrey">{t('unlockedCount')}</div>
          </div>
          
          <div className="page-card p-6">
            <Icon icon={MdStar} size={36} className="text-brand-darkGrey mb-2" />
            <div className="text-3xl font-bold text-brand-black">
              {stats.percentage}%
            </div>
            <div className="text-brand-darkGrey">{t('complete')}</div>
          </div>
          
          <div className="page-card p-6">
            <Icon icon={MdDiamond} size={36} className="text-brand-darkGrey mb-2" />
            <div className="text-3xl font-bold text-brand-black">
              {achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.points, 0).toLocaleString()}
            </div>
            <div className="text-brand-darkGrey">{t('pointsEarned')}</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="page-card p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize border-2 ${
                  filterCategory === category
                    ? 'bg-brand-accent text-brand-black border-brand-accent shadow-md'
                    : 'bg-brand-white text-brand-darkGrey border-brand-darkGrey/20 hover:border-brand-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-7 h-7" />
              {t('unlocked')} ({unlockedAchievements.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="page-card p-6 border-2 border-brand-accent relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-brand-accent text-brand-black px-3 py-1 rounded-bl-lg font-bold text-sm">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    {t('unlocked')}
                  </div>
                  
                  <div className="text-6xl mb-4">{achievement.icon}</div>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${TIER_COLORS[achievement.tier]} text-white`}>
                    {achievement.tier.toUpperCase()}
                  </div>
                  
                  <h3 className="text-xl font-bold text-brand-black mb-2">
                    {achievement.name}
                  </h3>
                  <p className="text-brand-darkGrey text-sm mb-4">
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-accent font-bold flex items-center gap-1">
                      <Icon icon={MdDiamond} size={16} />
                      {achievement.points} pts
                    </span>
                    <span className="text-brand-darkGrey font-bold flex items-center gap-1">
                      <Icon icon={MdBolt} size={16} />
                      {achievement.xp} XP
                    </span>
                    {achievement.unlockedAt && (
                      <span className="text-brand-darkGrey text-xs">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-brand-white mb-4 flex items-center gap-2">
              <Lock className="w-7 h-7" />
              {t('locked')} ({lockedAchievements.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="page-card p-6 border-2 border-brand-darkGrey/30 relative"
                >
                  <div className="absolute top-0 right-0 bg-brand-darkGrey text-brand-white px-3 py-1 rounded-bl-lg font-bold text-sm">
                    <Lock className="w-4 h-4 inline mr-1" />
                    {t('locked')}
                  </div>
                  
                  <div className="text-6xl mb-4 opacity-40">{achievement.icon}</div>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${TIER_COLORS[achievement.tier]} text-white opacity-60`}>
                    {achievement.tier.toUpperCase()}
                  </div>
                  
                  <h3 className="text-xl font-bold text-brand-black mb-2">
                    {achievement.name}
                  </h3>
                  <p className="text-brand-darkGrey text-sm mb-4">
                    {achievement.description}
                  </p>
                  
                  {achievement.progressPercentage !== undefined && achievement.progressPercentage > 0 && !achievement.isUnlocked && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-brand-darkGrey mb-1">
                        <span>Progress</span>
                        <span>{achievement.progressPercentage}%</span>
                      </div>
                      <div className="bg-brand-darkGrey/20 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all"
                          style={{ width: `${achievement.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-accent font-bold">
                      💎 {achievement.points} pts
                    </span>
                    <span className="text-brand-darkGrey font-bold">
                      <Icon icon={MdBolt} size={16} className="inline mr-1" />
                      {achievement.xp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredAchievements.length === 0 && (
          <div className="page-card p-12 text-center">
            <Sparkles className="w-16 h-16 text-brand-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-brand-black mb-2">
              {t('noAchievements')}
            </h3>
            <p className="text-brand-darkGrey">
              {t('checkBackLater')}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
