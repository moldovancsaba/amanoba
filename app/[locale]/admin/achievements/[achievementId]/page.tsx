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
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconHelpCircle,
  IconDeviceFloppy,
  IconTrash,
  IconTrophy,
} from '@tabler/icons-react';

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
    type:
      | 'games_played'
      | 'wins'
      | 'streak'
      | 'points_earned'
      | 'level_reached'
      | 'perfect_score'
      | 'speed'
      | 'accuracy'
      | 'first_lesson'
      | 'lessons_completed'
      | 'course_completed'
      | 'course_master'
      | 'perfect_assessment'
      | 'lesson_streak'
      | 'perfect_week'
      | 'early_finisher'
      | 'custom';
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
    type:
      | 'games_played'
      | 'wins'
      | 'streak'
      | 'points_earned'
      | 'level_reached'
      | 'perfect_score'
      | 'speed'
      | 'accuracy'
      | 'first_lesson'
      | 'lessons_completed'
      | 'course_completed'
      | 'course_master'
      | 'perfect_assessment'
      | 'lesson_streak'
      | 'perfect_week'
      | 'early_finisher'
      | 'custom';
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
  { value: 'bronze', label: 'Bronze', color: 'orange' },
  { value: 'silver', label: 'Silver', color: 'gray' },
  { value: 'gold', label: 'Gold', color: 'amanoba' },
  { value: 'platinum', label: 'Platinum', color: 'violet' },
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
  { value: 'first_lesson', label: 'First Lesson', description: 'Complete the first course lesson' },
  { value: 'lessons_completed', label: 'Lessons Completed', description: 'Complete a number of course lessons' },
  { value: 'course_completed', label: 'Course Completed', description: 'Finish a course' },
  { value: 'course_master', label: 'Course Master', description: 'Master a course (completion-based)' },
  { value: 'perfect_assessment', label: 'Perfect Assessment', description: 'Score 100% on final exam' },
  { value: 'lesson_streak', label: 'Lesson Streak', description: 'Complete consecutive lessons' },
  { value: 'perfect_week', label: 'Perfect Week', description: 'Complete 7 lessons in a row' },
  { value: 'early_finisher', label: 'Early Finisher', description: 'Complete a course within N days' },
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
      setFormData(prev => {
        const parentVal = prev[parent as keyof FormData];
        const spreadParent = typeof parentVal === 'object' && parentVal !== null ? parentVal as Record<string, unknown> : {};
        return {
          ...prev,
          [parent]: {
            ...spreadParent,
            [child]: value,
          },
        };
      });
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
      <Group justify="center" mih={400}>
        <Text size="xl">{tCommon('loading')}</Text>
      </Group>
    );
  }

  const selectedTier = TIERS.find((tier) => tier.value === formData.tier) || TIERS[0];
  const selectedCriteria = CRITERIA_TYPES.find((type) => type.value === formData.criteria.type);

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Group gap="md" wrap="nowrap">
            <ActionIcon component={Link} href={`/${locale}/admin/achievements`} variant="default" size="lg" aria-label="Back to achievements">
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Stack gap={4}>
              <Title order={1}>{t('editAchievement') || 'Edit Achievement'}</Title>
              <Text c="dimmed">{t('editAchievementDescription') || 'Update achievement details'}</Text>
            </Stack>
          </Group>
        </Group>

        {error ? (
          <Alert color="red" title={tCommon('error')}>
            {error}
          </Alert>
        ) : null}

        {unlockCount > 0 ? (
          <Alert color="amanoba" title="Unlock Information">
            This achievement has been unlocked by {unlockCount} player{unlockCount !== 1 ? 's' : ''}.
            {' '}Deleting this achievement will remove it from all players who have unlocked it.
          </Alert>
        ) : null}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack gap="lg">
            <Card withBorder>
              <Stack gap="md">
                <Group gap="sm">
                  <ThemeIcon color="amanoba" variant="light">
                    <IconTrophy size={18} />
                  </ThemeIcon>
                  <Title order={2} size="h3">Basic Information</Title>
                </Group>

                <TextInput
                  label={tCommon('name')}
                  value={formData.name}
                  onChange={(event) => updateFormData('name', event.currentTarget.value)}
                  placeholder="Achievement name"
                  maxLength={100}
                  description="Max 100 characters"
                  required
                />

                <Textarea
                  label={tCommon('description')}
                  value={formData.description}
                  onChange={(event) => updateFormData('description', event.currentTarget.value)}
                  placeholder="What does the player need to do to unlock this achievement?"
                  rows={3}
                  maxLength={500}
                  description="Max 500 characters"
                  required
                />

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Select
                    label="Category"
                    data={CATEGORIES.map((category) => ({ value: category.value, label: category.label }))}
                    value={formData.category}
                    onChange={(value) => value && updateFormData('category', value)}
                    allowDeselect={false}
                    required
                  />
                  <Select
                    label="Tier"
                    data={TIERS.map((tier) => ({ value: tier.value, label: tier.label }))}
                    value={formData.tier}
                    onChange={(value) => value && updateFormData('tier', value)}
                    allowDeselect={false}
                    required
                  />
                </SimpleGrid>

                <Stack gap="xs">
                  <TextInput
                    label="Icon"
                    value={formData.icon}
                    onChange={(event) => updateFormData('icon', event.currentTarget.value)}
                    placeholder="Trophy or icon identifier"
                    maxLength={50}
                    required
                    rightSection={<Text size="xl">{formData.icon || 'Trophy'}</Text>}
                  />
                  <Group gap="xs">
                    {COMMON_ICONS.map((icon) => (
                      <ActionIcon
                        key={icon}
                        type="button"
                        variant={formData.icon === icon ? 'filled' : 'default'}
                        color={formData.icon === icon ? 'amanoba' : 'gray'}
                        size="lg"
                        onClick={() => updateFormData('icon', icon)}
                        aria-label={`Use ${icon} icon`}
                      >
                        <Text size="lg">{icon}</Text>
                      </ActionIcon>
                    ))}
                  </Group>
                </Stack>

                <Checkbox
                  label="Hidden achievement (secret, not shown until unlocked)"
                  checked={formData.isHidden}
                  onChange={(event) => updateFormData('isHidden', event.currentTarget.checked)}
                />
              </Stack>
            </Card>

            <Card withBorder>
              <Stack gap="md">
                <Group gap="xs">
                  <Title order={2} size="h3">Unlock Criteria</Title>
                  <Tooltip label="What the player needs to accomplish">
                    <ThemeIcon variant="subtle" color="gray" size="sm">
                      <IconHelpCircle size={16} />
                    </ThemeIcon>
                  </Tooltip>
                </Group>

                <Select
                  label="Criteria Type"
                  data={CRITERIA_TYPES.map((type) => ({ value: type.value, label: `${type.label} - ${type.description}` }))}
                  value={formData.criteria.type}
                  onChange={(value) => value && updateFormData('criteria.type', value)}
                  allowDeselect={false}
                  required
                />

                {['perfect_score', 'speed', 'accuracy'].includes(formData.criteria.type) ? (
                  <Select
                    label="Game"
                    data={[
                      { value: '', label: 'All Games' },
                      ...games.map((game) => ({ value: game._id, label: game.name })),
                    ]}
                    value={formData.criteria.gameId || ''}
                    onChange={(value) => updateFormData('criteria.gameId', value || undefined)}
                  />
                ) : null}

                <NumberInput
                  label="Target Value"
                  value={formData.criteria.target}
                  onChange={(value) => updateFormData('criteria.target', typeof value === 'number' ? value : 1)}
                  min={1}
                  required
                  description={
                    formData.criteria.type === 'streak' ? 'Number of consecutive days/wins' :
                    formData.criteria.type === 'games_played' ? 'Number of games to play' :
                    formData.criteria.type === 'wins' ? 'Number of wins required' :
                    formData.criteria.type === 'points_earned' ? 'Total points to earn' :
                    formData.criteria.type === 'level_reached' ? 'Level number to reach' :
                    formData.criteria.type === 'perfect_score' ? 'Score to achieve, usually max score' :
                    formData.criteria.type === 'speed' ? 'Time in seconds' :
                    formData.criteria.type === 'accuracy' ? 'Accuracy percentage, 0-100' :
                    formData.criteria.type === 'first_lesson' ? 'First lesson completed, target usually 1' :
                    formData.criteria.type === 'lessons_completed' ? 'Number of lessons completed' :
                    formData.criteria.type === 'course_completed' ? 'Course completion, target usually 1' :
                    formData.criteria.type === 'course_master' ? 'Course mastery, target usually 1' :
                    formData.criteria.type === 'perfect_assessment' ? '100% on final exam, target usually 1' :
                    formData.criteria.type === 'lesson_streak' ? 'Consecutive lesson days' :
                    formData.criteria.type === 'perfect_week' ? '7 consecutive lessons, target usually 7' :
                    formData.criteria.type === 'early_finisher' ? 'Finish course within N days' :
                    'Custom value, explain in condition field'
                  }
                />

                <TextInput
                  label="Additional Condition"
                  value={formData.criteria.condition || ''}
                  onChange={(event) => updateFormData('criteria.condition', event.currentTarget.value)}
                  placeholder="Additional requirements or conditions"
                  maxLength={200}
                />
              </Stack>
            </Card>

            <Card withBorder>
              <Stack gap="md">
                <Title order={2} size="h3">Rewards</Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <NumberInput
                    label="Points"
                    value={formData.rewards.points}
                    onChange={(value) => updateFormData('rewards.points', typeof value === 'number' ? value : 0)}
                    min={0}
                    required
                  />
                  <NumberInput
                    label="XP"
                    value={formData.rewards.xp}
                    onChange={(value) => updateFormData('rewards.xp', typeof value === 'number' ? value : 0)}
                    min={0}
                    required
                  />
                </SimpleGrid>
                <TextInput
                  label="Title"
                  value={formData.rewards.title || ''}
                  onChange={(event) => updateFormData('rewards.title', event.currentTarget.value)}
                  placeholder="Special title/badge player can equip"
                  maxLength={50}
                />
              </Stack>
            </Card>

            <Card withBorder>
              <Stack gap="md">
                <Title order={2} size="h3">Settings</Title>
                <Checkbox
                  label="Active (achievement can be unlocked)"
                  checked={formData.metadata.isActive}
                  onChange={(event) => updateFormData('metadata.isActive', event.currentTarget.checked)}
                />
              </Stack>
            </Card>

            <Card withBorder>
              <Stack gap="md">
                <Title order={2} size="h3">Preview</Title>
                <Paper withBorder p="md" radius="md">
                  <Group align="flex-start" gap="md">
                    <Text size="3rem" lh={1}>{formData.icon || 'Trophy'}</Text>
                    <Stack gap="xs" flex={1}>
                      <Group gap="sm">
                        <Title order={3} size="h4">{formData.name || 'Achievement Name'}</Title>
                        <Badge color={selectedTier.color}>{formData.tier}</Badge>
                      </Group>
                      <Text c="dimmed">{formData.description || 'Achievement description'}</Text>
                      <Text size="sm">
                        Rewards: {formData.rewards.points} points, {formData.rewards.xp} XP
                      </Text>
                      <Text size="sm">
                        Criteria: {selectedCriteria?.label} ({formData.criteria.target})
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              </Stack>
            </Card>

            <Group justify="space-between">
              <Button
                type="button"
                color="red"
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleting}
                leftSection={<IconTrash size={18} />}
              >
                {deleting ? tCommon('loading') : tCommon('delete')}
              </Button>
              <Group gap="sm">
                <Button component={Link} href={`/${locale}/admin/achievements`} variant="default">
                  {tCommon('cancel')}
                </Button>
                <Button type="submit" color="amanoba" loading={saving} leftSection={<IconDeviceFloppy size={18} />}>
                  {saving ? tCommon('loading') : tCommon('save')}
                </Button>
              </Group>
            </Group>
          </Stack>
        </Box>

        <Modal
          opened={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Confirm Delete"
          centered
        >
          <Stack gap="md">
            <Text>
              Are you sure you want to delete this achievement? This action cannot be undone.
            </Text>
            {unlockCount > 0 ? (
              <Alert color="amanoba">
                Warning: This achievement has been unlocked by {unlockCount} player{unlockCount !== 1 ? 's' : ''}.
                {' '}All unlock records will be removed.
              </Alert>
            ) : null}
            <Group justify="flex-end">
              <Button variant="default" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                {tCommon('cancel')}
              </Button>
              <Button color="red" onClick={handleDelete} loading={deleting}>
                {deleting ? tCommon('loading') : tCommon('delete')}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}
