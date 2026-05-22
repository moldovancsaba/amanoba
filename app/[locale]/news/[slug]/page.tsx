import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Badge,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { APP_URL } from '@/app/lib/constants/app-url';
import { locales, type Locale } from '@/app/lib/i18n/locales';
import { getNewsLanguages, getNewsPost, getNewsSlugs } from '@/app/lib/news';

const labels = {
  eyebrow: "What's new",
  backToNews: "All news",
  backDashboard: "Dashboard",
};

export async function generateStaticParams() {
  return locales.flatMap((locale) => getNewsSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const post = getNewsPost(slug, locale);
  if (!post) {
    notFound();
  }

  const base = APP_URL.replace(/\/$/, '');
  const canonical = `${base}/${locale}/news/${slug}`;
  const languages = Object.fromEntries(
    Object.entries(getNewsLanguages(slug)).map(([key, path]) => [key, `${base}${path}`])
  );

  return {
    title: `${post.headline} | Amanoba`,
    description: post.summary,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: post.headline,
      description: post.summary,
      url: canonical,
      type: 'article',
      siteName: 'Amanoba',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const post = getNewsPost(slug, locale);
  if (!post) {
    notFound();
  }

  return (
    <>
      <Paper component="header" bg="ink.8" radius={0} withBorder>
        <Container size="md" py="md">
          <Group justify="space-between" align="center" gap="md">
            <Group gap="md" wrap="nowrap">
              <Logo size="sm" showText={false} linkTo="/news" preventShrink />
              <Stack gap={2}>
                <Text size="xs" tt="uppercase" fw={800} c="amanoba.5">
                  {labels.eyebrow}
                </Text>
                <Title order={1} size="h3" c="white">
                  Amanoba News
                </Title>
              </Stack>
            </Group>
            <Group component="nav" gap="xs" justify="flex-end">
            <LanguageSwitcher />
            <Button
              component={LocaleLink}
              href="/news"
              variant="outline"
              color="gray"
            >
              {labels.backToNews}
            </Button>
            <Button
              component={LocaleLink}
              href="/dashboard"
              color="amanoba"
            >
              {labels.backDashboard}
            </Button>
            </Group>
          </Group>
        </Container>
      </Paper>

      <Container component="main" size="md" py={{ base: 'xl', sm: 56 }}>
        <Paper component="article" withBorder shadow="sm" p={{ base: 'lg', sm: 'xl' }} radius="md">
          <Stack gap="xl">
            <Group gap="sm">
              <Badge color="gray" variant="light" leftSection={<IconCalendar size={14} />} size="lg">
                {post.publishedAt}
              </Badge>
            </Group>
            <Stack gap="md">
              <Title order={2} size="h1" lh={1.1}>
                {post.headline}
              </Title>
              <Text size="lg" c="dimmed" lh={1.7}>
                {post.summary}
              </Text>
            </Stack>
            {post.body.map((section) => (
              <Stack component="section" key={section.heading} gap="sm">
                <Title order={3} size="h3">
                  {section.heading}
                </Title>
                <Stack gap="xs">
                  {section.paragraphs.map((paragraph) => (
                    <Text key={paragraph} lh={1.75}>
                      {paragraph}
                    </Text>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
