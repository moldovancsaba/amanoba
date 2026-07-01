'use client';

/**
 * Admin Live Sessions manager (#24)
 *
 * Minimal CRUD UI for a course's live sessions. Access is enforced server-side
 * by the admin API (admin or assigned editor); this page just drives it.
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Button, Card, Container, Group, Stack, Text, TextInput, Textarea, Title, Select, Badge, Divider,
} from '@mantine/core';

interface LiveSession {
  _id: string;
  title: string;
  description?: string;
  provider: string;
  joinUrl: string;
  scheduledStartAt: string;
  status: string;
}

export default function AdminLiveSessionsPage() {
  const params = useParams();
  const courseId = String(params?.courseId || '');
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState('manual');
  const [joinUrl, setJoinUrl] = useState('');
  const [startAt, setStartAt] = useState('');

  const base = `/api/admin/courses/${encodeURIComponent(courseId)}/live-sessions`;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(base, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => {
    if (courseId) void load();
  }, [courseId, load]);

  const create = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || undefined,
          provider,
          joinUrl,
          scheduledStartAt: new Date(startAt).toISOString(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed to create (${res.status})`);
      }
      setTitle('');
      setDescription('');
      setJoinUrl('');
      setStartAt('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`${base}/${id}`, { method: 'DELETE' });
    await load();
  };

  const cancel = async (id: string) => {
    await fetch(`${base}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    });
    await load();
  };

  const canCreate = title.trim() && /^https?:\/\//i.test(joinUrl) && startAt;

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={1}>Live sessions — {courseId}</Title>
        {error && <Text c="red">{error}</Text>}

        <Card withBorder padding="lg" radius="md">
          <Stack gap="sm">
            <Title order={3} size="h4">Schedule a session</Title>
            <TextInput label="Title" value={title} onChange={(e) => setTitle(e.currentTarget.value)} required />
            <Textarea label="Description" value={description} onChange={(e) => setDescription(e.currentTarget.value)} autosize minRows={2} />
            <Select
              label="Provider"
              value={provider}
              onChange={(v) => setProvider(v || 'manual')}
              data={[
                { value: 'manual', label: 'Manual link' },
                { value: 'zoom', label: 'Zoom' },
                { value: 'meet', label: 'Google Meet' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <TextInput label="Join URL" placeholder="https://…" value={joinUrl} onChange={(e) => setJoinUrl(e.currentTarget.value)} required />
            <TextInput label="Start time" type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.currentTarget.value)} required />
            <Group justify="flex-end">
              <Button onClick={create} loading={saving} disabled={!canCreate}>Create</Button>
            </Group>
          </Stack>
        </Card>

        <Divider />

        <Title order={3} size="h4">Scheduled</Title>
        {loading ? (
          <Text c="dimmed">Loading…</Text>
        ) : sessions.length === 0 ? (
          <Text c="dimmed">No sessions yet.</Text>
        ) : (
          <Stack gap="xs">
            {sessions.map((s) => (
              <Card key={s._id} withBorder padding="sm" radius="md">
                <Group justify="space-between" wrap="nowrap">
                  <div style={{ minWidth: 0 }}>
                    <Group gap="xs">
                      <Text fw={600} truncate>{s.title}</Text>
                      <Badge size="sm" variant="light" color={s.status === 'cancelled' ? 'gray' : s.status === 'live' ? 'green' : 'amanoba'}>{s.status}</Badge>
                    </Group>
                    <Text size="sm" c="dimmed">{new Date(s.scheduledStartAt).toLocaleString()} · {s.provider}</Text>
                    <Text size="xs" c="dimmed" truncate>{s.joinUrl}</Text>
                  </div>
                  <Group gap="xs">
                    {s.status !== 'cancelled' && (
                      <Button size="xs" variant="light" color="orange" onClick={() => cancel(s._id)}>Cancel</Button>
                    )}
                    <Button size="xs" variant="light" color="red" onClick={() => remove(s._id)}>Delete</Button>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
