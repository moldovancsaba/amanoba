import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge, Box, Card, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconCalendar, IconSparkles } from '@tabler/icons-react';
import { LocaleLink } from '@/components/LocaleLink';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { LearnerPageHeader } from '@/app/components/LearnerPageHeader';
import { APP_URL } from '@/app/lib/constants/app-url';
import { locales, type Locale } from '@/app/lib/i18n/locales';
import { getAllNewsPosts, getBlogLanguages, getLatestNewsPost } from '@/app/lib/news';

const labels = {
  eyebrow: 'Amanoba blog',
  title: 'Amanoba Blog',
  description: 'Product updates, learner-facing improvements, and release-note highlights from Amanoba.',
  latest: 'Latest post',
  allPosts: 'All blog posts',
  readPost: 'Read post',
  backHome: 'Home',
  backDashboard: 'Dashboard',
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const latest = getLatestNewsPost(locale);
  const base = APP_URL.replace(/\/$/, '');
  const canonical = `${base}/${locale}/blog`;
  const languages = Object.fromEntries(
    Object.entries(getBlogLanguages()).map(([key, path]) => [key, `${base}${path}`])
  );

  return {
    title: latest ? `${labels.title} | ${latest.headline}` : labels.title,
    description: latest?.summary ?? labels.description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: labels.title,
      description: latest?.summary ?? labels.description,
      url: canonical,
      type: 'website',
      siteName: 'Amanoba',
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const posts = getAllNewsPosts(locale);
  const latest = posts[0];

  if (!latest) {
    notFound();
  }

  return (
    <Box bg="ink.9" mih="100vh">
      <LearnerPageHeader
        title={labels.title}
        subtitle={labels.description}
        icon={<IconSparkles size={20} />}
        actions={<LanguageSwitcher />}
      />

      <Container component="main" size="xl" py="xl">
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
          <Card component="article" padding="xl" withBorder>
            <Stack gap="xl">
              <Group gap="sm">
                <Badge color="amanoba" leftSection={<IconSparkles size={14} />}>{labels.latest}</Badge>
                <Badge color="gray" variant="light" leftSection={<IconCalendar size={14} />} component="time" dateTime={latest.publishedAt}>
                  {latest.publishedAt}
                </Badge>
              </Group>
              <Stack gap="md">
                <Title order={2}>{latest.headline}</Title>
                <Text size="lg" c="dimmed">{latest.summary}</Text>
              </Stack>
              {latest.body.map((section) => (
                <Stack key={section.heading} gap="sm">
                  <Title order={3} size="h4">{section.heading}</Title>
                  <Stack gap="xs">
                    {section.paragraphs.map((paragraph) => (
                      <Text key={paragraph} c="dimmed">
                        {paragraph}
                      </Text>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Card>

          <Card component="aside" padding="xl" withBorder>
            <Stack gap="md">
              <Title order={2} size="h3">{labels.allPosts}</Title>
              {posts.map((post) => (
                <Card
                  component={LocaleLink}
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  padding="md"
                  withBorder
                >
                  <Stack gap="xs">
                  <Text component="time" size="xs" fw={700} c="amanoba.5" dateTime={post.publishedAt}>
                    {post.publishedAt}
                  </Text>
                  <Text fw={700}>{post.headline}</Text>
                  <Text size="sm" c="dimmed" lineClamp={3}>{post.summary}</Text>
                  <Text size="sm" fw={700} c="amanoba.5">{labels.readPost}</Text>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Card>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
