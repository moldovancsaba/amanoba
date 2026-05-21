'use client';

/**
 * Quiz Manager Modal
 *
 * What: Create, edit, deactivate, and permanently delete quiz questions for a lesson.
 * Why: Shared by admin course page and editor lesson page; editors with course access
 *      can manage questions via /api/admin/courses/[courseId]/lessons/[lessonId]/quiz.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Group,
  LoadingOverlay,
  Modal,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck, IconEdit, IconEye, IconEyeCheck, IconPlus, IconTrash } from '@tabler/icons-react';

export type QuizQuestionItem = {
  _id: string;
  question: string;
  explanation?: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
  category: string;
  isActive: boolean;
};

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

const DEFAULT_FORM = {
  question: '',
  explanation: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  difficulty: 'MEDIUM' as Difficulty,
  category: 'General Knowledge',
  isActive: true,
};

export default function QuizManagerModal({
  courseId,
  lessonId,
  onClose,
  /** Optional: use dark editor-style panel (e.g. editor lesson page) */
  variant = 'light',
}: {
  courseId: string;
  lessonId: string;
  onClose: () => void;
  variant?: 'light' | 'dark';
}) {
  const [questions, setQuestions] = useState<QuizQuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestionItem | null>(null);
  const [questionForm, setQuestionForm] = useState(DEFAULT_FORM);

  const baseUrl = `/api/admin/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}`;

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/quiz`);
      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions || []);
      } else {
        notifications.show({ color: 'red', title: 'Could not load questions', message: data.error || 'Failed to load quiz questions' });
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      notifications.show({ color: 'red', title: 'Could not load questions', message: 'Failed to load quiz questions' });
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    void fetchQuestions();
  }, [fetchQuestions]);

  const handleSaveQuestion = async () => {
    try {
      const optionsToSend = questionForm.options.map((o) => o.trim()).filter(Boolean);
      if (optionsToSend.length < 4) {
        notifications.show({ color: 'red', title: 'Question needs more options', message: 'At least 4 options must be filled.' });
        return;
      }
      if (new Set(optionsToSend).size !== optionsToSend.length) {
        notifications.show({ color: 'red', title: 'Duplicate options', message: 'All options must be unique.' });
        return;
      }
      const correctValue = questionForm.options[questionForm.correctIndex]?.trim();
      if (!correctValue) {
        notifications.show({ color: 'red', title: 'Correct answer missing', message: 'Please select the correct answer from the filled options.' });
        return;
      }
      const correctIndexToSend = optionsToSend.indexOf(correctValue);
      if (correctIndexToSend === -1) {
        notifications.show({ color: 'red', title: 'Correct answer invalid', message: 'Correct answer must be one of the filled options.' });
        return;
      }
      const url = editingQuestion ? `${baseUrl}/quiz/${editingQuestion._id}` : `${baseUrl}/quiz`;
      const method = editingQuestion ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionForm.question.trim(),
          explanation: questionForm.explanation.trim() || undefined,
          options: optionsToSend,
          correctIndex: correctIndexToSend,
          difficulty: questionForm.difficulty,
          category: questionForm.category,
          isActive: questionForm.isActive,
        }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchQuestions();
        setShowQuestionForm(false);
        setEditingQuestion(null);
        setQuestionForm(DEFAULT_FORM);
        notifications.show({
          color: 'green',
          title: editingQuestion ? 'Question updated' : 'Question created',
          message: 'The lesson quiz questions are up to date.',
        });
      } else {
        notifications.show({ color: 'red', title: 'Could not save question', message: data.error || 'Failed to save question' });
      }
    } catch (error) {
      console.error('Failed to save question:', error);
      notifications.show({ color: 'red', title: 'Could not save question', message: 'Failed to save question' });
    }
  };

  const handleEdit = (question: QuizQuestionItem) => {
    setEditingQuestion(question);
    const opts = question.options || [];
    const options = opts.length >= 4 ? [...opts] : [...opts, ...Array(4 - opts.length).fill('')];
    setQuestionForm({
      question: question.question,
      explanation: question.explanation || '',
      options,
      correctIndex: Math.min(question.correctIndex ?? 0, Math.max(0, options.length - 1)),
      difficulty: question.difficulty as Difficulty,
      category: question.category,
      isActive: question.isActive,
    });
    setShowQuestionForm(true);
  };

  const handleDeactivate = async (questionId: string) => {
    modals.openConfirmModal({
      title: 'Deactivate question',
      children: <Text size="sm">This removes the question from the active learner quiz. It can be reactivated later.</Text>,
      labels: { confirm: 'Deactivate', cancel: 'Cancel' },
      confirmProps: { color: 'orange' },
      onConfirm: async () => {
        try {
          const response = await fetch(`${baseUrl}/quiz/${questionId}`, { method: 'DELETE' });
          const data = await response.json();
          if (data.success) {
            await fetchQuestions();
            notifications.show({ color: 'green', title: 'Question deactivated', message: 'The question is now inactive.' });
          } else {
            notifications.show({ color: 'red', title: 'Could not deactivate question', message: data.error || 'Failed to deactivate question' });
          }
        } catch (error) {
          console.error('Failed to deactivate question:', error);
          notifications.show({ color: 'red', title: 'Could not deactivate question', message: 'Failed to deactivate question' });
        }
      },
    });
  };

  const handlePermanentDelete = async (questionId: string) => {
    modals.openConfirmModal({
      title: 'Permanently delete question',
      children: <Text size="sm">This action cannot be undone. The question will be deleted from the lesson quiz.</Text>,
      labels: { confirm: 'Delete permanently', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const response = await fetch(`${baseUrl}/quiz/${questionId}/permanent`, { method: 'DELETE' });
          const data = await response.json();
          if (data.success) {
            await fetchQuestions();
            notifications.show({ color: 'green', title: 'Question deleted', message: 'The question was permanently deleted.' });
          } else {
            notifications.show({ color: 'red', title: 'Could not delete question', message: data.error || 'Failed to permanently delete question' });
          }
        } catch (error) {
          console.error('Failed to permanently delete question:', error);
          notifications.show({ color: 'red', title: 'Could not delete question', message: 'Failed to permanently delete question' });
        }
      },
    });
  };

  const handleToggleActive = async (question: QuizQuestionItem) => {
    try {
      const response = await fetch(`${baseUrl}/quiz/${question._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !question.isActive }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchQuestions();
        notifications.show({
          color: 'green',
          title: question.isActive ? 'Question deactivated' : 'Question reactivated',
          message: 'The question status was updated.',
        });
      } else {
        notifications.show({ color: 'red', title: 'Could not update question', message: data.error || 'Failed to update question' });
      }
    } catch (error) {
      console.error('Failed to toggle question:', error);
      notifications.show({ color: 'red', title: 'Could not update question', message: 'Failed to update question' });
    }
  };

  const isDark = variant === 'dark';
  const activeQuestions = questions.filter((q) => q.isActive);
  const inactiveQuestions = questions.filter((q) => !q.isActive);
  const surfaceBg = isDark ? 'dark.8' : 'white';
  const mutedColor = isDark ? 'gray.4' : 'dimmed';

  const questionCard = (question: QuizQuestionItem, active: boolean) => (
    <Card key={question._id} withBorder radius="md" bg={isDark ? (active ? 'dark.7' : 'dark.8') : undefined} opacity={active ? 1 : 0.76}>
      <Group align="flex-start" justify="space-between" wrap="nowrap">
        <Stack gap="xs" flex={1}>
          <Group gap="xs" align="center">
            <Title order={4} size="md" c={isDark ? 'white' : 'dark'}>
              {question.question}
            </Title>
            {!active ? <Badge color="gray">Inactive</Badge> : null}
          </Group>
          <Stack gap={4}>
            {question.options.map((option, index) => (
              <Group key={index} gap="xs" wrap="nowrap">
                {index === question.correctIndex ? <IconCircleCheck size={16} color="var(--mantine-color-green-6)" /> : <Box w={16} />}
                <Text size="sm" fw={index === question.correctIndex ? 700 : 400} c={index === question.correctIndex ? 'green' : mutedColor}>
                  {option}
                </Text>
              </Group>
            ))}
          </Stack>
          <Group gap="xs">
            <Badge variant="light">{question.difficulty}</Badge>
            <Badge variant="outline" color="gray">
              {question.category}
            </Badge>
          </Group>
          {question.explanation ? (
            <Text size="sm" c={mutedColor}>
              Explanation: {question.explanation}
            </Text>
          ) : null}
        </Stack>
        <Group gap="xs" wrap="nowrap">
          {active ? (
            <>
              <ActionIcon variant="filled" color="amanobaYellow" aria-label="Edit question" title="Edit question" onClick={() => handleEdit(question)}>
                <IconEdit size={16} />
              </ActionIcon>
              <ActionIcon variant="filled" color="orange" aria-label="Deactivate question" title="Deactivate question" onClick={() => handleDeactivate(question._id)}>
                <IconEye size={16} />
              </ActionIcon>
            </>
          ) : (
            <>
              <ActionIcon variant="filled" color="green" aria-label="Reactivate question" title="Reactivate question" onClick={() => handleToggleActive(question)}>
                <IconEyeCheck size={16} />
              </ActionIcon>
              <ActionIcon variant="filled" color="red" aria-label="Permanently delete question" title="Permanently delete question" onClick={() => handlePermanentDelete(question._id)}>
                <IconTrash size={16} />
              </ActionIcon>
            </>
          )}
        </Group>
      </Group>
    </Card>
  );

  return (
    <Modal
      opened
      onClose={onClose}
      title={
        <Stack gap={2}>
          <Title order={2} size="h3">
            Manage Quiz Questions
          </Title>
          <Text size="sm" c="dimmed">
            Lesson: {lessonId}
          </Text>
        </Stack>
      }
      size="xl"
      centered
      radius="md"
      overlayProps={{ backgroundOpacity: 0.7, blur: 2 }}
      styles={{ content: { background: `var(--mantine-color-${surfaceBg.replace('.', '-')})` } }}
    >
      <Box pos="relative">
        <LoadingOverlay visible={loading} overlayProps={{ radius: 'md', blur: 2 }} />
        {showQuestionForm ? (
          <Stack gap="md">
            <Title order={3} size="h4">
              {editingQuestion ? 'Edit' : 'Create'} Question
            </Title>
            <Textarea
              label="Question"
              required
              autosize
              minRows={3}
              value={questionForm.question}
              onChange={(event) => setQuestionForm({ ...questionForm, question: event.currentTarget.value })}
            />
            <Textarea
              label="Answer explanation"
              description="Shown to learners after an incorrect answer. Keep it short, specific, and tied to the lesson concept."
              autosize
              minRows={4}
              placeholder="Optional: explain why the correct answer is right or what concept the learner should review."
              value={questionForm.explanation}
              onChange={(event) => setQuestionForm({ ...questionForm, explanation: event.currentTarget.value })}
            />
            <Stack gap="xs">
              <Text fw={600} size="sm">
                Options * (minimum 4)
              </Text>
              {questionForm.options.map((option, index) => (
                <Group key={index} align="center" wrap="nowrap">
                  <Radio
                    name="correctIndex"
                    checked={questionForm.correctIndex === index}
                    onChange={() => setQuestionForm({ ...questionForm, correctIndex: index })}
                    aria-label={`Mark option ${index + 1} as correct`}
                  />
                  <TextInput
                    flex={1}
                    value={option}
                    onChange={(event) => {
                      const newOptions = [...questionForm.options];
                      newOptions[index] = event.currentTarget.value;
                      setQuestionForm({ ...questionForm, options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                  {questionForm.options.length > 4 ? (
                    <Button
                      type="button"
                      variant="subtle"
                      color="red"
                      onClick={() => {
                        const newOptions = questionForm.options.filter((_, optionIndex) => optionIndex !== index);
                        const newCorrect =
                          questionForm.correctIndex >= newOptions.length
                            ? newOptions.length - 1
                            : questionForm.correctIndex > index
                              ? questionForm.correctIndex - 1
                              : questionForm.correctIndex;
                        setQuestionForm({ ...questionForm, options: newOptions, correctIndex: newCorrect });
                      }}
                    >
                      Remove
                    </Button>
                  ) : null}
                </Group>
              ))}
              <Group justify="space-between">
                <Button
                  type="button"
                  variant="subtle"
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setQuestionForm({ ...questionForm, options: [...questionForm.options, ''] })}
                >
                  Add option
                </Button>
                <Text size="xs" c="dimmed">
                  Select the radio button next to the correct answer.
                </Text>
              </Group>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Select
                label="Difficulty"
                data={[
                  { value: 'EASY', label: 'Easy' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'HARD', label: 'Hard' },
                  { value: 'EXPERT', label: 'Expert' },
                ]}
                value={questionForm.difficulty}
                allowDeselect={false}
                onChange={(value) => setQuestionForm({ ...questionForm, difficulty: (value || 'MEDIUM') as Difficulty })}
              />
              <Select
                label="Category"
                data={['General Knowledge', 'Science', 'History', 'Geography', 'Math', 'Technology', 'Arts & Literature', 'Sports']}
                value={questionForm.category}
                allowDeselect={false}
                onChange={(value) => setQuestionForm({ ...questionForm, category: value || 'General Knowledge' })}
              />
            </SimpleGrid>
            <Checkbox
              label="Active"
              checked={questionForm.isActive}
              onChange={(event) => setQuestionForm({ ...questionForm, isActive: event.currentTarget.checked })}
            />
            <Divider />
            <Group justify="flex-end">
              <Button
                type="button"
                variant="default"
                onClick={() => {
                  setShowQuestionForm(false);
                  setEditingQuestion(null);
                  setQuestionForm(DEFAULT_FORM);
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveQuestion}>
                {editingQuestion ? 'Update' : 'Create'} Question
              </Button>
            </Group>
          </Stack>
        ) : (
          <Stack gap="md">
            <Group justify="space-between">
              <Text size="sm" c={mutedColor}>
                {questions.length} question{questions.length !== 1 ? 's' : ''} total
              </Text>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={() => {
                  setEditingQuestion(null);
                  setQuestionForm(DEFAULT_FORM);
                  setShowQuestionForm(true);
                }}
              >
                Add Question
              </Button>
            </Group>
            {questions.length === 0 ? (
              <Card withBorder radius="md" p="xl" bg={isDark ? 'dark.7' : undefined}>
                <Stack align="center" gap="md">
                  <Text c={mutedColor}>No questions yet</Text>
                  <Button leftSection={<IconPlus size={16} />} onClick={() => setShowQuestionForm(true)}>
                    Create First Question
                  </Button>
                </Stack>
              </Card>
            ) : (
              <Stack gap="xl">
                {activeQuestions.length > 0 ? (
                  <Stack gap="sm">
                    <Title order={3} size="h4">
                      Active Questions ({activeQuestions.length})
                    </Title>
                    {activeQuestions.map((question) => questionCard(question, true))}
                  </Stack>
                ) : null}
                {inactiveQuestions.length > 0 ? (
                  <Stack gap="sm">
                    <Title order={3} size="h4">
                      Inactive Questions ({inactiveQuestions.length})
                    </Title>
                    {inactiveQuestions.map((question) => questionCard(question, false))}
                  </Stack>
                ) : null}
              </Stack>
            )}
          </Stack>
        )}
      </Box>
    </Modal>
  );
}
