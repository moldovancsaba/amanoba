'use client';

/**
 * User Statistics Page — Mantine learner metrics surface.
 */

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconBolt,
  IconFlame,
  IconHourglass,
  IconMedal,
  IconTarget,
  IconTrophy,
} from '@tabler/icons-react';
import { LearnerPageHeader } from '@/app/components/LearnerPageHeader';
import { MetricCard } from '@/app/components/patterns/MetricCard';
import { StateBlock } from '@/app/components/patterns/StateBlock';
import { LocaleLink } from '@/components/LocaleLink';
import { getEloIcon, getEloRank } from '@/lib/gamification/elo-calculator';

interface PlayerStats {
  overall: {
    totalGamesPlayed: number;
    totalWins: number;
    totalLosses: number;
    totalDraws: number;
    winRate: number;
    averageSessionTime: number;
    totalPlayTime: number;
    currentStreak: number;
    bestStreak: number;
  };
  gameSpecific: Record<
    string,
    {
      gamesPlayed: number;
      wins: number;
      losses: number;
      draws: number;
      bestScore: number;
      averageScore: number;
      fastestWin?: number;
      highestAccuracy?: number;
      elo?: number;
    }
  >;
  level: number;
  currentXP: number;
  totalXP: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
}

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('stats');
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (ms: number): string => {
    if (!ms) return t('notAvailable');
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const user = session?.user as { id?: string; playerId?: string };
      const playerId = user?.playerId || user?.id;
      if (!playerId) throw new Error(t('noPlayerId'));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`/api/profile/${playerId}?t=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(t('failedToLoad'));

      const data = await response.json();
      const profile = data.profile || data;

      setStats({
        overall: {
          totalGamesPlayed: profile.statistics?.totalGamesPlayed || 0,
          totalWins: profile.statistics?.totalWins || 0,
          totalLosses: profile.statistics?.totalLosses || 0,
          totalDraws: profile.statistics?.totalDraws || 0,
          winRate: profile.statistics?.winRate || 0,
          averageSessionTime: profile.statistics?.averageSessionTime || 0,
          totalPlayTime: profile.statistics?.totalPlayTime || 0,
          currentStreak: profile.streaks?.win?.current || 0,
          bestStreak: profile.streaks?.win?.longest || 0,
        },
        gameSpecific: profile.progression?.gameSpecificStats || {},
        level: profile.progression?.level || 1,
        currentXP: profile.progression?.currentXP || 0,
        totalXP: profile.progression?.totalXP || 0,
        achievementsUnlocked: profile.achievements?.unlocked || 0,
        achievementsTotal: profile.achievements?.total || 0,
      });
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError(t('requestTimedOut'));
      } else {
        setError((err as Error).message || t('failedToLoad'));
      }
    } finally {
      setLoading(false);
    }
  }, [session, t]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push(`/${locale}/auth/signin`);
      return;
    }
    void fetchStats();
  }, [fetchStats, locale, router, session, status]);

  if (status === 'loading' || loading) {
    return (
      <Box bg="ink.9" mih="100vh">
        <Center mih="50vh">
          <Loader color="amanoba" size="lg" />
        </Center>
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Box bg="ink.9" mih="100vh">
        <Container size="sm" py="xl">
          <StateBlock
            kind="error"
            title={t('unableToLoad')}
            description={error || t('failedToLoad')}
            action={(
              <Button component={LocaleLink} href={`/${locale}/dashboard`} color="amanoba">
                {t('backToDashboard')}
              </Button>
            )}
          />
        </Container>
      </Box>
    );
  }

  const achievementProgress =
    stats.achievementsTotal > 0
      ? Math.round((stats.achievementsUnlocked / stats.achievementsTotal) * 100)
      : 0;

  return (
    <Box bg="ink.9" mih="100vh">
      <LearnerPageHeader
        title={t('pageTitle')}
        subtitle={t('pageSubtitle')}
        icon={<IconTarget size={22} />}
        actions={(
          <Button component={LocaleLink} href={`/${locale}/dashboard`} variant="default" color="gray">
            {t('backToDashboard')}
          </Button>
        )}
      />

      <Container size="xl" py="xl">
        <Stack gap="xl">
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            <MetricCard
              icon={<IconBolt size={24} />}
              value={stats.level}
              label={t('level')}
              detail={`${stats.currentXP} / 100 XP`}
              progress={stats.currentXP}
            />
            <MetricCard
              icon={<IconTrophy size={24} />}
              value={stats.overall.totalGamesPlayed}
              label={t('gamesPlayed')}
              detail={`${stats.overall.totalWins}W / ${stats.overall.totalLosses}L / ${stats.overall.totalDraws}D`}
            />
            <MetricCard
              icon={<IconMedal size={24} />}
              value={`${stats.overall.winRate}%`}
              label={t('winRate')}
              detail={`${stats.overall.totalWins} ${t('victories')}`}
            />
            <MetricCard
              icon={<IconFlame size={24} />}
              value={stats.overall.currentStreak}
              label={t('streak')}
              detail={`${t('best')}: ${stats.overall.bestStreak}`}
            />
          </SimpleGrid>

          <Card padding="lg" withBorder>
            <Title order={2} size="h3" mb="lg">
              {t('gameSpecificStats')}
            </Title>
            {Object.keys(stats.gameSpecific).length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                {t('noGameStats')}
              </Text>
            ) : (
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
                {Object.entries(stats.gameSpecific).map(([gameKey, gameStats]) => (
                  <Card key={gameKey} padding="md" withBorder bg="ink.8">
                    <Stack gap="xs">
                      <Text fw={700} tt="capitalize">
                        {gameKey}
                      </Text>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          {t('gamesPlayed')}
                        </Text>
                        <Text size="sm" fw={600}>
                          {gameStats.gamesPlayed}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          {t('winRate')}
                        </Text>
                        <Text size="sm" fw={600}>
                          {gameStats.gamesPlayed > 0
                            ? ((gameStats.wins / gameStats.gamesPlayed) * 100).toFixed(1)
                            : 0}
                          %
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm" c="dimmed">
                          {t('bestScore')}
                        </Text>
                        <Text size="sm" fw={600}>
                          {gameStats.bestScore || 0}
                        </Text>
                      </Group>
                      {gameStats.elo ? (
                        <Stack gap={2} mt="xs">
                          <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                              {t('eloRating')}
                            </Text>
                            <Text fw={700}>
                              {getEloIcon(gameStats.elo)} {gameStats.elo}
                            </Text>
                          </Group>
                          <Text size="xs" c="dimmed" ta="center">
                            {getEloRank(gameStats.elo)}
                          </Text>
                        </Stack>
                      ) : null}
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Card>

          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Card padding="lg" withBorder>
              <Title order={2} size="h3" mb="md">
                {t('achievements')}
              </Title>
              <Stack align="center" gap="md" py="md">
                <Text size="3rem" fw={800} lh={1}>
                  {achievementProgress}%
                </Text>
                <Text c="dimmed">
                  {t('unlockedCount', {
                    unlocked: stats.achievementsUnlocked,
                    total: stats.achievementsTotal,
                  })}
                </Text>
                <Progress value={achievementProgress} maw={320} w="100%" color="amanoba" />
              </Stack>
              <Button
                component={LocaleLink}
                href={`/${locale}/achievements`}
                color="amanoba"
                fullWidth
                mt="md"
              >
                {t('viewAllAchievements')}
              </Button>
            </Card>

            <Card padding="lg" withBorder>
              <Title order={2} size="h3" mb="md">
                {t('playTime')}
              </Title>
              <Stack gap="md">
                <Card padding="md" bg="ink.8">
                  <Text size="sm" c="dimmed" mb={4}>
                    {t('totalPlayTime')}
                  </Text>
                  <Text size="xl" fw={700}>
                    {formatTime(stats.overall.totalPlayTime)}
                  </Text>
                </Card>
                <Card padding="md" bg="ink.8">
                  <Group gap="sm">
                    <IconHourglass size={20} />
                    <Stack gap={2}>
                      <Text size="sm" c="dimmed">
                        {t('averageSession')}
                      </Text>
                      <Text size="xl" fw={700}>
                        {formatTime(stats.overall.averageSessionTime)}
                      </Text>
                    </Stack>
                  </Group>
                </Card>
              </Stack>
            </Card>
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
