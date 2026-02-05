'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import MarkdownEditor from '@/components/ui/markdown-editor';
import QuizManagerModal from '@/components/QuizManagerModal';

type Lesson = {
  lessonId: string;
  dayNumber: number;
  title?: string;
  content?: string;
  emailSubject?: string;
  emailBody?: string;
  isActive?: boolean;
};

export default function EditorLessonPage() {
  const locale = useLocale();
  const router = useRouter();
  const params = useParams() as { courseId?: string; lessonId?: string };
  const courseId = params.courseId ? decodeURIComponent(params.courseId) : '';
  const lessonId = params.lessonId ? decodeURIComponent(params.lessonId) : '';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [showQuizManager, setShowQuizManager] = useState(false);

  useEffect(() => {
    if (!courseId || !lessonId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (!d?.success || !d.lesson) {
          setError(d?.error || d?.message || 'Failed to load lesson');
          return;
        }
        setLesson(d.lesson);
        setTitle(String(d.lesson.title ?? ''));
        setContent(String(d.lesson.content ?? ''));
        setEmailSubject(String(d.lesson.emailSubject ?? ''));
        setEmailBody(String(d.lesson.emailBody ?? ''));
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load lesson');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [courseId, lessonId]);

  const dirty = useMemo(() => {
    if (!lesson) return false;
    return (
      title !== String(lesson.title ?? '') ||
      content !== String(lesson.content ?? '') ||
      emailSubject !== String(lesson.emailSubject ?? '') ||
      emailBody !== String(lesson.emailBody ?? '')
    );
  }, [lesson, title, content, emailSubject, emailBody]);

  async function save() {
    if (!courseId || !lessonId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, emailSubject, emailBody }),
      });
      const d = await res.json();
      if (!d?.success) {
        throw new Error(d?.error || d?.message || 'Failed to save lesson');
      }
      setLesson(d.lesson);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save lesson');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-400">
        <Link className="hover:underline" href={`/${locale}/editor/courses`}>
          Courses
        </Link>{' '}
        /{' '}
        <Link className="hover:underline" href={`/${locale}/editor/courses/${encodeURIComponent(courseId)}`}>
          {courseId}
        </Link>{' '}
        / {lessonId}
      </div>

      {loading && <div className="text-sm text-gray-300">Loading…</div>}
      {error && <div className="text-sm text-red-300">{error}</div>}

      {!loading && lesson && (
        <>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold">
                Day {String(lesson.dayNumber).padStart(2, '0')}: {title || lessonId}
              </h1>
              <div className="text-sm text-brand-white/80">{lesson.isActive ? 'published' : 'draft'}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => router.back()}
                className="text-xs px-3 py-2 rounded bg-brand-darkGrey hover:bg-brand-secondary-700 text-brand-white"
              >
                Back
              </button>
              <button
                disabled={!dirty || saving}
                onClick={save}
                className={`text-xs px-3 py-2 rounded ${!dirty || saving ? 'bg-brand-darkGrey text-brand-white/60' : 'bg-brand-accent hover:bg-brand-primary-400 text-brand-black'}`}
              >
                {saving ? 'Saving…' : dirty ? 'Save' : 'Saved'}
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="panel-on-dark p-4">
              <label className="block text-xs text-brand-white/80 mb-2">Lesson title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-on-dark w-full px-3 py-2 text-sm"
              />
            </div>

            <div className="panel-on-dark p-4">
              <label className="block text-xs text-brand-white/80 mb-2">Lesson content (Markdown)</label>
              <MarkdownEditor content={content} onChange={setContent} placeholder="Write lesson content in Markdown…" className="border-brand-accent/30" />
            </div>

            <div className="panel-on-dark p-4 pt-4 border-t border-brand-accent/30">
              <button
                type="button"
                onClick={() => setShowQuizManager(true)}
                className="w-full px-4 py-2 bg-brand-accent hover:bg-brand-primary-400 text-brand-black rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>📝</span>
                Manage Quiz Questions
              </button>
            </div>

            <div className="panel-on-dark p-4">
              <label className="block text-xs text-brand-white/80 mb-2">Email subject</label>
              <input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="input-on-dark w-full px-3 py-2 text-sm"
              />
            </div>

            <div className="panel-on-dark p-4">
              <label className="block text-xs text-brand-white/80 mb-2">Email body (Markdown)</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={8}
                className="input-on-dark w-full px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>

          {showQuizManager && (
            <QuizManagerModal
              courseId={courseId}
              lessonId={lessonId}
              onClose={() => setShowQuizManager(false)}
              variant="dark"
            />
          )}
        </>
      )}
    </div>
  );
}
