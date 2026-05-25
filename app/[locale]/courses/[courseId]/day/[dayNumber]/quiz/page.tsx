/**
 * Lesson Quiz Page (one question at a time, supportive flow)
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';
import { useSession } from 'next-auth/react';
import { readPracticeContextFromSearchParams } from '@/app/lib/practice-hub';
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Progress,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCheck,
  IconCircleCheck,
  IconX,
} from '@tabler/icons-react';
import { trackGAEvent } from '@/app/lib/analytics/ga-events';
import {
  resolveCourseAccessIssue,
  type CourseAccessRecoveryIssue,
} from '@/app/lib/course-access-recovery';
import CourseAccessRecoveryActions from '@/app/components/patterns/CourseAccessRecoveryActions';

interface LessonResponse {
  success: boolean;
  lesson?: {
    lessonId: string;
    title: string;
    quizConfig?: {
      enabled: boolean;
      questionCount: number;
    };
  };
  quizPolicy?: {
    enabled: boolean;
    required: boolean;
    questionCount: number;
    shownAnswerCount: number;
    maxWrongAllowed?: number;
    successThreshold: number;
    availableQuestionCount?: number;
  };
  error?: string;
}

type LessonDayApiResponse = LessonResponse & { courseLanguage?: string };

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface QuizSubmitResult {
  questionId: string;
  question: string;
  selectedIndex?: number;
  isCorrect: boolean;
  correctAnswer?: string;
  explanation?: string | null;
}

type QuizAccessIssue = CourseAccessRecoveryIssue | null;

// Static translations for quiz page - keyed by COURSE LANGUAGE
const quizPageTranslations: Record<string, Record<string, string>> = {
  ar: {
    failedToLoadLesson: 'فشل تحميل الدرس',
    quizError: 'حدث خطأ في الاختبار',
    noQuizQuestions: 'لا توجد أسئلة متاحة لهذا الدرس. قد لا تكون الأسئلة جاهزة بعد لهذا المساق.',
    someQuestionsNotFound: 'بعض الأسئلة غير موجودة. حاول مرة أخرى.',
    quizCorrect: 'إجابة صحيحة، أحسنت! 🚀',
    quizSupportiveRetry: 'إجابة غير صحيحة. حاول مرة أخرى!',
    backToLesson: 'العودة إلى الدرس',
    questionProgress: 'السؤال {{current}} / {{total}}',
    lessonQuiz: 'اختبار الدرس',
    quiz: 'اختبار',
    question: 'سؤال',
  },
  hu: {
    failedToLoadLesson: 'Nem sikerült betölteni a leckét',
    quizError: 'Hiba történt a kérdések betöltésekor.',
    noQuizQuestions: 'Nincs elérhető értékelési kérdés ehhez a leckéhez. A kurzus kérdései még nem készültek el.',
    someQuestionsNotFound: 'Néhány kérdés nem található. Kérjük, próbáld meg újra.',
    quizCorrect: 'Helyes válasz, szép munka! 🚀',
    quizSupportiveRetry: 'Most nem talált. Nézzük át újra a leckét, aztán próbáld meg ismét.',
    backToLesson: 'Vissza a leckéhez',
    questionProgress: 'Kérdés: {{current}} / {{total}}',
    lessonQuiz: 'Lecke értékelés',
    quiz: 'Kvíz',
    question: 'Kérdés',
  },
  en: {
    failedToLoadLesson: 'Failed to load lesson',
    quizError: 'An error occurred while loading questions.',
    noQuizQuestions: 'No questions available for this lesson. Questions may not be ready yet for this course.',
    someQuestionsNotFound: 'Some questions not found. Please try again.',
    quizCorrect: 'Correct. Well done.',
    quizSupportiveRetry: 'Not quite. Let\'s review the lesson, then try again.',
    backToLesson: 'Back to lesson',
    questionProgress: 'Question {{current}} / {{total}}',
    lessonQuiz: 'Lesson Quiz',
    quiz: 'Quiz',
    question: 'Question',
    correctAnswerLabel: 'Correct answer',
    explanationLabel: 'Why this answer works',
  },
  ru: {
    failedToLoadLesson: 'Не удалось загрузить урок',
    quizError: 'Ошибка загрузки вопросов.',
    noQuizQuestions: 'Нет вопросов для этого урока. Вопросы по курсу могут быть ещё не готовы.',
    someQuestionsNotFound: 'Некоторые вопросы не найдены. Попробуйте снова.',
    quizCorrect: 'Верно. Отлично!',
    quizSupportiveRetry: 'Не совсем. Давайте вернемся к уроку и попробуем снова.',
    backToLesson: 'Назад к уроку',
    questionProgress: 'Вопрос {{current}} / {{total}}',
    lessonQuiz: 'Квиз к уроку',
    quiz: 'Квиз',
    question: 'Вопрос',
  },
  pt: {
    failedToLoadLesson: 'Falha ao carregar a aula',
    quizError: 'Erro no questionário',
    noQuizQuestions: 'Nenhuma pergunta disponível para esta aula. As perguntas do curso podem ainda não estar prontas.',
    someQuestionsNotFound: 'Algumas perguntas não foram encontradas. Tente novamente.',
    quizCorrect: 'Resposta correta, ótimo trabalho! 🚀',
    quizSupportiveRetry: 'Resposta incorreta. Tente novamente!',
    backToLesson: 'Voltar à aula',
    questionProgress: 'Pergunta {{current}} / {{total}}',
    lessonQuiz: 'Questionário da aula',
    quiz: 'Questionário',
    question: 'Pergunta',
  },
  vi: {
    failedToLoadLesson: 'Không thể tải bài học',
    quizError: 'Lỗi bài kiểm tra',
    noQuizQuestions: 'Không có câu hỏi cho bài học này. Câu hỏi của khóa học có thể chưa sẵn sàng.',
    someQuestionsNotFound: 'Một số câu hỏi không tìm thấy. Vui lòng thử lại.',
    quizCorrect: 'Câu trả lời đúng, làm tốt! 🚀',
    quizSupportiveRetry: 'Câu trả lời chưa đúng. Hãy thử lại!',
    backToLesson: 'Quay lại bài học',
    questionProgress: 'Câu hỏi {{current}} / {{total}}',
    lessonQuiz: 'Bài kiểm tra bài học',
    quiz: 'Bài kiểm tra',
    question: 'Câu hỏi',
  },
  id: {
    failedToLoadLesson: 'Gagal memuat pelajaran',
    quizError: 'Terjadi kesalahan kuis',
    noQuizQuestions: 'Tidak ada pertanyaan tersedia untuk pelajaran ini. Pertanyaan kursus mungkin belum siap.',
    someQuestionsNotFound: 'Beberapa pertanyaan tidak ditemukan. Silakan coba lagi.',
    quizCorrect: 'Jawaban benar, kerja bagus! 🚀',
    quizSupportiveRetry: 'Jawaban salah. Coba lagi!',
    backToLesson: 'Kembali ke pelajaran',
    questionProgress: 'Pertanyaan {{current}} / {{total}}',
    lessonQuiz: 'Kuis pelajaran',
    quiz: 'Kuis',
    question: 'Pertanyaan',
  },
  hi: {
    failedToLoadLesson: 'पाठ लोड नहीं हो सका',
    quizError: 'प्रश्नोत्तरी त्रुटि',
    noQuizQuestions: 'इस पाठ के लिए कोई प्रश्न उपलब्ध नहीं। इस पाठ्यक्रम के प्रश्न अभी तैयार नहीं हो सकते।',
    someQuestionsNotFound: 'कुछ प्रश्न नहीं मिले। कृपया फिर से प्रयास करें।',
    quizCorrect: 'सही उत्तर, बढ़िया काम! 🚀',
    quizSupportiveRetry: 'गलत उत्तर। फिर से प्रयास करें!',
    backToLesson: 'पाठ पर वापस जाएँ',
    questionProgress: 'प्रश्न {{current}} / {{total}}',
    lessonQuiz: 'पाठ प्रश्नोत्तरी',
    quiz: 'प्रश्नोत्तरी',
    question: 'प्रश्न',
  },
  tr: {
    failedToLoadLesson: 'Ders yüklenemedi',
    quizError: 'Sınav hatası',
    noQuizQuestions: 'Bu ders için soru bulunmuyor. Kurs soruları henüz hazır olmayabilir.',
    someQuestionsNotFound: 'Bazı sorular bulunamadı. Lütfen tekrar deneyin.',
    quizCorrect: 'Doğru cevap, harika iş! 🚀',
    quizSupportiveRetry: 'Yanlış cevap. Tekrar deneyin!',
    backToLesson: 'Derse dön',
    questionProgress: 'Soru {{current}} / {{total}}',
    lessonQuiz: 'Ders sınavı',
    quiz: 'Sınav',
    question: 'Soru',
  },
  bg: {
    failedToLoadLesson: 'Неуспешно зареждане на урока',
    quizError: 'Грешка в теста',
    noQuizQuestions: 'Няма налични въпроси за този урок. Въпросите за курса може още да не са готови.',
    someQuestionsNotFound: 'Някои въпроси не са намерени. Моля, опитайте отново.',
    quizCorrect: 'Правилен отговор, браво! 🚀',
    quizSupportiveRetry: 'Грешен отговор. Опитайте отново!',
    backToLesson: 'Назад към урока',
    questionProgress: 'Въпрос {{current}} / {{total}}',
    lessonQuiz: 'Тест за урока',
    quiz: 'Тест',
    question: 'Въпрос',
  },
  pl: {
    failedToLoadLesson: 'Nie udało się załadować lekcji',
    quizError: 'Błąd quizu',
    noQuizQuestions: 'Brak pytań do tej lekcji. Pytania do kursu mogą nie być jeszcze gotowe.',
    someQuestionsNotFound: 'Nie znaleziono niektórych pytań. Spróbuj ponownie.',
    quizCorrect: 'Poprawna odpowiedź, świetna robota! 🚀',
    quizSupportiveRetry: 'Niepoprawna odpowiedź. Spróbuj ponownie!',
    backToLesson: 'Wróć do lekcji',
    questionProgress: 'Pytanie {{current}} / {{total}}',
    lessonQuiz: 'Quiz lekcji',
    quiz: 'Quiz',
    question: 'Pytanie',
  },
  sw: {
    failedToLoadLesson: 'Imeshindwa kupakia somo',
    quizError: 'Hitilafu katika jaribio',
    noQuizQuestions: 'Hakuna maswali yanayopatikana kwa somo hili. Maswali ya kozi huenda bado hayajaandaliwa.',
    someQuestionsNotFound: 'Baadhi ya maswali hayakupatikana. Tafadhali jaribu tena.',
    quizCorrect: 'Jibu sahihi, vizuri! 🚀',
    quizSupportiveRetry: 'Jibu si sahihi. Jaribu tena!',
    backToLesson: 'Rudi kwenye somo',
    questionProgress: 'Swali {{current}} / {{total}}',
    lessonQuiz: 'Jaribio la Somo',
    quiz: 'Jaribio',
    question: 'Swali',
  },
};

// Helper to get translation by course language
const getQuizPageText = (key: string, courseLang: string, params?: Record<string, string | number>): string => {
  const lang = courseLang || 'en';
  const translations = quizPageTranslations[lang] || quizPageTranslations.en;
  let text = translations[key] || quizPageTranslations.en[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{{${k}}}`, String(v));
    });
  }
  return text;
};

export default function LessonQuizPage({
  params,
}: {
  params: Promise<{ courseId: string; dayNumber: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const [courseId, setCourseId] = useState<string>('');
  const [courseLanguage, setCourseLanguage] = useState<string>('en');
  const [dayNumber, setDayNumber] = useState<number>(0);
  const [lessonId, setLessonId] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [answerExplanation, setAnswerExplanation] = useState<string | null>(null);
  const [correctAnswerLabel, setCorrectAnswerLabel] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accessIssue, setAccessIssue] = useState<QuizAccessIssue>(null);
  const [quizMaxWrongAllowed, setQuizMaxWrongAllowed] = useState<number | undefined>(undefined);
  const [wrongCount, setWrongCount] = useState(0);

  const loadLessonAndQuestions = useCallback(async (cid: string, day: number, fallbackLanguage: string) => {
    try {
      setLoading(true);
      setError(null);
      setAccessIssue(null);
      const lessonRes = await fetch(`/api/courses/${cid}/day/${day}`, { cache: 'no-store' });
      const lessonData = (await lessonRes.json()) as LessonDayApiResponse;
      const apiLanguage = lessonData.courseLanguage || fallbackLanguage;

      // Get course language from API response FIRST
      if (lessonData.courseLanguage) setCourseLanguage(lessonData.courseLanguage);
      
      if (!lessonData.success || !lessonData.lesson) {
        const issue = resolveCourseAccessIssue(lessonRes.status, lessonData, apiLanguage, 'quiz');
        setAccessIssue(issue);
        setError(issue.message);
        return;
      }
      
      setLessonId(lessonData.lesson.lessonId);
      setLessonTitle(lessonData.lesson.title);
      setQuizMaxWrongAllowed(lessonData.quizPolicy?.maxWrongAllowed);
      setWrongCount(0);

      if (lessonData.quizPolicy?.enabled === false) {
        setError(getQuizPageText('noQuizQuestions', apiLanguage));
        return;
      }

      const count = lessonData.quizPolicy?.questionCount ?? lessonData.lesson.quizConfig?.questionCount ?? 5;
      const qRes = await fetch(
        `/api/games/quizzz/questions?lessonId=${lessonData.lesson.lessonId}&courseId=${cid}&count=${count}&shownAnswerCount=${lessonData.quizPolicy?.shownAnswerCount ?? 3}&t=${Date.now()}`,
        { cache: 'no-store' }
      );
      const qData = await qRes.json();
      if (qData.ok && qData.data?.questions?.length) {
        setQuestions(qData.data.questions);
        setCurrentIndex(0);
      } else {
        setError(qData.error?.code === 'NO_QUESTIONS' ? getQuizPageText('noQuizQuestions', apiLanguage) : (qData.error?.message || getQuizPageText('quizError', apiLanguage)));
      }
    } catch (err) {
      console.error(err);
      const issue = resolveCourseAccessIssue(0, {}, fallbackLanguage, 'quiz');
      setAccessIssue(issue);
      setError(issue.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const resolved = await params;
      const cid = resolved.courseId;
      const day = parseInt(resolved.dayNumber);
      
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
      
      await loadLessonAndQuestions(cid, day, fallbackLanguage);
    };
    init();
  }, [loadLessonAndQuestions, params]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = async (option: string, optionIndex: number) => {
    if (!currentQuestion || answering) return;
    setAnswering(true);
    setFeedback(null);
    setAnswerExplanation(null);
    setCorrectAnswerLabel(null);
    setIsAnswerCorrect(null);
    try {
      const res = await fetch(
        `/api/courses/${courseId}/lessons/${lessonId}/quiz/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: [
              {
                questionId: currentQuestion.id,
                selectedIndex: optionIndex,
                selectedOption: option,
              },
            ],
          }),
        }
      );
      const data = await res.json();
      if (!data.success) {
        // Handle specific error codes with translated messages
        if (data.errorCode === 'QUESTIONS_NOT_FOUND') {
          setError(getQuizPageText('someQuestionsNotFound', courseLanguage));
        } else {
          setError(data.error || getQuizPageText('quizError', courseLanguage));
        }
        setAnswering(false);
        return;
      }

      const result = data.results?.[0] as QuizSubmitResult | undefined;
      const isCorrect = result?.isCorrect === true;
      trackGAEvent('quiz_submit', {
        course_id: courseId,
        lesson_id: lessonId,
        score: isCorrect ? 1 : 0,
      });
      setIsAnswerCorrect(result?.isCorrect ?? null);
      if (isCorrect) {
        setFeedback(getQuizPageText('quizCorrect', courseLanguage));
        const nextIndex = currentIndex + 1;
        if (nextIndex >= questions.length) {
          // Quiz finished; mark passed locally
          // Include player ID in key to make it user-specific
          if (lessonId) {
            const user = session?.user as { id?: string; playerId?: string } | undefined;
            const playerId = user?.playerId || user?.id;
            const key = playerId 
              ? `quiz-passed-${playerId}-${courseId}-${lessonId}`
              : `quiz-passed-${courseId}-${lessonId}`;
            localStorage.setItem(key, 'true');
          }
          setTimeout(() => {
            const completePracticeFlow = async () => {
              const practiceContext = readPracticeContextFromSearchParams(searchParams);
              if (practiceContext) {
                try {
                  await fetch('/api/practice-hub/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      practiceContext,
                      trigger: 'quiz_passed',
                    }),
                  });
                } catch (practiceError) {
                  console.error('Failed to record Practice Hub quiz completion:', practiceError);
                }
              }

              router.replace(`/${courseLanguage || locale}/courses/${courseId}/day/${dayNumber}?quiz=passed`);
            };

            void completePracticeFlow();
          }, 900);
        } else {
          setTimeout(() => {
            setFeedback(null);
            setAnswerExplanation(null);
            setCorrectAnswerLabel(null);
            setIsAnswerCorrect(null);
            setCurrentIndex(nextIndex);
          }, 700);
        }
      } else {
        const newWrongCount = wrongCount + 1;
        setWrongCount(newWrongCount);
        setFeedback(getQuizPageText('quizSupportiveRetry', courseLanguage));
        setCorrectAnswerLabel(result?.correctAnswer ?? null);
        setAnswerExplanation(result?.explanation ?? null);
        if (lessonId) {
          const user = session?.user as { id?: string; playerId?: string } | undefined;
          const playerId = user?.playerId || user?.id;
          const key = playerId 
            ? `quiz-passed-${playerId}-${courseId}-${lessonId}`
            : `quiz-passed-${courseId}-${lessonId}`;
          localStorage.removeItem(key);
        }
        // Only redirect when wrong count exceeds course limit (e.g. 3 wrong allowed → fail on 4th)
        const maxWrong = quizMaxWrongAllowed;
        if (typeof maxWrong === 'number' && newWrongCount > maxWrong) {
          setTimeout(() => {
            router.replace(`/${courseLanguage || locale}/courses/${courseId}/day/${dayNumber}?quizRetry=1`);
          }, 1200);
        } else {
          // Stay in quiz and go to next question
          const nextIndex = currentIndex + 1;
          if (nextIndex >= questions.length) {
            setTimeout(() => {
              router.replace(`/${courseLanguage || locale}/courses/${courseId}/day/${dayNumber}?quizRetry=1`);
            }, 1200);
          } else {
            setTimeout(() => {
              setFeedback(null);
              setAnswerExplanation(null);
              setCorrectAnswerLabel(null);
              setIsAnswerCorrect(null);
              setCurrentIndex(nextIndex);
            }, 1200);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(getQuizPageText('quizError', courseLanguage));
    } finally {
      setAnswering(false);
    }
  };

  if (loading) {
    return (
      <Box bg="ink.9" mih="100vh" py="xl" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Container size="sm">
          <Card padding="lg">
            <Stack gap="md">
              <Group gap="sm">
                <Loader size="sm" color="amanoba" />
                <Text fw={700}>{getQuizPageText('lessonQuiz', courseLanguage)}</Text>
              </Group>
              <Skeleton height={28} width="70%" />
              <Skeleton height={18} />
              <Skeleton height={44} />
              <Skeleton height={44} />
            </Stack>
          </Card>
        </Container>
      </Box>
    );
  }

  if (error || !currentQuestion) {
    if (accessIssue) {
      const lessonHref = `/${courseLanguage || locale}/courses/${courseId}/day/${dayNumber}`;
      const signInHref = `/auth/signin?callbackUrl=${encodeURIComponent(`/${courseLanguage || locale}/courses/${courseId}/day/${dayNumber}/quiz`)}`;

      return (
        <Box bg="ink.9" mih="100vh" py="xl" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
          <Container size="sm">
            <Card padding="lg">
              <CourseAccessRecoveryActions
                issue={accessIssue}
                courseId={courseId}
                courseLanguage={courseLanguage || locale}
                signInHref={signInHref}
                backHref={lessonHref}
                backLabel={getQuizPageText('backToLesson', courseLanguage)}
                onRetry={() => void loadLessonAndQuestions(courseId, dayNumber, courseLanguage || locale)}
              />
            </Card>
          </Container>
        </Box>
      );
    }

    let errorMessage = error || getQuizPageText('quizError', courseLanguage);
    if (error && (error.includes('Some questions not found') || error.includes('someQuestionsNotFound'))) {
      errorMessage = getQuizPageText('someQuestionsNotFound', courseLanguage);
    }

    const lessonHref = `/${courseLanguage || locale}/courses/${courseId}/day/${dayNumber}`;

    return (
      <Box bg="ink.9" mih="100vh" py="xl" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Container size="sm">
          <Card padding="lg">
            <Stack gap="md">
              <Alert
                color="red"
                variant="light"
                title={getQuizPageText('quizError', courseLanguage)}
                icon={<IconAlertTriangle size={18} />}
              >
                <Text>{errorMessage}</Text>
              </Alert>
              <Button
                component={LocaleLink}
                href={lessonHref}
                variant="outline"
                color="gray"
                leftSection={<IconArrowLeft size={16} />}
              >
                {getQuizPageText('backToLesson', courseLanguage)}
              </Button>
            </Stack>
          </Card>
        </Container>
      </Box>
    );
  }

  const progressText = getQuizPageText('questionProgress', courseLanguage, {
    current: currentIndex + 1,
    total: questions.length,
  });
  const progressValue = Math.min(100, ((currentIndex + 1) / Math.max(questions.length, 1)) * 100);
  const feedbackColor = isAnswerCorrect === true ? 'green' : isAnswerCorrect === false ? 'red' : 'amanoba';
  const FeedbackIcon = isAnswerCorrect === false ? IconX : IconCheck;

  return (
    <Box bg="ink.9" mih="100vh" dir={courseLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Paper component="header" bg="ink.8" radius={0} withBorder>
        <Container size="md" py={{ base: 'md', sm: 'lg' }}>
          <Group justify="space-between" align="center" gap="md">
            <Group gap="md" wrap="nowrap" miw={0}>
              <Logo size="sm" showText={false} linkTo={session?.user ? "/dashboard" : "/"} />
              <Button
                component={LocaleLink}
              href={`/${courseLanguage}/courses/${courseId}/day/${dayNumber}`}
                variant="subtle"
                color="gray"
                leftSection={<IconArrowLeft size={18} />}
            >
              {getQuizPageText('backToLesson', courseLanguage)}
              </Button>
            </Group>
            <Stack gap={4} align="flex-end" miw={140}>
              <Text c="white" size="sm" fw={700} lineClamp={1}>
                {getQuizPageText('lessonQuiz', courseLanguage)}
              </Text>
              <Text c="gray.3" size="xs" lineClamp={1}>
                {lessonTitle || getQuizPageText('quiz', courseLanguage)}
              </Text>
            </Stack>
          </Group>
        </Container>
      </Paper>

      <Container component="main" size="md" py={{ base: 'lg', sm: 'xl' }}>
        <Card padding="xl" radius="md" withBorder>
          <Stack gap="xl">
            <Stack gap="xs">
              <Group justify="space-between" align="flex-start" gap="md">
                <Title order={1} size="h2">
              {getQuizPageText('question', courseLanguage)} {currentIndex + 1}
                </Title>
                <Text fw={700} c="dimmed" size="sm">{progressText}</Text>
              </Group>
              <Progress value={progressValue} color="amanoba" radius="xl" />
            </Stack>

            <Text size="xl" fw={600} lh={1.5}>{currentQuestion.question}</Text>

            <Stack gap="sm">
            {currentQuestion.options.map((option: string, idx: number) => (
                <Button
                key={idx}
                disabled={answering}
                onClick={() => handleAnswer(option, idx)}
                  variant="default"
                  color="gray"
                  justify="flex-start"
                  fullWidth
                  mih={56}
                  styles={{
                    label: {
                      whiteSpace: 'normal',
                      textAlign: courseLanguage === 'ar' ? 'right' : 'left',
                      width: '100%',
                      lineHeight: 1.45,
                    },
                  }}
              >
                {option}
                </Button>
            ))}
            </Stack>

          {feedback && (
              <Alert
                color={feedbackColor}
                icon={
                  <ThemeIcon color={feedbackColor} variant="light" radius="xl" size="sm">
                    {isAnswerCorrect === true ? <IconCircleCheck size={16} /> : <FeedbackIcon size={16} />}
                  </ThemeIcon>
                }
                radius="md"
              >
                <Stack gap="sm">
                  <Text fw={700}>{feedback}</Text>
              {(correctAnswerLabel || answerExplanation) && isAnswerCorrect === false ? (
                    <>
                      <Divider />
                  {correctAnswerLabel ? (
                        <Text size="sm">
                          <Text span fw={700}>{getQuizPageText('correctAnswerLabel', courseLanguage)}:</Text>{' '}
                          {correctAnswerLabel}
                        </Text>
                  ) : null}
                  {answerExplanation ? (
                        <Text size="sm">
                          <Text span fw={700}>{getQuizPageText('explanationLabel', courseLanguage)}:</Text>{' '}
                          {answerExplanation}
                        </Text>
                  ) : null}
                    </>
              ) : null}
                </Stack>
              </Alert>
          )}
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
