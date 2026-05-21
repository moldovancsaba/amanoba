'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
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
import { IconArrowLeft, IconBookmark, IconClock, IconLibrary } from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';

type SavedLessonItem = {
  course: {
    courseId: string;
    name: string;
    description: string;
    language: string;
    thumbnail?: string;
    durationDays: number;
  };
  lesson: {
    dayNumber: number;
    lessonId: string | null;
    title: string;
  };
  savedAt: string;
  progress: {
    currentDay: number;
    completedDays: number;
    isSavedLessonCompleted: boolean;
    lastAccessedAt: string | null;
    resumeDay: number;
    resumeHref: string;
    savedLessonHref: string;
  };
};

export default function SavedLessonsPage() {
  const { data: session, status } = useSession();
  const [savedLessons, setSavedLessons] = useState<SavedLessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedLessons = async () => {
      if (status === 'loading') return;
      if (!session?.user) {
        setError('Please sign in to view saved lessons.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/saved-lessons', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load saved lessons');
        }
        setSavedLessons(data.savedLessons || []);
      } catch (savedLessonsError) {
        console.error('Failed to fetch saved lessons:', savedLessonsError);
        setError('Failed to load saved lessons.');
      } finally {
        setLoading(false);
      }
    };

    void fetchSavedLessons();
  }, [session?.user, status]);

  return (
    <Box bg="ink.9" mih="100vh">
      <Paper component="header" bg="ink.8" radius={0} withBorder>
        <Container size="lg" py={{ base: 'md', sm: 'lg' }}>
          <Group justify="space-between" gap="md">
            <Group gap="md" wrap="nowrap" style={{ minWidth: 0 }}>
              <Logo size="sm" showText={false} linkTo={session?.user ? '/dashboard' : '/'} />
              <Stack gap={2}>
                <Title order={1} size="h2" c="white">Saved Lessons</Title>
                <Text size="sm" c="gray.3">A focused library for lessons you want to revisit or resume.</Text>
              </Stack>
            </Group>
            <Button
              component={LocaleLink}
            href="/dashboard"
              variant="outline"
              color="gray"
              leftSection={<IconArrowLeft size={18} />}
          >
            Back to Dashboard
            </Button>
          </Group>
        </Container>
      </Paper>

      <Container component="main" size="lg" py={{ base: 'lg', sm: 'xl' }}>
        {loading ? (
          <Card padding="xl" withBorder>
            <Group justify="center" gap="sm">
              <Loader color="amanoba" size="sm" />
              <Text fw={700}>Loading saved lessons...</Text>
            </Group>
          </Card>
        ) : error ? (
          <Card padding="xl" withBorder>
            <Stack gap="md" align="center">
              <Alert color="red" w="100%">{error}</Alert>
              <Button
                component={LocaleLink}
              href="/dashboard"
                color="amanoba"
            >
              Return to dashboard
              </Button>
            </Stack>
          </Card>
        ) : savedLessons.length === 0 ? (
          <Card padding="xl" withBorder>
            <Stack gap="md" align="center" ta="center">
              <ThemeIcon color="amanoba" variant="light" size={64} radius="xl">
                <IconLibrary size={34} />
              </ThemeIcon>
              <Title order={2} size="h3">No saved lessons yet</Title>
              <Text c="dimmed">
              Save lesson days when you want to come back to them intentionally.
              </Text>
              <Button
                component={LocaleLink}
              href="/my-courses"
                color="amanoba"
            >
              Browse my courses
              </Button>
            </Stack>
          </Card>
        ) : (
          <Stack gap="md">
            {savedLessons.map((item) => (
              <Card
                key={`${item.course.courseId}-${item.lesson.dayNumber}`}
                padding="lg"
                withBorder
              >
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                  <Stack gap="sm">
                    <Badge color="amanoba" variant="light" leftSection={<IconBookmark size={14} />}>
                      Saved for review
                    </Badge>
                    <Title order={2} size="h3">{item.course.name}</Title>
                    <Text c="dimmed">
                      Day {item.lesson.dayNumber}: {item.lesson.title}
                    </Text>
                    <Text c="dimmed" size="sm" lineClamp={2}>
                      {item.course.description}
                    </Text>
                    <Group gap="md">
                      <Text size="sm" c="dimmed">{item.progress.completedDays} days completed</Text>
                      <Text size="sm" c="dimmed">Current course day: {item.progress.currentDay}</Text>
                      <Badge color="gray" variant="light" leftSection={<IconClock size={14} />}>
                        Saved {new Date(item.savedAt).toLocaleDateString('hu-HU')}
                      </Badge>
                    </Group>
                  </Stack>

                  <Stack gap="sm" justify="center">
                    <Button
                      component={LocaleLink}
                      href={item.progress.savedLessonHref}
                      color="amanoba"
                      fullWidth
                    >
                      Open saved lesson
                    </Button>
                    <Button
                      component={LocaleLink}
                      href={item.progress.resumeHref}
                      variant="outline"
                      color="gray"
                      fullWidth
                    >
                      Resume course
                    </Button>
                    {item.progress.isSavedLessonCompleted ? (
                      <Text ta="center" size="xs" c="dimmed" fw={600}>
                        This saved lesson is already completed. Keep it for review or jump back into the course.
                      </Text>
                    ) : null}
                  </Stack>
                </SimpleGrid>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
