'use client';

/**
 * Practice Hub Page
 *
 * What: Learner-facing review shell for the first Practice Hub MVP
 * Why: Exposes bounded review modes and real launch flows from existing Amanoba signals
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import { LearnerPageHeader } from '@/app/components/LearnerPageHeader';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconBook,
  IconBrain,
  IconClipboardText,
  IconCompass,
  IconRocket,
  IconTargetArrow,
} from '@tabler/icons-react';
import { type PracticeContext, parsePracticeContext } from '@/app/lib/practice-hub';

type PracticeModeId = 'continue-next' | 'quiz-recovery' | 'stale-refresh';
type PracticeModeStatus = 'available' | 'empty';

type PracticeRecommendation = {
  mode: PracticeModeId;
  courseId: string;
  courseName: string;
  courseLanguage: string;
  lessonDay: number;
  lessonId?: string;
  title: string;
  reasonLabel: string;
  priorityScore: number;
  sourceSignals: string[];
  actionHref: string;
  actionLabel: string;
  quizAvailable?: boolean;
};

type PracticeMode = {
  id: PracticeModeId;
  title: string;
  description: string;
  status: PracticeModeStatus;
  items: PracticeRecommendation[];
  emptyStateTitle: string;
  emptyStateDescription: string;
};

type PracticeHubResponse = {
  success: boolean;
  summary: {
    availableRecommendationCount: number;
    availableModeCount: number;
    hasWork: boolean;
    nextRecommendation: PracticeRecommendation | null;
  };
  modes: PracticeMode[];
};

function modeIcon(modeId: PracticeModeId) {
  switch (modeId) {
    case 'continue-next':
      return IconRocket;
    case 'quiz-recovery':
      return IconClipboardText;
    case 'stale-refresh':
      return IconBook;
  }
}

export default function PracticeHubPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const tDashboard = useTranslations('dashboard');
  const tCourses = useTranslations('courses');
  const tAuth = useTranslations('auth');
  const hasTrackedView = useRef(false);
  const [launchingKey, setLaunchingKey] = useState<string | null>(null);
  const [practiceHub, setPracticeHub] = useState<PracticeHubResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPracticeHub = useCallback(async () => {
    if (!session) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/practice-hub?locale=${locale}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load Practice Hub');
      }
      setPracticeHub(data as PracticeHubResponse);
    } catch (fetchError) {
      console.error('Failed to fetch Practice Hub:', fetchError);
      setError('Failed to load Practice Hub');
    } finally {
      setLoading(false);
    }
  }, [locale, session]);

  useEffect(() => {
    void fetchPracticeHub();
  }, [fetchPracticeHub]);

  useEffect(() => {
    if (!practiceHub || hasTrackedView.current || !session) return;
    hasTrackedView.current = true;

    void fetch('/api/practice-hub/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'viewed',
        availableRecommendationCount: practiceHub.summary.availableRecommendationCount,
        availableModeCount: practiceHub.summary.availableModeCount,
      }),
    });
  }, [practiceHub, session]);

  const handleRecommendationOpen = useCallback(
    async (item: PracticeRecommendation) => {
      const key = `${item.mode}-${item.courseId}-${item.lessonDay}`;
      setLaunchingKey(key);

      const practiceContext = parsePracticeContext({
        mode: item.mode,
        courseId: item.courseId,
        lessonDay: item.lessonDay,
      }) as PracticeContext;

      try {
        await fetch('/api/practice-hub/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'recommendation_opened',
            practiceContext,
          }),
          keepalive: true,
        });
      } catch (error) {
        console.error('Failed to track Practice Hub recommendation open:', error);
      } finally {
        router.push(item.actionHref);
      }
    },
    [router]
  );

  if (!session) {
    const signInHref = `/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}/practice`)}`;
    return (
      <Box bg="ink.9" mih="100vh" px="md" py="xl">
        <Container size="xs">
          <Card padding="xl" withBorder>
            <Stack gap="md" align="center" ta="center">
              <ThemeIcon color="amanoba" variant="light" size={64} radius="xl">
                <IconBrain size={34} />
              </ThemeIcon>
              <Title order={1} size="h2">Practice Hub</Title>
              <Text c="dimmed">
            Sign in to continue lessons, recover quizzes, and revisit stale learning sessions.
              </Text>
              <Button
                component={LocaleLink}
            href={signInHref}
                color="amanoba"
          >
            {tAuth('signIn')}
              </Button>
            </Stack>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg="ink.9" mih="100vh">
      <LearnerPageHeader
        title="Practice Hub"
        subtitle="Recover unfinished learning, reopen unresolved quizzes, and refresh lessons that have gone cold."
        icon={<IconBrain size={20} />}
      />

      <Container component="main" size="xl" py={{ base: 'lg', sm: 'xl' }}>
        {loading ? (
          <Card padding="xl" withBorder>
            <Group justify="center" gap="sm">
              <Loader size="sm" color="amanoba" />
              <Text fw={700}>Loading Practice Hub...</Text>
            </Group>
          </Card>
        ) : error || !practiceHub ? (
          <Card padding="xl" withBorder>
            <Stack gap="md" align="center" ta="center">
              <Alert color="red" icon={<IconAlertTriangle size={18} />} w="100%">
                Unable to load Practice Hub
              </Alert>
              <Text c="dimmed">
              The review surface could not be loaded right now.
              </Text>
              <Button
              onClick={() => void fetchPracticeHub()}
                color="amanoba"
            >
              {tDashboard('retry')}
              </Button>
            </Stack>
          </Card>
        ) : (
          <Stack gap="xl">
            <Card padding="xl" withBorder>
              <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                <Stack gap="md">
                  <Title order={2} size="h3">
                    Your next best review action
                  </Title>
                  <Text c="dimmed">
                    The Practice Hub only shows explainable actions powered by your real course and quiz progress.
                  </Text>

                  {practiceHub.summary.nextRecommendation ? (
                    <Card padding="lg" withBorder>
                      <Stack gap="md">
                        <Group justify="space-between" align="flex-start" gap="md">
                          <Stack gap={4}>
                            <Text size="sm" fw={700} c="amanoba.7">
                            {practiceHub.summary.nextRecommendation.courseName}
                            </Text>
                            <Title order={3} size="h4">
                            {practiceHub.summary.nextRecommendation.title}
                            </Title>
                          </Stack>
                          <Badge color="amanoba" variant="filled">
                          {practiceHub.summary.nextRecommendation.mode}
                          </Badge>
                        </Group>
                        <Text c="dimmed">
                        {practiceHub.summary.nextRecommendation.reasonLabel}
                        </Text>
                        <Button
                          component={LocaleLink}
                        href={practiceHub.summary.nextRecommendation.actionHref}
                          color="amanoba"
                          leftSection={<IconTargetArrow size={18} />}
                      >
                        {practiceHub.summary.nextRecommendation.actionLabel}
                        </Button>
                      </Stack>
                    </Card>
                  ) : (
                    <Card padding="lg" withBorder>
                      <Stack gap="md">
                        <Title order={3} size="h4">
                        No practice pressure right now
                        </Title>
                        <Text c="dimmed">
                        You do not have any active review actions yet. Start or continue a course to build your next practice queue.
                        </Text>
                        <Button
                          component={LocaleLink}
                        href="/courses"
                          color="amanoba"
                          leftSection={<IconBook size={18} />}
                      >
                        {tDashboard('browseCourses')}
                        </Button>
                      </Stack>
                    </Card>
                  )}
                </Stack>

                <SimpleGrid cols={{ base: 1, sm: 3, lg: 1 }} spacing="md">
                  <Card bg="ink.9" padding="lg" withBorder>
                    <Text c="gray.3" size="sm">Actionable sessions</Text>
                    <Text c="amanoba.5" size="2rem" fw={800}>
                      {practiceHub.summary.availableRecommendationCount}
                    </Text>
                  </Card>
                  <Card bg="ink.9" padding="lg" withBorder>
                    <Text c="gray.3" size="sm">Active review modes</Text>
                    <Text c="amanoba.5" size="2rem" fw={800}>
                      {practiceHub.summary.availableModeCount}
                    </Text>
                  </Card>
                </SimpleGrid>
              </SimpleGrid>
            </Card>

            <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="xl">
              <Stack gap="lg">
                {practiceHub.modes.map((mode) => (
                  <Card key={mode.id} padding="lg" withBorder>
                    <Stack gap="md">
                      <Group justify="space-between" align="flex-start" gap="md">
                        <Stack gap={4}>
                          <Group gap="xs">
                            <ThemeIcon color="amanoba" variant="light" radius="xl">
                              {(() => {
                                const ModeIcon = modeIcon(mode.id);
                                return <ModeIcon size={18} />;
                              })()}
                            </ThemeIcon>
                            <Title order={2} size="h3">
                          {mode.title}
                            </Title>
                          </Group>
                          <Text c="dimmed">{mode.description}</Text>
                        </Stack>
                        <Badge color={mode.status === 'available' ? 'amanoba' : 'gray'} variant={mode.status === 'available' ? 'filled' : 'light'}>
                        {mode.status === 'available'
                          ? 'Ready'
                          : 'Empty'}
                        </Badge>
                      </Group>

                    {mode.items.length > 0 ? (
                        <Stack gap="md">
                        {mode.items.map((item) => (
                            <Card key={`${item.mode}-${item.courseId}-${item.lessonDay}`} padding="md" withBorder>
                              <Group justify="space-between" align="flex-start" gap="md">
                                <Stack gap={4} flex={1}>
                                  <Text size="sm" fw={700} c="amanoba.7">
                                  {item.courseName}
                                  </Text>
                                  <Title order={3} size="h4">
                                  {item.title}
                                  </Title>
                                  <Text size="sm" c="dimmed">
                                  {item.reasonLabel}
                                  </Text>
                                  <Text size="xs" c="dimmed">
                                  {tCourses('dayNumber', { day: item.lessonDay })}
                                  </Text>
                                </Stack>
                                <Button
                                onClick={() => void handleRecommendationOpen(item)}
                                  loading={launchingKey === `${item.mode}-${item.courseId}-${item.lessonDay}`}
                                  color="amanoba"
                                  leftSection={<IconTargetArrow size={18} />}
                              >
                                {launchingKey === `${item.mode}-${item.courseId}-${item.lessonDay}` ? 'Opening...' : item.actionLabel}
                                </Button>
                              </Group>
                            </Card>
                        ))}
                        </Stack>
                    ) : (
                        <Card padding="md" withBorder>
                          <Stack gap="xs">
                            <Title order={3} size="h4">
                          {mode.emptyStateTitle}
                            </Title>
                            <Text c="dimmed">
                          {mode.emptyStateDescription}
                            </Text>
                          </Stack>
                        </Card>
                    )}
                    </Stack>
                  </Card>
                ))}
              </Stack>

              <Stack gap="lg">
                <Card padding="lg" withBorder>
                  <Stack gap="md">
                    <Group gap="xs">
                      <ThemeIcon color="amanoba" variant="light" radius="xl">
                        <IconCompass size={18} />
                      </ThemeIcon>
                      <Title order={2} size="h3">
                    How this hub decides
                      </Title>
                    </Group>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed">Continue Next uses your next unfinished lesson day.</Text>
                      <Text size="sm" c="dimmed">Quiz Recovery only surfaces completed lesson days with unresolved quiz completion markers.</Text>
                      <Text size="sm" c="dimmed">Stale Refresh only appears after a course has been untouched long enough to justify a revisit.</Text>
                    </Stack>
                  </Stack>
                </Card>
              </Stack>
            </SimpleGrid>
          </Stack>
        )}
      </Container>
    </Box>
  );
}
