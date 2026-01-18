/**
 * Admin Feature Flags Management Page
 * 
 * What: Manage which features are enabled on the platform
 * Why: Allows admins to control what users can access
 */

'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Save, RefreshCw } from 'lucide-react';

interface FeatureFlags {
  _id?: string;
  features: {
    courses: boolean;
    myCourses: boolean;
    games: boolean;
    stats: boolean;
    leaderboards: boolean;
    challenges: boolean;
    quests: boolean;
    achievements: boolean;
    rewards: boolean;
  };
}

export default function AdminFeatureFlagsPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  const fetchFeatureFlags = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/feature-flags');
      const data = await response.json();

      if (data.success) {
        setFeatureFlags(data.featureFlags);
      }
    } catch (error) {
      console.error('Failed to fetch feature flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (feature: keyof FeatureFlags['features']) => {
    if (!featureFlags) return;
    setFeatureFlags({
      ...featureFlags,
      features: {
        ...featureFlags.features,
        [feature]: !featureFlags.features[feature],
      },
    });
  };

  const handleSave = async () => {
    if (!featureFlags) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/feature-flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: featureFlags.features }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Feature flags updated successfully!');
        fetchFeatureFlags();
      } else {
        alert(data.error || 'Failed to update feature flags');
      }
    } catch (error) {
      console.error('Failed to save feature flags:', error);
      alert('Failed to save feature flags');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">{tCommon('loading')}</div>
      </div>
    );
  }

  if (!featureFlags) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">Failed to load feature flags</div>
      </div>
    );
  }

  const featureLabels: Record<keyof FeatureFlags['features'], string> = {
    courses: 'Courses',
    myCourses: 'My Courses',
    games: 'Games',
    stats: 'Stats',
    leaderboards: 'Leaderboards',
    challenges: 'Challenges',
    quests: 'Quests',
    achievements: 'Achievements',
    rewards: 'Rewards',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Feature Flags</h1>
          <p className="text-gray-400">Control which features are enabled on amanoba.com</p>
        </div>
        <button
          onClick={fetchFeatureFlags}
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Feature Flags List */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="space-y-4">
          {(Object.keys(featureFlags.features) as Array<keyof FeatureFlags['features']>).map((feature) => (
            <div
              key={feature}
              className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
            >
              <div>
                <h3 className="text-white font-bold text-lg">{featureLabels[feature]}</h3>
                <p className="text-gray-400 text-sm">
                  {featureFlags.features[feature] ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={featureFlags.features[feature]}
                  onChange={() => handleToggle(feature)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
