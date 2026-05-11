'use client';

/**
 * Practice Hub Page
 *
 * What: Learner-facing review shell for the first Practice Hub MVP
 * Why: Exposes bounded review modes and real launch flows from existing Amanoba signals
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Logo from '@/components/Logo';
import { LocaleLink } from '@/components/LocaleLink';
import Icon, {
  MdAutoStories,
  MdGpsFixed,
  MdMenuBook,
  MdPsychology,
  MdQuiz,
  MdRocketLaunch,
} from '@/components/Icon';
import { type PracticeContext, parsePracticeContext } from '@/app/lib/practice-hub';

type PracticeModeId = 'continue-next' | 'quiz-recovery' | 'stale-refresh';
type PracticeModeStatus = 'available' | 'empty';

type PracticeRecommendation = {
  mode: PracticeModeId;
  courseId: string;
  courseName: string;
  courseLanguage: string;
  lessonDay: number;
  lessonId?: string;
  title: string;
  reasonLabel: string;
  priorityScore: number;
  sourceSignals: string[];
  actionHref: string;
  actionLabel: string;
  quizAvailable?: boolean;
};

type PracticeMode = {
  id: PracticeModeId;
  title: string;
  description: string;
  status: PracticeModeStatus;
  items: PracticeRecommendation[];
  emptyStateTitle: string;
  emptyStateDescription: string;
};

type PracticeHubResponse = {
  success: boolean;
  summary: {
    availableRecommendationCount: number;
    availableModeCount: number;
    hasWork: boolean;
    nextRecommendation: PracticeRecommendation | null;
  };
  modes: PracticeMode[];
  unavailableModes: Array<{
    id: string;
    title: string;
    reason: string;
  }>;
};

function modeIcon(modeId: PracticeModeId) {
  switch (modeId) {
    case 'continue-next':
      return MdRocketLaunch;
    case 'quiz-recovery':
      return MdQuiz;
    case 'stale-refresh':
      return MdAutoStories;
  }
}

export default function PracticeHubPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const tDashboard = useTranslations('dashboard');
  const tCourses = useTranslations('courses');
  const tAuth = useTranslations('auth');
  const hasTrackedView = useRef(false);
  const [launchingKey, setLaunchingKey] = useState<string | null>(null);
  const [practiceHub, setPracticeHub] = useState<PracticeHubResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPracticeHub = useCallback(async () => {
    if (!session) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/practice-hub?locale=${locale}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load Practice Hub');
      }
      setPracticeHub(data as PracticeHubResponse);
    } catch (fetchError) {
      console.error('Failed to fetch Practice Hub:', fetchError);
      setError('Failed to load Practice Hub');
    } finally {
      setLoading(false);
    }
  }, [locale, session]);

  useEffect(() => {
    void fetchPracticeHub();
  }, [fetchPracticeHub]);

  useEffect(() => {
    if (!practiceHub || hasTrackedView.current || !session) return;
    hasTrackedView.current = true;

    void fetch('/api/practice-hub/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'viewed',
        availableRecommendationCount: practiceHub.summary.availableRecommendationCount,
        availableModeCount: practiceHub.summary.availableModeCount,
      }),
    });
  }, [practiceHub, session]);

  const handleRecommendationOpen = useCallback(
    async (item: PracticeRecommendation) => {
      const key = `${item.mode}-${item.courseId}-${item.lessonDay}`;
      setLaunchingKey(key);

      const practiceContext = parsePracticeContext({
        mode: item.mode,
        courseId: item.courseId,
        lessonDay: item.lessonDay,
      }) as PracticeContext;

      try {
        await fetch('/api/practice-hub/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'recommendation_opened',
            practiceContext,
          }),
          keepalive: true,
        });
      } catch (error) {
        console.error('Failed to track Practice Hub recommendation open:', error);
      } finally {
        router.push(item.actionHref);
      }
    },
    [router]
  );

  if (!session) {
    const signInHref = `/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}/practice`)}`;
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
        <div className="bg-brand-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center border-2 border-brand-accent">
          <Icon icon={MdPsychology} size={48} className="text-brand-accent mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-brand-black mb-3">
            Practice Hub
          </h1>
          <p className="text-brand-darkGrey mb-6">
            Sign in to continue lessons, recover quizzes, and revisit stale learning sessions.
          </p>
          <LocaleLink
            href={signInHref}
            className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
          >
            {tAuth('signIn')}
          </LocaleLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent sticky top-0 z-30 mobile-sticky-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Logo size="sm" showText={false} linkTo="/dashboard" className="flex-shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-white flex items-center gap-2">
                  <Icon icon={MdPsychology} size={28} className="text-brand-accent" />
                  Practice Hub
                </h1>
                <p className="text-brand-white/80 mt-1 text-sm sm:text-base">
                  Recover unfinished learning, reopen unresolved quizzes, and refresh lessons that have gone cold.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <LocaleLink
                href="/my-courses"
                className="bg-brand-darkGrey text-brand-white px-4 py-3 sm:py-2 rounded-lg hover:bg-brand-secondary-700 transition-colors font-bold text-center border-2 border-brand-accent"
              >
                {tDashboard('myCourses')}
              </LocaleLink>
              <LocaleLink
                href="/dashboard"
                className="bg-brand-accent text-brand-black px-4 py-3 sm:py-2 rounded-lg hover:bg-brand-primary-400 transition-colors font-bold text-center"
              >
                {tDashboard('backToDashboard')}
              </LocaleLink>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="bg-brand-white rounded-2xl border-2 border-brand-accent p-10 text-center shadow-xl">
            <div className="text-brand-darkGrey text-lg">
              Loading Practice Hub...
            </div>
          </div>
        ) : error || !practiceHub ? (
          <div className="bg-brand-white rounded-2xl border-2 border-brand-accent p-10 text-center shadow-xl">
            <div className="text-brand-black text-2xl font-bold mb-3">
              Unable to load Practice Hub
            </div>
            <p className="text-brand-darkGrey mb-6">
              The review surface could not be loaded right now.
            </p>
            <button
              onClick={() => void fetchPracticeHub()}
              className="bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
            >
              {tDashboard('retry')}
            </button>
          </div>
        ) : (
          <>
            <section className="bg-brand-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border-2 border-brand-accent">
              <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-brand-black mb-3">
                    Your next best review action
                  </h2>
                  <p className="text-brand-darkGrey mb-5">
                    The Practice Hub only shows explainable actions powered by your real course and quiz progress.
                  </p>

                  {practiceHub.summary.nextRecommendation ? (
                    <div className="rounded-2xl border-2 border-brand-darkGrey/15 bg-brand-darkGrey/5 p-5">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="text-sm font-semibold text-brand-accent mb-1">
                            {practiceHub.summary.nextRecommendation.courseName}
                          </div>
                          <h3 className="text-xl font-bold text-brand-black">
                            {practiceHub.summary.nextRecommendation.title}
                          </h3>
                        </div>
                        <div className="bg-brand-accent text-brand-black px-3 py-1 rounded-full text-xs font-bold">
                          {practiceHub.summary.nextRecommendation.mode}
                        </div>
                      </div>
                      <p className="text-brand-darkGrey mb-4">
                        {practiceHub.summary.nextRecommendation.reasonLabel}
                      </p>
                      <LocaleLink
                        href={practiceHub.summary.nextRecommendation.actionHref}
                        className="inline-flex items-center justify-center gap-2 bg-brand-accent text-brand-black px-5 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
                      >
                        <Icon icon={MdGpsFixed} size={18} />
                        {practiceHub.summary.nextRecommendation.actionLabel}
                      </LocaleLink>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-brand-darkGrey/20 bg-brand-darkGrey/5 p-5">
                      <h3 className="text-xl font-bold text-brand-black mb-2">
                        No practice pressure right now
                      </h3>
                      <p className="text-brand-darkGrey mb-4">
                        You do not have any active review actions yet. Start or continue a course to build your next practice queue.
                      </p>
                      <LocaleLink
                        href="/courses"
                        className="inline-flex items-center justify-center gap-2 bg-brand-accent text-brand-black px-5 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
                      >
                        <Icon icon={MdMenuBook} size={18} />
                        {tDashboard('browseCourses')}
                      </LocaleLink>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                  <div className="bg-brand-black rounded-2xl p-5 border-2 border-brand-accent">
                    <div className="text-brand-white/70 text-sm mb-2">
                      Actionable sessions
                    </div>
                    <div className="text-3xl font-bold text-brand-accent">
                      {practiceHub.summary.availableRecommendationCount}
                    </div>
                  </div>
                  <div className="bg-brand-black rounded-2xl p-5 border-2 border-brand-accent">
                    <div className="text-brand-white/70 text-sm mb-2">
                      Active review modes
                    </div>
                    <div className="text-3xl font-bold text-brand-accent">
                      {practiceHub.summary.availableModeCount}
                    </div>
                  </div>
                  <div className="bg-brand-black rounded-2xl p-5 border-2 border-brand-accent">
                    <div className="text-brand-white/70 text-sm mb-2">
                      Unavailable by design
                    </div>
                    <div className="text-lg font-bold text-brand-white">
                      {practiceHub.unavailableModes.length}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-[2.1fr_0.9fr] gap-8">
              <div className="space-y-6">
                {practiceHub.modes.map((mode) => (
                  <div key={mode.id} className="bg-brand-white rounded-2xl shadow-xl p-6 border-2 border-brand-accent">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <h2 className="text-xl font-bold text-brand-black flex items-center gap-2">
                          <Icon icon={modeIcon(mode.id)} size={22} className="text-brand-accent" />
                          {mode.title}
                        </h2>
                        <p className="text-brand-darkGrey mt-1">{mode.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${mode.status === 'available' ? 'bg-brand-accent text-brand-black' : 'bg-brand-darkGrey/10 text-brand-darkGrey'}`}>
                        {mode.status === 'available'
                          ? 'Ready'
                          : 'Empty'}
                      </span>
                    </div>

                    {mode.items.length > 0 ? (
                      <div className="space-y-4">
                        {mode.items.map((item) => (
                          <div key={`${item.mode}-${item.courseId}-${item.lessonDay}`} className="rounded-2xl border-2 border-brand-darkGrey/15 bg-brand-darkGrey/5 p-5">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div>
                                <div className="text-sm font-semibold text-brand-accent mb-1">
                                  {item.courseName}
                                </div>
                                <h3 className="text-lg font-bold text-brand-black">
                                  {item.title}
                                </h3>
                                <div className="text-sm text-brand-darkGrey mt-2">
                                  {item.reasonLabel}
                                </div>
                                <div className="text-xs text-brand-darkGrey mt-2">
                                  {tCourses('dayNumber', { day: item.lessonDay })}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => void handleRecommendationOpen(item)}
                                disabled={launchingKey === `${item.mode}-${item.courseId}-${item.lessonDay}`}
                                className="inline-flex items-center justify-center gap-2 bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors self-start disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                <Icon icon={MdGpsFixed} size={18} />
                                {launchingKey === `${item.mode}-${item.courseId}-${item.lessonDay}` ? 'Opening...' : item.actionLabel}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border-2 border-dashed border-brand-darkGrey/20 bg-brand-darkGrey/5 p-5">
                        <h3 className="text-lg font-bold text-brand-black mb-2">
                          {mode.emptyStateTitle}
                        </h3>
                        <p className="text-brand-darkGrey">
                          {mode.emptyStateDescription}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <aside className="space-y-6">
                <div className="bg-brand-white rounded-2xl shadow-xl p-6 border-2 border-brand-accent">
                  <h2 className="text-xl font-bold text-brand-black mb-4">
                    Unavailable for this MVP
                  </h2>
                  <div className="space-y-4">
                    {practiceHub.unavailableModes.map((mode) => (
                      <div key={mode.id} className="rounded-2xl border-2 border-dashed border-brand-darkGrey/20 bg-brand-darkGrey/5 p-4">
                        <div className="text-sm font-semibold text-brand-black mb-2">{mode.title}</div>
                        <p className="text-sm text-brand-darkGrey">{mode.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-white rounded-2xl shadow-xl p-6 border-2 border-brand-accent">
                  <h2 className="text-xl font-bold text-brand-black mb-3">
                    How this hub decides
                  </h2>
                  <ul className="space-y-3 text-sm text-brand-darkGrey">
                    <li>Continue Next uses your next unfinished lesson day.</li>
                    <li>Quiz Recovery only surfaces completed lesson days with unresolved quiz completion markers.</li>
                    <li>Stale Refresh only appears after a course has been untouched long enough to justify a revisit.</li>
                  </ul>
                </div>
              </aside>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
