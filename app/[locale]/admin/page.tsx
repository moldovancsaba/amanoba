/**
 * Admin Home Dashboard
 *
 * Overview dashboard showing platform metrics, recent activity,
 * operational signals, and quick action buttons for common admin tasks.
 */

'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Alert,
  Badge,
  Button,
  Card,
  Center,
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
import {
  IconActivity,
  IconAlertTriangle,
  IconArrowUpRight,
  IconBook,
  IconDeviceGamepad2,
  IconGift,
  IconPlus,
  IconServer,
  IconTrophy,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';

export const dynamic = 'force-dynamic';

interface DashboardStats {
  totalPlayers: number;
  activePlayers: number;
  totalGames: number;
  totalSessions: number;
  sessionsThisMonth: number;
  pointsEarned: number;
  pointsThisMonth: number;
  achievementsUnlocked: number;
  achievementsThisMonth: number;
  revenueThisMonth: number;
  growthRate: {
    players: number;
    sessions: number;
    achievements: number;
    points: number;
  };
  activeSessions: number;
  recentActivity?: Array<{
    type: string;
    message: string;
    time: string;
  }>;
}

export default function AdminDashboardPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemInfo, setSystemInfo] = useState<{
    version: string;
    environment: string;
    database: string;
    uptime: string;
  } | null>(null);

  useEffect(() => {
    fetchStats();
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const response = await fetch('/api/admin/system-info');
      const data = await response.json();
      if (data.success) setSystemInfo(data.systemInfo);
    } catch (err) {
      console.error('Failed to fetch system info:', err);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        setError(data.error || 'Failed to load statistics');
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatGrowthRate = (rate: number) => {
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Center mih={400}>
          <Group>
            <Loader color="amanobaYellow" />
            <Text c="white">{tCommon('loading')}</Text>
          </Group>
        </Center>
      </Container>
    );
  }

  if (error || !stats) {
    return (
      <Container size="sm" py="xl">
        <Center mih={400}>
          <Alert color="red" icon={<IconAlertTriangle size={18} />} title={error || tCommon('error')}>
            <Button mt="md" onClick={fetchStats}>{tCommon('retry')}</Button>
          </Alert>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={1} c="white">{t('dashboardTitle')}</Title>
          <Text c="gray.4">{t('dashboardDescription')}</Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }}>
          <StatCard
            icon={<IconUsers size={24} />}
            value={stats.totalPlayers.toLocaleString()}
            label={t('totalPlayers')}
            detail={`${stats.activePlayers} ${t('activePlayers').toLowerCase()}`}
            growth={stats.growthRate.players}
            formatGrowthRate={formatGrowthRate}
          />
          <StatCard
            icon={<IconDeviceGamepad2 size={24} />}
            value={stats.totalSessions.toLocaleString()}
            label={t('totalSessions')}
            detail={`${stats.sessionsThisMonth.toLocaleString()} ${t('thisMonth').toLowerCase()}`}
            growth={stats.growthRate.sessions}
            formatGrowthRate={formatGrowthRate}
          />
          <StatCard
            icon={<IconTrophy size={24} />}
            value={stats.achievementsUnlocked.toLocaleString()}
            label={t('achievementsUnlocked')}
            detail={`${stats.achievementsThisMonth.toLocaleString()} ${t('thisMonth').toLowerCase()}`}
            growth={stats.growthRate.achievements}
            formatGrowthRate={formatGrowthRate}
          />
          <StatCard
            icon={<IconTrendingUp size={24} />}
            value={stats.pointsEarned.toLocaleString()}
            label={t('pointsEarned')}
            detail={`${stats.pointsThisMonth.toLocaleString()} ${t('thisMonth').toLowerCase()}`}
            growth={stats.growthRate.points}
            formatGrowthRate={formatGrowthRate}
          />
        </SimpleGrid>

        <Card padding="lg">
          <Stack gap="md">
            <Title order={2} size="h3">{t('quickActions')}</Title>
            <SimpleGrid cols={{ base: 2, md: 4 }}>
              <QuickAction href={`/${locale}/admin/games`} icon={<IconPlus size={22} />} label={t('addGame')} />
              <QuickAction href={`/${locale}/admin/achievements`} icon={<IconTrophy size={22} />} label={t('addAchievement')} />
              <QuickAction href={`/${locale}/admin/rewards`} icon={<IconGift size={22} />} label={t('addReward')} />
              <QuickAction href={`/${locale}/admin/players`} icon={<IconUsers size={22} />} label={t('managePlayers')} />
              <QuickAction href={`/${locale}/admin/courses`} icon={<IconBook size={22} />} label={t('manageCourses')} />
            </SimpleGrid>
          </Stack>
        </Card>

        <SimpleGrid cols={{ base: 1, lg: 2 }}>
          <Card padding="lg">
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={2} size="h3">{t('recentActivity')}</Title>
                <ThemeIcon color="amanobaYellow" variant="light"><IconActivity size={20} /></ThemeIcon>
              </Group>
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <Paper key={`${activity.time}-${index}`} withBorder radius="md" p="md">
                    <Group align="flex-start">
                      <Badge color={activity.type === 'player' ? 'green' : activity.type === 'achievement' ? 'yellow' : activity.type === 'game' ? 'amanobaYellow' : 'pink'}>{activity.type}</Badge>
                      <Stack gap={2} flex={1}>
                        <Text size="sm">{activity.message}</Text>
                        <Text size="xs" c="dimmed">{activity.time}</Text>
                      </Stack>
                    </Group>
                  </Paper>
                ))
              ) : (
                <Text c="dimmed" ta="center" py="md">{t('noRecentActivity')}</Text>
              )}
              <Button component={Link} href={`/${locale}/admin/analytics`} variant="subtle" rightSection={<IconArrowUpRight size={16} />}>
                {t('viewAllActivity')}
              </Button>
            </Stack>
          </Card>

          <Card padding="lg">
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={2} size="h3">{t('operationalSignals')}</Title>
                <ThemeIcon color="amanobaYellow" variant="light"><IconServer size={20} /></ThemeIcon>
              </Group>
              <KeyValue label={t('database')} value={systemInfo?.database === 'connected' ? t('connected') : t('disconnected')} status={systemInfo?.database === 'connected' ? 'green' : 'red'} />
              <KeyValue label={t('environment')} value={systemInfo?.environment || 'development'} />
              <KeyValue label={t('uptime')} value={systemInfo?.uptime ?? '-'} />
              <KeyValue label={t('activeSessions')} value={stats.activeSessions.toLocaleString()} />
              <KeyValue label={t('revenueThisMonth')} value={stats.revenueThisMonth.toLocaleString()} />
            </Stack>
          </Card>
        </SimpleGrid>

        <Card padding="lg">
          <Stack gap="md">
            <Title order={2} size="h3">{t('systemInformation')}</Title>
            <SimpleGrid cols={{ base: 2, md: 4 }}>
              <InfoCell label={t('version')} value={systemInfo?.version ? `v${systemInfo.version}` : '-'} />
              <InfoCell label={t('environment')} value={systemInfo?.environment || 'development'} />
              <InfoCell label={t('database')} value={systemInfo?.database === 'connected' ? t('connected') : t('disconnected')} />
              <InfoCell label={t('uptime')} value={systemInfo?.uptime ?? '-'} />
            </SimpleGrid>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

function StatCard({
  icon,
  value,
  label,
  detail,
  growth,
  formatGrowthRate,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  detail: string;
  growth: number;
  formatGrowthRate: (rate: number) => string;
}) {
  return (
    <Card padding="lg">
      <Stack gap="md">
        <Group justify="space-between">
          <ThemeIcon color="amanobaYellow" variant="light" size="lg">{icon}</ThemeIcon>
          {growth !== 0 && (
            <Badge color={growth >= 0 ? 'green' : 'red'} leftSection={<IconArrowUpRight size={12} />}>
              {formatGrowthRate(growth)}
            </Badge>
          )}
        </Group>
        <Stack gap={2}>
          <Text size="xl" fw={800}>{value}</Text>
          <Text c="dimmed" size="sm">{label}</Text>
          <Text c="dimmed" size="xs">{detail}</Text>
        </Stack>
      </Stack>
    </Card>
  );
}

function QuickAction({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Button component={Link} href={href} variant="default" h={92}>
      <Stack gap="xs" align="center">
        <ThemeIcon color="amanobaYellow" variant="light">{icon}</ThemeIcon>
        <Text size="sm" fw={700}>{label}</Text>
      </Stack>
    </Button>
  );
}

function KeyValue({ label, value, status }: { label: string; value: string; status?: 'green' | 'red' }) {
  return (
    <Group justify="space-between">
      <Text c="dimmed" size="sm">{label}</Text>
      <Text fw={700} c={status}>{value}</Text>
    </Group>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <Paper withBorder radius="md" p="md">
      <Text size="xs" c="dimmed">{label}</Text>
      <Text fw={700}>{value}</Text>
    </Paper>
  );
}
