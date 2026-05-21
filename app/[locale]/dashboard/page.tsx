'use client';

/**
 * User Dashboard Page
 * 
 * Why: Central view for user progression, achievements, and stats
 * What: Comprehensive dashboard showing level, XP, points, achievements, and streaks
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { LocaleLink } from '@/components/LocaleLink';
import { ReferralCard } from '@/components/ReferralCard';
import Logo from '@/components/Logo';
import { trackGAEvent } from '@/app/lib/analytics/ga-events';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Loader,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconAward,
  IconBook,
  IconBookmark,
  IconChartBar,
  IconDiamond,
  IconFlame,
  IconGift,
  IconMap,
  IconRefresh,
  IconRocket,
  IconShieldCheck,
  IconLogout,
  IconSparkles,
  IconTargetArrow,
  IconTrophy,
  IconUser,
} from '@tabler/icons-react';

interface PlayerData {
  player: {
    id: string;
    displayName: string;
    isPremium: boolean;
    createdAt: string;
  };
  progression: {
    level: number;
    currentXP: number;
    xpToNextLevel: number;
    totalXP: number;
    currentTitle: string | null;
    totalGamesPlayed: number;
    totalGamesWon: number;
    winRate: number;
    bestStreak: number;
    currentStreak: number;
  };
  wallet: {
    currentBalance: number;
    lifetimeEarned: number;
    lifetimeSpent: number;
  };
  streaks: Array<{
    type: string;
    count: number;
    bestCount: number;
  }>;
  achievementStats: {
    unlocked: number;
    total: number;
    percentage: number;
  };
  courseStats?: {
    quizzesCompleted: number;
    lessonsCompleted: number;
    coursesEnrolled: number;
    coursesCompleted: number;
    totalCourseXP: number;
    totalCoursePoints: number;
  };
}

interface MyCourseProgress {
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
    lastAccessedAt: string;
  };
}

interface FriendStreakItem {
  id: string;
  status: 'pending' | 'active';
  inviteCode: string | null;
  createdAt: string | null;
  joinedAt: string | null;
  lastSharedActivity: string | null;
  currentSharedStreak: number;
  bestSharedStreak: number;
  statusLabel: string;
  atRisk: boolean;
  stale: boolean;
  partner: {
    id: string | null;
    displayName: string;
  };
}

function getCourseDayHref(course: {
  courseId: string;
  language: string;
}, progress: {
  currentDay: number;
  totalDays: number;
  isCompleted?: boolean;
}) {
  const safeTotalDays = Math.max(progress.totalDays || 1, 1);
  const requestedDay = progress.isCompleted
    ? safeTotalDays
    : Math.min(Math.max(progress.currentDay || 1, 1), safeTotalDays);
  return `/${course.language}/courses/${course.courseId}/day/${requestedDay}`;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const _router = useRouter();
  const _pathname = usePathname();
  const locale = useLocale();
  const hasCheckedSurvey = useRef(false);
  const hasFiredPaymentSuccessGA = useRef(false);
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const tGames = useTranslations('games');
  const tLeaderboard = useTranslations('leaderboard');
  const tChallenges = useTranslations('challenges');
  const tQuests = useTranslations('quests');
  const tAchievements = useTranslations('achievements');
  const tRewards = useTranslations('rewards');
  const tCourses = useTranslations('courses');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type RecommendationCourse = {
    courseId: string;
    language?: string;
    name?: string;
    description?: string;
    thumbnail?: string;
    durationDays?: number;
    requiresPremium?: boolean;
  };
  const [recommendations, setRecommendations] = useState<RecommendationCourse[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [myCourses, setMyCourses] = useState<MyCourseProgress[]>([]);
  const [loadingMyCourses, setLoadingMyCourses] = useState(false);
  const [friendStreaks, setFriendStreaks] = useState<FriendStreakItem[]>([]);
  const [loadingFriendStreaks, setLoadingFriendStreaks] = useState(false);
  const [friendInviteCode, setFriendInviteCode] = useState('');
  const [friendStreakBusy, setFriendStreakBusy] = useState(false);
  const [friendStreakMessage, setFriendStreakMessage] = useState<string | null>(null);
  const [featureFlags, setFeatureFlags] = useState<{
    courses: boolean;
    myCourses: boolean;
    games: boolean;
    stats: boolean;
    leaderboards: boolean;
    challenges: boolean;
    quests: boolean;
    achievements: boolean;
    rewards: boolean;
  } | null>(null);
  const [adminAccess, setAdminAccess] = useState<{ canAccessAdmin: boolean; isAdmin: boolean; isEditorOnly: boolean } | null>(null);

  const fetchAdminAccess = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/access');
      const data = await response.json();
      setAdminAccess({
        canAccessAdmin: data?.canAccessAdmin === true,
        isAdmin: data?.isAdmin === true,
        isEditorOnly: data?.isEditorOnly === true,
      });
    } catch {
      setAdminAccess({ canAccessAdmin: false, isAdmin: false, isEditorOnly: false });
    }
  }, []);

  const fetchFeatureFlags = useCallback(async () => {
    try {
      const response = await fetch('/api/feature-flags');
      const data = await response.json();
      if (data.success && data.featureFlags?.features) {
        setFeatureFlags(data.featureFlags.features);
      }
    } catch (error) {
      console.error('Failed to fetch feature flags:', error);
      // Default to course features enabled
      setFeatureFlags({
        courses: true,
        myCourses: true,
        games: false,
        stats: false,
        leaderboards: false,
        challenges: false,
        quests: false,
        achievements: false,
        rewards: false,
      });
    }
  }, []);

  // Why: Fetch player data when session is available or on manual refresh
  const fetchPlayerData = useCallback(async () => {
    if (status === 'loading') {
      return;
    }
    
    if (!session?.user?.id) {
      setError('No session found. Please sign in again.');
      setLoading(false);
      return;
    }
    
    try {
      const user = session.user as { id?: string; playerId?: string };
      const playerId = user.playerId || user.id;
      // Why: Add timestamp to bust any caching
      const response = await fetch(`/api/players/${playerId}?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlayerData(data);

        // ONBOARDING REDIRECT DISABLED - Will be re-enabled after fixing issues
        // Check if player needs to complete survey
        // Only check once per session and only if we're actually on dashboard
        // DISABLED: if (typeof window !== 'undefined' && pathname?.includes('/dashboard')) {
        //   const urlParams = new URLSearchParams(window.location.search);
        //   const surveyCompleted = urlParams.get('surveyCompleted') === 'true';
        //   
        //   // If we just completed the survey, don't redirect
        //   if (surveyCompleted) {
        //     hasCheckedSurvey.current = true;
        //     // Clean up the URL
        //     window.history.replaceState({}, '', window.location.pathname);
        //   } else if (!hasCheckedSurvey.current && data.player && !data.player.surveyCompleted) {
        //     hasCheckedSurvey.current = true;
        //     // Use replace instead of push to prevent back button issues and redirect loops
        //     router.replace(`/${locale}/onboarding`);
        //     return;
        //   } else {
        //     hasCheckedSurvey.current = true;
        //   }
        // } else {
        //   hasCheckedSurvey.current = true;
        // }
        hasCheckedSurvey.current = true;
      } else {
        setError('Failed to load player data');
      }
    } catch (err) {
      setError('Network error');
      console.error('Failed to fetch player data:', err);
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  const fetchRecommendations = useCallback(async () => {
    if (status === 'loading' || !session) return;
    
    try {
      setLoadingRecommendations(true);
      const response = await fetch(`/api/courses/recommendations?limit=3&locale=${locale}`);
      const data = await response.json();
      
      if (data.success && data.recommendations) {
        setRecommendations((data.recommendations || []) as RecommendationCourse[]);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  }, [session, status, locale]);

  const fetchMyCourses = useCallback(async () => {
    if (status === 'loading' || !session) return;
    try {
      setLoadingMyCourses(true);
      const response = await fetch(`/api/my-courses?locale=${locale}`);
      const data = await response.json();
      if (data.success) {
        setMyCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch my courses:', error);
    } finally {
      setLoadingMyCourses(false);
    }
  }, [session, status, locale]);

  const fetchFriendStreaks = useCallback(async () => {
    if (status === 'loading' || !session) return;
    try {
      setLoadingFriendStreaks(true);
      const response = await fetch('/api/friend-streaks', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) {
        setFriendStreaks(data.friendStreaks || []);
      }
    } catch (error) {
      console.error('Failed to fetch friend streaks:', error);
    } finally {
      setLoadingFriendStreaks(false);
    }
  }, [session, status]);

  const handleCreateFriendInvite = useCallback(async () => {
    try {
      setFriendStreakBusy(true);
      setFriendStreakMessage(null);
      const response = await fetch('/api/friend-streaks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create invite');
      }
      setFriendStreakMessage('Invite code created.');
      await fetchFriendStreaks();
    } catch (error) {
      setFriendStreakMessage(error instanceof Error ? error.message : 'Failed to create invite');
    } finally {
      setFriendStreakBusy(false);
    }
  }, [fetchFriendStreaks]);

  const handleJoinFriendInvite = useCallback(async () => {
    try {
      const inviteCode = friendInviteCode.trim().toUpperCase();
      if (!inviteCode) {
        setFriendStreakMessage('Enter an invite code first.');
        return;
      }

      setFriendStreakBusy(true);
      setFriendStreakMessage(null);
      const response = await fetch('/api/friend-streaks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', inviteCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join invite');
      }
      setFriendInviteCode('');
      setFriendStreakMessage('Friend streak connected.');
      await fetchFriendStreaks();
    } catch (error) {
      setFriendStreakMessage(error instanceof Error ? error.message : 'Failed to join invite');
    } finally {
      setFriendStreakBusy(false);
    }
  }, [fetchFriendStreaks, friendInviteCode]);

  const handleRemoveFriendStreak = useCallback(async (friendStreakId: string) => {
    try {
      setFriendStreakBusy(true);
      setFriendStreakMessage(null);
      const response = await fetch('/api/friend-streaks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendStreakId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove friend streak');
      }
      setFriendStreakMessage('Friend streak removed.');
      await fetchFriendStreaks();
    } catch (error) {
      setFriendStreakMessage(error instanceof Error ? error.message : 'Failed to remove friend streak');
    } finally {
      setFriendStreakBusy(false);
    }
  }, [fetchFriendStreaks]);

  useEffect(() => {
    void fetchPlayerData();
    void fetchFeatureFlags();
    void fetchRecommendations();
    void fetchMyCourses();
    void fetchFriendStreaks();
    if (session?.user) {
      void fetchAdminAccess();
    } else {
      setAdminAccess({ canAccessAdmin: false, isAdmin: false, isEditorOnly: false });
    }
  }, [fetchAdminAccess, fetchFeatureFlags, fetchFriendStreaks, fetchMyCourses, fetchPlayerData, fetchRecommendations, session]);

  // Fire GA purchase when redirected here after payment success (e.g. general premium)
  useEffect(() => {
    if (typeof window === 'undefined' || hasFiredPaymentSuccessGA.current) return;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_success') !== 'true') return;
    hasFiredPaymentSuccessGA.current = true;
    trackGAEvent('purchase', {});
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  if (loading) {
    return (
      <Box bg="ink.9" mih="100vh" py="xl">
        <Container size="sm">
          <Card padding="xl" withBorder>
            <Group justify="center" gap="sm">
              <Loader color="amanoba" size="sm" />
              <Text fw={700}>{t('loading')}</Text>
            </Group>
          </Card>
        </Container>
      </Box>
    );
  }

  if (error || !playerData) {
    return (
      <Box bg="ink.9" mih="100vh" py="xl">
        <Container size="sm">
          <Card padding="xl" withBorder>
            <Stack gap="md" align="center" ta="center">
              <Alert color="red" w="100%">{t('unableToLoad')}</Alert>
              <Text c="dimmed">{error}</Text>
              <Group gap="sm">
                <Button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchPlayerData();
              }}
                  color="amanoba"
                  leftSection={<IconRefresh size={18} />}
            >
              {t('retry')}
                </Button>
                <Button
              onClick={() => signOut({ callbackUrl: `/${locale}/auth/signin` })}
                  variant="default"
                  leftSection={<IconLogout size={18} />}
            >
              {tAuth('signOut')}
                </Button>
              </Group>
            </Stack>
          </Card>
        </Container>
      </Box>
    );
  }

  const { player, progression, wallet, streaks, achievementStats, courseStats } = playerData;
  const xpProgress = progression ? (progression.currentXP / progression.xpToNextLevel) * 100 : 0;
  const currentPlayerId = player?.id ?? (session?.user as { id?: string; playerId?: string })?.playerId ?? (session?.user as { id?: string })?.id;
  const activeCourses = myCourses.filter((course) => !course.progress.isCompleted);
  const pendingFriendInvite = friendStreaks.find((item) => item.status === 'pending');
  const activeFriendStreaks = friendStreaks.filter((item) => item.status === 'active');
  const courseLabel = (key: string, fallback: string, values?: Record<string, string | number>) => {
    const out = values ? tCourses(key, values as Record<string, string | number>) : tCourses(key);
    if (typeof out !== 'string') return fallback;
    if (out === key || out === `courses.${key}`) return fallback;
    return out;
  };
  const quickActions = [
    { show: true, href: '/blog', label: 'Blog', icon: IconSparkles, variant: 'outline' as const },
    { show: featureFlags?.courses, href: '/courses', label: t('courses'), icon: IconBook, variant: 'filled' as const },
    { show: featureFlags?.myCourses, href: '/my-courses', label: t('myCourses'), icon: IconRocket, variant: 'filled' as const },
    { show: featureFlags?.myCourses, href: '/practice', label: 'Practice Hub', icon: IconTargetArrow, variant: 'default' as const },
    { show: featureFlags?.myCourses, href: '/saved', label: 'Saved Lessons', icon: IconBookmark, variant: 'outline' as const },
    { show: featureFlags?.games, href: '/games', label: tGames('title'), icon: IconShieldCheck, variant: 'default' as const },
    { show: featureFlags?.stats, href: '/stats', label: t('statistics'), icon: IconChartBar, variant: 'default' as const },
    { show: featureFlags?.leaderboards, href: '/leaderboards', label: tLeaderboard('title'), icon: IconTrophy, variant: 'filled' as const },
    { show: featureFlags?.challenges, href: '/challenges', label: tChallenges('title'), icon: IconTargetArrow, variant: 'default' as const },
    { show: featureFlags?.quests, href: '/quests', label: tQuests('title'), icon: IconMap, variant: 'filled' as const },
    { show: featureFlags?.achievements, href: '/achievements', label: tAchievements('title'), icon: IconAward, variant: 'default' as const },
    { show: featureFlags?.rewards, href: '/rewards', label: tRewards('title'), icon: IconGift, variant: 'filled' as const },
  ];

  return (
    <Box bg="ink.9" mih="100vh">
      <Paper component="header" bg="ink.8" radius={0} withBorder>
        <Container size="xl" py={{ base: 'md', sm: 'lg' }}>
          <Group justify="space-between" align="flex-start" gap="md">
            <Group gap="md" wrap="nowrap" style={{ minWidth: 0 }}>
              <Logo size="md" showText={false} linkTo="/dashboard" />
              <Stack gap={4}>
                <Title order={1} size="h2" c="white">{t('title')}</Title>
                <Text c="gray.3" size="sm">{t('yourLearningJourney')}</Text>
              </Stack>
            </Group>
            <Group gap="sm">
              <Button
                onClick={() => {
                  setLoading(true);
                  fetchPlayerData();
                }}
                color="amanoba"
                leftSection={<IconRefresh size={18} />}
              >
                {t('refresh')}
              </Button>
              <Button component={LocaleLink} href="/courses" color="amanoba" leftSection={<IconBook size={18} />}>
                {t('browseCourses')}
              </Button>
              {currentPlayerId ? (
                <Button component={LocaleLink} href={`/profile/${currentPlayerId}`} variant="outline" color="gray" leftSection={<IconUser size={18} />}>
                  {t('myProfile')}
                </Button>
              ) : null}
              {session?.user && adminAccess?.isAdmin === true ? (
                <Button component={LocaleLink} href="/admin" variant="default">Admin</Button>
              ) : null}
              {session?.user && adminAccess?.isEditorOnly === true ? (
                <Button component={LocaleLink} href="/editor/courses" variant="default">Editor</Button>
              ) : null}
              <Button
                onClick={() => signOut({ callbackUrl: `/${locale}/auth/signin` })}
                variant="default"
                leftSection={<IconLogout size={18} />}
              >
                {tAuth('signOut')}
              </Button>
            </Group>
          </Group>
        </Container>
      </Paper>

      <Container component="main" size="xl" py={{ base: 'lg', sm: 'xl' }}>
        <Stack gap="xl">
          <Card padding="lg" withBorder>
            <Stack gap="md">
              <Group gap="xs">
                <ThemeIcon color="amanoba" variant="light" radius="xl">
                  <IconBook size={18} />
                </ThemeIcon>
                <Title order={2} size="h3">{t('startLearning')}</Title>
              </Group>
              <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing="sm">
                {quickActions.filter((action) => action.show).map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <Button
                      key={action.href}
                      component={LocaleLink}
                      href={action.href}
                      variant={action.variant === 'filled' ? 'filled' : action.variant}
                      color={action.variant === 'filled' ? 'amanoba' : 'gray'}
                      leftSection={<ActionIcon size={18} />}
                      fullWidth
                    >
                      {action.label}
                    </Button>
                  );
                })}
              </SimpleGrid>
            </Stack>
          </Card>

          {featureFlags?.courses && recommendations.length > 0 ? (
            <Card padding="lg" withBorder>
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={2} size="h3">{t('recommendedCourses')}</Title>
                  <Button component={LocaleLink} href="/courses" variant="subtle" color="amanoba">
                    {t('viewAllCourses')}
                  </Button>
                </Group>
                {loadingRecommendations ? (
                  <Group justify="center" py="lg"><Loader color="amanoba" size="sm" /></Group>
                ) : (
                  <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                    {recommendations.map((course) => (
                      <Card key={course.courseId} component={LocaleLink} href={`/${course.language ?? locale}/courses/${course.courseId}`} padding="md" bg="gray.0" withBorder>
                        <Stack gap="sm">
                          {course.thumbnail ? (
                            <Box pos="relative" h={128} bg="ink.8" style={{ overflow: 'hidden', borderRadius: 8 }}>
                              <Image
                                src={course.thumbnail}
                                alt={course.name ?? 'Course'}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, 20rem"
                              />
                            </Box>
                          ) : null}
                          <Title order={3} size="h4" lineClamp={2}>{course.name}</Title>
                          <Text size="sm" c="dimmed" lineClamp={2}>{course.description}</Text>
                          <Group justify="space-between">
                            <Text size="xs" c="dimmed">{course.durationDays} {tCourses('days') || 'days'}</Text>
                            {course.requiresPremium ? <Badge color="amanoba">{tCommon('premium')}</Badge> : null}
                          </Group>
                        </Stack>
                      </Card>
                    ))}
                  </SimpleGrid>
                )}
              </Stack>
            </Card>
          ) : null}

          {featureFlags?.myCourses ? (
            <Card padding="lg" withBorder>
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Stack gap={2}>
                    <Title order={2} size="h3">{t('myCourses')}</Title>
                    <Text size="sm" c="dimmed">{t('trackLearningProgress')}</Text>
                  </Stack>
                  <Button component={LocaleLink} href="/my-courses" variant="subtle" color="amanoba">
                    {t('viewAllCourses')}
                  </Button>
                </Group>
                {loadingMyCourses ? (
                  <Group justify="center" py="lg"><Loader color="amanoba" size="sm" /></Group>
                ) : activeCourses.length === 0 ? (
                  <Stack align="center" py="lg" gap="md">
                    <Text c="dimmed">{t('noCoursesEnrolled')}</Text>
                    <Button component={LocaleLink} href="/courses" color="amanoba">{t('browseCourses')}</Button>
                  </Stack>
                ) : (
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    {activeCourses.map((item) => (
                      <Card key={item.course.courseId} padding="md" bg="gray.0" withBorder>
                        <Stack gap="sm">
                          <Group justify="space-between" align="flex-start">
                            <Stack gap={2}>
                              <Title order={3} size="h4">{item.course.name}</Title>
                              <Text size="xs" c="dimmed">
                                {courseLabel('dayOf', `Day ${item.progress.currentDay} of ${item.progress.totalDays}`, {
                                  currentDay: item.progress.currentDay,
                                  totalDays: item.progress.totalDays,
                                })}
                              </Text>
                            </Stack>
                            <Badge color="amanoba">{item.progress.progressPercentage}%</Badge>
                          </Group>
                          <Progress value={item.progress.progressPercentage} color="amanoba" radius="xl" />
                          <Group justify="space-between">
                            <Text size="xs" c="dimmed">
                              {courseLabel('daysCompleted', `${item.progress.completedDays} days completed`, {
                                count: item.progress.completedDays,
                              })}
                            </Text>
                            <Button component={LocaleLink} href={getCourseDayHref(item.course, item.progress)} size="xs" variant="subtle" color="amanoba">
                              {courseLabel('nextLesson', 'Next Lesson')}
                            </Button>
                          </Group>
                        </Stack>
                      </Card>
                    ))}
                  </SimpleGrid>
                )}
              </Stack>
            </Card>
          ) : null}

          <Card padding="lg" withBorder>
            <Group justify="space-between" align="center">
              <Group gap="md">
                <Avatar color="amanoba" variant="filled" size={72} radius="xl">
                  <IconUser size={38} />
                </Avatar>
                <Stack gap={2}>
                  <Title order={2} size="h3">{player.displayName || 'Player'}</Title>
                  {progression?.currentTitle ? <Text c="amanoba.7" fw={700}>{progression.currentTitle}</Text> : null}
                  <Text size="sm" c="dimmed">{t('memberSince')} {new Date(player.createdAt).toLocaleDateString('hu-HU')}</Text>
                </Stack>
              </Group>
              {player.isPremium ? <Badge color="amanoba" size="lg" leftSection={<IconSparkles size={14} />}>{tCommon('premium')}</Badge> : null}
            </Group>
          </Card>

          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="md">
            {[
              { icon: IconBook, value: progression?.level || 1, label: t('learningLevel'), detail: `${progression.currentXP} / ${progression.xpToNextLevel} ${t('learningPoints')}`, progress: xpProgress },
              { icon: IconDiamond, value: wallet?.currentBalance.toLocaleString() || 0, label: t('points'), detail: `${t('earned')}: ${wallet.lifetimeEarned.toLocaleString()} • ${t('spent')}: ${wallet.lifetimeSpent.toLocaleString()}` },
              { icon: IconTrophy, value: `${achievementStats.unlocked}/${achievementStats.total}`, label: t('achievements'), detail: `${achievementStats.percentage}% ${t('complete')}`, progress: achievementStats.percentage },
              { icon: IconChartBar, value: courseStats?.quizzesCompleted || 0, label: t('assessmentsCompleted'), detail: courseStats ? `${courseStats.lessonsCompleted} ${t('lessonsCompleted')} • ${courseStats.coursesEnrolled} ${t('coursesEnrolled')}` : '' },
            ].map((stat) => {
              const StatIcon = stat.icon;
              return (
                <Card key={stat.label} padding="lg" withBorder>
                  <Stack gap="sm">
                    <ThemeIcon color="amanoba" variant="light" size={48} radius="xl">
                      <StatIcon size={28} />
                    </ThemeIcon>
                    <Text size="2rem" fw={800}>{stat.value}</Text>
                    <Text c="dimmed">{stat.label}</Text>
                    {typeof stat.progress === 'number' ? <Progress value={stat.progress} color="amanoba" radius="xl" /> : null}
                    <Text size="xs" c="dimmed">{stat.detail}</Text>
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
            <Card padding="lg" withBorder>
              <Stack gap="md">
                <Group gap="xs">
                  <ThemeIcon color="amanoba" variant="light" radius="xl"><IconFlame size={20} /></ThemeIcon>
                  <Title order={2} size="h3">{t('streaks')}</Title>
                </Group>
                {streaks && streaks.length > 0 ? (
                  <Stack gap="sm">
                    {streaks.map((streak, index) => {
                      const labelMap: Record<string, string> = {
                        daily_login: t('dailyLoginStreak'),
                        daily_learning: 'Learning Streak',
                        win: t('winStreak'),
                      };
                      const streakLabel = labelMap[streak.type] ?? streak.type.replace('_', ' ');
                      return (
                        <Group key={index} justify="space-between">
                          <Stack gap={0}>
                            <Text fw={700}>{streakLabel}</Text>
                            <Text size="sm" c="dimmed">Legjobb: {streak.bestCount}</Text>
                          </Stack>
                          <Text c="amanoba.7" size="xl" fw={800}>{streak.count}</Text>
                        </Group>
                      );
                    })}
                  </Stack>
                ) : (
                  <Stack align="center" gap="md">
                    <Text c="dimmed">{t('noActiveStreaks')}</Text>
                    <Button component={LocaleLink} href="/courses" color="amanoba" leftSection={<IconBook size={16} />}>
                      {t('enrollInCourse')}
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Card>
            <ReferralCard />
          </SimpleGrid>

          <Card padding="lg" withBorder>
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <Stack gap={2}>
                  <Group gap="xs">
                    <ThemeIcon color="amanoba" variant="light" radius="xl"><IconFlame size={20} /></ThemeIcon>
                    <Title order={2} size="h3">Friend Streaks</Title>
                  </Group>
                  <Text size="sm" c="dimmed">Pair up with one learner at a time and keep a shared learning rhythm.</Text>
                </Stack>
                <Button onClick={() => void fetchFriendStreaks()} variant="subtle" color="amanoba" leftSection={<IconRefresh size={18} />}>Refresh</Button>
              </Group>

              {friendStreakMessage ? <Alert color="amanoba">{friendStreakMessage}</Alert> : null}

              <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
                <Card bg="gray.0" padding="md" withBorder>
                  <Stack gap="md">
                    <Title order={3} size="h4">Create Invite</Title>
                    {pendingFriendInvite ? (
                      <Stack gap="sm">
                        <Text size="sm" c="dimmed">Share this code with your learning partner.</Text>
                        <Paper bg="ink.9" p="md" withBorder>
                          <Text c="amanoba.5" size="xl" fw={800} style={{ letterSpacing: '0.25em' }}>
                            {pendingFriendInvite.inviteCode}
                          </Text>
                        </Paper>
                        <Group gap="sm">
                          <Button onClick={() => void navigator.clipboard?.writeText(pendingFriendInvite.inviteCode || '')} color="amanoba">Copy Code</Button>
                          <Button onClick={() => void handleRemoveFriendStreak(pendingFriendInvite.id)} loading={friendStreakBusy} variant="outline" color="gray">Cancel Invite</Button>
                        </Group>
                      </Stack>
                    ) : (
                      <Button onClick={() => void handleCreateFriendInvite()} loading={friendStreakBusy} color="amanoba">
                        Create Invite Code
                      </Button>
                    )}
                  </Stack>
                </Card>

                <Card bg="gray.0" padding="md" withBorder>
                  <Stack gap="md">
                    <Title order={3} size="h4">Join Invite</Title>
                    <Group align="flex-end" gap="sm">
                      <TextInput
                        value={friendInviteCode}
                        onChange={(event) => setFriendInviteCode(event.currentTarget.value.toUpperCase())}
                        placeholder="Paste invite code"
                        style={{ flex: 1 }}
                      />
                      <Button onClick={() => void handleJoinFriendInvite()} loading={friendStreakBusy} variant="default">
                        Join
                      </Button>
                    </Group>
                    <Text size="sm" c="dimmed">A shared day only counts when both partners complete a learning action on the same day.</Text>
                  </Stack>
                </Card>
              </SimpleGrid>

              {loadingFriendStreaks ? (
                <Group justify="center" py="md"><Loader color="amanoba" size="sm" /></Group>
              ) : activeFriendStreaks.length === 0 ? (
                <Alert color="gray">No active friend streaks yet.</Alert>
              ) : (
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  {activeFriendStreaks.map((item) => (
                    <Card key={item.id} bg="gray.0" padding="md" withBorder>
                      <Stack gap="md">
                        <Group justify="space-between" align="flex-start">
                          <Stack gap={0}>
                            <Text size="sm" c="dimmed">Partner</Text>
                            <Text size="lg" fw={700}>{item.partner.displayName}</Text>
                          </Stack>
                          <Button onClick={() => void handleRemoveFriendStreak(item.id)} loading={friendStreakBusy} variant="subtle" color="gray">Remove</Button>
                        </Group>
                        <Group justify="space-between" align="flex-end">
                          <Stack gap={0}>
                            <Text size="sm" c="dimmed">Shared streak</Text>
                            <Text c="amanoba.7" size="2rem" fw={800}>{item.currentSharedStreak}</Text>
                          </Stack>
                          <Stack gap={0} align="flex-end">
                            <Text size="sm" c="dimmed">{item.statusLabel}</Text>
                            <Text size="sm" c="dimmed">Best: {item.bestSharedStreak}</Text>
                          </Stack>
                        </Group>
                        {item.lastSharedActivity ? (
                          <Text size="xs" c="dimmed">Last shared day: {new Date(item.lastSharedActivity).toLocaleDateString('hu-HU')}</Text>
                        ) : null}
                      </Stack>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
