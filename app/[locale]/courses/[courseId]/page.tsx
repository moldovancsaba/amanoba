/**
 * Course Detail Page
 * 
 * What: Course overview and enrollment page
 * Why: Allows students to view course details and enroll
 */

'use client';

import { useState, useEffect, useRef } from 'react';
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
import Logo from '@/components/Logo';
import { getLocaleForLanguage } from '@/lib/locale-utils';

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
  price?: {
    amount: number;
    currency: string;
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

interface Lesson {
  lessonId: string;
  dayNumber: number;
  title: string;
  estimatedMinutes?: number;
  hasQuiz: boolean;
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
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [certificate, setCertificate] = useState<any | null>(null);
  const [issuingCertificate, setIssuingCertificate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.courseId;
      setCourseId(id);
      await Promise.all([fetchCourse(id), checkEnrollment(id), checkPremiumStatus(), fetchLessons(id)]);
      await fetchCertificate(id);

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
        const courseData = data.course;
        setCourse(courseData);
        
        // Redirect to correct locale if course language doesn't match URL locale
        // Only redirect once to prevent infinite loops
        if (!hasRedirectedRef.current && courseData.language) {
          const courseLocale = getLocaleForLanguage(courseData.language);
          
          // Only redirect if the locale is different and valid
          if (courseLocale && courseLocale !== locale) {
            hasRedirectedRef.current = true;
            // Replace to avoid redirect loops and extra history entries
            router.replace(`/${courseLocale}/courses/${cid}`);
            return;
          }
        }
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

  const fetchLessons = async (cid: string) => {
    setLoadingLessons(true);
    try {
      const response = await fetch(`/api/courses/${cid}/lessons`);
      const data = await response.json();
      if (data.success) {
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setLoadingLessons(false);
    }
  };

  const fetchCertificate = async (cid: string) => {
    if (!session) return;
    try {
      const response = await fetch(`/api/certificates/by-course?courseId=${cid}`);
      const data = await response.json();
      if (data.success) {
        setCertificate(data.certificate || null);
      }
    } catch (error) {
      console.error('Failed to fetch certificate:', error);
    }
  };

  const handleIssueCertificate = async () => {
    if (!courseId || issuingCertificate) return;
    try {
      setIssuingCertificate(true);
      const response = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json();
      if (data.success) {
        setCertificate(data.certificate);
      } else {
        alert(data.error || t('certificateIssueFailed'));
      }
    } catch (error) {
      console.error('Failed to issue certificate:', error);
      alert(t('certificateIssueFailed'));
    } finally {
      setIssuingCertificate(false);
    }
  };

  const formatCurrency = (amount: number, currency: string): string => {
    const formatter = new Intl.NumberFormat(
      currency === 'huf' ? 'hu-HU' : currency === 'eur' ? 'de-DE' : currency === 'gbp' ? 'en-GB' : 'en-US',
      {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: currency === 'huf' ? 0 : 2,
        maximumFractionDigits: currency === 'huf' ? 0 : 2,
      }
    );
    // Convert from cents to main unit
    const mainUnit = currency === 'huf' ? amount : amount / 100;
    return formatter.format(mainUnit);
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
        // Redirect directly to first lesson
        router.push(`/${locale}/courses/${courseId}/day/1`);
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
    setError(null);
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

      if (!response.ok) {
        // Handle HTTP error responses
        const errorMessage = data.error || data.message || t('paymentFailed');
        console.error('Payment error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          details: data.details,
        });
        setError(errorMessage);
        setPurchasing(false);
        return;
      }

      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        const errorMessage = data.error || t('paymentFailed');
        console.error('Payment failed:', data);
        setError(errorMessage);
        setPurchasing(false);
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
      const errorMessage = error instanceof Error ? error.message : t('paymentFailed');
      setError(errorMessage);
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
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-7">
          <div className="flex items-center gap-4 mb-4">
            <Logo size="sm" showText={false} linkTo={session ? "/dashboard" : "/"} className="flex-shrink-0" />
            <LocaleLink
              href="/courses"
              className="inline-flex items-center gap-2 text-brand-white hover:text-brand-accent"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('backToCourses')}
            </LocaleLink>
          </div>
          <h1 className="text-4xl font-bold text-brand-white leading-tight">{course.name}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {course.thumbnail && (
              <div className="w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={course.thumbnail}
                  alt={course.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg">
              <h2 className="text-3xl font-bold text-brand-black mb-4">{t('aboutThisCourse')}</h2>
              <p className="text-brand-darkGrey leading-relaxed text-xl">{course.description}</p>
            </div>

            <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg">
              <h2 className="text-3xl font-bold text-brand-black mb-5">{t('whatYoullLearn')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-brand-black text-lg">{course.durationDays} {t('dailyLessons')}</h3>
                    <p className="text-base text-brand-darkGrey">{t('structuredLearning')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-brand-black text-lg">{course.pointsConfig.completionPoints} {tCommon('points')}</h3>
                    <p className="text-base text-brand-darkGrey">{t('pointsEarned')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-brand-black text-lg">{t('emailDelivery')}</h3>
                    <p className="text-base text-brand-darkGrey">{t('dailyLessonsSent')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Play className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-brand-black text-lg">{t('interactiveAssessments')}</h3>
                    <p className="text-base text-brand-darkGrey">{t('testKnowledge')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg">
              <h2 className="text-3xl font-bold text-brand-black mb-6">{t('tableOfContents')}</h2>
              {loadingLessons ? (
                <div className="text-brand-darkGrey text-center py-8">{tCommon('loading')}</div>
              ) : lessons.length === 0 ? (
                <div className="text-brand-darkGrey text-center py-8">{t('noLessonsAvailable')}</div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.lessonId}
                      className="flex items-center gap-4 p-4 bg-brand-darkGrey/5 rounded-lg border border-brand-darkGrey/20 hover:bg-brand-darkGrey/10 transition-colors"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center font-bold text-brand-black text-lg">
                        {lesson.dayNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-brand-black text-lg truncate mb-1">{lesson.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-brand-darkGrey">
                          <span>{t('day')} {lesson.dayNumber}</span>
                          {lesson.estimatedMinutes && (
                            <span>• {lesson.estimatedMinutes} {t('minutes')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-brand-white rounded-2xl p-7 border-2 border-brand-accent sticky top-6 shadow-lg">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-brand-darkGrey text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    {t('duration')}
                  </div>
                  <div className="text-2xl font-bold text-brand-black">{course.durationDays} {t('days')}</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-brand-darkGrey text-sm mb-1">
                    <Award className="w-4 h-4" />
                    {t('pointsReward')}
                  </div>
                  <div className="text-2xl font-bold text-brand-black">
                    {course.pointsConfig.completionPoints} {t('points') || tCommon('points')}
                  </div>
                </div>

                {course.requiresPremium && (
                  <div className="bg-brand-accent/20 border border-brand-accent rounded-lg p-3">
                    <div className="flex items-center gap-2 text-brand-black font-bold text-base mb-2">
                      <Star className="w-5 h-5" />
                      {t('premiumCourse')}
                    </div>
                    {course.price && (
                      <div className="flex items-center gap-2 text-brand-black font-bold text-lg">
                        <CreditCard className="w-4 h-4" />
                        {formatCurrency(course.price.amount, course.price.currency)}
                      </div>
                    )}
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
                            {t('dayOf', {
                              currentDay: enrollment.progress.currentDay,
                              totalDays: course.durationDays,
                            })}
                          </div>
                          <div className="mt-1 text-xs">
                            {t('daysCompleted', { count: enrollment.progress.completedDays || 0 })}
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
                      href={`/courses/${courseId}/day/${enrollment.progress?.currentDay || 1}`}
                      className="block w-full bg-brand-accent text-brand-black px-5 py-3.5 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-colors text-base"
                    >
                      {t('continueLearning')}
                    </LocaleLink>
                    {enrollment.progress?.isCompleted && (
                      <div className="bg-brand-accent/10 border border-brand-accent rounded-lg p-3">
                        <div className="text-brand-darkGrey text-sm mb-3">
                          {t('certificateDescription')}
                        </div>
                        {certificate ? (
                          <div className="flex flex-wrap gap-2">
                            <LocaleLink
                              href={`/certificate/${certificate.verificationSlug}`}
                              className="bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400"
                            >
                              {t('viewCertificate')}
                            </LocaleLink>
                            {certificate.imageUrl && (
                              <a
                                href={certificate.imageUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-brand-darkGrey text-brand-white px-4 py-2 rounded-lg font-bold hover:bg-brand-secondary-700"
                              >
                                {t('downloadCertificateImage')}
                              </a>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={handleIssueCertificate}
                            disabled={issuingCertificate}
                            className="bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 disabled:opacity-60"
                          >
                            {issuingCertificate ? t('issuingCertificate') : t('issueCertificate')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : !session ? (
                  <LocaleLink
                    href={`/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}/courses/${courseId}`)}`}
                    className="block w-full bg-brand-accent text-brand-black px-5 py-3.5 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-colors text-base"
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
                    {error && (
                      <div className="bg-red-500/20 border border-red-500 rounded-lg p-3">
                        <div className="text-sm text-red-600 font-medium">
                          {error}
                        </div>
                        <button
                          onClick={() => setError(null)}
                          className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                        >
                          ✕ {tCommon('close') || 'Close'}
                        </button>
                      </div>
                    )}
                    <button
                      onClick={handlePurchase}
                      disabled={purchasing}
                      className="w-full bg-brand-accent text-brand-black px-5 py-3.5 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
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
                      className="w-full bg-brand-accent text-brand-black px-5 py-3.5 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      {enrolling ? t('enrolling') : t('enrollNow')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-brand-accent text-brand-black px-5 py-3.5 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
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
