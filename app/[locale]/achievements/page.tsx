'use client';

import { useEffect, useState, type ReactNode } from 'react';
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
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconBolt,
  IconChevronLeft,
  IconDiamond,
  IconLock,
  IconMoodSad,
  IconRosetteDiscountCheck,
  IconSparkles,
  IconStar,
  IconTrophy,
} from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  xp: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  progressPercentage?: number;
}

interface AchievementsData {
  achievements: Achievement[];
  stats: {
    total: number;
    unlocked: number;
    percentage: number;
  };
}

const tierColor: Record<Achievement['tier'], string> = {
  bronze: 'orange',
  silver: 'gray',
  gold: 'yellow',
  platinum: 'violet',
};

export default function AchievementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('achievements');
  const tCommon = useTranslations('common');
  const tDashboard = useTranslations('dashboard');
  const [achievementsData, setAchievementsData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

    const fetchAchievements = async () => {
      try {
        const user = session.user as { id?: string; playerId?: string };
        const playerId = user.playerId || user.id;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`/api/players/${playerId}/achievements?t=${Date.now()}`, {
          cache: 'no-store',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch achievements:', response.status, errorText);
          throw new Error(`Failed to load achievements: ${response.status}`);
        }

        const data = await response.json();
        setAchievementsData(data);
      } catch (err) {
        console.error('Achievement fetch error:', err);
        setError(err instanceof Error && err.name === 'AbortError'
          ? 'Request timed out. Please try again.'
          : err instanceof Error ? err.message : 'Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [session, status, router, locale]);

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

  if (error || !achievementsData) {
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

  const { achievements, stats } = achievementsData;
  const categories = ['all', ...new Set(achievements.map((achievement) => achievement.category))];
  const filteredAchievements = filterCategory === 'all'
    ? achievements
    : achievements.filter((achievement) => achievement.category === filterCategory);
  const unlockedAchievements = filteredAchievements.filter((achievement) => achievement.isUnlocked);
  const lockedAchievements = filteredAchievements.filter((achievement) => !achievement.isUnlocked);
  const earnedPoints = achievements
    .filter((achievement) => achievement.isUnlocked)
    .reduce((sum, achievement) => sum + achievement.points, 0);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <Group gap="md">
            <ThemeIcon size="xl" variant="light">
              <IconTrophy />
            </ThemeIcon>
            <Stack gap={4}>
              <Title order={1}>{t('title')}</Title>
              <Text c="dimmed">{t('description')}</Text>
            </Stack>
          </Group>
          <Button component={LocaleLink} href="/dashboard" variant="default" leftSection={<IconChevronLeft size={18} />}>
            {tCommon('dashboard')}
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <StatCard icon={<IconTrophy />} label={t('unlockedCount')} value={`${stats.unlocked}/${stats.total}`} />
          <StatCard icon={<IconStar />} label={t('complete')} value={`${stats.percentage}%`} />
          <StatCard icon={<IconDiamond />} label={t('pointsEarned')} value={earnedPoints.toLocaleString()} />
        </SimpleGrid>

        <Card withBorder p="md">
          <SegmentedControl
            value={filterCategory}
            onChange={setFilterCategory}
            data={categories.map((category) => ({
              value: category,
              label: category === 'all' ? 'All' : category,
            }))}
          />
        </Card>

        <AchievementSection
          title={`${t('unlocked')} (${unlockedAchievements.length})`}
          icon={<IconRosetteDiscountCheck />}
          achievements={unlockedAchievements}
          empty={false}
          t={t}
        />

        <AchievementSection
          title={`${t('locked')} (${lockedAchievements.length})`}
          icon={<IconLock />}
          achievements={lockedAchievements}
          empty={false}
          t={t}
        />

        {filteredAchievements.length === 0 && (
          <Card withBorder p="xl">
            <Stack align="center" gap="sm">
              <ThemeIcon size="xl" variant="light">
                <IconSparkles />
              </ThemeIcon>
              <Title order={3}>{t('noAchievements')}</Title>
              <Text c="dimmed" ta="center">{t('checkBackLater')}</Text>
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

function AchievementSection({
  achievements,
  icon,
  title,
  t,
}: {
  achievements: Achievement[];
  empty: boolean;
  icon: ReactNode;
  title: string;
  t: (key: string) => string;
}) {
  if (achievements.length === 0) return null;

  return (
    <Stack gap="md">
      <Group gap="sm">
        <ThemeIcon variant="light">{icon}</ThemeIcon>
        <Title order={2}>{title}</Title>
      </Group>
      <Grid>
        {achievements.map((achievement) => (
          <Grid.Col key={achievement.id} span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder p="lg" h="100%">
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Text size="xl">{achievement.icon}</Text>
                  <Badge
                    color={achievement.isUnlocked ? 'green' : 'gray'}
                    variant={achievement.isUnlocked ? 'light' : 'outline'}
                    leftSection={achievement.isUnlocked ? <IconRosetteDiscountCheck size={12} /> : <IconLock size={12} />}
                  >
                    {achievement.isUnlocked ? t('unlocked') : t('locked')}
                  </Badge>
                </Group>
                <Badge color={tierColor[achievement.tier]} variant="light">
                  {achievement.tier.toUpperCase()}
                </Badge>
                <Stack gap={4}>
                  <Title order={3}>{achievement.name}</Title>
                  <Text c="dimmed" size="sm">{achievement.description}</Text>
                </Stack>
                {achievement.progressPercentage !== undefined && achievement.progressPercentage > 0 && !achievement.isUnlocked && (
                  <Stack gap={4}>
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">Progress</Text>
                      <Text size="xs" fw={700}>{achievement.progressPercentage}%</Text>
                    </Group>
                    <Progress value={achievement.progressPercentage} />
                  </Stack>
                )}
                <Group justify="space-between" mt="auto">
                  <Badge variant="light" leftSection={<IconDiamond size={12} />}>
                    {achievement.points} pts
                  </Badge>
                  <Badge color="gray" variant="light" leftSection={<IconBolt size={12} />}>
                    {achievement.xp} XP
                  </Badge>
                </Group>
                {achievement.unlockedAt && (
                  <Text size="xs" c="dimmed">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </Text>
                )}
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
}
