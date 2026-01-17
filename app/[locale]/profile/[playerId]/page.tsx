/**
 * Player Profile Page
 * 
 * Comprehensive public profile displaying player stats, achievements,
 * recent activity, and progression. Features tabbed navigation and
 * responsive design.
 */

'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PlayerAvatar from '@/components/PlayerAvatar';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  Award, 
  Zap,
  Calendar,
  Star,
  Flame,
  Coins
} from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface ProfileData {
  player: {
    id: string;
    displayName: string;
    profilePicture?: string;
    isPremium: boolean;
    createdAt: string;
    lastSeenAt: string;
  };
  progression: {
    level: number;
    currentXP: number;
    xpToNextLevel: number;
    totalXP: number;
    title: string;
    nextTitle: string | null;
  };
  statistics: {
    totalGamesPlayed: number;
    totalWins: number;
    totalLosses: number;
    totalDraws: number;
    winRate: number;
    totalPlayTime: number;
    averageSessionTime: number;
    highestScore: number;
    perfectGames: number;
  };
  wallet: {
    currentBalance: number;
    lifetimeEarned: number;
    lifetimeSpent: number;
  };
  achievements: {
    total: number;
    unlocked: number;
    progress: number;
    featured: Array<{
      id: string;
      name: string;
      description: string;
      tier: string;
      icon?: string;
      unlockedAt: string;
    }>;
  };
  streaks: {
    win: {
      current: number;
      longest: number;
      lastActivity: string;
    };
    daily: {
      current: number;
      longest: number;
      lastActivity: string;
    };
  };
  recentActivity: Array<{
    gameId: string;
    gameName: string;
    gameIcon?: string;
    outcome: string;
    score: number;
    pointsEarned: number;
    playedAt: string;
    duration: number;
  }>;
}

export default function ProfilePage({ params }: { params: Promise<{ playerId: string }> }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity'>('overview');
  const [playerId, setPlayerId] = useState<string | null>(null);

  // Unwrap async params
  useEffect(() => {
    params.then((p) => setPlayerId(p.playerId));
  }, [params]);

  // Fetch profile data
  const { data, isLoading, error } = useQuery<{ success: boolean; profile: ProfileData }>({
    queryKey: ['profile', playerId],
    queryFn: async () => {
      if (!playerId) throw new Error('No player ID');
      const res = await fetch(`/api/profile/${playerId}`);
      return res.json();
    },
    enabled: !!playerId,
  });

  if (isLoading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-brand-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-brand-white text-xl">Failed to load profile</div>
      </div>
    );
  }

  const profile = data.profile;
  const xpProgress = (profile.progression.currentXP / profile.progression.xpToNextLevel) * 100;

  return (
    <div className="page-shell p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="page-card-dark rounded-2xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <PlayerAvatar
              playerId={profile.player.id}
              displayName={profile.player.displayName}
              profilePicture={profile.player.profilePicture}
              level={profile.progression.level}
              isPremium={profile.player.isPremium}
              size="xl"
              clickable={false}
            />

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h1 className="text-4xl font-bold text-white">{profile.player.displayName}</h1>
                {profile.player.isPremium && (
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold">
                    PREMIUM
                  </span>
                )}
              </div>
              <p className="text-2xl text-brand-accent font-semibold mb-4">{profile.progression.title}</p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-brand-black/20 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Level</div>
                  <div className="text-white text-2xl font-bold">{profile.progression.level}</div>
                </div>
                <div className="bg-brand-black/20 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Games Played</div>
                  <div className="text-white text-2xl font-bold">{profile.statistics.totalGamesPlayed}</div>
                </div>
                <div className="bg-brand-black/20 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Win Rate</div>
                  <div className="text-white text-2xl font-bold">{profile.statistics.winRate}%</div>
                </div>
                <div className="bg-brand-black/20 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Achievements</div>
                  <div className="text-white text-2xl font-bold">
                    {profile.achievements.unlocked}/{profile.achievements.total}
                  </div>
                </div>
              </div>

              {/* XP Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>Level {profile.progression.level}</span>
                  <span>{profile.progression.currentXP} / {profile.progression.xpToNextLevel} XP</span>
                </div>
                <div className="h-3 bg-brand-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-accent transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                {profile.progression.nextTitle && (
                  <p className="text-gray-400 text-sm mt-2">
                    Next title: {profile.progression.nextTitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'activity', label: 'Activity', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'achievements' | 'activity')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-accent text-brand-black'
                    : 'bg-brand-darkGrey text-brand-white/70 hover:bg-brand-black/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Streaks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="page-card-dark p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Win Streak</h3>
                      <p className="text-gray-400 text-sm">Current winning streak</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-400 text-sm">Current</div>
                      <div className="text-3xl font-bold text-orange-400">
                        {profile.streaks.win.current}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Best</div>
                      <div className="text-3xl font-bold text-orange-400">
                        {profile.streaks.win.longest}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="page-card-dark p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Daily Streak</h3>
                      <p className="text-gray-400 text-sm">Consecutive login days</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-400 text-sm">Current</div>
                      <div className="text-3xl font-bold text-green-400">
                        {profile.streaks.daily.current}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Best</div>
                      <div className="text-3xl font-bold text-green-400">
                        {profile.streaks.daily.longest}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet & Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="page-card-dark p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Points Wallet</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Balance</span>
                      <span className="text-white font-bold">{profile.wallet.currentBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lifetime Earned</span>
                      <span className="text-green-400 font-bold">{profile.wallet.lifetimeEarned.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lifetime Spent</span>
                      <span className="text-red-400 font-bold">{profile.wallet.lifetimeSpent.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="page-card-dark p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Performance</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Highest Score</span>
                      <span className="text-white font-bold">{profile.statistics.highestScore.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Perfect Games</span>
                      <span className="text-yellow-400 font-bold">{profile.statistics.perfectGames}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Session</span>
                      <span className="text-white font-bold">
                        {Math.round(profile.statistics.averageSessionTime / 60)}m
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'achievements' && (
            <div className="page-card-dark p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold text-white">Achievement Progress</h3>
                  <span className="text-indigo-300 text-lg font-semibold">
                    {profile.achievements.progress}% Complete
                  </span>
                </div>
                <div className="h-3 bg-brand-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-accent"
                    style={{ width: `${profile.achievements.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.achievements.featured.map((achievement) => (
                  <div key={achievement.id} className="bg-brand-black/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center text-2xl text-brand-black">
                        {achievement.icon || '🏆'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold">{achievement.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            achievement.tier === 'legendary' ? 'bg-yellow-500 text-yellow-900' :
                            achievement.tier === 'epic' ? 'bg-purple-500 text-white' :
                            achievement.tier === 'rare' ? 'bg-blue-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {achievement.tier.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                        <p className="text-gray-500 text-xs">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="page-card-dark p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-3">
                {profile.recentActivity.map((activity, index) => (
                  <div key={index} className="bg-brand-black/20 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{activity.gameIcon || '🎮'}</div>
                      <div>
                        <h4 className="text-white font-semibold">{activity.gameName}</h4>
                        <p className="text-gray-400 text-sm">
                          {activity.outcome === 'win' ? '🏆 Victory' :
                           activity.outcome === 'loss' ? '❌ Defeat' : '🤝 Draw'}
                          {' · '}Score: {activity.score}
                          {' · '}+{activity.pointsEarned} points
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">
                        {new Date(activity.playedAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {Math.round(activity.duration / 60)}m {activity.duration % 60}s
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
