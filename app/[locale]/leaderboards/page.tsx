'use client';

/**
 * Leaderboards Page — Mantine learner surface with governed header and state blocks.
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconAward,
  IconBrain,
  IconCalendar,
  IconCards,
  IconChartBar,
  IconCrown,
  IconDeviceGamepad2,
  IconMedal,
  IconNumbers,
  IconTarget,
  IconTrendingDown,
  IconTrendingUp,
  IconTrophy,
} from '@tabler/icons-react';
import type { TablerIcon } from '@tabler/icons-react';
import { LearnerPageHeader } from '@/app/components/LearnerPageHeader';
import { StateBlock } from '@/app/components/patterns/StateBlock';
import { LocaleLink } from '@/components/LocaleLink';

interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  rank: number;
  previousRank?: number;
  value: number;
  metadata?: {
    level?: number;
    gamesPlayed?: number;
  };
}

interface LeaderboardData {
  entries: LeaderboardEntry[];
  leaderboardType: string;
  period: string;
  gameId: string;
  totalPlayers: number;
  lastUpdated: string;
}

const GAMES: Array<{ id: string; nameKey: string; icon: TablerIcon }> = [
  { id: 'quizzz', nameKey: 'quizzz', icon: IconBrain },
  { id: 'whackpop', nameKey: 'whackpop', icon: IconTarget },
  { id: 'memory', nameKey: 'memory', icon: IconCards },
  { id: 'madoku', nameKey: 'madoku', icon: IconNumbers },
];

const PERIODS: Array<{ id: string; nameKey: string; icon?: TablerIcon }> = [
  { id: 'alltime', nameKey: 'allTime' },
  { id: 'monthly', nameKey: 'thisMonth', icon: IconCalendar },
  { id: 'weekly', nameKey: 'thisWeek', icon: IconChartBar },
  { id: 'daily', nameKey: 'today', icon: IconTrendingUp },
];

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <IconCrown size={24} color="var(--mantine-color-amanoba-5)" />;
  if (rank === 2) return <IconMedal size={24} />;
  if (rank === 3) return <IconAward size={24} color="var(--mantine-color-yellow-5)" />;
  return (
    <Text fw={800} size="lg" c="dimmed">
      {rank}
    </Text>
  );
}

export default function LeaderboardsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('leaderboard');
  const tCommon = useTranslations('common');
  const tGames = useTranslations('games');
  const [selectedGame, setSelectedGame] = useState('quizzz');
  const [selectedPeriod, setSelectedPeriod] = useState('alltime');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }
    const user = session.user as { id?: string; playerId?: string };
    setCurrentPlayerId(user.playerId || user.id || null);
  }, [session, status, router, locale]);

  useEffect(() => {
    if (!currentPlayerId) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/leaderboards/${selectedGame}?period=${selectedPeriod}&playerId=${currentPlayerId}&t=${Date.now()}`,
          { cache: 'no-store' }
        );

        if (!response.ok) {
          throw new Error('Failed to load leaderboard');
        }

        const raw = await response.json();
        const mapped: LeaderboardData = {
          entries: (raw.entries || []).map(
            (e: {
              player?: { id?: unknown; displayName?: string };
              rank?: number;
              previousRank?: number;
              score?: number;
            }) => ({
              playerId: (e.player?.id != null ? String(e.player.id) : null) || 'unknown',
              playerName: e.player?.displayName ?? 'Unknown Player',
              rank: e.rank ?? 0,
              previousRank: e.previousRank,
              value: e.score ?? 0,
            })
          ),
          leaderboardType: 'score',
          period: (raw.metadata?.period || selectedPeriod).toString().toLowerCase(),
          gameId: selectedGame,
          totalPlayers: raw.metadata?.totalEntries || 0,
          lastUpdated: raw.metadata?.lastUpdated || new Date().toISOString(),
        };
        setLeaderboardData(mapped);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void fetchLeaderboard();
  }, [selectedGame, selectedPeriod, currentPlayerId]);

  if (status === 'loading' || !currentPlayerId) {
    return (
      <Box bg="ink.9" mih="100vh">
        <Center mih="50vh">
          <Loader color="amanoba" />
        </Center>
      </Box>
    );
  }

  const gameLabel = tGames(GAMES.find((g) => g.id === selectedGame)?.nameKey || 'quizzz');
  const periodLabel = t(PERIODS.find((p) => p.id === selectedPeriod)?.nameKey || 'allTime');

  return (
    <Box bg="ink.9" mih="100vh">
      <LearnerPageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<IconTrophy size={22} />}
        actions={(
          <Button component={LocaleLink} href={`/${locale}/dashboard`} variant="default" color="gray">
            {tCommon('dashboard')}
          </Button>
        )}
      />

      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Card padding="lg" withBorder>
            <Text fw={700} mb="md">
              {t('selectGame')}
            </Text>
            <SimpleGrid cols={{ base: 2, md: 4 }} spacing="sm">
              {GAMES.map((game) => {
                const Icon = game.icon;
                const active = selectedGame === game.id;
                return (
                  <Button
                    key={game.id}
                    variant={active ? 'filled' : 'light'}
                    color={active ? 'amanoba' : 'gray'}
                    onClick={() => setSelectedGame(game.id)}
                    h="auto"
                    py="md"
                  >
                    <Stack gap={6} align="center">
                      <Icon size={28} stroke={1.5} />
                      <Text size="sm" fw={600}>
                        {tGames(game.nameKey)}
                      </Text>
                    </Stack>
                  </Button>
                );
              })}
            </SimpleGrid>
          </Card>

          <Card padding="lg" withBorder>
            <Text fw={700} mb="md">
              {t('timePeriod')}
            </Text>
            <SimpleGrid cols={{ base: 2, md: 4 }} spacing="sm">
              {PERIODS.map((period) => {
                const active = selectedPeriod === period.id;
                const Icon = period.icon;
                return (
                  <Button
                    key={period.id}
                    variant={active ? 'filled' : 'light'}
                    color={active ? 'gray' : 'gray'}
                    onClick={() => setSelectedPeriod(period.id)}
                    leftSection={Icon ? <Icon size={18} /> : null}
                  >
                    {t(period.nameKey)}
                  </Button>
                );
              })}
            </SimpleGrid>
          </Card>

          {loading ? (
            <StateBlock kind="loading" title={t('loadingRankings')} />
          ) : error || !leaderboardData ? (
            <StateBlock
              kind="error"
              title={t('unableToLoad')}
              description={error || t('noDataAvailable')}
              icon={<IconDeviceGamepad2 size={18} />}
            />
          ) : leaderboardData.entries.length === 0 ? (
            <StateBlock
              kind="empty"
              title={t('noRankingsYet')}
              description={t('beFirstToPlay')}
              action={(
                <Button component={LocaleLink} href={`/${locale}/games`} color="amanoba">
                  {tGames('playNow')}
                </Button>
              )}
            />
          ) : (
            <Card padding={0} withBorder style={{ overflow: 'hidden' }}>
              <Paper bg="ink.8" p="lg" radius={0}>
                <Group justify="space-between" align="flex-start">
                  <Stack gap={4}>
                    <Title order={2} size="h3">
                      {gameLabel} {t('rankings')}
                    </Title>
                    <Text size="sm" c="dimmed">
                      {periodLabel} • {leaderboardData.totalPlayers} {t('players')}
                    </Text>
                  </Stack>
                  <ThemeIcon size={48} radius="md" color="amanoba" variant="light">
                    <IconTrophy size={28} />
                  </ThemeIcon>
                </Group>
              </Paper>

              <Stack gap={0}>
                {leaderboardData.entries.map((entry) => {
                  const isCurrentPlayer = entry.playerId === currentPlayerId;
                  const rankUp =
                    entry.previousRank != null && entry.previousRank > entry.rank;
                  const rankDown =
                    entry.previousRank != null && entry.previousRank < entry.rank;

                  return (
                    <Paper
                      key={entry.playerId}
                      p="md"
                      radius={0}
                      withBorder={false}
                      bg={isCurrentPlayer ? 'ink.8' : undefined}
                      style={
                        isCurrentPlayer
                          ? { borderInlineStart: '4px solid var(--mantine-color-amanoba-5)' }
                          : undefined
                      }
                    >
                      <Group justify="space-between" align="center" wrap="nowrap">
                        <Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                          <Center w={48}>{<RankIcon rank={entry.rank} />}</Center>
                          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                            <Group gap="xs" wrap="nowrap">
                              <Text fw={700} lineClamp={1}>
                                {entry.playerName}
                                {isCurrentPlayer ? (
                                  <Text span c="dimmed" size="sm" fw={400}>
                                    {' '}
                                    ({t('you')})
                                  </Text>
                                ) : null}
                              </Text>
                              {rankUp ? <IconTrendingUp size={16} color="var(--mantine-color-green-6)" /> : null}
                              {rankDown ? <IconTrendingDown size={16} color="var(--mantine-color-red-6)" /> : null}
                            </Group>
                            {entry.metadata?.level ? (
                              <Text size="xs" c="dimmed">
                                {t('level')} {entry.metadata.level}
                              </Text>
                            ) : null}
                          </Stack>
                        </Group>
                        <Stack gap={2} align="flex-end">
                          <Text fw={800} size="xl">
                            {entry.value.toLocaleString()}
                          </Text>
                          {entry.metadata?.gamesPlayed ? (
                            <Text size="xs" c="dimmed">
                              {entry.metadata.gamesPlayed}{' '}
                              {entry.metadata.gamesPlayed === 1 ? t('game') : t('games')}
                            </Text>
                          ) : null}
                        </Stack>
                      </Group>
                    </Paper>
                  );
                })}
              </Stack>

              <Paper p="md" bg="ink.8" radius={0}>
                <Text size="sm" c="dimmed" ta="center">
                  {t('lastUpdated')}: {new Date(leaderboardData.lastUpdated).toLocaleString(locale)}
                </Text>
              </Paper>
            </Card>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
