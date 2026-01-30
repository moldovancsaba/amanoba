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

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  HelpCircle,
} from 'lucide-react';
import { QuestionDifficulty, QuestionType, Question } from '@/types/quiz-question';

interface Course {
  _id: string;
  courseId: string;
  name: string;
  language: string;
}

export default function AdminQuestionsPage() {
  const _locale = useLocale();
  const _t = useTranslations('admin');
  
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

  // Fetch courses for filter dropdown
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch questions when filters or pagination change
  useEffect(() => {
    fetchQuestions();
  }, [filters, offset]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses');
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const fetchQuestions = async () => {
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
  };

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
    // Convert relatedCourseIds to string array
    const relatedIds = question.relatedCourseIds 
      ? question.relatedCourseIds.map(id => typeof id === 'string' ? id : id.toString())
      : [];
    
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
      if (questionForm.options.some(opt => !opt.trim())) {
        alert('All 4 options must be filled');
        return;
      }
      if (new Set(questionForm.options).size !== questionForm.options.length) {
        alert('All options must be unique');
        return;
      }

      const url = editingQuestion
        ? `/api/admin/questions/${editingQuestion._id}`
        : '/api/admin/questions';

      const method = editingQuestion ? 'PATCH' : 'POST';

      const body: Record<string, unknown> = {
        question: questionForm.question.trim(),
        options: questionForm.options.map(opt => opt.trim()),
        correctIndex: questionForm.correctIndex,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Quiz Questions</h1>
          <p className="text-gray-400 mt-1">
            Manage and organize quiz questions across all courses
          </p>
        </div>
        <button
          onClick={handleCreateQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Question
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h2>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Language
              </label>
              <select
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">All Languages</option>
                <option value="hu">Hungarian</option>
                <option value="en">English</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="pl">Polish</option>
                <option value="tr">Turkish</option>
                <option value="vi">Vietnamese</option>
                <option value="id">Indonesian</option>
                <option value="hi">Hindi</option>
                <option value="ar">Arabic</option>
                <option value="bg">Bulgarian</option>
              </select>
            </div>

            {/* Course Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Course
              </label>
              <select
                value={filters.courseId}
                onChange={(e) => handleFilterChange('courseId', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">All Courses</option>
                {courses.map(course => (
                  <option key={course._id} value={course.courseId}>
                    {course.name} ({course.language.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Question Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Question Type
              </label>
              <select
                value={filters.questionType}
                onChange={(e) => handleFilterChange('questionType', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">All Types</option>
                <option value="recall">Recall</option>
                <option value="application">Application</option>
                <option value="critical-thinking">Critical Thinking</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">All Categories</option>
                <option value="Course Specific">Course Specific</option>
                <option value="General Knowledge">General Knowledge</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
              </select>
            </div>

            {/* Active Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filters.isActive}
                onChange={(e) => handleFilterChange('isActive', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Course-Specific Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Type
              </label>
              <select
                value={filters.isCourseSpecific}
                onChange={(e) => handleFilterChange('isCourseSpecific', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="">All</option>
                <option value="true">Course-Specific</option>
                <option value="false">Reusable</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
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
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {!showFilters && (
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700"
        >
          <Filter className="w-5 h-5" />
          Show Filters
        </button>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div>
          Showing {questions.length} of {total} questions
        </div>
        {selectedQuestions.size > 0 && (
          <div className="flex items-center gap-2">
            <span>{selectedQuestions.size} selected</span>
            <button
              onClick={() => setSelectedQuestions(new Set())}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Questions Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400">Loading questions...</div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <HelpCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <div className="text-gray-400">No questions found</div>
          <button
            onClick={handleCreateQuestion}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Create First Question
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.size === questions.length && questions.length > 0}
                      onChange={toggleAllSelection}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">UUID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Question</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Difficulty</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Hashtags</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Usage</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {questions.map((question) => (
                  <tr
                    key={question._id}
                    className={`hover:bg-gray-700/50 ${
                      !question.isActive ? 'opacity-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.has(question._id)}
                        onChange={() => toggleQuestionSelection(question._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {question.uuid ? (
                        <div className="max-w-xs">
                          <code className="text-xs text-indigo-300 font-mono break-all">
                            {question.uuid}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(question.uuid!);
                              alert('UUID copied to clipboard!');
                            }}
                            className="ml-2 text-xs text-indigo-400 hover:text-indigo-300"
                            title="Copy UUID"
                          >
                            📋
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">No UUID</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-md">
                        <div className="text-white text-sm font-medium line-clamp-2">
                          {question.question}
                        </div>
                        {question.category && (
                          <div className="text-xs text-gray-400 mt-1">
                            {question.category}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                        {question.questionType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        question.difficulty === QuestionDifficulty.EASY ? 'bg-green-500/20 text-green-300' :
                        question.difficulty === QuestionDifficulty.MEDIUM ? 'bg-yellow-500/20 text-yellow-300' :
                        question.difficulty === QuestionDifficulty.HARD ? 'bg-orange-500/20 text-orange-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {question.hashtags?.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {question.hashtags && question.hashtags.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{question.hashtags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(question)}
                        className={`text-xs px-2 py-1 rounded ${
                          question.isActive
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {question.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {question.showCount} shown, {question.correctCount} correct
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question._id)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="text-sm text-gray-400">
            Page {Math.floor(offset / limit) + 1} of {Math.ceil(total / limit)}
          </div>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={!hasMore}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Question Form Modal */}
      {showQuestionForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingQuestion ? 'Edit Question' : 'Create Question'}
              </h2>
              <button
                onClick={() => {
                  setShowQuestionForm(false);
                  setEditingQuestion(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Question Text *
                </label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  placeholder="Enter the question..."
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Answer Options * (4 required)
                </label>
                {questionForm.options.map((option, idx) => (
                  <div key={idx} className="mb-2 flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctIndex"
                      checked={questionForm.correctIndex === idx}
                      onChange={() => setQuestionForm(prev => ({ ...prev, correctIndex: idx }))}
                      className="w-4 h-4"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...questionForm.options];
                        newOptions[idx] = e.target.value;
                        setQuestionForm(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`Option ${idx + 1}${questionForm.correctIndex === idx ? ' (correct)' : ''}`}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                ))}
              </div>

              {/* Metadata Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, difficulty: e.target.value as QuestionDifficulty }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value={QuestionDifficulty.EASY}>Easy</option>
                    <option value={QuestionDifficulty.MEDIUM}>Medium</option>
                    <option value={QuestionDifficulty.HARD}>Hard</option>
                    <option value={QuestionDifficulty.EXPERT}>Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Question Type *
                  </label>
                  <select
                    value={questionForm.questionType}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, questionType: e.target.value as QuestionType }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value={QuestionType.RECALL}>Recall</option>
                    <option value={QuestionType.APPLICATION}>Application</option>
                    <option value={QuestionType.CRITICAL_THINKING}>Critical Thinking</option>
                  </select>
                </div>
              </div>

              {/* Metadata Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={questionForm.category}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="Course Specific">Course Specific</option>
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Course (Optional)
                  </label>
                  <select
                    value={questionForm.courseId}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, courseId: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="">None (Reusable)</option>
                    {courses.map(course => (
                      <option key={course._id} value={course.courseId}>
                        {course.name} ({course.language.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Related Courses */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Related Courses (Multiple)
                </label>
                <div className="flex gap-2 mb-2">
                  <select
                    value={courseSelectInput}
                    onChange={(e) => setCourseSelectInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="">Select a course to add...</option>
                    {courses
                      .filter(course => !questionForm.relatedCourseIds.includes(course.courseId))
                      .map(course => (
                        <option key={course._id} value={course.courseId}>
                          {course.name} ({course.language.toUpperCase()})
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => courseSelectInput && addRelatedCourse(courseSelectInput)}
                    disabled={!courseSelectInput}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {questionForm.relatedCourseIds.map((courseId) => {
                    const course = courses.find(c => c.courseId === courseId);
                    return (
                      <span
                        key={courseId}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm"
                      >
                        {course ? `${course.name} (${course.language.toUpperCase()})` : courseId}
                        <button
                          onClick={() => removeRelatedCourse(courseId)}
                          className="hover:text-green-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
                {questionForm.relatedCourseIds.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Add courses that can use this question. Leave empty for reusable questions.
                  </p>
                )}
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hashtags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHashtag();
                      }
                    }}
                    placeholder="#topic #difficulty #type #language"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                  <button
                    onClick={addHashtag}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {questionForm.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeHashtag(tag)}
                        className="hover:text-indigo-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={questionForm.isCourseSpecific}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, isCourseSpecific: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-300">Course-Specific</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={questionForm.isActive}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-300">Active</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    setShowQuestionForm(false);
                    setEditingQuestion(null);
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQuestion}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  {editingQuestion ? 'Update' : 'Create'} Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
