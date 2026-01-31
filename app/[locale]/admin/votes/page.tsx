/**
 * Admin Vote Aggregates Page
 *
 * Lists vote aggregates (course/lesson/question) for admin review.
 */

'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

interface AggregateRow {
  targetType: string;
  targetId: string;
  sum: number;
  up: number;
  down: number;
  count: number;
}

export default function AdminVotesPage() {
  const [aggregates, setAggregates] = useState<AggregateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetType, setTargetType] = useState<string>('');

  useEffect(() => {
    setLoading(true);
    const params = targetType ? `?targetType=${encodeURIComponent(targetType)}` : '';
    fetch(`/api/admin/votes/aggregates${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.aggregates)) {
          setAggregates(data.aggregates);
        } else {
          setAggregates([]);
        }
      })
      .catch(() => setAggregates([]))
      .finally(() => setLoading(false));
  }, [targetType]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-black mb-4">Vote aggregates</h1>
      <p className="text-brand-darkGrey mb-4">
        Course, lesson, and question votes (up/down). Vote reset on lesson update when content changes.
      </p>
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm font-medium text-brand-black">Filter by type</label>
        <select
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
          className="border border-brand-darkGrey/30 rounded px-3 py-1.5 text-sm"
        >
          <option value="">All</option>
          <option value="course">Course</option>
          <option value="lesson">Lesson</option>
          <option value="question">Question</option>
        </select>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-brand-darkGrey">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading…
        </div>
      ) : aggregates.length === 0 ? (
        <p className="text-brand-darkGrey">No vote data yet.</p>
      ) : (
        <div className="overflow-x-auto border border-brand-darkGrey/20 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-brand-darkGrey/10">
              <tr>
                <th className="text-left p-3 font-semibold text-brand-black">Type</th>
                <th className="text-left p-3 font-semibold text-brand-black">Target ID</th>
                <th className="text-right p-3 font-semibold text-brand-black">Sum</th>
                <th className="text-right p-3 font-semibold text-brand-black">
                  <ThumbsUp className="w-4 h-4 inline mr-1" /> Up
                </th>
                <th className="text-right p-3 font-semibold text-brand-black">
                  <ThumbsDown className="w-4 h-4 inline mr-1" /> Down
                </th>
                <th className="text-right p-3 font-semibold text-brand-black">Count</th>
              </tr>
            </thead>
            <tbody>
              {aggregates.map((row, i) => (
                <tr key={`${row.targetType}-${row.targetId}-${i}`} className="border-t border-brand-darkGrey/10">
                  <td className="p-3 text-brand-black">{row.targetType}</td>
                  <td className="p-3 text-brand-darkGrey font-mono truncate max-w-xs">{row.targetId}</td>
                  <td className="p-3 text-right font-medium">{row.sum}</td>
                  <td className="p-3 text-right text-green-600">{row.up}</td>
                  <td className="p-3 text-right text-amber-600">{row.down}</td>
                  <td className="p-3 text-right">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
