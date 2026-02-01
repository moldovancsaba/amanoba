/**
 * Course Discussion (forums) component
 *
 * What: Lists course discussion posts and allows reply (threaded). Auth required to post.
 * Why: Community Phase 1 — course/lesson discussion per TASKLIST.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCircle, Send, Trash2 } from 'lucide-react';
import ContentVoteWidget from '@/components/ContentVoteWidget';

interface Post {
  _id: string;
  body: string;
  authorId?: string | null;
  authorDisplayName: string;
  createdAt: string;
  hiddenByAdmin?: boolean;
  replies?: Array<{ _id: string; body: string; authorId?: string | null; authorDisplayName: string; createdAt: string }>;
}

interface CourseDiscussionProps {
  courseId: string;
  lessonId?: string;
  title?: string;
  placeholder?: string;
  replyLabel?: string;
  signInToPost?: string;
  emptyMessage?: string;
  loadingText?: string;
}

export default function CourseDiscussion({
  courseId,
  lessonId,
  title = 'Discussion',
  placeholder = 'Ask a question or share a thought...',
  replyLabel = 'Reply',
  signInToPost = 'Sign in to post',
  emptyMessage = 'No posts yet. Be the first to start the discussion.',
  loadingText = 'Loading...',
}: CourseDiscussionProps) {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBody, setNewBody] = useState('');
  const [replyBody, setReplyBody] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const url = lessonId
        ? `/api/courses/${encodeURIComponent(courseId)}/discussion?lessonId=${encodeURIComponent(lessonId)}`
        : `/api/courses/${encodeURIComponent(courseId)}/discussion`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
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

  const handleSubmit = async (parentPostId?: string) => {
    if (!session?.user) return;
    const body = parentPostId ? (replyBody[parentPostId] ?? '').trim() : newBody.trim();
    if (!body) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/discussion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, lessonId: lessonId || undefined, parentPostId: parentPostId || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        if (parentPostId) {
          setReplyBody((prev) => ({ ...prev, [parentPostId]: '' }));
          setReplyingTo(null);
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
    if (!session?.user || !confirm('Delete this post?')) return;
    try {
      const res = await fetch(`/api/courses/${encodeURIComponent(courseId)}/discussion/${postId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchPosts();
      else alert(data.error || 'Failed to delete');
    } catch (e) {
      console.error(e);
    }
  };

  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin';
  const playerId = (session?.user as { id?: string; playerId?: string } | undefined)?.playerId || (session?.user as { id?: string } | undefined)?.id;

  return (
    <div className="bg-brand-white rounded-2xl p-6 sm:p-8 border-2 border-brand-accent shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-brand-black mb-4 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-brand-accent" />
        {title}
      </h2>

      {session?.user && (
        <div className="mb-6">
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full px-4 py-3 border-2 border-brand-darkGrey/20 rounded-lg text-brand-black placeholder-brand-darkGrey/50 focus:outline-none focus:border-brand-accent resize-none"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!newBody.trim() || submitting}
            className="mt-2 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <Send className="w-4 h-4" />
            Post
          </button>
        </div>
      )}
      {!session?.user && (
        <p className="text-brand-darkGrey text-sm mb-4">{signInToPost}</p>
      )}

      {loading ? (
        <p className="text-brand-darkGrey">{loadingText}</p>
      ) : posts.length === 0 ? (
        <p className="text-brand-darkGrey">{emptyMessage}</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post._id} className="border border-brand-darkGrey/15 rounded-lg p-4 bg-brand-darkGrey/5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-black text-sm">{post.authorDisplayName}</p>
                  <p className="text-brand-darkGrey text-xs mt-0.5">
                    {new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                  <p className="mt-2 text-brand-black whitespace-pre-wrap break-words">{post.body}</p>
                  <ContentVoteWidget
                    targetType="discussion_post"
                    targetId={post._id}
                    playerId={playerId ?? null}
                    label=""
                    className="mt-2"
                  />
                </div>
                {(playerId && (String(post.authorId) === String(playerId)) || isAdmin) && (
                  <button
                    type="button"
                    onClick={() => handleDelete(post._id)}
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete"
                    aria-label="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {session?.user && (
                <>
                  {replyingTo === post._id ? (
                    <div className="mt-4 pl-4 border-l-2 border-brand-accent/30">
                      <textarea
                        value={replyBody[post._id] ?? ''}
                        onChange={(e) => setReplyBody((prev) => ({ ...prev, [post._id]: e.target.value }))}
                        placeholder={placeholder}
                        rows={2}
                        className="w-full px-3 py-2 border border-brand-darkGrey/20 rounded-lg text-brand-black placeholder-brand-darkGrey/50 focus:outline-none focus:border-brand-accent text-sm resize-none"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleSubmit(post._id)}
                          disabled={!(replyBody[post._id] ?? '').trim() || submitting}
                          className="px-3 py-1.5 bg-brand-accent text-brand-black rounded-lg font-bold text-sm hover:bg-brand-primary-400 disabled:opacity-50"
                        >
                          {replyLabel}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setReplyingTo(null); setReplyBody((prev) => ({ ...prev, [post._id]: '' })); }}
                          className="px-3 py-1.5 border border-brand-darkGrey/30 rounded-lg text-brand-darkGrey text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setReplyingTo(post._id)}
                      className="mt-2 text-sm text-brand-accent hover:underline"
                    >
                      {replyLabel}
                    </button>
                  )}
                </>
              )}
              {Array.isArray(post.replies) && post.replies.length > 0 && (
                <ul className="mt-4 space-y-3 pl-4 border-l-2 border-brand-darkGrey/20">
                  {post.replies.map((r) => (
                    <li key={r._id} className="text-sm">
                      <p className="font-medium text-brand-black">{r.authorDisplayName}</p>
                      <p className="text-brand-darkGrey text-xs">{new Date(r.createdAt).toLocaleDateString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</p>
                      <p className="mt-1 text-brand-black whitespace-pre-wrap break-words">{r.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
