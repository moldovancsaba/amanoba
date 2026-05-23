/**
 * Lesson Quiz Component
 *
 * Quiz/survey component for lesson assessments.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Alert,
  Button,
  Card,
  Group,
  Radio,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck, IconCircleX, IconRefresh } from '@tabler/icons-react';
import { StateBlock } from '@/app/components/patterns/StateBlock';

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

      const response = await fetch(
        `/api/games/quizzz/questions?lessonId=${lessonId}&courseId=${courseId}&count=${quizConfig.questionCount}&t=${Date.now()}`,
        { cache: 'no-store' }
      );

      const data = await response.json();

      if (data.ok && data.data?.questions) {
        setQuestions(data.data.questions);
      } else {
        setError(
          data.error?.code === 'NO_QUESTIONS'
            ? t('noQuizQuestions')
            : data.error?.message || t('quizError')
        );
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
        notifications.show({
          color: 'red',
          title: t('quizError'),
          message: data.error || t('quizError'),
        });
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      notifications.show({
        color: 'red',
        title: t('quizError'),
        message: t('quizError'),
      });
    }
  };

  const handleRetake = () => {
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setCanRetake(false);
    setError(null);
    void fetchQuestions();
  };

  if (loading) {
    return (
      <Card withBorder p="xl">
        <StateBlock kind="loading" title={t('loadingQuiz')} compact />
      </Card>
    );
  }

  if (error) {
    return (
      <Card withBorder p="xl">
        <StateBlock
          kind="error"
          title={t('quizError')}
          description={error}
          action={
            <Button onClick={() => void fetchQuestions()} color="amanoba">
              {t('retry')}
            </Button>
          }
          compact
        />
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card withBorder p="xl">
        <StateBlock kind="empty" title={t('noQuizQuestions')} compact />
      </Card>
    );
  }

  return (
    <Card withBorder p="xl">
      <Stack gap="lg">
        <Stack gap={4}>
          <Title order={2}>{t('lessonQuiz')}</Title>
          <Text c="dimmed">
            {t('quizDescription', { count: quizConfig.questionCount })}
            {quizConfig.required ? (
              <Text span fw={700}>
                {' '}
                {t('quizRequired', { threshold: quizConfig.successThreshold })}
              </Text>
            ) : null}
          </Text>
        </Stack>

        {!submitted ? (
          <>
            <Stack gap="md">
              {questions.map((question, index) => (
                <Card key={question.id} withBorder p="md">
                  <Stack gap="sm">
                    <Group align="flex-start" wrap="nowrap" gap="xs">
                      <Text fw={700} size="lg">
                        {index + 1}.
                      </Text>
                      <Title order={4} style={{ flex: 1 }}>
                        {question.question}
                      </Title>
                    </Group>
                    <Radio.Group
                      value={
                        answers[question.id] !== undefined
                          ? String(answers[question.id].index)
                          : undefined
                      }
                      onChange={(value) => {
                        const optionIndex = Number(value);
                        const option = question.options[optionIndex];
                        if (option !== undefined) {
                          handleAnswer(question.id, optionIndex, option);
                        }
                      }}
                    >
                      <Stack gap="xs">
                        {question.options.map((option, optionIndex) => (
                          <Radio
                            key={optionIndex}
                            value={String(optionIndex)}
                            label={option}
                          />
                        ))}
                      </Stack>
                    </Radio.Group>
                  </Stack>
                </Card>
              ))}
            </Stack>

            <Group justify="space-between" pt="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
              <Text size="sm" c="dimmed">
                {t('answeredCount', {
                  answered: Object.keys(answers).length,
                  total: questions.length,
                })}
              </Text>
              <Button
                onClick={() => void handleSubmit()}
                disabled={Object.keys(answers).length < questions.length}
                color="amanoba"
              >
                {t('submitQuiz')}
              </Button>
            </Group>
          </>
        ) : result ? (
          <Stack gap="md" align="center">
            <Alert
              color={result.passed ? 'green' : 'red'}
              variant="light"
              icon={result.passed ? <IconCircleCheck size={20} /> : <IconCircleX size={20} />}
              w="100%"
            >
              <Stack gap={4}>
                <Text fw={700} size="lg">
                  {result.passed ? t('quizPassed') : t('quizFailed')}
                </Text>
                <Text fw={600}>
                  {t('quizScore', {
                    score: result.score,
                    total: result.total,
                    percentage: result.percentage,
                  })}
                </Text>
                <Text size="sm" c="dimmed">
                  {t('quizRequiredScore', { threshold: quizConfig.successThreshold })}
                </Text>
              </Stack>
            </Alert>

            {result.passed ? (
              <Alert color="green" variant="outline" w="100%">
                <Text fw={700}>{t('quizPassedMessage')}</Text>
              </Alert>
            ) : (
              <Alert color="red" variant="outline" w="100%">
                <Stack gap="sm">
                  <Text fw={700}>
                    {t('quizFailedMessage', { threshold: quizConfig.successThreshold })}
                  </Text>
                  {canRetake ? (
                    <Button
                      onClick={handleRetake}
                      color="amanoba"
                      leftSection={<IconRefresh size={18} />}
                    >
                      {t('retakeQuiz')}
                    </Button>
                  ) : null}
                </Stack>
              </Alert>
            )}
          </Stack>
        ) : null}
      </Stack>
    </Card>
  );
}
