/**
 * Admin Rewards Management Page
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Image as MantineImage,
  Loader,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { AdminPageHeader } from '@/app/components/patterns/AdminPageHeader';
import { IconEdit, IconGift, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { DataToolbar } from '@/app/components/patterns/DataToolbar';
import { MetricCard } from '@/app/components/patterns/MetricCard';
import { ResponsiveDataView } from '@/app/components/patterns/ResponsiveDataView';

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

  const rewardColumns = useMemo(
    () => [
      {
        key: 'reward',
        header: t('rewardsManagement'),
        mobileLabel: 'Reward',
        cell: (reward: Reward) => (
          <Group gap="sm" wrap="nowrap">
            {reward.media.iconEmoji ? (
              <Text size="xl" lh={1}>
                {reward.media.iconEmoji}
              </Text>
            ) : reward.media.imageUrl ? (
              <Box w={40} h={40}>
                <MantineImage
                  component={Image}
                  src={reward.media.imageUrl}
                  alt={reward.name}
                  width={40}
                  height={40}
                  radius="md"
                  fit="cover"
                />
              </Box>
            ) : (
              <ThemeIcon color="pink" variant="light" size={40} radius="md">
                <IconGift size={20} />
              </ThemeIcon>
            )}
            <Stack gap={2}>
              <Text fw={700}>{reward.name}</Text>
              <Badge color="gray" variant="light">
                {reward.category.replace(/_/g, ' ')}
              </Badge>
            </Stack>
          </Group>
        ),
      },
      {
        key: 'cost',
        header: t('cost'),
        cell: (reward: Reward) => <Text fw={700}>{reward.pointsCost} pont</Text>,
      },
      {
        key: 'type',
        header: tCommon('type'),
        cell: (reward: Reward) => <Text tt="capitalize">{reward.type}</Text>,
      },
      {
        key: 'stock',
        header: t('stock'),
        hideOnMobile: true,
        cell: (reward: Reward) =>
          reward.stock.isLimited ? (
            <Text size="sm">
              {reward.stock.currentStock || 0} / {reward.stock.maxStock || 0}
            </Text>
          ) : (
            <Text c="dimmed" size="sm">
              Unlimited
            </Text>
          ),
      },
      {
        key: 'redemptions',
        header: t('redemptions'),
        cell: (reward: Reward) => reward.metadata.totalRedemptions,
      },
      {
        key: 'status',
        header: tCommon('status'),
        cell: (reward: Reward) => (
          <Group gap="xs">
            <Badge color={reward.availability.isActive ? 'green' : 'gray'} variant="light">
              {reward.availability.isActive ? tCommon('active') : tCommon('inactive')}
            </Badge>
            {reward.availability.premiumOnly ? <Badge color="amanoba">Premium</Badge> : null}
          </Group>
        ),
      },
      {
        key: 'actions',
        header: tCommon('actions'),
        align: 'right' as const,
        cell: (reward: Reward) => (
          <Group justify="flex-end" gap="xs">
            <Button
              component={Link}
              href={`/${locale}/admin/rewards/${reward._id}`}
              variant="default"
              size="compact-sm"
              leftSection={<IconEdit size={16} />}
            >
              {tCommon('edit')}
            </Button>
            <ActionIcon color="red" variant="subtle" aria-label={tCommon('delete')}>
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        ),
      },
    ],
    [locale, t, tCommon]
  );

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
      <AdminPageHeader
        title={t('rewardsManagement')}
        description={t('rewardsDescription')}
        primaryAction={
          <Button
            component={Link}
            href={`/${locale}/admin/rewards/new`}
            color="amanoba"
            leftSection={<IconPlus size={18} />}
          >
            {t('addReward')}
          </Button>
        }
      />

      <DataToolbar title={t('searchRewards')}>
        <TextInput
          placeholder={t('searchRewards')}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          leftSection={<IconSearch size={18} />}
          w={{ base: '100%', sm: 280 }}
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
          w={{ base: '100%', sm: 220 }}
        />
      </DataToolbar>

      <Paper withBorder p="md">
        <ResponsiveDataView
          rows={rewards}
          columns={rewardColumns}
          rowKey={(reward) => reward._id}
          minTableWidth={960}
          emptyState={<Text c="dimmed" ta="center" py="xl">{tCommon('noDataFound')}</Text>}
          highlightOnHover
        />
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 4 }}>
        <MetricCard label={t('totalRewards')} value={rewards.length} color="amanoba" />
        <MetricCard
          label={tCommon('active')}
          value={rewards.filter((r) => r.availability.isActive).length}
          color="green"
        />
        <MetricCard
          label={t('totalRedemptions')}
          value={rewards.reduce((sum, r) => sum + r.metadata.totalRedemptions, 0)}
          color="blue"
        />
        <MetricCard
          label={t('premiumOnly')}
          value={rewards.filter((r) => r.availability.premiumOnly).length}
          color="yellow"
        />
      </SimpleGrid>
    </Stack>
  );
}
