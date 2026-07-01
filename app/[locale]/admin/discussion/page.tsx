'use client';

/**
 * Admin discussion moderation (#30) — report queue with bulk hide/delete/dismiss.
 * Access enforced server-side by the admin API.
 */

import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Card, Checkbox, Container, Group, Stack, Text, Title } from '@mantine/core';

interface ReportItem {
  reportId: string;
  postId: string;
  reason: string;
  reporter: string;
  createdAt: string;
  post: { body: string; hiddenByAdmin: boolean; courseId?: string; author: string } | null;
}

export default function AdminDiscussionModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/discussion/reports', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
        setSelected(new Set());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const toggle = (postId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId); else next.add(postId);
      return next;
    });
  };

  const act = async (action: 'hide' | 'unhide' | 'delete') => {
    if (selected.size === 0) return;
    setBusy(true);
    try {
      await fetch('/api/admin/discussion/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, postIds: [...selected] }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const dismiss = async (reportIds: string[]) => {
    setBusy(true);
    try {
      await fetch('/api/admin/discussion/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss', reportIds }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={1}>Discussion moderation</Title>

        <Group>
          <Button color="orange" variant="light" disabled={selected.size === 0 || busy} onClick={() => act('hide')}>Hide selected</Button>
          <Button variant="light" disabled={selected.size === 0 || busy} onClick={() => act('unhide')}>Unhide</Button>
          <Button color="red" variant="light" disabled={selected.size === 0 || busy} onClick={() => act('delete')}>Delete</Button>
          <Text size="sm" c="dimmed">{selected.size} selected</Text>
        </Group>

        {loading ? (
          <Text c="dimmed">Loading…</Text>
        ) : reports.length === 0 ? (
          <Text c="dimmed">No open reports. 🎉</Text>
        ) : (
          <Stack gap="xs">
            {reports.map((r) => (
              <Card key={r.reportId} withBorder padding="sm" radius="md">
                <Group align="flex-start" wrap="nowrap" gap="sm">
                  <Checkbox checked={selected.has(r.postId)} onChange={() => toggle(r.postId)} mt={4} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Group gap="xs">
                      <Text fw={600}>{r.post?.author || 'Anonymous'}</Text>
                      {r.post?.hiddenByAdmin && <Badge size="xs" color="gray">hidden</Badge>}
                      {r.post?.courseId && <Badge size="xs" variant="light">{r.post.courseId}</Badge>}
                    </Group>
                    <Text size="sm" lineClamp={3}>{r.post?.body || '(post deleted)'}</Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      Reported by {r.reporter}{r.reason ? ` — "${r.reason}"` : ''} · {new Date(r.createdAt).toLocaleString()}
                    </Text>
                  </div>
                  <Button size="xs" variant="subtle" onClick={() => dismiss([r.reportId])} disabled={busy}>Dismiss</Button>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
