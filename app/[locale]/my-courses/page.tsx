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
  Box,
  Button,
  Container,
  Group,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { IconBook, IconCheck, IconLibrary } from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';
import { LearnerPageHeader } from '@/app/components/LearnerPageHeader';
import { CourseCard } from '@/app/components/patterns/CourseCard';
import { StateBlock } from '@/app/components/patterns/StateBlock';

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
          <StateBlock
            kind="permission"
            title={tCourses('signInToView')}
            icon={<IconLibrary size={34} />}
            action={(
              <Button component={LocaleLink} href={signInHref} color="amanoba">
                {tAuth('signIn')}
              </Button>
            )}
          />
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
          <StateBlock kind="loading" title={tCourses('loadingCourses')} compact />
        ) : courses.length === 0 ? (
          <StateBlock
            kind="empty"
            title={t('noCoursesEnrolled')}
            description={t('noCoursesEnrolled')}
            icon={<IconLibrary size={34} />}
            action={(
              <Button component={LocaleLink} href="/courses" color="amanoba" leftSection={<IconBook size={18} />}>
                {t('browseCourses')}
              </Button>
            )}
          />
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
            {courses.map((item) => (
              <CourseCard
                key={item.course.courseId}
                title={item.course.name}
                description={item.course.description}
                thumbnail={item.course.thumbnail}
                thumbnailAlt={item.course.name}
                fallbackLabel={item.course.language.toUpperCase()}
                badges={item.progress.isCompleted ? [
                  {
                    label: courseLabel('completed', 'Completed'),
                    color: 'green',
                    leftSection: <IconCheck size={12} />,
                  },
                ] : []}
                progress={{
                  label: courseLabel('progress', 'Progress'),
                  value: item.progress.progressPercentage,
                  detail: (
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
                  ),
                }}
                primaryAction={(
                  <Button component={LocaleLink} href={getCourseDayHref(item.course, item.progress)} color="amanoba" fullWidth>
                    {item.progress.isCompleted
                      ? courseLabel('reviewCourse', 'Review Course')
                      : courseLabel('continueLearning', 'Continue Learning')}
                  </Button>
                )}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}
