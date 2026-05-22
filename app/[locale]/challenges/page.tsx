'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Badge,
  Button,
  Card,
  Center,
  Container,
  Grid,
  Group,
  Loader,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconBolt,
  IconCalendar,
  IconChevronLeft,
  IconClock,
  IconGift,
  IconMoodSad,
  IconRefresh,
  IconTarget,
  IconTrophy,
} from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';

interface Challenge {
  _id: string;
  name: string;
  description: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  targetValue: number;
  currentProgress: number;
  rewards: {
    points: number;
    xp: number;
  };
  expiresAt: string;
  isCompleted: boolean;
  completedAt?: string;
}

const difficultyColor: Record<Challenge['difficulty'], string> = {
  easy: 'green',
  medium: 'yellow',
  hard: 'orange',
  expert: 'red',
};

export default function ChallengesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('challenges');
  const tCommon = useTranslations('common');
  const tDashboard = useTranslations('dashboard');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = useCallback(async () => {
    if (!session) return;

    try {
      const user = session.user as { id?: string; playerId?: string };
      const playerId = user.playerId || user.id;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`/api/challenges?playerId=${playerId}&t=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch challenges:', response.status, errorText);
        throw new Error(`Failed to load challenges: ${response.status}`);
      }

      const data = await response.json();
      setChallenges(data.challenges || []);
      setError(null);
    } catch (err) {
      console.error('Challenge fetch error:', err);
      setError(err instanceof Error && err.name === 'AbortError'
        ? 'Request timed out. Please try again.'
        : err instanceof Error ? err.message : 'Failed to load challenges');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

    fetchChallenges();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') fetchChallenges();
    };
    const handleFocus = () => fetchChallenges();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchChallenges, locale, router, session, status]);

  const refreshChallenges = () => {
    setLoading(true);
    fetchChallenges();
  };

  const getTimeRemaining = (expiresAt: string): string => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  if (loading || status === 'loading') {
    return (
      <Center mih="70vh">
        <Stack align="center" gap="md">
          <Loader />
          <Text size="lg">{t('loading')}</Text>
        </Stack>
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="sm" py="xl">
        <Card withBorder p="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size="xl" variant="light" color="gray">
              <IconMoodSad />
            </ThemeIcon>
            <Title order={2}>{t('unableToLoad')}</Title>
            <Text c="dimmed" ta="center">{error}</Text>
            <Button component={LocaleLink} href="/dashboard" leftSection={<IconChevronLeft size={18} />}>
              {tDashboard('backToDashboard')}
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  const activeChallenges = challenges.filter((challenge) => !challenge.isCompleted);
  const completedChallenges = challenges.filter((challenge) => challenge.isCompleted);
  const earnedPoints = completedChallenges.reduce((sum, challenge) => sum + challenge.rewards.points, 0);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <Group gap="md">
            <ThemeIcon size="xl" variant="light">
              <IconCalendar />
            </ThemeIcon>
            <Stack gap={4}>
              <Title order={1}>{t('dailyChallenges')}</Title>
              <Text c="dimmed">{t('description')}</Text>
            </Stack>
          </Group>
          <Group gap="sm">
            <Button variant="default" leftSection={<IconRefresh size={18} />} onClick={refreshChallenges}>
              {tCommon('refresh')}
            </Button>
            <Button component={LocaleLink} href="/dashboard" variant="default" leftSection={<IconChevronLeft size={18} />}>
              {tCommon('dashboard')}
            </Button>
          </Group>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <StatCard icon={<IconTarget />} label={t('active')} value={activeChallenges.length.toLocaleString()} />
          <StatCard icon={<IconTrophy />} label={t('completed')} value={completedChallenges.length.toLocaleString()} />
          <StatCard icon={<IconGift />} label={t('points')} value={earnedPoints.toLocaleString()} />
        </SimpleGrid>

        {activeChallenges.length > 0 && (
          <ChallengeSection title={`${t('active')} ${t('title')} (${activeChallenges.length})`} icon={<IconTarget />}>
            {activeChallenges.map((challenge) => {
              const progress = getProgressPercentage(challenge.currentProgress, challenge.targetValue);
              const timeLeft = getTimeRemaining(challenge.expiresAt);

              return (
                <Grid.Col key={challenge._id} span={{ base: 12, md: 6 }}>
                  <Card withBorder p="lg" h="100%">
                    <Stack gap="md">
                      <Group justify="space-between" align="flex-start">
                        <Badge
                          color={difficultyColor[challenge.difficulty]}
                          variant="light"
                        >
                          {challenge.difficulty.toUpperCase()}
                        </Badge>
                        <Badge color="gray" variant="outline" leftSection={<IconClock size={12} />}>
                          {timeLeft} remaining
                        </Badge>
                      </Group>
                      <Stack gap={4}>
                        <Title order={3}>{challenge.name}</Title>
                        <Text c="dimmed" size="sm">{challenge.description}</Text>
                      </Stack>
                      <Stack gap={4}>
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">Progress</Text>
                          <Text size="sm" fw={700}>{challenge.currentProgress} / {challenge.targetValue}</Text>
                        </Group>
                        <Progress value={progress} color={difficultyColor[challenge.difficulty]} />
                      </Stack>
                      <Group justify="space-between" mt="auto">
                        <Group gap="xs">
                          <Badge variant="light" leftSection={<IconGift size={12} />}>
                            {challenge.rewards.points} pts
                          </Badge>
                          <Badge color="gray" variant="light" leftSection={<IconBolt size={12} />}>
                            {challenge.rewards.xp} XP
                          </Badge>
                        </Group>
                        <Button component={LocaleLink} href="/games" size="sm">
                          Play Now
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              );
            })}
          </ChallengeSection>
        )}

        {completedChallenges.length > 0 && (
          <ChallengeSection title={`${t('completed')} (${completedChallenges.length})`} icon={<IconTrophy />}>
            {completedChallenges.map((challenge) => (
              <Grid.Col key={challenge._id} span={{ base: 12, md: 6 }}>
                <Card withBorder p="lg" h="100%">
                  <Stack gap="md">
                    <Group justify="space-between" align="flex-start">
                      <Badge color="green" variant="light" leftSection={<IconTrophy size={12} />}>
                        {t('complete')}
                      </Badge>
                      {challenge.completedAt && (
                        <Text size="xs" c="dimmed">
                          {new Date(challenge.completedAt).toLocaleTimeString()}
                        </Text>
                      )}
                    </Group>
                    <Stack gap={4}>
                      <Title order={3}>{challenge.name}</Title>
                      <Text c="dimmed" size="sm">{challenge.description}</Text>
                    </Stack>
                    <Group gap="xs" mt="auto">
                      <Badge variant="light" leftSection={<IconGift size={12} />}>
                        +{challenge.rewards.points} pts
                      </Badge>
                      <Badge color="gray" variant="light" leftSection={<IconBolt size={12} />}>
                        +{challenge.rewards.xp} XP
                      </Badge>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            ))}
          </ChallengeSection>
        )}

        {challenges.length === 0 && (
          <Card withBorder p="xl">
            <Stack align="center" gap="sm">
              <ThemeIcon size="xl" variant="light" color="gray">
                <IconCalendar />
              </ThemeIcon>
              <Title order={3}>{t('noChallenges')}</Title>
              <Text c="dimmed" ta="center">{t('checkBackLater')}</Text>
              <Button component={LocaleLink} href="/games">
                {tCommon('games')}
              </Button>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Card withBorder p="lg">
      <Stack gap="xs">
        <ThemeIcon variant="light">{icon}</ThemeIcon>
        <Title order={2}>{value}</Title>
        <Text c="dimmed">{label}</Text>
      </Stack>
    </Card>
  );
}

function ChallengeSection({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: ReactNode;
  title: string;
}) {
  return (
    <Stack gap="md">
      <Group gap="sm">
        <ThemeIcon variant="light">{icon}</ThemeIcon>
        <Title order={2}>{title}</Title>
      </Group>
      <Grid>{children}</Grid>
    </Stack>
  );
}
