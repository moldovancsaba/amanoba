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
} from 'lucide-react';
import RichTextEditor from '@/app/components/ui/rich-text-editor';

interface Course {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  language: string;
  thumbnail?: string;
  isActive: boolean;
  requiresPremium: boolean;
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
  });
  const [saving, setSaving] = useState(false);

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
                Assessment Game
              </label>
              <select
                value={formData.assessmentGameId}
                onChange={(e) => setFormData({ ...formData, assessmentGameId: e.target.value })}
                className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
              >
                <option value="">None</option>
                {games.map((game) => (
                  <option key={game._id} value={game._id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
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
      </div>
    </div>
  );
}
