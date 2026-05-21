/**
 * Content Vote Widget
 *
 * Renders up/down vote and aggregate for a course, lesson, or question.
 * Auth required to vote; aggregate visible to all.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ActionIcon, Badge, Group, Text, Tooltip, type MantineSpacing } from '@mantine/core';
import { IconThumbDown, IconThumbUp } from '@tabler/icons-react';

type VoteTargetType = 'course' | 'lesson' | 'question' | 'discussion_post';

interface ContentVoteWidgetProps {
  targetType: VoteTargetType;
  targetId: string;
  playerId: string | null;
  label?: string;
  mt?: MantineSpacing;
}

export default function ContentVoteWidget({
  targetType,
  targetId,
  playerId,
  label = 'Was this helpful?',
  mt,
}: ContentVoteWidgetProps) {
  const [aggregate, setAggregate] = useState<{ sum: number; up: number; down: number; count: number } | null>(null);
  const [myVote, setMyVote] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchAggregate = useCallback(async () => {
    if (!targetId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ targetType, targetId });
      if (playerId) params.set('playerId', playerId);
      const res = await fetch(`/api/votes?${params}`);
      const data = await res.json();
      if (data.success) {
        setAggregate(data.aggregate);
        setMyVote(data.myVote ?? null);
      }
    } catch {
      setAggregate(null);
      setMyVote(null);
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId, playerId]);

  useEffect(() => {
    fetchAggregate();
  }, [fetchAggregate]);

  const submitVote = async (value: 1 | -1) => {
    if (!playerId || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId, value }),
      });
      const data = await res.json();
      if (data.success) {
        setMyVote(value);
        await fetchAggregate();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && aggregate == null) return null;

  return (
    <Group gap="xs" mt={mt} wrap="wrap">
      {label ? <Text size="sm" c="dimmed">{label}</Text> : null}
      <Group gap={4}>
        <Tooltip label={playerId ? 'Vote up' : 'Sign in to vote'}>
          <ActionIcon
            aria-label="Vote up"
            disabled={!playerId || submitting}
            onClick={() => submitVote(1)}
            variant={myVote === 1 ? 'filled' : 'subtle'}
            color={myVote === 1 ? 'green' : 'gray'}
            loading={submitting && myVote !== -1}
            size="sm"
          >
            <IconThumbUp size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label={playerId ? 'Vote down' : 'Sign in to vote'}>
          <ActionIcon
            aria-label="Vote down"
            disabled={!playerId || submitting}
            onClick={() => submitVote(-1)}
            variant={myVote === -1 ? 'filled' : 'subtle'}
            color={myVote === -1 ? 'yellow' : 'gray'}
            loading={submitting && myVote !== 1}
            size="sm"
          >
            <IconThumbDown size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
      {aggregate != null && aggregate.count > 0 && (
        <Badge color="gray" variant="light">
          {aggregate.up} ↑ / {aggregate.down} ↓
        </Badge>
      )}
    </Group>
  );
}
