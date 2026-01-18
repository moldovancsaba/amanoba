/**
 * Daily Lesson Viewer Page
 * 
 * What: Display lesson content for a specific day
 * Why: Students read and complete daily lessons
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import LessonQuiz from '@/components/LessonQuiz';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lock,
  Award,
  Play,
  Calendar,
} from 'lucide-react';

interface Lesson {
  _id: string;
  lessonId: string;
  dayNumber: number;
  title: string;
  content: string;
  assessmentGameId?: string;
  assessmentGameRoute?: string; // Game route for navigation (e.g., '/games/quizzz')
  quizConfig?: {
    enabled: boolean;
    successThreshold: number;
    questionCount: number;
    poolSize: number;
    required: boolean;
  };
  pointsReward: number;
  xpReward: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

interface Navigation {
  previous: { day: number; title: string } | null;
  next: { day: number; title: string } | null;
}

export default function DailyLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; dayNumber: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('courses');
  const tCommon = useTranslations('common');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [navigation, setNavigation] = useState<Navigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [courseId, setCourseId] = useState<string>('');
  const [dayNumber, setDayNumber] = useState<number>(0);
  const [quizPassed, setQuizPassed] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const cid = resolvedParams.courseId;
      const day = parseInt(resolvedParams.dayNumber);
      setCourseId(cid);
      setDayNumber(day);
      await fetchLesson(cid, day);
    };
    loadData();
  }, [params]);

  const fetchLesson = async (cid: string, day: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${cid}/day/${day}`);
      const data = await response.json();

      if (data.success) {
        setLesson(data.lesson);
        setNavigation(data.navigation);
      } else {
        alert(data.error || t('failedToLoadLesson'));
      }
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
      alert(t('failedToLoadLesson'));
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!lesson || completing) return;

    // Check if quiz is required and not passed
    if (lesson.quizConfig?.enabled && lesson.quizConfig.required && !quizPassed) {
      alert(t('mustPassQuiz'));
      return;
    }

    setCompleting(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/day/${dayNumber}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Refresh lesson to show completed state
        await fetchLesson(courseId, dayNumber);
        alert(t('lessonCompleted'));
      } else {
        alert(data.error || t('failedToComplete'));
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error);
      alert(t('failedToComplete'));
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizComplete = (result: { passed: boolean }) => {
    if (result.passed) {
      setQuizPassed(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-brand-white text-xl">{t('loadingLesson')}</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-white mb-4">{t('lessonNotFound')}</h2>
          <LocaleLink
            href="/my-courses"
            className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400"
          >
            {t('backToMyCourses')}
          </LocaleLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <LocaleLink
              href={`/courses/${courseId}`}
              className="inline-flex items-center gap-2 text-brand-white hover:text-brand-accent"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('backToCourse')}
            </LocaleLink>
            <div className="flex items-center gap-2 text-brand-white">
              <Calendar className="w-5 h-5" />
              <span className="font-bold">{t('dayNumber', { day: lesson.dayNumber })}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lesson Header */}
        <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {lesson.isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : !lesson.isUnlocked ? (
                  <Lock className="w-6 h-6 text-brand-darkGrey" />
                ) : null}
                <h1 className="text-3xl font-bold text-brand-black">{lesson.title}</h1>
              </div>
              {!lesson.isUnlocked && (
                <div className="bg-brand-darkGrey/20 border border-brand-darkGrey rounded-lg p-3 mt-3">
                  <p className="text-brand-darkGrey">
                    {t('completePreviousLessons')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {lesson.isUnlocked && (
            <div className="flex items-center gap-4 text-sm text-brand-darkGrey">
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{lesson.pointsReward} {tCommon('points')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{lesson.xpReward} {tCommon('xp')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Content */}
        {lesson.isUnlocked ? (
          <>
            <div className="bg-brand-white rounded-xl p-8 border-2 border-brand-accent mb-6">
              <div
                className="prose prose-lg max-w-none text-brand-black"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </div>

            {/* Quiz Section */}
            {lesson.quizConfig?.enabled && !lesson.isCompleted && (
              <div className="mb-6">
                <LessonQuiz
                  courseId={courseId}
                  lessonId={lesson.lessonId}
                  quizConfig={lesson.quizConfig}
                  onComplete={handleQuizComplete}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-4">
              {navigation?.previous && (
                <LocaleLink
                  href={`/courses/${courseId}/day/${navigation.previous.day}`}
                  className="flex items-center gap-2 bg-brand-darkGrey text-brand-white px-6 py-3 rounded-lg font-bold hover:bg-brand-secondary-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {t('previousDay')}
                </LocaleLink>
              )}

              <div className="flex-1" />

              {!lesson.isCompleted ? (
                <button
                  onClick={handleComplete}
                  disabled={completing || (lesson.quizConfig?.enabled && lesson.quizConfig.required && !quizPassed)}
                  className="flex items-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                  {completing ? t('completing') : t('markAsComplete')}
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold">
                  <CheckCircle className="w-5 h-5" />
                  {t('completed')}
                </div>
              )}

              {navigation?.next && (
                <LocaleLink
                  href={`/courses/${courseId}/day/${navigation.next.day}`}
                  className="flex items-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
                >
                  {t('nextDay')}
                  <ArrowRight className="w-5 h-5" />
                </LocaleLink>
              )}
            </div>

            {/* Assessment Game */}
            {lesson.assessmentGameId && lesson.isCompleted && (
              <div className="bg-brand-accent/20 border-2 border-brand-accent rounded-xl p-6 mt-6">
                <h3 className="text-xl font-bold text-brand-black mb-2 flex items-center gap-2">
                  <Play className="w-6 h-6" />
                  {t('testYourKnowledge')}
                </h3>
                <p className="text-brand-darkGrey mb-4">
                  {t('assessmentDescription')}
                </p>
                {lesson.assessmentGameRoute ? (
                  <LocaleLink
                    href={`${lesson.assessmentGameRoute}?courseId=${courseId}&lessonDay=${dayNumber}&assessment=true`}
                    className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
                  >
                    {t('playAssessment')}
                  </LocaleLink>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        // Start game session with course context
                        const sessionResponse = await fetch('/api/game-sessions/start', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            playerId: session?.user?.id,
                            gameId: lesson.assessmentGameId,
                            courseId: courseId,
                            lessonDay: dayNumber,
                          }),
                        });

                        const sessionData = await sessionResponse.json();

                        if (sessionData.success && lesson.assessmentGameRoute) {
                          // Navigate to game with session context
                          router.push(`${lesson.assessmentGameRoute}?sessionId=${sessionData.sessionId}&courseId=${courseId}&lessonDay=${dayNumber}&assessment=true`);
                        } else {
                          alert(t('failedToStartAssessment'));
                        }
                      } catch (error) {
                        console.error('Failed to start assessment:', error);
                        alert(t('failedToStartAssessment'));
                      }
                    }}
                    className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
                  >
                    {t('playAssessment')}
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-brand-darkGrey rounded-xl p-12 text-center border-2 border-brand-accent">
            <Lock className="w-16 h-16 text-brand-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-brand-white mb-2">{t('lessonLocked')}</h3>
            <p className="text-brand-white/70 mb-6">
              {t('completePreviousLessons')}
            </p>
            {navigation?.previous && (
              <LocaleLink
                href={`/courses/${courseId}/day/${navigation.previous.day}`}
                className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
              >
                {t('goToDay', { day: navigation.previous.day })}
              </LocaleLink>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
