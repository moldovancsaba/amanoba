/**
 * Admin Courses Page
 *
 * What: Course management interface for admins
 * Why: Allows admins to view, create, edit, import, and manage courses
 */

'use client';

import { useState, useEffect, useCallback, type FormEvent } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  FileButton,
  Group,
  Loader,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import { AdminPageHeader } from '@/app/components/patterns/AdminPageHeader';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconArrowsSort,
  IconAward,
  IconBook,
  IconCalendar,
  IconChevronDown,
  IconChevronRight,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconFileText,
  IconFolder,
  IconFilter,
  IconPlus,
  IconSearch,
  IconStar,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';
import { useDebounce } from '@/app/lib/hooks/useDebounce';
import { DataToolbar } from '@/app/components/patterns/DataToolbar';

interface Course {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  language: string;
  thumbnail?: string;
  isActive: boolean;
  requiresPremium: boolean;
  durationDays: number;
  createdAt: string;
  updatedAt: string;
  ccsId?: string;
  enrollmentCount?: number;
  likeCount?: number;
  likeScore?: number;
  pointsConfig: {
    completionPoints: number;
    lessonPoints: number;
  };
  xpConfig: {
    completionXP: number;
    lessonXP: number;
  };
}

interface CCSItem {
  _id: string;
  ccsId: string;
  name?: string;
  idea?: string;
  outline?: string;
  relatedDocuments?: Array<{ type: string; url?: string; title?: string }>;
}

type ViewMode = 'ccs' | 'flat';
type StatusFilter = 'all' | 'active' | 'inactive';
type SortBy =
  | 'created_desc'
  | 'created_asc'
  | 'updated_desc'
  | 'updated_asc'
  | 'enrolled_desc'
  | 'enrolled_asc'
  | 'liked_desc'
  | 'liked_asc'
  | 'alpha_asc'
  | 'alpha_desc';

function CreateCourseFamilyForm({ onCreated }: { onCreated: () => void }) {
  const [ccsId, setCcsId] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = ccsId.trim().toUpperCase().replace(/\s+/g, '_');
    if (!id || !/^[A-Z0-9_]+$/.test(id)) {
      setErr('Use only letters, numbers, underscores (e.g. PRODUCTIVITY_2026).');
      return;
    }

    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/ccs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ccsId: id, name: name.trim() || id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || 'Create failed.');
        return;
      }
      setCcsId('');
      setName('');
      notifications.show({ color: 'green', title: 'Course family created', message: `${id} is ready for language variants.` });
      onCreated();
    } catch {
      setErr('Request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Group align="flex-end">
        <TextInput
          label="Course family ID"
          placeholder="PRODUCTIVITY_2026"
          value={ccsId}
          onChange={(event) => setCcsId(event.currentTarget.value)}
        />
        <TextInput
          label="Name"
          placeholder="Optional"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <Button type="submit" loading={submitting} leftSection={<IconPlus size={16} />}>
          Create course family
        </Button>
      </Group>
      {err && <Text mt="xs" size="sm" c="red">{err}</Text>}
    </Box>
  );
}

export default function AdminCoursesPage() {
  const locale = useLocale();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('ccs');
  const [importing, setImporting] = useState(false);
  const [importQuestionMode, setImportQuestionMode] = useState<'add' | 'overwrite'>('add');
  const [courses, setCourses] = useState<Course[]>([]);
  const [ccsList, setCcsList] = useState<CCSItem[]>([]);
  const [ccsCourses, setCcsCourses] = useState<Record<string, Course[]>>({});
  const [expandedCcs, setExpandedCcs] = useState<Set<string>>(new Set());
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('created_desc');
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [ccsError, setCcsError] = useState<string | null>(null);
  const [editingCcsId, setEditingCcsId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; idea: string; outline: string }>({ name: '', idea: '', outline: '' });
  const [deletingCcsId, setDeletingCcsId] = useState<string | null>(null);

  const fetchCCS = useCallback(async () => {
    try {
      setLoading(true);
      setCcsError(null);
      const res = await fetch('/api/admin/ccs');
      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = res.status === 401 || res.status === 403
          ? 'Not authorised. Log in as admin.'
          : 'Could not load course families. Ensure the latest version is deployed.';
        setCcsError(msg);
        setCcsList([]);
        setCcsCourses({});
        return;
      }
      if (data.ccs?.length) {
        setCcsList(data.ccs);
        const map: Record<string, Course[]> = {};
        for (const ccs of data.ccs) {
          const courseResponse = await fetch(`/api/admin/ccs/${encodeURIComponent(ccs.ccsId)}`);
          const courseData = await courseResponse.json();
          if (courseData.success) map[ccs.ccsId] = courseData.courses || [];
        }
        setCcsCourses(map);
      } else {
        setCcsList([]);
        setCcsCourses({});
      }
    } catch (error) {
      console.error('Failed to fetch CCS', error);
      setCcsError('Could not load course families. Check the console.');
      setCcsList([]);
      setCcsCourses({});
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (sortBy) params.append('sort', sortBy);

      const response = await fetch(`/api/admin/courses?${params.toString()}`);
      const data = await response.json();
      if (data.success) setCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [debouncedSearch, statusFilter, sortBy]);

  useEffect(() => {
    setInitialLoading(true);
    if (viewMode === 'ccs') {
      void fetchCCS();
    } else {
      void fetchCourses();
    }
  }, [viewMode, fetchCCS, fetchCourses]);

  const refreshCurrentView = () => {
    if (viewMode === 'ccs') void fetchCCS();
    else void fetchCourses();
  };

  const handleImportCourse = async (file: File | null) => {
    if (!file) return;
    const questionModeText =
      importQuestionMode === 'overwrite'
        ? 'Imported lessons will replace existing questions for matching lessons.'
        : 'Only missing questions will be added for matching lessons.';

    modals.openConfirmModal({
      title: 'Import course package',
      children: (
        <Stack gap="xs">
          <Text size="sm">Import package to create a new course or update an existing one by `courseId`.</Text>
          <Text size="sm" c="dimmed">{questionModeText}</Text>
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
            body: JSON.stringify({ courseData, overwrite: true, questionImportMode: importQuestionMode }),
          });
          const data = await response.json();
          if (data.success && data.course?.courseId) {
            notifications.show({ color: 'green', title: 'Course imported', message: 'Opening the imported course.' });
            router.push(`/${locale}/admin/courses/${data.course.courseId}`);
            return;
          }
          notifications.show({ color: 'red', title: 'Import failed', message: [data.error || 'Import failed', data.details].filter(Boolean).join(' ') });
        } catch (error) {
          console.error('Import failed', error);
          notifications.show({ color: 'red', title: 'Import failed', message: 'Use a valid .json course package.' });
        } finally {
          setImporting(false);
        }
      },
    });
  };

  const toggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        notifications.show({ color: 'green', title: 'Course status updated', message: `Course is now ${currentStatus ? 'draft' : 'active'}.` });
        refreshCurrentView();
      } else {
        const data = await response.json().catch(() => ({}));
        notifications.show({ color: 'red', title: 'Status update failed', message: data.error || 'Failed to update course.' });
      }
    } catch (error) {
      console.error('Failed to toggle course status:', error);
      notifications.show({ color: 'red', title: 'Status update failed', message: 'Failed to update course.' });
    }
  };

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    modals.openConfirmModal({
      title: `Delete ${courseName}?`,
      children: (
        <Text size="sm">
          This permanently deletes lessons, student progress, quiz questions, and assessment results for this course.
        </Text>
      ),
      labels: { confirm: 'Delete course', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setDeletingCourseId(courseId);
          const response = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' });
          if (response.ok) {
            notifications.show({ color: 'green', title: 'Course deleted', message: `${courseName} was removed.` });
            refreshCurrentView();
          } else {
            const data = await response.json();
            notifications.show({ color: 'red', title: 'Delete failed', message: data.error || 'Failed to delete course.' });
          }
        } catch (error) {
          console.error('Failed to delete course:', error);
          notifications.show({ color: 'red', title: 'Delete failed', message: 'Failed to delete course.' });
        } finally {
          setDeletingCourseId(null);
        }
      },
    });
  };

  const toggleCcs = (id: string) => {
    setExpandedCcs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startEditCcs = (ccs: CCSItem) => {
    setEditingCcsId(ccs.ccsId);
    setEditForm({ name: ccs.name || ccs.ccsId, idea: ccs.idea || '', outline: ccs.outline || '' });
  };

  const saveEditCcs = async () => {
    if (!editingCcsId) return;
    try {
      const res = await fetch(`/api/admin/ccs/${encodeURIComponent(editingCcsId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          idea: editForm.idea.trim() || undefined,
          outline: editForm.outline.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        notifications.show({ color: 'red', title: 'Update failed', message: data.error || 'Course family update failed.' });
        return;
      }
      setEditingCcsId(null);
      notifications.show({ color: 'green', title: 'Course family updated', message: `${editingCcsId} was saved.` });
      fetchCCS();
    } catch (error) {
      console.error(error);
      notifications.show({ color: 'red', title: 'Update failed', message: 'Course family update failed.' });
    }
  };

  const deleteCcs = async (ccsId: string, variantCount: number) => {
    if (variantCount > 0) {
      notifications.show({ color: 'yellow', title: 'Course family has variants', message: `${variantCount} course(s) are still linked. Unlink or remove them first.` });
      return;
    }

    modals.openConfirmModal({
      title: 'Delete course family?',
      children: <Text size="sm">This removes the course family record and cannot be undone.</Text>,
      labels: { confirm: 'Delete family', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        setDeletingCcsId(ccsId);
        try {
          const res = await fetch(`/api/admin/ccs/${encodeURIComponent(ccsId)}`, { method: 'DELETE' });
          const data = await res.json();
          if (!res.ok) {
            notifications.show({ color: 'red', title: 'Delete failed', message: data.error || 'Delete failed.' });
            return;
          }
          setEditingCcsId(null);
          notifications.show({ color: 'green', title: 'Course family deleted', message: `${ccsId} was removed.` });
          fetchCCS();
        } catch (error) {
          console.error(error);
          notifications.show({ color: 'red', title: 'Delete failed', message: 'Delete failed.' });
        } finally {
          setDeletingCcsId(null);
        }
      },
    });
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <AdminPageHeader
          title="Course Management"
          description="Create and manage flexible learning courses."
          secondaryActions={
            <>
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
              <FileButton onChange={handleImportCourse} accept=".json">
                {(props) => (
                  <Button {...props} loading={importing} leftSection={<IconUpload size={16} />}>
                    Import
                  </Button>
                )}
              </FileButton>
              <Button component={Link} href={`/${locale}/admin/courses/new`} leftSection={<IconPlus size={16} />}>
                Create Course
              </Button>
            </>
          }
        />

        <Group>
          <Button
            type="button"
            variant={viewMode === 'ccs' ? 'filled' : 'default'}
            leftSection={<IconFolder size={16} />}
            onClick={() => setViewMode('ccs')}
          >
            By course family (CCS)
          </Button>
          <Button
            type="button"
            variant={viewMode === 'flat' ? 'filled' : 'default'}
            leftSection={<IconBook size={16} />}
            onClick={() => setViewMode('flat')}
          >
            All courses
          </Button>
        </Group>

        {viewMode === 'flat' && (
          <DataToolbar title="Filter courses">
            <TextInput
              label="Search"
              placeholder="Search courses..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              style={{ flex: 1, minWidth: 200 }}
            />
            <Select
              label="Status"
              leftSection={<IconFilter size={16} />}
              value={statusFilter}
              allowDeselect={false}
              data={[
                { value: 'all', label: 'All Courses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              onChange={(value) => setStatusFilter((value || 'all') as StatusFilter)}
              w={200}
            />
            <Select
              label="Sort"
              leftSection={<IconArrowsSort size={16} />}
              value={sortBy}
              allowDeselect={false}
              data={[
                { value: 'created_desc', label: 'Newest created' },
                { value: 'created_asc', label: 'Oldest created' },
                { value: 'updated_desc', label: 'Newest updated' },
                { value: 'updated_asc', label: 'Oldest updated' },
                { value: 'enrolled_desc', label: 'Most enrolled' },
                { value: 'enrolled_asc', label: 'Least enrolled' },
                { value: 'liked_desc', label: 'Most liked' },
                { value: 'liked_asc', label: 'Least liked' },
                { value: 'alpha_asc', label: 'A to Z' },
                { value: 'alpha_desc', label: 'Z to A' },
              ]}
              onChange={(value) => setSortBy((value || 'created_desc') as SortBy)}
              w={220}
            />
          </DataToolbar>
        )}

        {loading && !initialLoading && (
          <Alert color="gray" icon={<Loader size={16} />}>Refreshing courses...</Alert>
        )}

        {viewMode === 'ccs' ? (
          <CourseFamiliesView
            locale={locale}
            loading={initialLoading}
            ccsList={ccsList}
            ccsCourses={ccsCourses}
            ccsError={ccsError}
            expandedCcs={expandedCcs}
            editingCcsId={editingCcsId}
            editForm={editForm}
            deletingCcsId={deletingCcsId}
            onToggle={toggleCcs}
            onSwitchFlat={() => setViewMode('flat')}
            onCreated={fetchCCS}
            onStartEdit={startEditCcs}
            onEditChange={setEditForm}
            onSaveEdit={saveEditCcs}
            onCancelEdit={() => setEditingCcsId(null)}
            onDelete={deleteCcs}
          />
        ) : (
          <FlatCoursesView
            locale={locale}
            loading={initialLoading}
            courses={courses}
            deletingCourseId={deletingCourseId}
            onToggleStatus={toggleCourseStatus}
            onDelete={handleDeleteCourse}
          />
        )}
      </Stack>
    </Container>
  );
}

function CourseFamiliesView({
  locale,
  loading,
  ccsList,
  ccsCourses,
  ccsError,
  expandedCcs,
  editingCcsId,
  editForm,
  deletingCcsId,
  onToggle,
  onSwitchFlat,
  onCreated,
  onStartEdit,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: {
  locale: string;
  loading: boolean;
  ccsList: CCSItem[];
  ccsCourses: Record<string, Course[]>;
  ccsError: string | null;
  expandedCcs: Set<string>;
  editingCcsId: string | null;
  editForm: { name: string; idea: string; outline: string };
  deletingCcsId: string | null;
  onToggle: (ccsId: string) => void;
  onSwitchFlat: () => void;
  onCreated: () => void;
  onStartEdit: (ccs: CCSItem) => void;
  onEditChange: (value: { name: string; idea: string; outline: string }) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (ccsId: string, variantCount: number) => void;
}) {
  if (loading) {
    return (
      <Center py="xl">
        <Group>
          <Loader color="amanobaYellow" />
          <Text c="white">Loading course families...</Text>
        </Group>
      </Center>
    );
  }

  if (ccsList.length === 0) {
    return (
      <Card padding="xl">
        <Stack align="center" gap="md">
          <ThemeIcon size={64} color="amanobaYellow" variant="light"><IconFolder size={34} /></ThemeIcon>
          {ccsError ? (
            <Alert color="yellow" icon={<IconAlertTriangle size={16} />}>{ccsError}</Alert>
          ) : (
            <>
              <Title order={2} size="h3">No course families yet</Title>
              <Text c="dimmed" ta="center">
                Course families group language variants, for example PRODUCTIVITY_2026_HU and PRODUCTIVITY_2026_EN.
              </Text>
            </>
          )}
          <Group justify="center">
            <Button type="button" variant="default" leftSection={<IconBook size={16} />} onClick={onSwitchFlat}>
              View all courses
            </Button>
            <CreateCourseFamilyForm onCreated={onCreated} />
          </Group>
        </Stack>
      </Card>
    );
  }

  return (
    <Stack gap="sm">
      <Card padding="md">
        <CreateCourseFamilyForm onCreated={onCreated} />
      </Card>
      {ccsList.map((ccs) => {
        const variants = ccsCourses[ccs.ccsId] || [];
        const isExpanded = expandedCcs.has(ccs.ccsId);
        return (
          <Card key={ccs.ccsId} padding={0}>
            <Button
              type="button"
              variant="subtle"
              fullWidth
              justify="space-between"
              rightSection={<Badge variant="light">{variants.length} variant{variants.length === 1 ? '' : 's'}</Badge>}
              leftSection={isExpanded ? <IconChevronDown size={18} /> : <IconChevronRight size={18} />}
              onClick={() => onToggle(ccs.ccsId)}
            >
              <Group gap="xs">
                <IconFileText size={18} />
                <Text fw={700}>{ccs.name || ccs.ccsId}</Text>
                <Text size="sm" c="dimmed">({ccs.ccsId})</Text>
              </Group>
            </Button>
            {isExpanded && (
              <Stack gap="md" p="md">
                <Group gap="xs">
                  <Button type="button" size="xs" variant="default" leftSection={<IconEdit size={14} />} onClick={() => onStartEdit(ccs)}>
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    color="red"
                    variant="subtle"
                    loading={deletingCcsId === ccs.ccsId}
                    leftSection={<IconTrash size={14} />}
                    onClick={() => onDelete(ccs.ccsId, variants.length)}
                  >
                    Delete
                  </Button>
                </Group>

                {editingCcsId === ccs.ccsId && (
                  <Paper withBorder radius="md" p="md">
                    <Stack gap="md">
                      <TextInput
                        label="Name"
                        value={editForm.name}
                        onChange={(event) => onEditChange({ ...editForm, name: event.currentTarget.value })}
                        placeholder="Display name"
                      />
                      <Textarea
                        label="Idea"
                        value={editForm.idea}
                        onChange={(event) => onEditChange({ ...editForm, idea: event.currentTarget.value })}
                        placeholder="Course idea / markdown"
                        autosize
                        minRows={2}
                      />
                      <Textarea
                        label="Outline"
                        value={editForm.outline}
                        onChange={(event) => onEditChange({ ...editForm, outline: event.currentTarget.value })}
                        placeholder="Course outline / markdown"
                        autosize
                        minRows={3}
                      />
                      <Group>
                        <Button type="button" onClick={onSaveEdit}>Save</Button>
                        <Button type="button" variant="default" onClick={onCancelEdit}>Cancel</Button>
                      </Group>
                    </Stack>
                  </Paper>
                )}

                <Group justify="space-between" align="center">
                  <Text size="sm" c="dimmed">Language variants</Text>
                  <Button
                    component={Link}
                    href={`/${locale}/admin/courses/new?ccsId=${encodeURIComponent(ccs.ccsId)}`}
                    size="xs"
                    leftSection={<IconPlus size={14} />}
                  >
                    Create language variant
                  </Button>
                </Group>
                <Group gap="xs">
                  {variants.length === 0 ? (
                    <Text size="sm" c="dimmed">No courses linked to this CCS yet.</Text>
                  ) : (
                    variants.map((course) => (
                      <Button
                        key={course.courseId}
                        component={Link}
                        href={`/${locale}/admin/courses/${course.courseId}`}
                        variant="default"
                        size="xs"
                        leftSection={<IconEdit size={14} />}
                      >
                        {course.name || course.courseId} ({course.language})
                      </Button>
                    ))
                  )}
                </Group>
                {ccs.relatedDocuments && ccs.relatedDocuments.length > 0 && (
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed">Related documents</Text>
                    {ccs.relatedDocuments.map((doc, index) => (
                      <Button
                        key={`${doc.type}-${index}`}
                        component="a"
                        href={doc.url || '#'}
                        target={doc.url ? '_blank' : undefined}
                        rel={doc.url ? 'noopener noreferrer' : undefined}
                        variant="subtle"
                        size="xs"
                        leftSection={<IconFileText size={14} />}
                        disabled={!doc.url}
                      >
                        {doc.title || doc.type}
                      </Button>
                    ))}
                  </Stack>
                )}
              </Stack>
            )}
          </Card>
        );
      })}
    </Stack>
  );
}

function FlatCoursesView({
  locale,
  loading,
  courses,
  deletingCourseId,
  onToggleStatus,
  onDelete,
}: {
  locale: string;
  loading: boolean;
  courses: Course[];
  deletingCourseId: string | null;
  onToggleStatus: (courseId: string, currentStatus: boolean) => void;
  onDelete: (courseId: string, courseName: string) => void;
}) {
  if (loading) {
    return (
      <Center py="xl">
        <Group>
          <Loader color="amanobaYellow" />
          <Text c="white">Loading courses...</Text>
        </Group>
      </Center>
    );
  }

  if (courses.length === 0) {
    return (
      <Card padding="xl">
        <Stack align="center" gap="md">
          <ThemeIcon size={64} color="amanobaYellow" variant="light"><IconBook size={34} /></ThemeIcon>
          <Title order={2} size="h3">No courses found</Title>
          <Text c="dimmed">Get started by creating your first course.</Text>
          <Button component={Link} href={`/${locale}/admin/courses/new`} leftSection={<IconPlus size={16} />}>
            Create First Course
          </Button>
        </Stack>
      </Card>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
      {courses.map((course) => (
        <Card key={course._id} padding="lg">
          <Stack gap="md" h="100%">
            {course.thumbnail && (
              <Paper withBorder radius="md" pos="relative" h={160} className="overflow-hidden">
                <Image
                  src={course.thumbnail}
                  alt={course.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 20rem"
                />
              </Paper>
            )}
            <Stack gap="xs" flex={1}>
              <Group justify="space-between" align="flex-start">
                <Title order={3} size="h4">{course.name}</Title>
                <Badge color={course.isActive ? 'green' : 'gray'}>{course.isActive ? 'Active' : 'Draft'}</Badge>
              </Group>
              <Text size="sm" c="dimmed" lineClamp={2}>{course.description}</Text>
            </Stack>
            <Stack gap="xs">
              <Group gap="xs">
                <IconCalendar size={16} />
                <Text size="sm">{course.durationDays} days</Text>
              </Group>
              <Group gap="xs">
                <IconAward size={16} />
                <Text size="sm">{course.pointsConfig.completionPoints} points</Text>
              </Group>
              {course.requiresPremium && (
                <Badge variant="light" color="amanobaYellow" leftSection={<IconStar size={12} />}>Premium</Badge>
              )}
            </Stack>
            <Group gap="xs" justify="space-between">
              <Button component={Link} href={`/${locale}/admin/courses/${course.courseId}`} leftSection={<IconEdit size={14} />} flex={1}>
                Edit
              </Button>
              <Tooltip label={course.isActive ? 'Deactivate' : 'Activate'}>
                <ActionIcon
                  variant="default"
                  size="lg"
                  aria-label={course.isActive ? 'Deactivate course' : 'Activate course'}
                  disabled={deletingCourseId === course.courseId}
                  onClick={() => onToggleStatus(course.courseId, course.isActive)}
                >
                  {course.isActive ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete course">
                <ActionIcon
                  color="red"
                  variant="filled"
                  size="lg"
                  aria-label="Delete course"
                  loading={deletingCourseId === course.courseId}
                  onClick={() => onDelete(course.courseId, course.name)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
