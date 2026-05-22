/**
 * Course Editor Page
 * 
 * What: Edit course and manage flexible lesson sequences
 * Why: Allows admins to build complete courses with lessons
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FileButton,
  Group,
  Loader,
  Modal,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import Image from 'next/image';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconBook,
  IconCalendar,
  IconCertificate,
  IconChecklist,
  IconDeviceFloppy,
  IconDownload,
  IconEdit,
  IconEye,
  IconFileUpload,
  IconListCheck,
  IconPlus,
  IconRefresh,
  IconSettings,
  IconTrash,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import MarkdownEditor from '@/app/components/ui/markdown-editor';
import { getStripeMinimum, getFormattedMinimum, meetsStripeMinimum } from '@/app/lib/utils/stripe-minimums';
import { COURSE_LANGUAGE_OPTIONS } from '@/app/lib/constants/course-languages';
import QuizManagerModal from '@/components/QuizManagerModal';

interface Course {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  language: string;
  ccsId?: string;
  thumbnail?: string;
  isActive: boolean;
  requiresPremium: boolean;
  discussionEnabled?: boolean;
  leaderboardEnabled?: boolean;
  studyGroupsEnabled?: boolean;
  price?: {
    amount: number;
    currency: string;
  };
  durationDays: number;
  parentCourseId?: string;
  selectedLessonIds?: string[];
  syncStatus?: 'synced' | 'out_of_sync';
  lastSyncedAt?: string;
  createdBy?: string;
  assignedEditors?: string[];
  /** Lesson quiz pass rule: max wrong answers allowed (0–10). If set, fail when wrongCount > this; else use successThreshold %. */
  quizMaxWrongAllowed?: number;
  /** Default number of questions per lesson quiz when lesson does not set questionCount. */
  defaultLessonQuizQuestionCount?: number;
  /** Canonical course-level lesson-quiz policy. */
  lessonQuizPolicy?: {
    enabled?: boolean;
    required?: boolean;
    questionCount?: number;
    shownAnswerCount?: number;
    maxWrongAllowed?: number;
    successThreshold?: number;
  };
  pointsConfig: {
    completionPoints: number;
    lessonPoints: number;
    perfectCourseBonus?: number;
  };
  xpConfig: {
    completionXP: number;
    lessonXP: number;
  };
  certification?: {
    enabled: boolean;
    poolCourseId?: string;
    certQuestionCount?: number;
    /** Pass rule: minimum final exam score (0–100). Default 50. */
    passThresholdPercent?: number;
    /** Fail immediately when (wrong/answered)*100 exceeds this %. E.g. 10 = fail as soon as error rate > 10%. */
    maxErrorPercent?: number;
    requireAllLessonsCompleted?: boolean;
    requireAllQuizzesPassed?: boolean;
    priceMoney?: {
      amount: number;
      currency: string;
    };
    pricePoints?: number;
    premiumIncludesCertification?: boolean;
    templateId?: string;
    credentialTitleId?: string;
  };
}

interface Lesson {
  _id: string;
  lessonId: string;
  dayNumber: number;
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
  assessmentGameId?: string;
  quizConfig?: {
    enabled: boolean;
    successThreshold: number;
    questionCount: number;
    poolSize: number;
    required: boolean;
  };
  pointsReward: number;
  xpReward: number;
  isActive: boolean;
}

type LessonWithQuizConfig = Lesson & {
  quizConfig?: {
    enabled: boolean;
    successThreshold: number;
    questionCount: number;
    poolSize: number;
    required: boolean;
  };
};

interface Game {
  _id: string;
  gameId: string;
  name: string;
  isAssessment: boolean;
}

type CourseFeatureFlag = 'discussionEnabled' | 'leaderboardEnabled' | 'studyGroupsEnabled';

export default function CourseEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const router = useRouter();
  const locale = useLocale();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState<number | null>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [courseId, setCourseId] = useState<string>('');
  const [shorts, setShorts] = useState<Array<{ courseId: string; name: string; courseVariant?: string; isDraft?: boolean }>>([]);
  const [shortSelectedIds, setShortSelectedIds] = useState<string[]>([]);
  const [shortCertCount, setShortCertCount] = useState(25);
  const [shortCreating, setShortCreating] = useState(false);
  const [showShortsCreate, setShowShortsCreate] = useState(false);
  const [syncStatusData, setSyncStatusData] = useState<{
    computedStatus: 'synced' | 'out_of_sync';
    missingLessonIds: string[];
    lastSyncedAt: string | null;
  } | null>(null);
  const [syncActionLoading, setSyncActionLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editorNames, setEditorNames] = useState<Record<string, string>>({});
  const [editorSearch, setEditorSearch] = useState('');
  const [editorSearchResults, setEditorSearchResults] = useState<Array<{ _id: string; displayName?: string; email?: string }>>([]);
  const [editorSearching, setEditorSearching] = useState(false);
  const [_addingEditor, _setAddingEditor] = useState(false);
  const resolvedLanguageOptions = course
    ? [
        ...(!COURSE_LANGUAGE_OPTIONS.some((option) => option.code === course.language)
          ? [{ code: course.language, label: course.language.toUpperCase() }]
          : []),
        ...COURSE_LANGUAGE_OPTIONS,
      ]
    : COURSE_LANGUAGE_OPTIONS;
  const maxLessonDay = lessons.reduce((max, lesson) => Math.max(max, lesson.dayNumber || 0), 0);
  const lessonGridLength = course?.parentCourseId
    ? lessons.length
    : Math.max(course?.durationDays || 1, maxLessonDay + 1, 1);
  const nextEditableLessonDay = (() => {
    const usedDays = new Set(lessons.map((lesson) => lesson.dayNumber));
    for (let day = 1; day <= lessonGridLength; day += 1) {
      if (!usedDays.has(day)) return day;
    }
    return lessonGridLength + 1;
  })();

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.courseId;
      setCourseId(id);
      await Promise.all([
        fetchCourse(id),
        fetchLessons(id),
        fetchGames(),
      ]);
    };
    loadData();
  }, [params]);

  useEffect(() => {
    if (course?.courseId && !course.parentCourseId) {
      fetch(`/api/admin/courses?parentCourseId=${encodeURIComponent(course.courseId)}`)
        .then((r) => r.json())
        .then((d) => setShorts(d.success ? d.courses || [] : []))
        .catch(() => setShorts([]));
    } else {
      setShorts([]);
    }
  }, [course?.courseId, course?.parentCourseId]);

  useEffect(() => {
    if (!course?.courseId || !course.parentCourseId) {
      setSyncStatusData(null);
      return;
    }
    fetch(`/api/admin/courses/${course.courseId}/sync-status`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSyncStatusData({
            computedStatus: d.computedStatus ?? 'out_of_sync',
            missingLessonIds: d.missingLessonIds ?? [],
            lastSyncedAt: d.lastSyncedAt ?? null,
          });
        } else {
          setSyncStatusData(null);
        }
      })
      .catch(() => setSyncStatusData(null));
  }, [course?.courseId, course?.parentCourseId]);

  useEffect(() => {
    fetch('/api/admin/access')
      .then((r) => r.json())
      .then((d) => setIsAdmin(d.isAdmin === true))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    const ids = course?.assignedEditors?.filter((id) => typeof id === 'string' && id) ?? [];
    if (ids.length === 0) {
      setEditorNames({});
      return;
    }
    fetch(`/api/admin/players?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.success || !Array.isArray(d.players)) return;
        const map: Record<string, string> = {};
        for (const p of d.players) {
          const id = p._id ?? p.id;
          if (id) map[String(id)] = p.displayName || p.email || String(id);
        }
        setEditorNames(map);
      })
      .catch(() => setEditorNames({}));
  }, [course?.assignedEditors]);

  const fetchCourse = async (courseId: string) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`);
      const data = await response.json();
      if (data.success) {
        setCourse(data.course);
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    }
  };

  const fetchLessons = async (courseId: string) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons`);
      const data = await response.json();
      if (data.success) {
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      // Fetch games that can be used as assessments
      const response = await fetch('/api/games');
      const data = await response.json();
      if (data.success) {
        setGames(data.games || []);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  };

  const handleSaveCourse = async () => {
    if (!course) return;

    try {
      const response = await fetch(`/api/admin/courses/${course.courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.course) {
          setCourse(data.course);
        }
        notifications.show({ color: 'green', title: 'Course saved', message: 'The course settings are up to date.' });
      } else {
        const data = await response.json().catch(() => ({}));
        notifications.show({ color: 'red', title: 'Could not save course', message: data.error || data.message || 'Failed to save course' });
      }
    } catch (error) {
      console.error('Failed to save course:', error);
      notifications.show({ color: 'red', title: 'Could not save course', message: 'Failed to save course' });
    }
  };

  const handleToggleActive = async () => {
    if (!course) return;

    try {
      const response = await fetch(`/api/admin/courses/${course.courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !course.isActive }),
      });

      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
        notifications.show({ color: 'green', title: data.course?.isActive ? 'Course published' : 'Course set to draft', message: 'Course visibility was updated.' });
      } else {
        const data = await response.json().catch(() => ({}));
        notifications.show({ color: 'red', title: 'Could not update course status', message: data.error || data.message || 'Failed to update course status' });
      }
    } catch (error) {
      console.error('Failed to toggle course status:', error);
      notifications.show({ color: 'red', title: 'Could not update course status', message: 'Failed to update course status' });
    }
  };

  const _updateCourseFeature = (flag: CourseFeatureFlag, enabled: boolean) => {
    if (!course) return;
    setCourse({
      ...course,
      [flag]: enabled,
    });
  };

  const handleExportCourse = async () => {
    if (!courseId) {
      notifications.show({ color: 'red', title: 'Export unavailable', message: 'Course ID is missing.' });
      return;
    }
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/export`);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        notifications.show({ color: 'red', title: 'Export failed', message: err.details ? `${err.error}: ${err.details}` : err.error || 'Failed to export' });
        return;
      }
      const data = await response.json();
      if (!data.course?.courseId) {
        notifications.show({ color: 'red', title: 'Export failed', message: 'Invalid export data received.' });
        return;
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${courseId}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      notifications.show({ color: 'green', title: 'Course exported', message: 'The course package download has started.' });
    } catch (error) {
      console.error('Failed to export course:', error);
      notifications.show({ color: 'red', title: 'Export failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const [importing, setImporting] = useState(false);
  const [importQuestionMode, setImportQuestionMode] = useState<'add' | 'overwrite'>('add');

  const handleImportCourse = async (file: File | null) => {
    if (!file) return;

    const questionModeText =
      importQuestionMode === 'overwrite'
        ? 'Overwrite questions: existing questions in imported lessons will be replaced by the package.'
        : 'Add questions: existing questions stay; only missing questions are added.';

    modals.openConfirmModal({
      title: 'Import course package',
      children: (
        <Stack gap="xs">
          <Text size="sm">{questionModeText}</Text>
          <Text size="sm" c="dimmed">Course content and configuration will be merged. Learner stats are preserved.</Text>
        </Stack>
      ),
      labels: { confirm: 'Import package', cancel: 'Cancel' },
      confirmProps: { color: 'amanobaYellow' },
      onConfirm: async () => {
        setImporting(true);
        try {
          const text = await file.text();
          const courseData = JSON.parse(text);
          const response = await fetch('/api/admin/courses/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              courseData,
              overwrite: true,
              questionImportMode: importQuestionMode,
            }),
          });

          const data = await response.json();

          if (data.success) {
            const questionsDeleted = Number(data.stats?.questionsDeleted ?? 0);
            const questionsSummary =
              importQuestionMode === 'overwrite'
                ? `Questions: ${data.stats.questionsCreated} created, ${data.stats.questionsUpdated} updated, ${questionsDeleted} deleted`
                : `Questions: ${data.stats.questionsCreated} created, ${data.stats.questionsUpdated} updated`;
            notifications.show({
              color: 'green',
              title: 'Course imported',
              message: `Lessons: ${data.stats.lessonsCreated} created, ${data.stats.lessonsUpdated} updated. ${questionsSummary}.`,
            });
            if (data.course?.courseId && data.course.courseId !== courseId) {
              router.push(`/${locale}/admin/courses/${data.course.courseId}`);
            } else {
              window.location.reload();
            }
          } else {
            notifications.show({ color: 'red', title: 'Import failed', message: [data.error || 'Failed to import', data.details].filter(Boolean).join(' ') });
          }
        } catch (error) {
          console.error('Failed to import:', error);
          notifications.show({ color: 'red', title: 'Import failed', message: 'Failed to import. Use a .json package.' });
        } finally {
          setImporting(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <Group justify="center" mih="60vh">
          <Loader color="amanobaYellow" />
          <Text c="white">Loading course...</Text>
        </Group>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container size="lg" py="xl">
        <Paper withBorder radius="md" p="xl" bg="dark.8">
          <Stack align="center">
            <ThemeIcon size={56} radius="xl" color="red">
              <IconX size={30} />
            </ThemeIcon>
            <Title order={1} size="h3" c="white">Course not found</Title>
            <Button component={Link} href={`/${locale}/admin/courses`} leftSection={<IconArrowLeft size={16} />}>
              Back to courses
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start">
          <ActionIcon component={Link} href={`/${locale}/admin/courses`} variant="default" size="lg" aria-label="Back to courses">
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Stack gap={4}>
            <Title order={1} size="h2" c="white">{course.name}</Title>
            <Text c="gray.4">Course Editor - Manage flexible lessons</Text>
          </Stack>
        </Group>
        <Group justify="flex-end">
          <Select
            aria-label="Question import mode"
            value={importQuestionMode}
            onChange={(value) => setImportQuestionMode((value || 'add') as 'add' | 'overwrite')}
            disabled={importing}
            allowDeselect={false}
            data={[
              { value: 'add', label: 'Questions: Add Only' },
              { value: 'overwrite', label: 'Questions: Overwrite' },
            ]}
          />
          <Button variant="default" leftSection={<IconDownload size={16} />} onClick={handleExportCourse}>
            Export
          </Button>
          <FileButton onChange={handleImportCourse} accept=".json">
            {(props) => (
              <Button {...props} loading={importing} leftSection={<IconFileUpload size={16} />}>
                Import
              </Button>
            )}
          </FileButton>
          <Button
            variant="default"
            leftSection={<IconEye size={16} />}
            onClick={() => window.open(`/${locale}/courses/${course.courseId}`, '_blank')}
          >
            Preview
          </Button>
          <Button color={course.isActive ? 'green' : 'gray'} onClick={handleToggleActive}>
            {course.isActive ? 'Published' : 'Draft'}
          </Button>
          <Button leftSection={<IconDeviceFloppy size={16} />} onClick={handleSaveCourse}>
            Save Course
          </Button>
        </Group>
      </Group>

      <Card padding="lg">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Title order={2} size="h3">Course builder workflow</Title>
              <Text c="dimmed">
                Build the course in learner order: basics, lessons, quiz policy, certification, then publish checks.
              </Text>
            </Stack>
            <Badge color={course.isActive ? 'green' : 'gray'} variant="light">
              {course.isActive ? 'Published' : 'Draft'}
            </Badge>
          </Group>
          <Stepper active={Math.min(4, [
            Boolean(course.name && course.description && course.language),
            lessons.length > 0,
            course.lessonQuizPolicy?.enabled !== false,
            course.certification?.enabled === true,
            course.isActive,
          ].filter(Boolean).length)} allowNextStepsSelect={false}>
            <Stepper.Step icon={<IconSettings size={18} />} label="Basics" description="Name, language, pricing" />
            <Stepper.Step icon={<IconBook size={18} />} label="Lessons" description={`${lessons.length} lesson${lessons.length === 1 ? '' : 's'}`} />
            <Stepper.Step icon={<IconChecklist size={18} />} label="Quiz policy" description="Daily pass rules" />
            <Stepper.Step icon={<IconCertificate size={18} />} label="Certificate" description={course.certification?.enabled ? 'Enabled' : 'Optional'} />
            <Stepper.Completed>Ready for publish review</Stepper.Completed>
          </Stepper>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
            <Alert color={lessons.length > 0 ? 'green' : 'yellow'} variant="light" title="Lesson range">
              <Text size="sm">Courses can contain 1 to unlimited lessons. Planned length is {course.durationDays}; highest lesson day is {maxLessonDay || 0}.</Text>
            </Alert>
            <Alert color={course.lessonQuizPolicy?.enabled !== false ? 'green' : 'gray'} variant="light" title="Quiz rule">
              <Text size="sm">Course-level lesson quiz policy is authoritative; old lesson quiz fields are compatibility only.</Text>
            </Alert>
            <Alert color={course.certification?.enabled ? 'green' : 'gray'} variant="light" title="Certification">
              <Text size="sm">Enable certificates after final exam pool, completion gates, price, and template are clear.</Text>
            </Alert>
          </SimpleGrid>
        </Stack>
      </Card>

      <Card padding="lg">
        <Stack gap="md">
          <Title order={2} size="h3">Course Information</Title>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
            <TextInput label="Course Name" value={course.name} onChange={(event) => setCourse({ ...course, name: event.currentTarget.value })} />
            <Select
              label="Language"
              value={course.language}
              onChange={(value) => setCourse({ ...course, language: value || course.language })}
              data={resolvedLanguageOptions.map((option) => ({ value: option.code, label: option.label }))}
              allowDeselect={false}
            />
            <NumberInput
              label="Planned Lesson Count"
              description="Used as a fallback for empty courses. Active lessons define the learner-facing course length."
              min={1}
              step={1}
              value={course.durationDays}
              onChange={(value) => setCourse({ ...course, durationDays: Math.max(1, Math.floor(Number(value) || 1)) })}
            />
            <TextInput
              label="Course Family (CCS ID)"
              description="Courses with the same CCS ID are treated as language variants in Admin > Courses > By course family (CCS)."
              value={course.ccsId || ''}
              onChange={(event) => setCourse({ ...course, ccsId: event.currentTarget.value })}
              placeholder="e.g., PRODUCTIVITY_2026"
            />
          </SimpleGrid>
          <Textarea label="Description" autosize minRows={3} value={course.description} onChange={(event) => setCourse({ ...course, description: event.currentTarget.value })} />
          <Stack gap="xs">
            <Text fw={600} size="sm">Course Thumbnail</Text>
            {course.thumbnail ? (
              <Paper withBorder radius="md" pos="relative" h={220} className="overflow-hidden">
                <Image
                  src={course.thumbnail}
                  alt="Course thumbnail"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 24rem"
                />
                <ActionIcon
                  aria-label="Remove thumbnail"
                  color="red"
                  variant="filled"
                  pos="absolute"
                  top={8}
                  right={8}
                  onClick={() => setCourse({ ...course, thumbnail: undefined })}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Paper>
            ) : null}
            <FileButton
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={async (file) => {
                if (!file) return;
                try {
                  const formData = new FormData();
                  formData.append('image', file);
                  const response = await fetch('/api/admin/upload-image', { method: 'POST', body: formData });
                  const data = await response.json();
                  if (data.success) {
                    setCourse({ ...course, thumbnail: data.url });
                    notifications.show({ color: 'green', title: 'Thumbnail uploaded', message: 'The course thumbnail was updated.' });
                  } else {
                    notifications.show({ color: 'red', title: 'Upload failed', message: data.error || 'Failed to upload image' });
                  }
                } catch (error) {
                  console.error('Failed to upload image:', error);
                  notifications.show({ color: 'red', title: 'Upload failed', message: 'Failed to upload image. Please try again.' });
                }
              }}
            >
              {(props) => (
                <Button {...props} leftSection={<IconUpload size={16} />} w="fit-content">
                  {course.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                </Button>
              )}
            </FileButton>
            <Text size="xs" c="dimmed">Upload a course thumbnail image (JPEG, PNG, WebP, or GIF, max 10MB).</Text>
          </Stack>
          {isAdmin && (
            <Paper withBorder radius="md" p="md">
              <Stack gap="sm">
                <Stack gap={2}>
                  <Text fw={600}>Assigned editors</Text>
                  <Text size="xs" c="dimmed">Editors can edit this course and see it in their admin course list. Only admins can change this list.</Text>
                </Stack>
                {(course.assignedEditors ?? []).map((id) => (
                  <Group key={id} justify="space-between">
                    <Text fw={600}>{editorNames[id] ?? id}</Text>
                    <Button
                      type="button"
                      color="red"
                      variant="subtle"
                      onClick={async () => {
                        const next = (course.assignedEditors ?? []).filter((e) => e !== id);
                        try {
                          const r = await fetch(`/api/admin/courses/${course.courseId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ assignedEditors: next }),
                          });
                          if (r.ok) {
                            const data = await r.json();
                            setCourse(data.course);
                            notifications.show({ color: 'green', title: 'Editor removed', message: 'Course editor access was updated.' });
                          } else {
                            const err = await r.json();
                            notifications.show({ color: 'red', title: 'Could not remove editor', message: err.message || err.error || 'Failed to remove editor' });
                          }
                        } catch (e) {
                          console.error(e);
                          notifications.show({ color: 'red', title: 'Could not remove editor', message: 'Failed to remove editor' });
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </Group>
                ))}
                <Group align="flex-end">
                  <TextInput
                    placeholder="Search by email or name..."
                    label="Find editor"
                    value={editorSearch}
                    onChange={(event) => setEditorSearch(event.currentTarget.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        setEditorSearching(true);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    loading={editorSearching}
                    onClick={() => {
                      setEditorSearching(true);
                      if (!editorSearch.trim()) {
                        setEditorSearchResults([]);
                        setEditorSearching(false);
                        return;
                      }
                      fetch(`/api/admin/players?search=${encodeURIComponent(editorSearch.trim())}&limit=10`)
                        .then((r) => r.json())
                        .then((d) => {
                          setEditorSearchResults(d.success && Array.isArray(d.players) ? d.players : []);
                          setEditorSearching(false);
                        })
                        .catch(() => {
                          setEditorSearchResults([]);
                          setEditorSearching(false);
                        });
                    }}
                    disabled={editorSearching}
                  >
                    Search
                  </Button>
                </Group>
                {editorSearchResults.length > 0 && (
                  <Stack gap="xs">
                    {editorSearchResults
                      .filter((p) => !(course.assignedEditors ?? []).includes(String(p._id)))
                      .map((p) => (
                        <Paper key={String(p._id)} withBorder radius="sm" p="xs">
                          <Group justify="space-between">
                          <Text>
                            {p.displayName || p.email || String(p._id)}
                          </Text>
                          <Button
                            type="button"
                            variant="subtle"
                            onClick={async () => {
                              const current = course.assignedEditors ?? [];
                              const id = String(p._id);
                              if (current.includes(id)) return;
                              const next = [...current, id];
                              try {
                                const r = await fetch(`/api/admin/courses/${course.courseId}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ assignedEditors: next }),
                                });
                                if (r.ok) {
                                  const data = await r.json();
                                  setCourse(data.course);
                                  setEditorSearchResults([]);
                                  setEditorSearch('');
                                  notifications.show({ color: 'green', title: 'Editor added', message: 'Course editor access was updated.' });
                                } else {
                                  const err = await r.json();
                                  notifications.show({ color: 'red', title: 'Could not add editor', message: err.message || err.error || 'Failed to add editor' });
                                }
                              } catch (e) {
                                console.error(e);
                                notifications.show({ color: 'red', title: 'Could not add editor', message: 'Failed to add editor' });
                              }
                            }}
                          >
                            Add
                          </Button>
                          </Group>
                        </Paper>
                      ))}
                  </Stack>
                )}
              </Stack>
            </Paper>
          )}
          <Checkbox
            label="Requires Premium"
            checked={course.requiresPremium}
            onChange={(event) => setCourse({ ...course, requiresPremium: event.currentTarget.checked })}
          />
          {course.requiresPremium && (
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <NumberInput
                  label="Price (in smallest unit)"
                  description={(() => {
                    const currentCurrency = course.price?.currency || 'usd';
                    const currentAmount = course.price?.amount || 0;
                    const isValid = currentAmount > 0 && meetsStripeMinimum(currentAmount, currentCurrency);
                    return !isValid && currentAmount > 0
                      ? `Amount too low. Minimum for ${currentCurrency.toUpperCase()} is ${getFormattedMinimum(currentCurrency)}`
                      : `Enter amount in smallest unit. Minimum: ${getFormattedMinimum(currentCurrency)}`;
                  })()}
                  min={getStripeMinimum(course.price?.currency || 'usd')}
                  step={1}
                  value={course.price?.amount || 2999}
                  error={Boolean(course.price?.amount && course.price?.currency && !meetsStripeMinimum(course.price.amount, course.price.currency))}
                  onChange={(value) => {
                    const newAmount = Number(value) || 0;
                    const currentCurrency = course.price?.currency || 'usd';
                    setCourse({ ...course, price: { amount: newAmount, currency: currentCurrency } });
                  }}
                  placeholder="2999"
              />
              <Select
                  label="Currency"
                  description={`Minimum: ${getFormattedMinimum(course.price?.currency || 'usd')}`}
                  value={course.price?.currency || 'usd'}
                  allowDeselect={false}
                  data={[
                    { value: 'usd', label: 'USD ($) - Min: $0.50' },
                    { value: 'eur', label: 'EUR (€) - Min: €0.50' },
                    { value: 'huf', label: 'HUF (Ft) - Min: 175 Ft' },
                    { value: 'gbp', label: 'GBP (£) - Min: £0.30' },
                  ]}
                  onChange={(value) => {
                    const newCurrency = value || 'usd';
                    const currentAmount = course.price?.amount || 2999;
                    const minimum = getStripeMinimum(newCurrency);
                    const newAmount = currentAmount < minimum ? minimum : currentAmount;
                    setCourse({ ...course, price: { amount: newAmount, currency: newCurrency } });
                  }}
              />
            </SimpleGrid>
          )}
        </Stack>
      </Card>

      <Card padding="lg">
        <Stack gap="md">
          <Title order={2} size="h3">Lesson quizzes</Title>
          <Text c="dimmed" size="sm">
            Course-level single source of truth for lesson quiz runtime behavior. Lesson editor no longer controls pass rule, required gate, or question count.
          </Text>
          <Checkbox
              label="Enable lesson quizzes for this course"
              checked={course.lessonQuizPolicy?.enabled !== false}
              onChange={(event) => setCourse({
                ...course,
                lessonQuizPolicy: {
                  ...course.lessonQuizPolicy,
                  enabled: event.currentTarget.checked,
                },
              })}
          />
          <Checkbox
              label="Require lesson quiz pass before lesson completion"
              checked={course.lessonQuizPolicy?.required !== false}
              onChange={(event) => setCourse({
                ...course,
                lessonQuizPolicy: {
                  ...course.lessonQuizPolicy,
                  required: event.currentTarget.checked,
                },
              })}
          />
          <SimpleGrid cols={{ base: 1, md: 4 }}>
            <NumberInput
              label="Max wrong answers allowed"
              description="Leave empty to use success threshold."
              min={0}
              max={10}
              step={1}
              value={course.lessonQuizPolicy?.maxWrongAllowed ?? course.quizMaxWrongAllowed ?? ''}
              onChange={(value) => {
                const v = value === '' ? undefined : Math.min(10, Math.max(0, Number(value) || 0));
                setCourse({ ...course, quizMaxWrongAllowed: v, lessonQuizPolicy: { ...course.lessonQuizPolicy, maxWrongAllowed: v } });
              }}
              placeholder="e.g. 1"
            />
            <NumberInput
              label="Questions per lesson quiz"
              description="Runtime uses this course-level value."
              min={1}
              max={50}
              step={1}
              value={course.lessonQuizPolicy?.questionCount ?? course.defaultLessonQuizQuestionCount ?? ''}
              onChange={(value) => {
                const v = value === '' ? undefined : Math.min(50, Math.max(1, Number(value) || 1));
                setCourse({ ...course, defaultLessonQuizQuestionCount: v, lessonQuizPolicy: { ...course.lessonQuizPolicy, questionCount: v } });
              }}
              placeholder="e.g. 5"
            />
            <Select
              label="Shown answer options"
              value={String(course.lessonQuizPolicy?.shownAnswerCount ?? 3)}
              allowDeselect={false}
              data={[
                { value: '2', label: '2 options' },
                { value: '3', label: '3 options' },
                { value: '4', label: '4 options' },
              ]}
              onChange={(value) => {
                const v = Math.min(4, Math.max(2, Number(value) || 3));
                setCourse({ ...course, lessonQuizPolicy: { ...course.lessonQuizPolicy, shownAnswerCount: v } });
              }}
            />
            <NumberInput
              label="Success threshold (%)"
              description="Used when max wrong is empty."
              min={0}
              max={100}
              step={1}
              value={course.lessonQuizPolicy?.successThreshold ?? 70}
              onChange={(value) => {
                const v = Math.min(100, Math.max(0, Number(value) || 0));
                setCourse({ ...course, lessonQuizPolicy: { ...course.lessonQuizPolicy, successThreshold: v } });
              }}
            />
          </SimpleGrid>
        </Stack>
      </Card>

      <Card padding="lg">
        <Stack gap="md">
          <Title order={2} size="h3">Certification Settings</Title>
          <Checkbox
                label="Enable Certification"
                description="Allow students to earn certificates for completing this course."
                checked={course.certification?.enabled || false}
                onChange={(event) => setCourse({
                  ...course,
                  certification: {
                    ...course.certification,
                    enabled: event.currentTarget.checked,
                    passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                    requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                    requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                    pricePoints: course.certification?.pricePoints ?? 0,
                    premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                    templateId: course.certification?.templateId ?? 'default_v1',
                    credentialTitleId: course.certification?.credentialTitleId ?? '',
                  },
                })}
          />

          {course.certification?.enabled && (
            <>
              <Paper withBorder radius="md" p="md">
                <Stack gap="md">
                  <Title order={3} size="h4">Pass rules</Title>
                  <Text size="xs" c="dimmed">
                  Current rule: Pass final exam ≥ {course.certification?.passThresholdPercent ?? 50}%;
                  {course.certification?.requireAllLessonsCompleted !== false ? ' All lessons completed required;' : ' Lessons not required;'}
                  {course.certification?.requireAllQuizzesPassed !== false ? ' All daily quizzes passed required.' : ' Daily quizzes not required.'}
                  </Text>
                  <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <NumberInput
                    label="Pass threshold (%)"
                    description="Minimum final exam score to be eligible for certificate."
                    min={0}
                    max={100}
                    step={1}
                    value={course.certification?.passThresholdPercent ?? 50}
                    onChange={(value) => setCourse({
                      ...course,
                      certification: {
                        ...course.certification,
                        enabled: true,
                        passThresholdPercent: Math.min(100, Math.max(0, Number(value) || 50)),
                        requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                        requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                        pricePoints: course.certification?.pricePoints ?? 0,
                        premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                        templateId: course.certification?.templateId ?? 'default_v1',
                        credentialTitleId: course.certification?.credentialTitleId ?? '',
                      },
                    })}
                  />
                  <NumberInput
                    label="Max error % (immediate fail)"
                    description="Leave empty to allow completing the exam."
                    min={0}
                    max={100}
                    step={1}
                    value={course.certification?.maxErrorPercent ?? ''}
                    onChange={(value) => setCourse({
                      ...course,
                      certification: {
                        ...course.certification,
                        enabled: true,
                        passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                        maxErrorPercent: value === '' ? undefined : Math.min(100, Math.max(0, Number(value) || 0)),
                        requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                        requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                        pricePoints: course.certification?.pricePoints ?? 0,
                        premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                        templateId: course.certification?.templateId ?? 'default_v1',
                        credentialTitleId: course.certification?.credentialTitleId ?? '',
                      },
                    })}
                    placeholder="e.g. 10"
                  />
                  </SimpleGrid>
                  <Checkbox
                      label="Require all lessons completed"
                      checked={course.certification?.requireAllLessonsCompleted !== false}
                      onChange={(event) => setCourse({
                        ...course,
                        certification: {
                          ...course.certification,
                          enabled: true,
                          passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                          requireAllLessonsCompleted: event.currentTarget.checked,
                          requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                          pricePoints: course.certification?.pricePoints ?? 0,
                          premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                          templateId: course.certification?.templateId ?? 'default_v1',
                          credentialTitleId: course.certification?.credentialTitleId ?? '',
                        },
                      })}
                  />
                  <Checkbox
                      label="Require all daily quizzes passed"
                      checked={course.certification?.requireAllQuizzesPassed !== false}
                      onChange={(event) => setCourse({
                        ...course,
                        certification: {
                          ...course.certification,
                          enabled: true,
                          passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                          requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                          requireAllQuizzesPassed: event.currentTarget.checked,
                          pricePoints: course.certification?.pricePoints ?? 0,
                          premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                          templateId: course.certification?.templateId ?? 'default_v1',
                          credentialTitleId: course.certification?.credentialTitleId ?? '',
                        },
                      })}
                  />
                </Stack>
              </Paper>

              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <NumberInput
                  label="Price (Points)"
                  description="Points required to unlock certification exam (0 = free)."
                  min={0}
                  step={1}
                  value={course.certification?.pricePoints || 0}
                  onChange={(value) => setCourse({
                    ...course,
                    certification: {
                      ...course.certification,
                      enabled: true,
                      passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                      requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                      requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                      pricePoints: Number(value) || 0,
                      premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                      templateId: course.certification?.templateId ?? 'default_v1',
                      credentialTitleId: course.certification?.credentialTitleId ?? '',
                    },
                  })}
                  placeholder="0"
                />
                <TextInput
                  label="Template ID"
                  description="Certificate design template."
                  value={course.certification?.templateId || 'default_v1'}
                  onChange={(event) => setCourse({
                    ...course,
                    certification: {
                      ...course.certification,
                      enabled: true,
                      passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                      requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                      requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                      pricePoints: course.certification?.pricePoints ?? 0,
                      premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                      templateId: event.currentTarget.value,
                      credentialTitleId: course.certification?.credentialTitleId ?? '',
                    },
                  })}
                  placeholder="default_v1"
                />
                <TextInput
                  label="Credential Title ID"
                  description="Credential identifier shown on certificate."
                  value={course.certification?.credentialTitleId || ''}
                  onChange={(event) => setCourse({
                      ...course,
                      certification: {
                        ...course.certification,
                        enabled: true,
                        passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                        requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                        requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                        pricePoints: course.certification?.pricePoints ?? 0,
                      premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                        templateId: course.certification?.templateId ?? 'default_v1',
                      credentialTitleId: event.currentTarget.value,
                      },
                    })}
                  placeholder="e.g., AAE, CERT"
                />
              </SimpleGrid>
              <Checkbox
                  label="Premium Includes Certification"
                  description="Automatically grant certification access to premium course purchasers."
                  checked={course.certification?.premiumIncludesCertification || false}
                  onChange={(event) => setCourse({
                    ...course,
                    certification: {
                      ...course.certification,
                      enabled: true,
                      passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                      requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                      requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                      pricePoints: course.certification?.pricePoints ?? 0,
                      premiumIncludesCertification: event.currentTarget.checked,
                      templateId: course.certification?.templateId ?? 'default_v1',
                      credentialTitleId: course.certification?.credentialTitleId ?? '',
                    },
                  })}
              />
            </>
          )}
        </Stack>
      </Card>

      <Card padding="lg">
        <Stack gap="md">
          <Title order={2} size="h3">Course Feature Toggles</Title>
          <Checkbox
            label="Course discussion"
            description="Show or hide the discussion forum on this course page."
            checked={course.discussionEnabled ?? false}
            onChange={(event) => _updateCourseFeature('discussionEnabled', event.currentTarget.checked)}
          />
          <Checkbox
            label="Course leaderboard"
            description="Toggle the leaderboard block that shows top students for this course."
            checked={course.leaderboardEnabled ?? false}
            onChange={(event) => _updateCourseFeature('leaderboardEnabled', event.currentTarget.checked)}
          />
          <Checkbox
            label="Study groups"
            description="Enable or disable the study group widget for this course."
            checked={course.studyGroupsEnabled ?? false}
            onChange={(event) => _updateCourseFeature('studyGroupsEnabled', event.currentTarget.checked)}
          />
        </Stack>
      </Card>

      {!course.parentCourseId && (
        <Card padding="lg">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Stack gap={4}>
                <Title order={2} size="h3">Shorts</Title>
                <Text c="dimmed" size="sm">
                  Create short-course variants from selected lessons. Variant type is based on lesson count; new shorts start as draft.
                </Text>
              </Stack>
              <Button
                type="button"
                variant={showShortsCreate ? 'default' : 'filled'}
                leftSection={showShortsCreate ? <IconX size={16} /> : <IconPlus size={16} />}
                onClick={() => setShowShortsCreate(!showShortsCreate)}
              >
                {showShortsCreate ? 'Cancel' : 'Create short'}
              </Button>
            </Group>

            {shorts.length > 0 && (
              <Stack gap="xs">
                <Text fw={600} size="sm">Existing shorts</Text>
                {shorts.map((short) => (
                  <Paper key={short.courseId} withBorder radius="md" p="sm">
                    <Group justify="space-between" align="center">
                      <Stack gap={2}>
                        <Text fw={600}>{short.name || short.courseId}</Text>
                        <Group gap="xs">
                          <Badge color={short.isDraft ? 'yellow' : 'green'} variant="light">
                            {short.isDraft ? 'Draft' : 'Published'}
                          </Badge>
                          {short.courseVariant && <Badge variant="outline">{short.courseVariant}</Badge>}
                        </Group>
                      </Stack>
                      <Group gap="xs">
                        <Button component={Link} href={`/${locale}/admin/courses/${short.courseId}`} variant="default" size="xs" leftSection={<IconEdit size={14} />}>
                          Edit
                        </Button>
                        {short.isDraft && (
                          <Button
                            type="button"
                            size="xs"
                            color="green"
                            onClick={async () => {
                              try {
                                const response = await fetch(`/api/admin/courses/${short.courseId}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ isDraft: false }),
                                });
                                if (!response.ok) {
                                  const error = await response.json().catch(() => ({}));
                                  notifications.show({ color: 'red', title: 'Publish failed', message: error.message || error.error || 'Could not publish short.' });
                                  return;
                                }
                                const list = await fetch(`/api/admin/courses?parentCourseId=${encodeURIComponent(course.courseId)}`).then((x) => x.json());
                                if (list.success) setShorts(list.courses || []);
                                notifications.show({ color: 'green', title: 'Short published', message: 'The short course is now visible.' });
                              } catch (error) {
                                console.error('Publish failed', error);
                                notifications.show({ color: 'red', title: 'Publish failed', message: 'Could not publish short.' });
                              }
                            }}
                          >
                            Publish
                          </Button>
                        )}
                      </Group>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}

            {showShortsCreate && (
              <Paper withBorder radius="md" p="md">
                <Stack gap="md">
                  <Text size="sm">
                    Select lessons on the Lesson Builder cards below, then set the certificate question count and save the short.
                  </Text>
                  <Group align="flex-end">
                    <NumberInput
                      label="Cert question count"
                      min={1}
                      max={50}
                      step={1}
                      value={shortCertCount}
                      onChange={(value) => setShortCertCount(Math.min(50, Math.max(1, Number(value) || 25)))}
                    />
                    <Button
                      type="button"
                      loading={shortCreating}
                      disabled={shortSelectedIds.length === 0}
                      leftSection={<IconDeviceFloppy size={16} />}
                      onClick={async () => {
                        if (!course.courseId || shortSelectedIds.length === 0) return;
                        const orderedIds = lessons
                          .filter((lesson) => shortSelectedIds.includes(lesson._id))
                          .sort((a, b) => a.dayNumber - b.dayNumber)
                          .map((lesson) => lesson._id);
                        setShortCreating(true);
                        try {
                          const response = await fetch('/api/admin/courses/fork', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              parentCourseId: course.courseId,
                              selectedLessonIds: orderedIds,
                              certQuestionCount: shortCertCount,
                            }),
                          });
                          const data = await response.json();
                          if (data.success) {
                            setShorts((prev) => [
                              ...prev,
                              {
                                courseId: data.course.courseId,
                                name: data.course.name,
                                courseVariant: data.course.courseVariant,
                                isDraft: data.course.isDraft ?? true,
                              },
                            ]);
                            setShowShortsCreate(false);
                            setShortSelectedIds([]);
                            notifications.show({ color: 'green', title: 'Short created', message: 'The new short course was saved as a draft.' });
                          } else {
                            notifications.show({ color: 'red', title: 'Short creation failed', message: data.error || 'Failed to create short.' });
                          }
                        } catch (error) {
                          console.error(error);
                          notifications.show({ color: 'red', title: 'Short creation failed', message: 'Failed to create short.' });
                        } finally {
                          setShortCreating(false);
                        }
                      }}
                    >
                      Save short
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            )}
          </Stack>
        </Card>
      )}

      <Card padding="lg">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Title order={2} size="h3">
                {course.parentCourseId ? 'Short course lessons' : 'Lesson Builder'}
              </Title>
              <Text c="dimmed" size="sm">
                {course.parentCourseId
                  ? 'Lesson and quiz content are managed in the parent course. Only preview is available here.'
                  : 'Create and edit the ordered lesson sequence learners will follow.'}
              </Text>
            </Stack>
            {!course.parentCourseId && (
              <Button
                type="button"
                leftSection={<IconPlus size={16} />}
                onClick={() => {
                  setEditingLesson(nextEditableLessonDay);
                  setShowLessonForm(true);
                }}
              >
                Add Lesson
              </Button>
            )}
          </Group>

          {course.parentCourseId && (
            <Paper withBorder radius="md" p="md">
              <Stack gap="sm">
                <Group justify="space-between" align="center">
                  <Stack gap={2}>
                    <Text fw={600}>Sync with parent</Text>
                    {syncStatusData?.lastSyncedAt && (
                      <Text size="xs" c="dimmed">Last synced: {new Date(syncStatusData.lastSyncedAt).toLocaleString()}</Text>
                    )}
                  </Stack>
                  <Badge
                    color={syncStatusData?.computedStatus === 'synced' ? 'green' : 'yellow'}
                    leftSection={syncStatusData?.computedStatus === 'synced' ? undefined : <IconAlertTriangle size={12} />}
                  >
                    {syncStatusData?.computedStatus === 'synced' ? 'Synced' : 'Out of sync'}
                  </Badge>
                </Group>
                {syncStatusData?.missingLessonIds.length ? (
                  <Alert color="yellow" icon={<IconAlertTriangle size={16} />} title="Missing parent lessons">
                    {syncStatusData.missingLessonIds.length} lesson reference(s) no longer exist on the parent. Re-sync to remove them.
                  </Alert>
                ) : null}
                <Group>
                  <Button
                    type="button"
                    loading={syncActionLoading}
                    leftSection={<IconRefresh size={16} />}
                    onClick={async () => {
                      setSyncActionLoading(true);
                      try {
                        const response = await fetch(`/api/admin/courses/${course.courseId}/sync`, { method: 'POST' });
                        const data = await response.json();
                        if (data.success) {
                          setCourse((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  syncStatus: 'synced',
                                  lastSyncedAt: data.course?.lastSyncedAt ?? prev.lastSyncedAt,
                                  selectedLessonIds: data.course?.selectedLessonIds ?? prev.selectedLessonIds,
                                }
                              : null
                          );
                          setSyncStatusData((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  computedStatus: 'synced',
                                  missingLessonIds: [],
                                  lastSyncedAt: data.course?.lastSyncedAt ?? prev.lastSyncedAt,
                                }
                              : null
                          );
                          fetchLessons(course.courseId);
                          notifications.show({
                            color: 'green',
                            title: 'Short re-synced',
                            message: (data.removedLessonIds?.length ?? 0) > 0
                              ? `${data.removedLessonIds.length} invalid lesson reference(s) were removed.`
                              : 'The short course now matches the parent selection.',
                          });
                        } else {
                          notifications.show({ color: 'red', title: 'Re-sync failed', message: data.message || data.error || 'Re-sync failed.' });
                        }
                      } catch (error) {
                        console.error(error);
                        notifications.show({ color: 'red', title: 'Re-sync failed', message: 'Re-sync failed.' });
                      } finally {
                        setSyncActionLoading(false);
                      }
                    }}
                  >
                    Re-sync from parent
                  </Button>
                  <Button
                    type="button"
                    variant="default"
                    loading={syncActionLoading}
                    onClick={async () => {
                      setSyncActionLoading(true);
                      try {
                        const response = await fetch(`/api/admin/courses/${course.courseId}/unsync`, { method: 'POST' });
                        const data = await response.json();
                        if (data.success) {
                          setCourse((prev) => (prev ? { ...prev, syncStatus: 'out_of_sync' } : null));
                          setSyncStatusData((prev) => (prev ? { ...prev, computedStatus: 'out_of_sync' } : null));
                          notifications.show({ color: 'yellow', title: 'Marked out of sync', message: 'The short course is flagged for review.' });
                        } else {
                          notifications.show({ color: 'red', title: 'Update failed', message: data.message || data.error || 'Mark unsync failed.' });
                        }
                      } catch (error) {
                        console.error(error);
                        notifications.show({ color: 'red', title: 'Update failed', message: 'Mark unsync failed.' });
                      } finally {
                        setSyncActionLoading(false);
                      }
                    }}
                  >
                    Mark out of sync
                  </Button>
                </Group>
              </Stack>
            </Paper>
          )}

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
            {Array.from({ length: lessonGridLength }, (_, index) => index + 1).map((day) => {
              const lesson = lessons.find((item) => item.dayNumber === day);
              const inShortSelection = Boolean(!course.parentCourseId && showShortsCreate && lesson);
              const isSelectedForShort = Boolean(lesson && shortSelectedIds.includes(lesson._id));

              return (
                <Card key={day} withBorder padding="md" bg={lesson ? 'dark.7' : 'dark.8'}>
                  <Stack gap="sm" h="100%">
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        {inShortSelection && lesson && (
                          <Checkbox
                            aria-label={`Include day ${day} in short`}
                            checked={isSelectedForShort}
                            onChange={(event) => {
                              if (event.currentTarget.checked) {
                                setShortSelectedIds((prev) => [...prev, lesson._id]);
                              } else {
                                setShortSelectedIds((prev) => prev.filter((id) => id !== lesson._id));
                              }
                            }}
                          />
                        )}
                        <ThemeIcon variant="light" color={lesson ? 'amanobaYellow' : 'gray'} size="sm">
                          <IconCalendar size={14} />
                        </ThemeIcon>
                        <Text fw={700}>Day {day}</Text>
                      </Group>
                      {lesson ? <Badge color="green" variant="light">Ready</Badge> : <Badge color="gray" variant="light">Empty</Badge>}
                    </Group>

                    {lesson ? (
                      <>
                        <Stack gap={4} flex={1}>
                          <Text fw={700} lineClamp={1}>{lesson.title}</Text>
                          <Text size="sm" c="dimmed" lineClamp={2}>{lesson.content}</Text>
                        </Stack>
                        <Group gap="xs" grow>
                          <Button
                            type="button"
                            variant="default"
                            leftSection={<IconEye size={14} />}
                            onClick={() => window.open(`/${locale}/courses/${course.courseId}/day/${day}`, '_blank')}
                          >
                            Preview
                          </Button>
                          {!course.parentCourseId && (
                            <Button
                              type="button"
                              leftSection={<IconEdit size={14} />}
                              onClick={() => {
                                setEditingLesson(day);
                                setShowLessonForm(true);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                        </Group>
                      </>
                    ) : (
                      !course.parentCourseId && (
                        <Button
                          type="button"
                          variant="subtle"
                          leftSection={<IconPlus size={14} />}
                          onClick={() => {
                            setEditingLesson(day);
                            setShowLessonForm(true);
                          }}
                        >
                          Add Lesson
                        </Button>
                      )
                    )}
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Card>

      {/* Lesson Form Modal (not used for child courses) */}
      {showLessonForm && courseId && course && !course.parentCourseId && (
        <LessonFormModal
          courseId={courseId}
          course={course}
          dayNumber={editingLesson || 1}
          lesson={lessons.find((l) => l.dayNumber === editingLesson) || null}
          games={games}
          onClose={() => {
            setShowLessonForm(false);
            setEditingLesson(null);
          }}
          onSave={() => {
            fetchLessons(courseId);
            fetchCourse(courseId);
            setShowLessonForm(false);
            setEditingLesson(null);
          }}
        />
      )}
      </Stack>
    </Container>
  );
}

// Lesson Form Modal Component
function LessonFormModal({
  courseId,
  course,
  dayNumber,
  lesson,
  games,
  onClose,
  onSave,
}: {
  courseId: string;
  course: Course;
  dayNumber: number;
  lesson: LessonWithQuizConfig | null;
  games: Game[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    lessonId: lesson?.lessonId || `DAY_${dayNumber.toString().padStart(2, '0')}`,
    title: lesson?.title || '',
    content: lesson?.content || '',
    emailSubject: lesson?.emailSubject || `Day ${dayNumber}: `,
    emailBody: lesson?.emailBody || '',
    assessmentGameId: lesson?.assessmentGameId || '',
    pointsReward: lesson?.pointsReward || 50,
    xpReward: lesson?.xpReward || 25,
  });
  const [saving, setSaving] = useState(false);
  const [showQuizManager, setShowQuizManager] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = lesson
        ? `/api/admin/courses/${courseId}/lessons/${lesson.lessonId}`
        : `/api/admin/courses/${courseId}/lessons`;

      const method = lesson ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          content: formData.content,
          dayNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        notifications.show({
          color: 'green',
          title: lesson ? 'Lesson updated' : 'Lesson created',
          message: `Day ${dayNumber} was saved.`,
        });
        onSave();
      } else {
        notifications.show({ color: 'red', title: 'Could not save lesson', message: data.error || 'Failed to save lesson' });
      }
    } catch (error) {
      console.error('Failed to save lesson:', error);
      notifications.show({ color: 'red', title: 'Could not save lesson', message: 'Failed to save lesson' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      opened
      onClose={onClose}
      size="xl"
      title={`${lesson ? 'Edit' : 'Create'} Lesson - Day ${dayNumber}`}
      centered
      overlayProps={{ opacity: 0.55, blur: 3 }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Lesson ID"
            required
            value={formData.lessonId}
            onChange={(event) => setFormData({ ...formData, lessonId: event.currentTarget.value })}
          />
          <TextInput
            label="Title"
            required
            value={formData.title}
            onChange={(event) => setFormData({ ...formData, title: event.currentTarget.value })}
          />
          <Stack gap="xs">
            <Text fw={600} size="sm">Content (Markdown)</Text>
            <MarkdownEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Write your lesson in **Markdown**: headings, lists, **bold**, *italic*, [links](url)"
            />
          </Stack>
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <TextInput
              label="Email Subject"
              value={formData.emailSubject}
              onChange={(event) => setFormData({ ...formData, emailSubject: event.currentTarget.value })}
            />
            <Select
              label="Assessment Game"
              value={formData.assessmentGameId}
              onChange={(value) => setFormData({ ...formData, assessmentGameId: value || '' })}
              data={[
                { value: '', label: 'None (Use Quiz Instead)' },
                ...games.map((game) => ({ value: game._id, label: game.name })),
              ]}
              allowDeselect={false}
            />
          </SimpleGrid>
          <Paper withBorder radius="md" p="md">
            <Stack gap="sm">
              <Stack gap={4}>
                <Title order={3} size="h4">Lesson Quiz Questions</Title>
                <Text size="sm" c="dimmed">
                  Quiz behavior is configured at course level. Here you manage only the question content for this lesson.
                </Text>
                <Text size="xs" c="dimmed">
                  Course policy: {course.lessonQuizPolicy?.enabled !== false ? 'enabled' : 'disabled'}; required: {course.lessonQuizPolicy?.required !== false ? 'yes' : 'no'}; questions: {course.lessonQuizPolicy?.questionCount ?? course.defaultLessonQuizQuestionCount ?? 5}; shown answers: {course.lessonQuizPolicy?.shownAnswerCount ?? 3}; max wrong: {course.lessonQuizPolicy?.maxWrongAllowed ?? course.quizMaxWrongAllowed ?? 'n/a'}; threshold: {course.lessonQuizPolicy?.successThreshold ?? 70}%.
                </Text>
              </Stack>
              {lesson ? (
                <Button
                  type="button"
                  leftSection={<IconListCheck size={16} />}
                  onClick={() => setShowQuizManager(true)}
                >
                  Manage Quiz Questions
                </Button>
              ) : (
                <Text size="xs" c="dimmed">Save the lesson first, then use &quot;Manage Quiz Questions&quot;.</Text>
              )}
            </Stack>
          </Paper>
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <NumberInput
              label="Points Reward"
              min={0}
              step={1}
              value={formData.pointsReward}
              onChange={(value) => setFormData({ ...formData, pointsReward: Number(value) || 0 })}
            />
            <NumberInput
              label="XP Reward"
              min={0}
              step={1}
              value={formData.xpReward}
              onChange={(value) => setFormData({ ...formData, xpReward: Number(value) || 0 })}
            />
          </SimpleGrid>
          <Group justify="flex-end">
            <Button type="button" variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} leftSection={<IconDeviceFloppy size={16} />}>
              {lesson ? 'Update Lesson' : 'Create Lesson'}
            </Button>
          </Group>
        </Stack>
      </Box>

      {showQuizManager && lesson && (
        <QuizManagerModal
          courseId={courseId}
          lessonId={lesson.lessonId}
          onClose={() => setShowQuizManager(false)}
          variant="light"
        />
      )}
    </Modal>
  );
}
