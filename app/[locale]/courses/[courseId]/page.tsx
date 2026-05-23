/**
 * Course Detail Page
 * 
 * What: Course overview and enrollment page
 * Why: Allows users to view course details and enroll
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import {
  Affix,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Transition,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconAward,
  IconBook,
  IconCalendar,
  IconCertificate,
  IconCheck,
  IconCreditCard,
  IconListDetails,
  IconPlayerPlay,
  IconStar,
  IconTrophy,
} from '@tabler/icons-react';
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
  prerequisiteCourses?: Array<{ courseId: string; name?: string }>;
  prerequisiteEnforcement?: 'hard' | 'soft';
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

function getCourseDayHref(course: Pick<Course, 'courseId' | 'language' | 'durationDays'>, currentDay?: number, isCompleted?: boolean) {
  const safeTotalDays = Math.max(course.durationDays || 1, 1);
  const requestedDay = isCompleted
    ? safeTotalDays
    : Math.min(Math.max(currentDay || 1, 1), safeTotalDays);
  return `/${course.language}/courses/${course.courseId}/day/${requestedDay}`;
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
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);
  const [unmetPrereqsFromEnroll, setUnmetPrereqsFromEnroll] = useState<Array<{ courseId: string; name?: string }>>([]);

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
    sw: {
      aboutThisCourse: 'Mapitio ya Kozi',
      whatYoullLearn: 'Unachopata',
      dailyLessons: 'siku za kozi',
      structuredLearning: 'Masomo ya kila siku dakika 20-30 na msaada wa AI',
      pointsEarned: 'Pata pointi kwa kukamilisha',
      emailDelivery: 'Inatumwa kwenye barua pepe yako',
      dailyLessonsSent: 'Kila siku unapokea somo jipya kwenye barua pepe',
      interactiveAssessments: 'Jaribio la Kuunganisha',
      testKnowledge: 'Jaribu ujuzi wako kupitia michezo',
      tableOfContents: 'Mtaala',
      dayOf: 'Siku {{currentDay}} ya {{totalDays}}',
      daysCompleted: 'Siku {{count}} zimekamilika',
      continuelLearning: 'Endelea Kusoma',
      duration: 'Muda',
      pointsReward: 'Pointi',
      days: 'siku',
      points: 'pointi',
      enrolled: 'Imeandikishwa',
      backToCourses: 'Rudi kwenye Kozi',
      failedToEnroll: 'Imeshindwa kujiandikisha kwenye kozi',
      paymentFailed: 'Malipo yameshindwa',
      loadingCourse: 'Inapakia kozi...',
      courseNotFound: 'Kozi haijapatikana',
      loading: 'Inapakia...',
      noLessonsAvailable: 'Hakuna masomo yanayopatikana kwa sasa',
      day: 'Siku',
      minutes: 'dakika',
      premiumCourse: 'Kozi ya Premium',
      signInToEnroll: 'Ingia kujiandikisha',
      premiumRequired: 'Premium Inahitajika',
      purchasing: 'Inanunua...',
      purchasePremium: 'Nunua Premium',
      alreadyPremium: 'Tayari una ufikiaji wa premium',
      enrolling: 'Inajiandikisha...',
      enrollNow: 'Jiandikishe Sasa',
      certification: 'Cheti',
      certificationUnavailable: 'Cheti haipatikani',
      certificationUnavailablePool: 'Cheti haipatikani (kundi {{poolCount}}/50)',
      completeCourseForCertification: 'Kamilisha kozi kufungua cheti',
      certificationAvailable: 'Imekamilika, cheti kinapatikana',
      certificationUnlocked: 'Cheti kimefunguliwa',
      redeemPointsCert: 'Badilisha pointi ({{points}})',
      startFinalExam: 'Anza mtihani wa mwisho',
      courseLeaderboard: 'Orodha ya uongozi',
      noLeaderboardYet: 'Bado hakuna orodha. Kamilisha masomo kupata pointi na kuonekana hapa.',
      discussionTitle: 'Majadiliano',
      discussionPlaceholder: 'Swali au maoni...',
      discussionPost: 'Tuma',
      discussionReply: 'Jibu',
      discussionNoPosts: 'Bado hakuna machapisho.',
      discussionSignInToPost: 'Ingia kuchapisha.',
      discussionLoading: 'Inapakia...',
      discussionDelete: 'Futa',
      discussionEdit: 'Hariri',
      studyGroupsTitle: 'Vikundi vya Kusoma',
      studyGroupsCreateGroup: 'Kikundi kipya',
      studyGroupsGroupName: 'Jina la kikundi',
      studyGroupsCreate: 'Undwa',
      studyGroupsNoGroups: 'Bado hakuna vikundi vya kusoma.',
      studyGroupsMembers: 'Wanachama',
      studyGroupsJoin: 'Jiunge',
      studyGroupsLeave: 'Ondoka',
      studyGroupsSignInToJoin: 'Ingia kujiunga na kikundi.',
      studyGroupsLoading: 'Inapakia...',
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

  const normalizeCourseId = (value?: string | null) => (value ? value.toUpperCase() : '');

  const checkEnrollment = useCallback(async (cid: string) => {
    if (!session) return;

    try {
      const response = await fetch(`/api/my-courses`);
      const data = await response.json();
      if (data.success) {
        const completed = Array.isArray(data.courses)
          ? data.courses
              .filter((c: { progress?: { isCompleted?: boolean } }) => c?.progress?.isCompleted)
              .map((c: { course: { courseId: string } }) => normalizeCourseId(c.course.courseId))
          : [];
        setCompletedCourseIds(completed);
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

  const completedCourseIdSet = useMemo(() => new Set(completedCourseIds.map(normalizeCourseId)), [completedCourseIds]);
  const unmetPrereqs = useMemo(() => {
    const prereqs = course?.prerequisiteCourses ?? [];
    if (prereqs.length === 0) return unmetPrereqsFromEnroll;
    const unmet = prereqs.filter((prereq) => !completedCourseIdSet.has(normalizeCourseId(prereq.courseId)));
    return unmet.length > 0 ? unmet : unmetPrereqsFromEnroll;
  }, [course?.prerequisiteCourses, completedCourseIdSet, unmetPrereqsFromEnroll]);
  const prereqEnforcement = course?.prerequisiteEnforcement ?? 'hard';
  const prereqBlocked = unmetPrereqs.length > 0 && prereqEnforcement === 'hard';
  const continueCourseHref = course && enrollment?.enrolled
    ? getCourseDayHref(course, enrollment.progress?.currentDay, enrollment.progress?.isCompleted)
    : null;

  const renderCertificationBlock = () => {
    if (!course || !entitlement) return null;
    const completed = Boolean(enrollment?.progress?.isCompleted);
    const poolOk = entitlement.certificationEnabled && entitlement.poolCount >= 50;
    const entitlementRequired = entitlement.entitlementRequired ?? true;
    const hasAccess = entitlement.entitlementOwned || !entitlementRequired;

    let statusLabel = getCourseDetailText('certificationUnavailable');
    let cta: ReactNode = null;

    if (!entitlement.certificationEnabled) {
      statusLabel = getCourseDetailText('certificationUnavailable');
    } else if (!poolOk) {
      statusLabel = getCourseDetailText('certificationUnavailablePool', { poolCount: entitlement.poolCount });
    } else if (!completed) {
      statusLabel = getCourseDetailText('completeCourseForCertification');
    } else if (completed && poolOk && entitlementRequired && !hasAccess) {
      statusLabel = getCourseDetailText('certificationAvailable');
      cta = (
        <Group gap="sm">
          {entitlement.pricePoints ? (
            <Button
              color="amanoba"
              onClick={() => fetch(`/api/certification/entitlement/redeem-points`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId }),
              }).then(() => fetchEntitlement(courseId))}
            >
              {getCourseDetailText('redeemPointsCert', { points: entitlement.pricePoints })}
            </Button>
          ) : null}
        </Group>
      );
    } else if (completed && poolOk && hasAccess) {
      statusLabel = getCourseDetailText('certificationUnlocked');
      cta = (
        <Button
          component={LocaleLink}
          href={`/courses/${courseId}/final-exam`}
          color="amanoba"
          leftSection={<IconCertificate size={18} />}
        >
          {getCourseDetailText('startFinalExam')}
        </Button>
      );
    }

    return (
      <Card bg="ink.8" padding="md">
        <Group gap="sm" mb={4}>
          <ThemeIcon color="amanoba" variant="light">
            <IconCertificate size={18} />
          </ThemeIcon>
          <Text c="white" fw={700}>{getCourseDetailText('certification')}</Text>
        </Group>
        <Text c="gray.3" size="sm" mb={cta ? 'sm' : 0}>{statusLabel}</Text>
        {cta}
      </Card>
    );
  };

  const handleEnroll = async () => {
    if (!session || !courseId) return;

    setEnrolling(true);
    setUnmetPrereqsFromEnroll([]);
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.status === 403 && data?.code === 'PREREQUISITES_NOT_MET') {
        setUnmetPrereqsFromEnroll((data.unmetPrerequisites || []) as Array<{ courseId: string; name?: string }>);
        return;
      }

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

  const renderEnrollmentAction = (size: 'sm' | 'md' = 'md', fullWidth = true) => {
    if (!course) return null;

    if (enrollment?.enrolled) {
      return (
        <Button
          component={LocaleLink}
          href={continueCourseHref ?? `/${course.language}/courses/${courseId}/day/1`}
          color="amanoba"
          size={size}
          fullWidth={fullWidth}
          leftSection={<IconPlayerPlay size={18} />}
        >
          {getCourseDetailTexts().continuelLearning}
        </Button>
      );
    }

    if (!session) {
      return (
        <Button
          component={LocaleLink}
          href={`/auth/signin?callbackUrl=${encodeURIComponent(`/${course.language}/courses/${courseId}`)}`}
          color="amanoba"
          size={size}
          fullWidth={fullWidth}
        >
          {getCourseDetailText('signInToEnroll')}
        </Button>
      );
    }

    if (course.requiresPremium && !isPremium) {
      return (
        <Button
          onClick={handlePurchase}
          loading={purchasing}
          color="amanoba"
          size={size}
          fullWidth={fullWidth}
          leftSection={<IconCreditCard size={18} />}
        >
          {getCourseDetailText('purchasePremium')}
        </Button>
      );
    }

    return (
      <Button
        onClick={handleEnroll}
        loading={enrolling}
        disabled={prereqBlocked}
        color="amanoba"
        size={size}
        fullWidth={fullWidth}
      >
        {enrolling ? getCourseDetailText('enrolling') : getCourseDetailText('enrollNow')}
      </Button>
    );
  };

  if (loading) {
    return (
      <Box bg="ink.9" mih="100vh" py="xl" dir={course?.language === 'ar' ? 'rtl' : 'ltr'}>
        <Container size="lg">
          <Stack gap="lg">
            <Skeleton height={76} radius="md" />
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="lg">
                  <Skeleton height={340} radius="md" />
                  <Skeleton height={180} radius="md" />
                  <Skeleton height={220} radius="md" />
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Skeleton height={360} radius="md" />
              </Grid.Col>
            </Grid>
            <Text c="gray.3" ta="center">{getCourseDetailText('loadingCourse')}</Text>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box bg="ink.9" mih="100vh" py="xl" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <Container size="sm">
          <Center mih="70vh">
            <Alert
              color="amanoba"
              icon={<IconAlertTriangle size={18} />}
              title={getCourseDetailText('courseNotFound')}
              radius="md"
            >
              <Button
                component={LocaleLink}
                href="/courses"
                mt="md"
                color="amanoba"
                leftSection={<IconArrowLeft size={18} />}
              >
                {getCourseDetailTexts().backToCourses}
              </Button>
            </Alert>
          </Center>
        </Container>
      </Box>
    );
  }

  const playerId = (session?.user as { id?: string; playerId?: string } | undefined)?.playerId
    ?? (session?.user as { id?: string } | undefined)?.id
    ?? null;
  const progressValue = enrollment?.progress
    ? Math.min(100, Math.round((enrollment.progress.completedDays / Math.max(course.durationDays, 1)) * 100))
    : 0;
  const featureItems = [
    {
      icon: <IconCheck size={20} />,
      title: `${course.durationDays} ${getCourseDetailTexts().dailyLessons}`,
      description: getCourseDetailTexts().structuredLearning,
    },
    {
      icon: <IconAward size={20} />,
      title: `${course.pointsConfig.completionPoints} ${getCourseDetailTexts().points}`,
      description: getCourseDetailTexts().pointsEarned,
    },
    {
      icon: <IconBook size={20} />,
      title: getCourseDetailTexts().emailDelivery,
      description: getCourseDetailTexts().dailyLessonsSent,
    },
    {
      icon: <IconPlayerPlay size={20} />,
      title: getCourseDetailTexts().interactiveAssessments,
      description: getCourseDetailTexts().testKnowledge,
    },
  ];

  return (
    <Box bg="ink.9" mih="100vh" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Paper component="header" bg="ink.8" radius={0} withBorder pos="sticky" top={0} className="z-30">
        <Container size="xl" py={{ base: 'md', sm: 'lg' }}>
          <Stack gap="sm">
            <Group gap="md" wrap="nowrap">
              <Logo size="sm" showText={false} linkTo={session ? "/dashboard" : "/"} />
              <Button
                component={LocaleLink}
                href="/courses"
                variant="subtle"
                color="gray"
                leftSection={<IconArrowLeft size={18} />}
              >
                {getCourseDetailTexts().backToCourses}
              </Button>
            </Group>
            <Group gap="xs">
              {course.metadata?.category ? <Badge color="gray" variant="light">{course.metadata.category}</Badge> : null}
              {course.metadata?.difficulty ? <Badge color="gray" variant="light">{course.metadata.difficulty}</Badge> : null}
              {course.requiresPremium ? <Badge color="amanoba" variant="light">{getCourseDetailText('premiumCourse')}</Badge> : null}
            </Group>
            <Title order={1} c="white" size="h2">{course.name}</Title>
          </Stack>
        </Container>
      </Paper>

      <Container component="main" size="xl" py={{ base: 'lg', sm: 'xl' }} pb={112}>
        <Grid gutter={{ base: 'lg', lg: 'xl' }}>
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="lg">
            {course.thumbnail && !thumbnailError ? (
              <Box pos="relative" w="100%" className="aspect-video overflow-hidden rounded-md">
                <Image
                  src={course.thumbnail}
                  alt={course.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  onError={() => setThumbnailError(true)}
                />
              </Box>
            ) : (
              <Paper bg="ink.8" radius="md" withBorder className="aspect-video">
                <Center h="100%">
                  <ThemeIcon color="amanoba" variant="light" size={72} radius="md">
                    <IconBook size={40} />
                  </ThemeIcon>
                </Center>
              </Paper>
            )}

            <Card padding="xl" radius="md" withBorder>
              <Stack gap="md">
                <Title order={2} size="h3">{getCourseDetailTexts().aboutThisCourse}</Title>
                <Text c="dimmed" size="lg">{course.description}</Text>
                <Divider />
              <ContentVoteWidget
                targetType="course"
                targetId={courseId}
                  playerId={playerId}
                label="Was this course helpful?"
              />
              </Stack>
            </Card>

            <Card padding="xl" radius="md" withBorder>
              <Stack gap="lg">
                <Title order={2} size="h3">{getCourseDetailTexts().whatYoullLearn}</Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  {featureItems.map((item) => (
                    <Group key={item.title} align="flex-start" gap="sm" wrap="nowrap">
                      <ThemeIcon color="amanoba" variant="light" radius="md">
                        {item.icon}
                      </ThemeIcon>
                      <Stack gap={2}>
                        <Text fw={700}>{item.title}</Text>
                        <Text size="sm" c="dimmed">{item.description}</Text>
                      </Stack>
                    </Group>
                  ))}
                </SimpleGrid>
              </Stack>
            </Card>

            {(course?.leaderboardEnabled ?? true) && (
              <Card padding="xl" radius="md" withBorder>
                <Stack gap="md">
                  <Group gap="sm">
                    <ThemeIcon color="amanoba" variant="light" radius="md">
                      <IconTrophy size={20} />
                    </ThemeIcon>
                    <Title order={2} size="h3">{getCourseDetailText('courseLeaderboard') || 'Course leaderboard'}</Title>
                  </Group>
                  {leaderboardLoading ? (
                    <Text c="dimmed" ta="center" py="md">{getCourseDetailText('loading')}</Text>
                  ) : leaderboardEntries.length === 0 ? (
                    <Text c="dimmed">{getCourseDetailText('noLeaderboardYet') || 'No rankings yet. Complete lessons to earn points and appear here.'}</Text>
                  ) : (
                    <Stack gap="xs">
                      {leaderboardEntries.map((entry) => (
                        <Paper key={entry.rank} p="sm" radius="md" withBorder>
                          <Group gap="md" wrap="nowrap">
                            <Text w={32} fw={800}>{entry.rank}</Text>
                            <Text flex={1} fw={600} truncate>{entry.player?.displayName ?? '—'}</Text>
                            <Badge color="amanoba" variant="light">{entry.score} {getCourseDetailText('points') || 'pts'}</Badge>
                          </Group>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Card>
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

            <Card padding="xl" radius="md" withBorder>
              <Stack gap="lg">
              <Group gap="sm">
                <ThemeIcon color="amanoba" variant="light" radius="md">
                  <IconListDetails size={20} />
                </ThemeIcon>
                <Title order={2} size="h3">{getCourseDetailTexts().tableOfContents}</Title>
              </Group>
              {loadingLessons && tocLessons.length === 0 ? (
                <Stack gap="xs">
                  <Skeleton height={70} radius="md" />
                  <Skeleton height={70} radius="md" />
                  <Skeleton height={70} radius="md" />
                </Stack>
              ) : tocLessons.length === 0 ? (
                <Text c="dimmed" ta="center" py="md">{getCourseDetailText('noLessonsAvailable')}</Text>
              ) : (
                <Stack gap="xs">
                  {tocLessons.map((lesson) => (
                    <Paper key={lesson.lessonId} p="md" radius="md" withBorder>
                      <Group gap="md" wrap="nowrap" align="center">
                      <ThemeIcon color="gray" variant="light" size={48} radius="md">
                        {lesson.dayNumber}
                      </ThemeIcon>
                      <Stack gap={2} miw={0} flex={1}>
                        <Text fw={700} size="lg" truncate>{lesson.title}</Text>
                        <Group gap="xs">
                          <Text size="sm" c="dimmed">{getCourseDetailText('day')} {lesson.dayNumber}</Text>
                          {lesson.estimatedMinutes && (
                            <Text size="sm" c="dimmed">• {lesson.estimatedMinutes} {getCourseDetailText('minutes')}</Text>
                          )}
                        </Group>
                      </Stack>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              )}
              </Stack>
            </Card>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="md" pos="sticky" top={110} visibleFrom="md">
              <Card padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <SimpleGrid cols={2} spacing="sm">
                    <Paper p="md" radius="md" withBorder>
                      <Group gap="xs" mb={4}>
                        <IconCalendar size={16} />
                        <Text size="sm" c="dimmed">{getCourseDetailTexts().duration}</Text>
                      </Group>
                      <Text fw={800} size="xl">{course.durationDays} {getCourseDetailTexts().days}</Text>
                    </Paper>
                    <Paper p="md" radius="md" withBorder>
                      <Group gap="xs" mb={4}>
                        <IconAward size={16} />
                        <Text size="sm" c="dimmed">{getCourseDetailTexts().pointsReward}</Text>
                      </Group>
                      <Text fw={800} size="xl">{course.pointsConfig.completionPoints}</Text>
                      <Text size="sm" c="dimmed">{getCourseDetailTexts().points}</Text>
                    </Paper>
                  </SimpleGrid>

                  {course.requiresPremium ? (
                    <Alert color="amanoba" icon={<IconStar size={18} />} title={getCourseDetailText('premiumCourse')} radius="md">
                      {course.price ? (
                        <Group gap="xs">
                          <IconCreditCard size={16} />
                          <Text fw={700}>{formatCurrency(course.price.amount, course.price.currency)}</Text>
                        </Group>
                      ) : null}
                    </Alert>
                  ) : null}

                  {(course.prerequisiteCourses && course.prerequisiteCourses.length > 0) || unmetPrereqs.length > 0 ? (
                    <Alert
                      color={prereqBlocked ? 'yellow' : 'gray'}
                      icon={<IconAlertTriangle size={18} />}
                      title={prereqBlocked ? 'Prerequisites required' : 'Prerequisites'}
                      radius="md"
                    >
                      <Text size="sm">
                        {(unmetPrereqs.length > 0 ? unmetPrereqs : course.prerequisiteCourses || []).map((prereq) => prereq.name ?? prereq.courseId).join(', ')}
                      </Text>
                      {prereqBlocked ? <Text size="sm" mt={4}>Complete the prerequisites before enrolling.</Text> : null}
                    </Alert>
                  ) : null}

                  {enrollment?.enrolled ? (
                    <Alert color="green" icon={<IconCheck size={18} />} title={getCourseDetailTexts().enrolled} radius="md">
                      {enrollment.progress ? (
                        <Stack gap="xs">
                          <Text size="sm">
                            {getCourseDetailText('dayOf', {
                              currentDay: enrollment.progress.currentDay,
                              totalDays: course.durationDays,
                            })}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {getCourseDetailText('daysCompleted', {
                              count: enrollment.progress.completedDays,
                            })}
                          </Text>
                          <Progress value={progressValue} color="amanoba" radius="xl" />
                        </Stack>
                      ) : null}
                    </Alert>
                  ) : course.requiresPremium && isPremium ? (
                    <Alert color="green" icon={<IconStar size={18} />} title={getCourseDetailText('alreadyPremium')} radius="md" />
                  ) : course.requiresPremium && !isPremium && session ? (
                    <Alert color="amanoba" title={getCourseDetailText('premiumRequired')} radius="md" />
                  ) : null}

                  {renderEnrollmentAction('md')}
                </Stack>
              </Card>
              {renderCertificationBlock()}
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Mobile CTA bar */}
        {course && (
          <Affix
            hiddenFrom="md"
            position={{ left: 12, right: 12, bottom: 12 }}
            zIndex={40}
          >
            <Transition mounted transition="slide-up">
              {(styles) => (
                <Card padding="sm" shadow="lg" style={styles}>
                  <Group justify="space-between" gap="sm" wrap="nowrap">
                    <Stack gap={2} miw={0} flex={1}>
                      <Text fw={700} size="sm" lineClamp={1}>{course.name}</Text>
                {enrollment?.progress && (
                        <Text size="xs" c="dimmed" lineClamp={1}>
                    {getCourseDetailText('dayOf', { currentDay: enrollment.progress.currentDay, totalDays: course.durationDays })} • {getCourseDetailText('daysCompleted', { count: enrollment.progress.completedDays })}
                        </Text>
                )}
                {prereqBlocked && (
                        <Text size="xs" c="yellow.7">
                    Prerequisites required
                        </Text>
                )}
                    </Stack>

                    {renderEnrollmentAction('sm', false)}
                  </Group>
                </Card>
              )}
            </Transition>
          </Affix>
        )}
      </Container>
    </Box>
  );
}
