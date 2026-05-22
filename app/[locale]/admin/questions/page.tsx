/**
 * Admin Quiz Questions Management Page
 * 
 * What: Central admin interface for managing quiz questions
 * Why: Enables filtering, searching, creating, editing, and managing quiz questions
 * 
 * Features:
 * - Advanced filtering (language, course, lesson, hashtag, type, difficulty, category)
 * - Question list with pagination
 * - Create/Edit question modal
 * - Bulk operations (activate/deactivate, delete)
 * - Search functionality
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Checkbox,
  Grid,
  Group,
  Loader,
  Modal,
  Radio,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { IconCopy, IconEdit, IconFilter, IconHelpCircle, IconPlus, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
import { QuestionDifficulty, QuestionType, Question } from '@/types/quiz-question';

interface Course {
  _id: string;
  courseId: string;
  name: string;
  language: string;
}

export default function AdminQuestionsPage() {
  // State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    language: '',
    courseId: '',
    lessonId: '',
    hashtag: '',
    questionType: '',
    difficulty: '',
    category: '',
    isActive: '',
    isCourseSpecific: '',
    search: '',
  });
  
  // Pagination
  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);
  
  // UI State
  const [showFilters, setShowFilters] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  
  // Form State
  const [questionForm, setQuestionForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    difficulty: QuestionDifficulty.MEDIUM,
    category: 'Course Specific',
    questionType: QuestionType.APPLICATION,
    hashtags: [] as string[],
    isCourseSpecific: false,
    courseId: '',
    relatedCourseIds: [] as string[],
    lessonId: '',
    isActive: true,
  });
  
  const [hashtagInput, setHashtagInput] = useState('');
  const [courseSelectInput, setCourseSelectInput] = useState('');

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/courses');
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  }, []);

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add filters
      if (filters.language) params.append('language', filters.language);
      if (filters.courseId) params.append('courseId', filters.courseId);
      if (filters.lessonId) params.append('lessonId', filters.lessonId);
      if (filters.hashtag) params.append('hashtag', filters.hashtag);
      if (filters.questionType) params.append('questionType', filters.questionType);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.category) params.append('category', filters.category);
      if (filters.isActive !== '') params.append('isActive', filters.isActive);
      if (filters.isCourseSpecific !== '') params.append('isCourseSpecific', filters.isCourseSpecific);
      if (filters.search) params.append('search', filters.search);
      
      // Pagination
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());

      const response = await fetch(`/api/admin/questions?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setQuestions(data.questions || []);
        setTotal(data.total || 0);
        setHasMore(data.hasMore || false);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      alert('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [filters, limit, offset]);

  // Fetch questions when filters or pagination change
  useEffect(() => {
    void fetchQuestions();
  }, [fetchQuestions]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setOffset(0); // Reset pagination when filters change
  };

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      difficulty: QuestionDifficulty.MEDIUM,
      category: 'Course Specific',
      questionType: QuestionType.APPLICATION,
      hashtags: [],
      isCourseSpecific: false,
      courseId: '',
      relatedCourseIds: [],
      lessonId: '',
      isActive: true,
    });
    setShowQuestionForm(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    // Convert relatedCourseIds to string array (API may return ObjectIds)
    const raw = question.relatedCourseIds as (string | { toString(): string })[] | undefined;
    const relatedIds = raw ? raw.map(id => typeof id === 'string' ? id : id.toString()) : [];
    
    setQuestionForm({
      question: question.question,
      options: [...question.options],
      correctIndex: question.correctIndex,
      difficulty: question.difficulty,
      category: question.category,
      questionType: question.questionType || QuestionType.APPLICATION,
      hashtags: question.hashtags || [],
      isCourseSpecific: question.isCourseSpecific,
      courseId: question.courseId?.toString() || '',
      relatedCourseIds: relatedIds,
      lessonId: question.lessonId || '',
      isActive: question.isActive,
    });
    setShowQuestionForm(true);
  };

  const handleSaveQuestion = async () => {
    try {
      // Validation
      if (!questionForm.question.trim()) {
        alert('Question text is required');
        return;
      }
      const optionsToSend = questionForm.options.map(opt => opt.trim()).filter(Boolean);
      if (optionsToSend.length < 4) {
        alert('At least 4 options must be filled');
        return;
      }
      if (new Set(optionsToSend).size !== optionsToSend.length) {
        alert('All options must be unique');
        return;
      }
      const correctValue = questionForm.options[questionForm.correctIndex]?.trim();
      if (!correctValue) {
        alert('Please select the correct answer (one of the filled options)');
        return;
      }
      const correctIndexToSend = optionsToSend.indexOf(correctValue);
      if (correctIndexToSend === -1) {
        alert('Correct answer must be one of the filled options');
        return;
      }

      const url = editingQuestion
        ? `/api/admin/questions/${editingQuestion._id}`
        : '/api/admin/questions';

      const method = editingQuestion ? 'PATCH' : 'POST';

      const body: Record<string, unknown> = {
        question: questionForm.question.trim(),
        options: optionsToSend,
        correctIndex: correctIndexToSend,
        difficulty: questionForm.difficulty,
        category: questionForm.category,
        questionType: questionForm.questionType,
        hashtags: questionForm.hashtags,
        isCourseSpecific: questionForm.isCourseSpecific,
        isActive: questionForm.isActive,
      };

      if (questionForm.courseId) {
        body.courseId = questionForm.courseId;
      }
      if (questionForm.relatedCourseIds && questionForm.relatedCourseIds.length > 0) {
        body.relatedCourseIds = questionForm.relatedCourseIds;
      }
      if (questionForm.lessonId) {
        body.lessonId = questionForm.lessonId;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        await fetchQuestions();
        setShowQuestionForm(false);
        setEditingQuestion(null);
      } else {
        alert(data.error || 'Failed to save question');
      }
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('Failed to save question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchQuestions();
      } else {
        alert(data.error || 'Failed to delete question');
      }
    } catch (error) {
      console.error('Failed to delete question:', error);
      alert('Failed to delete question');
    }
  };

  const handleToggleActive = async (question: Question) => {
    try {
      const response = await fetch(`/api/admin/questions/${question._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !question.isActive }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchQuestions();
      } else {
        alert(data.error || 'Failed to update question');
      }
    } catch (error) {
      console.error('Failed to toggle question:', error);
      alert('Failed to update question');
    }
  };

  const addHashtag = () => {
    const tag = hashtagInput.trim();
    if (tag && !tag.startsWith('#')) {
      setHashtagInput('#' + tag);
      return;
    }
    if (tag && !questionForm.hashtags.includes(tag)) {
      setQuestionForm(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, tag],
      }));
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setQuestionForm(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(t => t !== tag),
    }));
  };

  const addRelatedCourse = (courseId: string) => {
    if (courseId && !questionForm.relatedCourseIds.includes(courseId)) {
      setQuestionForm(prev => ({
        ...prev,
        relatedCourseIds: [...prev.relatedCourseIds, courseId],
      }));
      setCourseSelectInput('');
    }
  };

  const removeRelatedCourse = (courseId: string) => {
    setQuestionForm(prev => ({
      ...prev,
      relatedCourseIds: prev.relatedCourseIds.filter(id => id !== courseId),
    }));
  };

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const toggleAllSelection = () => {
    if (selectedQuestions.size === questions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(questions.map(q => q._id)));
    }
  };

  const languageOptions = [
    { value: '', label: 'All Languages' },
    { value: 'hu', label: 'Hungarian' },
    { value: 'en', label: 'English' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'it', label: 'Italian' },
    { value: 'bn', label: 'Bengali' },
    { value: 'ur', label: 'Urdu' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'pl', label: 'Polish' },
    { value: 'tr', label: 'Turkish' },
    { value: 'vi', label: 'Vietnamese' },
    { value: 'id', label: 'Indonesian' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ar', label: 'Arabic' },
    { value: 'bg', label: 'Bulgarian' },
    { value: 'ru', label: 'Russian' },
    { value: 'sw', label: 'Swahili' },
  ];

  const courseOptions = [
    { value: '', label: 'All Courses' },
    ...courses.map((course) => ({
      value: course.courseId,
      label: `${course.name} (${course.language.toUpperCase()})`,
    })),
  ];

  const difficultyBadgeColor = (difficulty: QuestionDifficulty) => {
    if (difficulty === QuestionDifficulty.EASY) return 'green';
    if (difficulty === QuestionDifficulty.MEDIUM) return 'yellow';
    if (difficulty === QuestionDifficulty.HARD) return 'orange';
    return 'red';
  };

  return (
    <Stack gap="xl">
      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={1}>Quiz Questions</Title>
          <Text c="dimmed">
            Manage and organize quiz questions across all courses
          </Text>
        </div>
        <Button
          onClick={handleCreateQuestion}
          leftSection={<IconPlus size={18} />}
        >
          Create Question
        </Button>
      </Group>

      {/* Filters Panel */}
      {showFilters && (
        <Card withBorder>
          <Stack gap="md">
          <Group justify="space-between">
            <Group>
              <IconFilter size={20} />
              <Title order={2}>
              Filters
              </Title>
            </Group>
            <ActionIcon
              onClick={() => setShowFilters(false)}
              variant="default"
              aria-label="Hide filters"
            >
              <IconX size={18} />
            </ActionIcon>
          </Group>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Select label="Language" value={filters.language} onChange={(value) => handleFilterChange('language', value || '')} data={languageOptions} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Select label="Course" value={filters.courseId} onChange={(value) => handleFilterChange('courseId', value || '')} data={courseOptions} searchable />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Select
                label="Question Type"
                value={filters.questionType}
                onChange={(value) => handleFilterChange('questionType', value || '')}
                data={[
                  { value: '', label: 'All Types' },
                  { value: 'recall', label: 'Recall' },
                  { value: 'application', label: 'Application' },
                  { value: 'critical-thinking', label: 'Critical Thinking' },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Select
                label="Difficulty"
                value={filters.difficulty}
                onChange={(value) => handleFilterChange('difficulty', value || '')}
                data={[
                  { value: '', label: 'All Difficulties' },
                  { value: 'EASY', label: 'Easy' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'HARD', label: 'Hard' },
                  { value: 'EXPERT', label: 'Expert' },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Select
                label="Category"
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value || '')}
                data={[
                  { value: '', label: 'All Categories' },
                  { value: 'Course Specific', label: 'Course Specific' },
                  { value: 'General Knowledge', label: 'General Knowledge' },
                  { value: 'Science', label: 'Science' },
                  { value: 'Technology', label: 'Technology' },
                  { value: 'History', label: 'History' },
                  { value: 'Geography', label: 'Geography' },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Select
                label="Status"
                value={filters.isActive}
                onChange={(value) => handleFilterChange('isActive', value || '')}
                data={[
                  { value: '', label: 'All' },
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Select
                label="Type"
                value={filters.isCourseSpecific}
                onChange={(value) => handleFilterChange('isCourseSpecific', value || '')}
                data={[
                  { value: '', label: 'All' },
                  { value: 'true', label: 'Course-Specific' },
                  { value: 'false', label: 'Reusable' },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <TextInput
                label="Search"
                leftSection={<IconSearch size={18} />}
                value={filters.search}
                onChange={(event) => handleFilterChange('search', event.currentTarget.value)}
                placeholder="Search questions..."
              />
            </Grid.Col>
          </Grid>

          {/* Clear Filters */}
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => {
                setFilters({
                  language: '',
                  courseId: '',
                  lessonId: '',
                  hashtag: '',
                  questionType: '',
                  difficulty: '',
                  category: '',
                  isActive: '',
                  isCourseSpecific: '',
                  search: '',
                });
                setOffset(0);
              }}
            >
              Clear All Filters
            </Button>
          </Group>
          </Stack>
        </Card>
      )}

      {!showFilters && (
        <Button
          onClick={() => setShowFilters(true)}
          variant="default"
          leftSection={<IconFilter size={18} />}
        >
          Show Filters
        </Button>
      )}

      {/* Results Summary */}
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Showing {questions.length} of {total} questions
        </Text>
        {selectedQuestions.size > 0 && (
          <Group gap="xs">
            <Text size="sm">{selectedQuestions.size} selected</Text>
            <Button
              onClick={() => setSelectedQuestions(new Set())}
              variant="subtle"
              size="xs"
            >
              Clear Selection
            </Button>
          </Group>
        )}
      </Group>

      {/* Questions Table */}
      {loading ? (
        <Card withBorder>
          <Group justify="center" p="xl"><Loader /><Text>Loading questions...</Text></Group>
        </Card>
      ) : questions.length === 0 ? (
        <Card withBorder p="xl">
          <Stack align="center">
          <IconHelpCircle size={40} />
          <Text c="dimmed">No questions found</Text>
          <Button
            onClick={handleCreateQuestion}
            leftSection={<IconPlus size={18} />}
          >
            Create First Question
          </Button>
          </Stack>
        </Card>
      ) : (
        <Card withBorder p={0}>
          <Table.ScrollContainer minWidth={1100}>
            <Table highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>
                    <Checkbox
                      checked={selectedQuestions.size === questions.length && questions.length > 0}
                      onChange={toggleAllSelection}
                    />
                  </Table.Th>
                  <Table.Th>UUID</Table.Th>
                  <Table.Th>Question</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Difficulty</Table.Th>
                  <Table.Th>Hashtags</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Usage</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {questions.map((question) => (
                  <Table.Tr key={question._id} opacity={question.isActive ? 1 : 0.55}>
                    <Table.Td>
                      <Checkbox
                        checked={selectedQuestions.has(question._id)}
                        onChange={() => toggleQuestionSelection(question._id)}
                      />
                    </Table.Td>
                    <Table.Td>
                      {question.uuid ? (
                        <Group gap="xs" maw={260}>
                          <Text size="xs" ff="monospace">
                            {question.uuid}
                          </Text>
                          <ActionIcon
                            onClick={() => {
                              navigator.clipboard.writeText(question.uuid!);
                              alert('UUID copied to clipboard!');
                            }}
                            variant="subtle"
                            aria-label="Copy UUID"
                          >
                            <IconCopy size={16} />
                          </ActionIcon>
                        </Group>
                      ) : (
                        <Text size="xs" c="dimmed">No UUID</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={2} maw={420}>
                        <Text size="sm" fw={600} lineClamp={2}>
                          {question.question}
                        </Text>
                        {question.category && (
                          <Text size="xs" c="dimmed">
                            {question.category}
                          </Text>
                        )}
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light">
                        {question.questionType || 'N/A'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={difficultyBadgeColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4} maw={240}>
                        {question.hashtags?.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                        {question.hashtags && question.hashtags.length > 3 && (
                          <Text size="xs" c="dimmed">
                            +{question.hashtags.length - 3}
                          </Text>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        component="button"
                        onClick={() => handleToggleActive(question)}
                        color={question.isActive ? 'green' : 'gray'}
                        variant="light"
                      >
                        {question.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                      {question.showCount} shown, {question.correctCount} correct
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          onClick={() => handleEditQuestion(question)}
                          variant="subtle"
                          aria-label="Edit question"
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          onClick={() => handleDeleteQuestion(question._id)}
                          color="red"
                          variant="subtle"
                          aria-label="Delete question"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>
      )}

      {/* Pagination */}
      {total > limit && (
        <Group justify="space-between">
          <Button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            variant="default"
          >
            Previous
          </Button>
          <Text size="sm" c="dimmed">
            Page {Math.floor(offset / limit) + 1} of {Math.ceil(total / limit)}
          </Text>
          <Button
            onClick={() => setOffset(offset + limit)}
            disabled={!hasMore}
            variant="default"
          >
            Next
          </Button>
        </Group>
      )}

      {/* Question Form Modal */}
      <Modal
        opened={showQuestionForm}
        onClose={() => {
          setShowQuestionForm(false);
          setEditingQuestion(null);
        }}
        size="xl"
        title={editingQuestion ? 'Edit Question' : 'Create Question'}
      >
            <Stack gap="md">
              {/* Question Text */}
              <Textarea
                  label="Question Text"
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.currentTarget.value }))}
                  rows={3}
                  placeholder="Enter the question..."
                  required
              />

              {/* Options (minimum 4) */}
              <Stack gap="xs">
                <Text fw={600}>Answer Options * (minimum 4)</Text>
                {questionForm.options.map((option, idx) => (
                  <Group key={idx} align="center">
                    <Radio
                      checked={questionForm.correctIndex === idx}
                      onChange={() => setQuestionForm(prev => ({ ...prev, correctIndex: idx }))}
                    />
                    <TextInput
                      flex={1}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...questionForm.options];
                        newOptions[idx] = e.currentTarget.value;
                        setQuestionForm(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`Option ${idx + 1}${questionForm.correctIndex === idx ? ' (correct)' : ''}`}
                    />
                    {questionForm.options.length > 4 && (
                      <Button
                        variant="subtle"
                        color="red"
                        onClick={() => {
                          const newOptions = questionForm.options.filter((_, i) => i !== idx);
                          const newCorrect = questionForm.correctIndex >= newOptions.length
                            ? newOptions.length - 1
                            : questionForm.correctIndex > idx
                              ? questionForm.correctIndex - 1
                              : questionForm.correctIndex;
                          setQuestionForm(prev => ({ ...prev, options: newOptions, correctIndex: newCorrect }));
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Group>
                ))}
                <Button
                  onClick={() => setQuestionForm(prev => ({ ...prev, options: [...prev.options, ''] }))}
                  variant="default"
                >
                  Add option
                </Button>
              </Stack>

              {/* Metadata Row 1 */}
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Difficulty"
                    value={questionForm.difficulty}
                    onChange={(value) => setQuestionForm(prev => ({ ...prev, difficulty: value as QuestionDifficulty }))}
                    data={[
                      { value: QuestionDifficulty.EASY, label: 'Easy' },
                      { value: QuestionDifficulty.MEDIUM, label: 'Medium' },
                      { value: QuestionDifficulty.HARD, label: 'Hard' },
                      { value: QuestionDifficulty.EXPERT, label: 'Expert' },
                    ]}
                    required
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Question Type"
                    value={questionForm.questionType}
                    onChange={(value) => setQuestionForm(prev => ({ ...prev, questionType: value as QuestionType }))}
                    data={[
                      { value: QuestionType.RECALL, label: 'Recall' },
                      { value: QuestionType.APPLICATION, label: 'Application' },
                      { value: QuestionType.CRITICAL_THINKING, label: 'Critical Thinking' },
                    ]}
                    required
                  />
                </Grid.Col>
              </Grid>

              {/* Metadata Row 2 */}
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Category"
                    value={questionForm.category}
                    onChange={(value) => setQuestionForm(prev => ({ ...prev, category: value || '' }))}
                    data={[
                      { value: 'Course Specific', label: 'Course Specific' },
                      { value: 'General Knowledge', label: 'General Knowledge' },
                      { value: 'Science', label: 'Science' },
                      { value: 'Technology', label: 'Technology' },
                      { value: 'History', label: 'History' },
                      { value: 'Geography', label: 'Geography' },
                    ]}
                    required
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select
                    label="Course (Optional)"
                    value={questionForm.courseId}
                    onChange={(value) => setQuestionForm(prev => ({ ...prev, courseId: value || '' }))}
                    data={[{ value: '', label: 'None (Reusable)' }, ...courseOptions.slice(1)]}
                    searchable
                  />
                </Grid.Col>
              </Grid>

              {/* Related Courses */}
              <Stack gap="xs">
                <Text fw={600}>Related Courses (Multiple)</Text>
                <Group align="flex-end">
                  <Select
                    flex={1}
                    value={courseSelectInput}
                    onChange={(value) => setCourseSelectInput(value || '')}
                    placeholder="Select a course to add..."
                    data={courses
                      .filter(course => !questionForm.relatedCourseIds.includes(course.courseId))
                      .map(course => (
                        { value: course.courseId, label: `${course.name} (${course.language.toUpperCase()})` }
                      ))}
                    searchable
                  />
                  <Button
                    onClick={() => courseSelectInput && addRelatedCourse(courseSelectInput)}
                    disabled={!courseSelectInput}
                  >
                    Add
                  </Button>
                </Group>
                <Group gap="xs">
                  {questionForm.relatedCourseIds.map((courseId) => {
                    const course = courses.find(c => c.courseId === courseId);
                    return (
                      <Badge
                        key={courseId}
                        color="green"
                        rightSection={
                          <ActionIcon variant="transparent" size="xs" onClick={() => removeRelatedCourse(courseId)} aria-label="Remove course">
                            <IconX size={12} />
                          </ActionIcon>
                        }
                      >
                        {course ? `${course.name} (${course.language.toUpperCase()})` : courseId}
                      </Badge>
                    );
                  })}
                </Group>
                {questionForm.relatedCourseIds.length === 0 && (
                  <Text size="xs" c="dimmed">
                    Add courses that can use this question. Leave empty for reusable questions.
                  </Text>
                )}
              </Stack>

              {/* Hashtags */}
              <Stack gap="xs">
                <Text fw={600}>Hashtags</Text>
                <Group>
                  <TextInput
                    flex={1}
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.currentTarget.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHashtag();
                      }
                    }}
                    placeholder="#topic #difficulty #type #language"
                  />
                  <Button
                    onClick={addHashtag}
                  >
                    Add
                  </Button>
                </Group>
                <Group gap="xs">
                  {questionForm.hashtags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      rightSection={
                        <ActionIcon variant="transparent" size="xs" onClick={() => removeHashtag(tag)} aria-label="Remove hashtag">
                          <IconX size={12} />
                        </ActionIcon>
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </Group>
              </Stack>

              {/* Toggles */}
              <Group>
                <Checkbox
                    checked={questionForm.isCourseSpecific}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, isCourseSpecific: e.currentTarget.checked }))}
                    label="Course-Specific"
                />
                <Checkbox
                    checked={questionForm.isActive}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, isActive: e.currentTarget.checked }))}
                    label="Active"
                />
              </Group>

              {/* Actions */}
              <Group justify="flex-end">
                <Button
                  onClick={() => {
                    setShowQuestionForm(false);
                    setEditingQuestion(null);
                  }}
                  variant="default"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveQuestion}
                >
                  {editingQuestion ? 'Update' : 'Create'} Question
                </Button>
              </Group>
            </Stack>
      </Modal>
    </Stack>
  );
}
