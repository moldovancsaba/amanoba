/**
 * Editor portal layout — `@doneisbetter/gds-admin` AppShell with Amanoba navigation.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { AppShell } from '@doneisbetter/gds-admin/client';
import {
  Avatar,
  Box,
  Center,
  Group,
  Loader,
  Menu,
  NavLink,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { IconBook, IconLogout, IconUser } from '@tabler/icons-react';
import Logo from '@/components/Logo';

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [canAccessEditor, setCanAccessEditor] = useState<boolean | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      const callbackUrl = encodeURIComponent(`/${locale}/editor${window.location.search}`);
      router.replace(`/${locale}/auth/signin?callbackUrl=${callbackUrl}`);
      return;
    }

    fetch('/api/editor/access')
      .then((r) => r.json())
      .then((d) => {
        if (d?.canAccessEditor !== true) {
          router.replace(`/${locale}/dashboard?error=admin_access_required`);
          return;
        }
        setCanAccessEditor(true);
      })
      .catch(() => {
        router.replace(`/${locale}/dashboard?error=admin_access_required`);
      });
  }, [locale, router, session?.user, status]);

  const coursesHref = `/${locale}/editor/courses`;
  const isCoursesActive = pathname === coursesHref || pathname.startsWith(`${coursesHref}/`);

  if (canAccessEditor !== true) {
    return (
      <Box bg="ink.9" mih="100vh">
        <Center mih="100vh">
          <Loader color="amanoba" />
        </Center>
      </Box>
    );
  }

  const primaryNavigation = (
    <Stack gap={4}>
      <UnstyledButton component={Link} href={coursesHref} mb="xs">
        <Group gap="sm" wrap="nowrap">
          <Logo size="sm" showText={false} linkTo="" preventShrink />
          <Stack gap={0}>
            <Text fw={700} c="white" size="sm">
              Amanoba Editor
            </Text>
            <Text size="xs" c="dimmed">
              Course portal
            </Text>
          </Stack>
        </Group>
      </UnstyledButton>
      <NavLink
        component={Link}
        href={coursesHref}
        label="Courses"
        leftSection={<IconBook size={18} />}
        active={isCoursesActive}
        color="amanoba"
        variant="light"
      />
    </Stack>
  );

  const headerActions = (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <UnstyledButton>
          <Group gap="sm" wrap="nowrap">
            <Stack gap={0} visibleFrom="sm" align="flex-end">
              <Text size="sm" fw={600}>
                {session?.user?.email || session?.user?.name || 'Editor'}
              </Text>
              <Text size="xs" c="dimmed">
                Editor
              </Text>
            </Stack>
            <Avatar color="gray" radius="xl" size={40}>
              <IconUser size={22} />
            </Avatar>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconLogout size={16} />}
          onClick={async () => {
            await signOut({ redirect: false });
            router.push(`/${locale}/auth/signin`);
          }}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <AppShell
      logoText="Amanoba Editor"
      headerContext="Course portal"
      primaryNavigation={primaryNavigation}
      headerActions={headerActions}
    >
      {children}
    </AppShell>
  );
}
