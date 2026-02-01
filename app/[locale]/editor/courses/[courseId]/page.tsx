'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';

type Course = {
  _id: string;
  courseId: string;
  name?: string;
  language?: string;
  durationDays?: number;
  isActive?: boolean;
};

type Lesson = {
  _id: string;
  lessonId: string;
  dayNumber: number;
  title?: string;
  isActive?: boolean;
};

export default function EditorCourseDetailPage() {
  const locale = useLocale();
  const params = useParams() as { courseId?: string };
  const courseId = params.courseId ? decodeURIComponent(params.courseId) : '';

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/admin/courses/${encodeURIComponent(courseId)}`).then((r) => r.json()),
      fetch(`/api/admin/courses/${encodeURIComponent(courseId)}/lessons`).then((r) => r.json()),
    ])
      .then(([courseResp, lessonsResp]) => {
        if (cancelled) return;
        if (!courseResp?.success) {
          setError(courseResp?.error || courseResp?.message || 'Failed to load course');
          return;
        }
        if (!lessonsResp?.success) {
          setError(lessonsResp?.error || lessonsResp?.message || 'Failed to load lessons');
          return;
        }
        setCourse(courseResp.course);
        setLessons(Array.isArray(lessonsResp.lessons) ? lessonsResp.lessons : []);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load course');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => (a.dayNumber ?? 0) - (b.dayNumber ?? 0));
  }, [lessons]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-gray-400">
            <Link className="hover:underline" href={`/${locale}/editor/courses`}>
              Courses
            </Link>{' '}
            / {courseId}
          </div>
          <h1 className="text-xl font-bold">{course?.name || courseId}</h1>
          <div className="text-sm text-gray-300">
            {(course?.language || '').toUpperCase()} • {course?.durationDays ?? '?'} days • {course?.isActive ? 'active' : 'draft'}
          </div>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-300">Loading…</div>}
      {error && <div className="text-sm text-red-300">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-2">
          {sortedLessons.map((l) => (
            <Link
              key={l._id || l.lessonId}
              href={`/${locale}/editor/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(l.lessonId)}`}
              className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 hover:bg-gray-750"
            >
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-400 w-14">Day {String(l.dayNumber).padStart(2, '0')}</div>
                <div className="font-medium">{l.title || l.lessonId}</div>
              </div>
              <div className="text-xs text-gray-300">{l.isActive ? 'published' : 'draft'}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

