/**
 * Course Study Groups Component
 *
 * What: List, create, join, leave study groups for a course.
 * Why: Community Phase 2 — learners form study groups.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, LogIn, LogOut } from 'lucide-react';

interface StudyGroupItem {
  _id: string;
  name: string;
  createdByDisplayName: string;
  memberCount: number;
  isMember: boolean;
  capacity?: number;
}

interface CourseStudyGroupsProps {
  courseId: string;
  playerId: string | null;
  strings: {
    title: string;
    createGroup: string;
    groupName: string;
    create: string;
    noGroups: string;
    members: string;
    join: string;
    leave: string;
    signInToJoin: string;
    loading: string;
  };
}

export default function CourseStudyGroups({
  courseId,
  playerId,
  strings,
}: CourseStudyGroupsProps) {
  const [groups, setGroups] = useState<StudyGroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses/${courseId}/study-groups`);
      const data = await res.json();
      if (data.success && data.groups) {
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
    if (!playerId || !newName.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/study-groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewName('');
        await fetchGroups();
      } else {
        alert(data.error || 'Failed to create group');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoin = async (groupId: string) => {
    if (!playerId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/study-groups/${groupId}/join`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) await fetchGroups();
      else alert(data.error || 'Failed to join');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeave = async (groupId: string) => {
    if (!playerId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/study-groups/${groupId}/leave`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) await fetchGroups();
      else alert(data.error || 'Failed to leave');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-white rounded-2xl p-6 sm:p-8 border-2 border-brand-accent shadow-lg">
      <h2 className="text-2xl font-bold text-brand-black mb-4 flex items-center gap-2">
        <Users className="w-7 h-7 text-brand-accent" />
        {strings.title}
      </h2>

      {playerId ? (
        <div className="mb-6 flex flex-wrap gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={strings.groupName}
            className="flex-1 min-w-[160px] p-3 border-2 border-brand-darkGrey/20 rounded-lg text-brand-black placeholder-brand-darkGrey/50 focus:border-brand-accent focus:outline-none"
            maxLength={120}
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={!newName.trim() || submitting}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 disabled:opacity-50 touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            {strings.create}
          </button>
        </div>
      ) : (
        <p className="text-brand-darkGrey mb-4">{strings.signInToJoin}</p>
      )}

      {loading ? (
        <p className="text-brand-darkGrey">{strings.loading}</p>
      ) : groups.length === 0 ? (
        <p className="text-brand-darkGrey">{strings.noGroups}</p>
      ) : (
        <ul className="space-y-3">
          {groups.map((g) => (
            <li
              key={g._id}
              className="flex flex-wrap items-center justify-between gap-3 p-4 border border-brand-darkGrey/20 rounded-lg"
            >
              <div>
                <p className="font-bold text-brand-black">{g.name}</p>
                <p className="text-sm text-brand-darkGrey">
                  {strings.members}: {g.memberCount}
                  {g.capacity ? ` / ${g.capacity}` : ''} • {g.createdByDisplayName}
                </p>
              </div>
              {playerId && (
                g.isMember ? (
                  <button
                    type="button"
                    onClick={() => handleLeave(g._id)}
                    disabled={submitting}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg font-bold hover:bg-red-50 disabled:opacity-50 touch-manipulation"
                  >
                    <LogOut className="w-4 h-4" />
                    {strings.leave}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleJoin(g._id)}
                    disabled={submitting || (g.capacity != null && g.memberCount >= g.capacity)}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 disabled:opacity-50 touch-manipulation"
                  >
                    <LogIn className="w-4 h-4" />
                    {strings.join}
                  </button>
                )
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
