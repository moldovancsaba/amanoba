import type { Metadata } from 'next';
import { auth } from '@/auth';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import {
  Box,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconBook, IconMail, IconTargetArrow, IconTrophy, IconTrendingUp, IconStar } from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { APP_URL } from '@/app/lib/constants/app-url';
import { locales } from '@/app/lib/i18n/locales';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const base = APP_URL.replace(/\/$/, '');
  const canonical = `${base}/${locale}`;
  const languages = Object.fromEntries(locales.map((loc) => [loc, `${base}/${loc}`]));

  return {
    alternates: {
      canonical,
      languages,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations({ locale, namespace: 'common' });
  const tAuth = await getTranslations({ locale, namespace: 'auth' });
  const tLanding = await getTranslations({ locale, namespace: 'landing' });
  const signInHref = `/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}`)}`;
  const primaryHref = session?.user ? '/courses' : signInHref;
  const primaryLabel = session?.user ? tLanding('browseCourses') : tLanding('getStarted');
  const secondaryHref = session?.user ? '/dashboard' : '/courses';
  const secondaryLabel = session?.user ? t('dashboard') : tLanding('viewCourses');

  const features = [
    { icon: IconBook, title: tLanding('feature1Title'), description: tLanding('feature1Description') },
    { icon: IconMail, title: tLanding('feature2Title'), description: tLanding('feature2Description') },
    { icon: IconTargetArrow, title: tLanding('feature3Title'), description: tLanding('feature3Description') },
    { icon: IconTrophy, title: tLanding('feature4Title'), description: tLanding('feature4Description') },
    { icon: IconTrendingUp, title: tLanding('feature5Title'), description: tLanding('feature5Description') },
    { icon: IconStar, title: tLanding('feature6Title'), description: tLanding('feature6Description') },
  ];

  return (
    <Box bg="ink.9" mih="100vh">
      <Box component="header" bg="ink.8" bd="0 0 1px solid var(--mantine-color-ink-6)">
        <Container size="xl" py="md">
          <Group justify="space-between" align="center" gap="md">
            <Group gap="sm" wrap="nowrap" miw={0}>
              <Image
                src="/amanoba_logo.png"
                alt="Amanoba Logo"
                width={48}
                height={48}
                style={{ height: 48, width: 'auto' }}
                priority
              />
              <Stack gap={0} visibleFrom="xs">
                <Title order={1} size="h4">{t('appName')}</Title>
                <Text size="sm" c="gray.3">{tLanding('tagline')}</Text>
              </Stack>
            </Group>

            <Group gap="sm" justify="flex-end">
              <Button component={LocaleLink} href="/blog" variant="subtle" color="gray" visibleFrom="sm">
                Blog
              </Button>
              <Button component={LocaleLink} href="/courses" variant="subtle" color="gray" visibleFrom="sm">
                {tLanding('viewCourses')}
              </Button>
              <LanguageSwitcher />
              <Button component={LocaleLink} href={session?.user ? '/dashboard' : signInHref} color="amanoba">
                {session?.user ? t('dashboard') : tAuth('signIn')}
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      <Container component="main" size="xl" py="xl">
        <Stack gap="xl">
          <Stack align="center" ta="center" gap="lg">
            <Title order={2} size="h1" maw={900}>
              {tLanding('heroTitle')}
            </Title>
            <Text size="xl" c="gray.2" maw={760}>
              {tLanding('heroDescription')}
            </Text>
            <Group justify="center" gap="md">
              <Button component={LocaleLink} href={primaryHref} color="amanoba" size="xl">
                {primaryLabel}
              </Button>
              <Button component={LocaleLink} href={secondaryHref} variant="default" size="xl">
                {secondaryLabel}
              </Button>
            </Group>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {features.map((feature) => {
              const FeatureIcon = feature.icon;
              return (
                <Card key={feature.title} padding="xl" withBorder>
                  <Stack align="center" ta="center" gap="md" mih={190}>
                    <ThemeIcon color="amanoba" variant="light" size={64} radius="xl">
                      <FeatureIcon size={34} />
                    </ThemeIcon>
                    <Stack gap={6}>
                      <Title order={3} size="h4">{feature.title}</Title>
                      <Text c="gray.3">{feature.description}</Text>
                    </Stack>
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Container>

      <Box component="footer" bd="1px 0 0 0 solid var(--mantine-color-ink-6)">
        <Container size="xl" py="lg">
          <Group justify="space-between" gap="md">
            <Text c="gray.3" size="sm">
              © 2026 {t('appName')}. {tLanding('footerRights')}
            </Text>
            <Group gap="md">
              <Button component={LocaleLink} href="/terms" variant="subtle" color="gray" size="compact-sm">
                {tLanding('terms')}
              </Button>
              <Button component={LocaleLink} href="/privacy" variant="subtle" color="gray" size="compact-sm">
                {tLanding('privacy')}
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>
    </Box>
  );
}
