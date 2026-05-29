/**
 * Admin Achievements Management Page
 * 
 * What: Manage all achievements in the platform
 * Why: Allows admins to view, create, edit, and configure achievements
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { AdminPageHeader } from '@/app/components/patterns/AdminPageHeader';
import {
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import { DataToolbar } from '@/app/components/patterns/DataToolbar';

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
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const fetchAchievements = useCallback(async () => {
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
  }, [categoryFilter, search]);

  useEffect(() => {
    void fetchAchievements();
  }, [fetchAchievements]);

  const handleDelete = async (achievementId: string) => {
    setDeletingId(achievementId);
    try {
      const response = await fetch(`/api/admin/achievements/${achievementId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete achievement');
      }

      // Remove from list and refresh
      setAchievements(prev => prev.filter(a => a._id !== achievementId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete achievement:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete achievement');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Group justify="center" mih={400}>
        <Loader color="amanoba" />
        <Text size="xl">{tCommon('loading')}</Text>
      </Group>
    );
  }

  const tierColors: Record<string, string> = {
    bronze: 'orange',
    silver: 'gray',
    gold: 'amanoba',
    platinum: 'violet',
  };

  return (
    <Stack gap="lg">
      <AdminPageHeader
        title={t('achievementsManagement')}
        description={t('achievementsDescription')}
        primaryAction={
          <Button
            component={Link}
            href={`/${locale}/admin/achievements/new`}
            color="amanoba"
            leftSection={<IconPlus size={18} />}
          >
            {t('addAchievement')}
          </Button>
        }
      />

      <DataToolbar title={t('searchAchievements')}>
        <TextInput
          placeholder={t('searchAchievements')}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          leftSection={<IconSearch size={18} />}
          w={{ base: '100%', sm: 280 }}
        />
        <Select
          data={[
            { value: 'all', label: t('allCategories') },
            { value: 'gameplay', label: 'Gameplay' },
            { value: 'progression', label: 'Progression' },
            { value: 'social', label: 'Social' },
            { value: 'collection', label: 'Collection' },
            { value: 'mastery', label: 'Mastery' },
            { value: 'streak', label: 'Streak' },
            { value: 'special', label: 'Special' },
          ]}
          value={categoryFilter}
          onChange={(value) => setCategoryFilter(value || 'all')}
          allowDeselect={false}
          w={{ base: '100%', sm: 220 }}
        />
      </DataToolbar>

      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
        {achievements.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            {tCommon('noDataFound')}
          </Text>
        ) : (
          achievements.map((achievement) => (
            <Card key={achievement._id} withBorder>
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Group gap="sm" align="flex-start" wrap="nowrap">
                    <Text size="2.5rem" lh={1}>{achievement.icon}</Text>
                    <Stack gap={4}>
                      <Title order={2} size="h4">{achievement.name}</Title>
                      <Badge color={tierColors[achievement.tier] || tierColors.bronze}>
                        {achievement.tier}
                      </Badge>
                    </Stack>
                  </Group>
                  {achievement.isHidden ? <Badge color="gray" variant="light">{t('hidden')}</Badge> : null}
                </Group>

                <Text c="dimmed" size="sm">{achievement.description}</Text>

                <Stack gap={6}>
                  <Group justify="space-between" gap="md">
                    <Text c="dimmed" size="sm">{t('category')}:</Text>
                    <Text size="sm" tt="capitalize">{achievement.category}</Text>
                  </Group>
                  <Group justify="space-between" gap="md">
                    <Text c="dimmed" size="sm">{t('criteria')}:</Text>
                    <Text size="sm">
                    {achievement.criteria.type.replace(/_/g, ' ')} ({achievement.criteria.target})
                    </Text>
                  </Group>
                  <Group justify="space-between" gap="md">
                    <Text c="dimmed" size="sm">{t('rewards')}:</Text>
                    <Text size="sm">{achievement.rewards.points} pts, {achievement.rewards.xp} XP</Text>
                  </Group>
                  <Group justify="space-between" gap="md">
                    <Text c="dimmed" size="sm">{t('unlocked')}:</Text>
                    <Text size="sm">{achievement.metadata.unlockCount} {t('players')}</Text>
                  </Group>
                </Stack>

                <Group gap="xs">
                  <Button
                    component={Link}
                    href={`/${locale}/admin/achievements/${achievement._id}`}
                    variant="default"
                    leftSection={<IconEdit size={16} />}
                    fullWidth
                  >
                  {tCommon('edit')}
                  </Button>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => setShowDeleteConfirm({ id: achievement._id, name: achievement.name })}
                    disabled={deletingId === achievement._id}
                    aria-label={tCommon('delete')}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              </Stack>
            </Card>
          ))
        )}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 4 }}>
        <Card withBorder>
          <Text c="dimmed" size="sm">{t('totalAchievements')}</Text>
          <Text size="xl" fw={800}>{achievements.length}</Text>
        </Card>
        <Card withBorder>
          <Text c="dimmed" size="sm">{tCommon('active')}</Text>
          <Text size="xl" fw={800} c="green">{achievements.filter((a) => a.metadata.isActive).length}</Text>
        </Card>
        <Card withBorder>
          <Text c="dimmed" size="sm">{t('totalUnlocks')}</Text>
          <Text size="xl" fw={800} c="amanoba">{achievements.reduce((sum, a) => sum + a.metadata.unlockCount, 0)}</Text>
        </Card>
        <Card withBorder>
          <Text c="dimmed" size="sm">{t('hidden')}</Text>
          <Text size="xl" fw={800} c="gray">{achievements.filter((a) => a.isHidden).length}</Text>
        </Card>
      </SimpleGrid>

      <Modal
        opened={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirm Delete"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete &quot;{showDeleteConfirm?.name}&quot;? This action cannot be undone.
          </Text>
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setShowDeleteConfirm(null)}
              disabled={deletingId === showDeleteConfirm?.id}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              color="red"
              onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm.id)}
              loading={deletingId === showDeleteConfirm?.id}
            >
              {deletingId === showDeleteConfirm?.id ? tCommon('loading') : tCommon('delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
