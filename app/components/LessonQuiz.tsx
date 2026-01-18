/**
 * Lesson Quiz Component
 * 
 * What: Quiz/survey component for lesson assessments
 * Why: Allows students to take quizzes at the end of lessons
 */

'use client';

import { useState, useEffect } from 'react';
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canRetake, setCanRetake] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [courseId, lessonId]);

  const fetchQuestions = async () => {
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
        setError(data.error?.message || 'Failed to load quiz questions');
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      setError('Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async () => {
    if (submitted || questions.length === 0) return;

    try {
      // Submit answers to get results
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, optionIndex]) => ({
            questionId,
            selectedIndex: optionIndex,
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
        alert(data.error || 'Failed to submit quiz');
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      alert('Failed to submit quiz');
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
          <div className="text-brand-darkGrey">Loading quiz questions...</div>
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
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-brand-white rounded-xl p-8 border-2 border-brand-accent">
        <div className="text-center">
          <div className="text-brand-darkGrey mb-4">No quiz questions available for this lesson.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-white rounded-xl p-8 border-2 border-brand-accent">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-brand-black mb-2">Lesson Quiz</h2>
        <p className="text-brand-darkGrey">
          Answer {quizConfig.questionCount} questions to test your understanding.
          {quizConfig.required && (
            <span className="font-bold text-brand-accent"> You need {quizConfig.successThreshold}% to pass.</span>
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
                        answers[question.id] === optionIndex
                          ? 'border-brand-accent bg-brand-accent/10'
                          : 'border-brand-darkGrey/20 hover:border-brand-accent/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={answers[question.id] === optionIndex}
                        onChange={() => handleAnswer(question.id, optionIndex)}
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
              {Object.keys(answers).length} of {questions.length} answered
            </div>
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              className="px-6 py-3 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          </div>
        </>
      ) : result ? (
        <div className="text-center">
          <div className={`mb-6 ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
            {result.passed ? (
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 mx-auto mb-4" />
            )}
            <h3 className="text-3xl font-bold mb-2">
              {result.passed ? 'Quiz Passed!' : 'Quiz Failed'}
            </h3>
            <p className="text-2xl font-bold">
              {result.score} / {result.total} ({result.percentage}%)
            </p>
            <p className="text-sm mt-2 text-brand-darkGrey">
              Required: {quizConfig.successThreshold}%
            </p>
          </div>

          {result.passed ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-bold">
                Congratulations! You passed the quiz. You can now complete the lesson.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-bold mb-2">
                You didn't pass the quiz. You need {quizConfig.successThreshold}% to pass.
              </p>
              {canRetake && (
                <button
                  onClick={handleRetake}
                  className="mt-4 px-6 py-3 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 transition-colors flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retake Quiz
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
