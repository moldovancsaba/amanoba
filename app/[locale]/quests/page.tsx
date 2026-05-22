'use client';

/**
 * Quests Page
 *
 * Why: Provide multi-step storyline challenges for extended engagement.
 * What: Shows active and available quests with step-by-step progression.
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Grid,
  Group,
  Loader,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconBolt,
  IconChevronLeft,
  IconCircle,
  IconCircleCheck,
  IconGift,
  IconLock,
  IconMap,
  IconSparkles,
  IconStar,
  IconTarget,
  IconTrophy,
} from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';

interface QuestStep {
  stepNumber: number;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
}

interface Quest {
  _id: string;
  name: string;
  description: string;
  storyline?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  steps: QuestStep[];
  totalSteps: number;
  currentStep: number;
  rewards: {
    points: number;
    xp: number;
    title?: string;
  };
  isActive: boolean;
  isCompleted: boolean;
  completedAt?: string;
  isPremiumOnly: boolean;
}

const DIFFICULTY_COLORS = {
  easy: 'green',
  medium: 'cyan',
  hard: 'violet',
  expert: 'red',
};

export default function QuestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('quests');
  const tCommon = useTranslations('common');
  const tDashboard = useTranslations('dashboard');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

    const fetchQuests = async () => {
      try {
        const user = session.user as { id?: string; playerId?: string; isPremium?: boolean };
        const playerId = user.playerId || user.id;
        setIsPremium(user.isPremium || false);

        const response = await fetch(`/api/quests?playerId=${playerId}`);

        if (!response.ok) {
          throw new Error('Failed to load quests');
        }

        const data = await response.json();
        setQuests(data.quests || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void fetchQuests();
  }, [session, status, router, locale]);

  const getQuestProgress = (quest: Quest): number => {
    return Math.round((quest.currentStep / quest.totalSteps) * 100);
  };

  if (loading || status === 'loading') {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="xs" py="xl">
        <Card withBorder>
          <Stack align="center">
            <Alert color="red" title={t('unableToLoad')}>
              {error}
            </Alert>
            <Button component={LocaleLink} href="/dashboard">
              {tDashboard('backToDashboard')}
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  const activeQuests = quests.filter(q => q.isActive && !q.isCompleted);
  const availableQuests = quests.filter(q => !q.isActive && !q.isCompleted);
  const completedQuests = quests.filter(q => q.isCompleted);

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <Group align="flex-start">
            <ThemeIcon size="xl" variant="light">
              <IconMap size={30} />
            </ThemeIcon>
            <div>
              <Title order={1}>{t('questLog')}</Title>
              <Text c="dimmed">{t('description')}</Text>
            </div>
          </Group>
          <Button component={LocaleLink} href="/dashboard" variant="default" leftSection={<IconChevronLeft size={18} />}>
            {tCommon('dashboard')}
          </Button>
        </Group>

        <Grid>
          {[
            { icon: <IconTarget size={24} />, value: activeQuests.length, label: t('active') },
            { icon: <IconSparkles size={24} />, value: availableQuests.length, label: t('available') },
            { icon: <IconTrophy size={24} />, value: completedQuests.length, label: t('completed') },
          ].map((item) => (
            <Grid.Col key={item.label} span={{ base: 12, md: 4 }}>
              <Card withBorder>
                <ThemeIcon variant="light">{item.icon}</ThemeIcon>
                <Title order={2}>{item.value}</Title>
                <Text c="dimmed">{item.label}</Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {activeQuests.length > 0 ? (
          <Stack gap="md">
            <Group>
              <IconSparkles size={24} />
              <Title order={2}>{t('activeQuests', { count: activeQuests.length })}</Title>
            </Group>
            {activeQuests.map(quest => {
              const progress = getQuestProgress(quest);
              return (
                <Card key={quest._id} withBorder>
                  <Stack gap="lg">
                    <Group justify="space-between" align="flex-start">
                      <div>
                        <Group>
                          <Title order={3}>{quest.name}</Title>
                          <Badge color={DIFFICULTY_COLORS[quest.difficulty]}>{quest.difficulty}</Badge>
                          {quest.isPremiumOnly ? <Badge color="yellow">Premium</Badge> : null}
                        </Group>
                        <Text c="dimmed">{quest.description}</Text>
                        {quest.storyline ? <Text size="sm" c="dimmed" fs="italic">{quest.storyline}</Text> : null}
                      </div>
                      <Stack gap={0} align="flex-end">
                        <Title order={3}>{quest.currentStep}/{quest.totalSteps}</Title>
                        <Text size="sm" c="dimmed">{t('steps')}</Text>
                      </Stack>
                    </Group>
                    <Progress value={progress} />
                    <Stack gap="sm">
                      <Title order={4}>Quest Steps</Title>
                      {quest.steps.map((step, index) => {
                        const current = index === quest.currentStep && !step.isCompleted;
                        return (
                          <Card key={index} withBorder>
                            <Group align="flex-start">
                              {step.isCompleted ? <IconCircleCheck color="var(--mantine-color-green-6)" /> : <IconCircle />}
                              <div>
                                <Group gap="xs">
                                  <Text fw={600}>Step {step.stepNumber}</Text>
                                  {current ? <Badge>Current</Badge> : null}
                                </Group>
                                <Text c={step.isCompleted ? 'green' : 'dimmed'}>{step.description}</Text>
                                {step.completedAt ? (
                                  <Text size="xs" c="dimmed">Completed {new Date(step.completedAt).toLocaleString()}</Text>
                                ) : null}
                              </div>
                            </Group>
                          </Card>
                        );
                      })}
                    </Stack>
                    <Group>
                      <Badge leftSection={<IconGift size={14} />}>{quest.rewards.points} Points</Badge>
                      <Badge leftSection={<IconBolt size={14} />}>{quest.rewards.xp} XP</Badge>
                      {quest.rewards.title ? <Badge leftSection={<IconStar size={14} />}>Title: {quest.rewards.title}</Badge> : null}
                    </Group>
                    <Button component={LocaleLink} href="/games" fullWidth>
                      Continue Quest
                    </Button>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        ) : null}

        {availableQuests.length > 0 ? (
          <Stack gap="md">
            <Title order={2}>Available Quests ({availableQuests.length})</Title>
            <Grid>
              {availableQuests.map(quest => {
                const isLocked = quest.isPremiumOnly && !isPremium;
                return (
                  <Grid.Col key={quest._id} span={{ base: 12, md: 6 }}>
                    <Card withBorder opacity={isLocked ? 0.6 : 1}>
                      <Stack gap="md">
                        <Group justify="space-between">
                          <Title order={3}>{quest.name}</Title>
                          {isLocked ? <IconLock size={20} /> : <Badge color={DIFFICULTY_COLORS[quest.difficulty]}>{quest.difficulty}</Badge>}
                        </Group>
                        <Text c="dimmed">{quest.description}</Text>
                        <Group>
                          <Badge leftSection={<IconTrophy size={14} />}>{quest.rewards.points} pts</Badge>
                          <Badge leftSection={<IconBolt size={14} />}>{quest.rewards.xp} XP</Badge>
                        </Group>
                        <Button disabled={isLocked} fullWidth>
                          {isLocked ? 'Premium Only' : 'Start Quest'}
                        </Button>
                      </Stack>
                    </Card>
                  </Grid.Col>
                );
              })}
            </Grid>
          </Stack>
        ) : null}

        {completedQuests.length > 0 ? (
          <Stack gap="md">
            <Group>
              <IconTrophy size={24} />
              <Title order={2}>Completed Quests ({completedQuests.length})</Title>
            </Group>
            <Grid>
              {completedQuests.map(quest => (
                <Grid.Col key={quest._id} span={{ base: 12, md: 6 }}>
                  <Card withBorder>
                    <Group justify="space-between" align="flex-start">
                      <div>
                        <Title order={3}>{quest.name}</Title>
                        <Text c="dimmed" size="sm">{quest.description}</Text>
                        <Text c="green" size="sm" fw={600}>{quest.totalSteps} Steps Completed</Text>
                        {quest.completedAt ? <Text size="xs" c="dimmed">Completed {new Date(quest.completedAt).toLocaleDateString()}</Text> : null}
                      </div>
                      <IconCircleCheck color="var(--mantine-color-green-6)" />
                    </Group>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        ) : null}

        {quests.length === 0 ? (
          <Card withBorder p="xl">
            <Stack align="center">
              <Text size="xl">🗺️</Text>
              <Title order={3}>No Quests Available</Title>
              <Text c="dimmed" ta="center">New quests are added regularly. Check back soon for epic adventures.</Text>
              <Button component={LocaleLink} href="/games">Play Games</Button>
            </Stack>
          </Card>
        ) : null}
      </Stack>
    </Container>
  );
}
