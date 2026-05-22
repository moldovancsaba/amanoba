/**
 * Admin Games Management Page
 * 
 * What: Manage all games in the platform
 * Why: Allows admins to view, create, edit, and configure games
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
  Paper,
  SimpleGrid,
  Stack,
  Table,
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

  const toggleGameStatus = async (gameId: string, currentStatus: boolean) => {
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
  };

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

      <TextInput
        placeholder={t('searchGames')}
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        leftSection={<IconSearch size={18} />}
      />

      <Paper withBorder>
        <Table.ScrollContainer minWidth={900}>
          <Table verticalSpacing="md" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('game')}</Table.Th>
                <Table.Th>{tCommon('type')}</Table.Th>
                <Table.Th>{tCommon('status')}</Table.Th>
                <Table.Th>{tCommon('premium')}</Table.Th>
                <Table.Th>{t('assessment')}</Table.Th>
                <Table.Th ta="right">{tCommon('actions')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {games.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={6}>
                    <Text c="dimmed" ta="center" py="xl">{tCommon('noDataFound')}</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                games.map((game) => (
                  <Table.Tr key={game._id}>
                    <Table.Td>
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
                          <Text c="dimmed" size="sm">{game.gameId}</Text>
                        </Stack>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text c="dimmed">{game.type}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Button
                        variant="subtle"
                        color={game.isActive ? 'green' : 'gray'}
                        size="compact-sm"
                        onClick={() => toggleGameStatus(game.gameId, game.isActive)}
                        leftSection={game.isActive ? <IconEye size={14} /> : <IconEyeOff size={14} />}
                      >
                        {game.isActive ? tCommon('active') : tCommon('inactive')}
                      </Button>
                    </Table.Td>
                    <Table.Td>
                      {game.isPremium ? (
                        <Badge color="amanoba">
                          {tCommon('premium')}
                        </Badge>
                      ) : (
                        <Text c="dimmed" size="sm">{tCommon('free')}</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      {game.isAssessment ? (
                        <Badge color="cyan" variant="light">
                          {t('assessment')}
                        </Badge>
                      ) : (
                        <Text c="dimmed" size="sm">-</Text>
                      )}
                    </Table.Td>
                    <Table.Td ta="right">
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
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
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
