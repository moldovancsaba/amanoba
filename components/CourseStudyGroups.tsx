/**
 * Course Study Groups component
 *
 * What: Lists study groups for a course; create, join, leave. Auth required to create/join/leave.
 * Why: Community Phase 2 — study groups per TASKLIST.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Users, Plus, LogIn, LogOut } from 'lucide-react';

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
    if (!session?.user) return;
    setJoining(groupId);
    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/study-groups/${groupId}/join`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchGroups();
      } else {
        alert(data.error || 'Failed to join');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setJoining(null);
    }
  };

  const handleLeave = async (groupId: string) => {
    if (!session?.user || !confirm('Leave this study group?')) return;
    setLeaving(groupId);
    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/study-groups/${groupId}/leave`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchGroups();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLeaving(null);
    }
  };

  return (
    <div className="bg-brand-white rounded-2xl p-6 sm:p-8 border-2 border-brand-accent shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-brand-black mb-4 flex items-center gap-2">
        <Users className="w-6 h-6 text-brand-accent" />
        {title}
      </h2>

      {session?.user && (
        <div className="mb-6">
          {!showCreate ? (
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 touch-manipulation"
            >
              <Plus className="w-4 h-4" />
              {createLabel}
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={createPlaceholder}
                maxLength={120}
                className="px-4 py-2 border-2 border-brand-darkGrey/20 rounded-lg text-brand-black placeholder-brand-darkGrey/50 focus:outline-none focus:border-brand-accent flex-1 min-w-[160px]"
              />
              <button
                onClick={handleCreate}
                disabled={!newName.trim() || submitting}
                className="min-h-[44px] px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 disabled:opacity-50 touch-manipulation"
              >
                {submitting ? 'Creating…' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => { setShowCreate(false); setNewName(''); }}
                className="px-4 py-2 border border-brand-darkGrey/30 rounded-lg text-brand-darkGrey"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
      {!session?.user && <p className="text-brand-darkGrey text-sm mb-4">{signInToJoin}</p>}

      {loading ? (
        <p className="text-brand-darkGrey">{loadingText}</p>
      ) : groups.length === 0 ? (
        <p className="text-brand-darkGrey">{emptyMessage}</p>
      ) : (
        <ul className="space-y-3">
          {groups.map((g) => (
            <li key={g._id} className="flex flex-wrap items-center justify-between gap-3 p-4 bg-brand-darkGrey/5 rounded-lg border border-brand-darkGrey/15">
              <div>
                <p className="font-bold text-brand-black">{g.name}</p>
                <p className="text-sm text-brand-darkGrey">
                  {g.memberCount} {membersLabel} · by {g.createdByDisplayName}
                </p>
              </div>
              {session?.user && (
                (g.isMember === true) ? (
                  <button
                    type="button"
                    onClick={() => handleLeave(g._id)}
                    disabled={leaving === g._id}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-500/50 text-red-600 rounded-lg font-bold hover:bg-red-50 disabled:opacity-50 touch-manipulation"
                  >
                    <LogOut className="w-4 h-4" />
                    {leaving === g._id ? 'Leaving…' : leaveLabel}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleJoin(g._id)}
                    disabled={joining === g._id}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 disabled:opacity-50 touch-manipulation"
                  >
                    <LogIn className="w-4 h-4" />
                    {joining === g._id ? 'Joining…' : joinLabel}
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
