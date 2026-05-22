/**
 * Course catalog page.
 *
 * Shows learner-facing courses with Mantine-only controls, loading states, and enrolment actions.
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Image as MantineImage,
  MultiSelect,
  Paper,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconBook,
  IconCertificate,
  IconCreditCard,
  IconLanguage,
  IconRefresh,
  IconSearch,
  IconStar,
  IconThumbUp,
  IconTrophy,
} from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';
import { LearnerPageHeader } from '@/app/components/LearnerPageHeader';
import { COURSE_LANGUAGE_OPTIONS, type CourseLanguageCode } from '@/app/lib/constants/course-languages';
import { trackGAEvent } from '@/app/lib/analytics/ga-events';

interface Course {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  language: string;
  thumbnail?: string | null;
  isActive: boolean;
  requiresPremium: boolean;
  price?: {
    amount: number;
    currency: string;
  };
  durationDays: number;
  pointsConfig: {
    completionPoints: number;
    lessonPoints: number;
  };
  xpConfig: {
    completionXP: number;
    lessonXP: number;
  };
  certification?: {
    enabled?: boolean;
  };
  voteAggregate?: { up: number; down: number; score: number; count: number };
  prerequisiteCourses?: Array<{ courseId: string; name?: string }>;
  prerequisiteEnforcement?: 'hard' | 'soft';
}

interface MyCourseProgress {
  course: {
    courseId: string;
    language: string;
    name: string;
  };
  progress: {
    currentDay: number;
    completedDays: number;
    totalDays: number;
    progressPercentage: number;
    isCompleted: boolean;
  };
}

const languageLabels = new Map(COURSE_LANGUAGE_OPTIONS.map((option) => [option.code, option.label]));

const languageSelectData = COURSE_LANGUAGE_OPTIONS.map((option) => ({
  value: option.code,
  label: option.label,
}));

function normalizeCourseId(value?: string | null) {
  return value ? value.toUpperCase() : '';
}

function getCourseText(course: Course) {
  const isHungarian = course.language === 'hu';
  return {
    free: isHungarian ? 'Ingyenes' : 'Free',
    premium: 'Premium',
    certificate: isHungarian ? 'Tanúsítvány' : 'Certificate',
    noCertificate: isHungarian ? 'Tanúsítvány nélkül' : 'No certificate',
    lessons: isHungarian ? 'lecke' : 'lessons',
    points: isHungarian ? 'pont' : 'points',
    view: isHungarian ? 'Részletek' : 'Details',
    enrol: isHungarian ? 'Feliratkozás' : 'Enrol',
    continue: isHungarian ? 'Folytatás' : 'Continue',
  };
}

function formatPrice(amount: number, currency: string): string {
  const normalized = currency.toUpperCase();
  const formatter = new Intl.NumberFormat(
    normalized === 'HUF' ? 'hu-HU' : normalized === 'EUR' ? 'de-DE' : normalized === 'GBP' ? 'en-GB' : 'en-US',
    {
      style: 'currency',
      currency: normalized,
      minimumFractionDigits: normalized === 'HUF' ? 0 : 2,
      maximumFractionDigits: normalized === 'HUF' ? 0 : 2,
    }
  );
  return formatter.format(normalized === 'HUF' ? amount : amount / 100);
}

function CatalogSkeleton() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <Card key={item} padding="lg">
          <Skeleton height={180} radius="md" mb="md" />
          <Skeleton height={24} width="80%" mb="sm" />
          <Skeleton height={14} width="100%" mb={6} />
          <Skeleton height={14} width="70%" mb="lg" />
          <Group grow>
            <Skeleton height={40} radius="md" />
            <Skeleton height={40} radius="md" />
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export default function CoursesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('courses');
  const tAuth = useTranslations('auth');
  const signInHref = `/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}/courses`)}`;

  const [courses, setCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<MyCourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMyCourses, setLoadingMyCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([locale]);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [enrollErrors, setEnrollErrors] = useState<Record<string, Array<{ courseId: string; name?: string }>>>({});

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append('status', 'active');
      params.append('locale', locale);
      params.append('includeVoteAggregates', '1');
      params.append('languages', (selectedLanguages.length > 0 ? selectedLanguages : [locale]).join(','));
      if (search.trim()) {
        params.append('search', search.trim());
      }

      const response = await fetch(`/api/courses?${params.toString()}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data?.error || 'Failed to load courses');
      }
      setCourses(data.courses || []);
    } catch (fetchError) {
      console.error('Failed to fetch courses:', fetchError);
      setError('Courses could not be loaded. Check your connection and try again.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [locale, search, selectedLanguages]);

  const fetchMyCourses = useCallback(async () => {
    if (!session) return;
    try {
      setLoadingMyCourses(true);
      const response = await fetch(`/api/my-courses?locale=${locale}`, { cache: 'no-store' });
      const data = await response.json();
      if (data.success) {
        setMyCourses(data.courses || []);
      }
    } catch (fetchError) {
      console.error('Failed to fetch my courses:', fetchError);
    } finally {
      setLoadingMyCourses(false);
    }
  }, [locale, session]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchCourses();
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [fetchCourses]);

  useEffect(() => {
    if (session) {
      void fetchMyCourses();
    } else {
      setMyCourses([]);
    }
  }, [fetchMyCourses, session]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('courseLanguageFilters');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const allowed = new Set<CourseLanguageCode>(COURSE_LANGUAGE_OPTIONS.map((option) => option.code));
      const cleaned = Array.isArray(parsed)
        ? parsed.filter((value): value is CourseLanguageCode => typeof value === 'string' && allowed.has(value as CourseLanguageCode))
        : [];
      if (cleaned.length > 0) setSelectedLanguages(cleaned);
    } catch {
      // Local filter persistence is optional.
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('courseLanguageFilters', JSON.stringify(selectedLanguages));
    } catch {
      // Local filter persistence is optional.
    }
  }, [selectedLanguages]);

  const myCourseById = useMemo(() => {
    const map = new Map<string, MyCourseProgress>();
    myCourses.forEach((course) => {
      map.set(normalizeCourseId(course.course.courseId), course);
    });
    return map;
  }, [myCourses]);

  const completedCourseIds = useMemo(() => {
    const set = new Set<string>();
    myCourses.forEach((course) => {
      if (course.progress.isCompleted) set.add(normalizeCourseId(course.course.courseId));
    });
    return set;
  }, [myCourses]);

  const handleEnroll = async (course: Course) => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/${course.language}/courses/${course.courseId}`)}`);
      return;
    }

    const courseKey = normalizeCourseId(course.courseId);
    setEnrollingCourseId(courseKey);
    setEnrollErrors((prev) => {
      const next = { ...prev };
      delete next[courseKey];
      return next;
    });

    try {
      const response = await fetch(`/api/courses/${course.courseId}/enroll`, { method: 'POST' });
      const data = await response.json();
      if (response.ok && data.success) {
        trackGAEvent('course_enroll', { course_id: course.courseId, course_name: course.name });
        await fetchMyCourses();
        router.push(`/${course.language}/courses/${course.courseId}/day/1`);
        return;
      }
      if (response.status === 403 && data?.code === 'PREREQUISITES_NOT_MET') {
        setEnrollErrors((prev) => ({
          ...prev,
          [courseKey]: (data?.unmetPrerequisites || []) as Array<{ courseId: string; name?: string }>,
        }));
        return;
      }
      setEnrollErrors((prev) => ({
        ...prev,
        [courseKey]: [{ courseId: data?.error || t('failedToEnroll') }],
      }));
    } catch (enrollError) {
      console.error('Failed to enroll:', enrollError);
      setEnrollErrors((prev) => ({
        ...prev,
        [courseKey]: [{ courseId: t('failedToEnroll') }],
      }));
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const getUnmetPrereqs = (course: Course) => {
    if (!course.prerequisiteCourses?.length) return [];
    return course.prerequisiteCourses.filter((prereq) => !completedCourseIds.has(normalizeCourseId(prereq.courseId)));
  };

  return (
    <Box bg="ink.9" mih="100vh">
      <LearnerPageHeader
        title={t('availableCourses')}
        subtitle={t('browseAndEnroll')}
        icon={<IconBook size={20} />}
        actions={!session ? (
          <Button component={LocaleLink} href={signInHref} color="amanoba">
            {tAuth('signIn')}
          </Button>
        ) : null}
      />

      <Container component="main" size="xl" py="xl">
        <Stack gap="lg">
          <Paper bg="ink.8" p="md">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
              <TextInput
                label="Search"
                placeholder={t('searchCourses')}
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                leftSection={<IconSearch size={18} />}
              />
              <MultiSelect
                label="Languages"
                placeholder="Choose course languages"
                data={languageSelectData}
                value={selectedLanguages}
                onChange={(value) => setSelectedLanguages(value.length > 0 ? value : [locale])}
                leftSection={<IconLanguage size={18} />}
                searchable
                clearable={false}
              />
            </SimpleGrid>
          </Paper>

          {error ? (
            <Alert
              color="red"
              variant="light"
              title="Course catalog is unavailable"
              icon={<IconAlertTriangle size={18} />}
            >
              <Group justify="space-between" align="center" gap="md">
                <Text>{error}</Text>
                <Button variant="outline" color="red" leftSection={<IconRefresh size={16} />} onClick={() => void fetchCourses()}>
                  Retry
                </Button>
              </Group>
            </Alert>
          ) : null}

          {loading ? (
            <CatalogSkeleton />
          ) : courses.length === 0 ? (
            <Card padding="xl">
              <Stack align="center" gap="sm">
                <IconBook size={44} />
                <Title order={2} size="h3">
                  {t('noCoursesAvailable')}
                </Title>
                <Text c="dimmed" ta="center">
                  Nothing matches the current search and language filters.
                </Text>
                <Button variant="outline" onClick={() => {
                  setSearch('');
                  setSelectedLanguages([locale]);
                }}>
                  Clear filters
                </Button>
              </Stack>
            </Card>
          ) : (
            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {courses.map((course) => {
                const courseKey = normalizeCourseId(course.courseId);
                const myCourse = myCourseById.get(courseKey);
                const isEnrolled = Boolean(myCourse);
                const courseTexts = getCourseText(course);
                const unmetPrereqs = getUnmetPrereqs(course);
                const prereqEnforcement = course.prerequisiteEnforcement ?? 'hard';
                const prereqBlocked = Boolean(session) && unmetPrereqs.length > 0 && prereqEnforcement === 'hard';
                const apiPrereqs = enrollErrors[courseKey] ?? [];
                const progress = myCourse?.progress.progressPercentage ?? 0;

                return (
                  <Card key={course._id} padding="lg">
                    <Card.Section>
                      {course.thumbnail ? (
                        <MantineImage
                          component={Image}
                          src={course.thumbnail}
                          alt={course.name}
                          height={190}
                          width={640}
                          fit="cover"
                        />
                      ) : (
                        <Box bg="ink.7" h={190}>
                          <Stack h="100%" align="center" justify="center" gap="xs">
                            <IconBook size={38} color="white" />
                            <Text c="gray.3">{languageLabels.get(course.language as CourseLanguageCode) ?? course.language.toUpperCase()}</Text>
                          </Stack>
                        </Box>
                      )}
                    </Card.Section>

                    <Stack gap="md" mt="md">
                      <Group gap="xs">
                        <Badge variant="light" color="gray">{languageLabels.get(course.language as CourseLanguageCode) ?? course.language.toUpperCase()}</Badge>
                        <Badge
                          variant={course.requiresPremium ? 'filled' : 'light'}
                          color={course.requiresPremium ? 'amanoba' : 'gray'}
                          leftSection={course.requiresPremium ? <IconStar size={12} /> : undefined}
                        >
                          {course.requiresPremium ? courseTexts.premium : courseTexts.free}
                        </Badge>
                        <Badge
                          variant="light"
                          color={course.certification?.enabled ? 'amanoba' : 'gray'}
                          leftSection={course.certification?.enabled ? <IconCertificate size={12} /> : undefined}
                        >
                          {course.certification?.enabled ? courseTexts.certificate : courseTexts.noCertificate}
                        </Badge>
                      </Group>

                      <Stack gap={6}>
                        <Title order={2} size="h3" lineClamp={2}>
                          {course.name}
                        </Title>
                        <Text c="dimmed" lineClamp={3}>
                          {course.description}
                        </Text>
                      </Stack>

                      <SimpleGrid cols={3} spacing="xs">
                        <Paper p="sm">
                          <Text size="xs" c="dimmed">Length</Text>
                          <Text fw={700}>{course.durationDays} {courseTexts.lessons}</Text>
                        </Paper>
                        <Paper p="sm">
                          <Text size="xs" c="dimmed">Reward</Text>
                          <Text fw={700}>{course.pointsConfig.completionPoints} {courseTexts.points}</Text>
                        </Paper>
                        <Paper p="sm">
                          <Text size="xs" c="dimmed">Signal</Text>
                          <Group gap={4}>
                            <IconThumbUp size={15} />
                            <Text fw={700}>{course.voteAggregate?.score ?? 0}</Text>
                          </Group>
                        </Paper>
                      </SimpleGrid>

                      {course.requiresPremium && course.price ? (
                        <Group gap="xs">
                          <IconCreditCard size={18} />
                          <Text fw={700}>{formatPrice(course.price.amount, course.price.currency)}</Text>
                        </Group>
                      ) : null}

                      {isEnrolled ? (
                        <Stack gap={6}>
                          <Group justify="space-between">
                            <Text size="sm" fw={700}>Progress</Text>
                            <Text size="sm" c="dimmed">{Math.round(progress)}%</Text>
                          </Group>
                          <Progress value={progress} color="amanoba" radius="xl" />
                        </Stack>
                      ) : null}

                      {course.prerequisiteCourses?.length ? (
                        <Alert
                          color={prereqBlocked ? 'yellow' : 'gray'}
                          variant="light"
                          icon={<IconAlertTriangle size={16} />}
                          title={prereqBlocked ? 'Prerequisites required' : 'Prerequisites'}
                        >
                          <Text size="sm">
                            {(prereqBlocked ? unmetPrereqs : course.prerequisiteCourses)
                              .map((prereq) => prereq.name ?? prereq.courseId)
                              .join(', ')}
                          </Text>
                        </Alert>
                      ) : null}

                      {apiPrereqs.length > 0 ? (
                        <Alert color="red" variant="light" title="Cannot enrol yet" icon={<IconAlertTriangle size={16} />}>
                          <Text size="sm">
                            {apiPrereqs.map((prereq) => prereq.name ?? prereq.courseId).join(', ')}
                          </Text>
                        </Alert>
                      ) : null}

                      <Group grow>
                        {isEnrolled ? (
                          <Button
                            component={LocaleLink}
                            href={`/${myCourse?.course.language ?? course.language}/courses/${course.courseId}/day/${myCourse?.progress.currentDay || 1}`}
                            color="amanoba"
                            leftSection={<IconTrophy size={18} />}
                          >
                            {courseTexts.continue}
                          </Button>
                        ) : (
                          <Button
                            color="amanoba"
                            loading={enrollingCourseId === courseKey}
                            disabled={Boolean(enrollingCourseId) || prereqBlocked || loadingMyCourses}
                            onClick={() => void handleEnroll(course)}
                          >
                            {courseTexts.enrol}
                          </Button>
                        )}
                        <Button
                          component={LocaleLink}
                          href={`/${course.language}/courses/${course.courseId}`}
                          variant="outline"
                          color="gray"
                        >
                          {courseTexts.view}
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
