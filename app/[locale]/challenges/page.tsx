'use client';

/**
 * Daily Challenges Page
 * 
 * Why: Engage players with time-limited daily objectives for bonus rewards
 * What: Shows available daily challenges with progress tracking and rewards
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Calendar, ChevronLeft, Target, Clock, Gift, CheckCircle, RefreshCw } from 'lucide-react';
import { LocaleLink } from '@/components/LocaleLink';

interface Challenge {
  _id: string;
  name: string;
  description: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  targetValue: number;
  currentProgress: number;
  rewards: {
    points: number;
    xp: number;
  };
  expiresAt: string;
  isCompleted: boolean;
  completedAt?: string;
}

const DIFFICULTY_COLORS = {
  easy: 'from-green-500 to-green-600',
  medium: 'from-yellow-500 to-yellow-600',
  hard: 'from-orange-500 to-orange-600',
  expert: 'from-red-500 to-red-600',
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DIFFICULTY_TEXT = {
  easy: 'text-green-700',
  medium: 'text-yellow-700',
  hard: 'text-orange-700',
  expert: 'text-red-700',
};

export default function ChallengesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('challenges');
  const tCommon = useTranslations('common');
  const tDashboard = useTranslations('dashboard');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

    const fetchChallenges = async () => {
      try {
        const user = session.user as { id?: string; playerId?: string };
        const playerId = user.playerId || user.id;
        
        // Why: Add timeout to prevent infinite loading
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const response = await fetch(`/api/challenges?playerId=${playerId}&t=${Date.now()}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch challenges:', response.status, errorText);
          throw new Error(`Failed to load challenges: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Challenges loaded:', data);
        setChallenges(data.challenges || []);
      } catch (err) {
        console.error('Challenge fetch error:', err);
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out. Please try again.');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load challenges');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
    
    // Why: Refresh challenges when user returns to page (after playing a game)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible, refreshing challenges...');
        fetchChallenges();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Why: Also refresh on window focus (user returns from another tab/window)
    const handleFocus = () => {
      console.log('Window focused, refreshing challenges...');
      fetchChallenges();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Why: Cleanup event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [session, status, router, locale]);

  const getTimeRemaining = (expiresAt: string): string => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-brand-white text-2xl">{t('loading')}</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-shell flex items-center justify-center p-4">
        <div className="page-card p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
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

  const activeChallenges = challenges.filter(c => !c.isCompleted);
  const completedChallenges = challenges.filter(c => c.isCompleted);

  return (
    <div className="page-shell">
      {/* Header */}
      <header className="page-header">
        <div className="page-container py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-brand-white flex items-center gap-3">
                <Calendar className="w-10 h-10" />
                {t('dailyChallenges')}
              </h1>
              <p className="text-brand-white/80 mt-1">{t('description')}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLoading(true);
                  const fetchChallenges = async () => {
                    try {
                      if (!session) return;
                      const user = session.user as { id?: string; playerId?: string };
                      const playerId = user.playerId || user.id;
                      const response = await fetch(`/api/challenges?playerId=${playerId}&t=${Date.now()}`, {
                        cache: 'no-store',
                      });
                      if (response.ok) {
                        const data = await response.json();
                        setChallenges(data.challenges || []);
                      }
                    } catch (err) {
                      console.error('Refresh error:', err);
                    } finally {
                      setLoading(false);
                    }
                  };
                  fetchChallenges();
                }}
                className="page-button-secondary border-2 border-brand-accent flex items-center gap-2"
                title={t('refreshChallenges')}
              >
                <RefreshCw className="w-5 h-5" />
                {tCommon('refresh')}
              </button>
              <LocaleLink
                href="/dashboard"
                className="page-button-secondary border-2 border-brand-accent flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                {tCommon('dashboard')}
              </LocaleLink>
            </div>
          </div>
        </div>
      </header>

      <main className="page-container py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="page-card p-6">
            <div className="text-brand-accent text-3xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-brand-black">
              {activeChallenges.length}
            </div>
            <div className="text-brand-darkGrey">{t('active')}</div>
          </div>
          
          <div className="page-card p-6">
            <div className="text-brand-accent text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-brand-black">
              {completedChallenges.length}
            </div>
            <div className="text-brand-darkGrey">{t('completed')}</div>
          </div>
          
          <div className="page-card p-6">
            <div className="text-brand-accent text-3xl mb-2">💎</div>
            <div className="text-3xl font-bold text-brand-black">
              {completedChallenges.reduce((sum, c) => sum + c.rewards.points, 0).toLocaleString()}
            </div>
            <div className="text-brand-darkGrey">{t('points')}</div>
          </div>
        </div>

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-white mb-4 flex items-center gap-2">
              <Target className="w-7 h-7" />
              {t('active')} {t('title')} ({activeChallenges.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeChallenges.map(challenge => {
                const progress = getProgressPercentage(challenge.currentProgress, challenge.targetValue);
                const timeLeft = getTimeRemaining(challenge.expiresAt);
                
                return (
                  <div
                    key={challenge._id}
                    className="page-card p-6 relative overflow-hidden"
                  >
                    {/* Difficulty Badge */}
                    <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-lg bg-gradient-to-r ${DIFFICULTY_COLORS[challenge.difficulty]} text-white font-bold text-sm`}>
                      {challenge.difficulty.toUpperCase()}
                    </div>
                    
                    {/* Time Remaining */}
                    <div className="flex items-center gap-2 text-brand-darkGrey mb-4 mt-6">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{timeLeft} remaining</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-brand-black mb-2">
                      {challenge.name}
                    </h3>
                    <p className="text-brand-darkGrey text-sm mb-4">
                      {challenge.description}
                    </p>
                    
                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-brand-darkGrey mb-2">
                        <span>Progress</span>
                        <span className="font-bold">{challenge.currentProgress} / {challenge.targetValue}</span>
                      </div>
                      <div className="bg-brand-darkGrey/20 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full transition-all bg-gradient-to-r ${DIFFICULTY_COLORS[challenge.difficulty]}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Rewards */}
                    <div className="flex items-center justify-between pt-4 border-t border-brand-darkGrey/20">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Gift className="w-4 h-4 text-brand-accent" />
                          <span className="font-bold text-brand-accent">{challenge.rewards.points} pts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-brand-darkGrey">⚡</span>
                          <span className="font-bold text-brand-darkGrey">{challenge.rewards.xp} XP</span>
                        </div>
                      </div>
                      
                      <LocaleLink href="/games" className="page-button-primary text-sm">
                        Play Now
                      </LocaleLink>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-7 h-7" />
              {t('completed')} ({completedChallenges.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedChallenges.map(challenge => (
                <div
                  key={challenge._id}
                  className="page-card p-6 border-2 border-brand-accent relative"
                >
                  <div className="absolute top-0 right-0 bg-brand-accent text-brand-black px-4 py-1 rounded-bl-lg font-bold text-sm">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    COMPLETE
                  </div>
                  
                  <h3 className="text-xl font-bold text-brand-black mb-2 mt-6">
                    {challenge.name}
                  </h3>
                  <p className="text-brand-darkGrey text-sm mb-4">
                    {challenge.description}
                  </p>
                  
                  {/* Rewards Earned */}
                  <div className="flex items-center gap-4 pt-4 border-t border-brand-darkGrey/20">
                    <div className="flex items-center gap-1">
                      <Gift className="w-4 h-4 text-brand-accent" />
                      <span className="font-bold text-brand-accent">+{challenge.rewards.points} pts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-brand-darkGrey">⚡</span>
                      <span className="font-bold text-brand-darkGrey">+{challenge.rewards.xp} XP</span>
                    </div>
                  </div>
                  
                  {challenge.completedAt && (
                    <p className="text-xs text-brand-darkGrey mt-2">
                      Completed {new Date(challenge.completedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {challenges.length === 0 && (
          <div className="page-card p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-brand-black mb-2">
              {t('noChallenges')}
            </h3>
            <p className="text-brand-darkGrey mb-6">
              {t('checkBackLater')}
            </p>
            <LocaleLink
              href="/games"
              className="inline-block page-button-primary"
            >
              {tCommon('games')}
            </LocaleLink>
          </div>
        )}
      </main>
    </div>
  );
}
