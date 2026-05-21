/**
 * Daily Lesson Viewer Page
 * 
 * What: Display lesson content for a specific day
 * Why: Users read and complete daily lessons
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LocaleLink } from '@/components/LocaleLink';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lock,
  Award,
  Play,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { Alert, Box, Button, Card, Container, Group, Skeleton, Stack, Text } from '@mantine/core';
import { IconAlertTriangle, IconLock, IconRefresh } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Logo from '@/components/Logo';
import ContentVoteWidget from '@/components/ContentVoteWidget';
import { contentToHtml } from '@/app/lib/lesson-content';
import { readPracticeContextFromSearchParams } from '@/app/lib/practice-hub';
import { trackGAEvent } from '@/app/lib/analytics/ga-events';

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

interface QuizPolicy {
  enabled: boolean;
  required: boolean;
  questionCount: number;
  shownAnswerCount?: number;
  maxWrongAllowed?: number;
  successThreshold: number;
  availableQuestionCount?: number;
}

interface Navigation {
  previous: { day: number; title: string } | null;
  next: { day: number; title: string } | null;
}

type LessonAccessIssue = {
  status: number;
  title: string;
  message: string;
  action: 'signin' | 'course' | 'retry';
} | null;

function GroupForAccessActions({
  issue,
  courseId,
  courseLanguage,
  onRetry,
  signInHref,
  backLabel,
}: {
  issue: NonNullable<LessonAccessIssue>;
  courseId: string;
  courseLanguage: string;
  onRetry: () => void;
  signInHref: string;
  backLabel: string;
}) {
  return (
    <Group>
      {issue.action === 'signin' ? (
        <Button component={LocaleLink} href={signInHref} color="amanoba">
          Sign in
        </Button>
      ) : null}
      {issue.action === 'retry' ? (
        <Button onClick={onRetry} variant="outline" leftSection={<IconRefresh size={16} />}>
          Retry
        </Button>
      ) : null}
      <Button
        component={LocaleLink}
        href={`/${courseLanguage}/courses/${courseId}`}
        variant={issue.action === 'course' ? 'filled' : 'outline'}
        color={issue.action === 'course' ? 'amanoba' : 'gray'}
      >
        {backLabel}
      </Button>
    </Group>
  );
}

// Static translations for day page - keyed by COURSE LANGUAGE
const dayPageTranslations: Record<string, Record<string, string>> = {
  ar: {
    loadingLesson: 'جارٍ تحميل الدرس...',
    lessonNotFound: 'الدرس غير موجود',
    backToMyCourses: 'العودة إلى دوراتي',
    backToCourse: 'العودة إلى الدورة',
    dayNumber: 'اليوم {{day}}',
    completePreviousLessons: 'أكمل الدروس السابقة',
    points: 'نقاط',
    xp: 'XP',
    previousDay: 'اليوم السابق',
    takeQuiz: 'ابدأ الاختبار',
    completing: 'جاري الإكمال...',
    markAsComplete: 'تمييز كمكتمل',
    completed: 'مكتمل',
    nextDay: 'اليوم التالي',
    quizRequiredMessage: 'للمتابعة يجب اجتياز اختبار اليوم.',
    testYourKnowledge: 'اختبر معرفتك',
    assessmentDescription: 'اختبر معرفتك عبر الألعاب',
    playAssessment: 'ابدأ التقييم',
    failedToStartAssessment: 'فشل بدء التقييم',
    lessonLocked: 'الدرس مقفل',
    goToDay: 'الانتقال إلى اليوم {{day}}',
    mustPassQuiz: 'يجب اجتياز الاختبار أولًا',
    failedToComplete: 'فشل إكمال الدرس',
    failedToLoadLesson: 'فشل تحميل الدرس',
  },
  hu: {
    loadingLesson: 'Lecke betöltése...',
    lessonNotFound: 'Lecke nem található',
    backToMyCourses: 'Vissza a kurzusaimhoz',
    backToCourse: 'Vissza a kurzusra',
    dayNumber: '{{day}}. nap',
    completePreviousLessons: 'Teljesítsd az előző leckéket, hogy feloldhasd ezt.',
    points: 'pont',
    xp: 'XP',
    previousDay: 'Előző nap',
    takeQuiz: 'Kitöltöm a kvízt',
    completing: 'Befejezés...',
    markAsComplete: 'Befejezveként jelölés',
    completed: 'Befejezve',
    nextDay: 'Következő nap',
    quizRequiredMessage: 'A kvíz sikeres teljesítése ({{count}}/{{count}}) szükséges a befejezéshez. A kérdések a „Kitöltöm a kvízt” gombbal érhetők el.',
    quizRequiredMaxWrongMessage: 'A lecke befejezéséhez legfeljebb {{maxWrong}} hibád lehet {{count}} kérdésből. A kérdések a „Kitöltöm a kvízt” gombbal érhetők el.',
    testYourKnowledge: 'Teszteld a tudásodat',
    assessmentDescription: 'Teljesítsd az értékelő játékot, hogy megerősítsd a tanultakat. Az eredményeid ehhez a leckéhez lesznek kapcsolva.',
    playAssessment: 'Játssz értékelőt →',
    failedToStartAssessment: 'Nem sikerült elindítani az értékelést. Kérlek próbáld újra.',
    lessonLocked: 'Lecke zárolva',
    goToDay: 'Menj a(z) {{day}}. napra',
    mustPassQuiz: 'A lecke befejezéséhez át kell menned a quiz-en.',
    failedToComplete: 'Nem sikerült befejezni a leckét',
    failedToLoadLesson: 'Nem sikerült betölteni a leckét',
  },
  en: {
    loadingLesson: 'Loading lesson...',
    lessonNotFound: 'Lesson not found',
    backToMyCourses: 'Back to My Courses',
    backToCourse: 'Back to Course',
    dayNumber: 'Day {{day}}',
    completePreviousLessons: 'Complete previous lessons to unlock this lesson.',
    points: 'points',
    xp: 'XP',
    previousDay: 'Previous Day',
    takeQuiz: 'Take Quiz',
    completing: 'Completing...',
    markAsComplete: 'Mark as Complete',
    completed: 'Completed',
    nextDay: 'Next Day',
    quizRequiredMessage: 'You need to pass the quiz ({{count}}/{{count}}) to complete this lesson. Use the "Take Quiz" button to open it.',
    quizRequiredMaxWrongMessage: 'To complete this lesson, you can have at most {{maxWrong}} wrong answers out of {{count}} questions. Use the "Take Quiz" button to open it.',
    testYourKnowledge: 'Test Your Knowledge',
    assessmentDescription: 'Complete the assessment game to reinforce what you learned. Your results will be linked to this lesson.',
    playAssessment: 'Play Assessment →',
    failedToStartAssessment: 'Failed to start assessment. Please try again.',
    lessonLocked: 'Lesson Locked',
    goToDay: 'Go to Day {{day}}',
    mustPassQuiz: 'You must pass the quiz before completing this lesson.',
    failedToComplete: 'Failed to complete lesson',
    failedToLoadLesson: 'Failed to load lesson',
    saveLesson: 'Save lesson',
    removeSavedLesson: 'Remove saved lesson',
    savingLesson: 'Saving...',
  },
  ru: {
    loadingLesson: 'Загрузка урока...',
    lessonNotFound: 'Урок не найден',
    backToMyCourses: 'Назад к моим курсам',
    backToCourse: 'Назад к курсу',
    dayNumber: 'День {{day}}',
    completePreviousLessons: 'Завершите предыдущие уроки, чтобы открыть этот.',
    points: 'баллы',
    xp: 'XP',
    previousDay: 'Предыдущий день',
    takeQuiz: 'Пройти квиз',
    completing: 'Завершение...',
    markAsComplete: 'Отметить как завершенный',
    completed: 'Завершено',
    nextDay: 'Следующий день',
    quizRequiredMessage: 'Нужно пройти квиз ({{count}}/{{count}}), чтобы завершить урок. Нажмите «Пройти квиз».',
    quizRequiredMaxWrongMessage: 'Чтобы завершить урок, можно допустить не более {{maxWrong}} ошибок из {{count}} вопросов. Нажмите «Пройти квиз».',
    testYourKnowledge: 'Проверьте знания',
    assessmentDescription: 'Пройдите оценочный квиз, чтобы закрепить материал. Результаты будут связаны с уроком.',
    playAssessment: 'Пройти оценку →',
    failedToStartAssessment: 'Не удалось запустить квиз. Попробуйте еще раз.',
    lessonLocked: 'Урок закрыт',
    goToDay: 'Перейти к дню {{day}}',
    mustPassQuiz: 'Нужно пройти квиз, чтобы завершить урок.',
    failedToComplete: 'Не удалось завершить урок',
    failedToLoadLesson: 'Не удалось загрузить урок',
  },
  pt: {
    loadingLesson: 'Carregando aula...',
    lessonNotFound: 'Aula não encontrada',
    backToMyCourses: 'Voltar aos meus cursos',
    backToCourse: 'Voltar ao curso',
    dayNumber: 'Dia {{day}}',
    completePreviousLessons: 'Conclua as aulas anteriores',
    points: 'pontos',
    xp: 'XP',
    previousDay: 'Dia anterior',
    takeQuiz: 'Fazer questionário',
    completing: 'Concluindo...',
    markAsComplete: 'Marcar como concluído',
    completed: 'Concluído',
    nextDay: 'Próximo dia',
    quizRequiredMessage: 'Você precisa passar no questionário de hoje para continuar.',
    testYourKnowledge: 'Teste seus conhecimentos',
    assessmentDescription: 'Teste seus conhecimentos com jogos',
    playAssessment: 'Iniciar avaliação',
    failedToStartAssessment: 'Falha ao iniciar a avaliação',
    lessonLocked: 'Aula bloqueada',
    goToDay: 'Ir para o dia {{day}}',
    mustPassQuiz: 'Você deve passar no questionário primeiro',
    failedToComplete: 'Falha ao concluir',
    failedToLoadLesson: 'Falha ao carregar a aula',
  },
  vi: {
    loadingLesson: 'Đang tải bài học...',
    lessonNotFound: 'Không tìm thấy bài học',
    backToMyCourses: 'Quay lại khóa học của tôi',
    backToCourse: 'Quay lại khóa học',
    dayNumber: 'Ngày {{day}}',
    completePreviousLessons: 'Hoàn thành các bài học trước',
    points: 'điểm',
    xp: 'XP',
    previousDay: 'Ngày trước',
    takeQuiz: 'Làm bài kiểm tra',
    completing: 'Đang hoàn thành...',
    markAsComplete: 'Đánh dấu là hoàn thành',
    completed: 'Đã hoàn thành',
    nextDay: 'Ngày tiếp theo',
    quizRequiredMessage: 'Bạn phải vượt qua bài kiểm tra hôm nay để tiếp tục.',
    testYourKnowledge: 'Kiểm tra kiến thức của bạn',
    assessmentDescription: 'Kiểm tra kiến thức của bạn với trò chơi',
    playAssessment: 'Bắt đầu đánh giá',
    failedToStartAssessment: 'Không thể bắt đầu đánh giá',
    lessonLocked: 'Bài học bị khóa',
    goToDay: 'Đi đến ngày {{day}}',
    mustPassQuiz: 'Bạn phải vượt qua bài kiểm tra trước',
    failedToComplete: 'Không thể hoàn thành',
    failedToLoadLesson: 'Không thể tải bài học',
  },
  id: {
    loadingLesson: 'Memuat pelajaran...',
    lessonNotFound: 'Pelajaran tidak ditemukan',
    backToMyCourses: 'Kembali ke kursus saya',
    backToCourse: 'Kembali ke kursus',
    dayNumber: 'Hari {{day}}',
    completePreviousLessons: 'Selesaikan pelajaran sebelumnya',
    points: 'poin',
    xp: 'XP',
    previousDay: 'Hari sebelumnya',
    takeQuiz: 'Ikuti kuis',
    completing: 'Menyelesaikan...',
    markAsComplete: 'Tandai sebagai selesai',
    completed: 'Selesai',
    nextDay: 'Hari berikutnya',
    quizRequiredMessage: 'Anda harus lulus kuis hari ini untuk melanjutkan.',
    testYourKnowledge: 'Uji pengetahuan Anda',
    assessmentDescription: 'Uji pengetahuan Anda dengan permainan',
    playAssessment: 'Mulai penilaian',
    failedToStartAssessment: 'Gagal memulai penilaian',
    lessonLocked: 'Pelajaran terkunci',
    goToDay: 'Ke Hari {{day}}',
    mustPassQuiz: 'Anda harus lulus kuis terlebih dahulu',
    failedToComplete: 'Gagal menyelesaikan',
    failedToLoadLesson: 'Gagal memuat pelajaran',
  },
  hi: {
    loadingLesson: 'पाठ लोड हो रहा है...',
    lessonNotFound: 'पाठ नहीं मिला',
    backToMyCourses: 'मेरे पाठ्यक्रमों पर वापस जाएँ',
    backToCourse: 'पाठ्यक्रम पर वापस जाएँ',
    dayNumber: 'दिन {{day}}',
    completePreviousLessons: 'पिछले पाठ पूरे करें',
    points: 'अंक',
    xp: 'XP',
    previousDay: 'पिछला दिन',
    takeQuiz: 'प्रश्नोत्तरी दें',
    completing: 'पूरा हो रहा है...',
    markAsComplete: 'पूर्ण के रूप में चिह्नित करें',
    completed: 'पूर्ण',
    nextDay: 'अगला दिन',
    quizRequiredMessage: 'आगे बढ़ने के लिए आज की प्रश्नोत्तरी पास करनी होगी।',
    testYourKnowledge: 'अपना ज्ञान जांचें',
    assessmentDescription: 'खेलों के साथ अपना ज्ञान जांचें',
    playAssessment: 'आकलन शुरू करें',
    failedToStartAssessment: 'आकलन शुरू नहीं हो सका',
    lessonLocked: 'पाठ लॉक है',
    goToDay: 'दिन {{day}} पर जाएँ',
    mustPassQuiz: 'पहले प्रश्नोत्तरी पास करनी होगी',
    failedToComplete: 'पूरा करने में विफल',
    failedToLoadLesson: 'पाठ लोड नहीं हो सका',
  },
  tr: {
    loadingLesson: 'Ders yükleniyor...',
    lessonNotFound: 'Ders bulunamadı',
    backToMyCourses: 'Kurslarıma dön',
    backToCourse: 'Kursa dön',
    dayNumber: 'Gün {{day}}',
    completePreviousLessons: 'Önceki dersleri tamamlayın',
    points: 'puan',
    xp: 'XP',
    previousDay: 'Önceki gün',
    takeQuiz: 'Sınava gir',
    completing: 'Tamamlanıyor...',
    markAsComplete: 'Tamamlandı olarak işaretle',
    completed: 'Tamamlandı',
    nextDay: 'Sonraki gün',
    quizRequiredMessage: 'Devam etmek için bugünkü sınavı geçmelisiniz.',
    testYourKnowledge: 'Bilginizi test edin',
    assessmentDescription: 'Oyunlarla bilginizi test edin',
    playAssessment: 'Değerlendirmeyi başlat',
    failedToStartAssessment: 'Değerlendirme başlatılamadı',
    lessonLocked: 'Ders kilitli',
    goToDay: '{{day}}. güne git',
    mustPassQuiz: 'Önce sınavı geçmelisiniz',
    failedToComplete: 'Tamamlama başarısız',
    failedToLoadLesson: 'Ders yüklenemedi',
  },
  bg: {
    loadingLesson: 'Зареждане на урока...',
    lessonNotFound: 'Урокът не е намерен',
    backToMyCourses: 'Назад към моите курсове',
    backToCourse: 'Назад към курса',
    dayNumber: 'Ден {{day}}',
    completePreviousLessons: 'Завършете предишните уроци',
    points: 'точки',
    xp: 'XP',
    previousDay: 'Предишен ден',
    takeQuiz: 'Вземете тест',
    completing: 'Завършване...',
    markAsComplete: 'Маркирай като завършен',
    completed: 'Завършен',
    nextDay: 'Следващ ден',
    quizRequiredMessage: 'За да продължите, трябва да преминете теста за деня.',
    testYourKnowledge: 'Тествайте знанията си',
    assessmentDescription: 'Тествайте знанията си с игри',
    playAssessment: 'Започнете оценяване',
    failedToStartAssessment: 'Неуспешно стартиране на оценяване',
    lessonLocked: 'Урокът е заключен',
    goToDay: 'Отидете към ден {{day}}',
    mustPassQuiz: 'Трябва първо да преминете теста',
    failedToComplete: 'Неуспешно завършване',
    failedToLoadLesson: 'Неуспешно зареждане на урока',
  },
  pl: {
    loadingLesson: 'Ładowanie lekcji...',
    lessonNotFound: 'Lekcja nieznaleziona',
    backToMyCourses: 'Wróć do moich kursów',
    backToCourse: 'Wróć do kursu',
    dayNumber: 'Dzień {{day}}',
    completePreviousLessons: 'Ukończ poprzednie lekcje',
    points: 'punkty',
    xp: 'XP',
    previousDay: 'Poprzedni dzień',
    takeQuiz: 'Rozwiąż quiz',
    completing: 'Kończenie...',
    markAsComplete: 'Oznacz jako ukończone',
    completed: 'Ukończone',
    nextDay: 'Następny dzień',
    quizRequiredMessage: 'Aby kontynuować, musisz zaliczyć dzisiejszy quiz.',
    testYourKnowledge: 'Sprawdź swoją wiedzę',
    assessmentDescription: 'Sprawdź swoją wiedzę w grach',
    playAssessment: 'Rozpocznij ocenę',
    failedToStartAssessment: 'Nie udało się uruchomić oceny',
    lessonLocked: 'Lekcja zablokowana',
    goToDay: 'Przejdź do dnia {{day}}',
    mustPassQuiz: 'Najpierw musisz zaliczyć quiz',
    failedToComplete: 'Nie udało się ukończyć',
    failedToLoadLesson: 'Nie udało się załadować lekcji',
  },
  sw: {
    loadingLesson: 'Inapakia somo...',
    lessonNotFound: 'Somo halijapatikana',
    backToMyCourses: 'Rudi kwenye kozi zangu',
    backToCourse: 'Rudi kwenye kozi',
    dayNumber: 'Siku {{day}}',
    completePreviousLessons: 'Kamilisha masomo yaliyotangulia kufungua hili.',
    points: 'pointi',
    xp: 'XP',
    previousDay: 'Siku iliyotangulia',
    takeQuiz: 'Fanya jaribio',
    completing: 'Inakamilisha...',
    markAsComplete: 'Weka kama imekamilika',
    completed: 'Imekamilika',
    nextDay: 'Siku inayofuata',
    quizRequiredMessage: 'Unahitaji kupita jaribio ({{count}}/{{count}}) kukamilisha somo hili. Tumia kitufe "Fanya Jaribio" kufungua.',
    quizRequiredMaxWrongMessage: 'Ili kukamilisha somo hili, unaweza kukosea si zaidi ya maswali {{maxWrong}} kati ya {{count}}. Tumia kitufe "Fanya Jaribio" kufungua.',
    testYourKnowledge: 'Jaribu Ujuzi wako',
    assessmentDescription: 'Kamilisha mchezo wa tathmini kuthibitisha ulichojifunza. Matokeo yako yataunganishwa na somo hili.',
    playAssessment: 'Cheza Tathmini →',
    failedToStartAssessment: 'Imeshindwa kuanza tathmini. Tafadhali jaribu tena.',
    lessonLocked: 'Somo limefungwa',
    goToDay: 'Nenda kwenye Siku {{day}}',
    mustPassQuiz: 'Lazima upite jaribio kabla ya kukamilisha somo.',
    failedToComplete: 'Imeshindwa kukamilisha somo',
    failedToLoadLesson: 'Imeshindwa kupakia somo',
  },
};

// Helper to get translation by course language
const getDayPageText = (key: string, courseLang: string, params?: Record<string, string | number>): string => {
  const lang = courseLang || 'en';
  const translations = dayPageTranslations[lang] || dayPageTranslations.en;
  let text = translations[key] || dayPageTranslations.en[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      const placeholder = `{{${k}}}`;
      text = text.split(placeholder).join(String(v));
    });
  }
  return text;
};

export default function DailyLessonPage({
  params,
}: {
  params: Promise<{ courseId: string; dayNumber: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [navigation, setNavigation] = useState<Navigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [courseId, setCourseId] = useState<string>('');
  const [dayNumber, setDayNumber] = useState<number>(0);
  const [quizPassed, setQuizPassed] = useState(false);
  const [courseLanguage, setCourseLanguage] = useState<string>('en');
  const [totalDays, setTotalDays] = useState<number>(30);
  const [quizPolicy, setQuizPolicy] = useState<QuizPolicy | null>(null);
  const [isSavedLesson, setIsSavedLesson] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);
  const [accessIssue, setAccessIssue] = useState<LessonAccessIssue>(null);
  const searchParams = useSearchParams();
  const locale = useLocale(); // URL locale (e.g. /hu/ → 'hu') for fallback when lesson not found before courseLanguage is set

  const fetchLesson = useCallback(async (cid: string, day: number, opts: { silent?: boolean; fallbackLanguage?: string } = {}) => {
    const errorLanguage = opts.fallbackLanguage || 'en';
    try {
      if (!opts.silent) {
        setLoading(true);
      }
      const response = await fetch(`/api/courses/${cid}/day/${day}`);
      const data = await response.json();

      if (data.success) {
        setAccessIssue(null);
        // Store course language for UI translations
        if (data.courseLanguage) {
          setCourseLanguage(data.courseLanguage);
        }

        setLesson(data.lesson);
        setNavigation(data.navigation);
        if (data.progress?.totalDays != null) setTotalDays(data.progress.totalDays);
        setQuizPolicy(data.quizPolicy ?? null);
        // Refresh quiz passed flag from localStorage (set by quiz page)
        // Include player ID in key to make it user-specific
        const user = session?.user as { id?: string; playerId?: string } | undefined;
        const playerId = user?.playerId || user?.id;
        const storageKey = playerId 
          ? `quiz-passed-${playerId}-${cid}-${data.lesson.lessonId}`
          : `quiz-passed-${cid}-${data.lesson.lessonId}`;
        const stored = localStorage.getItem(storageKey);
        setQuizPassed(stored === 'true');
      } else {
        // Use localized message for known API errors (avoid English "Lesson not found" in /hu/ etc.)
        const message =
          data.error === 'Lesson not found'
            ? getDayPageText('lessonNotFound', errorLanguage)
            : (data.error || getDayPageText('failedToLoadLesson', errorLanguage));
        setLesson(null);
        setAccessIssue({
          status: response.status,
          title: response.status === 401 ? 'Sign in required' : response.status === 404 ? getDayPageText('lessonNotFound', errorLanguage) : getDayPageText('failedToLoadLesson', errorLanguage),
          message: response.status === 401
            ? 'Sign in to continue this course from your saved progress.'
            : message,
          action: response.status === 401 ? 'signin' : response.status === 404 ? 'course' : 'retry',
        });
      }
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
      setLesson(null);
      setAccessIssue({
        status: 0,
        title: getDayPageText('failedToLoadLesson', errorLanguage),
        message: 'The lesson could not be loaded. Retry the request or return to the course overview.',
        action: 'retry',
      });
    } finally {
      if (!opts.silent) {
        setLoading(false);
      }
    }
  }, [session]);

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const cid = resolvedParams.courseId;
      const day = parseInt(resolvedParams.dayNumber);
      
      setCourseId(cid);
      setDayNumber(day);
      
      // Extract language from courseId suffix (e.g., PRODUCTIVITY_2026_AR → ar)
      // This ensures links use correct language immediately, before API call
      const parts = cid.split('_');
      const suffix = parts[parts.length - 1].toLowerCase();
      const validLanguages = ['hu', 'en', 'ar', 'ru', 'pt', 'vi', 'id', 'hi', 'tr', 'bg', 'pl'];
      const fallbackLanguage = validLanguages.includes(suffix) ? suffix : 'en';
      if (validLanguages.includes(suffix)) {
        setCourseLanguage(suffix);
      }
      
      await fetchLesson(cid, day, { fallbackLanguage });
    };
    void loadData();
  }, [fetchLesson, params]);

  useEffect(() => {
    const fetchSavedStatus = async () => {
      if (!session?.user || !courseId || !dayNumber) return;
      try {
        const response = await fetch(
          `/api/saved-lessons?courseId=${encodeURIComponent(courseId)}&lessonDay=${dayNumber}`,
          { cache: 'no-store' }
        );
        if (!response.ok) return;
        const data = await response.json();
        setIsSavedLesson(data.isSaved === true);
      } catch (error) {
        console.error('Failed to fetch saved lesson status:', error);
      }
    };

    void fetchSavedStatus();
  }, [courseId, dayNumber, session?.user]);

  const handleComplete = async () => {
    if (!lesson || completing) return;

    const quizEnabled = quizPolicy?.enabled ?? lesson.quizConfig?.enabled ?? false;
    const quizRequired = quizPolicy?.required ?? lesson.quizConfig?.required ?? false;
    if (quizEnabled && quizRequired && !quizPassed) {
      alert(getDayPageText('mustPassQuiz', courseLanguage));
      return;
    }

    setCompleting(true);
    try {
      const practiceContext = readPracticeContextFromSearchParams(searchParams);
      const response = await fetch(`/api/courses/${courseId}/day/${dayNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          practiceContext ? { practiceContext } : {}
        ),
      });

      const data = await response.json();

      if (data.success) {
        trackGAEvent('lesson_complete', { course_id: courseId, day_number: dayNumber });
        // Optimistically update UI without flashing the whole page
        setLesson((prev) =>
          prev
            ? {
                ...prev,
                isCompleted: true,
              }
            : prev
        );
        // Refresh lesson state silently to pick up progress/unlocks
        await fetchLesson(courseId, dayNumber, { silent: true, fallbackLanguage: courseLanguage });

        if (practiceContext) {
          await fetch('/api/practice-hub/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              practiceContext,
              trigger: 'lesson_completed',
            }),
          });
        }
        // Alert removed - lesson completion is already visible in the UI
      } else {
        alert(data.error || getDayPageText('failedToComplete', courseLanguage));
      }
    } catch (error) {
      console.error('Failed to complete lesson:', error);
      alert(getDayPageText('failedToComplete', courseLanguage));
    } finally {
      setCompleting(false);
    }
  };

  const handleToggleSavedLesson = async () => {
    if (!lesson?.lessonId || !courseId || !dayNumber || savingLesson) return;

    setSavingLesson(true);
    try {
      const response = await fetch('/api/saved-lessons', {
        method: isSavedLesson ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          lessonDay: dayNumber,
          lessonId: lesson.lessonId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update saved lesson');
      }

      const data = await response.json();
      setIsSavedLesson(data.saved === true);
    } catch (error) {
      console.error('Failed to update saved lesson:', error);
    } finally {
      setSavingLesson(false);
    }
  };

  useEffect(() => {
    // If quiz page redirected back with query flag, mark as passed
    const qp = searchParams.get('quiz');
    if (qp === 'passed' && lesson) {
      // Include player ID in key to make it user-specific
      const user = session?.user as { id?: string; playerId?: string } | undefined;
      const playerId = user?.playerId || user?.id;
      const key = playerId 
        ? `quiz-passed-${playerId}-${courseId}-${lesson.lessonId}`
        : `quiz-passed-${courseId}-${lesson.lessonId}`;
      localStorage.setItem(key, 'true');
      setQuizPassed(true);
    }
  }, [searchParams, lesson, courseId, session]);

  if (loading) {
    const displayLang = courseLanguage !== 'en' ? courseLanguage : (locale || 'en');
    const dir = (displayLang === 'ar' ? 'rtl' : 'ltr') as 'rtl' | 'ltr';
    return (
      <Box bg="ink.9" mih="100vh" py="xl" dir={dir}>
        <Container size="md">
          <Card padding="lg">
            <Stack gap="md">
              <Text fw={700}>{getDayPageText('loadingLesson', displayLang)}</Text>
              <Skeleton height={32} width="70%" />
              <Skeleton height={18} />
              <Skeleton height={18} />
              <Skeleton height={18} width="85%" />
            </Stack>
          </Card>
        </Container>
      </Box>
    );
  }

  if (!lesson) {
    // Use URL locale as fallback so /hu/ always shows Hungarian message (courseLanguage may still be initial 'en')
    const displayLang = courseLanguage !== 'en' ? courseLanguage : (locale || 'en');
    const dir = (displayLang === 'ar' ? 'rtl' : 'ltr') as 'rtl' | 'ltr';
    const issue = accessIssue ?? {
      status: 404,
      title: getDayPageText('lessonNotFound', displayLang),
      message: getDayPageText('failedToLoadLesson', displayLang),
      action: 'course' as const,
    };
    return (
      <Box bg="ink.9" mih="100vh" py="xl" dir={dir}>
        <Container size="sm">
          <Card padding="lg">
            <Stack gap="md">
              <Alert
                color={issue.status === 401 ? 'yellow' : 'red'}
                variant="light"
                title={issue.title}
                icon={issue.status === 401 ? <IconLock size={18} /> : <IconAlertTriangle size={18} />}
              >
                <Text>{issue.message}</Text>
              </Alert>
              <GroupForAccessActions
                issue={issue}
                courseId={courseId}
                courseLanguage={courseLanguage || displayLang}
                onRetry={() => void fetchLesson(courseId, dayNumber, { fallbackLanguage: displayLang })}
                signInHref={`/auth/signin?callbackUrl=${encodeURIComponent(`/${courseLanguage || displayLang}/courses/${courseId}/day/${dayNumber}`)}`}
                backLabel={getDayPageText('backToCourse', displayLang)}
              />
            </Stack>
          </Card>
        </Container>
      </Box>
    );
  }

  const effectiveQuizPolicy: QuizPolicy | null = quizPolicy ?? (
    lesson.quizConfig
      ? {
          enabled: lesson.quizConfig.enabled,
          required: lesson.quizConfig.required,
          questionCount: lesson.quizConfig.questionCount,
          successThreshold: lesson.quizConfig.successThreshold,
          availableQuestionCount: lesson.quizConfig.poolSize,
        }
      : null
  );
  const isQuizEnabled = effectiveQuizPolicy?.enabled === true;
  const isQuizRequired = effectiveQuizPolicy?.required === true;
  const effectiveQuestionCount = effectiveQuizPolicy?.questionCount ?? 5;
  const quizMaxWrongAllowed = effectiveQuizPolicy?.maxWrongAllowed;
  const hasMaxWrongRule =
    typeof quizMaxWrongAllowed === 'number' && quizMaxWrongAllowed >= 0;
  const courseLanguageBase = courseLanguage.toLowerCase().split('-')[0];
  const showMaxWrongMessageByLanguage = ['hu', 'en', 'ru', 'sw'].includes(courseLanguageBase);
  const quizRequiredMessage = hasMaxWrongRule && showMaxWrongMessageByLanguage
    ? getDayPageText('quizRequiredMaxWrongMessage', courseLanguageBase, {
        maxWrong: quizMaxWrongAllowed,
        count: effectiveQuestionCount,
      })
    : getDayPageText('quizRequiredMessage', courseLanguage, {
        count: effectiveQuestionCount,
      });

  return (
    <div className="min-h-screen bg-brand-black pb-safe" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Logo size="sm" showText={false} linkTo={session?.user ? "/dashboard" : "/"} className="flex-shrink-0" />
              <LocaleLink
                href={`/${courseLanguage}/courses/${courseId}`}
                className="min-h-[44px] inline-flex items-center gap-2 text-brand-white hover:text-brand-accent truncate"
              >
                <ArrowLeft className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{getDayPageText('backToCourse', courseLanguage)}</span>
              </LocaleLink>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-bold text-brand-white">
                {getDayPageText('dayNumber', courseLanguage, { day: lesson.dayNumber })} / {totalDays}
              </span>
              <div className="w-24 sm:w-32 h-1.5 bg-brand-darkGrey/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-accent rounded-full transition-all"
                  style={{ width: `${Math.min(100, (lesson.dayNumber / totalDays) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        {/* Lesson Header */}
        <div className="bg-brand-white rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-brand-accent shadow-lg mb-6 sm:mb-8">
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {lesson.isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : !lesson.isUnlocked ? (
                  <Lock className="w-6 h-6 text-brand-darkGrey" />
                ) : null}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-black leading-tight break-words">{lesson.title}</h1>
              </div>
              {!lesson.isUnlocked && (
                <div className="bg-brand-darkGrey/20 border border-brand-darkGrey rounded-lg p-3 mt-3">
                  <p className="text-brand-darkGrey">
                    {getDayPageText('completePreviousLessons', courseLanguage)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {lesson.isUnlocked && (
            <div className="flex items-center gap-4 text-base text-brand-darkGrey mt-2">
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{lesson.pointsReward} {getDayPageText('points', courseLanguage)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{lesson.xpReward} {getDayPageText('xp', courseLanguage)}</span>
              </div>
            </div>
          )}
          {lesson.isUnlocked && session?.user ? (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleToggleSavedLesson}
                disabled={savingLesson}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-lg border-2 border-brand-accent px-4 py-2 font-bold text-brand-black transition-colors hover:bg-brand-accent/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavedLesson ? (
                  <BookmarkCheck className="h-5 w-5 text-brand-accent" />
                ) : (
                  <Bookmark className="h-5 w-5 text-brand-accent" />
                )}
                <span>
                  {savingLesson
                    ? getDayPageText('savingLesson', courseLanguage)
                    : isSavedLesson
                    ? getDayPageText('removeSavedLesson', courseLanguage)
                    : getDayPageText('saveLesson', courseLanguage)}
                </span>
              </button>
            </div>
          ) : null}
        </div>

        {/* Lesson Content */}
        {lesson.isUnlocked ? (
          <>
            {/* Actions - Moved to top */}
            <div className="bg-brand-white rounded-2xl p-4 sm:p-6 border-2 border-brand-accent shadow-lg mb-6 sm:mb-8">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
                {/* Left: Previous Day */}
                <div className="flex-1 flex justify-start">
                  {navigation?.previous && (
                    <LocaleLink
                      href={`/${courseLanguage}/courses/${courseId}/day/${navigation.previous.day}`}
                      className="min-h-[44px] flex items-center justify-center gap-2 bg-brand-darkGrey text-brand-white px-6 py-3 rounded-lg font-bold hover:bg-brand-secondary-700 transition-colors w-full touch-manipulation"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      {getDayPageText('previousDay', courseLanguage)}
                    </LocaleLink>
                  )}
                </div>

                {/* Center: Quiz and Complete buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 flex-shrink-0 w-full md:w-auto">
                  {/* Show quiz button if quiz is enabled and lesson not completed */}
                  {isQuizEnabled && !lesson.isCompleted && (
                    <LocaleLink
                      href={`/${courseLanguage}/courses/${courseId}/day/${dayNumber}/quiz`}
                      className={`min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors text-base whitespace-nowrap touch-manipulation ${
                        isQuizRequired && !quizPassed
                          ? 'bg-brand-accent text-brand-black hover:bg-brand-primary-400 px-7 py-3.5 w-full'
                          : 'bg-brand-white border-2 border-brand-accent text-brand-black hover:bg-brand-accent/80 w-full'
                      }`}
                    >
                      {getDayPageText('takeQuiz', courseLanguage)}
                    </LocaleLink>
                  )}

                  {/* Show "Mark as Complete" button only if:
                      - Lesson not completed AND
                      - (No quiz required OR quiz already passed) */}
                  {!lesson.isCompleted && 
                   !(isQuizEnabled && isQuizRequired && !quizPassed) && (
                    <button
                      onClick={handleComplete}
                      disabled={completing}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 bg-brand-accent text-brand-black px-7 py-3.5 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base whitespace-nowrap w-full touch-manipulation"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {completing ? getDayPageText('completing', courseLanguage) : getDayPageText('markAsComplete', courseLanguage)}
                    </button>
                  )}

                  {/* Show completed state */}
                  {lesson.isCompleted && (
                    <div className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold whitespace-nowrap w-full">
                      <CheckCircle className="w-5 h-5" />
                      {getDayPageText('completed', courseLanguage)}
                    </div>
                  )}
                </div>

                {/* Right: Next Day */}
                <div className="flex-1 flex justify-end">
                  {navigation?.next && (
                    <LocaleLink
                      href={`/${courseLanguage}/courses/${courseId}/day/${navigation.next.day}`}
                      className="min-h-[44px] flex items-center justify-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors w-full touch-manipulation"
                    >
                      {getDayPageText('nextDay', courseLanguage)}
                      <ArrowRight className="w-5 h-5" />
                    </LocaleLink>
                  )}
                </div>
              </div>
              {isQuizEnabled && isQuizRequired && !quizPassed && (
                <p className="mt-4 text-sm text-brand-darkGrey text-center">
                  {quizRequiredMessage}
                </p>
              )}
            </div>

            <div className="bg-brand-white rounded-2xl p-6 sm:p-10 border-2 border-brand-accent shadow-lg mb-6 sm:mb-8">
              <div
                className="prose prose-base sm:prose-lg lesson-prose max-w-none text-brand-black"
                dangerouslySetInnerHTML={{ __html: contentToHtml(lesson.content, { stripFirstH1: true }) }}
              />
              <ContentVoteWidget
                targetType="lesson"
                targetId={lesson._id}
                playerId={(session?.user as { id?: string; playerId?: string } | undefined)?.playerId ?? (session?.user as { id?: string } | undefined)?.id ?? null}
                label="Was this lesson helpful?"
                mt="xl"
              />
            </div>

            {/* Assessment Game */}
            {lesson.assessmentGameId && lesson.isCompleted && (
              <div className="bg-brand-accent/20 border-2 border-brand-accent rounded-xl p-8 mt-8">
                <h3 className="text-2xl font-bold text-brand-black mb-3 flex items-center gap-2">
                  <Play className="w-6 h-6" />
                  {getDayPageText('testYourKnowledge', courseLanguage)}
                </h3>
                <p className="text-brand-darkGrey mb-5">
                  {getDayPageText('assessmentDescription', courseLanguage)}
                </p>
                {lesson.assessmentGameRoute ? (
                  <LocaleLink
                    href={`${lesson.assessmentGameRoute}?courseId=${courseId}&lessonDay=${dayNumber}&assessment=true`}
                    className="min-h-[44px] inline-flex items-center justify-center bg-brand-accent text-brand-black px-7 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors text-base touch-manipulation"
                  >
                    {getDayPageText('playAssessment', courseLanguage)}
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
                          alert(getDayPageText('failedToStartAssessment', courseLanguage));
                        }
                      } catch (error) {
                        console.error('Failed to start assessment:', error);
                        alert(getDayPageText('failedToStartAssessment', courseLanguage));
                      }
                    }}
                    className="min-h-[44px] inline-flex items-center justify-center bg-brand-accent text-brand-black px-7 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors text-base touch-manipulation"
                  >
                    {getDayPageText('playAssessment', courseLanguage)}
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-brand-darkGrey rounded-xl p-12 text-center border-2 border-brand-accent">
            <Lock className="w-16 h-16 text-brand-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-brand-white mb-2">{getDayPageText('lessonLocked', courseLanguage)}</h3>
            <p className="text-brand-white/70 mb-6">
              {getDayPageText('completePreviousLessons', courseLanguage)}
            </p>
              {navigation?.previous && (
                <LocaleLink
                  href={`/${courseLanguage}/courses/${courseId}/day/${navigation.previous.day}`}
                  className="min-h-[44px] inline-flex items-center justify-center bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors touch-manipulation"
                >
                  {getDayPageText('goToDay', courseLanguage, { day: navigation.previous.day })}
                </LocaleLink>
              )}
          </div>
        )}
      </main>
    </div>
  );
}
