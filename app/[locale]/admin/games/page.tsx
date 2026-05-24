/**
 * Admin Games Management Page
 * 
 * What: Manage all games in the platform
 * Why: Allows admins to view, create, edit, and configure games
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
  Card,
  Group,
  Image as MantineImage,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconEdit,
  IconEye,
  IconEyeOff,
  IconDeviceGamepad2,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import Image from 'next/image';
import { DataToolbar } from '@/app/components/patterns/DataToolbar';
import { ResponsiveDataView } from '@/app/components/patterns/ResponsiveDataView';

interface Game {
  _id: string;
  gameId: string;
  name: string;
  description: string;
  type: string;
  isActive: boolean;
  isPremium: boolean;
  isAssessment: boolean;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminGamesPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/games');
      const data = await response.json();

      if (data.success) {
        // Filter by search if provided
        let filteredGames = data.games || [];
        if (search) {
          filteredGames = filteredGames.filter((game: Game) =>
            game.name.toLowerCase().includes(search.toLowerCase()) ||
            game.gameId.toLowerCase().includes(search.toLowerCase())
          );
        }
        setGames(filteredGames);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void fetchGames();
  }, [fetchGames]);

  const toggleGameStatus = useCallback(async (gameId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/games/${encodeURIComponent(gameId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await response.json();
      if (data.success) {
        void fetchGames();
      } else {
        alert(data.error || 'Failed to update game status');
      }
    } catch (error) {
      console.error('Failed to toggle game status:', error);
      alert('Failed to update game status. Please try again.');
    }
  }, [fetchGames]);

  const gameColumns = useMemo(
    () => [
      {
        key: 'game',
        header: t('game'),
        mobileLabel: t('game'),
        cell: (game: Game) => (
          <Group gap="sm" wrap="nowrap">
            {game.thumbnail ? (
              <Box w={40} h={40}>
                <MantineImage
                  component={Image}
                  src={game.thumbnail}
                  alt={game.name}
                  width={40}
                  height={40}
                  radius="md"
                  fit="cover"
                />
              </Box>
            ) : (
              <ThemeIcon color="amanoba" variant="light" radius="md" size={40}>
                <IconDeviceGamepad2 size={20} />
              </ThemeIcon>
            )}
            <Stack gap={2}>
              <Text fw={700}>{game.name}</Text>
              <Text c="dimmed" size="sm">
                {game.gameId}
              </Text>
            </Stack>
          </Group>
        ),
      },
      {
        key: 'type',
        header: tCommon('type'),
        cell: (game: Game) => <Text c="dimmed">{game.type}</Text>,
      },
      {
        key: 'status',
        header: tCommon('status'),
        cell: (game: Game) => (
          <Button
            variant="subtle"
            color={game.isActive ? 'green' : 'gray'}
            size="compact-sm"
            onClick={() => toggleGameStatus(game.gameId, game.isActive)}
            leftSection={game.isActive ? <IconEye size={14} /> : <IconEyeOff size={14} />}
          >
            {game.isActive ? tCommon('active') : tCommon('inactive')}
          </Button>
        ),
      },
      {
        key: 'premium',
        header: tCommon('premium'),
        cell: (game: Game) =>
          game.isPremium ? (
            <Badge color="amanoba">{tCommon('premium')}</Badge>
          ) : (
            <Text c="dimmed" size="sm">
              {tCommon('free')}
            </Text>
          ),
      },
      {
        key: 'assessment',
        header: t('assessment'),
        cell: (game: Game) =>
          game.isAssessment ? (
            <Badge color="cyan" variant="light">
              {t('assessment')}
            </Badge>
          ) : (
            <Text c="dimmed" size="sm">
              -
            </Text>
          ),
      },
      {
        key: 'actions',
        header: tCommon('actions'),
        align: 'right' as const,
        cell: (game: Game) => (
          <Group justify="flex-end" gap="xs">
            <ActionIcon
              component={Link}
              href={`/${locale}/admin/games/${game._id}`}
              variant="default"
              aria-label={tCommon('edit')}
            >
              <IconEdit size={18} />
            </ActionIcon>
            <ActionIcon color="red" variant="subtle" aria-label={tCommon('delete')}>
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        ),
      },
    ],
    [locale, t, tCommon, toggleGameStatus]
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
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Title order={1}>{t('gamesManagement')}</Title>
          <Text c="dimmed">{t('gamesDescription')}</Text>
        </Stack>
        <Button
          component={Link}
          href={`/${locale}/admin/games/new`}
          color="amanoba"
          leftSection={<IconPlus size={18} />}
        >
          {t('addGame')}
        </Button>
      </Group>

      <DataToolbar title={t('searchGames')}>
        <TextInput
          placeholder={t('searchGames')}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
          leftSection={<IconSearch size={18} />}
          w={{ base: '100%', sm: 320 }}
        />
      </DataToolbar>

      <Paper withBorder p="md">
        <ResponsiveDataView
          rows={games}
          columns={gameColumns}
          rowKey={(game) => game._id}
          minTableWidth={900}
          emptyState={<Text c="dimmed" ta="center" py="xl">{tCommon('noDataFound')}</Text>}
          highlightOnHover
        />
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 3 }}>
        <Card withBorder>
          <Text c="dimmed" size="sm">{t('totalGames')}</Text>
          <Text size="xl" fw={800}>{games.length}</Text>
        </Card>
        <Card withBorder>
          <Text c="dimmed" size="sm">{t('activeGames')}</Text>
          <Text size="xl" fw={800} c="green">{games.filter((g) => g.isActive).length}</Text>
        </Card>
        <Card withBorder>
          <Text c="dimmed" size="sm">{t('assessmentGames')}</Text>
          <Text size="xl" fw={800} c="cyan">{games.filter((g) => g.isAssessment).length}</Text>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
