/**
 * Admin Rewards Management Page
 * 
 * What: Manage all rewards in the platform
 * Why: Allows admins to view, create, edit, and configure rewards
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image as MantineImage,
  Loader,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconEdit,
  IconGift,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import Image from 'next/image';

interface Reward {
  _id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  pointsCost: number;
  stock: {
    isLimited: boolean;
    currentStock?: number;
    maxStock?: number;
  };
  availability: {
    isActive: boolean;
    premiumOnly: boolean;
  };
  media: {
    imageUrl?: string;
    iconEmoji?: string;
  };
  metadata: {
    totalRedemptions: number;
  };
}

export default function AdminRewardsPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/rewards?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setRewards(data.rewards || []);
      }
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, search]);

  useEffect(() => {
    void fetchRewards();
  }, [fetchRewards]);

  if (loading) {
    return (
      <Group justify="center" mih={400}>
        <Loader color="amanoba" />
        <Text size="xl">{tCommon('loading')}</Text>
      </Group>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Title order={1}>{t('rewardsManagement')}</Title>
          <Text c="dimmed">{t('rewardsDescription')}</Text>
        </Stack>
        <Button
          component={Link}
          href={`/${locale}/admin/rewards/new`}
          color="amanoba"
          leftSection={<IconPlus size={18} />}
        >
          {t('addReward')}
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <TextInput
          placeholder={t('searchRewards')}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          leftSection={<IconSearch size={18} />}
        />
        <Select
          data={[
            { value: 'all', label: t('allCategories') },
            { value: 'game_unlock', label: 'Game Unlock' },
            { value: 'cosmetic', label: 'Cosmetic' },
            { value: 'boost', label: 'Boost' },
            { value: 'physical', label: 'Physical' },
            { value: 'discount', label: 'Discount' },
            { value: 'virtual_item', label: 'Virtual Item' },
          ]}
          value={categoryFilter}
          onChange={(value) => setCategoryFilter(value || 'all')}
          allowDeselect={false}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
        {rewards.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            {tCommon('noDataFound')}
          </Text>
        ) : (
          rewards.map((reward) => (
            <Card key={reward._id} withBorder>
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Group gap="sm" align="flex-start" wrap="nowrap">
                  {reward.media.iconEmoji ? (
                    <Text size="2.5rem" lh={1}>{reward.media.iconEmoji}</Text>
                  ) : reward.media.imageUrl ? (
                    <Box w={48} h={48}>
                      <MantineImage
                        component={Image}
                        src={reward.media.imageUrl}
                        alt={reward.name}
                        width={48}
                        height={48}
                        radius="md"
                        fit="cover"
                      />
                    </Box>
                  ) : (
                    <ThemeIcon color="pink" variant="light" size={48} radius="md">
                      <IconGift size={24} />
                    </ThemeIcon>
                  )}
                    <Stack gap={4}>
                      <Title order={2} size="h4">{reward.name}</Title>
                      <Badge color="gray" variant="light">{reward.category.replace(/_/g, ' ')}</Badge>
                    </Stack>
                  </Group>
                  {reward.availability.premiumOnly ? <Badge color="amanoba">Premium</Badge> : null}
                </Group>

                <Text c="dimmed" size="sm">{reward.description}</Text>

                <Stack gap={6}>
                  <Group justify="space-between">
                    <Text c="dimmed" size="sm">{t('cost')}:</Text>
                    <Text size="sm" fw={700}>{reward.pointsCost} pont</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text c="dimmed" size="sm">{tCommon('type')}:</Text>
                    <Text size="sm" tt="capitalize">{reward.type}</Text>
                  </Group>
                  {reward.stock.isLimited ? (
                    <Group justify="space-between">
                      <Text c="dimmed" size="sm">{t('stock')}:</Text>
                      <Text size="sm">
                      {reward.stock.currentStock || 0} / {reward.stock.maxStock || 0}
                      </Text>
                    </Group>
                  ) : null}
                  <Group justify="space-between">
                    <Text c="dimmed" size="sm">{t('redemptions')}:</Text>
                    <Text size="sm">{reward.metadata.totalRedemptions}</Text>
                  </Group>
                </Stack>

                <Group gap="xs">
                  <Button
                    component={Link}
                    href={`/${locale}/admin/rewards/${reward._id}`}
                    variant="default"
                    leftSection={<IconEdit size={16} />}
                    fullWidth
                  >
                    {tCommon('edit')}
                  </Button>
                  <ActionIcon color="red" variant="subtle" aria-label={tCommon('delete')}>
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
          <Text c="dimmed" size="sm">{t('totalRewards')}</Text>
          <Text size="xl" fw={800}>{rewards.length}</Text>
        </Card>
        <Card withBorder>
          <Text c="dimmed" size="sm">{tCommon('active')}</Text>
          <Text size="xl" fw={800} c="green">{rewards.filter((r) => r.availability.isActive).length}</Text>
        </Card>
        <Card withBorder>
          <Text c="dimmed" size="sm">{t('totalRedemptions')}</Text>
          <Text size="xl" fw={800}>{rewards.reduce((sum, r) => sum + r.metadata.totalRedemptions, 0)}</Text>
        </Card>
        <Card withBorder>
          <Text c="dimmed" size="sm">{t('premiumOnly')}</Text>
          <Text size="xl" fw={800} c="amanoba">{rewards.filter((r) => r.availability.premiumOnly).length}</Text>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
