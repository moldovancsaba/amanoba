/**
 * User Profile Page
 *
 * Comprehensive public profile displaying user stats, achievements,
 * recent activity, certificates, payments, and owner settings.
 */

'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  FileButton,
  Group,
  Loader,
  Paper,
  Progress,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconAward,
  IconCalendar,
  IconCheck,
  IconClock,
  IconCoin,
  IconCreditCard,
  IconDeviceFloppy,
  IconFlame,
  IconLink,
  IconSettings,
  IconTarget,
  IconTrendingUp,
  IconTrophy,
  IconUpload,
} from '@tabler/icons-react';
import { StateBlock } from '@/app/components/patterns/StateBlock';
import PlayerAvatar from '@/components/PlayerAvatar';
import { locales, type Locale } from '@/app/lib/i18n/locales';

/** Locale plus legacy en-GB/en-US for display when session or API returns them. */
type LanguageNameKey = Locale | 'en-GB' | 'en-US';

const languageNames: Record<LanguageNameKey, string> = {
  hu: 'Magyar',
  en: 'English',
  'en-GB': 'English',
  'en-US': 'English',
  ar: 'العربية',
  hi: 'हिन्दी',
  id: 'Bahasa Indonesia',
  pt: 'Português',
  vi: 'Tiếng Việt',
  tr: 'Türkçe',
  bg: 'Български',
  pl: 'Polski',
  ru: 'Русский',
  sw: 'Kiswahili',
  zh: '中文',
  es: 'Español',
  fr: 'Français',
  bn: 'বাংলা',
  ur: 'اردو',
};

export const dynamic = 'force-dynamic';

interface ProfilePlayer {
  id?: string;
  displayName?: string;
  profilePicture?: string | null;
  level?: number;
  isPremium?: boolean;
  profileVisibility?: string;
  locale?: string;
}

interface ProfileProgression {
  level?: number;
  title?: string;
  currentXP?: number;
  xpToNextLevel?: number;
  nextTitle?: string;
}

interface ProfileStatistics {
  totalGamesPlayed?: number;
  winRate?: number;
  highestScore?: number;
  perfectGames?: number;
  averageSessionTime?: number;
}

interface ProfileAchievements {
  unlocked?: number;
  total?: number;
  progress?: number;
  featured?: Array<{ id?: string; name?: string; tier?: string; description?: string; icon?: unknown; unlockedAt?: string }>;
}

interface ProfileStreaks {
  win?: { current?: number; longest?: number };
  daily?: { current?: number; longest?: number };
}

interface ProfileWallet {
  currentBalance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
}

interface ProfileActivity {
  gameIcon?: unknown;
  gameName?: string;
  outcome?: string;
  score?: number;
  pointsEarned?: number;
  createdAt?: string;
  playedAt?: string;
  duration?: number;
}

interface ProfileData {
  player?: ProfilePlayer;
  progression?: ProfileProgression;
  statistics?: ProfileStatistics;
  achievements?: ProfileAchievements;
  streaks?: ProfileStreaks;
  wallet?: ProfileWallet;
  recentActivity?: ProfileActivity[];
}

interface CertificateItem {
  courseId: string;
  courseTitle?: string;
  verificationSlug?: string | null;
  score?: number | null;
}

interface PaymentTx {
  id?: string;
  currency?: string;
  amount?: number;
  status?: string;
  createdAt?: string;
  courseName?: string;
  premiumGranted?: boolean;
  premiumExpiresAt?: string;
  paymentMethod?: { brand?: string; last4?: string };
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
}

type ProfileTab = 'overview' | 'achievements' | 'activity' | 'payments' | 'settings';

export default function ProfilePage({ params }: { params: Promise<{ playerId: string }> }) {
  const { data: session } = useSession();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [paymentData, setPaymentData] = useState<PaymentTx[] | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [certificatesData, setCertificatesData] = useState<CertificateItem[]>([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [profileSaveLoading, setProfileSaveLoading] = useState(false);
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false);
  const [certificateLinkCopiedId, setCertificateLinkCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setPlayerId(resolvedParams.playerId);
      } catch (error) {
        console.error('Failed to unwrap params:', error);
        if (typeof window !== 'undefined') {
          const pathParts = window.location.pathname.split('/');
          const profileIndex = pathParts.findIndex((part) => part === 'profile');
          if (profileIndex !== -1 && pathParts[profileIndex + 1]) {
            setPlayerId(pathParts[profileIndex + 1]);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (!playerId) return;

    const fetchProfile = async () => {
      setApiLoading(true);
      setApiError(null);
      try {
        const res = await fetch(`/api/profile/${playerId}`);
        const data = await res.json();
        if (data.success) {
          const nextProfile = (data.profile ?? null) as ProfileData | null;
          setProfileData(nextProfile);
          setEditDisplayName(nextProfile?.player?.displayName ?? '');
        } else {
          setApiError(data.error || 'Failed to load profile');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setApiError('Network error - failed to load profile');
      } finally {
        setApiLoading(false);
      }
    };

    fetchProfile();
  }, [playerId]);

  const user = session?.user as { id?: string; playerId?: string } | undefined;
  const currentUserId = user?.playerId || user?.id;
  const isOwnProfile = currentUserId === playerId;

  useEffect(() => {
    if (!isOwnProfile || !session) return;

    const fetchPayments = async () => {
      setPaymentLoading(true);
      try {
        const res = await fetch('/api/payments/history');
        const data = await res.json();
        if (data.success) setPaymentData((data.transactions || []) as PaymentTx[]);
      } catch (error) {
        console.error('Failed to fetch payment history:', error);
      } finally {
        setPaymentLoading(false);
      }
    };

    fetchPayments();
  }, [isOwnProfile, session]);

  useEffect(() => {
    if (!playerId) return;

    const fetchCertificates = async () => {
      setCertificatesLoading(true);
      try {
        const coursesRes = await fetch(`/api/profile/${playerId}/courses`);
        const coursesData = await coursesRes.json();

        if (coursesData.success && coursesData.courses.length > 0) {
          const certificatePromises = coursesData.courses.map(async (course: { courseId: string; title?: string }) => {
            try {
              const statusRes = await fetch(`/api/profile/${playerId}/certificate-status?courseId=${encodeURIComponent(course.courseId)}`);
              const statusData = await statusRes.json();
              if (statusData.success && statusData.data.certificateEligible) {
                return {
                  courseId: course.courseId,
                  courseTitle: course.title,
                  score: statusData.data.finalExamScore,
                  verificationSlug: statusData.data.verificationSlug ?? null,
                };
              }
              return null;
            } catch (error) {
              console.error(`Failed to fetch certificate status for ${course.courseId}:`, error);
              return null;
            }
          });

          const certificates = (await Promise.all(certificatePromises)).filter((certificate): certificate is CertificateItem => certificate !== null);
          setCertificatesData(certificates);
        }
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setCertificatesLoading(false);
      }
    };

    fetchCertificates();
  }, [playerId]);

  const refreshProfile = async () => {
    if (!playerId) return;
    const profileRes = await fetch(`/api/profile/${playerId}`);
    const profileJson = await profileRes.json();
    if (profileJson.success) {
      const nextProfile = (profileJson.profile ?? null) as ProfileData | null;
      setProfileData(nextProfile);
      setEditDisplayName(nextProfile?.player?.displayName ?? '');
    }
  };

  const handleProfilePhotoUpload = async (file: File | null) => {
    if (!file) return;
    setPhotoUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/profile/photo', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        await refreshProfile();
        notifications.show({ color: 'green', title: 'Photo updated', message: 'Your profile photo was saved.' });
      } else {
        notifications.show({ color: 'red', title: 'Upload failed', message: data.error || 'Failed to upload photo.' });
      }
    } catch (err) {
      console.error(err);
      notifications.show({ color: 'red', title: 'Upload failed', message: 'Failed to upload photo.' });
    } finally {
      setPhotoUploadLoading(false);
    }
  };

  const handleSaveDisplayName = async () => {
    setProfileSaveLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: editDisplayName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshProfile();
        notifications.show({ color: 'green', title: 'Profile saved', message: 'Your display name was updated.' });
      } else {
        notifications.show({ color: 'red', title: 'Save failed', message: data.error || 'Failed to save profile.' });
      }
    } catch (err) {
      console.error(err);
      notifications.show({ color: 'red', title: 'Save failed', message: 'Failed to save profile.' });
    } finally {
      setProfileSaveLoading(false);
    }
  };

  const handleUpdatePreference = async (body: Record<string, string>, successMessage: string) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        await refreshProfile();
        notifications.show({ color: 'green', title: 'Profile saved', message: successMessage });
        return true;
      }
      notifications.show({ color: 'red', title: 'Save failed', message: data.error || 'Failed to save profile.' });
    } catch (err) {
      console.error(err);
      notifications.show({ color: 'red', title: 'Save failed', message: 'Failed to save profile.' });
    }
    return false;
  };

  const profileTabs = [
    { value: 'overview', label: 'Overview', icon: IconTrendingUp },
    { value: 'achievements', label: 'Achievements', icon: IconTrophy },
    { value: 'activity', label: 'Activity', icon: IconClock },
    ...(isOwnProfile ? [{ value: 'payments', label: 'Payments', icon: IconCreditCard }] : []),
    ...(isOwnProfile ? [{ value: 'settings', label: 'Profile settings', icon: IconSettings }] : []),
  ] as const;

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <StateBlock kind="loading" title="Loading profile..." />
      </Container>
    );
  }

  if (!playerId) {
    return (
      <Container size="lg" py="xl">
        <StateBlock
          kind="error"
          title="Profile not found"
          description="The requested profile could not be resolved."
          icon={<IconAlertTriangle size={28} />}
        />
      </Container>
    );
  }

  const progression = profileData?.progression;
  const xpProgress = progression
    ? Math.min(100, Math.max(0, ((progression.currentXP ?? 0) / (progression.xpToNextLevel || 1)) * 100))
    : 0;
  const achievementProgress = profileData?.achievements?.progress ?? 0;
  const selectedLanguage = (profileData?.player?.locale && locales.includes(profileData.player.locale as Locale)
    ? profileData.player.locale
    : locale) as Locale;

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Title order={1} c="white">Profile</Title>
            <Text c="gray.4">Player ID: {playerId}</Text>
          </Stack>
          {isOwnProfile && <Badge variant="light" color="amanobaYellow">Your profile</Badge>}
        </Group>

        {apiLoading && (
          <Card padding="lg">
            <Group>
              <Loader size="sm" color="amanobaYellow" />
              <Text>Fetching profile data...</Text>
            </Group>
          </Card>
        )}

        {apiError && (
          <Alert color="red" icon={<IconAlertTriangle size={18} />} title="Could not load profile">
            {apiError}
          </Alert>
        )}

        {profileData && (
          <>
            <Card padding="lg">
              <Group align="flex-start" gap="lg" wrap="nowrap">
                <PlayerAvatar
                  playerId={profileData.player?.id ?? ''}
                  displayName={profileData.player?.displayName ?? 'Unknown'}
                  profilePicture={profileData.player?.profilePicture ?? undefined}
                  level={profileData.progression?.level ?? 1}
                  isPremium={profileData.player?.isPremium ?? false}
                  size="xl"
                  clickable={false}
                />
                <Stack gap="md" flex={1}>
                  <Group gap="sm" align="center">
                    <Title order={2}>{profileData.player?.displayName || 'Unknown Player'}</Title>
                    {profileData.player?.isPremium && <Badge color="amanobaYellow">Premium</Badge>}
                  </Group>
                  <Text size="xl" fw={700}>{profileData.progression?.title || 'Rookie'}</Text>
                  <SimpleGrid cols={{ base: 2, md: 5 }}>
                    {[
                      ['Level', profileData.progression?.level || 1],
                      ['Games Played', profileData.statistics?.totalGamesPlayed || 0],
                      ['Win Rate', `${profileData.statistics?.winRate || 0}%`],
                      ['Achievements', `${profileData.achievements?.unlocked || 0}/${profileData.achievements?.total || 0}`],
                      ['Certificates', certificatesData.length],
                    ].map(([label, value]) => (
                      <Paper key={label} withBorder radius="md" p="sm">
                        <Text size="xs" c="dimmed">{label}</Text>
                        <Text size="xl" fw={800}>{value}</Text>
                      </Paper>
                    ))}
                  </SimpleGrid>
                  {progression && (
                    <Stack gap={4}>
                      <Group justify="space-between">
                        <Text size="sm">Level {progression.level}</Text>
                        <Text size="sm" c="dimmed">{progression.currentXP} / {progression.xpToNextLevel} XP</Text>
                      </Group>
                      <Progress value={xpProgress} color="amanobaYellow" />
                      {progression.nextTitle && <Text size="sm" c="dimmed">Next title: {progression.nextTitle}</Text>}
                    </Stack>
                  )}
                </Stack>
              </Group>
            </Card>

            <Tabs value={activeTab} onChange={(value) => setActiveTab((value || 'overview') as ProfileTab)}>
              <Tabs.List>
                {profileTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Tabs.Tab key={tab.value} value={tab.value} leftSection={<Icon size={16} />}>
                      {tab.label}
                    </Tabs.Tab>
                  );
                })}
              </Tabs.List>

              <Tabs.Panel value="overview" pt="lg">
                <Stack gap="lg">
                  <SimpleGrid cols={{ base: 1, md: 2 }}>
                    <MetricCard icon={<IconFlame size={22} />} title="Win Streak" subtitle="Current winning streak" current={profileData.streaks?.win?.current || 0} best={profileData.streaks?.win?.longest || 0} />
                    <MetricCard icon={<IconCalendar size={22} />} title="Daily Streak" subtitle="Consecutive login days" current={profileData.streaks?.daily?.current || 0} best={profileData.streaks?.daily?.longest || 0} />
                  </SimpleGrid>
                  <SimpleGrid cols={{ base: 1, md: 2 }}>
                    {profileData.wallet && (
                      <Card withBorder padding="lg">
                        <Stack gap="md">
                          <Group>
                            <ThemeIcon color="amanobaYellow" variant="light"><IconCoin size={20} /></ThemeIcon>
                            <Title order={3} size="h4">Points Wallet</Title>
                          </Group>
                          <KeyValue label="Current Balance" value={profileData.wallet.currentBalance.toLocaleString()} />
                          <KeyValue label="Lifetime Earned" value={profileData.wallet.lifetimeEarned.toLocaleString()} />
                          <KeyValue label="Lifetime Spent" value={profileData.wallet.lifetimeSpent.toLocaleString()} />
                        </Stack>
                      </Card>
                    )}
                    <Card withBorder padding="lg">
                      <Stack gap="md">
                        <Group>
                          <ThemeIcon color="blue" variant="light"><IconTarget size={20} /></ThemeIcon>
                          <Title order={3} size="h4">Performance</Title>
                        </Group>
                        <KeyValue label="Highest Score" value={profileData.statistics?.highestScore?.toLocaleString() || '0'} />
                        <KeyValue label="Perfect Games" value={String(profileData.statistics?.perfectGames || 0)} />
                        <KeyValue label="Avg Session" value={profileData.statistics?.averageSessionTime ? `${Math.round(profileData.statistics.averageSessionTime / 60)}m` : '0m'} />
                      </Stack>
                    </Card>
                  </SimpleGrid>
                  <CertificatesCard
                    certificates={certificatesData}
                    loading={certificatesLoading}
                    locale={locale}
                    playerId={playerId}
                    copiedId={certificateLinkCopiedId}
                    onCopy={(cert) => {
                      if (!cert.verificationSlug) return;
                      const url = `${window.location.origin}/${locale}/certificate/${cert.verificationSlug}`;
                      navigator.clipboard.writeText(url).then(() => {
                        setCertificateLinkCopiedId(cert.courseId);
                        setTimeout(() => setCertificateLinkCopiedId(null), 2000);
                        notifications.show({ color: 'green', title: 'Link copied', message: 'Certificate verification link copied.' });
                      });
                    }}
                  />
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="achievements" pt="lg">
                <Card padding="lg">
                  <Stack gap="lg">
                    <Group justify="space-between">
                      <Title order={2} size="h3">Achievement Progress</Title>
                      <Badge variant="light">{achievementProgress}% Complete</Badge>
                    </Group>
                    <Progress value={achievementProgress} color="amanobaYellow" />
                    <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
                      {profileData.achievements?.featured && profileData.achievements.featured.length > 0 ? (
                        profileData.achievements.featured.map((achievement) => (
                          <Card key={achievement.id ?? achievement.name ?? ''} withBorder padding="md">
                            <Group align="flex-start">
                              <ThemeIcon size={44} radius="md" color="amanobaYellow" variant="light">
                                <Text>{achievement.icon != null ? String(achievement.icon) : '🏆'}</Text>
                              </ThemeIcon>
                              <Stack gap={4} flex={1}>
                                <Group gap="xs">
                                  <Text fw={700}>{achievement.name}</Text>
                                  <Badge size="xs" color={achievement.tier === 'legendary' ? 'yellow' : achievement.tier === 'epic' ? 'grape' : achievement.tier === 'rare' ? 'blue' : 'gray'}>
                                    {(achievement.tier ?? 'common').toUpperCase()}
                                  </Badge>
                                </Group>
                                <Text size="sm" c="dimmed">{achievement.description}</Text>
                                <Text size="xs" c="dimmed">Unlocked {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : '-'}</Text>
                              </Stack>
                            </Group>
                          </Card>
                        ))
                      ) : (
                        <Paper withBorder radius="md" p="xl">
                          <Text c="dimmed">No achievements unlocked yet.</Text>
                        </Paper>
                      )}
                    </SimpleGrid>
                  </Stack>
                </Card>
              </Tabs.Panel>

              <Tabs.Panel value="activity" pt="lg">
                <Card padding="lg">
                  <Stack gap="md">
                    <Title order={2} size="h3">Recent Activity</Title>
                    {profileData.recentActivity && profileData.recentActivity.length > 0 ? (
                      profileData.recentActivity.map((activity, index) => (
                        <Paper key={`${activity.createdAt ?? activity.playedAt ?? index}`} withBorder radius="md" p="md">
                          <Group justify="space-between" align="center">
                            <Group>
                              <ThemeIcon size={44} color="amanobaYellow" variant="light">
                                <Text>{activity.gameIcon != null ? String(activity.gameIcon) : '🎮'}</Text>
                              </ThemeIcon>
                              <Stack gap={2}>
                                <Text fw={700}>{activity.gameName}</Text>
                                <Text size="sm" c="dimmed">
                                  {activity.outcome === 'win' ? 'Victory' : activity.outcome === 'loss' ? 'Defeat' : 'Draw'} · Score: {activity.score ?? 0} · +{activity.pointsEarned ?? 0} points
                                </Text>
                              </Stack>
                            </Group>
                            <Stack gap={2} align="flex-end">
                              <Text size="sm" c="dimmed">{new Date(activity.playedAt ?? activity.createdAt ?? 0).toLocaleDateString()}</Text>
                              <Text size="xs" c="dimmed">{Math.round((activity.duration ?? 0) / 60)}m {(activity.duration ?? 0) % 60}s</Text>
                            </Stack>
                          </Group>
                        </Paper>
                      ))
                    ) : (
                      <Text c="dimmed">No recent activity.</Text>
                    )}
                  </Stack>
                </Card>
              </Tabs.Panel>

              {isOwnProfile && (
                <Tabs.Panel value="payments" pt="lg">
                  <Card padding="lg">
                    <Stack gap="md">
                      <Title order={2} size="h3">Payment History</Title>
                      {paymentLoading ? (
                        <Stack>{[1, 2, 3].map((item) => <Skeleton key={item} height={76} radius="md" />)}</Stack>
                      ) : paymentData && paymentData.length > 0 ? (
                        paymentData.map((tx, txIndex) => <PaymentRow key={tx.id ?? txIndex} tx={tx} />)
                      ) : (
                        <Center py="xl">
                          <Stack align="center">
                            <ThemeIcon size={60} color="gray" variant="light"><IconCreditCard size={32} /></ThemeIcon>
                            <Text fw={700}>No payment history</Text>
                            <Text c="dimmed" size="sm">Your payment transactions will appear here.</Text>
                          </Stack>
                        </Center>
                      )}
                    </Stack>
                  </Card>
                </Tabs.Panel>
              )}

              {isOwnProfile && (
                <Tabs.Panel value="settings" pt="lg">
                  <Card padding="lg">
                    <Stack gap="lg">
                      <Title order={2} size="h3">Profile customization</Title>
                      <Paper withBorder radius="md" p="md">
                        <Group align="center">
                          <PlayerAvatar
                            playerId={profileData.player?.id ?? ''}
                            displayName={profileData.player?.displayName ?? 'Unknown'}
                            profilePicture={profileData.player?.profilePicture ?? undefined}
                            level={profileData.progression?.level ?? 1}
                            isPremium={profileData.player?.isPremium ?? false}
                            size="xl"
                            clickable={false}
                          />
                          <Stack gap={4}>
                            <FileButton onChange={handleProfilePhotoUpload} accept="image/jpeg,image/jpg,image/png,image/webp,image/gif">
                              {(props) => (
                                <Button {...props} loading={photoUploadLoading} leftSection={<IconUpload size={16} />}>
                                  Change photo
                                </Button>
                              )}
                            </FileButton>
                            <Text size="xs" c="dimmed">JPEG, PNG, WebP or GIF, max 5MB.</Text>
                          </Stack>
                        </Group>
                      </Paper>
                      <Group align="flex-end">
                        <TextInput
                          label="Display name (nickname)"
                          description="Shown on profile, leaderboards, certificates. Max 50 characters."
                          value={editDisplayName}
                          onChange={(event) => setEditDisplayName(event.currentTarget.value)}
                          maxLength={50}
                          placeholder="Your display name"
                          flex={1}
                        />
                        <Button
                          type="button"
                          loading={profileSaveLoading}
                          disabled={editDisplayName.trim() === (profileData.player?.displayName ?? '')}
                          leftSection={<IconDeviceFloppy size={16} />}
                          onClick={handleSaveDisplayName}
                        >
                          Save
                        </Button>
                      </Group>
                      <SimpleGrid cols={{ base: 1, md: 2 }}>
                        <Select
                          label="Profile visibility"
                          description="When private, others see profile not available."
                          value={profileData.player?.profileVisibility ?? 'private'}
                          allowDeselect={false}
                          data={[
                            { value: 'private', label: 'Private' },
                            { value: 'public', label: 'Public' },
                            { value: 'friends', label: 'Friends only' },
                          ]}
                          onChange={async (value) => {
                            if (!value) return;
                            await handleUpdatePreference({ profileVisibility: value }, 'Profile visibility was updated.');
                          }}
                        />
                        <Select
                          label="Language"
                          description="Interface language. Also used for emails and course recommendations."
                          value={selectedLanguage}
                          allowDeselect={false}
                          data={locales.map((loc) => ({ value: loc, label: languageNames[loc] ?? loc }))}
                          onChange={async (value) => {
                            const newLocale = value as Locale | null;
                            if (!newLocale || !locales.includes(newLocale)) return;
                            const saved = await handleUpdatePreference({ locale: newLocale }, 'Language preference was updated.');
                            if (saved) {
                              const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}(/|$)`), '$1') || '/';
                              router.push(`/${newLocale}${pathWithoutLocale}`);
                            }
                          }}
                        />
                      </SimpleGrid>
                    </Stack>
                  </Card>
                </Tabs.Panel>
              )}
            </Tabs>
          </>
        )}
      </Stack>
    </Container>
  );
}

function MetricCard({
  icon,
  title,
  subtitle,
  current,
  best,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  current: number;
  best: number;
}) {
  return (
    <Card withBorder padding="lg">
      <Stack gap="md">
        <Group>
          <ThemeIcon color="amanobaYellow" variant="light">{icon}</ThemeIcon>
          <Stack gap={0}>
            <Title order={3} size="h4">{title}</Title>
            <Text size="sm" c="dimmed">{subtitle}</Text>
          </Stack>
        </Group>
        <SimpleGrid cols={2}>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">Current</Text>
            <Text size="xl" fw={800}>{current}</Text>
          </Stack>
          <Stack gap={0}>
            <Text size="sm" c="dimmed">Best</Text>
            <Text size="xl" fw={800}>{best}</Text>
          </Stack>
        </SimpleGrid>
      </Stack>
    </Card>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <Group justify="space-between">
      <Text c="dimmed">{label}</Text>
      <Text fw={700}>{value}</Text>
    </Group>
  );
}

function CertificatesCard({
  certificates,
  loading,
  locale,
  playerId,
  copiedId,
  onCopy,
}: {
  certificates: CertificateItem[];
  loading: boolean;
  locale: string;
  playerId: string;
  copiedId: string | null;
  onCopy: (certificate: CertificateItem) => void;
}) {
  return (
    <Card withBorder padding="lg">
      <Stack gap="md">
        <Group>
          <ThemeIcon color="amanobaYellow" variant="light"><IconAward size={20} /></ThemeIcon>
          <Title order={3} size="h4">Certificates</Title>
        </Group>
        {loading ? (
          <Stack>{[1, 2, 3].map((item) => <Skeleton key={item} height={72} radius="md" />)}</Stack>
        ) : certificates.length > 0 ? (
          certificates.map((cert) => (
            <Paper key={cert.courseId} withBorder radius="md" p="md">
              <Group justify="space-between" align="center">
                <Box component="a" href={`/${locale}/profile/${playerId}/certificate/${cert.courseId}`} flex={1}>
                  <Text fw={700}>{cert.courseTitle}</Text>
                  {cert.score !== null && <Text size="sm" c="dimmed">Score: {cert.score}%</Text>}
                </Box>
                <Group gap="xs">
                  {cert.verificationSlug && (
                    <Button
                      type="button"
                      variant="default"
                      size="xs"
                      leftSection={copiedId === cert.courseId ? <IconCheck size={14} /> : <IconLink size={14} />}
                      onClick={() => onCopy(cert)}
                    >
                      {copiedId === cert.courseId ? 'Copied' : 'Copy link'}
                    </Button>
                  )}
                  <Button component="a" href={`/${locale}/profile/${playerId}/certificate/${cert.courseId}`} size="xs">
                    View Certificate
                  </Button>
                </Group>
              </Group>
            </Paper>
          ))
        ) : (
          <Stack align="center" py="md">
            <Text c="dimmed">No certificates yet</Text>
            <Text size="sm" c="dimmed">Complete courses and pass final exams to earn certificates.</Text>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

function PaymentRow({ tx }: { tx: PaymentTx }) {
  const currency = (tx.currency ?? 'USD').toUpperCase();
  const amount = (tx.amount ?? 0) / 100;
  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  const status = tx.status ?? '';
  const statusColor = status === 'succeeded' ? 'green' : status === 'pending' ? 'yellow' : status === 'failed' ? 'red' : 'gray';

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Text fw={700}>{tx.courseName || 'Premium Access'}</Text>
            <Text size="sm" c="dimmed">
              {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) : '-'}
            </Text>
          </Stack>
          <Stack gap={2} align="flex-end">
            <Text fw={800}>{formattedAmount}</Text>
            <Badge color={statusColor}>{status ? status.charAt(0).toUpperCase() + status.slice(1) : '-'}</Badge>
          </Stack>
        </Group>
        {(tx.premiumGranted && tx.premiumExpiresAt) || tx.paymentMethod ? (
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {tx.premiumGranted && tx.premiumExpiresAt && (
              <Stack gap={2}>
                <Text size="xs" c="dimmed">Premium Expires</Text>
                <Text size="sm">{new Date(tx.premiumExpiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
              </Stack>
            )}
            {tx.paymentMethod && (
              <Stack gap={2}>
                <Text size="xs" c="dimmed">Payment Method</Text>
                <Text size="sm">
                  {tx.paymentMethod.brand
                    ? `${tx.paymentMethod.brand.charAt(0).toUpperCase() + tx.paymentMethod.brand.slice(1)} **** ${tx.paymentMethod.last4}`
                    : 'Card'}
                </Text>
              </Stack>
            )}
          </SimpleGrid>
        ) : null}
        {tx.stripeCheckoutSessionId && <Text size="xs" c="dimmed">Transaction ID: {tx.stripePaymentIntentId}</Text>}
      </Stack>
    </Paper>
  );
}
