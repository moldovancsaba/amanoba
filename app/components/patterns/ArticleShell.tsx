import type { ReactNode } from 'react';
import { Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';

type ArticleShellProps = {
  eyebrow: string;
  title: string;
  logoHref: string;
  backHref: string;
  backLabel: string;
  dashboardLabel: string;
  languageSwitcher?: ReactNode;
  children: ReactNode;
};

export function ArticleShell({
  eyebrow,
  title,
  logoHref,
  backHref,
  backLabel,
  dashboardLabel,
  languageSwitcher,
  children,
}: ArticleShellProps) {
  return (
    <>
      <Paper component="header" bg="ink.8" radius={0} withBorder>
        <Container size="md" py="md">
          <Group justify="space-between" align="center" gap="md">
            <Group gap="md" wrap="nowrap">
              <Logo size="sm" showText={false} linkTo={logoHref} preventShrink />
              <Stack gap={2}>
                <Text size="xs" tt="uppercase" fw={800} c="amanoba.5">
                  {eyebrow}
                </Text>
                <Title order={1} size="h3" c="white">
                  {title}
                </Title>
              </Stack>
            </Group>
            <Group component="nav" gap="xs" justify="flex-end">
              {languageSwitcher}
              <Button component={LocaleLink} href={backHref} variant="outline" color="gray">
                {backLabel}
              </Button>
              <Button component={LocaleLink} href="/dashboard" color="amanoba">
                {dashboardLabel}
              </Button>
            </Group>
          </Group>
        </Container>
      </Paper>

      <Container component="main" size="md" py={{ base: 'xl', sm: 56 }}>
        {children}
      </Container>
    </>
  );
}
