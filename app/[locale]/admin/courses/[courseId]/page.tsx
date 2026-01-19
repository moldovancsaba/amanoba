/**
 * Course Editor Page
 * 
 * What: Edit course and manage 30-day lessons
 * Why: Allows admins to build complete courses with lessons
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  BookOpen,
  Gamepad2,
  Download,
  Upload,
} from 'lucide-react';
import RichTextEditor from '@/app/components/ui/rich-text-editor';
import { getStripeMinimum, getFormattedMinimum, meetsStripeMinimum } from '@/app/lib/utils/stripe-minimums';

interface Course {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  language: string;
  thumbnail?: string;
  isActive: boolean;
  requiresPremium: boolean;
  price?: {
    amount: number;
    currency: string;
  };
  durationDays: number;
  pointsConfig: {
    completionPoints: number;
    lessonPoints: number;
    perfectCourseBonus?: number;
  };
  xpConfig: {
    completionXP: number;
    lessonXP: number;
  };
}

interface Lesson {
  _id: string;
  lessonId: string;
  dayNumber: number;
  title: string;
  content: string;
  emailSubject: string;
  emailBody: string;
  assessmentGameId?: string;
  pointsReward: number;
  xpReward: number;
  isActive: boolean;
}

interface Game {
  _id: string;
  gameId: string;
  name: string;
  isAssessment: boolean;
}

export default function CourseEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const router = useRouter();
  const locale = useLocale();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState<number | null>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [courseId, setCourseId] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.courseId;
      setCourseId(id);
      await Promise.all([
        fetchCourse(id),
        fetchLessons(id),
        fetchGames(),
      ]);
    };
    loadData();
  }, [params]);

  const fetchCourse = async (courseId: string) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`);
      const data = await response.json();
      if (data.success) {
        setCourse(data.course);
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    }
  };

  const fetchLessons = async (courseId: string) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons`);
      const data = await response.json();
      if (data.success) {
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      // Fetch games that can be used as assessments
      const response = await fetch('/api/games');
      const data = await response.json();
      if (data.success) {
        setGames(data.games || []);
      }
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  };

  const handleSaveCourse = async () => {
    if (!course) return;

    try {
      const response = await fetch(`/api/admin/courses/${course.courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });

      if (response.ok) {
        alert('Course saved successfully');
      }
    } catch (error) {
      console.error('Failed to save course:', error);
      alert('Failed to save course');
    }
  };

  const handleToggleActive = async () => {
    if (!course) return;

    try {
      const response = await fetch(`/api/admin/courses/${course.courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !course.isActive }),
      });

      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
      }
    } catch (error) {
      console.error('Failed to toggle course status:', error);
    }
  };

  const handleExportCourse = async () => {
    if (!courseId) {
      alert('Course ID is missing');
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/export`);
      if (!response.ok) {
        const error = await response.json();
        console.error('Export error:', error);
        alert(error.details ? `${error.error}: ${error.details}` : error.error || 'Failed to export course');
        return;
      }

      const data = await response.json();
      
      // Validate that we got course data
      if (!data.course || !data.course.courseId) {
        alert('Invalid export data received');
        return;
      }
      
      // Create a blob and download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${courseId}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export course:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to export course: ${errorMessage}`);
    }
  };

  const handleImportCourse = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm('This will overwrite the current course. Are you sure?')) {
      event.target.value = '';
      return;
    }

    try {
      const text = await file.text();
      const courseData = JSON.parse(text);

      const response = await fetch('/api/admin/courses/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseData, overwrite: true }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Course imported successfully!\n\nLessons: ${data.stats.lessonsCreated} created, ${data.stats.lessonsUpdated} updated\nQuestions: ${data.stats.questionsCreated} created, ${data.stats.questionsUpdated} updated`);
        // Reload the page to show updated data
        window.location.reload();
      } else {
        alert(data.error || 'Failed to import course');
      }
    } catch (error) {
      console.error('Failed to import course:', error);
      alert('Failed to import course. Please check the file format.');
    } finally {
      // Reset file input
      event.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Course not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/admin/courses`}
            className="p-2 bg-brand-darkGrey text-brand-white rounded-lg hover:bg-brand-secondary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{course.name}</h1>
            <p className="text-gray-400">Course Editor - Manage 30-day lessons</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCourse}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
          <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportCourse}
              className="hidden"
            />
          </label>
          <button
            onClick={() => {
              const previewUrl = `/${locale}/courses/${course.courseId}`;
              window.open(previewUrl, '_blank');
            }}
            className="flex items-center gap-2 bg-brand-darkGrey text-brand-white px-4 py-2 rounded-lg font-bold hover:bg-brand-secondary-700 transition-colors"
          >
            <Eye className="w-5 h-5" />
            Preview
          </button>
          <button
            onClick={handleToggleActive}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              course.isActive
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-brand-darkGrey text-brand-white hover:bg-brand-secondary-700'
            }`}
          >
            {course.isActive ? 'Published' : 'Draft'}
          </button>
          <button
            onClick={handleSaveCourse}
            className="flex items-center gap-2 bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Course
          </button>
        </div>
      </div>

      {/* Course Info */}
      <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent">
        <h2 className="text-xl font-bold text-brand-black mb-4">Course Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">Course Name</label>
            <input
              type="text"
              value={course.name}
              onChange={(e) => setCourse({ ...course, name: e.target.value })}
              className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">Language</label>
            <select
              value={course.language}
              onChange={(e) => setCourse({ ...course, language: e.target.value })}
              className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
            >
              <option value="hu">Hungarian</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-brand-black mb-2">Description</label>
            <textarea
              value={course.description}
              onChange={(e) => setCourse({ ...course, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={course.requiresPremium}
                onChange={(e) => setCourse({ ...course, requiresPremium: e.target.checked })}
                className="w-5 h-5 text-brand-accent border-brand-darkGrey rounded focus:ring-brand-accent"
              />
              <span className="text-sm font-medium text-brand-black">Requires Premium</span>
            </label>
          </div>
          {course.requiresPremium && (
            <>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Price (in smallest unit)
                </label>
                <input
                  type="number"
                  min={getStripeMinimum(course.price?.currency || 'usd')}
                  step="1"
                  value={course.price?.amount || 2999}
                  onChange={(e) => setCourse({
                    ...course,
                    price: {
                      amount: parseInt(e.target.value) || 0,
                      currency: course.price?.currency || 'usd',
                    },
                  })}
                  className={`w-full px-4 py-2 bg-brand-white border-2 rounded-lg text-brand-black focus:outline-none focus:border-brand-accent ${
                    course.price?.amount && course.price?.currency && !meetsStripeMinimum(course.price.amount, course.price.currency)
                      ? 'border-red-500'
                      : 'border-brand-darkGrey'
                  }`}
                  placeholder="2999"
                />
                {course.price?.amount && course.price?.currency && !meetsStripeMinimum(course.price.amount, course.price.currency) ? (
                  <p className="text-xs text-red-600 mt-1 font-semibold">
                    ⚠️ Amount too low! Minimum for {course.price.currency.toUpperCase()} is {getFormattedMinimum(course.price.currency)}
                  </p>
                ) : (
                  <p className="text-xs text-brand-darkGrey mt-1">
                    Enter amount in smallest unit (e.g., 2999 cents = $29.99). Minimum: {getFormattedMinimum(course.price?.currency || 'usd')}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Currency
                </label>
                <select
                  value={course.price?.currency || 'usd'}
                  onChange={(e) => {
                    const newCurrency = e.target.value;
                    const currentAmount = course.price?.amount || 2999;
                    const minimum = getStripeMinimum(newCurrency);
                    // If current amount is below new currency's minimum, set to minimum
                    const newAmount = currentAmount < minimum ? minimum : currentAmount;
                    setCourse({
                      ...course,
                      price: {
                        amount: newAmount,
                        currency: newCurrency,
                      },
                    });
                  }}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                >
                  <option value="usd">USD ($) - Min: $0.50</option>
                  <option value="eur">EUR (€) - Min: €0.50</option>
                  <option value="huf">HUF (Ft) - Min: 175 Ft</option>
                  <option value="gbp">GBP (£) - Min: £0.30</option>
                </select>
                <p className="text-xs text-brand-darkGrey mt-1">
                  Minimum: {getFormattedMinimum(course.price?.currency || 'usd')}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 30-Day Lesson Builder */}
      <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-brand-black">30-Day Lesson Builder</h2>
          <button
            onClick={() => setShowLessonForm(true)}
            className="flex items-center gap-2 bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Lesson
          </button>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
            const lesson = lessons.find((l) => l.dayNumber === day);
            return (
              <div
                key={day}
                className={`p-4 rounded-lg border-2 ${
                  lesson
                    ? 'bg-brand-accent/10 border-brand-accent'
                    : 'bg-brand-darkGrey/10 border-brand-darkGrey/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-accent" />
                    <span className="font-bold text-brand-black">Day {day}</span>
                  </div>
                  {lesson && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                      ✓
                    </span>
                  )}
                </div>
                {lesson ? (
                  <>
                    <h3 className="font-bold text-brand-black mb-1">{lesson.title}</h3>
                    <p className="text-sm text-brand-darkGrey mb-3 line-clamp-2">
                      {lesson.content.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const previewUrl = `/${locale}/courses/${course.courseId}/day/${day}`;
                          window.open(previewUrl, '_blank');
                        }}
                        className="flex items-center justify-center gap-1 bg-brand-darkGrey text-brand-white px-2 py-1 rounded text-sm font-bold hover:bg-brand-secondary-700"
                        title="Preview lesson"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingLesson(day);
                          setShowLessonForm(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 bg-brand-accent text-brand-black px-2 py-1 rounded text-sm font-bold hover:bg-brand-primary-400"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setEditingLesson(day);
                      setShowLessonForm(true);
                    }}
                    className="w-full text-brand-darkGrey hover:text-brand-accent text-sm font-medium"
                  >
                    + Add Lesson
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson Form Modal */}
      {showLessonForm && courseId && (
        <LessonFormModal
          courseId={courseId}
          dayNumber={editingLesson || 1}
          lesson={lessons.find((l) => l.dayNumber === editingLesson) || null}
          games={games}
          onClose={() => {
            setShowLessonForm(false);
            setEditingLesson(null);
          }}
          onSave={() => {
            fetchLessons(courseId);
            setShowLessonForm(false);
            setEditingLesson(null);
          }}
        />
      )}
    </div>
  );
}

// Lesson Form Modal Component
function LessonFormModal({
  courseId,
  dayNumber,
  lesson,
  games,
  onClose,
  onSave,
}: {
  courseId: string;
  dayNumber: number;
  lesson: Lesson | null;
  games: Game[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    lessonId: lesson?.lessonId || `DAY_${dayNumber.toString().padStart(2, '0')}`,
    title: lesson?.title || '',
    content: lesson?.content || '',
    emailSubject: lesson?.emailSubject || `Day ${dayNumber}: `,
    emailBody: lesson?.emailBody || '',
    assessmentGameId: lesson?.assessmentGameId || '',
    pointsReward: lesson?.pointsReward || 50,
    xpReward: lesson?.xpReward || 25,
    quizConfig: {
      enabled: lesson?.quizConfig?.enabled || false,
      successThreshold: lesson?.quizConfig?.successThreshold || 70,
      questionCount: lesson?.quizConfig?.questionCount || 5,
      poolSize: lesson?.quizConfig?.poolSize || 10,
      required: lesson?.quizConfig?.required !== false, // Default true
    },
  });
  const [saving, setSaving] = useState(false);
  const [showQuizManager, setShowQuizManager] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = lesson
        ? `/api/admin/courses/${courseId}/lessons/${lesson.lessonId}`
        : `/api/admin/courses/${courseId}/lessons`;

      const method = lesson ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dayNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSave();
      } else {
        alert(data.error || 'Failed to save lesson');
      }
    } catch (error) {
      console.error('Failed to save lesson:', error);
      alert('Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-brand-accent">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-brand-black">
            {lesson ? 'Edit' : 'Create'} Lesson - Day {dayNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-brand-darkGrey hover:text-brand-black"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Lesson ID
            </label>
            <input
              type="text"
              required
              value={formData.lessonId}
              onChange={(e) => setFormData({ ...formData, lessonId: e.target.value })}
              className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Content *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Start typing your lesson content... (Supports headings, lists, links, and formatting)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Email Subject
              </label>
              <input
                type="text"
                value={formData.emailSubject}
                onChange={(e) => setFormData({ ...formData, emailSubject: e.target.value })}
                className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Assessment Game (Optional)
              </label>
              <select
                value={formData.assessmentGameId}
                onChange={(e) => setFormData({ ...formData, assessmentGameId: e.target.value })}
                className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
              >
                <option value="">None (Use Quiz Instead)</option>
                {games.map((game) => (
                  <option key={game._id} value={game._id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quiz Configuration Section */}
          <div className="border-2 border-brand-accent rounded-lg p-4 bg-brand-darkGrey/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-brand-black">Lesson Quiz/Survey</h3>
                <p className="text-sm text-brand-darkGrey">Configure assessment quiz for this lesson</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.quizConfig.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    quizConfig: { ...formData.quizConfig, enabled: e.target.checked }
                  })}
                  className="w-5 h-5 text-brand-accent rounded focus:ring-brand-accent"
                />
                <span className="text-sm font-medium text-brand-black">Enable Quiz</span>
              </label>
            </div>

            {formData.quizConfig.enabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-black mb-2">
                      Success Threshold (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.quizConfig.successThreshold}
                      onChange={(e) => setFormData({
                        ...formData,
                        quizConfig: {
                          ...formData.quizConfig,
                          successThreshold: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                    />
                    <p className="text-xs text-brand-darkGrey mt-1">
                      Minimum % of correct answers to pass (0-100)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-black mb-2">
                      Questions to Show
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={formData.quizConfig.questionCount}
                      onChange={(e) => setFormData({
                        ...formData,
                        quizConfig: {
                          ...formData.quizConfig,
                          questionCount: parseInt(e.target.value) || 1
                        }
                      })}
                      className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                    />
                    <p className="text-xs text-brand-darkGrey mt-1">
                      Number of questions students will answer
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-black mb-2">
                      Question Pool Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quizConfig.poolSize}
                      onChange={(e) => setFormData({
                        ...formData,
                        quizConfig: {
                          ...formData.quizConfig,
                          poolSize: parseInt(e.target.value) || 1
                        }
                      })}
                      className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                    />
                    <p className="text-xs text-brand-darkGrey mt-1">
                      Total questions in pool (system selects from this)
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer mt-6">
                      <input
                        type="checkbox"
                        checked={formData.quizConfig.required}
                        onChange={(e) => setFormData({
                          ...formData,
                          quizConfig: {
                            ...formData.quizConfig,
                            required: e.target.checked
                          }
                        })}
                        className="w-5 h-5 text-brand-accent rounded focus:ring-brand-accent"
                      />
                      <span className="text-sm font-medium text-brand-black">Required to Complete Lesson</span>
                    </label>
                    <p className="text-xs text-brand-darkGrey mt-1 ml-7">
                      Students must pass quiz to complete lesson
                    </p>
                  </div>
                </div>

                {lesson && (
                  <div className="pt-4 border-t border-brand-darkGrey/20">
                    <button
                      type="button"
                      onClick={() => setShowQuizManager(true)}
                      className="w-full px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>📝</span>
                      Manage Quiz Questions
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Points Reward
              </label>
              <input
                type="number"
                value={formData.pointsReward}
                onChange={(e) => setFormData({ ...formData, pointsReward: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                XP Reward
              </label>
              <input
                type="number"
                value={formData.xpReward}
                onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-brand-darkGrey/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-brand-darkGrey text-brand-white rounded-lg font-bold hover:bg-brand-secondary-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : lesson ? 'Update Lesson' : 'Create Lesson'}
            </button>
          </div>
        </form>

        {/* Quiz Manager Modal */}
        {showQuizManager && lesson && (
          <QuizManagerModal
            courseId={courseId}
            lessonId={lesson.lessonId}
            onClose={() => setShowQuizManager(false)}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Quiz Manager Modal Component
 * 
 * What: Allows admins to create, edit, and manage quiz questions for a lesson
 * Why: Provides UI for managing lesson-specific quiz questions
 */
function QuizManagerModal({
  courseId,
  lessonId,
  onClose,
}: {
  courseId: string;
  lessonId: string;
  onClose: () => void;
}) {
  const [questions, setQuestions] = useState<Array<{
    _id: string;
    question: string;
    options: string[];
    correctIndex: number;
    difficulty: string;
    category: string;
    isActive: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<typeof questions[0] | null>(null);
  const [questionForm, setQuestionForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    difficulty: 'MEDIUM' as 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT',
    category: 'General Knowledge',
    isActive: true,
  });

  useEffect(() => {
    fetchQuestions();
  }, [courseId, lessonId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}/quiz`);
      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions || []);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      alert('Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      const url = editingQuestion
        ? `/api/admin/courses/${courseId}/lessons/${lessonId}/quiz/${editingQuestion._id}`
        : `/api/admin/courses/${courseId}/lessons/${lessonId}/quiz`;

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
        setQuestionForm({
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          difficulty: 'MEDIUM',
          category: 'General Knowledge',
          isActive: true,
        });
      } else {
        alert(data.error || 'Failed to save question');
      }
    } catch (error) {
      console.error('Failed to save question:', error);
      alert('Failed to save question');
    }
  };

  const handleEdit = (question: typeof questions[0]) => {
    setEditingQuestion(question);
    setQuestionForm({
      question: question.question,
      options: question.options,
      correctIndex: question.correctIndex,
      difficulty: question.difficulty as 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT',
      category: question.category,
      isActive: question.isActive,
    });
    setShowQuestionForm(true);
  };

  const handleDeactivate = async (questionId: string) => {
    if (!confirm('Are you sure you want to deactivate this question? It can be reactivated later.')) return;

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}/quiz/${questionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchQuestions();
      } else {
        alert(data.error || 'Failed to deactivate question');
      }
    } catch (error) {
      console.error('Failed to deactivate question:', error);
      alert('Failed to deactivate question');
    }
  };

  const handlePermanentDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to PERMANENTLY delete this question? This action cannot be undone!')) return;

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}/quiz/${questionId}/permanent`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchQuestions();
      } else {
        alert(data.error || 'Failed to permanently delete question');
      }
    } catch (error) {
      console.error('Failed to permanently delete question:', error);
      alert('Failed to permanently delete question');
    }
  };

  const handleToggleActive = async (question: typeof questions[0]) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}/quiz/${question._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !question.isActive,
        }),
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-brand-accent">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-black">Manage Quiz Questions</h2>
            <p className="text-sm text-brand-darkGrey">Lesson: {lessonId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-brand-darkGrey hover:text-brand-black text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-brand-darkGrey">Loading questions...</div>
          </div>
        ) : showQuestionForm ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-brand-black">
              {editingQuestion ? 'Edit' : 'Create'} Question
            </h3>

            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Question *
              </label>
              <textarea
                value={questionForm.question}
                onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Options *
              </label>
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
                    className="flex-1 px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                    required
                  />
                </div>
              ))}
              <p className="text-xs text-brand-darkGrey mt-1">
                Select the radio button next to the correct answer
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Difficulty
                </label>
                <select
                  value={questionForm.difficulty}
                  onChange={(e) => setQuestionForm({
                    ...questionForm,
                    difficulty: e.target.value as 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
                  })}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Category
                </label>
                <select
                  value={questionForm.category}
                  onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
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
              <label className="text-sm font-medium text-brand-black">Active</label>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-brand-darkGrey/20">
              <button
                type="button"
                onClick={() => {
                  setShowQuestionForm(false);
                  setEditingQuestion(null);
                  setQuestionForm({
                    question: '',
                    options: ['', '', '', ''],
                    correctIndex: 0,
                    difficulty: 'MEDIUM',
                    category: 'General Knowledge',
                    isActive: true,
                  });
                }}
                className="px-6 py-2 bg-brand-darkGrey text-brand-white rounded-lg font-bold hover:bg-brand-secondary-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuestion}
                className="px-6 py-2 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
              >
                {editingQuestion ? 'Update' : 'Create'} Question
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-darkGrey">
                  {questions.length} question{questions.length !== 1 ? 's' : ''} total
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingQuestion(null);
                  setQuestionForm({
                    question: '',
                    options: ['', '', '', ''],
                    correctIndex: 0,
                    difficulty: 'MEDIUM',
                    category: 'General Knowledge',
                    isActive: true,
                  });
                  setShowQuestionForm(true);
                }}
                className="px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
              >
                + Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-brand-darkGrey/30 rounded-lg">
                <p className="text-brand-darkGrey mb-4">No questions yet</p>
                <button
                  onClick={() => {
                    setShowQuestionForm(true);
                  }}
                  className="px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
                >
                  Create First Question
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Active Questions */}
                {questions.filter(q => q.isActive).length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-brand-black mb-3">
                      Active Questions ({questions.filter(q => q.isActive).length})
                    </h3>
                    <div className="space-y-3">
                      {questions
                        .filter(q => q.isActive)
                        .map((question) => (
                          <div
                            key={question._id}
                            className="p-4 border-2 border-brand-accent bg-brand-white rounded-lg"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-bold text-brand-black">{question.question}</h4>
                                </div>
                                <div className="space-y-1">
                                  {question.options.map((option, index) => (
                                    <div
                                      key={index}
                                      className={`text-sm ${
                                        index === question.correctIndex
                                          ? 'text-green-600 font-bold'
                                          : 'text-brand-darkGrey'
                                      }`}
                                    >
                                      {index === question.correctIndex ? '✓ ' : '  '}
                                      {option}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-brand-darkGrey">
                                  <span>Difficulty: {question.difficulty}</span>
                                  <span>Category: {question.category}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => handleEdit(question)}
                                  className="p-2 bg-brand-accent text-brand-black rounded hover:bg-brand-primary-400 transition-colors"
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => handleDeactivate(question._id)}
                                  className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
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

                {/* Inactive Questions */}
                {questions.filter(q => !q.isActive).length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-brand-black mb-3">
                      Inactive Questions ({questions.filter(q => !q.isActive).length})
                    </h3>
                    <div className="space-y-3">
                      {questions
                        .filter(q => !q.isActive)
                        .map((question) => (
                          <div
                            key={question._id}
                            className="p-4 border-2 border-brand-darkGrey/30 bg-brand-darkGrey/10 rounded-lg opacity-75"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-bold text-brand-black">{question.question}</h4>
                                  <span className="text-xs bg-brand-darkGrey text-brand-white px-2 py-1 rounded">
                                    Inactive
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {question.options.map((option, index) => (
                                    <div
                                      key={index}
                                      className={`text-sm ${
                                        index === question.correctIndex
                                          ? 'text-green-600 font-bold'
                                          : 'text-brand-darkGrey'
                                      }`}
                                    >
                                      {index === question.correctIndex ? '✓ ' : '  '}
                                      {option}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center gap-4 mt-2 text-xs text-brand-darkGrey">
                                  <span>Difficulty: {question.difficulty}</span>
                                  <span>Category: {question.category}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => handleToggleActive(question)}
                                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                  title="Reactivate"
                                >
                                  👁️‍🗨️
                                </button>
                                <button
                                  onClick={() => handlePermanentDelete(question._id)}
                                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
