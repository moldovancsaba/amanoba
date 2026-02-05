/**
 * Create Achievement Page
 * 
 * What: Form to create new achievements
 * Why: Allows admins to create achievements with all required fields
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Trophy,
  HelpCircle,
} from 'lucide-react';

interface Game {
  _id: string;
  gameId: string;
  name: string;
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
  { value: 'silver', label: 'Silver', color: 'bg-brand-white/10 text-brand-white/80' },
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

export default function NewAchievementPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/games');
        const data = await res.json();
        if (data.success && data.games) {
          setGames(data.games);
        }
      } catch (err) {
        console.error('Failed to fetch games:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

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
      const criteria: Record<string, unknown> = {
        type: formData.criteria.type,
        target: formData.criteria.target,
      };
      if (formData.criteria.gameId) criteria.gameId = formData.criteria.gameId;
      if (formData.criteria.condition?.trim()) criteria.condition = formData.criteria.condition.trim();

      const rewards: Record<string, unknown> = {
        points: formData.rewards.points,
        xp: formData.rewards.xp,
      };
      if (formData.rewards.title?.trim()) rewards.title = formData.rewards.title.trim();

      const payload: Record<string, unknown> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        tier: formData.tier,
        icon: formData.icon,
        isHidden: formData.isHidden,
        criteria,
        rewards,
        metadata: {
          isActive: formData.metadata.isActive,
        },
      };

      const res = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create achievement');
      }

      // Success - redirect to achievements list
      router.push(`/${locale}/admin/achievements`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create achievement');
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field: string, value: unknown) => {
    if (field.startsWith('criteria.')) {
      const subField = field.replace('criteria.', '') as keyof FormData['criteria'];
      setFormData((prev) => ({
        ...prev,
        criteria: {
          ...prev.criteria,
          [subField]: value as FormData['criteria'][typeof subField],
        },
      }));
      return;
    }

    if (field.startsWith('rewards.')) {
      const subField = field.replace('rewards.', '') as keyof FormData['rewards'];
      setFormData((prev) => ({
        ...prev,
        rewards: {
          ...prev.rewards,
          [subField]: value as FormData['rewards'][typeof subField],
        },
      }));
      return;
    }

    if (field.startsWith('metadata.')) {
      const subField = field.replace('metadata.', '') as keyof FormData['metadata'];
      setFormData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [subField]: value as FormData['metadata'][typeof subField],
        },
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value } as FormData));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-brand-white text-xl">{tCommon('loading')}</div>
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
              className="p-2 hover:bg-brand-secondary-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {t('createAchievement') || 'Create Achievement'}
              </h1>
              <p className="text-brand-white/70">
                {t('createAchievementDescription') || 'Add a new achievement to the system'}
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
                  className="w-full px-4 py-2 input-on-dark"
                  placeholder="Achievement name"
                  maxLength={100}
                  required
                />
                <p className="text-brand-white/60 text-xs mt-1">Max 100 characters</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {tCommon('description')} <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  className="w-full px-4 py-2 input-on-dark"
                  placeholder="What does the player need to do to unlock this achievement?"
                  rows={3}
                  maxLength={500}
                  required
                />
                <p className="text-brand-white/60 text-xs mt-1">Max 500 characters</p>
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
                    className="w-full px-4 py-2 input-on-dark"
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
                    className="w-full px-4 py-2 input-on-dark"
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
                    className="flex-1 px-4 py-2 input-on-dark"
                    placeholder="🏆 or icon identifier"
                    maxLength={50}
                    required
                  />
                  <div className="text-4xl bg-brand-darkGrey border border-brand-accent/30 rounded-lg px-4 flex items-center justify-center">
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
                          ? 'border-brand-accent bg-brand-accent/20'
                          : 'border-brand-accent/20 hover:border-brand-accent/40'
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
                  className="w-4 h-4 text-brand-accent bg-brand-darkGrey border-brand-accent/30 rounded focus:ring-brand-accent"
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
                  <span title="What the player needs to accomplish"><HelpCircle className="w-4 h-4 inline-block ml-2 text-brand-white/70" /></span>
                </label>
                <select
                  value={formData.criteria.type}
                  onChange={(e) => updateFormData('criteria.type', e.target.value)}
                  className="w-full px-4 py-2 input-on-dark"
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
                    className="w-full px-4 py-2 input-on-dark"
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
                  className="w-full px-4 py-2 input-on-dark"
                  min={1}
                  required
                />
                <p className="text-brand-white/60 text-xs mt-1">
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
                  className="w-full px-4 py-2 input-on-dark"
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
                    className="w-full px-4 py-2 input-on-dark"
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
                    className="w-full px-4 py-2 input-on-dark"
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
                  className="w-full px-4 py-2 input-on-dark"
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
                className="w-4 h-4 text-brand-accent bg-brand-darkGrey border-brand-accent/30 rounded focus:ring-brand-accent"
              />
              <label htmlFor="isActive" className="text-white text-sm">
                Active (achievement can be unlocked)
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="page-card-dark p-6">
            <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
            <div className="panel-on-dark p-6">
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
                  <p className="text-brand-white/70 text-sm mb-3">{formData.description || 'Achievement description'}</p>
                  <div className="text-sm text-brand-white/80">
                    <div>Rewards: {formData.rewards.points} points, {formData.rewards.xp} XP</div>
                    <div>Criteria: {CRITERIA_TYPES.find(t => t.value === formData.criteria.type)?.label} ({formData.criteria.target})</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href={`/${locale}/admin/achievements`}
              className="page-button-secondary px-6 py-2 font-medium"
            >
              {tCommon('cancel')}
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="page-button-primary flex items-center gap-2 px-6 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? tCommon('loading') : tCommon('create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
