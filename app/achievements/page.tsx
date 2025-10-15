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
import Link from 'next/link';
import { Trophy, Lock, CheckCircle, ChevronLeft, Sparkles } from 'lucide-react';

interface Achievement {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  xp: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
    percentage: number;
  };
}

interface AchievementsData {
  achievements: Achievement[];
  stats: {
    total: number;
    unlocked: number;
    percentage: number;
    totalPoints: number;
    earnedPoints: number;
    totalXP: number;
    earnedXP: number;
  };
}

const TIER_COLORS = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600',
};

const TIER_TEXT_COLORS = {
  bronze: 'text-amber-700',
  silver: 'text-gray-700',
  gold: 'text-yellow-700',
  platinum: 'text-purple-700',
};

export default function AchievementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [achievementsData, setAchievementsData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const fetchAchievements = async () => {
      try {
        const playerId = (session.user as any).playerId;
        const response = await fetch(`/api/players/${playerId}/achievements`);
        
        if (!response.ok) {
          throw new Error('Failed to load achievements');
        }
        
        const data = await response.json();
        setAchievementsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [session, status, router]);

  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading achievements...</div>
      </div>
    );
  }

  // Error state
  if (error || !achievementsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Achievements</h2>
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

  const { achievements, stats } = achievementsData;
  const categories = ['all', ...new Set(achievements.map(a => a.category))];
  
  const filteredAchievements = filterCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === filterCategory);

  const unlockedAchievements = filteredAchievements.filter(a => a.isUnlocked);
  const lockedAchievements = filteredAchievements.filter(a => !a.isUnlocked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy className="w-10 h-10" />
                Achievements
              </h1>
              <p className="text-white/80 mt-1">Track your progress and unlock rewards</p>
            </div>
            <Link
              href="/dashboard"
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-medium flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="text-purple-600 text-3xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.unlocked}/{stats.total}
            </div>
            <div className="text-gray-600">Unlocked</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="text-yellow-600 text-3xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.percentage}%
            </div>
            <div className="text-gray-600">Complete</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="text-indigo-600 text-3xl mb-2">💎</div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.earnedPoints.toLocaleString()}
            </div>
            <div className="text-gray-600">Points Earned</div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <div className="text-pink-600 text-3xl mb-2">⚡</div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.earnedXP.toLocaleString()}
            </div>
            <div className="text-gray-600">XP Earned</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  filterCategory === category
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
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
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-7 h-7" />
              Unlocked ({unlockedAchievements.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedAchievements.map(achievement => (
                <div
                  key={achievement._id}
                  className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg font-bold text-sm">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Unlocked
                  </div>
                  
                  <div className="text-6xl mb-4">{achievement.icon}</div>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${TIER_COLORS[achievement.tier]} text-white`}>
                    {achievement.tier.toUpperCase()}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {achievement.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-600 font-bold">
                      💎 {achievement.points} pts
                    </span>
                    <span className="text-indigo-600 font-bold">
                      ⚡ {achievement.xp} XP
                    </span>
                    {achievement.unlockedAt && (
                      <span className="text-gray-500 text-xs">
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
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-7 h-7" />
              Locked ({lockedAchievements.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedAchievements.map(achievement => (
                <div
                  key={achievement._id}
                  className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 border-2 border-gray-300 relative"
                >
                  <div className="absolute top-0 right-0 bg-gray-400 text-white px-3 py-1 rounded-bl-lg font-bold text-sm">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Locked
                  </div>
                  
                  <div className="text-6xl mb-4 opacity-40">{achievement.icon}</div>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r ${TIER_COLORS[achievement.tier]} text-white opacity-60`}>
                    {achievement.tier.toUpperCase()}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {achievement.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {achievement.description}
                  </p>
                  
                  {achievement.progress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress.current} / {achievement.progress.target}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all"
                          style={{ width: `${achievement.progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-600 font-bold">
                      💎 {achievement.points} pts
                    </span>
                    <span className="text-indigo-600 font-bold">
                      ⚡ {achievement.xp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredAchievements.length === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center">
            <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No achievements in this category
            </h3>
            <p className="text-gray-600">
              Try selecting a different category or start playing games to unlock achievements!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
