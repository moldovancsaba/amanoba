/**
 * Admin Users Management Page
 * 
 * What: Manage all users in the platform
 * Why: Allows admins to view, search, and manage users
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useDebounce } from '@/app/lib/hooks/useDebounce';
import {
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Overlay,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { DataToolbar } from '@/app/components/patterns/DataToolbar';
import { ResponsiveDataView } from '@/app/components/patterns/ResponsiveDataView';
import {
  IconCheck,
  IconCrown,
  IconSearch,
  IconUser,
  IconUsers,
  IconX,
} from '@tabler/icons-react';

interface Player {
  _id: string;
  displayName: string;
  email?: string;
  isPremium: boolean;
  isActive: boolean;
  isAnonymous: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  lastLoginAt?: string;
}

export default function AdminPlayersPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [players, setPlayers] = useState<Player[]>([]);
  const [initialLoading, setInitialLoading] = useState(true); // Only for first load
  const [loading, setLoading] = useState(false); // For subsequent searches
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // Wait 500ms after user stops typing
  const [filters, setFilters] = useState({
    isActive: 'all',
    userType: 'all', // 'all' | 'guest' | 'user' | 'admin'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      if (filters.isActive !== 'all') {
        params.append('isActive', filters.isActive);
      }
      if (filters.userType !== 'all') {
        params.append('userType', filters.userType);
      }
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/admin/players?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setPlayers(data.players || []);
        setPagination((prev) => data.pagination || prev);
      }
    } catch (error) {
      console.error('Failed to fetch players:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [debouncedSearch, filters.isActive, filters.userType, pagination.limit, pagination.page]);

  useEffect(() => {
    void fetchPlayers();
  }, [fetchPlayers]);

  const playerColumns = useMemo(
    () => [
      {
        key: 'player',
        header: t('player'),
        mobileLabel: t('player'),
        cell: (player: Player) => (
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon color="amanoba" variant="light" radius="xl" size="lg">
              <IconUsers size={18} />
            </ThemeIcon>
            <Stack gap={2}>
              <Text fw={700}>{player.displayName}</Text>
              <Text size="xs" c="dimmed">
                {player._id}
              </Text>
            </Stack>
          </Group>
        ),
      },
      {
        key: 'email',
        header: 'Email',
        cell: (player: Player) => <Text c="dimmed">{player.email || '-'}</Text>,
      },
      {
        key: 'status',
        header: tCommon('status'),
        cell: (player: Player) =>
          player.isActive ? (
            <Badge color="green" variant="light" leftSection={<IconCheck size={12} />}>
              {tCommon('active')}
            </Badge>
          ) : (
            <Badge color="gray" variant="light" leftSection={<IconX size={12} />}>
              {tCommon('inactive')}
            </Badge>
          ),
      },
      {
        key: 'type',
        header: tCommon('type'),
        cell: (player: Player) =>
          player.isAnonymous ? (
            <Badge color="gray" variant="light">
              GUEST
            </Badge>
          ) : player.role === 'admin' ? (
            <Badge color="violet" variant="light" leftSection={<IconCrown size={12} />}>
              ADMIN
            </Badge>
          ) : (
            <Badge color="amanoba" variant="light" leftSection={<IconUser size={12} />}>
              USER
            </Badge>
          ),
      },
      {
        key: 'joined',
        header: t('joined'),
        cell: (player: Player) => (
          <Text size="sm">{new Date(player.createdAt).toLocaleDateString('hu-HU')}</Text>
        ),
      },
      {
        key: 'lastLogin',
        header: t('lastLogin'),
        cell: (player: Player) => (
          <Text size="sm">
            {player.lastLoginAt
              ? new Date(player.lastLoginAt).toLocaleDateString('hu-HU')
              : t('never')}
          </Text>
        ),
      },
      {
        key: 'actions',
        header: tCommon('actions'),
        align: 'right' as const,
        hideOnMobile: false,
        cell: (player: Player) => (
          <Button
            component={Link}
            href={`/${locale}/profile/${player._id}`}
            variant="subtle"
            color="amanoba"
            size="compact-sm"
          >
            {t('viewProfile')}
          </Button>
        ),
      },
    ],
    [locale, t, tCommon]
  );

  // Only show full-page loader on initial load
  if (initialLoading) {
    return (
      <Group justify="center" mih={400}>
        <Loader color="amanoba" />
        <Text size="xl">{tCommon('loading')}</Text>
      </Group>
    );
  }

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={1}>{t('playersManagement')}</Title>
        <Text c="dimmed">{t('playersDescription')}</Text>
      </Stack>

      <DataToolbar title={t('searchPlayers')}>
        <TextInput
          placeholder={t('searchPlayers')}
          value={search}
          onChange={(event) => {
            setSearch(event.currentTarget.value);
            setPagination({ ...pagination, page: 1 });
          }}
          leftSection={<IconSearch size={18} />}
          w={{ base: '100%', sm: 280 }}
        />
        <Select
          data={[
            { value: 'all', label: t('allUsers') },
            { value: 'guest', label: 'GUEST' },
            { value: 'user', label: 'USER' },
            { value: 'admin', label: 'ADMIN' },
          ]}
          value={filters.userType}
          onChange={(value) => {
            setFilters({ ...filters, userType: value || 'all' });
            setPagination({ ...pagination, page: 1 });
          }}
          allowDeselect={false}
          w={{ base: '100%', sm: 200 }}
        />
        <Select
          data={[
            { value: 'all', label: t('allStatus') },
            { value: 'true', label: t('activeOnly') },
            { value: 'false', label: t('inactiveOnly') },
          ]}
          value={filters.isActive}
          onChange={(value) => {
            setFilters({ ...filters, isActive: value || 'all' });
            setPagination({ ...pagination, page: 1 });
          }}
          allowDeselect={false}
          w={{ base: '100%', sm: 200 }}
        />
      </DataToolbar>

      <Paper withBorder pos="relative">
        {loading ? (
          <Overlay backgroundOpacity={0.65} blur={1} center>
            <Group gap="xs">
              <Loader color="amanoba" size="sm" />
              <Text size="sm">Searching...</Text>
            </Group>
          </Overlay>
        ) : null}
        <ResponsiveDataView
          rows={players}
          columns={playerColumns}
          rowKey={(player) => player._id}
          minTableWidth={980}
          emptyState={<Text ta="center" c="dimmed" py="xl">{tCommon('noDataFound')}</Text>}
          highlightOnHover
        />
      </Paper>

      {pagination.pages > 1 ? (
        <Group justify="space-between">
          <Text c="dimmed" size="sm">
            {t('showing')} {((pagination.page - 1) * pagination.limit) + 1} {t('to')}{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} {t('of')}{' '}
            {pagination.total} {t('users')}
          </Text>
          <Group gap="xs">
            <Button
              variant="default"
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
            >
              {tCommon('previous')}
            </Button>
            <Text c="dimmed" size="sm">
              {t('page')} {pagination.page} {t('of')} {pagination.pages}
            </Text>
            <Button
              variant="default"
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.pages}
            >
              {tCommon('next')}
            </Button>
          </Group>
        </Group>
      ) : null}

      <SimpleGrid cols={{ base: 1, md: 4 }}>
        <Card withBorder>
          <Text c="dimmed" size="sm">{t('totalUsers')}</Text>
          <Text size="xl" fw={800}>{pagination.total}</Text>
        </Card>
        <Card withBorder>
          <Text c="dimmed" size="sm">{t('activeUsers')}</Text>
          <Text size="xl" fw={800} c="green">{players.filter((p) => p.isActive).length}</Text>
        </Card>
        <Card withBorder>
          <Text c="dimmed" size="sm">Admin Users</Text>
          <Text size="xl" fw={800} c="violet">{players.filter((p) => p.role === 'admin').length}</Text>
        </Card>
        <Card withBorder>
          <Text c="dimmed" size="sm">{t('guestUsers')}</Text>
          <Text size="xl" fw={800} c="amanoba">{players.filter((p) => p.isAnonymous).length}</Text>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
