/**
 * Create Achievement Page
 *
 * What: Form to create new achievements.
 * Why: Allows admins to create achievements with all required fields.
 */

'use client';

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Grid,
  Group,
  Loader,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import { AdminPageHeader } from '@/app/components/patterns/AdminPageHeader';
import { IconArrowLeft, IconDeviceFloppy, IconHelpCircle, IconTrophy } from '@tabler/icons-react';

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
  { value: 'bronze', label: 'Bronze' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
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
  { value: 'course_master', label: 'Course Master', description: 'Master a course' },
  { value: 'perfect_assessment', label: 'Perfect Assessment', description: 'Score 100% on final exam' },
  { value: 'lesson_streak', label: 'Lesson Streak', description: 'Complete consecutive lessons' },
  { value: 'perfect_week', label: 'Perfect Week', description: 'Complete 7 lessons in a row' },
  { value: 'early_finisher', label: 'Early Finisher', description: 'Complete a course within N days' },
  { value: 'custom', label: 'Custom', description: 'Custom criteria' },
] as const;

const COMMON_ICONS = ['🏆', '⭐', '🎯', '🔥', '💎', '👑', '🏅', '🎖️', '🌟', '✨', '💫', '🎊', '🎉', '🎈', '🎁'];

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
    void fetchGames();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (!formData.name.trim()) throw new Error('Name is required');
      if (!formData.description.trim()) throw new Error('Description is required');
      if (formData.criteria.target < 1) throw new Error('Target must be at least 1');
      if (formData.rewards.points < 0) throw new Error('Points cannot be negative');
      if (formData.rewards.xp < 0) throw new Error('XP cannot be negative');

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

      const res = await fetch('/api/admin/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create achievement');
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
        criteria: { ...prev.criteria, [subField]: value as FormData['criteria'][typeof subField] },
      }));
      return;
    }

    if (field.startsWith('rewards.')) {
      const subField = field.replace('rewards.', '') as keyof FormData['rewards'];
      setFormData((prev) => ({
        ...prev,
        rewards: { ...prev.rewards, [subField]: value as FormData['rewards'][typeof subField] },
      }));
      return;
    }

    if (field.startsWith('metadata.')) {
      const subField = field.replace('metadata.', '') as keyof FormData['metadata'];
      setFormData((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, [subField]: value as FormData['metadata'][typeof subField] },
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value } as FormData));
  };

  if (loading) {
    return (
      <Center mih={400}>
        <Loader />
      </Center>
    );
  }

  const criteriaHelp = CRITERIA_TYPES.find((type) => type.value === formData.criteria.type)?.description;

  return (
    <Stack gap="xl">
      <Group align="flex-start" wrap="nowrap">
        <ActionIcon
          component={Link}
          href={`/${locale}/admin/achievements`}
          variant="default"
          aria-label="Back to achievements"
        >
          <IconArrowLeft size={18} />
        </ActionIcon>
        <AdminPageHeader
          title={t('createAchievement') || 'Create Achievement'}
          description={t('createAchievementDescription') || 'Add a new achievement to the system'}
        />
      </Group>

      {error ? (
        <Alert color="red" title={tCommon('error')}>
          {error}
        </Alert>
      ) : null}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack gap="xl">
          <Card withBorder>
            <Stack gap="md">
              <Group>
                <ThemeIcon variant="light">
                  <IconTrophy size={18} />
                </ThemeIcon>
                <Title order={2}>Basic Information</Title>
              </Group>
              <TextInput
                label={tCommon('name')}
                value={formData.name}
                onChange={(event) => updateFormData('name', event.currentTarget.value)}
                placeholder="Achievement name"
                maxLength={100}
                required
              />
              <Textarea
                label={tCommon('description')}
                value={formData.description}
                onChange={(event) => updateFormData('description', event.currentTarget.value)}
                placeholder="What does the player need to do to unlock this achievement?"
                rows={3}
                maxLength={500}
                required
              />
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Category"
                    value={formData.category}
                    onChange={(value) => updateFormData('category', value)}
                    data={CATEGORIES}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Tier"
                    value={formData.tier}
                    onChange={(value) => updateFormData('tier', value)}
                    data={TIERS}
                    required
                  />
                </Grid.Col>
              </Grid>
              <Group align="flex-end">
                <TextInput
                  flex={1}
                  label="Icon"
                  value={formData.icon}
                  onChange={(event) => updateFormData('icon', event.currentTarget.value)}
                  placeholder="🏆 or icon identifier"
                  maxLength={50}
                  required
                />
                <Card withBorder p="sm">
                  <Text size="xl">{formData.icon || '🏆'}</Text>
                </Card>
              </Group>
              <SimpleGrid cols={{ base: 5, sm: 10 }}>
                {COMMON_ICONS.map((icon) => (
                  <ActionIcon
                    key={icon}
                    variant={formData.icon === icon ? 'filled' : 'default'}
                    size="lg"
                    onClick={() => updateFormData('icon', icon)}
                    aria-label={`Use ${icon}`}
                  >
                    {icon}
                  </ActionIcon>
                ))}
              </SimpleGrid>
              <Checkbox
                checked={formData.isHidden}
                onChange={(event) => updateFormData('isHidden', event.currentTarget.checked)}
                label="Hidden Achievement (secret, not shown until unlocked)"
              />
            </Stack>
          </Card>

          <Card withBorder>
            <Stack gap="md">
              <Group>
                <Title order={2}>Unlock Criteria</Title>
                <Tooltip label={criteriaHelp || 'What the player needs to accomplish'}>
                  <ThemeIcon variant="subtle">
                    <IconHelpCircle size={18} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Select
                label="Criteria Type"
                value={formData.criteria.type}
                onChange={(value) => updateFormData('criteria.type', value)}
                data={CRITERIA_TYPES.map((type) => ({
                  value: type.value,
                  label: `${type.label} - ${type.description}`,
                }))}
                required
              />
              {['perfect_score', 'speed', 'accuracy'].includes(formData.criteria.type) ? (
                <Select
                  label="Game (Optional)"
                  value={formData.criteria.gameId || ''}
                  onChange={(value) => updateFormData('criteria.gameId', value || undefined)}
                  data={[
                    { value: '', label: 'All Games' },
                    ...games.map((game) => ({ value: game._id, label: game.name })),
                  ]}
                />
              ) : null}
              <NumberInput
                label="Target Value"
                value={formData.criteria.target}
                onChange={(value) => updateFormData('criteria.target', Number(value) || 1)}
                min={1}
                required
              />
              <TextInput
                label="Additional Condition (Optional)"
                value={formData.criteria.condition || ''}
                onChange={(event) => updateFormData('criteria.condition', event.currentTarget.value)}
                placeholder="Additional requirements or conditions"
                maxLength={200}
              />
            </Stack>
          </Card>

          <Card withBorder>
            <Stack gap="md">
              <Title order={2}>Rewards</Title>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="Points"
                    value={formData.rewards.points}
                    onChange={(value) => updateFormData('rewards.points', Number(value) || 0)}
                    min={0}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <NumberInput
                    label="XP"
                    value={formData.rewards.xp}
                    onChange={(value) => updateFormData('rewards.xp', Number(value) || 0)}
                    min={0}
                    required
                  />
                </Grid.Col>
              </Grid>
              <TextInput
                label="Title (Optional)"
                value={formData.rewards.title || ''}
                onChange={(event) => updateFormData('rewards.title', event.currentTarget.value)}
                placeholder="Special title/badge player can equip"
                maxLength={50}
              />
            </Stack>
          </Card>

          <Card withBorder>
            <Stack gap="md">
              <Title order={2}>Settings</Title>
              <Checkbox
                checked={formData.metadata.isActive}
                onChange={(event) => updateFormData('metadata.isActive', event.currentTarget.checked)}
                label="Active (achievement can be unlocked)"
              />
            </Stack>
          </Card>

          <Card withBorder>
            <Stack gap="md">
              <Title order={2}>Preview</Title>
              <Group align="flex-start">
                <Text size="xl">{formData.icon || '🏆'}</Text>
                <div>
                  <Title order={3}>{formData.name || 'Achievement Name'}</Title>
                  <Text c="dimmed">{formData.description || 'Achievement description'}</Text>
                  <Text size="sm" c="dimmed">
                    Rewards: {formData.rewards.points} points, {formData.rewards.xp} XP
                  </Text>
                  <Text size="sm" c="dimmed">
                    Criteria: {CRITERIA_TYPES.find((type) => type.value === formData.criteria.type)?.label} ({formData.criteria.target})
                  </Text>
                </div>
              </Group>
            </Stack>
          </Card>

          <Group justify="flex-end">
            <Button component={Link} href={`/${locale}/admin/achievements`} variant="default">
              {tCommon('cancel')}
            </Button>
            <Button type="submit" loading={saving} leftSection={<IconDeviceFloppy size={18} />}>
              {tCommon('create')}
            </Button>
          </Group>
        </Stack>
      </Box>
    </Stack>
  );
}
