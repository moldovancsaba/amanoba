import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Badge,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ArticleShell } from '@/app/components/patterns/ArticleShell';
import { APP_URL } from '@/app/lib/constants/app-url';
import { locales, type Locale } from '@/app/lib/i18n/locales';
import { getBlogLanguages, getNewsPost, getNewsSlugs } from '@/app/lib/news';

const labels = {
  eyebrow: 'Amanoba blog',
  backToBlog: 'All blog posts',
  backDashboard: 'Dashboard',
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
  const canonical = `${base}/${locale}/blog/${slug}`;
  const languages = Object.fromEntries(
    Object.entries(getBlogLanguages(slug)).map(([key, path]) => [key, `${base}${path}`])
  );

  return {
    title: `${post.headline} | Amanoba Blog`,
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

export default async function BlogPostPage({
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
    <ArticleShell
      eyebrow={labels.eyebrow}
      title="Amanoba Blog"
      logoHref="/blog"
      backHref="/blog"
      backLabel={labels.backToBlog}
      dashboardLabel={labels.backDashboard}
      languageSwitcher={<LanguageSwitcher />}
    >
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
    </ArticleShell>
  );
}
