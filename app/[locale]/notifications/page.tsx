'use client';

/**
 * Notifications page (#28) — lists the signed-in learner's notifications.
 */

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { LocaleLink } from '@/components/LocaleLink';
import { Badge, Button, Card, Container, Group, Stack, Text, Title } from '@mantine/core';

interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { status } = useSession();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setItems(data.notifications || []);
        setUnread(data.unreadCount || 0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') void load();
    else if (status === 'unauthenticated') setLoading(false);
  }, [status, load]);

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    });
    await load();
  };

  if (status === 'unauthenticated') {
    return (
      <Container size="sm" py="xl">
        <Text>Please <LocaleLink href="/auth/signin">sign in</LocaleLink> to see your notifications.</Text>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Notifications {unread > 0 && <Badge color="amanoba">{unread}</Badge>}</Title>
          {unread > 0 && <Button variant="light" size="xs" onClick={markAllRead}>Mark all read</Button>}
        </Group>

        {loading ? (
          <Text c="dimmed">Loading…</Text>
        ) : items.length === 0 ? (
          <Text c="dimmed">No notifications yet.</Text>
        ) : (
          <Stack gap="xs">
            {items.map((n) => {
              const inner = (
                <Card key={n._id} withBorder padding="sm" radius="md" bg={n.isRead ? undefined : 'var(--mantine-color-amanoba-light)'}>
                  <Group gap="xs" justify="space-between" wrap="nowrap">
                    <div style={{ minWidth: 0 }}>
                      <Text fw={n.isRead ? 500 : 700} truncate>{n.title}</Text>
                      {n.body && <Text size="sm" c="dimmed" lineClamp={2}>{n.body}</Text>}
                      <Text size="xs" c="dimmed">{new Date(n.createdAt).toLocaleString()}</Text>
                    </div>
                    {!n.isRead && <Badge size="xs" color="amanoba">new</Badge>}
                  </Group>
                </Card>
              );
              return n.link ? (
                <LocaleLink key={n._id} href={n.link} style={{ textDecoration: 'none', color: 'inherit' }}>{inner}</LocaleLink>
              ) : inner;
            })}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
