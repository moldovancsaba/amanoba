/**
 * Admin Surveys Analytics Page
 * 
 * What: View survey response statistics and analytics
 * Why: Allows admins to understand user preferences and needs
 */

'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';

interface QuestionStats {
  question: string;
  type: string;
  answerCounts?: Record<string, number>;
  totalAnswers?: number;
  averageRating?: string;
  totalRatings?: number;
  minRating?: number | null;
  maxRating?: number | null;
}

interface SurveyAnalytics {
  survey: {
    surveyId: string;
    name: string;
    isActive?: boolean;
    isDefault?: boolean;
    description?: string;
    questionCount: number;
  };
  statistics: {
    totalResponses: number;
    completionRate: number;
    averageTimeSpent: number;
    skillLevelDistribution: Array<{ level: string; count: number }>;
    topInterests: Array<{ interest: string; count: number }>;
  };
  questionStats: Record<string, QuestionStats>;
  recentResponses: Array<{
    id: string;
    playerName: string;
    playerEmail: string | null;
    skillLevel: string | null;
    completedAt: string;
    timeSpentSeconds: number | null;
  }>;
}

export default function AdminSurveysPage() {
  const _locale = useLocale();
  const _t = useTranslations('admin');
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/surveys?surveyId=onboarding');
      const data = await response.json();

      if (data.success) {
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch survey analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleToggleSurvey = async (field: 'isActive' | 'isDefault') => {
    if (!analytics?.survey) return;

    try {
      setSaving(true);
      const newValue = !analytics.survey[field];
      const response = await fetch('/api/admin/surveys', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyId: analytics.survey.surveyId,
          [field]: newValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalytics({
          ...analytics,
          survey: {
            ...analytics.survey,
            [field]: newValue,
          },
        });
      } else {
        alert(data.error || 'Failed to update survey settings');
      }
    } catch (error) {
      console.error('Failed to update survey settings:', error);
      alert('Failed to update survey settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-accent mx-auto mb-4" />
          <div className="text-brand-white text-lg">Loading survey analytics...</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-brand-white text-lg">No survey data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Survey Analytics</h1>
          <p className="text-gray-400">View survey response statistics and insights</p>
        </div>
      </div>

      {/* Survey Info */}
      <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{analytics.survey.name}</h2>
            {analytics.survey.description && (
              <p className="text-gray-400 mb-4">{analytics.survey.description}</p>
            )}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Survey ID: {analytics.survey.surveyId}</span>
              <span>Questions: {analytics.survey.questionCount}</span>
            </div>
          </div>
        </div>
        
        {/* Survey Settings Toggles */}
        <div className="mt-4 pt-4 border-t border-brand-accent/30 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Enable for New Users</h3>
              <p className="text-gray-400 text-sm">
                {analytics.survey.isDefault ? 'Survey will be shown to new users' : 'Survey will not be shown to new users'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={analytics.survey.isDefault || false}
                onChange={() => handleToggleSurvey('isDefault')}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 disabled:opacity-50"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Survey Active</h3>
              <p className="text-gray-400 text-sm">
                {analytics.survey.isActive ? 'Survey is currently active' : 'Survey is disabled'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={analytics.survey.isActive || false}
                onChange={() => handleToggleSurvey('isActive')}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 disabled:opacity-50"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Responses</h3>
            <Users className="w-5 h-5 text-brand-accent" />
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.statistics.totalResponses}
          </div>
        </div>

        <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Completion Rate</h3>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.statistics.completionRate}%
          </div>
        </div>

        <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Avg. Time Spent</h3>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {formatTime(analytics.statistics.averageTimeSpent)}
          </div>
        </div>

        <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Questions</h3>
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {analytics.survey.questionCount}
          </div>
        </div>
      </div>

      {/* Skill Level Distribution */}
      {analytics.statistics.skillLevelDistribution.length > 0 && (
        <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
          <h2 className="text-xl font-bold text-white mb-4">Skill Level Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.statistics.skillLevelDistribution.map((item) => (
              <div key={item.level} className="bg-brand-black rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1 capitalize">{item.level}</div>
                <div className="text-2xl font-bold text-white">{item.count}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {analytics.statistics.totalResponses > 0
                    ? Math.round((item.count / analytics.statistics.totalResponses) * 100)
                    : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Interests */}
      {analytics.statistics.topInterests.length > 0 && (
        <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
          <h2 className="text-xl font-bold text-white mb-4">Top Interests</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {analytics.statistics.topInterests.map((item) => (
              <div key={item.interest} className="bg-brand-black rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-white mb-1">{item.count}</div>
                <div className="text-xs text-gray-400 capitalize">
                  {item.interest.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Statistics */}
      <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
        <h2 className="text-xl font-bold text-white mb-4">Question Statistics</h2>
        <div className="space-y-6">
          {Object.entries(analytics.questionStats).map(([questionId, stats]) => (
            <div key={questionId} className="bg-brand-black rounded-lg p-4">
              <h3 className="font-bold text-white mb-3">{stats.question}</h3>
              
              {stats.type === 'rating' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Average Rating</span>
                    <span className="text-white font-bold">{stats.averageRating} / 5</span>
                  </div>
                  {stats.minRating !== null && stats.maxRating !== null && (
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Range: {stats.minRating} - {stats.maxRating}</span>
                      <span>{stats.totalRatings} responses</span>
                    </div>
                  )}
                </div>
              )}

              {(stats.type === 'single_choice' || stats.type === 'multiple_choice') &&
                stats.answerCounts && (
                  <div className="space-y-2">
                    {Object.entries(stats.answerCounts)
                      .sort(([, a], [, b]) => b - a)
                      .map(([value, count]) => {
                        const percentage =
                          stats.totalAnswers && stats.totalAnswers > 0
                            ? Math.round((count / stats.totalAnswers) * 100)
                            : 0;
                        return (
                          <div key={value} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400 capitalize">
                                {value.replace(/_/g, ' ')}
                              </span>
                              <span className="text-white font-bold">
                                {count} ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full bg-brand-darkGrey/50 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-brand-accent h-full transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Responses */}
      {analytics.recentResponses.length > 0 && (
        <div className="bg-brand-darkGrey rounded-xl p-6 border-2 border-brand-accent">
          <h2 className="text-xl font-bold text-white mb-4">Recent Responses</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-black/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Player
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Skill Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Time Spent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Completed At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-black/50">
                {analytics.recentResponses.map((response) => (
                  <tr key={response.id} className="hover:bg-brand-black/30">
                    <td className="px-4 py-3 text-sm text-white">
                      {response.playerName}
                      {response.playerEmail && (
                        <div className="text-xs text-gray-400">{response.playerEmail}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-white capitalize">
                      {response.skillLevel || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {response.timeSpentSeconds
                        ? formatTime(response.timeSpentSeconds)
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {new Date(response.completedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
