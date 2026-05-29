'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  ContentOpsActionBar,
  EditorScaffold,
} from '@doneisbetter/gds-admin/client';
import { Alert, Anchor, Badge, Box, Button, Group, Loader, Paper, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft, IconDeviceFloppy, IconListCheck } from '@tabler/icons-react';
import MarkdownEditor from '@/components/ui/markdown-editor';
import QuizManagerModal from '@/components/QuizManagerModal';

type Lesson = {
  lessonId: string;
  dayNumber: number;
  title?: string;
  content?: string;
  emailSubject?: string;
  emailBody?: string;
  isActive?: boolean;
};

export default function EditorLessonPage() {
  const locale = useLocale();
  const router = useRouter();
  const params = useParams() as { courseId?: string; lessonId?: string };
  const courseId = params.courseId ? decodeURIComponent(params.courseId) : '';
  const lessonId = params.lessonId ? decodeURIComponent(params.lessonId) : '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [showQuizManager, setShowQuizManager] = useState(false);

  useEffect(() => {
    if (!courseId || !lessonId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (!d?.success || !d.lesson) {
          setError(d?.error || d?.message || 'Failed to load lesson');
          return;
        }
        setLesson(d.lesson);
        setTitle(String(d.lesson.title ?? ''));
        setContent(String(d.lesson.content ?? ''));
        setEmailSubject(String(d.lesson.emailSubject ?? ''));
        setEmailBody(String(d.lesson.emailBody ?? ''));
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load lesson');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [courseId, lessonId]);

  const dirty = useMemo(() => {
    if (!lesson) return false;
    return (
      title !== String(lesson.title ?? '') ||
      content !== String(lesson.content ?? '') ||
      emailSubject !== String(lesson.emailSubject ?? '') ||
      emailBody !== String(lesson.emailBody ?? '')
    );
  }, [lesson, title, content, emailSubject, emailBody]);

  async function save() {
    if (!courseId || !lessonId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, emailSubject, emailBody }),
      });
      const d = await res.json();
      if (!d?.success) {
        throw new Error(d?.error || d?.message || 'Failed to save lesson');
      }
      setLesson(d.lesson);
      notifications.show({ color: 'green', title: 'Lesson saved', message: 'The lesson content is up to date.' });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save lesson');
      notifications.show({ color: 'red', title: 'Could not save lesson', message: e instanceof Error ? e.message : 'Failed to save lesson' });
    } finally {
      setSaving(false);
    }
  }

  const breadcrumbs = (
    <>
      <Anchor component={Link} size="sm" href={`/${locale}/editor/courses`}>
        Courses
      </Anchor>
      <Anchor component={Link} size="sm" href={`/${locale}/editor/courses/${encodeURIComponent(courseId)}`}>
        {courseId}
      </Anchor>
      <Text size="sm" c="dimmed">
        {lessonId}
      </Text>
    </>
  );

  if (loading) {
    return (
      <Group>
        <Loader color="amanobaYellow" size="sm" />
        <Text size="sm" c="gray.3">
          Loading...
        </Text>
      </Group>
    );
  }

  if (error) {
    return <Alert color="red">{error}</Alert>;
  }

  if (!lesson) {
    return (
      <Box>
        <Text c="gray.4">Lesson not found.</Text>
      </Box>
    );
  }

  return (
    <>
    <EditorScaffold
      header={
        <Stack gap="xs">
          <Group gap="xs">{breadcrumbs}</Group>
          <Group justify="space-between" align="flex-start" wrap="wrap">
            <Stack gap={4}>
              <Text fw={700} size="xl" c="white">
                Day {String(lesson.dayNumber).padStart(2, '0')}: {title || lessonId}
              </Text>
              <Badge color={lesson.isActive ? 'green' : 'gray'}>{lesson.isActive ? 'Published' : 'Draft'}</Badge>
            </Stack>
            <Button
              variant="default"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => router.back()}
            >
              Back
            </Button>
          </Group>
        </Stack>
      }
      form={
        <Stack gap="md">
          <Paper withBorder radius="md" p="md" bg="dark.8">
            <TextInput
              label="Lesson title"
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
            />
          </Paper>

          <Paper withBorder radius="md" p="md" bg="dark.8">
            <Stack gap="xs">
              <Text size="sm" fw={600} c="gray.2">
                Lesson content (Markdown)
              </Text>
              <MarkdownEditor content={content} onChange={setContent} placeholder="Write lesson content in Markdown..." />
            </Stack>
          </Paper>

          <Paper withBorder radius="md" p="md" bg="dark.8">
            <Button
              type="button"
              onClick={() => setShowQuizManager(true)}
              fullWidth
              leftSection={<IconListCheck size={16} />}
            >
              Manage Quiz Questions
            </Button>
          </Paper>

          <Paper withBorder radius="md" p="md" bg="dark.8">
            <TextInput
              label="Email subject"
              value={emailSubject}
              onChange={(event) => setEmailSubject(event.currentTarget.value)}
            />
          </Paper>

          <Paper withBorder radius="md" p="md" bg="dark.8">
            <Textarea
              label="Email body (Markdown)"
              value={emailBody}
              onChange={(event) => setEmailBody(event.currentTarget.value)}
              autosize
              minRows={8}
              styles={{ input: { fontFamily: 'var(--mantine-font-family-monospace)' } }}
            />
          </Paper>
        </Stack>
      }
      footer={
        <ContentOpsActionBar
          dirty={dirty}
          saving={saving}
          primaryAction={
            <Button
              disabled={!dirty || saving}
              loading={saving}
              onClick={() => void save()}
              leftSection={<IconDeviceFloppy size={16} />}
            >
              {dirty ? 'Save lesson' : 'Saved'}
            </Button>
          }
        />
      }
      stickyFooter
    />
    {showQuizManager ? (
      <QuizManagerModal
        courseId={courseId}
        lessonId={lessonId}
        onClose={() => setShowQuizManager(false)}
        variant="dark"
      />
    ) : null}
    </>
  );
}
