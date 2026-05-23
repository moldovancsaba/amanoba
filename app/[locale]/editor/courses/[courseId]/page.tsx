'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Anchor,
  Badge,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { StateBlock } from '@/app/components/patterns/StateBlock';

type Course = {
  _id: string;
  courseId: string;
  name?: string;
  language?: string;
  durationDays?: number;
  isActive?: boolean;
};

type Lesson = {
  _id: string;
  lessonId: string;
  dayNumber: number;
  title?: string;
  isActive?: boolean;
};

export default function EditorCourseDetailPage() {
  const locale = useLocale();
  const params = useParams() as { courseId?: string };
  const courseId = params.courseId ? decodeURIComponent(params.courseId) : '';

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/admin/courses/${encodeURIComponent(courseId)}`).then((r) => r.json()),
      fetch(`/api/admin/courses/${encodeURIComponent(courseId)}/lessons`).then((r) => r.json()),
    ])
      .then(([courseResp, lessonsResp]) => {
        if (cancelled) return;
        if (!courseResp?.success) {
          setError(courseResp?.error || courseResp?.message || 'Failed to load course');
          return;
        }
        if (!lessonsResp?.success) {
          setError(lessonsResp?.error || lessonsResp?.message || 'Failed to load lessons');
          return;
        }
        setCourse(courseResp.course);
        setLessons(Array.isArray(lessonsResp.lessons) ? lessonsResp.lessons : []);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load course');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => (a.dayNumber ?? 0) - (b.dayNumber ?? 0));
  }, [lessons]);

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Anchor component={Link} href={`/${locale}/editor/courses`} size="sm" c="dimmed">
          Courses
        </Anchor>
        <Title order={1}>{course?.name || courseId}</Title>
        <Text c="dimmed" size="sm">
          {(course?.language || '').toUpperCase()} • {course?.durationDays ?? '?'} lessons •{' '}
          {course?.isActive ? 'active' : 'draft'}
        </Text>
      </Stack>

      {loading ? (
        <Group gap="sm">
          <Loader size="sm" color="amanoba" />
          <Text c="dimmed">Loading…</Text>
        </Group>
      ) : null}

      {error ? <StateBlock kind="error" title="Could not load course" description={error} /> : null}

      {!loading && !error ? (
        <Stack gap="xs">
          {sortedLessons.map((lesson) => (
            <Card
              key={lesson._id || lesson.lessonId}
              component={Link}
              href={`/${locale}/editor/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lesson.lessonId)}`}
              padding="md"
              withBorder
              bg="ink.8"
            >
              <Group justify="space-between" wrap="nowrap">
                <Text fw={600}>
                  Day {lesson.dayNumber}: {lesson.title || lesson.lessonId}
                </Text>
                <Badge color={lesson.isActive ? 'green' : 'gray'} variant="light">
                  {lesson.isActive ? 'active' : 'draft'}
                </Badge>
              </Group>
            </Card>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}
