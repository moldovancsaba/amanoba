'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

type Course = {
  _id: string;
  courseId: string;
  name?: string;
  description?: string;
  language?: string;
  isActive?: boolean;
  durationDays?: number;
};

export default function EditorCoursesPage() {
  const locale = useLocale();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/admin/courses')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (!d?.success || !Array.isArray(d.courses)) {
          setError(d?.error || 'Failed to load courses');
          setCourses([]);
          return;
        }
        setCourses(d.courses);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load courses');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...courses].sort((a, b) => (a.courseId || '').localeCompare(b.courseId || ''));
  }, [courses]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">My editor courses</h1>
        <p className="text-sm text-gray-300">Courses you created or were assigned to.</p>
      </div>

      {loading && <div className="text-sm text-gray-300">Loading…</div>}
      {error && <div className="text-sm text-red-300">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-3">
          {sorted.length === 0 ? (
            <div className="text-sm text-gray-300">No courses assigned.</div>
          ) : (
            sorted.map((c) => (
              <Link
                key={c._id || c.courseId}
                href={`/${locale}/editor/courses/${encodeURIComponent(c.courseId)}`}
                className="block bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold">{c.name || c.courseId}</div>
                    <div className="text-xs text-gray-400">{c.courseId}</div>
                  </div>
                  <div className="text-xs text-gray-300">
                    {(c.language || '').toUpperCase()} • {c.durationDays ?? '?'} days • {c.isActive ? 'active' : 'draft'}
                  </div>
                </div>
                {c.description ? <div className="text-sm text-gray-300 mt-2 line-clamp-2">{c.description}</div> : null}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

