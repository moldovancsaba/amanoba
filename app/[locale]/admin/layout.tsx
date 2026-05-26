/**
 * Admin dashboard layout — `@doneisbetter/gds-admin` AppShell with Amanoba navigation.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from '@doneisbetter/gds-admin/client';
import {
  Avatar,
  Box,
  Divider,
  Group,
  Menu,
  NavLink,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  IconAward,
  IconBook,
  IconChartBar,
  IconClipboardList,
  IconCreditCard,
  IconCrown,
  IconDeviceGamepad2,
  IconGift,
  IconHelp,
  IconLayoutDashboard,
  IconLogout,
  IconMail,
  IconMap2,
  IconSettings,
  IconTarget,
  IconThumbUp,
  IconTrophy,
  IconUser,
  IconUsers,
} from '@tabler/icons-react';
import type { TablerIcon } from '@tabler/icons-react';
import Logo from '@/components/Logo';

const allNavigationItems: Array<{
  key: string;
  href: string;
  icon: TablerIcon;
}> = [
  { key: 'dashboard', href: '/admin', icon: IconLayoutDashboard },
  { key: 'analytics', href: '/admin/analytics', icon: IconChartBar },
  { key: 'payments', href: '/admin/payments', icon: IconCreditCard },
  { key: 'emailAnalytics', href: '/admin/email-analytics', icon: IconMail },
  { key: 'surveys', href: '/admin/surveys', icon: IconClipboardList },
  { key: 'votes', href: '/admin/votes', icon: IconThumbUp },
  { key: 'courses', href: '/admin/courses', icon: IconBook },
  { key: 'questions', href: '/admin/questions', icon: IconHelp },
  { key: 'certificates', href: '/admin/certificates', icon: IconAward },
  { key: 'users', href: '/admin/players', icon: IconUsers },
  { key: 'games', href: '/admin/games', icon: IconDeviceGamepad2 },
  { key: 'achievements', href: '/admin/achievements', icon: IconTrophy },
  { key: 'rewards', href: '/admin/rewards', icon: IconGift },
  { key: 'challenges', href: '/admin/challenges', icon: IconTarget },
  { key: 'quests', href: '/admin/quests', icon: IconMap2 },
  { key: 'featureFlags', href: '/admin/feature-flags', icon: IconSettings },
  { key: 'settings', href: '/admin/settings', icon: IconSettings },
];

const editorOnlyNavKeys = new Set(['dashboard', 'courses']);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations('admin');
  const pathname = usePathname();
  const [version, setVersion] = useState('2.7.0');
  const [isEditorOnly, setIsEditorOnly] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/admin/system-info')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.systemInfo?.version) {
          setVersion(data.systemInfo.version);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/admin/access')
      .then((res) => res.json())
      .then((data) => {
        if (data?.canAccessAdmin !== true) {
          router.replace(`/${locale}/dashboard?error=admin_access_required`);
          return;
        }
        setIsEditorOnly(data.isEditorOnly === true);
      })
      .catch(() => {
        router.replace(`/${locale}/dashboard?error=admin_access_required`);
      });
  }, [locale, router]);

  const navigationItems =
    isEditorOnly === true
      ? allNavigationItems.filter((item) => editorOnlyNavKeys.has(item.key))
      : allNavigationItems;

  if (isEditorOnly === null) {
    return (
      <QueryClientProvider client={queryClient}>
        <Box bg="ink.9" mih="100vh" />
      </QueryClientProvider>
    );
  }

  const profileHref = session?.user?.id
    ? `/${locale}/profile/${session.user.id}`
    : `/${locale}/dashboard`;

  const primaryNavigation = (
    <Stack gap={4}>
      <UnstyledButton component={Link} href={`/${locale}/admin`} mb="xs">
        <Group gap="sm" wrap="nowrap">
          <Logo size="sm" showText={false} linkTo="" preventShrink />
          <Stack gap={0}>
            <Text fw={700} c="white" size="sm">
              Amanoba
            </Text>
            <Text size="xs" c="dimmed">
              Admin Panel
            </Text>
          </Stack>
        </Group>
      </UnstyledButton>
      {navigationItems.map((item) => {
        const fullPath = `/${locale}${item.href}`;
        const isActive = pathname === fullPath || pathname.startsWith(`${fullPath}/`);
        const Icon = item.icon;

        return (
          <NavLink
            key={item.href}
            component={Link}
            href={fullPath}
            label={t(item.key)}
            leftSection={<Icon size={18} stroke={1.75} />}
            active={isActive}
            color="amanoba"
            variant="light"
          />
        );
      })}
    </Stack>
  );

  const headerActions = (
      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <UnstyledButton>
            <Group gap="sm" wrap="nowrap">
              <Stack gap={0} visibleFrom="sm" align="flex-end">
                <Text size="sm" fw={600} c="white">
                  {session?.user?.name || session?.user?.email || t('adminUser')}
                </Text>
                <Text size="xs" c="dimmed">
                  {isEditorOnly ? t('editor') : t('administrator')}
                </Text>
              </Stack>
              <Avatar color="gray" radius="xl" size={40}>
                <IconCrown size={22} />
              </Avatar>
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            component={Link}
            href={profileHref}
            leftSection={<IconUser size={16} />}
          >
            {t('profile')}
          </Menu.Item>
          <Menu.Item
            leftSection={<IconLogout size={16} />}
            onClick={async () => {
              await signOut({ redirect: false });
              router.push(`/${locale}/auth/signin`);
            }}
          >
            {t('logout')}
          </Menu.Item>
          <Divider />
          <Menu.Label>
            v{version} | Admin Mode
          </Menu.Label>
        </Menu.Dropdown>
      </Menu>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell
        logoText="Amanoba"
        headerContext="Admin Panel"
        primaryNavigation={primaryNavigation}
        headerActions={headerActions}
      >
        {children}
      </AppShell>
    </QueryClientProvider>
  );
}
