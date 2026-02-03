/**
 * Course Detail Page
 * 
 * What: Course overview and enrollment page
 * Why: Allows users to view course details and enroll
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
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
  Trophy,
} from 'lucide-react';
import Image from 'next/image';
import Logo from '@/components/Logo';
import ContentVoteWidget from '@/components/ContentVoteWidget';
import CourseDiscussion from '@/components/CourseDiscussion';
import CourseStudyGroups from '@/components/CourseStudyGroups';
import { trackGAEvent } from '@/app/lib/analytics/ga-events';

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
  discussionEnabled?: boolean;
  leaderboardEnabled?: boolean;
  studyGroupsEnabled?: boolean;
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
  entitlementRequired?: boolean;
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
  const [thumbnailError, setThumbnailError] = useState(false);
  const [leaderboardEntries, setLeaderboardEntries] = useState<Array<{ rank: number; score: number; player?: { displayName?: string } | null }>>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  // All translations use course language via getCourseDetailText()

  // Static course detail page translations (like courseCardTranslations)
  // Ensures all course detail UI is in the course's native language, not URL locale
  const courseDetailTranslations: Record<string, Record<string, string>> = {
    hu: {
      aboutThisCourse: 'Mire számíthatsz',
      whatYoullLearn: 'Amit megtanulhatsz',
      dailyLessons: 'napos kurzus',
      structuredLearning: 'Napi 20-30 perces leckék, AI-támogatással',
      pointsEarned: 'Értékeljük a tudásod',
      emailDelivery: 'E-mailben megkapod',
      dailyLessonsSent: 'Minden nap új leckét kapsz emailben',
      interactiveAssessments: 'Játékos felmérések',
      testKnowledge: 'Játékosan tesztelheted a tudásod',
      tableOfContents: 'Tananyag',
      dayOf: '{{currentDay}}. nap / {{totalDays}}. napból',
      daysCompleted: '{{count}} nap kész',
      continuelLearning: 'Tanulás folytatása',
      duration: 'Időtartam',
      pointsReward: 'Pontok',
      days: 'nap',
      points: 'pont',
      enrolled: 'Beiratkozott',
      backToCourses: 'Vissza a kurzusokhoz',
      failedToEnroll: 'Nem sikerült beiratkozni a kurzusra',
      paymentFailed: 'Fizetés sikertelen',
      loadingCourse: 'Kurzus betöltése...',
      courseNotFound: 'Kurzus nem található',
      loading: 'Betöltés...',
      noLessonsAvailable: 'Jelenleg nincsenek elérhető leckék',
      day: 'Nap',
      minutes: 'perc',
      premiumCourse: 'Prémium kurzus',
      signInToEnroll: 'Jelentkezz be a feliratkozáshoz',
      premiumRequired: 'Prémium szükséges',
      purchasing: 'Vásárlás...',
      purchasePremium: 'Prémium vásárlása',
      alreadyPremium: 'Már van prémium hozzáférésed',
      enrolling: 'Feliratkozás...',
      enrollNow: 'Feliratkozás most',
      certification: 'Tanúsítvány',
      certificationUnavailable: 'Tanúsítvány nem elérhető',
      certificationUnavailablePool: 'Tanúsítvány nem elérhető (készlet {{poolCount}}/50)',
      completeCourseForCertification: 'Teljesítsd a kurzust a tanúsítvány feloldásához',
      certificationAvailable: 'Befejezve, tanúsítvány elérhető',
      certificationUnlocked: 'Tanúsítvány feloldva',
      redeemPointsCert: 'Pontok beváltása ({{points}})',
      startFinalExam: 'Végső vizsga indítása',
      courseLeaderboard: 'Ranglista',
      noLeaderboardYet: 'Még nincs rangsor. Teljesíts leckéket, hogy pontokat szerezve itt jelenj meg.',
      discussionTitle: 'Beszélgetés',
      discussionPlaceholder: 'Kérdés vagy megjegyzés...',
      discussionPost: 'Küldés',
      discussionReply: 'Válasz',
      discussionNoPosts: 'Még nincs hozzászólás.',
      discussionSignInToPost: 'Jelentkezz be a hozzászóláshoz.',
      discussionLoading: 'Betöltés...',
      discussionDelete: 'Törlés',
      discussionEdit: 'Szerkesztés',
      studyGroupsTitle: 'Tanulócsoportok',
      studyGroupsCreateGroup: 'Új csoport',
      studyGroupsGroupName: 'Csoport neve',
      studyGroupsCreate: 'Létrehozás',
      studyGroupsNoGroups: 'Még nincs tanulócsoport.',
      studyGroupsMembers: 'Tagok',
      studyGroupsJoin: 'Csatlakozás',
      studyGroupsLeave: 'Kilépés',
      studyGroupsSignInToJoin: 'Jelentkezz be a csatlakozáshoz.',
      studyGroupsLoading: 'Betöltés...',
    },
    en: {
      aboutThisCourse: 'Course Overview',
      whatYoullLearn: 'What You Get',
      dailyLessons: 'day course',
      structuredLearning: 'Daily 20-30 min lessons with AI support',
      pointsEarned: 'Earn points for completion',
      emailDelivery: 'Delivered to your inbox',
      dailyLessonsSent: 'New lessons emailed to you each day',
      interactiveAssessments: 'Interactive Quizzes',
      testKnowledge: 'Test your knowledge with games',
      tableOfContents: 'Curriculum',
      dayOf: 'Day {{currentDay}} of {{totalDays}}',
      daysCompleted: '{{count}} days complete',
      continuelLearning: 'Continue Learning',
      duration: 'Duration',
      pointsReward: 'Points',
      days: 'days',
      points: 'points',
      enrolled: 'Enrolled',
      backToCourses: 'Back to Courses',
      failedToEnroll: 'Failed to enroll in course',
      paymentFailed: 'Payment failed',
      loadingCourse: 'Loading course...',
      courseNotFound: 'Course not found',
      loading: 'Loading...',
      noLessonsAvailable: 'No lessons available at this time',
      day: 'Day',
      minutes: 'minutes',
      premiumCourse: 'Premium Course',
      signInToEnroll: 'Sign In to Enroll',
      premiumRequired: 'Premium Required',
      purchasing: 'Purchasing...',
      purchasePremium: 'Purchase Premium',
      alreadyPremium: 'You already have premium access',
      enrolling: 'Enrolling...',
      enrollNow: 'Enroll Now',
      certification: 'Certification',
      certificationUnavailable: 'Certification unavailable',
      certificationUnavailablePool: 'Certification unavailable (pool {{poolCount}}/50)',
      completeCourseForCertification: 'Complete the course to unlock certification',
      certificationAvailable: 'Completed, certificate available',
      certificationUnlocked: 'Certification unlocked',
      redeemPointsCert: 'Redeem points ({{points}})',
      startFinalExam: 'Start final exam',
      courseLeaderboard: 'Course leaderboard',
      noLeaderboardYet: 'No rankings yet. Complete lessons to earn points and appear here.',
      discussionTitle: 'Discussion',
      discussionPlaceholder: 'Ask a question or share a thought...',
      discussionPost: 'Post',
      discussionReply: 'Reply',
      discussionNoPosts: 'No posts yet.',
      discussionSignInToPost: 'Sign in to post.',
      discussionLoading: 'Loading...',
      discussionDelete: 'Delete',
      discussionEdit: 'Edit',
      studyGroupsTitle: 'Study Groups',
      studyGroupsCreateGroup: 'New group',
      studyGroupsGroupName: 'Group name',
      studyGroupsCreate: 'Create',
      studyGroupsNoGroups: 'No study groups yet.',
      studyGroupsMembers: 'Members',
      studyGroupsJoin: 'Join',
      studyGroupsLeave: 'Leave',
      studyGroupsSignInToJoin: 'Sign in to join a group.',
      studyGroupsLoading: 'Loading...',
    },
    tr: {
      aboutThisCourse: 'Kurs Özeti',
      whatYoullLearn: 'Neler Öğreneceksin',
      dailyLessons: 'günlük kurs',
      structuredLearning: 'Günde 20-30 dakikalık AI destekli dersler',
      pointsEarned: 'Tamamlama için puan kazan',
      emailDelivery: 'E-postana teslim edilir',
      dailyLessonsSent: 'Her gün yeni dersler e-postanızı alır',
      interactiveAssessments: 'Etkileşimli Testler',
      testKnowledge: 'Oyunlarla bilgini test et',
      tableOfContents: 'Müfredat',
      dayOf: 'Gün {{currentDay}} / {{totalDays}}',
      daysCompleted: '{{count}} gün tamamlandı',
      continuelLearning: 'Devam Et',
      duration: 'Süre',
      pointsReward: 'Puanlar',
      days: 'gün',
      points: 'puan',
      enrolled: 'Kaydoldu',
      backToCourses: 'Kurslara Geri Dön',
      certification: 'Sertifika',
      certificationUnavailable: 'Sertifika kullanılamıyor',
      certificationUnavailablePool: 'Sertifika kullanılamıyor (havuz {{poolCount}}/50)',
      completeCourseForCertification: 'Sertifikayı açmak için kursu tamamla',
      certificationAvailable: 'Tamamlandı, sertifika mevcut',
      certificationUnlocked: 'Sertifika açıldı',
      redeemPointsCert: 'Puan kullan ({{points}})',
      startFinalExam: 'Final sınavını başlat',
      failedToEnroll: 'Kursa kayıt olunamadı',
      paymentFailed: 'Ödeme başarısız',
      loadingCourse: 'Kurs yükleniyor...',
      courseNotFound: 'Kurs bulunamadı',
      loading: 'Yükleniyor...',
      noLessonsAvailable: 'Şu anda ders mevcut değil',
      day: 'Gün',
      minutes: 'dakika',
      premiumCourse: 'Premium Kurs',
      signInToEnroll: 'Kayıt olmak için giriş yap',
      premiumRequired: 'Premium Gerekli',
      purchasing: 'Satın alınıyor...',
      purchasePremium: 'Premium Satın Al',
      alreadyPremium: 'Zaten premium erişiminiz var',
      enrolling: 'Kayıt olunuyor...',
      enrollNow: 'Şimdi Kayıt Ol',
    },
    bg: {
      aboutThisCourse: 'Преглед на курса',
      whatYoullLearn: 'Какво получаваш',
      dailyLessons: 'дневен курс',
      structuredLearning: 'Ежедневни 20-30 минутни уроци с ИИ подкрепа',
      pointsEarned: 'Спечели точки при завършване',
      emailDelivery: 'Доставено в твоята пощенска кутия',
      dailyLessonsSent: 'Нови уроци ти се изпращат по имейл всеки ден',
      interactiveAssessments: 'Интерактивни Тестове',
      testKnowledge: 'Тествай своите знания с игри',
      tableOfContents: 'Учебен план',
      dayOf: 'Ден {{currentDay}} от {{totalDays}}',
      daysCompleted: '{{count}} дни завършени',
      continuelLearning: 'Продължи',
      duration: 'Продължител',
      pointsReward: 'Точки',
      days: 'дни',
      points: 'точки',
      enrolled: 'Записан',
      backToCourses: 'Назад към курсовете',
      certification: 'Сертификация',
      certificationUnavailable: 'Сертификацията не е налична',
      certificationUnavailablePool: 'Сертификацията не е налична (банка {{poolCount}}/50)',
      completeCourseForCertification: 'Завършете курса, за да отключите сертификация',
      certificationAvailable: 'Завършено, сертификат наличен',
      certificationUnlocked: 'Сертификацията е отключена',
      redeemPointsCert: 'Осребри точки ({{points}})',
      startFinalExam: 'Започнете финален изпит',
      failedToEnroll: 'Неуспешно записване в курс',
      paymentFailed: 'Неуспешно плащане',
      loadingCourse: 'Зареждане на курса...',
      courseNotFound: 'Курсът не е намерен',
      loading: 'Зареждане...',
      noLessonsAvailable: 'В момента няма налични уроци',
      day: 'Ден',
      minutes: 'минути',
      premiumCourse: 'Премиум курс',
      signInToEnroll: 'Влезте, за да се запишете',
      premiumRequired: 'Премиум е задължителен',
      purchasing: 'Купуване...',
      purchasePremium: 'Купете премиум',
      alreadyPremium: 'Вече имате премиум достъп',
      enrolling: 'Записване...',
      enrollNow: 'Запишете се сега',
    },
    pl: {
      aboutThisCourse: 'Przegląd Kursu',
      whatYoullLearn: 'Co otrzymujesz',
      dailyLessons: 'dniowy kurs',
      structuredLearning: 'Codzienne lekcje 20-30 minut wspierane przez AI',
      pointsEarned: 'Zdobądź punkty za ukończenie',
      emailDelivery: 'Dostarczane na Twoją skrzynkę',
      dailyLessonsSent: 'Codziennie dostaniesz nowe lekcje na email',
      interactiveAssessments: 'Interaktywne Quizy',
      testKnowledge: 'Testuj swoją wiedzę poprzez gry',
      tableOfContents: 'Program kursu',
      dayOf: 'Dzień {{currentDay}} z {{totalDays}}',
      daysCompleted: '{{count}} dni ukończone',
      continuelLearning: 'Kontynuuj',
      duration: 'Czas trwania',
      pointsReward: 'Punkty',
      days: 'dni',
      points: 'punkty',
      enrolled: 'Zapisany',
      backToCourses: 'Wróć do kursów',
      certification: 'Certyfikacja',
      certificationUnavailable: 'Certyfikacja niedostępna',
      certificationUnavailablePool: 'Certyfikacja niedostępna (pula {{poolCount}}/50)',
      completeCourseForCertification: 'Ukończ kurs, aby odblokować certyfikację',
      certificationAvailable: 'Ukończono, certyfikat dostępny',
      certificationUnlocked: 'Certyfikacja odblokowana',
      redeemPointsCert: 'Wymień punkty ({{points}})',
      startFinalExam: 'Rozpocznij egzamin końcowy',
      failedToEnroll: 'Nie udało się zapisać na kurs',
      paymentFailed: 'Płatność nie powiodła się',
      loadingCourse: 'Ładowanie kursu...',
      courseNotFound: 'Kurs nie został znaleziony',
      loading: 'Ładowanie...',
      noLessonsAvailable: 'Obecnie brak dostępnych lekcji',
      day: 'Dzień',
      minutes: 'minuty',
      premiumCourse: 'Kurs Premium',
      signInToEnroll: 'Zaloguj się, aby się zapisać',
      premiumRequired: 'Wymagany Premium',
      purchasing: 'Kupowanie...',
      purchasePremium: 'Kup Premium',
      alreadyPremium: 'Masz już dostęp premium',
      enrolling: 'Zapisywanie...',
      enrollNow: 'Zapisz się teraz',
    },
    vi: {
      aboutThisCourse: 'Tổng Quan Khóa Học',
      whatYoullLearn: 'Những Gì Bạn Nhận Được',
      dailyLessons: 'ngày khóa học',
      structuredLearning: 'Các bài học 20-30 phút mỗi ngày hỗ trợ AI',
      pointsEarned: 'Kiếm điểm khi hoàn thành',
      emailDelivery: 'Gửi đến hộp thư của bạn',
      dailyLessonsSent: 'Mỗi ngày bạn nhận được bài học mới qua email',
      interactiveAssessments: 'Bài Kiểm Tra Tương Tác',
      testKnowledge: 'Kiểm tra kiến thức qua trò chơi',
      tableOfContents: 'Chương Trình Học',
      dayOf: 'Ngày {{currentDay}} / {{totalDays}}',
      daysCompleted: '{{count}} ngày hoàn thành',
      continuelLearning: 'Tiếp Tục',
      duration: 'Thời Gian',
      pointsReward: 'Điểm',
      days: 'ngày',
      points: 'điểm',
      enrolled: 'Đã đăng ký',
      backToCourses: 'Quay lại các khóa học',
      certification: 'Chứng Chỉ',
      certificationUnavailable: 'Chứng chỉ không khả dụng',
      certificationUnavailablePool: 'Chứng chỉ không khả dụng (nhóm {{poolCount}}/50)',
      completeCourseForCertification: 'Hoàn thành khóa học để mở khóa chứng chỉ',
      certificationAvailable: 'Đã hoàn thành, chứng chỉ có sẵn',
      certificationUnlocked: 'Chứng chỉ đã mở khóa',
      redeemPointsCert: 'Đổi điểm ({{points}})',
      startFinalExam: 'Bắt đầu bài kiểm tra cuối',
      failedToEnroll: 'Không thể đăng ký khóa học',
      paymentFailed: 'Thanh toán thất bại',
      loadingCourse: 'Đang tải khóa học...',
      courseNotFound: 'Không tìm thấy khóa học',
      loading: 'Đang tải...',
      noLessonsAvailable: 'Hiện tại không có bài học nào',
      day: 'Ngày',
      minutes: 'phút',
      premiumCourse: 'Khóa Học Premium',
      signInToEnroll: 'Đăng nhập để đăng ký',
      premiumRequired: 'Yêu Cầu Premium',
      purchasing: 'Đang mua...',
      purchasePremium: 'Mua Premium',
      alreadyPremium: 'Bạn đã có quyền truy cập premium',
      enrolling: 'Đang đăng ký...',
      enrollNow: 'Đăng Ký Ngay',
    },
    id: {
      aboutThisCourse: 'Ringkasan Kursus',
      whatYoullLearn: 'Apa yang Anda Dapatkan',
      dailyLessons: 'hari kursus',
      structuredLearning: 'Pelajaran harian 20-30 menit dengan dukungan AI',
      pointsEarned: 'Dapatkan poin saat menyelesaikan',
      emailDelivery: 'Dikirim ke inbox Anda',
      dailyLessonsSent: 'Setiap hari Anda menerima pelajaran baru lewat email',
      interactiveAssessments: 'Kuis Interaktif',
      testKnowledge: 'Uji pengetahuan Anda lewat permainan',
      tableOfContents: 'Kurikulum',
      dayOf: 'Hari {{currentDay}} dari {{totalDays}}',
      daysCompleted: '{{count}} hari selesai',
      continuelLearning: 'Lanjutkan',
      duration: 'Durasi',
      pointsReward: 'Poin',
      days: 'hari',
      points: 'poin',
      enrolled: 'Terdaftar',
      backToCourses: 'Kembali ke Kursus',
      certification: 'Sertifikasi',
      certificationUnavailable: 'Sertifikasi tidak tersedia',
      certificationUnavailablePool: 'Sertifikasi tidak tersedia (pool {{poolCount}}/50)',
      completeCourseForCertification: 'Selesaikan kursus untuk membuka kunci sertifikasi',
      certificationAvailable: 'Selesai, sertifikat tersedia',
      certificationUnlocked: 'Sertifikasi terbuka',
      redeemPointsCert: 'Tukar poin ({{points}})',
      startFinalExam: 'Mulai ujian akhir',
      failedToEnroll: 'Gagal mendaftar ke kursus',
      paymentFailed: 'Pembayaran gagal',
      loadingCourse: 'Memuat kursus...',
      courseNotFound: 'Kursus tidak ditemukan',
      loading: 'Memuat...',
      noLessonsAvailable: 'Saat ini tidak ada pelajaran yang tersedia',
      day: 'Hari',
      minutes: 'menit',
      premiumCourse: 'Kursus Premium',
      signInToEnroll: 'Masuk untuk mendaftar',
      premiumRequired: 'Premium Diperlukan',
      purchasing: 'Membeli...',
      purchasePremium: 'Beli Premium',
      alreadyPremium: 'Anda sudah memiliki akses premium',
      enrolling: 'Mendaftar...',
      enrollNow: 'Daftar Sekarang',
    },
    ar: {
      aboutThisCourse: 'نظرة عامة على الدورة',
      whatYoullLearn: 'ما ستحصل عليه',
      dailyLessons: 'يوم دورة',
      structuredLearning: 'دروس يومية 20-30 دقيقة بدعم الذكاء الاصطناعي',
      pointsEarned: 'اكسب نقاطاً عند الإكمال',
      emailDelivery: 'يتم إرسالها إلى بريدك',
      dailyLessonsSent: 'تتلقى دروساً جديدة عبر البريد الإلكتروني كل يوم',
      interactiveAssessments: 'اختبارات تفاعلية',
      testKnowledge: 'اختبر معرفتك من خلال الألعاب',
      tableOfContents: 'المنهاج',
      dayOf: 'اليوم {{currentDay}} من {{totalDays}}',
      daysCompleted: '{{count}} يوم مكتمل',
      continuelLearning: 'متابعة',
      duration: 'المدة',
      pointsReward: 'النقاط',
      days: 'أيام',
      points: 'نقاط',
      enrolled: 'مسجل',
      backToCourses: 'العودة للدورات',
      certification: 'الشهادة',
      certificationUnavailable: 'الشهادة غير متاحة',
      certificationUnavailablePool: 'الشهادة غير متاحة (المجموعة {{poolCount}}/50)',
      completeCourseForCertification: 'أكمل الدورة لفتح الشهادة',
      certificationAvailable: 'مكتمل، الشهادة متاحة',
      certificationUnlocked: 'تم فتح الشهادة',
      redeemPointsCert: 'استبدال النقاط ({{points}})',
      startFinalExam: 'بدء الامتحان النهائي',
      failedToEnroll: 'فشل التسجيل في الدورة',
      paymentFailed: 'فشلت عملية الدفع',
      loadingCourse: 'جارٍ تحميل الدورة...',
      courseNotFound: 'الدورة غير موجودة',
      loading: 'جارٍ التحميل...',
      noLessonsAvailable: 'لا توجد دروس متاحة حالياً',
      day: 'يوم',
      minutes: 'دقائق',
      premiumCourse: 'دورة مميزة',
      signInToEnroll: 'قم بتسجيل الدخول للتسجيل',
      premiumRequired: 'مطلوب اشتراك مميز',
      purchasing: 'جارٍ الشراء...',
      purchasePremium: 'شراء الاشتراك المميز',
      alreadyPremium: 'لديك بالفعل اشتراك مميز',
      enrolling: 'جارٍ التسجيل...',
      enrollNow: 'سجل الآن',
    },
    pt: {
      aboutThisCourse: 'Visão Geral do Curso',
      whatYoullLearn: 'O Que Você Recebe',
      dailyLessons: 'dias curso',
      structuredLearning: 'Aulas de 20-30 min diárias com suporte de IA',
      pointsEarned: 'Ganhe pontos ao concluir',
      emailDelivery: 'Entregue na sua caixa de entrada',
      dailyLessonsSent: 'Você recebe novas aulas por email todos os dias',
      interactiveAssessments: 'Quizzes Interativos',
      testKnowledge: 'Teste seu conhecimento com jogos',
      tableOfContents: 'Currículo',
      dayOf: 'Dia {{currentDay}} de {{totalDays}}',
      daysCompleted: '{{count}} dias concluídos',
      continuelLearning: 'Continuar',
      duration: 'Duração',
      pointsReward: 'Pontos',
      days: 'dias',
      points: 'pontos',
      enrolled: 'Inscrito',
      backToCourses: 'Voltar aos Cursos',
      certification: 'Certificação',
      certificationUnavailable: 'Certificação indisponível',
      certificationUnavailablePool: 'Certificação indisponível (pool {{poolCount}}/50)',
      completeCourseForCertification: 'Complete o curso para desbloquear a certificação',
      certificationAvailable: 'Concluído, certificado disponível',
      certificationUnlocked: 'Certificação desbloqueada',
      redeemPointsCert: 'Resgatar pontos ({{points}})',
      startFinalExam: 'Iniciar exame final',
      failedToEnroll: 'Falha ao se inscrever no curso',
      paymentFailed: 'Pagamento falhou',
      loadingCourse: 'Carregando curso...',
      courseNotFound: 'Curso não encontrado',
      loading: 'Carregando...',
      noLessonsAvailable: 'Nenhuma aula disponível no momento',
      day: 'Dia',
      minutes: 'minutos',
      premiumCourse: 'Curso Premium',
      signInToEnroll: 'Entre para se inscrever',
      premiumRequired: 'Premium Obrigatório',
      purchasing: 'Comprando...',
      purchasePremium: 'Comprar Premium',
      alreadyPremium: 'Você já tem acesso premium',
      enrolling: 'Inscrevendo...',
      enrollNow: 'Inscrever-se Agora',
    },
    hi: {
      aboutThisCourse: 'कोर्स की जानकारी',
      whatYoullLearn: 'आप क्या पाएंगे',
      dailyLessons: 'दिन का कोर्स',
      structuredLearning: 'रोज 20-30 मिनट की पाठें, AI के साथ',
      pointsEarned: 'पूरा करने पर अंक प्राप्त करें',
      emailDelivery: 'आपके ईमेल में मिलेगा',
      dailyLessonsSent: 'हर दिन नई पाठें आपके ईमेल पर आएंगी',
      interactiveAssessments: 'इंटरैक्टिव क्विज़',
      testKnowledge: 'खेल के माध्यम से अपने ज्ञान का परीक्षण करें',
      tableOfContents: 'पाठ्यक्रम',
      dayOf: 'दिन {{currentDay}} / {{totalDays}}',
      daysCompleted: '{{count}} दिन पूरे हुए',
      continuelLearning: 'जारी रखें',
      duration: 'अवधि',
      pointsReward: 'अंक',
      days: 'दिन',
      points: 'अंक',
      enrolled: 'नामांकित',
      backToCourses: 'कोर्स पर वापस जाएं',
      failedToEnroll: 'कोर्स में नामांकन विफल',
      paymentFailed: 'भुगतान विफल',
      loadingCourse: 'कोर्स लोड हो रहा है...',
      courseNotFound: 'कोर्स नहीं मिला',
      loading: 'लोड हो रहा है...',
      noLessonsAvailable: 'इस समय कोई पाठ उपलब्ध नहीं',
      day: 'दिन',
      minutes: 'मिनट',
      premiumCourse: 'प्रीमियम कोर्स',
      signInToEnroll: 'नामांकन के लिए साइन इन करें',
      premiumRequired: 'प्रीमियम आवश्यक',
      purchasing: 'खरीद रहे हैं...',
      purchasePremium: 'प्रीमियम खरीदें',
      alreadyPremium: 'आपके पास पहले से प्रीमियम पहुंच है',
      enrolling: 'नामांकन हो रहा है...',
      enrollNow: 'अभी नामांकन करें',
    },
    ru: {
      aboutThisCourse: 'О курсе',
      whatYoullLearn: 'Что ты получишь',
      dailyLessons: '30-дневный курс',
      structuredLearning: 'Ежедневные уроки по 20-30 минут с поддержкой ИИ',
      pointsEarned: 'Получи баллы за завершение',
      emailDelivery: 'Отправляется на твой email',
      dailyLessonsSent: 'Каждый день новые уроки приходят тебе по почте',
      interactiveAssessments: 'Интерактивные тесты',
      testKnowledge: 'Проверяй знания через игры',
      tableOfContents: 'Содержание',
      dayOf: 'День {{currentDay}} из {{totalDays}}',
      daysCompleted: '{{count}} дней завершено',
      continuelLearning: 'Продолжить',
      duration: 'Длительность',
      pointsReward: 'Баллы',
      days: 'дней',
      points: 'баллы',
      enrolled: 'Записан',
      backToCourses: 'Вернуться к курсам',
      certification: 'Сертификация',
      certificationUnavailable: 'Сертификация недоступна',
      certificationUnavailablePool: 'Сертификация недоступна (пул {{poolCount}}/50)',
      completeCourseForCertification: 'Завершите курс, чтобы разблокировать сертификацию',
      certificationAvailable: 'Завершено, сертификат доступен',
      certificationUnlocked: 'Сертификация разблокирована',
      redeemPointsCert: 'Потратить баллы ({{points}})',
      startFinalExam: 'Начать финальный экзамен',
      failedToEnroll: 'Не удалось записаться на курс',
      paymentFailed: 'Оплата не удалась',
      loadingCourse: 'Загрузка курса...',
      courseNotFound: 'Курс не найден',
      loading: 'Загрузка...',
      noLessonsAvailable: 'В данный момент уроки недоступны',
      day: 'День',
      minutes: 'минут',
      premiumCourse: 'Премиум курс',
      signInToEnroll: 'Войдите, чтобы записаться',
      premiumRequired: 'Требуется премиум',
      purchasing: 'Покупка...',
      purchasePremium: 'Купить премиум',
      alreadyPremium: 'У вас уже есть премиум доступ',
      enrolling: 'Запись...',
      enrollNow: 'Записаться сейчас',
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

  const fetchCourse = useCallback(async (cid: string) => {
    try {
      const response = await fetch(`/api/courses/${cid}?locale=${locale}`);
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
  }, [locale]);

  const fetchEntitlement = useCallback(async (cid: string) => {
    try {
      const res = await fetch(`/api/certification/entitlement?courseId=${cid}`);
      const data = await res.json();
      if (data.success) {
        setEntitlement(data.data);
      } else {
        setEntitlement(null);
      }
    } catch (_error) {
      setEntitlement(null);
    }
  }, []);

  const checkEnrollment = useCallback(async (cid: string) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/my-courses`);
      const data = await response.json();
      if (data.success) {
        const myCourse = data.courses.find(
          (c: { course: { courseId: string } }) => c.course.courseId === cid
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
  }, [session]);

  const checkPremiumStatus = useCallback(async () => {
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
  }, [session]);

  const fetchLessons = useCallback(async (cid: string, opts: { silent?: boolean } = {}) => {
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
  }, []);

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
        trackGAEvent('purchase', { course_id: id });
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
    void loadData();
  }, [checkEnrollment, checkPremiumStatus, fetchCourse, fetchEntitlement, fetchLessons, params, session]);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    setLeaderboardLoading(true);
    fetch(`/api/leaderboards/course/${encodeURIComponent(courseId)}?period=all_time&metric=course_points&limit=10`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.entries) return;
        setLeaderboardEntries(data.entries);
      })
      .catch(() => { if (!cancelled) setLeaderboardEntries([]); })
      .finally(() => { if (!cancelled) setLeaderboardLoading(false); });
    return () => { cancelled = true; };
  }, [courseId]);

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
    const entitlementRequired = entitlement.entitlementRequired ?? true;
    const hasAccess = entitlement.entitlementOwned || !entitlementRequired;

    let statusLabel = getCourseDetailText('certificationUnavailable');
    let cta: JSX.Element | null = null;

    if (!entitlement.certificationEnabled) {
      statusLabel = getCourseDetailText('certificationUnavailable');
    } else if (!poolOk) {
      statusLabel = getCourseDetailText('certificationUnavailablePool', { poolCount: entitlement.poolCount });
    } else if (!completed) {
      statusLabel = getCourseDetailText('completeCourseForCertification');
    } else if (completed && poolOk && entitlementRequired && !hasAccess) {
      statusLabel = getCourseDetailText('certificationAvailable');
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
              {getCourseDetailText('redeemPointsCert', { points: entitlement.pricePoints })}
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
    } else if (completed && poolOk && hasAccess) {
      statusLabel = getCourseDetailText('certificationUnlocked');
      cta = (
        <LocaleLink
          href={`/courses/${courseId}/final-exam`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
        >
          <Award className="w-4 h-4" />
          {getCourseDetailText('startFinalExam')}
        </LocaleLink>
      );
    }

    return (
      <div className="bg-brand-darkGrey border-2 border-brand-accent rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-brand-white">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="font-semibold">{getCourseDetailText('certification')}</span>
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
        trackGAEvent('course_enroll', {
          course_id: courseId,
          course_name: course?.name,
        });
        setEnrollment({
          enrolled: true,
          progress: {
            currentDay: 1,
            completedDays: 0,
            isCompleted: false,
          },
        });
        // Redirect to first lesson using COURSE language, not URL locale
        // CRITICAL: Must match course.language to enforce URL locale = course language
        if (course) {
          router.push(`/${course.language}/courses/${courseId}/day/1`);
        }
      } else {
        alert(data.error || getCourseDetailText('failedToEnroll'));
      }
    } catch (error) {
      console.error('Failed to enroll:', error);
      alert(getCourseDetailText('failedToEnroll'));
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
        alert(data.error || getCourseDetailText('paymentFailed'));
        setPurchasing(false);
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
      alert(getCourseDetailText('paymentFailed'));
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center" dir={course?.language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="text-brand-white text-xl">{getCourseDetailText('loadingCourse')}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-white mb-4">{getCourseDetailText('courseNotFound')}</h2>
          <LocaleLink
            href="/courses"
            className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400"
          >
            {getCourseDetailTexts().backToCourses}
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
              {getCourseDetailTexts().backToCourses}
            </LocaleLink>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-brand-white leading-tight">{course.name}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-8 sm:py-10 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {course.thumbnail && !thumbnailError ? (
              <div className="relative w-full rounded-2xl overflow-hidden aspect-video">
                <Image
                  src={course.thumbnail}
                  alt={course.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  onError={() => setThumbnailError(true)}
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
              <ContentVoteWidget
                targetType="course"
                targetId={courseId}
                playerId={(session?.user as { id?: string; playerId?: string } | undefined)?.playerId ?? (session?.user as { id?: string } | undefined)?.id ?? null}
                label="Was this course helpful?"
                className="mt-4 pt-4 border-t border-brand-darkGrey/20"
              />
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

            {(course?.leaderboardEnabled ?? true) && (
              <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-4 flex items-center gap-2">
                  <Trophy className="w-8 h-8 text-amber-500" />
                  {getCourseDetailText('courseLeaderboard') || 'Course leaderboard'}
                </h2>
                  {leaderboardLoading ? (
                    <div className="text-brand-darkGrey text-center py-6">{getCourseDetailText('loading')}</div>
                  ) : leaderboardEntries.length === 0 ? (
                    <p className="text-brand-darkGrey">{getCourseDetailText('noLeaderboardYet') || 'No rankings yet. Complete lessons to earn points and appear here.'}</p>
                  ) : (
                    <ul className="space-y-2">
                      {leaderboardEntries.map((entry) => (
                        <li key={entry.rank} className="flex items-center gap-4 p-3 rounded-lg bg-brand-darkGrey/5 border border-brand-darkGrey/15">
                          <span className="w-8 font-bold text-brand-black">{entry.rank}</span>
                          <span className="flex-1 truncate text-brand-black font-medium">{entry.player?.displayName ?? '—'}</span>
                          <span className="font-semibold text-brand-accent">{entry.score} {getCourseDetailText('points') || 'pts'}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
            )}

            {/* Discussion — disabled until infinite-reload after posting is fixed */}
            {(course?.discussionEnabled ?? false) && (
              <CourseDiscussion
                courseId={courseId}
                title={getCourseDetailText('discussionTitle') || 'Discussion'}
                placeholder={getCourseDetailText('discussionPlaceholder') || 'Ask a question...'}
                replyLabel={getCourseDetailText('discussionReply') || 'Reply'}
                signInToPost={getCourseDetailText('discussionSignInToPost') || 'Sign in to post.'}
                emptyMessage={getCourseDetailText('discussionNoPosts') || 'No posts yet.'}
                loadingText={getCourseDetailText('discussionLoading') || 'Loading...'}
              />
            )}

            {/* Study Groups */}
            {(course?.studyGroupsEnabled ?? true) && (
              <CourseStudyGroups
                courseId={courseId}
                title={getCourseDetailText('studyGroupsTitle') || 'Study Groups'}
                createLabel={getCourseDetailText('studyGroupsCreate') || 'Create'}
                createPlaceholder={getCourseDetailText('studyGroupsGroupName') || 'Group name'}
                joinLabel={getCourseDetailText('studyGroupsJoin') || 'Join'}
                leaveLabel={getCourseDetailText('studyGroupsLeave') || 'Leave'}
                membersLabel={getCourseDetailText('studyGroupsMembers') || 'Members'}
                signInToJoin={getCourseDetailText('studyGroupsSignInToJoin') || 'Sign in to join.'}
                emptyMessage={getCourseDetailText('studyGroupsNoGroups') || 'No study groups yet.'}
                loadingText={getCourseDetailText('studyGroupsLoading') || 'Loading...'}
              />
            )}

            {/* Table of Contents */}
            <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-6">{getCourseDetailTexts().tableOfContents}</h2>
              {loadingLessons && tocLessons.length === 0 ? (
                <div className="text-brand-darkGrey text-center py-8">{getCourseDetailText('loading')}</div>
              ) : tocLessons.length === 0 ? (
                <div className="text-brand-darkGrey text-center py-8">{getCourseDetailText('noLessonsAvailable')}</div>
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
                          <span>{getCourseDetailText('day')} {lesson.dayNumber}</span>
                          {lesson.estimatedMinutes && (
                            <span>• {lesson.estimatedMinutes} {getCourseDetailText('minutes')}</span>
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
                      {getCourseDetailText('premiumCourse')}
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
                        {getCourseDetailTexts().enrolled}
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
                      {getCourseDetailTexts().continuelLearning}
                    </LocaleLink>
                  </div>
                ) : !session ? (
                  <LocaleLink
                    href={`/auth/signin?callbackUrl=${encodeURIComponent(`/${course.language}/courses/${courseId}`)}`}
                    className="block w-full bg-brand-accent text-brand-black px-5 py-3.5 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-colors text-base"
                  >
                    {getCourseDetailText('signInToEnroll')}
                  </LocaleLink>
                ) : course.requiresPremium && !isPremium ? (
                  <div className="space-y-3">
                    <div className="bg-brand-accent/20 border border-brand-accent rounded-lg p-3">
                      <div className="text-sm text-brand-darkGrey mb-3">
                        {getCourseDetailText('premiumRequired')}
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
                          {getCourseDetailText('purchasing')}
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          {getCourseDetailText('purchasePremium')}
                        </>
                      )}
                    </button>
                  </div>
                ) : course.requiresPremium && isPremium ? (
                  <div className="space-y-3">
                    <div className="bg-green-500/20 border border-green-500 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                        <Star className="w-5 h-5" />
                        {getCourseDetailText('alreadyPremium')}
                      </div>
                    </div>
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full bg-brand-accent text-brand-black px-5 py-3.5 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                    >
                      {enrolling ? getCourseDetailText('enrolling') : getCourseDetailText('enrollNow')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-brand-accent text-brand-black px-5 py-3.5 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
                  >
                    {enrolling ? getCourseDetailText('enrolling') : getCourseDetailText('enrollNow')}
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
                    {getCourseDetailTexts().continuelLearning}
                  </LocaleLink>
                ) : !session ? (
                  <LocaleLink
                    href={`/auth/signin?callbackUrl=${encodeURIComponent(`/${course.language}/courses/${courseId}`)}`}
                    className="w-full bg-brand-accent text-brand-black px-4 py-2.5 rounded-lg font-bold text-center hover:bg-brand-primary-400 transition-colors text-sm"
                  >
                    {getCourseDetailText('signInToEnroll')}
                  </LocaleLink>
                ) : course.requiresPremium && !isPremium ? (
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full bg-brand-accent text-brand-black px-4 py-2.5 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {purchasing ? getCourseDetailText('purchasing') : getCourseDetailText('purchasePremium')}
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-brand-accent text-brand-black px-4 py-2.5 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {enrolling ? getCourseDetailText('enrolling') : getCourseDetailText('enrollNow')}
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
