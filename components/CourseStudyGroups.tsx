/**
 * Course Study Groups component
 *
 * What: Lists study groups for a course; create, join, leave. Auth required to create/join/leave.
 * Why: Community Phase 2 — study groups per TASKLIST.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Collapse,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconLogin2, IconLogout2, IconPlus, IconUsers } from '@tabler/icons-react';

interface StudyGroupItem {
  _id: string;
  name: string;
  createdByDisplayName: string;
  memberCount: number;
  isMember?: boolean;
  createdAt: string;
}

interface CourseStudyGroupsProps {
  courseId: string;
  title?: string;
  createLabel?: string;
  createPlaceholder?: string;
  joinLabel?: string;
  leaveLabel?: string;
  membersLabel?: string;
  signInToJoin?: string;
  emptyMessage?: string;
  loadingText?: string;
}

export default function CourseStudyGroups({
  courseId,
  title = 'Study groups',
  createLabel = 'Create group',
  createPlaceholder = 'Group name',
  joinLabel = 'Join',
  leaveLabel = 'Leave',
  membersLabel = 'members',
  signInToJoin = 'Sign in to create or join a study group.',
  emptyMessage = 'No study groups yet. Create one to learn with others.',
  loadingText = 'Loading...',
}: CourseStudyGroupsProps) {
  const { data: session } = useSession();
  const [groups, setGroups] = useState<StudyGroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [joining, setJoining] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/study-groups`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.groups)) {
        setGroups(data.groups);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void fetchGroups();
  }, [fetchGroups]);

  const handleCreate = async () => {
    if (!session?.user || !newName.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/study-groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewName('');
        setShowCreate(false);
        await fetchGroups();
      } else {
        notifications.show({
          color: 'red',
          title: 'Create failed',
          message: data.error || 'Failed to create group',
        });
      }
    } catch (e) {
      console.error(e);
      notifications.show({
        color: 'red',
        title: 'Create failed',
        message: 'Failed to create group',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (groupId: string) => {
    if (!session?.user) return;
    setJoining(groupId);
    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/study-groups/${groupId}/join`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchGroups();
      } else {
        notifications.show({
          color: 'red',
          title: 'Join failed',
          message: data.error || 'Failed to join',
        });
      }
    } catch (e) {
      console.error(e);
      notifications.show({
        color: 'red',
        title: 'Join failed',
        message: 'Failed to join',
      });
    } finally {
      setJoining(null);
    }
  };

  const handleLeave = async (groupId: string) => {
    if (!session?.user) return;
    setLeaving(groupId);
    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/study-groups/${groupId}/leave`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchGroups();
      } else {
        notifications.show({
          color: 'red',
          title: 'Leave failed',
          message: data.error || 'Failed to leave',
        });
      }
    } catch (e) {
      console.error(e);
      notifications.show({
        color: 'red',
        title: 'Leave failed',
        message: 'Failed to leave',
      });
    } finally {
      setLeaving(null);
    }
  };

  const confirmLeave = (groupId: string, groupName: string) => {
    modals.openConfirmModal({
      title: 'Leave study group',
      children: <Text size="sm">Leave {groupName}?</Text>,
      labels: { confirm: leaveLabel, cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => void handleLeave(groupId),
    });
  };

  return (
    <Card padding="xl" radius="md" withBorder>
      <Stack gap="lg">
        <Group gap="sm">
          <ThemeIcon color="amanoba" variant="light" radius="md">
            <IconUsers size={20} />
          </ThemeIcon>
          <Title order={2} size="h3">{title}</Title>
        </Group>

        {session?.user && (
          <Stack gap="sm">
            {!showCreate ? (
              <Button
                onClick={() => setShowCreate(true)}
                color="amanoba"
                leftSection={<IconPlus size={16} />}
              >
                {createLabel}
              </Button>
            ) : null}
            <Collapse in={showCreate}>
              <Stack gap="sm">
                <TextInput
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  label={createPlaceholder}
                  maxLength={120}
                />
                <Group gap="xs">
                  <Button
                    onClick={handleCreate}
                    disabled={!newName.trim() || submitting}
                    loading={submitting}
                    color="amanoba"
                  >
                    {submitting ? 'Creating…' : 'Create'}
                  </Button>
                  <Button
                    onClick={() => { setShowCreate(false); setNewName(''); }}
                    variant="default"
                  >
                    Cancel
                  </Button>
                </Group>
              </Stack>
            </Collapse>
          </Stack>
        )}

        {!session?.user && <Alert color="gray" radius="md">{signInToJoin}</Alert>}

        {loading ? (
          <Stack gap="sm">
            <Skeleton height={72} radius="md" />
            <Skeleton height={72} radius="md" />
            <Text c="dimmed" size="sm">{loadingText}</Text>
          </Stack>
        ) : groups.length === 0 ? (
          <Text c="dimmed">{emptyMessage}</Text>
        ) : (
          <Stack gap="sm">
            {groups.map((g) => (
              <Paper key={g._id} p="md" radius="md" withBorder>
                <Group justify="space-between" align="center" gap="md">
                  <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                    <Group gap="xs">
                      <Text fw={700}>{g.name}</Text>
                      {g.isMember ? <Badge color="green" variant="light">Joined</Badge> : null}
                    </Group>
                    <Text size="sm" c="dimmed">
                      {g.memberCount} {membersLabel} · by {g.createdByDisplayName}
                    </Text>
                  </Stack>
                  {session?.user && (
                    (g.isMember === true) ? (
                      <Button
                        onClick={() => confirmLeave(g._id, g.name)}
                        disabled={leaving === g._id}
                        loading={leaving === g._id}
                        variant="outline"
                        color="red"
                        leftSection={<IconLogout2 size={16} />}
                      >
                        {leaving === g._id ? 'Leaving…' : leaveLabel}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleJoin(g._id)}
                        disabled={joining === g._id}
                        loading={joining === g._id}
                        color="amanoba"
                        leftSection={<IconLogin2 size={16} />}
                      >
                        {joining === g._id ? 'Joining…' : joinLabel}
                      </Button>
                    )
                  )}
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
