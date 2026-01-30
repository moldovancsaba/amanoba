/**
 * Admin Challenges Management Page
 * 
 * What: Manage daily challenges in the platform
 * Why: Allows admins to view and manage daily challenges
 */

'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Calendar,
  Target,
} from 'lucide-react';

interface Challenge {
  _id: string;
  date: string;
  type: string;
  difficulty: string;
  title: string;
  description: string;
  requirement: {
    target: number;
  };
  rewards: {
    points: number;
    xp: number;
  };
  availability: {
    isActive: boolean;
    startTime: string;
    endTime: string;
  };
  completions: {
    total: number;
    percentage: number;
  };
}

export default function AdminChallengesPage() {
  const _locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  useEffect(() => {
    fetchChallenges();
  }, [dateFilter, difficultyFilter]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateFilter) {
        params.append('date', dateFilter);
      }
      if (difficultyFilter !== 'all') {
        params.append('difficulty', difficultyFilter);
      }

      const response = await fetch(`/api/admin/challenges?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setChallenges(data.challenges || []);
      }
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">{tCommon('loading')}</div>
      </div>
    );
  }

  const difficultyColors: Record<string, string> = {
    easy: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    hard: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('challengesManagement')}</h1>
          <p className="text-gray-400">{t('challengesDescription')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">{t('allDifficulties')}</option>
          <option value="easy">{t('easy')}</option>
          <option value="medium">{t('medium')}</option>
          <option value="hard">{t('hard')}</option>
        </select>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {challenges.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {tCommon('noDataFound')}
          </div>
        ) : (
          challenges.map((challenge) => (
            <div
              key={challenge._id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-white font-bold text-lg">{challenge.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[challenge.difficulty] || difficultyColors.easy}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">{tCommon('type')}: </span>
                      <span className="text-white capitalize">{challenge.type.replace(/_/g, ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Cél: </span>
                      <span className="text-white font-bold">{challenge.requirement.target}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">{t('rewards')}: </span>
                      <span className="text-white">
                        {challenge.rewards.points} pont, {challenge.rewards.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm mb-1">{t('completionRate')}</div>
                  <div className="text-2xl font-bold text-green-400">
                    {challenge.completions.percentage.toFixed(1)}%
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {challenge.completions.total} {t('players')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-500">
                  {new Date(challenge.availability.startTime).toLocaleString('hu-HU')} -{' '}
                  {new Date(challenge.availability.endTime).toLocaleString('hu-HU')}
                </div>
                <div className="flex items-center gap-2">
                  {challenge.availability.isActive ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                      {tCommon('active')}
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
                      {tCommon("inactive")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{t('totalChallenges')}</div>
          <div className="text-2xl font-bold text-white">{challenges.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{tCommon('active')}</div>
          <div className="text-2xl font-bold text-green-400">
            {challenges.filter((c) => c.availability.isActive).length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{t('avgCompletion')}</div>
          <div className="text-2xl font-bold text-yellow-400">
            {challenges.length > 0
              ? (
                  challenges.reduce((sum, c) => sum + c.completions.percentage, 0) /
                  challenges.length
                ).toFixed(1)
              : 0}
            %
          </div>
        </div>
      </div>
    </div>
  );
}
