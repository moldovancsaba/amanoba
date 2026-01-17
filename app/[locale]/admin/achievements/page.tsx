/**
 * Admin Achievements Management Page
 * 
 * What: Manage all achievements in the platform
 * Why: Allows admins to view, create, edit, and configure achievements
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Trophy,
  Filter,
} from 'lucide-react';

interface Achievement {
  _id: string;
  name: string;
  description: string;
  category: string;
  tier: string;
  icon: string;
  isHidden: boolean;
  criteria: {
    type: string;
    target: number;
  };
  rewards: {
    points: number;
    xp: number;
  };
  metadata: {
    isActive: boolean;
    unlockCount: number;
  };
}

export default function AdminAchievementsPage() {
  const locale = useLocale();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchAchievements();
  }, [search, categoryFilter]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/achievements?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setAchievements(data.achievements || []);
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">Loading achievements...</div>
      </div>
    );
  }

  const tierColors: Record<string, string> = {
    bronze: 'bg-orange-500/20 text-orange-400',
    silver: 'bg-gray-400/20 text-gray-300',
    gold: 'bg-yellow-500/20 text-yellow-400',
    platinum: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Achievements Management</h1>
          <p className="text-gray-400">Manage all achievements in the platform</p>
        </div>
        <Link
          href={`/${locale}/admin/achievements/new`}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Achievement
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search achievements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Categories</option>
          <option value="gameplay">Gameplay</option>
          <option value="progression">Progression</option>
          <option value="social">Social</option>
          <option value="collection">Collection</option>
          <option value="mastery">Mastery</option>
          <option value="streak">Streak</option>
          <option value="special">Special</option>
        </select>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            No achievements found
          </div>
        ) : (
          achievements.map((achievement) => (
            <div
              key={achievement._id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{achievement.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${tierColors[achievement.tier] || tierColors.bronze}`}>
                      {achievement.tier}
                    </span>
                  </div>
                </div>
                {achievement.isHidden && (
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                    Hidden
                  </span>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white capitalize">{achievement.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Criteria:</span>
                  <span className="text-white">
                    {achievement.criteria.type.replace(/_/g, ' ')} ({achievement.criteria.target})
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Rewards:</span>
                  <span className="text-white">
                    {achievement.rewards.points} pts, {achievement.rewards.xp} XP
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Unlocked:</span>
                  <span className="text-white">{achievement.metadata.unlockCount} players</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-700">
                <Link
                  href={`/${locale}/admin/achievements/${achievement._id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  className="p-2 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors"
                  title="Delete achievement"
                >
                  <Trash2 className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Total Achievements</div>
          <div className="text-2xl font-bold text-white">{achievements.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Active</div>
          <div className="text-2xl font-bold text-green-400">
            {achievements.filter((a) => a.metadata.isActive).length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Total Unlocks</div>
          <div className="text-2xl font-bold text-yellow-400">
            {achievements.reduce((sum, a) => sum + a.metadata.unlockCount, 0)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Hidden</div>
          <div className="text-2xl font-bold text-blue-400">
            {achievements.filter((a) => a.isHidden).length}
          </div>
        </div>
      </div>
    </div>
  );
}
