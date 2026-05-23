'use client';

/**
 * Onboarding Survey Page — Mantine form shell with governed layout.
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Group,
  Loader,
  Paper,
  Progress,
  Radio,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconHelp,
} from '@tabler/icons-react';
import { AuthShell } from '@/app/components/patterns/AuthShell';
import { StateBlock } from '@/app/components/patterns/StateBlock';
import { LocaleLink } from '@/components/LocaleLink';
import Logo from '@/components/Logo';
import { trackGAEvent } from '@/app/lib/analytics/ga-events';

interface SurveyQuestion {
  questionId: string;
  type: string;
  question: string;
  description?: string;
  options?: Array<{
    value: string;
    label: string;
    metadata?: Record<string, unknown>;
  }>;
  required: boolean;
  order: number;
  metadata?: {
    category?: string;
    min?: number;
    max?: number;
  };
}

interface Survey {
  surveyId: string;
  name: string;
  description?: string;
  questions: SurveyQuestion[];
  metadata?: {
    completionMessage?: string;
    redirectUrl?: string;
  };
  alreadyCompleted: boolean;
}

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('common');
  const tOnboarding = useTranslations('onboarding');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/auth/signin?callbackUrl=/${locale}/onboarding`);
      return;
    }
    void fetchSurvey();
  }, [session, status, router, locale]);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/surveys/onboarding');
      const data = await response.json();
      if (data.success) {
        setSurvey(data.survey);
      }
    } catch (err) {
      console.error('Failed to fetch survey:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    if (!survey) return false;
    const currentQuestion = survey.questions[currentStep];
    if (!currentQuestion?.required) return true;
    const answer = answers[currentQuestion.questionId];
    if (
      answer === undefined ||
      answer === null ||
      answer === '' ||
      (Array.isArray(answer) && answer.length === 0)
    ) {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.questionId]: 'This question is required',
      }));
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!survey || !validateCurrentStep()) return;
    if (currentStep < survey.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      void handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!survey) return;

    const missingQuestion = survey.questions.find((q) => {
      if (!q.required) return false;
      const answer = answers[q.questionId];
      return (
        answer === undefined ||
        answer === null ||
        answer === '' ||
        (Array.isArray(answer) && answer.length === 0)
      );
    });

    if (missingQuestion) {
      const missingIndex = survey.questions.findIndex(
        (q) => q.questionId === missingQuestion.questionId
      );
      setCurrentStep(missingIndex);
      setErrors((prev) => ({
        ...prev,
        [missingQuestion.questionId]: 'This question is required',
      }));
      return;
    }

    setSubmitting(true);

    try {
      const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
      const response = await fetch('/api/surveys/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: survey.questions.map((q) => ({
            questionId: q.questionId,
            value: answers[q.questionId],
          })),
          metadata: {
            timeSpentSeconds,
            deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        trackGAEvent('survey_complete', {
          survey_id: 'onboarding',
          time_spent_seconds: timeSpentSeconds,
        });
        notifications.show({
          color: 'green',
          title: tOnboarding('submitSuccess') || 'Survey submitted',
          message: tOnboarding('submitSuccess') || 'Thank you for completing onboarding.',
        });
      } else {
        notifications.show({
          color: 'red',
          title: tOnboarding('submitError') || 'Submission failed',
          message: data.error || tOnboarding('submitError') || 'Please try again.',
        });
      }
    } catch (err) {
      console.error('Failed to submit survey:', err);
      notifications.show({
        color: 'red',
        title: tOnboarding('submitError') || 'Submission failed',
        message: 'Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Box bg="ink.9" mih="100vh">
        <Center mih="100vh">
          <Loader color="amanoba" />
        </Center>
      </Box>
    );
  }

  if (!survey) {
    return (
      <AuthShell>
        <StateBlock
          kind="empty"
          title={tOnboarding('notAvailable') || 'Survey not available'}
          action={(
            <Button component={LocaleLink} href={`/${locale}/dashboard`} color="amanoba">
              {tOnboarding('goToDashboard') || t('dashboard')}
            </Button>
          )}
        />
      </AuthShell>
    );
  }

  const currentQuestion = survey.questions[currentStep];
  const progress = ((currentStep + 1) / survey.questions.length) * 100;
  const isLastStep = currentStep === survey.questions.length - 1;
  const minRating = currentQuestion.metadata?.min || 1;
  const maxRating = currentQuestion.metadata?.max || 5;

  return (
    <Box bg="ink.9" mih="100vh">
      <Paper component="header" bg="ink.8" radius={0} withBorder pos="sticky" top={0} style={{ zIndex: 40 }}>
        <Box maw={900} mx="auto" px="md" py="md">
          <Group align="flex-start" gap="md" mb="md">
            <Logo size="sm" showText={false} linkTo={`/${locale}/dashboard`} preventShrink />
            <Stack gap={4} style={{ flex: 1 }}>
              <Title order={1} size="h3">
                {survey.name}
              </Title>
              {survey.description ? (
                <Text size="sm" c="dimmed">
                  {survey.description}
                </Text>
              ) : null}
            </Stack>
          </Group>
          <Progress value={progress} color="amanoba" />
          <Text size="sm" c="dimmed" ta="center" mt="xs">
            {tOnboarding('questionProgress', {
              current: currentStep + 1,
              total: survey.questions.length,
            }) || `Question ${currentStep + 1} of ${survey.questions.length}`}
          </Text>
        </Box>
      </Paper>

      <Box maw={900} mx="auto" px="md" py="xl">
        <Card padding="xl" withBorder>
          <Stack gap="lg">
            <Stack gap="xs">
              <Group align="flex-start" gap="xs" wrap="nowrap">
                <Title order={2} size="h3" style={{ flex: 1 }}>
                  {currentQuestion.question}
                </Title>
                {currentQuestion.required ? (
                  <Text c="red" fw={600}>
                    *
                  </Text>
                ) : null}
              </Group>
              {currentQuestion.description ? (
                <Group gap="xs" align="flex-start">
                  <IconHelp size={16} style={{ marginTop: 2 }} />
                  <Text size="sm" c="dimmed">
                    {currentQuestion.description}
                  </Text>
                </Group>
              ) : null}
            </Stack>

            {errors[currentQuestion.questionId] ? (
              <Alert color="red" variant="light">
                {errors[currentQuestion.questionId]}
              </Alert>
            ) : null}

            {currentQuestion.type === 'single_choice' && currentQuestion.options ? (
              <Radio.Group
                value={String(answers[currentQuestion.questionId] ?? '')}
                onChange={(value) => handleAnswerChange(currentQuestion.questionId, value)}
              >
                <Stack gap="sm">
                  {currentQuestion.options.map((option) => (
                    <Radio
                      key={option.value}
                      value={option.value}
                      label={option.label}
                      styles={{ label: { fontWeight: 500 } }}
                    />
                  ))}
                </Stack>
              </Radio.Group>
            ) : null}

            {currentQuestion.type === 'multiple_choice' && currentQuestion.options ? (
              <Stack gap="sm">
                {currentQuestion.options.map((option) => {
                  const selectedValues = answers[currentQuestion.questionId];
                  const values = Array.isArray(selectedValues) ? selectedValues : [];
                  const checked = values.includes(option.value);
                  return (
                    <Checkbox
                      key={option.value}
                      label={option.label}
                      checked={checked}
                      onChange={(event) => {
                        const next = event.currentTarget.checked
                          ? [...values, option.value]
                          : values.filter((v) => v !== option.value);
                        handleAnswerChange(currentQuestion.questionId, next);
                      }}
                    />
                  );
                })}
              </Stack>
            ) : null}

            {currentQuestion.type === 'rating' ? (
              <Group justify="center" gap="sm" wrap="wrap">
                {Array.from({ length: maxRating - minRating + 1 }, (_, i) => {
                  const value = minRating + i;
                  const selected = answers[currentQuestion.questionId] === value;
                  return (
                    <Button
                      key={value}
                      variant={selected ? 'filled' : 'light'}
                      color={selected ? 'amanoba' : 'gray'}
                      onClick={() => handleAnswerChange(currentQuestion.questionId, value)}
                      w={48}
                      h={48}
                      p={0}
                    >
                      {value}
                    </Button>
                  );
                })}
              </Group>
            ) : null}

            <Group justify="space-between" mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
              <Button
                variant="default"
                color="gray"
                leftSection={<IconArrowLeft size={18} />}
                onClick={handlePrevious}
                disabled={currentStep === 0 || submitting}
              >
                {t('previous')}
              </Button>
              <Button
                color="amanoba"
                rightSection={
                  submitting ? (
                    <Loader size={18} color="dark" />
                  ) : isLastStep ? (
                    <IconCheck size={18} />
                  ) : (
                    <IconArrowRight size={18} />
                  )
                }
                onClick={handleNext}
                loading={submitting}
              >
                {isLastStep ? t('submit') : t('next')}
              </Button>
            </Group>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
