'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import {
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
  description?: string;
  language?: string;
  isActive?: boolean;
  durationDays?: number;
};

export default function EditorCoursesPage() {
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/admin/courses')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (!d?.success || !Array.isArray(d.courses)) {
          setError(d?.error || 'Failed to load courses');
          setCourses([]);
          return;
        }
        setCourses(d.courses);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load courses');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...courses].sort((a, b) => (a.courseId || '').localeCompare(b.courseId || ''));
  }, [courses]);

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={1}>My editor courses</Title>
        <Text c="dimmed" size="sm">
          Courses you created or were assigned to.
        </Text>
      </Stack>

      {loading ? (
        <Group gap="sm">
          <Loader size="sm" color="amanoba" />
          <Text c="dimmed">Loading…</Text>
        </Group>
      ) : null}

      {error ? <StateBlock kind="error" title="Could not load courses" description={error} /> : null}

      {!loading && !error && sorted.length === 0 ? (
        <StateBlock kind="empty" title="No courses assigned" description="When you are assigned editor access, courses appear here." />
      ) : null}

      {!loading && !error && sorted.length > 0 ? (
        <Stack gap="sm">
          {sorted.map((course) => (
            <Card
              key={course._id || course.courseId}
              component={Link}
              href={`/${locale}/editor/courses/${encodeURIComponent(course.courseId)}`}
              padding="md"
              withBorder
              bg="ink.8"
            >
              <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
                <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                  <Text fw={700}>{course.name || course.courseId}</Text>
                  <Text size="xs" c="dimmed" ff="monospace">
                    {course.courseId}
                  </Text>
                  {course.description ? (
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {course.description}
                    </Text>
                  ) : null}
                </Stack>
                <Badge color={course.isActive ? 'green' : 'gray'} variant="light">
                  {(course.language || '').toUpperCase()} • {course.durationDays ?? '?'} lessons •{' '}
                  {course.isActive ? 'active' : 'draft'}
                </Badge>
              </Group>
            </Card>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}
