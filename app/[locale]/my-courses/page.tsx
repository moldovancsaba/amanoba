/**
 * My Courses Page
 *
 * What: User dashboard showing enrolled courses and progress.
 * Why: Allows users to track their learning progress.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Image,
  Loader,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconBook, IconCheck, IconLibrary } from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';
import { LearnerPageHeader } from '@/app/components/LearnerPageHeader';

interface CourseProgress {
  course: {
    courseId: string;
    name: string;
    description: string;
    thumbnail?: string;
    language: string;
    durationDays: number;
  };
  progress: {
    currentDay: number;
    completedDays: number;
    totalDays: number;
    progressPercentage: number;
    isCompleted: boolean;
    startedAt: string;
    lastActivityAt: string;
  };
}

function getCourseDayHref(course: CourseProgress['course'], progress: CourseProgress['progress']) {
  const safeTotalDays = Math.max(progress.totalDays || 1, 1);
  const requestedDay = progress.isCompleted
    ? safeTotalDays
    : Math.min(Math.max(progress.currentDay || 1, 1), safeTotalDays);
  return `/${course.language}/courses/${course.courseId}/day/${requestedDay}`;
}

export default function MyCoursesPage() {
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations('dashboard');
  const tCourses = useTranslations('courses');
  const tAuth = useTranslations('auth');
  const signInHref = `/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}/my-courses`)}`;
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const courseLabel = (key: string, fallback: string, values?: Record<string, string | number>) => {
    const out = values ? tCourses(key, values as Record<string, string | number>) : tCourses(key);
    if (typeof out !== 'string') return fallback;
    if (out === key || out === `courses.${key}`) return fallback;
    return out;
  };

  const fetchMyCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/my-courses?locale=${locale}`);
      const data = await response.json();
      if (data.success) setCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to fetch my courses:', error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    if (session) void fetchMyCourses();
  }, [session, fetchMyCourses]);

  if (!session) {
    return (
      <Box bg="ink.9" mih="100vh" px="md" py="xl">
        <Container size="xs">
          <Card padding="xl" withBorder>
            <Stack align="center" ta="center" gap="md">
              <ThemeIcon color="amanoba" variant="light" size={64} radius="xl">
                <IconLibrary size={34} />
              </ThemeIcon>
              <Title order={1} size="h2">{tCourses('signInToView')}</Title>
              <Button component={LocaleLink} href={signInHref} color="amanoba">
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
        title={tCourses('myCourses')}
        subtitle={t('trackLearningProgress')}
        icon={<IconBook size={20} />}
      />

      <Container component="main" size="xl" py={{ base: 'lg', sm: 'xl' }}>
        {loading ? (
          <Card padding="xl" withBorder>
            <Group justify="center" gap="sm">
              <Loader color="amanoba" size="sm" />
              <Text fw={700}>{tCourses('loadingCourses')}</Text>
            </Group>
          </Card>
        ) : courses.length === 0 ? (
          <Card padding="xl" withBorder>
            <Stack gap="md" align="center" ta="center">
              <ThemeIcon color="amanoba" variant="light" size={64} radius="xl">
                <IconLibrary size={34} />
              </ThemeIcon>
              <Title order={2} size="h3">{t('noCoursesEnrolled')}</Title>
              <Text c="dimmed">{t('noCoursesEnrolled')}</Text>
              <Button component={LocaleLink} href="/courses" color="amanoba" leftSection={<IconBook size={18} />}>
                {t('browseCourses')}
              </Button>
            </Stack>
          </Card>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
            {courses.map((item) => (
              <Card key={item.course.courseId} padding="lg" withBorder>
                <Stack gap="md" h="100%">
                  {item.course.thumbnail ? (
                    <Image src={item.course.thumbnail} alt={item.course.name} h={180} fit="cover" radius="md" />
                  ) : null}

                  <Stack gap="xs" flex={1}>
                    <Group justify="space-between" align="flex-start" gap="xs">
                      <Title order={2} size="h3">{item.course.name}</Title>
                      {item.progress.isCompleted ? (
                        <Badge color="green" leftSection={<IconCheck size={12} />}>
                          {courseLabel('completed', 'Completed')}
                        </Badge>
                      ) : null}
                    </Group>
                    <Text c="dimmed" size="sm" lineClamp={2}>{item.course.description}</Text>
                  </Stack>

                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">{courseLabel('progress', 'Progress')}</Text>
                      <Text size="sm" fw={700}>{item.progress.progressPercentage}%</Text>
                    </Group>
                    <Progress value={item.progress.progressPercentage} color="amanoba" size="md" radius="xl" />
                    <Group justify="space-between" gap="xs">
                      <Text size="xs" c="dimmed">
                        {courseLabel('dayOf', `Day ${item.progress.currentDay} of ${item.progress.totalDays}`, {
                          currentDay: item.progress.currentDay,
                          totalDays: item.progress.totalDays,
                        })}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {courseLabel('daysCompleted', `${item.progress.completedDays} days completed`, {
                          count: item.progress.completedDays,
                        })}
                      </Text>
                    </Group>
                  </Stack>

                  <Button component={LocaleLink} href={getCourseDayHref(item.course, item.progress)} color="amanoba" fullWidth>
                    {item.progress.isCompleted
                      ? courseLabel('reviewCourse', 'Review Course')
                      : courseLabel('continueLearning', 'Continue Learning')}
                  </Button>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}
