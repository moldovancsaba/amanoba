/**
 * Editor portal layout — Mantine AppShell for course editors.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  AppShell,
  Box,
  Burger,
  Center,
  Group,
  Loader,
  Menu,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBook, IconLogout, IconUser } from '@tabler/icons-react';
import Logo from '@/components/Logo';

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [canAccessEditor, setCanAccessEditor] = useState<boolean | null>(null);
  const [opened, { toggle }] = useDisclosure();

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

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
      bg="ink.9"
    >
      <AppShell.Navbar p="md" bg="ink.8">
        <AppShell.Section mb="md">
          <UnstyledButton component={Link} href={coursesHref}>
            <Group gap="sm">
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
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          <NavLink
            component={Link}
            href={coursesHref}
            label="Courses"
            leftSection={<IconBook size={18} />}
            active={isCoursesActive}
            color="amanoba"
            variant="light"
            onClick={() => {
              if (opened) toggle();
            }}
          />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Header bg="ink.8">
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="gray.3" />
          <Text fw={600} visibleFrom="sm">
            Editor portal
          </Text>
          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <UnstyledButton>
                <Group gap="xs">
                  <IconUser size={18} />
                  <Text size="sm" c="dimmed" visibleFrom="sm">
                    {session?.user?.email || session?.user?.name || 'Editor'}
                  </Text>
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
        </Group>
      </AppShell.Header>

      <AppShell.Main bg="ink.9">{children}</AppShell.Main>
    </AppShell>
  );
}
