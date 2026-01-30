/**
 * Admin Quests Page
 * 
 * What: Quest management interface for admins
 * Why: Allows admins to view and manage quests
 */

'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Scroll,
  Search,
  Award,
  Loader2,
} from 'lucide-react';

interface Quest {
  _id: string;
  title: string;
  description: string;
  category: string;
  totalSteps: number;
  rewards: {
    completionPoints: number;
    completionXP: number;
  };
  requirements: {
    isPremiumOnly: boolean;
  };
  availability: {
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    isRepeatable: boolean;
  };
  statistics: {
    totalStarted: number;
    totalCompleted: number;
    completionRate: number;
  };
  createdAt: string;
}

export default function AdminQuestsPage() {
  const _locale = useLocale();
  const _t = useTranslations('admin');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchQuests();
  }, [statusFilter, search]);

  const fetchQuests = async () => {
    try {
      setLoading(true);
      // Note: Admin quests API endpoint needs to be created
      // For now, using a placeholder that will show "Coming Soon"
      const response = await fetch('/api/admin/quests');
      const data = await response.json();

      if (data.success) {
        setQuests(data.quests || []);
      }
    } catch (error) {
      console.error('Failed to fetch quests:', error);
      // If API doesn't exist, show empty state with message
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Quest Management</h1>
          <p className="text-gray-400">View and manage quests on the platform</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search quests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Quests</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Quests List */}
      {quests.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
          <Scroll className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Quests Found</h3>
          <p className="text-gray-400 mb-4">
            Quest management API is not yet implemented.
          </p>
          <p className="text-gray-500 text-sm">
            Quests feature is currently disabled in feature flags. Enable it in Settings → Feature Flags to use quests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map((quest) => (
            <div
              key={quest._id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{quest.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{quest.description}</p>
                </div>
                {quest.availability.isActive ? (
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">Active</span>
                ) : (
                  <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded">Inactive</span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Scroll className="w-4 h-4" />
                  <span>{quest.totalSteps} steps</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Award className="w-4 h-4" />
                  <span>{quest.rewards.completionPoints} points</span>
                </div>
                {quest.requirements.isPremiumOnly && (
                  <div className="text-xs text-yellow-400">Premium Only</div>
                )}
              </div>

              {quest.statistics && (
                <div className="pt-4 border-t border-gray-700 text-xs text-gray-400">
                  <div>Started: {quest.statistics.totalStarted}</div>
                  <div>Completed: {quest.statistics.totalCompleted}</div>
                  <div>Rate: {quest.statistics.completionRate.toFixed(1)}%</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
