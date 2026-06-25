/**
 * Public lesson view (GEO) — Mantine read-only discovery surface.
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  GridCol,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { getPublicLessonData } from '@/app/lib/public-lesson';
import { contentToHtml } from '@/app/lib/lesson-content';
import { APP_URL } from '@/app/lib/constants/app-url';

interface ViewPageProps {
  params: Promise<{ locale: string; courseId: string; dayNumber: string }>;
}

export async function generateMetadata({ params }: ViewPageProps): Promise<Metadata> {
  const { locale, courseId, dayNumber } = await params;
  const day = parseInt(dayNumber, 10);
  if (isNaN(day) || day < 1) return { title: 'Lesson | Amanoba' };

  const data = await getPublicLessonData(courseId, day);
  if (!data) return { title: 'Lesson | Amanoba' };

  const title = `Day ${data.lesson.dayNumber}: ${data.lesson.title} | ${data.course.name} | Amanoba`;
  const plain = (data.lesson.content || '').replace(/<[^>]*>/g, '').trim();
  const description = plain.length > 160 ? `${plain.slice(0, 157)}...` : plain;
  const viewUrl = `${APP_URL}/${locale}/courses/${courseId}/day/${dayNumber}/view`;

  return {
    title,
    description: description || `Lesson ${day} of ${data.course.name} on Amanoba.`,
    alternates: { canonical: viewUrl },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      url: viewUrl,
      siteName: 'Amanoba',
      title,
      description: description || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
    },
  };
}

export default async function PublicLessonViewPage({ params }: ViewPageProps) {
  const { locale, courseId, dayNumber } = await params;
  const day = parseInt(dayNumber, 10);
  if (isNaN(day) || day < 1) notFound();

  const data = await getPublicLessonData(courseId, day);
  if (!data) notFound();

  const courseLang = data.course.language || 'en';
  const dir = courseLang === 'ar' ? 'rtl' : 'ltr';

  return (
    <Box bg="ink.9" mih="100vh" dir={dir}>
      <Paper component="header" bg="ink.8" radius={0} withBorder>
        <Container size="lg" py="md">
          <Group gap="md" wrap="nowrap">
            <Button
              component="a"
              href={`/${locale}/courses/${courseId}`}
              variant="subtle"
              color="gray"
              leftSection={<IconArrowLeft size={18} />}
            >
              Back to Course
            </Button>
            <Box component="a" href={`/${locale}`} display="inline-flex" ml="auto">
              <Image
                src="/amanoba_logo.png"
                alt="Amanoba"
                width={32}
                height={32}
                priority
              />
            </Box>
          </Group>
        </Container>
      </Paper>

      <Container size="lg" py="xl">
        <Grid gutter="xl">
          <GridCol span={{ base: 12, lg: 8 }}>
            <Stack gap="lg">
              <Card padding="lg" withBorder>
                <Title order={1} size="h2" style={{ overflowWrap: 'anywhere' }}>
                  {data.lesson.title}
                </Title>
                <Text size="sm" c="dimmed" mt="xs">
                  Day {data.lesson.dayNumber} of {data.course.durationDays} · {data.course.name}
                </Text>
              </Card>
              <Card padding="xl" withBorder>
                <TypographyStylesProvider>
                  <Box
                    className="lesson-prose"
                    dangerouslySetInnerHTML={{
                      __html: contentToHtml(data.lesson.content, { stripFirstH1: true }),
                    }}
                  />
                </TypographyStylesProvider>
              </Card>
            </Stack>
          </GridCol>

          <GridCol span={{ base: 12, lg: 4 }}>
            <Card padding="lg" withBorder pos={{ base: 'relative', lg: 'sticky' }} top={{ lg: 16 }}>
              <Stack gap="md">
                <Title order={2} size="h4">
                  {data.course.name}
                </Title>
                <Text size="sm" c="dimmed">
                  {data.course.durationDays}-day structured course. Enroll to unlock quizzes, track
                  progress, and earn a certificate.
                </Text>
                <Button
                  component="a"
                  href={`/${locale}/courses/${courseId}`}
                  color="amanoba"
                  fullWidth
                >
                  Enroll in this course
                </Button>
                <Text size="xs" c="dimmed">
                  Already have an account? You can sign in and enroll from the course page.
                </Text>
              </Stack>
            </Card>
          </GridCol>
        </Grid>
      </Container>
    </Box>
  );
}
