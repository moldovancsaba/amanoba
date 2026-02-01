/**
 * Course Discussion Component
 *
 * What: Forum discussion for a course (and optional lesson).
 * Why: Community Phase 1 — learners ask questions and discuss.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Send, Trash2 } from 'lucide-react';

interface Post {
  _id: string;
  body: string;
  authorId?: string | null;
  authorDisplayName: string;
  createdAt: string;
  hiddenByAdmin?: boolean;
  replies?: Array<{
    _id: string;
    body: string;
    authorDisplayName: string;
    createdAt: string;
  }>;
}

interface CourseDiscussionProps {
  courseId: string;
  lessonId?: string;
  playerId: string | null;
  strings: {
    title: string;
    placeholder: string;
    post: string;
    reply: string;
    noPosts: string;
    signInToPost: string;
    loading: string;
    delete: string;
    edit: string;
  };
}

export default function CourseDiscussion({
  courseId,
  lessonId,
  playerId,
  strings,
}: CourseDiscussionProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBody, setNewBody] = useState('');
  const [replyBody, setReplyBody] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const url = lessonId
        ? `/api/courses/${courseId}/discussion?lessonId=${encodeURIComponent(lessonId)}`
        : `/api/courses/${courseId}/discussion`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const handlePost = async (parentPostId?: string) => {
    if (!playerId) return;
    const body = parentPostId ? replyBody[parentPostId]?.trim() : newBody.trim();
    if (!body) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/discussion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body,
          ...(lessonId && { lessonId }),
          ...(parentPostId && { parentPostId }),
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (parentPostId) {
          setReplyBody((prev) => ({ ...prev, [parentPostId]: '' }));
        } else {
          setNewBody('');
        }
        await fetchPosts();
      } else {
        alert(data.error || 'Failed to post');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!playerId || !confirm(strings.delete)) return;
    try {
      const res = await fetch(`/api/courses/${courseId}/discussion/${postId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchPosts();
      else alert(data.error || 'Failed to delete');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-brand-white rounded-2xl p-6 sm:p-8 border-2 border-brand-accent shadow-lg">
      <h2 className="text-2xl font-bold text-brand-black mb-4 flex items-center gap-2">
        <MessageCircle className="w-7 h-7 text-brand-accent" />
        {strings.title}
      </h2>

      {playerId ? (
        <div className="mb-6">
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder={strings.placeholder}
            className="w-full min-h-[80px] p-3 border-2 border-brand-darkGrey/20 rounded-lg text-brand-black placeholder-brand-darkGrey/50 focus:border-brand-accent focus:outline-none resize-y"
            maxLength={10000}
          />
          <button
            type="button"
            onClick={() => handlePost()}
            disabled={!newBody.trim() || submitting}
            className="mt-2 min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 disabled:opacity-50 touch-manipulation"
          >
            <Send className="w-4 h-4" />
            {strings.post}
          </button>
        </div>
      ) : (
        <p className="text-brand-darkGrey mb-4">{strings.signInToPost}</p>
      )}

      {loading ? (
        <p className="text-brand-darkGrey">{strings.loading}</p>
      ) : posts.length === 0 ? (
        <p className="text-brand-darkGrey">{strings.noPosts}</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post._id} className="border border-brand-darkGrey/20 rounded-lg p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-black">{post.authorDisplayName}</p>
                  <p className="text-sm text-brand-darkGrey mt-0.5">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2 text-brand-black whitespace-pre-wrap break-words">{post.body}</p>
                </div>
                {playerId && String(post.authorId) === String(playerId) && (
                  <button
                    type="button"
                    onClick={() => handleDelete(post._id)}
                    className="p-2 text-brand-darkGrey hover:text-red-600 rounded touch-manipulation"
                    title={strings.delete}
                    aria-label={strings.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {(post.replies?.length ?? 0) > 0 && (
                <ul className="mt-4 pl-4 border-l-2 border-brand-accent/30 space-y-3">
                  {post.replies?.map((r) => (
                    <li key={r._id}>
                      <p className="font-medium text-brand-black text-sm">{r.authorDisplayName}</p>
                      <p className="text-xs text-brand-darkGrey">{new Date(r.createdAt).toLocaleString()}</p>
                      <p className="text-brand-black text-sm whitespace-pre-wrap break-words">{r.body}</p>
                    </li>
                  ))}
                </ul>
              )}
              {playerId && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={replyBody[post._id] ?? ''}
                    onChange={(e) => setReplyBody((prev) => ({ ...prev, [post._id]: e.target.value }))}
                    placeholder={strings.reply}
                    className="flex-1 min-w-0 p-2 border border-brand-darkGrey/20 rounded text-brand-black placeholder-brand-darkGrey/50 focus:border-brand-accent focus:outline-none"
                    maxLength={2000}
                  />
                  <button
                    type="button"
                    onClick={() => handlePost(post._id)}
                    disabled={!(replyBody[post._id]?.trim()) || submitting}
                    className="min-h-[44px] px-4 py-2 bg-brand-darkGrey text-brand-white rounded-lg font-bold hover:bg-brand-secondary-700 disabled:opacity-50 touch-manipulation"
                  >
                    {strings.reply}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
