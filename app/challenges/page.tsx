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
import Link from 'next/link';
import { Calendar, ChevronLeft, Target, Clock, Gift, CheckCircle, RefreshCw } from 'lucide-react';

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
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const fetchChallenges = async () => {
      try {
        const playerId = session.user.id;
        
        const response = await fetch(`/api/challenges?playerId=${playerId}&t=${Date.now()}`, {
          cache: 'no-store',
        });
        
        if (!response.ok) {
          console.error('Failed to fetch challenges:', response.status);
          throw new Error('Failed to load challenges');
        }
        
        const data = await response.json();
        console.log('Challenges loaded:', data);
        setChallenges(data.challenges || []);
      } catch (err) {
        console.error('Challenge fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
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
  }, [session, status, router]);

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
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading challenges...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Challenges</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const activeChallenges = challenges.filter(c => !c.isCompleted);
  const completedChallenges = challenges.filter(c => c.isCompleted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Calendar className="w-10 h-10" />
                Daily Challenges
              </h1>
              <p className="text-white/80 mt-1">Complete challenges for bonus rewards</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLoading(true);
                  const fetchChallenges = async () => {
                    try {
                      if (!session) return;
                      const playerId = session.user.id;
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
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-medium flex items-center gap-2"
                title="Refresh challenges"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh
              </button>
              <Link
                href="/dashboard"
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-medium flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="text-green-600 text-3xl mb-2">🎯</div>
            <div className="text-3xl font-bold text-gray-900">
              {activeChallenges.length}
            </div>
            <div className="text-gray-600">Active</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="text-blue-600 text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-gray-900">
              {completedChallenges.length}
            </div>
            <div className="text-gray-600">Completed Today</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="text-yellow-600 text-3xl mb-2">💎</div>
            <div className="text-3xl font-bold text-gray-900">
              {completedChallenges.reduce((sum, c) => sum + c.rewards.points, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Points Earned</div>
          </div>
        </div>

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-7 h-7" />
              Active Challenges ({activeChallenges.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeChallenges.map(challenge => {
                const progress = getProgressPercentage(challenge.currentProgress, challenge.targetValue);
                const timeLeft = getTimeRemaining(challenge.expiresAt);
                
                return (
                  <div
                    key={challenge._id}
                    className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
                  >
                    {/* Difficulty Badge */}
                    <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-lg bg-gradient-to-r ${DIFFICULTY_COLORS[challenge.difficulty]} text-white font-bold text-sm`}>
                      {challenge.difficulty.toUpperCase()}
                    </div>
                    
                    {/* Time Remaining */}
                    <div className="flex items-center gap-2 text-orange-600 mb-4 mt-6">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{timeLeft} remaining</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {challenge.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {challenge.description}
                    </p>
                    
                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span className="font-bold">{challenge.currentProgress} / {challenge.targetValue}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full transition-all bg-gradient-to-r ${DIFFICULTY_COLORS[challenge.difficulty]}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Rewards */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Gift className="w-4 h-4 text-purple-600" />
                          <span className="font-bold text-purple-600">{challenge.rewards.points} pts</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-indigo-600">⚡</span>
                          <span className="font-bold text-indigo-600">{challenge.rewards.xp} XP</span>
                        </div>
                      </div>
                      
                      <Link
                        href="/games"
                        className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all text-sm"
                      >
                        Play Now
                      </Link>
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
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-7 h-7" />
              Completed Today ({completedChallenges.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedChallenges.map(challenge => (
                <div
                  key={challenge._id}
                  className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 border-2 border-green-500 relative"
                >
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-lg font-bold text-sm">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    COMPLETE
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 mt-6">
                    {challenge.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {challenge.description}
                  </p>
                  
                  {/* Rewards Earned */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <Gift className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-purple-600">+{challenge.rewards.points} pts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-indigo-600">⚡</span>
                      <span className="font-bold text-indigo-600">+{challenge.rewards.xp} XP</span>
                    </div>
                  </div>
                  
                  {challenge.completedAt && (
                    <p className="text-xs text-gray-500 mt-2">
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
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Challenges Available
            </h3>
            <p className="text-gray-600 mb-6">
              Daily challenges refresh every 24 hours. Check back tomorrow!
            </p>
            <Link
              href="/games"
              className="inline-block bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg font-bold hover:from-green-700 hover:to-teal-700 transition-all"
            >
              Play Games
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
