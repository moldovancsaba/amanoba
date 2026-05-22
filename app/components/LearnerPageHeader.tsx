'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import {
  ActionIcon,
  Button,
  Container,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconBook,
  IconBookmark,
  IconDashboard,
  IconDots,
  IconLogout,
  IconPencil,
  IconRocket,
  IconSparkles,
  IconTargetArrow,
  IconUser,
} from '@tabler/icons-react';
import Logo from '@/components/Logo';
import { LocaleLink } from '@/components/LocaleLink';

type LearnerPageHeaderProps = {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  onRefresh?: () => void;
};

const learnerNavItems = [
  { href: '/dashboard', labelKey: 'title', fallback: 'Dashboard', icon: IconDashboard },
  { href: '/blog', labelKey: null, fallback: 'Blog', icon: IconSparkles },
  { href: '/courses', labelKey: 'courses', fallback: 'Courses', icon: IconBook },
  { href: '/my-courses', labelKey: 'myCourses', fallback: 'My courses', icon: IconRocket },
  { href: '/practice', labelKey: null, fallback: 'Practice Hub', icon: IconTargetArrow },
  { href: '/saved', labelKey: null, fallback: 'Saved Lessons', icon: IconBookmark },
];

export function LearnerPageHeader({ title, subtitle, icon, onRefresh }: LearnerPageHeaderProps) {
  const locale = useLocale();
  const { data: session } = useSession();
  const tDashboard = useTranslations('dashboard');
  const tAuth = useTranslations('auth');
  const [adminAccess, setAdminAccess] = useState<{ canAccessAdmin: boolean; isAdmin: boolean; isEditorOnly: boolean } | null>(null);

  const fetchAdminAccess = useCallback(async () => {
    if (!session?.user) {
      setAdminAccess({ canAccessAdmin: false, isAdmin: false, isEditorOnly: false });
      return;
    }

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
  }, [session?.user]);

  useEffect(() => {
    void fetchAdminAccess();
  }, [fetchAdminAccess]);

  const user = session?.user as { id?: string; playerId?: string } | undefined;
  const currentPlayerId = user?.playerId || user?.id;

  const getLabel = (labelKey: string | null, fallback: string) => {
    if (!labelKey) return fallback;
    const value = tDashboard(labelKey);
    return typeof value === 'string' && value !== labelKey ? value : fallback;
  };

  return (
    <Paper component="header" bg="ink.8" radius={0} withBorder>
      <Container size="xl" py={{ base: 'md', sm: 'lg' }}>
        <Stack gap="md">
          <Group justify="space-between" align="flex-start" gap="md">
            <Group gap="md" wrap="nowrap" style={{ minWidth: 0 }}>
              <Logo size="md" showText={false} linkTo="/dashboard" />
              <Stack gap={4}>
                <Group gap="xs">
                  {icon ? (
                    <ThemeIcon color="amanoba" variant="light" radius="xl">
                      {icon}
                    </ThemeIcon>
                  ) : null}
                  <Title order={1} size="h2" c="white">{title}</Title>
                </Group>
                <Text c="gray.3" size="sm">{subtitle}</Text>
              </Stack>
            </Group>

            <Group gap="xs" visibleFrom="md">
              {onRefresh ? (
                <Button onClick={onRefresh} color="amanoba" variant="light">
                  {tDashboard('refresh')}
                </Button>
              ) : null}
              {currentPlayerId ? (
                <Button component={LocaleLink} href={`/profile/${currentPlayerId}`} variant="outline" color="gray" leftSection={<IconUser size={18} />}>
                  {tDashboard('myProfile')}
                </Button>
              ) : null}
              {adminAccess?.isAdmin ? (
                <Button component={LocaleLink} href="/admin" variant="default">Admin</Button>
              ) : null}
              {adminAccess?.isEditorOnly ? (
                <Button component={LocaleLink} href="/editor/courses" variant="default" leftSection={<IconPencil size={18} />}>Editor</Button>
              ) : null}
              {session?.user ? (
                <Button
                  onClick={() => signOut({ callbackUrl: `/${locale}/auth/signin` })}
                  variant="default"
                  leftSection={<IconLogout size={18} />}
                >
                  {tAuth('signOut')}
                </Button>
              ) : null}
            </Group>

            <Menu position="bottom-end" withinPortal>
              <Menu.Target>
                <ActionIcon variant="default" size="lg" hiddenFrom="md" aria-label="Open navigation menu">
                  <IconDots size={20} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {onRefresh ? <Menu.Item onClick={onRefresh}>{tDashboard('refresh')}</Menu.Item> : null}
                {learnerNavItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Menu.Item key={item.href} component={LocaleLink} href={item.href} leftSection={<ItemIcon size={16} />}>
                      {getLabel(item.labelKey, item.fallback)}
                    </Menu.Item>
                  );
                })}
                {currentPlayerId ? (
                  <Menu.Item component={LocaleLink} href={`/profile/${currentPlayerId}`} leftSection={<IconUser size={16} />}>
                    {tDashboard('myProfile')}
                  </Menu.Item>
                ) : null}
                {adminAccess?.isAdmin ? <Menu.Item component={LocaleLink} href="/admin">Admin</Menu.Item> : null}
                {adminAccess?.isEditorOnly ? <Menu.Item component={LocaleLink} href="/editor/courses">Editor</Menu.Item> : null}
                {session?.user ? (
                  <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={() => signOut({ callbackUrl: `/${locale}/auth/signin` })}>
                    {tAuth('signOut')}
                  </Menu.Item>
                ) : null}
              </Menu.Dropdown>
            </Menu>
          </Group>

          <Group gap="xs" visibleFrom="md">
            {learnerNavItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Button
                  key={item.href}
                  component={LocaleLink}
                  href={item.href}
                  variant="subtle"
                  color="gray"
                  leftSection={<ItemIcon size={18} />}
                >
                  {getLabel(item.labelKey, item.fallback)}
                </Button>
              );
            })}
          </Group>
        </Stack>
      </Container>
    </Paper>
  );
}
