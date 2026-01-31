/**
 * Content Vote Widget
 *
 * Renders up/down vote and aggregate for a course, lesson, or question.
 * Auth required to vote; aggregate visible to all.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

type VoteTargetType = 'course' | 'lesson' | 'question';

interface ContentVoteWidgetProps {
  targetType: VoteTargetType;
  targetId: string;
  playerId: string | null;
  label?: string;
  className?: string;
}

export default function ContentVoteWidget({
  targetType,
  targetId,
  playerId,
  label = 'Was this helpful?',
  className = '',
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
    <div className={`flex flex-wrap items-center gap-2 text-sm text-brand-darkGrey ${className}`}>
      {label && <span>{label}</span>}
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Vote up"
          disabled={!playerId || submitting}
          onClick={() => submitVote(1)}
          className={`p-1 rounded transition-colors ${
            myVote === 1 ? 'text-green-600 bg-green-100' : 'hover:bg-brand-darkGrey/10'
          } ${!playerId ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Vote down"
          disabled={!playerId || submitting}
          onClick={() => submitVote(-1)}
          className={`p-1 rounded transition-colors ${
            myVote === -1 ? 'text-amber-600 bg-amber-100' : 'hover:bg-brand-darkGrey/10'
          } ${!playerId ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
      {aggregate != null && aggregate.count > 0 && (
        <span className="text-brand-darkGrey/80">
          {aggregate.up} ↑ / {aggregate.down} ↓
        </span>
      )}
    </div>
  );
}
