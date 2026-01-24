/**
 * Course Detail Page
 * 
 * What: Course overview and enrollment page
 * Why: Allows users to view course details and enroll
 */

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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

interface EntitlementStatus {
  certificationEnabled: boolean;
  certificationAvailable: boolean;
  entitlementOwned: boolean;
  premiumIncludesCertification: boolean;
  priceMoney?: { amount: number; currency: string } | null;
  pricePoints?: number | null;
  poolCount: number;
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
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentStatus | null>(null);
  const [entitlement, setEntitlement] = useState<EntitlementStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [courseId, setCourseId] = useState<string>('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  
  // Use URL locale for translations (guaranteed = course language by design)
  const t = useTranslations();

  // Static course detail page translations (like courseCardTranslations)
  // Ensures all course detail UI is in the course's native language, not URL locale
  const courseDetailTranslations: Record<string, Record<string, string>> = {
    hu: {
      aboutThisCourse: 'A kurzusról',
      whatYoullLearn: 'Mit fogsz tanulni',
      dailyLessons: 'Napi leckék',
      structuredLearning: '30 napos strukturált tanulás',
      pointsEarned: 'Pont szerzése befejezéskor',
      emailDelivery: 'E-mail kézbesítés',
      dailyLessonsSent: 'Napi leckék az e-mailbe küldve',
      interactiveAssessments: 'Interaktív értékelések',
      testKnowledge: 'Tudásod tesztelése játékokkal',
      tableOfContents: 'Tartalomjegyzék',
      dayOf: 'Nap {{currentDay}} / {{totalDays}}',
      daysCompleted: '{{count}} nap befejezve',
      continuelLearning: 'Tanulás folytatása',
      duration: 'Időtartam',
      pointsReward: 'Pont jutalma',
      days: 'nap',
      points: 'pont',
    },
    en: {
      aboutThisCourse: 'About This Course',
      whatYoullLearn: "What You'll Learn",
      dailyLessons: 'Daily Lessons',
      structuredLearning: 'Structured learning over 30 days',
      pointsEarned: 'Points earned for completion',
      emailDelivery: 'Email Delivery',
      dailyLessonsSent: 'Daily lessons sent to your email',
      interactiveAssessments: 'Interactive Assessments',
      testKnowledge: 'Test your knowledge with games',
      tableOfContents: 'Table of Contents',
      dayOf: 'Day {{currentDay}} of {{totalDays}}',
      daysCompleted: '{{count}} days completed',
      continuelLearning: 'Continue Learning',
      duration: 'Duration',
      pointsReward: 'Points Reward',
      days: 'days',
      points: 'points',
    },
    tr: {
      aboutThisCourse: 'Bu Kurs Hakkında',
      whatYoullLearn: 'Öğreneceklerin',
      dailyLessons: 'Günlük Dersler',
      structuredLearning: '30 günü kapsayan yapılandırılmış öğrenme',
      pointsEarned: 'Tamamlama için kazanılan puan',
      emailDelivery: 'E-posta Teslimi',
      dailyLessonsSent: 'Günlük dersler e-postanıza gönderildi',
      interactiveAssessments: 'İnteraktif Değerlendirmeler',
      testKnowledge: 'Oyunlarla bilginizi test edin',
      tableOfContents: 'İçindekiler',
      dayOf: '{{currentDay}}. Gün / {{totalDays}}. Gün',
      daysCompleted: '{{count}} gün tamamlandı',
      continuelLearning: 'Derslere Devam Et',
      duration: 'Süre',
      pointsReward: 'Puan Ödülü',
      days: 'gün',
      points: 'puan',
    },
    bg: {
      aboutThisCourse: 'За този курс',
      whatYoullLearn: 'Какво ще научиш',
      dailyLessons: 'Ежедневни уроци',
      structuredLearning: 'Структурирано обучение в продължение на 30 дни',
      pointsEarned: 'Точки, спечелени при завършване',
      emailDelivery: 'Доставка чрез имейл',
      dailyLessonsSent: 'Ежедневни уроци, изпращани до твоята електронна поща',
      interactiveAssessments: 'Интерактивни оценки',
      testKnowledge: 'Тествай своите знания с игри',
      tableOfContents: 'Съдържание',
      dayOf: 'Ден {{currentDay}} от {{totalDays}}',
      daysCompleted: '{{count}} дни завършени',
      continuelLearning: 'Продължи обучението',
      duration: 'Продължителност',
      pointsReward: 'Награда в точки',
      days: 'дни',
      points: 'точки',
    },
    pl: {
      aboutThisCourse: 'O tym kursie',
      whatYoullLearn: 'Czego się nauczysz',
      dailyLessons: 'Lekcje codzienne',
      structuredLearning: 'Uczenie strukturalne w ciągu 30 dni',
      pointsEarned: 'Punkty uzyskane za ukończenie',
      emailDelivery: 'Dostarczanie pocztą e-mail',
      dailyLessonsSent: 'Codzienne lekcje wysyłane na Twoją skrzynkę e-mail',
      interactiveAssessments: 'Interaktywne oceny',
      testKnowledge: 'Przetestuj swoją wiedzę za pomocą gier',
      tableOfContents: 'Spis treści',
      dayOf: 'Dzień {{currentDay}} z {{totalDays}}',
      daysCompleted: 'Ukończono {{count}} dni',
      continuelLearning: 'Kontynuuj naukę',
      duration: 'Czas trwania',
      pointsReward: 'Nagroda punktów',
      days: 'dni',
      points: 'punkty',
    },
    vi: {
      aboutThisCourse: 'Về khóa học này',
      whatYoullLearn: 'Những gì bạn sẽ học',
      dailyLessons: 'Bài học hàng ngày',
      structuredLearning: 'Học tập có cấu trúc trong vòng 30 ngày',
      pointsEarned: 'Điểm kiếm được khi hoàn thành',
      emailDelivery: 'Giao hàng qua e-mail',
      dailyLessonsSent: 'Các bài học hàng ngày được gửi đến email của bạn',
      interactiveAssessments: 'Đánh giá tương tác',
      testKnowledge: 'Kiểm tra kiến thức của bạn bằng trò chơi',
      tableOfContents: 'Mục lục',
      dayOf: 'Ngày {{currentDay}} của {{totalDays}}',
      daysCompleted: '{{count}} ngày hoàn thành',
      continuelLearning: 'Tiếp tục học tập',
      duration: 'Thời lượng',
      pointsReward: 'Phần thưởng điểm',
      days: 'ngày',
      points: 'điểm',
    },
    id: {
      aboutThisCourse: 'Tentang Kursus Ini',
      whatYoullLearn: 'Apa yang Akan Anda Pelajari',
      dailyLessons: 'Pelajaran Harian',
      structuredLearning: 'Pembelajaran terstruktur selama 30 hari',
      pointsEarned: 'Poin yang diperoleh saat penyelesaian',
      emailDelivery: 'Pengiriman Email',
      dailyLessonsSent: 'Pelajaran harian dikirim ke email Anda',
      interactiveAssessments: 'Penilaian Interaktif',
      testKnowledge: 'Uji pengetahuan Anda dengan permainan',
      tableOfContents: 'Daftar Isi',
      dayOf: 'Hari {{currentDay}} dari {{totalDays}}',
      daysCompleted: '{{count}} hari selesai',
      continuelLearning: 'Lanjutkan Pembelajaran',
      duration: 'Durasi',
      pointsReward: 'Hadiah Poin',
      days: 'hari',
      points: 'poin',
    },
    ar: {
      aboutThisCourse: 'عن هذه الدورة',
      whatYoullLearn: 'ما ستتعلمه',
      dailyLessons: 'دروس يومية',
      structuredLearning: 'تعلم منظم لمدة 30 يوماً',
      pointsEarned: 'النقاط المكتسبة عند الانتهاء',
      emailDelivery: 'التسليم عبر البريد الإلكتروني',
      dailyLessonsSent: 'تُرسل الدروس اليومية إلى بريدك الإلكتروني',
      interactiveAssessments: 'التقييمات التفاعلية',
      testKnowledge: 'اختبر معرفتك من خلال الألعاب',
      tableOfContents: 'جدول المحتويات',
      dayOf: 'اليوم {{currentDay}} من {{totalDays}}',
      daysCompleted: 'تم الانتهاء من {{count}} يوم',
      continuelLearning: 'متابعة التعلم',
      duration: 'المدة الزمنية',
      pointsReward: 'مكافأة النقاط',
      days: 'أيام',
      points: 'نقاط',
    },
    pt: {
      aboutThisCourse: 'Sobre Este Curso',
      whatYoullLearn: 'O Que Você Aprenderá',
      dailyLessons: 'Aulas Diárias',
      structuredLearning: 'Aprendizado estruturado ao longo de 30 dias',
      pointsEarned: 'Pontos obtidos na conclusão',
      emailDelivery: 'Entrega por E-mail',
      dailyLessonsSent: 'Aulas diárias enviadas para seu e-mail',
      interactiveAssessments: 'Avaliações Interativas',
      testKnowledge: 'Teste seu conhecimento com jogos',
      tableOfContents: 'Índice',
      dayOf: 'Dia {{currentDay}} de {{totalDays}}',
      daysCompleted: '{{count}} dias concluídos',
      continuelLearning: 'Continuar Aprendizado',
      duration: 'Duração',
      pointsReward: 'Recompensa de Pontos',
      days: 'dias',
      points: 'pontos',
    },
    hi: {
      aboutThisCourse: 'इस कोर्स के बारे में',
      whatYoullLearn: 'आप क्या सीखेंगे',
      dailyLessons: 'दैनिक पाठ',
      structuredLearning: '30 दिनों में संरचित सीखना',
      pointsEarned: 'पूरा करने पर अर्जित अंक',
      emailDelivery: 'ईमेल डिलीवरी',
      dailyLessonsSent: 'दैनिक पाठ आपके ईमेल पर भेजे गए',
      interactiveAssessments: 'इंटरैक्टिव मूल्यांकन',
      testKnowledge: 'गेम के साथ अपने ज्ञान का परीक्षण करें',
      tableOfContents: 'विषय सूची',
      dayOf: 'दिन {{currentDay}} / {{totalDays}}',
      daysCompleted: '{{count}} दिन पूरे हुए',
      continuelLearning: 'सीखना जारी रखें',
      duration: 'अवधि',
      pointsReward: 'अंक पुरस्कार',
      days: 'दिन',
      points: 'अंक',
    },
    ru: {
      aboutThisCourse: 'Об этом курсе',
      whatYoullLearn: 'Что вы научитесь',
      dailyLessons: 'Ежедневные уроки',
      structuredLearning: 'Структурированное обучение в течение 30 дней',
      pointsEarned: 'Баллы получены при завершении',
      emailDelivery: 'Доставка по электронной почте',
      dailyLessonsSent: 'Ежедневные уроки отправляются на вашу электронную почту',
      interactiveAssessments: 'Интерактивные оценки',
      testKnowledge: 'Проверьте свои знания с помощью игр',
      tableOfContents: 'Оглавление',
      dayOf: 'День {{currentDay}} из {{totalDays}}',
      daysCompleted: '{{count}} дней завершено',
      continuelLearning: 'Продолжить обучение',
      duration: 'Продолжительность',
      pointsReward: 'Награда баллами',
      days: 'дни',
      points: 'баллы',
    },
  };

  // Helper function to get course detail translations based on course language
  const getCourseDetailTexts = () => {
    if (!course) return courseDetailTranslations.en;
    return courseDetailTranslations[course.language as keyof typeof courseDetailTranslations] || courseDetailTranslations.en;
  };

  // Helper function to substitute parameters in course detail translations
  const getCourseDetailText = (key: keyof typeof courseDetailTranslations.en, params?: Record<string, string | number>): string => {
    let text = getCourseDetailTexts()[key] || '';
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{{${paramKey}}}`, String(paramValue));
      });
    }
    return text;
  };

  const tocLessons = useMemo(
    () => [...lessons].sort((a, b) => a.dayNumber - b.dayNumber),
    [lessons]
  );

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.courseId;
      setCourseId(id);
      await Promise.all([
        fetchCourse(id),
        checkEnrollment(id),
        checkPremiumStatus(),
        fetchLessons(id),
        fetchEntitlement(id),
      ]);

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
        // Trust architecture: Card links guarantee URL locale = course language
        // No redirect or courseLanguage extraction needed
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntitlement = async (cid: string) => {
    try {
      const res = await fetch(`/api/certification/entitlement?courseId=${cid}`);
      const data = await res.json();
      if (data.success) {
        setEntitlement(data.data);
      } else {
        setEntitlement(null);
      }
    } catch (error) {
      setEntitlement(null);
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

  const fetchLessons = async (cid: string, opts: { silent?: boolean } = {}) => {
    if (!opts.silent) {
      setLoadingLessons(true);
    }
    try {
      const response = await fetch(`/api/courses/${cid}/lessons`);
      const data = await response.json();
      if (data.success) {
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      if (!opts.silent) {
        setLoadingLessons(false);
      }
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

  const renderCertificationBlock = () => {
    if (!course || !entitlement) return null;
    const completed = Boolean(enrollment?.progress?.isCompleted);
    const poolOk = entitlement.certificationEnabled && entitlement.poolCount >= 50;
    const hasEntitlement = entitlement.entitlementOwned;

    let statusLabel = 'Certification unavailable';
    let cta: JSX.Element | null = null;

    if (!entitlement.certificationEnabled) {
      statusLabel = 'Certification unavailable';
    } else if (!poolOk) {
      statusLabel = `Certification unavailable (pool ${entitlement.poolCount}/50)`;
    } else if (!completed) {
      statusLabel = 'Complete the course to unlock certification';
    } else if (completed && poolOk && !hasEntitlement) {
      statusLabel = 'Completed, certificate available';
      cta = (
        <div className="flex flex-wrap gap-2">
          {entitlement.pricePoints ? (
            <button
              onClick={() => fetch(`/api/certification/entitlement/redeem-points`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId }),
              }).then(() => fetchEntitlement(courseId))}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
            >
              Redeem points ({entitlement.pricePoints})
            </button>
          ) : null}
          <button
            disabled
            className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
          >
            Pay (coming soon)
          </button>
        </div>
      );
    } else if (completed && poolOk && hasEntitlement) {
      statusLabel = 'Certification unlocked';
      cta = (
        <LocaleLink
          href={`/courses/${courseId}/final-exam`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
        >
          <Award className="w-4 h-4" />
          Start final exam
        </LocaleLink>
      );
    }

    return (
      <div className="bg-brand-darkGrey border-2 border-brand-accent rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-brand-white">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="font-semibold">Certification</span>
        </div>
        <p className="text-brand-white/80 text-sm">{statusLabel}</p>
        {cta}
      </div>
    );
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
        // Redirect to first lesson
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
    <div className="min-h-screen bg-brand-black" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-5 sm:py-7">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Logo size="sm" showText={false} linkTo={session ? "/dashboard" : "/"} className="flex-shrink-0" />
            <LocaleLink
              href="/courses"
              className="inline-flex items-center gap-2 text-brand-white hover:text-brand-accent"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('backToCourses')}
            </LocaleLink>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-brand-white leading-tight">{course.name}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-8 sm:py-10 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {course.thumbnail ? (
              <div className="w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={course.thumbnail}
                  alt={course.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    (e.target as HTMLImageElement).src = '/icon-192.svg';
                  }}
                />
              </div>
            ) : (
              <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-brand-accent to-brand-primary-400 flex items-center justify-center" style={{ aspectRatio: '16/9' }}>
                <BookOpen className="w-20 h-20 text-brand-white opacity-50" />
              </div>
            )}

            <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-4">{getCourseDetailTexts().aboutThisCourse}</h2>
              <p className="text-brand-darkGrey leading-relaxed text-base sm:text-xl">{course.description}</p>
            </div>

            <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-5">{getCourseDetailTexts().whatYoullLearn}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-brand-black text-lg">{course.durationDays} {getCourseDetailTexts().dailyLessons}</h3>
                    <p className="text-base text-brand-darkGrey">{getCourseDetailTexts().structuredLearning}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-brand-black text-lg">{course.pointsConfig.completionPoints} {getCourseDetailTexts().points}</h3>
                    <p className="text-base text-brand-darkGrey">{getCourseDetailTexts().pointsEarned}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-brand-black text-lg">{getCourseDetailTexts().emailDelivery}</h3>
                    <p className="text-base text-brand-darkGrey">{getCourseDetailTexts().dailyLessonsSent}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Play className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-brand-black text-lg">{getCourseDetailTexts().interactiveAssessments}</h3>
                    <p className="text-base text-brand-darkGrey">{getCourseDetailTexts().testKnowledge}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-6">{getCourseDetailTexts().tableOfContents}</h2>
              {loadingLessons && tocLessons.length === 0 ? (
                <div className="text-brand-darkGrey text-center py-8">{t('loading')}</div>
              ) : tocLessons.length === 0 ? (
                <div className="text-brand-darkGrey text-center py-8">{t('noLessonsAvailable')}</div>
              ) : (
                <div className="space-y-3">
                  {tocLessons.map((lesson) => (
                    <div
                      key={lesson.lessonId}
                      className="flex items-center gap-4 p-4 bg-brand-darkGrey/5 rounded-lg border border-brand-darkGrey/15"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-brand-darkGrey text-lg bg-gradient-to-br from-white to-brand-darkGrey/10 border border-brand-darkGrey/20">
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
            <div className="bg-brand-white rounded-2xl p-7 border-2 border-brand-accent sticky top-6 shadow-lg hidden md:block">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-brand-darkGrey text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    {getCourseDetailTexts().duration}
                  </div>
                  <div className="text-2xl font-bold text-brand-black">{course.durationDays} {getCourseDetailTexts().days}</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-brand-darkGrey text-sm mb-1">
                    <Award className="w-4 h-4" />
                    {getCourseDetailTexts().pointsReward}
                  </div>
                  <div className="text-2xl font-bold text-brand-black">
                    {course.pointsConfig.completionPoints} {getCourseDetailTexts().points}
                  </div>
                </div>

                {course.requiresPremium && (
                  <div className="bg-brand-darkGrey/5 border border-brand-darkGrey/25 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-brand-darkGrey font-bold text-base mb-2">
                      <Star className="w-5 h-5 text-brand-darkGrey" />
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
                        {getCourseDetailText('dayOf', {
                          currentDay: enrollment.progress.currentDay,
                          totalDays: course.durationDays,
                        })}
                      </div>
                      <div className="mt-1 text-xs">
                        {getCourseDetailText('daysCompleted', {
                          count: enrollment.progress.completedDays,
                        })}
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

          {/* Certification block */}
          <div className="mt-6">
            {renderCertificationBlock()}
          </div>
        </div>

        {/* Mobile CTA bar */}
        {course && (
          <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-darkGrey/95 backdrop-blur border-t border-brand-accent px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 text-brand-white text-sm leading-tight">
                <div className="font-bold text-base line-clamp-1">{course.name}</div>
                {enrollment?.progress && (
                  <div className="text-xs opacity-80">
                    {getCourseDetailText('dayOf', { currentDay: enrollment.progress.currentDay, totalDays: course.durationDays })} • {getCourseDetailText('daysCompleted', { count: enrollment.progress.completedDays })}
                  </div>
                )}
              </div>

              <div className="flex-1 flex justify-end">
                {enrollment?.enrolled ? (
                  <LocaleLink
                    href={`/courses/${courseId}/day/${enrollment.progress?.currentDay || 1}`}
                    className="w-full bg-brand-accent text-brand-black px-4 py-2.5 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-colors text-sm"
                  >
                    {t('continueLearning')}
                  </LocaleLink>
                ) : !session ? (
                  <LocaleLink
                    href={`/auth/signin?callbackUrl=${encodeURIComponent(`/${locale}/courses/${courseId}`)}`}
                    className="w-full bg-brand-accent text-brand-black px-4 py-2.5 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-colors text-sm"
                  >
                    {t('signInToEnroll')}
                  </LocaleLink>
                ) : course.requiresPremium && !isPremium ? (
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full bg-brand-accent text-brand-black px-4 py-2.5 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {purchasing ? t('purchasing') : t('purchasePremium')}
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-brand-accent text-brand-black px-4 py-2.5 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {enrolling ? t('enrolling') : t('enrollNow')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
