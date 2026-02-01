/**
 * Lesson Quiz Component
 * 
 * What: Quiz/survey component for lesson assessments
 * Why: Allows students to take quizzes at the end of lessons
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  difficulty: string;
  category: string;
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
}

interface LessonQuizProps {
  courseId: string;
  lessonId: string;
  quizConfig: {
    enabled: boolean;
    successThreshold: number;
    questionCount: number;
    poolSize: number;
    required: boolean;
  };
  onComplete: (result: QuizResult) => void;
}

export default function LessonQuiz({
  courseId,
  lessonId,
  quizConfig,
  onComplete,
}: LessonQuizProps) {
  const t = useTranslations('courses');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, { index: number; option: string }>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canRetake, setCanRetake] = useState(false);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch questions in lesson mode (no difficulty required)
      const response = await fetch(
        `/api/games/quizzz/questions?lessonId=${lessonId}&courseId=${courseId}&count=${quizConfig.questionCount}&t=${Date.now()}`,
        { cache: 'no-store' }
      );

      const data = await response.json();

      if (data.ok && data.data?.questions) {
        setQuestions(data.data.questions);
      } else {
        // Use localized message when no questions for this lesson (avoids "difficulty: undefined")
        setError(data.error?.code === 'NO_QUESTIONS' ? t('noQuizQuestions') : (data.error?.message || t('quizError')));
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      setError(t('quizError'));
    } finally {
      setLoading(false);
    }
  }, [courseId, lessonId, quizConfig.questionCount, t]);

  useEffect(() => {
    void fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswer = (questionId: string, optionIndex: number, optionValue: string) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionId]: { index: optionIndex, option: optionValue } });
  };

  const handleSubmit = async () => {
    if (submitted || questions.length === 0) return;

    try {
      // Submit answers to get results
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            selectedIndex: answer.index,
            selectedOption: answer.option,
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        const quizResult: QuizResult = {
          score: data.score,
          total: data.total,
          percentage: data.percentage,
          passed: data.passed,
        };
        setResult(quizResult);
        setSubmitted(true);
        
        if (!quizResult.passed) {
          setCanRetake(true);
        } else {
          onComplete(quizResult);
        }
      } else {
        alert(data.error || t('quizError'));
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      alert(t('quizError'));
    }
  };

  const handleRetake = () => {
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setCanRetake(false);
    setError(null);
    fetchQuestions();
  };

  if (loading) {
    return (
      <div className="bg-brand-white rounded-xl p-8 border-2 border-brand-accent">
        <div className="text-center">
          <div className="text-brand-darkGrey">{t('loadingQuiz')}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-brand-white rounded-xl p-8 border-2 border-brand-accent">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={fetchQuestions}
            className="px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-brand-white rounded-xl p-8 border-2 border-brand-accent">
        <div className="text-center">
          <div className="text-brand-darkGrey mb-4">{t('noQuizQuestions')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-white rounded-xl p-8 border-2 border-brand-accent">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-black mb-2">{t('lessonQuiz')}</h2>
        <p className="text-brand-darkGrey">
          {t('quizDescription', { count: quizConfig.questionCount })}
          {quizConfig.required && (
            <span className="font-bold text-brand-accent"> {t('quizRequired', { threshold: quizConfig.successThreshold })}</span>
          )}
        </p>
      </div>

      {!submitted ? (
        <>
          <div className="space-y-6 mb-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border-2 border-brand-darkGrey/20 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-4">
                  <span className="font-bold text-brand-accent text-lg">{index + 1}.</span>
                  <h3 className="text-lg font-bold text-brand-black flex-1">{question.question}</h3>
                </div>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                        answers[question.id]?.index === optionIndex
                          ? 'border-brand-accent bg-brand-accent/10'
                          : 'border-brand-darkGrey/20 hover:border-brand-accent/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={answers[question.id]?.index === optionIndex}
                        onChange={() => handleAnswer(question.id, optionIndex, option)}
                        className="w-5 h-5 text-brand-accent"
                      />
                      <span className="text-brand-black flex-1">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-brand-darkGrey/20">
            <div className="text-sm text-brand-darkGrey">
              {t('answeredCount', { answered: Object.keys(answers).length, total: questions.length })}
            </div>
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              className="min-h-[44px] px-6 py-3 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {t('submitQuiz')}
            </button>
          </div>
        </>
      ) : result ? (
        <div className="text-center">
          <div
            className={`rounded-xl border-2 p-6 mb-4 text-left ${
              result.passed
                ? 'bg-green-50 dark:bg-green-950/30 border-green-500 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-950/30 border-red-500 text-red-800 dark:text-red-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
              {result.passed ? (
                <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 mx-auto sm:mx-0" aria-hidden />
              ) : (
                <XCircle className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 mx-auto sm:mx-0" aria-hidden />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold mb-1">
                  {result.passed ? t('quizPassed') : t('quizFailed')}
                </h3>
                <p className="text-lg sm:text-xl font-bold opacity-90">
                  {t('quizScore', { score: result.score, total: result.total, percentage: result.percentage })}
                </p>
                <p className="text-sm mt-1 opacity-80">
                  {t('quizRequiredScore', { threshold: quizConfig.successThreshold })}
                </p>
              </div>
            </div>
          </div>

          {result.passed ? (
            <div className="bg-green-50 dark:bg-green-950/30 border-2 border-green-500 rounded-xl p-5 mb-4 text-left">
              <p className="text-green-800 dark:text-green-200 font-bold">
                {t('quizPassedMessage')}
              </p>
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-500 rounded-xl p-5 mb-4 text-left">
              <p className="text-red-800 dark:text-red-200 font-bold mb-2">
                {t('quizFailedMessage', { threshold: quizConfig.successThreshold })}
              </p>
              {canRetake && (
                <button
                  onClick={handleRetake}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 mt-2 px-6 py-3 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 transition-colors touch-manipulation"
                >
                  <RotateCcw className="w-5 h-5" />
                  {t('retakeQuiz')}
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
