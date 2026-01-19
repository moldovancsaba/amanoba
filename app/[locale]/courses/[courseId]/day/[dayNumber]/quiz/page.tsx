/**
 * Lesson Quiz Page (one question at a time, supportive flow)
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { LocaleLink } from '@/components/LocaleLink';

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
  error?: string;
}

interface Question {
  id: string;
  question: string;
  options: string[];
}

export default function LessonQuizPage({
  params,
}: {
  params: Promise<{ courseId: string; dayNumber: string }>;
}) {
  const t = useTranslations('courses');
  const router = useRouter();
  const [courseId, setCourseId] = useState<string>('');
  const [dayNumber, setDayNumber] = useState<number>(0);
  const [lessonId, setLessonId] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const resolved = await params;
      const cid = resolved.courseId;
      const day = parseInt(resolved.dayNumber);
      setCourseId(cid);
      setDayNumber(day);
      await loadLessonAndQuestions(cid, day);
    };
    init();
  }, [params]);

  const loadLessonAndQuestions = async (cid: string, day: number) => {
    try {
      setLoading(true);
      setError(null);
      const lessonRes = await fetch(`/api/courses/${cid}/day/${day}`, { cache: 'no-store' });
      const lessonData: LessonResponse = await lessonRes.json();
      if (!lessonData.success || !lessonData.lesson) {
        setError(lessonData.error || t('failedToLoadLesson'));
        return;
      }
      setLessonId(lessonData.lesson.lessonId);
      setLessonTitle(lessonData.lesson.title);

      const count = lessonData.lesson.quizConfig?.questionCount || 5;
      const qRes = await fetch(
        `/api/games/quizzz/questions?lessonId=${lessonData.lesson.lessonId}&courseId=${cid}&count=${count}&t=${Date.now()}`,
        { cache: 'no-store' }
      );
      const qData = await qRes.json();
      if (qData.ok && qData.data?.questions?.length) {
        setQuestions(qData.data.questions);
        setCurrentIndex(0);
      } else {
        setError(qData.error?.message || t('quizError'));
      }
    } catch (err) {
      console.error(err);
      setError(t('quizError'));
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = async (option: string, optionIndex: number) => {
    if (!currentQuestion || answering) return;
    setAnswering(true);
    setFeedback(null);
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
        setError(data.error || t('quizError'));
        setAnswering(false);
        return;
      }

      const result = data.results?.[0];
      const isCorrect = result?.isCorrect;
      if (isCorrect) {
        setFeedback(t('quizCorrect', { defaultValue: 'Helyes válasz, szép munka! 🚀' }));
        const nextIndex = currentIndex + 1;
        if (nextIndex >= questions.length) {
          // Quiz finished; mark passed locally
          if (lessonId) {
            localStorage.setItem(`quiz-passed-${courseId}-${lessonId}`, 'true');
          }
          setTimeout(() => {
            router.replace(`/courses/${courseId}/day/${dayNumber}?quiz=passed`);
          }, 900);
        } else {
          setTimeout(() => {
            setFeedback(null);
            setCurrentIndex(nextIndex);
          }, 700);
        }
      } else {
        setFeedback(
          t('quizSupportiveRetry', {
            defaultValue: 'Most nem talált. Nézzük át újra a leckét, utána próbáld meg ismét.',
          })
        );
        if (lessonId) {
          localStorage.removeItem(`quiz-passed-${courseId}-${lessonId}`);
        }
        setTimeout(() => {
          router.replace(`/courses/${courseId}/day/${dayNumber}?quizRetry=1`);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setError(t('quizError'));
    } finally {
      setAnswering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-white animate-spin" />
      </div>
    );
  }

  if (error || !currentQuestion) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
        <div className="bg-brand-white rounded-xl p-8 border-2 border-brand-accent max-w-lg w-full text-center">
          <p className="text-brand-black mb-6">{error || t('quizError')}</p>
          <LocaleLink
            href={`/courses/${courseId}/day/${dayNumber}`}
            className="inline-flex items-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('backToLesson', { defaultValue: 'Vissza a leckéhez' })}
          </LocaleLink>
        </div>
      </div>
    );
  }

  const progressText = t('questionProgress', {
    current: currentIndex + 1,
    total: questions.length,
    defaultValue: `${currentIndex + 1}/${questions.length}`,
  });

  return (
    <div className="min-h-screen bg-brand-black">
      <header className="bg-brand-darkGrey border-b-2 border-brand-accent">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-6 flex items-center justify-between">
          <LocaleLink
            href={`/courses/${courseId}/day/${dayNumber}`}
            className="inline-flex items-center gap-2 text-brand-white hover:text-brand-accent"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('backToLesson', { defaultValue: 'Vissza a leckéhez' })}
          </LocaleLink>
          <div className="text-brand-white text-sm">
            {t('lessonQuiz', { defaultValue: 'Kvíz' })}: {lessonTitle || t('quiz')}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        <div className="bg-brand-white rounded-2xl p-8 border-2 border-brand-accent shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-brand-black leading-tight">
              {t('question', { defaultValue: 'Kérdés' })} {currentIndex + 1}
            </h1>
            <span className="text-base font-semibold text-brand-darkGrey">{progressText}</span>
          </div>
          <p className="text-xl text-brand-black mb-8 leading-relaxed">{currentQuestion.question}</p>

          <div className="space-y-4">
            {currentQuestion.options.map((option: string, idx: number) => (
              <button
                key={idx}
                disabled={answering}
                onClick={() => handleAnswer(option, idx)}
                className="w-full text-left border-2 border-brand-darkGrey/15 hover:border-brand-accent transition-colors rounded-xl px-5 py-4 font-semibold text-brand-black text-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {option}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="mt-8 flex items-center gap-3 text-brand-black font-semibold bg-brand-accent/15 border border-brand-accent rounded-lg px-5 py-4">
              <CheckCircle className="w-6 h-6 text-brand-accent" />
              <span>{feedback}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
