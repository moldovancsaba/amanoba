/**
 * Course Detail Page
 * 
 * What: Course overview and enrollment page
 * Why: Allows students to view course details and enroll
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import {
  ArrowLeft,
  Calendar,
  Award,
  BookOpen,
  Star,
  CheckCircle,
  Play,
  CreditCard,
} from 'lucide-react';

interface Course {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  language: string;
  thumbnail?: string;
  isActive: boolean;
  requiresPremium: boolean;
  durationDays: number;
  pointsConfig: {
    completionPoints: number;
    lessonPoints: number;
  };
  xpConfig: {
    completionXP: number;
    lessonXP: number;
  };
  metadata?: {
    category?: string;
    difficulty?: string;
    estimatedHours?: number;
  };
}

interface EnrollmentStatus {
  enrolled: boolean;
  progress?: {
    currentDay: number;
    completedDays: number;
    isCompleted: boolean;
  };
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('courses');
  const tCommon = useTranslations('common');
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [courseId, setCourseId] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.courseId;
      setCourseId(id);
      await Promise.all([fetchCourse(id), checkEnrollment(id), checkPremiumStatus()]);

      // Check for payment success/failure in URL
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('payment_success') === 'true') {
        // Refresh premium status and enrollment
        await checkPremiumStatus();
        if (session) {
          await checkEnrollment(id);
        }
        // Show success message (optional: could use a toast notification)
        // Remove query param from URL
        window.history.replaceState({}, '', window.location.pathname);
      }
      if (urlParams.get('payment_error')) {
        // Show error message (optional: could use a toast notification)
        // Remove query param from URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    };
    loadData();
  }, [params, session]);

  const fetchCourse = async (cid: string) => {
    try {
      const response = await fetch(`/api/courses/${cid}`);
      const data = await response.json();
      if (data.success) {
        setCourse(data.course);
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async (cid: string) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/my-courses`);
      const data = await response.json();
      if (data.success) {
        const myCourse = data.courses.find(
          (c: any) => c.course.courseId === cid
        );
        if (myCourse) {
          setEnrollment({
            enrolled: true,
            progress: myCourse.progress,
          });
        } else {
          setEnrollment({ enrolled: false });
        }
      }
    } catch (error) {
      console.error('Failed to check enrollment:', error);
    }
  };

  const checkPremiumStatus = async () => {
    if (!session) {
      setIsPremium(false);
      return;
    }

    try {
      const user = session.user as { id?: string; playerId?: string };
      const playerId = user.playerId || user.id;
      if (!playerId) {
        setIsPremium(false);
        return;
      }

      const response = await fetch(`/api/players/${playerId}`);
      const data = await response.json();
      if (data.player) {
        setIsPremium(data.player.isPremium || false);
      }
    } catch (error) {
      console.error('Failed to check premium status:', error);
      setIsPremium(false);
    }
  };

  const handleEnroll = async () => {
    if (!session || !courseId) return;

    setEnrolling(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setEnrollment({
          enrolled: true,
          progress: {
            currentDay: 1,
            completedDays: 0,
            isCompleted: false,
          },
        });
        // Redirect to course dashboard
        router.push(`/${locale}/my-courses`);
      } else {
        alert(data.error || t('failedToEnroll'));
      }
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert(t('failedToEnroll'));
    } finally {
      setEnrolling(false);
    }
  };

  const handlePurchase = async () => {
    if (!session || !course || !courseId) return;

    setPurchasing(true);
    try {
      // Get pricing from course or use defaults
      const premiumDurationDays = 30;

      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: courseId,
          premiumDurationDays,
          // Amount and currency are optional - will be taken from course.price if not provided
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert(data.error || t('paymentFailed'));
        setPurchasing(false);
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
      alert(t('paymentFailed'));
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-brand-white text-xl">{t('loadingCourse')}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-white mb-4">{t('courseNotFound')}</h2>
          <LocaleLink
            href="/courses"
            className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400"
          >
            {t('backToCourses')}
          </LocaleLink>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <LocaleLink
            href="/courses"
            className="inline-flex items-center gap-2 text-brand-white hover:text-brand-accent mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('backToCourses')}
          </LocaleLink>
          <h1 className="text-3xl font-bold text-brand-white">{course.name}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {course.thumbnail && (
              <div className="w-full h-64 bg-brand-darkGrey rounded-xl overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent">
              <h2 className="text-2xl font-bold text-brand-black mb-4">{t('aboutThisCourse')}</h2>
              <p className="text-brand-darkGrey leading-relaxed">{course.description}</p>
            </div>

            <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent">
              <h2 className="text-2xl font-bold text-brand-black mb-4">{t('whatYoullLearn')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-brand-black">{course.durationDays} {t('dailyLessons')}</h3>
                    <p className="text-sm text-brand-darkGrey">{t('structuredLearning')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-brand-black">{course.pointsConfig.completionPoints} {tCommon('points')}</h3>
                    <p className="text-sm text-brand-darkGrey">{t('pointsEarned')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-brand-black">{t('emailDelivery')}</h3>
                    <p className="text-sm text-brand-darkGrey">{t('dailyLessonsSent')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Play className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-brand-black">{t('interactiveAssessments')}</h3>
                    <p className="text-sm text-brand-darkGrey">{t('testKnowledge')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent sticky top-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-brand-darkGrey text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    {t('duration')}
                  </div>
                  <div className="text-xl font-bold text-brand-black">{course.durationDays} {t('days')}</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-brand-darkGrey text-sm mb-1">
                    <Award className="w-4 h-4" />
                    {t('pointsReward')}
                  </div>
                  <div className="text-xl font-bold text-brand-black">
                    {course.pointsConfig.completionPoints} {tCommon('points')}
                  </div>
                </div>

                {course.requiresPremium && (
                  <div className="bg-brand-accent/20 border border-brand-accent rounded-lg p-3">
                    <div className="flex items-center gap-2 text-brand-black font-bold">
                      <Star className="w-5 h-5" />
                      {t('premiumCourse')}
                    </div>
                  </div>
                )}

                {enrollment?.enrolled ? (
                  <div className="space-y-3">
                    <div className="bg-green-500/20 border border-green-500 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                        <CheckCircle className="w-5 h-5" />
                        {t('enrolled')}
                      </div>
                      {enrollment.progress && (
                        <div className="text-sm text-brand-darkGrey">
                          <div>
                            {enrollment.progress.currentDay} {t('days')} a(z) {course.durationDays} {t('days')}ból
                          </div>
                          <div className="mt-2 bg-brand-darkGrey/20 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-brand-accent h-full transition-all"
                              style={{ width: `${(enrollment.progress.completedDays / course.durationDays) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <LocaleLink
                      href="/my-courses"
                      className="block w-full bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-colors"
                    >
                      {t('continueLearning')}
                    </LocaleLink>
                  </div>
                ) : !session ? (
                  <LocaleLink
                    href={`/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}/courses/${courseId}`)}`}
                    className="block w-full bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-colors"
                  >
                    {t('signInToEnroll')}
                  </LocaleLink>
                ) : course.requiresPremium && !isPremium ? (
                  <div className="space-y-3">
                    <div className="bg-brand-accent/20 border border-brand-accent rounded-lg p-3">
                      <div className="text-sm text-brand-darkGrey mb-3">
                        {t('premiumRequired')}
                      </div>
                    </div>
                    <button
                      onClick={handlePurchase}
                      disabled={purchasing}
                      className="w-full bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {purchasing ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          {t('purchasing')}
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          {t('purchasePremium')}
                        </>
                      )}
                    </button>
                  </div>
                ) : course.requiresPremium && isPremium ? (
                  <div className="space-y-3">
                    <div className="bg-green-500/20 border border-green-500 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                        <Star className="w-5 h-5" />
                        {t('alreadyPremium')}
                      </div>
                    </div>
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {enrolling ? t('enrolling') : t('enrollNow')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-brand-accent text-brand-black px-4 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? t('enrolling') : t('enrollNow')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
