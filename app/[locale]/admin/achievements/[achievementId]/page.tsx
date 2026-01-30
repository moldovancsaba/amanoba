/**
 * Edit Achievement Page
 * 
 * What: Form to edit existing achievements
 * Why: Allows admins to update achievement details
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Trophy,
  HelpCircle,
  Trash2,
} from 'lucide-react';

interface Game {
  _id: string;
  gameId: string;
  name: string;
}

interface Achievement {
  _id: string;
  name: string;
  description: string;
  category: 'gameplay' | 'progression' | 'social' | 'collection' | 'mastery' | 'streak' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string;
  isHidden: boolean;
  criteria: {
    type: 'games_played' | 'wins' | 'streak' | 'points_earned' | 'level_reached' | 'perfect_score' | 'speed' | 'accuracy' | 'custom';
    gameId?: string;
    target: number;
    condition?: string;
  };
  rewards: {
    points: number;
    xp: number;
    title?: string;
  };
  metadata: {
    isActive: boolean;
    unlockCount?: number;
  };
}

interface FormData {
  name: string;
  description: string;
  category: 'gameplay' | 'progression' | 'social' | 'collection' | 'mastery' | 'streak' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string;
  isHidden: boolean;
  criteria: {
    type: 'games_played' | 'wins' | 'streak' | 'points_earned' | 'level_reached' | 'perfect_score' | 'speed' | 'accuracy' | 'custom';
    gameId?: string;
    target: number;
    condition?: string;
  };
  rewards: {
    points: number;
    xp: number;
    title?: string;
  };
  metadata: {
    isActive: boolean;
  };
}

const CATEGORIES = [
  { value: 'gameplay', label: 'Gameplay' },
  { value: 'progression', label: 'Progression' },
  { value: 'social', label: 'Social' },
  { value: 'collection', label: 'Collection' },
  { value: 'mastery', label: 'Mastery' },
  { value: 'streak', label: 'Streak' },
  { value: 'special', label: 'Special' },
] as const;

const TIERS = [
  { value: 'bronze', label: 'Bronze', color: 'bg-orange-500/20 text-orange-400' },
  { value: 'silver', label: 'Silver', color: 'bg-gray-400/20 text-gray-300' },
  { value: 'gold', label: 'Gold', color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'platinum', label: 'Platinum', color: 'bg-purple-500/20 text-purple-400' },
] as const;

const CRITERIA_TYPES = [
  { value: 'games_played', label: 'Games Played', description: 'Number of games completed' },
  { value: 'wins', label: 'Wins', description: 'Number of games won' },
  { value: 'streak', label: 'Streak', description: 'Consecutive days or wins' },
  { value: 'points_earned', label: 'Points Earned', description: 'Total points accumulated' },
  { value: 'level_reached', label: 'Level Reached', description: 'Player level milestone' },
  { value: 'perfect_score', label: 'Perfect Score', description: 'Achieve perfect score in a game' },
  { value: 'speed', label: 'Speed', description: 'Complete game within time limit' },
  { value: 'accuracy', label: 'Accuracy', description: 'Achieve accuracy percentage' },
  { value: 'custom', label: 'Custom', description: 'Custom criteria (use condition field)' },
] as const;

const COMMON_ICONS = ['🏆', '⭐', '🎯', '🔥', '💎', '👑', '🏅', '🎖️', '⭐', '🌟', '✨', '💫', '🎊', '🎉', '🎈', '🎁'];

export default function EditAchievementPage() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  
  const achievementId = params.achievementId as string;
  
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [unlockCount, setUnlockCount] = useState<number>(0);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: 'gameplay',
    tier: 'bronze',
    icon: '🏆',
    isHidden: false,
    criteria: {
      type: 'games_played',
      target: 1,
      condition: '',
    },
    rewards: {
      points: 0,
      xp: 0,
      title: '',
    },
    metadata: {
      isActive: true,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [achievementRes, gamesRes] = await Promise.all([
          fetch(`/api/admin/achievements/${achievementId}`),
          fetch('/api/games'),
        ]);

        const achievementData = await achievementRes.json();
        const gamesData = await gamesRes.json();

        if (!achievementRes.ok || !achievementData.success) {
          throw new Error(achievementData.error || 'Failed to fetch achievement');
        }

        if (gamesData.success && gamesData.games) {
          setGames(gamesData.games);
        }

        const achievement: Achievement = achievementData.achievement;
        setUnlockCount(achievement.metadata?.unlockCount || 0);

        // Pre-populate form with existing data
        setFormData({
          name: achievement.name || '',
          description: achievement.description || '',
          category: achievement.category || 'gameplay',
          tier: achievement.tier || 'bronze',
          icon: achievement.icon || '🏆',
          isHidden: achievement.isHidden || false,
          criteria: {
            type: achievement.criteria?.type || 'games_played',
            gameId: achievement.criteria?.gameId,
            target: achievement.criteria?.target || 1,
            condition: achievement.criteria?.condition || '',
          },
          rewards: {
            points: achievement.rewards?.points || 0,
            xp: achievement.rewards?.xp || 0,
            title: achievement.rewards?.title || '',
          },
          metadata: {
            isActive: achievement.metadata?.isActive !== false,
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load achievement');
      } finally {
        setLoading(false);
      }
    };

    if (achievementId) {
      fetchData();
    }
  }, [achievementId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }
      if (formData.criteria.target < 1) {
        throw new Error('Target must be at least 1');
      }
      if (formData.rewards.points < 0) {
        throw new Error('Points cannot be negative');
      }
      if (formData.rewards.xp < 0) {
        throw new Error('XP cannot be negative');
      }

      // Prepare payload
      const payload: Record<string, unknown> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        tier: formData.tier,
        icon: formData.icon,
        isHidden: formData.isHidden,
        criteria: {
          type: formData.criteria.type,
          target: formData.criteria.target,
        },
        rewards: {
          points: formData.rewards.points,
          xp: formData.rewards.xp,
        },
        metadata: {
          isActive: formData.metadata.isActive,
        },
      };

      // Add optional fields
      if (formData.criteria.gameId) {
        payload.criteria.gameId = formData.criteria.gameId;
      }
      if (formData.criteria.condition?.trim()) {
        payload.criteria.condition = formData.criteria.condition.trim();
      }
      if (formData.rewards.title?.trim()) {
        payload.rewards.title = formData.rewards.title.trim();
      }

      const res = await fetch(`/api/admin/achievements/${achievementId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update achievement');
      }

      // Success - redirect to achievements list
      router.push(`/${locale}/admin/achievements`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update achievement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/achievements/${achievementId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete achievement');
      }

      // Success - redirect to achievements list
      router.push(`/${locale}/admin/achievements`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete achievement');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const updateFormData = (field: string, value: unknown) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData],
          [child]: value,
        },
      }));
    } else if (field.includes('criteria.')) {
      const subField = field.replace('criteria.', '');
      setFormData(prev => ({
        ...prev,
        criteria: {
          ...prev.criteria,
          [subField]: value,
        },
      }));
    } else if (field.includes('rewards.')) {
      const subField = field.replace('rewards.', '');
      setFormData(prev => ({
        ...prev,
        rewards: {
          ...prev.rewards,
          [subField]: value,
        },
      }));
    } else if (field.includes('metadata.')) {
      const subField = field.replace('metadata.', '');
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [subField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">{tCommon('loading')}</div>
      </div>
    );
  }

  return (
    <div className="page-shell p-6">
      <div className="page-container max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/admin/achievements`}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {t('editAchievement') || 'Edit Achievement'}
              </h1>
              <p className="text-gray-400">
                {t('editAchievementDescription') || 'Update achievement details'}
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <div className="text-red-400 font-semibold">{tCommon('error')}</div>
            <div className="text-red-300 text-sm mt-1">{error}</div>
          </div>
        )}

        {/* Unlock Count Info */}
        {unlockCount > 0 && (
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
            <div className="text-yellow-400 font-semibold">Unlock Information</div>
            <div className="text-yellow-300 text-sm mt-1">
              This achievement has been unlocked by {unlockCount} player{unlockCount !== 1 ? 's' : ''}.
              {unlockCount > 0 && ' Deleting this achievement will remove it from all players who have unlocked it.'}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="page-card-dark p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {tCommon('name')} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  placeholder="Achievement name"
                  maxLength={100}
                  required
                />
                <p className="text-gray-400 text-xs mt-1">Max 100 characters</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {tCommon('description')} <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  placeholder="What does the player need to do to unlock this achievement?"
                  rows={3}
                  maxLength={500}
                  required
                />
                <p className="text-gray-400 text-xs mt-1">Max 500 characters</p>
              </div>

              {/* Category and Tier */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormData('category', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    required
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Tier <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.tier}
                    onChange={(e) => updateFormData('tier', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    required
                  >
                    {TIERS.map(tier => (
                      <option key={tier.value} value={tier.value}>{tier.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {'Icon '}<span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => updateFormData('icon', e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    placeholder="🏆 or icon identifier"
                    maxLength={50}
                    required
                  />
                  <div className="text-4xl bg-gray-800 border border-gray-700 rounded-lg px-4 flex items-center justify-center">
                    {formData.icon || '🏆'}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {COMMON_ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => updateFormData('icon', icon)}
                      className={`text-2xl p-2 rounded-lg border transition-colors ${
                        formData.icon === icon
                          ? 'border-indigo-500 bg-indigo-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Is Hidden */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isHidden"
                  checked={formData.isHidden}
                  onChange={(e) => updateFormData('isHidden', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isHidden" className="text-white text-sm">
                  Hidden Achievement (secret, not shown until unlocked)
                </label>
              </div>
            </div>
          </div>

          {/* Criteria */}
          <div className="page-card-dark p-6">
            <h2 className="text-xl font-bold text-white mb-4">Unlock Criteria</h2>

            <div className="space-y-4">
              {/* Criteria Type */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Criteria Type <span className="text-red-400">*</span>
                  <HelpCircle className="w-4 h-4 inline-block ml-2 text-gray-400" title="What the player needs to accomplish" />
                </label>
                <select
                  value={formData.criteria.type}
                  onChange={(e) => updateFormData('criteria.type', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  required
                >
                  {CRITERIA_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Game Selection (optional) */}
              {['perfect_score', 'speed', 'accuracy'].includes(formData.criteria.type) && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Game (Optional)
                  </label>
                  <select
                    value={formData.criteria.gameId || ''}
                    onChange={(e) => updateFormData('criteria.gameId', e.target.value || undefined)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">All Games</option>
                    {games.map(game => (
                      <option key={game._id} value={game._id}>{game.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Target */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Target Value <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={formData.criteria.target}
                  onChange={(e) => updateFormData('criteria.target', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  min={1}
                  required
                />
                <p className="text-gray-400 text-xs mt-1">
                  {formData.criteria.type === 'streak' && 'Number of consecutive days/wins'}
                  {formData.criteria.type === 'games_played' && 'Number of games to play'}
                  {formData.criteria.type === 'wins' && 'Number of wins required'}
                  {formData.criteria.type === 'points_earned' && 'Total points to earn'}
                  {formData.criteria.type === 'level_reached' && 'Level number to reach'}
                  {formData.criteria.type === 'perfect_score' && 'Score to achieve (usually max score)'}
                  {formData.criteria.type === 'speed' && 'Time in seconds'}
                  {formData.criteria.type === 'accuracy' && 'Accuracy percentage (0-100)'}
                  {formData.criteria.type === 'custom' && 'Custom value (explain in condition field)'}
                </p>
              </div>

              {/* Condition (optional) */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Additional Condition (Optional)
                </label>
                <input
                  type="text"
                  value={formData.criteria.condition || ''}
                  onChange={(e) => updateFormData('criteria.condition', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  placeholder="Additional requirements or conditions"
                  maxLength={200}
                />
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="page-card-dark p-6">
            <h2 className="text-xl font-bold text-white mb-4">Rewards</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Points <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.rewards.points}
                    onChange={(e) => updateFormData('rewards.points', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    min={0}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    XP <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.rewards.xp}
                    onChange={(e) => updateFormData('rewards.xp', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    min={0}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.rewards.title || ''}
                  onChange={(e) => updateFormData('rewards.title', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  placeholder="Special title/badge player can equip"
                  maxLength={50}
                />
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="page-card-dark p-6">
            <h2 className="text-xl font-bold text-white mb-4">Settings</h2>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.metadata.isActive}
                onChange={(e) => updateFormData('metadata.isActive', e.target.checked)}
                className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isActive" className="text-white text-sm">
                Active (achievement can be unlocked)
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="page-card-dark p-6">
            <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{formData.icon || '🏆'}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg">{formData.name || 'Achievement Name'}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      TIERS.find(t => t.value === formData.tier)?.color || TIERS[0].color
                    }`}>
                      {formData.tier}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{formData.description || 'Achievement description'}</p>
                  <div className="text-sm text-gray-300">
                    <div>Rewards: {formData.rewards.points} points, {formData.rewards.xp} XP</div>
                    <div>Criteria: {CRITERIA_TYPES.find(t => t.value === formData.criteria.type)?.label} ({formData.criteria.target})</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? tCommon('loading') : tCommon('delete')}
            </button>
            <div className="flex items-center gap-4">
              <Link
                href={`/${locale}/admin/achievements`}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                {tCommon('cancel')}
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {saving ? tCommon('loading') : tCommon('save')}
              </button>
            </div>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this achievement? This action cannot be undone.
                {unlockCount > 0 && (
                  <span className="block mt-2 text-yellow-400">
                    Warning: This achievement has been unlocked by {unlockCount} player{unlockCount !== 1 ? 's' : ''}.
                    All unlock records will be removed.
                  </span>
                )}
              </p>
              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {tCommon('cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {deleting ? tCommon('loading') : tCommon('delete')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
