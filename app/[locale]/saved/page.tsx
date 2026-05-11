'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { BookmarkCheck, Clock3, Library, Loader2 } from 'lucide-react';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';

type SavedLessonItem = {
  course: {
    courseId: string;
    name: string;
    description: string;
    language: string;
    thumbnail?: string;
    durationDays: number;
  };
  lesson: {
    dayNumber: number;
    lessonId: string | null;
    title: string;
  };
  savedAt: string;
  progress: {
    currentDay: number;
    completedDays: number;
    isSavedLessonCompleted: boolean;
    lastAccessedAt: string | null;
    resumeDay: number;
    resumeHref: string;
    savedLessonHref: string;
  };
};

export default function SavedLessonsPage() {
  const { data: session, status } = useSession();
  const [savedLessons, setSavedLessons] = useState<SavedLessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedLessons = async () => {
      if (status === 'loading') return;
      if (!session?.user) {
        setError('Please sign in to view saved lessons.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/saved-lessons', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to load saved lessons');
        }
        setSavedLessons(data.savedLessons || []);
      } catch (savedLessonsError) {
        console.error('Failed to fetch saved lessons:', savedLessonsError);
        setError('Failed to load saved lessons.');
      } finally {
        setLoading(false);
      }
    };

    void fetchSavedLessons();
  }, [session?.user, status]);

  return (
    <div className="min-h-screen bg-brand-black">
      <header className="border-b-2 border-brand-accent bg-brand-darkGrey">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <Logo size="sm" showText={false} linkTo={session?.user ? '/dashboard' : '/'} className="flex-shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-brand-white">Saved Lessons</h1>
              <p className="text-sm text-brand-white/75">A focused library for lessons you want to revisit or resume.</p>
            </div>
          </div>
          <LocaleLink
            href="/dashboard"
            className="rounded-lg border-2 border-brand-accent px-4 py-2 font-bold text-brand-white transition-colors hover:bg-brand-accent hover:text-brand-black"
          >
            Back to Dashboard
          </LocaleLink>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-brand-white">
            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
            Loading saved lessons...
          </div>
        ) : error ? (
          <div className="rounded-2xl border-2 border-brand-accent bg-brand-white p-8 text-center">
            <p className="mb-4 text-brand-black">{error}</p>
            <LocaleLink
              href="/dashboard"
              className="inline-flex rounded-lg bg-brand-accent px-5 py-2 font-bold text-brand-black transition-colors hover:bg-brand-primary-400"
            >
              Return to dashboard
            </LocaleLink>
          </div>
        ) : savedLessons.length === 0 ? (
          <div className="rounded-2xl border-2 border-brand-accent bg-brand-white p-10 text-center">
            <Library className="mx-auto mb-4 h-10 w-10 text-brand-accent" />
            <h2 className="mb-2 text-2xl font-bold text-brand-black">No saved lessons yet</h2>
            <p className="mb-6 text-brand-darkGrey">
              Save lesson days when you want to come back to them intentionally.
            </p>
            <LocaleLink
              href="/my-courses"
              className="inline-flex rounded-lg bg-brand-accent px-5 py-2 font-bold text-brand-black transition-colors hover:bg-brand-primary-400"
            >
              Browse my courses
            </LocaleLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {savedLessons.map((item) => (
              <div
                key={`${item.course.courseId}-${item.lesson.dayNumber}`}
                className="rounded-2xl border-2 border-brand-accent bg-brand-white p-6 shadow-lg"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-accent">
                      <BookmarkCheck className="h-4 w-4" />
                      Saved for review
                    </div>
                    <h2 className="text-2xl font-bold text-brand-black">{item.course.name}</h2>
                    <p className="mt-1 text-brand-darkGrey">
                      Day {item.lesson.dayNumber}: {item.lesson.title}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm text-brand-darkGrey">
                      {item.course.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-brand-darkGrey">
                      <span>{item.progress.completedDays} days completed</span>
                      <span>Current course day: {item.progress.currentDay}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-4 w-4" />
                        Saved {new Date(item.savedAt).toLocaleDateString('hu-HU')}
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-3 md:w-56">
                    <LocaleLink
                      href={item.progress.savedLessonHref}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-brand-accent px-5 py-3 text-center font-bold text-brand-black transition-colors hover:bg-brand-primary-400"
                    >
                      Open saved lesson
                    </LocaleLink>
                    <LocaleLink
                      href={item.progress.resumeHref}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-lg border-2 border-brand-accent px-5 py-3 text-center font-bold text-brand-black transition-colors hover:bg-brand-accent/15"
                    >
                      Resume course
                    </LocaleLink>
                    {item.progress.isSavedLessonCompleted ? (
                      <p className="text-center text-xs font-semibold text-brand-darkGrey">
                        This saved lesson is already completed. Keep it for review or jump back into the course.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
