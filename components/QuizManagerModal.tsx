'use client';

/**
 * Quiz Manager Modal
 *
 * What: Create, edit, deactivate, and permanently delete quiz questions for a lesson.
 * Why: Shared by admin course page and editor lesson page; editors with course access
 *      can manage questions via /api/admin/courses/[courseId]/lessons/[lessonId]/quiz.
 */

import { useState, useEffect, useCallback } from 'react';

export type QuizQuestionItem = {
  _id: string;
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: string;
  category: string;
  isActive: boolean;
};

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

const DEFAULT_FORM = {
  question: '',
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
        alert(data.error || 'Failed to load quiz questions');
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      alert('Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    void fetchQuestions();
  }, [fetchQuestions]);

  const handleSaveQuestion = async () => {
    try {
      const url = editingQuestion ? `${baseUrl}/quiz/${editingQuestion._id}` : `${baseUrl}/quiz`;
      const method = editingQuestion ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionForm.question,
          options: questionForm.options,
          correctIndex: questionForm.correctIndex,
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
      } else {
        alert(data.error || 'Failed to save question');
      }
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('Failed to save question');
    }
  };

  const handleEdit = (question: QuizQuestionItem) => {
    setEditingQuestion(question);
    setQuestionForm({
      question: question.question,
      options: question.options,
      correctIndex: question.correctIndex,
      difficulty: question.difficulty as Difficulty,
      category: question.category,
      isActive: question.isActive,
    });
    setShowQuestionForm(true);
  };

  const handleDeactivate = async (questionId: string) => {
    if (!confirm('Are you sure you want to deactivate this question? It can be reactivated later.')) return;
    try {
      const response = await fetch(`${baseUrl}/quiz/${questionId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) await fetchQuestions();
      else alert(data.error || 'Failed to deactivate question');
    } catch (error) {
      console.error('Failed to deactivate question:', error);
      alert('Failed to deactivate question');
    }
  };

  const handlePermanentDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to PERMANENTLY delete this question? This action cannot be undone!')) return;
    try {
      const response = await fetch(`${baseUrl}/quiz/${questionId}/permanent`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) await fetchQuestions();
      else alert(data.error || 'Failed to permanently delete question');
    } catch (error) {
      console.error('Failed to permanently delete question:', error);
      alert('Failed to permanently delete question');
    }
  };

  const handleToggleActive = async (question: QuizQuestionItem) => {
    try {
      const response = await fetch(`${baseUrl}/quiz/${question._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !question.isActive }),
      });
      const data = await response.json();
      if (data.success) await fetchQuestions();
      else alert(data.error || 'Failed to update question');
    } catch (error) {
      console.error('Failed to toggle question:', error);
      alert('Failed to update question');
    }
  };

  const isDark = variant === 'dark';
  const panelBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-brand-white border-brand-accent';
  const panelBorder = isDark ? 'border-gray-700' : 'border-2 border-brand-accent';
  const inputBg = isDark ? 'bg-gray-900 border-gray-700' : 'bg-brand-white border-brand-darkGrey';
  const textCls = isDark ? 'text-gray-100' : 'text-brand-black';
  const mutedCls = isDark ? 'text-gray-400' : 'text-brand-darkGrey';
  const btnPrimary = isDark
    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
    : 'bg-brand-accent text-brand-black hover:bg-brand-primary-400';
  const btnSecondary = isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-brand-darkGrey text-brand-white hover:bg-brand-secondary-700';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 ${panelBg} ${panelBorder}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-2xl font-bold ${textCls}`}>Manage Quiz Questions</h2>
            <p className={`text-sm ${mutedCls}`}>Lesson: {lessonId}</p>
          </div>
          <button onClick={onClose} className={`${mutedCls} hover:opacity-100 text-2xl font-bold`} aria-label="Close">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className={mutedCls}>Loading questions...</div>
          </div>
        ) : showQuestionForm ? (
          <div className="space-y-4">
            <h3 className={`text-lg font-bold ${textCls}`}>{editingQuestion ? 'Edit' : 'Create'} Question</h3>
            <div>
              <label className={`block text-sm font-medium ${textCls} mb-2`}>Question *</label>
              <textarea
                value={questionForm.question}
                onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border-2 ${inputBg} ${textCls} focus:outline-none focus:border-brand-accent`}
                rows={3}
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${textCls} mb-2`}>Options *</label>
              {questionForm.options.map((option, index) => (
                <div key={index} className="mb-2 flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctIndex"
                    checked={questionForm.correctIndex === index}
                    onChange={() => setQuestionForm({ ...questionForm, correctIndex: index })}
                    className="w-4 h-4 text-brand-accent"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...questionForm.options];
                      newOptions[index] = e.target.value;
                      setQuestionForm({ ...questionForm, options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 ${inputBg} ${textCls} focus:outline-none focus:border-brand-accent`}
                    required
                  />
                </div>
              ))}
              <p className={`text-xs ${mutedCls} mt-1`}>Select the radio button next to the correct answer</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textCls} mb-2`}>Difficulty</label>
                <select
                  value={questionForm.difficulty}
                  onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value as Difficulty })}
                  className={`w-full px-4 py-2 rounded-lg border-2 ${inputBg} ${textCls} focus:outline-none focus:border-brand-accent`}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${textCls} mb-2`}>Category</label>
                <select
                  value={questionForm.category}
                  onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border-2 ${inputBg} ${textCls} focus:outline-none focus:border-brand-accent`}
                >
                  <option value="General Knowledge">General Knowledge</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Math">Math</option>
                  <option value="Technology">Technology</option>
                  <option value="Arts & Literature">Arts & Literature</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={questionForm.isActive}
                onChange={(e) => setQuestionForm({ ...questionForm, isActive: e.target.checked })}
                className="w-4 h-4 text-brand-accent rounded"
              />
              <label className={`text-sm font-medium ${textCls}`}>Active</label>
            </div>
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-brand-darkGrey/20">
              <button
                type="button"
                onClick={() => {
                  setShowQuestionForm(false);
                  setEditingQuestion(null);
                  setQuestionForm(DEFAULT_FORM);
                }}
                className={`px-6 py-2 rounded-lg font-bold ${btnSecondary}`}
              >
                Cancel
              </button>
              <button type="button" onClick={handleSaveQuestion} className={`px-6 py-2 rounded-lg font-bold ${btnPrimary}`}>
                {editingQuestion ? 'Update' : 'Create'} Question
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className={`text-sm ${mutedCls}`}>
                {questions.length} question{questions.length !== 1 ? 's' : ''} total
              </p>
              <button
                onClick={() => {
                  setEditingQuestion(null);
                  setQuestionForm(DEFAULT_FORM);
                  setShowQuestionForm(true);
                }}
                className={`px-4 py-2 rounded-lg font-bold ${btnPrimary}`}
              >
                + Add Question
              </button>
            </div>
            {questions.length === 0 ? (
              <div className={`text-center py-12 border-2 border-dashed rounded-lg ${isDark ? 'border-gray-600' : 'border-brand-darkGrey/30'}`}>
                <p className={`mb-4 ${mutedCls}`}>No questions yet</p>
                <button onClick={() => setShowQuestionForm(true)} className={`px-4 py-2 rounded-lg font-bold ${btnPrimary}`}>
                  Create First Question
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.filter((q) => q.isActive).length > 0 && (
                  <div>
                    <h3 className={`text-lg font-bold ${textCls} mb-3`}>
                      Active Questions ({questions.filter((q) => q.isActive).length})
                    </h3>
                    <div className="space-y-3">
                      {questions
                        .filter((q) => q.isActive)
                        .map((question) => (
                          <div
                            key={question._id}
                            className={`p-4 border-2 rounded-lg ${isDark ? 'border-indigo-500 bg-gray-800' : 'border-brand-accent bg-brand-white'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`font-bold ${textCls} mb-2`}>{question.question}</h4>
                                <div className="space-y-1">
                                  {question.options.map((option, index) => (
                                    <div
                                      key={index}
                                      className={`text-sm ${index === question.correctIndex ? 'text-green-600 font-bold' : mutedCls}`}
                                    >
                                      {index === question.correctIndex ? '✓ ' : '  '}
                                      {option}
                                    </div>
                                  ))}
                                </div>
                                <div className={`flex items-center gap-4 mt-2 text-xs ${mutedCls}`}>
                                  <span>Difficulty: {question.difficulty}</span>
                                  <span>Category: {question.category}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => handleEdit(question)}
                                  className={`p-2 rounded ${btnPrimary}`}
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeactivate(question._id)}
                                  className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                  title="Deactivate"
                                >
                                  👁️
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                {questions.filter((q) => !q.isActive).length > 0 && (
                  <div>
                    <h3 className={`text-lg font-bold ${textCls} mb-3`}>
                      Inactive Questions ({questions.filter((q) => !q.isActive).length})
                    </h3>
                    <div className="space-y-3">
                      {questions
                        .filter((q) => !q.isActive)
                        .map((question) => (
                          <div
                            key={question._id}
                            className={`p-4 border-2 rounded-lg opacity-75 ${isDark ? 'border-gray-600 bg-gray-800/50' : 'border-brand-darkGrey/30 bg-brand-darkGrey/10'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className={`font-bold ${textCls}`}>{question.question}</h4>
                                  <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-600 text-gray-200' : 'bg-brand-darkGrey text-brand-white'}`}>
                                    Inactive
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {question.options.map((option, index) => (
                                    <div
                                      key={index}
                                      className={`text-sm ${index === question.correctIndex ? 'text-green-600 font-bold' : mutedCls}`}
                                    >
                                      {index === question.correctIndex ? '✓ ' : '  '}
                                      {option}
                                    </div>
                                  ))}
                                </div>
                                <div className={`flex items-center gap-4 mt-2 text-xs ${mutedCls}`}>
                                  <span>Difficulty: {question.difficulty}</span>
                                  <span>Category: {question.category}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => handleToggleActive(question)}
                                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                                  title="Reactivate"
                                >
                                  👁️‍🗨️
                                </button>
                                <button
                                  onClick={() => handlePermanentDelete(question._id)}
                                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                                  title="Permanently Delete"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
