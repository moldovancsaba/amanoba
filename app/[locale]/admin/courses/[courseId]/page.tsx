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
  Eye,
  Calendar,
  Download,
  Upload,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import Image from 'next/image';
import RichTextEditor from '@/app/components/ui/rich-text-editor';
import { getStripeMinimum, getFormattedMinimum, meetsStripeMinimum } from '@/app/lib/utils/stripe-minimums';
import { marked } from 'marked';
import { COURSE_LANGUAGE_OPTIONS } from '@/app/lib/constants/course-languages';
import QuizManagerModal from '@/components/QuizManagerModal';

interface Course {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  language: string;
  thumbnail?: string;
  isActive: boolean;
  requiresPremium: boolean;
  discussionEnabled?: boolean;
  leaderboardEnabled?: boolean;
  studyGroupsEnabled?: boolean;
  price?: {
    amount: number;
    currency: string;
  };
  durationDays: number;
  parentCourseId?: string;
  selectedLessonIds?: string[];
  syncStatus?: 'synced' | 'out_of_sync';
  lastSyncedAt?: string;
  createdBy?: string;
  assignedEditors?: string[];
  pointsConfig: {
    completionPoints: number;
    lessonPoints: number;
    perfectCourseBonus?: number;
  };
  xpConfig: {
    completionXP: number;
    lessonXP: number;
  };
  certification?: {
    enabled: boolean;
    poolCourseId?: string;
    certQuestionCount?: number;
    /** Pass rule: minimum final exam score (0–100). Default 50. */
    passThresholdPercent?: number;
    requireAllLessonsCompleted?: boolean;
    requireAllQuizzesPassed?: boolean;
    priceMoney?: {
      amount: number;
      currency: string;
    };
    pricePoints?: number;
    premiumIncludesCertification?: boolean;
    templateId?: string;
    credentialTitleId?: string;
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
  quizConfig?: {
    enabled: boolean;
    successThreshold: number;
    questionCount: number;
    poolSize: number;
    required: boolean;
  };
  pointsReward: number;
  xpReward: number;
  isActive: boolean;
}

type LessonWithQuizConfig = Lesson & {
  quizConfig?: {
    enabled: boolean;
    successThreshold: number;
    questionCount: number;
    poolSize: number;
    required: boolean;
  };
};

interface Game {
  _id: string;
  gameId: string;
  name: string;
  isAssessment: boolean;
}

type CourseFeatureFlag = 'discussionEnabled' | 'leaderboardEnabled' | 'studyGroupsEnabled';

export default function CourseEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const _router = useRouter();
  const locale = useLocale();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState<number | null>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [courseId, setCourseId] = useState<string>('');
  const [shorts, setShorts] = useState<Array<{ courseId: string; name: string; courseVariant?: string; isDraft?: boolean }>>([]);
  const [shortSelectedIds, setShortSelectedIds] = useState<string[]>([]);
  const [shortCertCount, setShortCertCount] = useState(25);
  const [shortCreating, setShortCreating] = useState(false);
  const [showShortsCreate, setShowShortsCreate] = useState(false);
  const [syncStatusData, setSyncStatusData] = useState<{
    computedStatus: 'synced' | 'out_of_sync';
    missingLessonIds: string[];
    lastSyncedAt: string | null;
  } | null>(null);
  const [syncActionLoading, setSyncActionLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editorNames, setEditorNames] = useState<Record<string, string>>({});
  const [editorSearch, setEditorSearch] = useState('');
  const [editorSearchResults, setEditorSearchResults] = useState<Array<{ _id: string; displayName?: string; email?: string }>>([]);
  const [editorSearching, setEditorSearching] = useState(false);
  const [_addingEditor, _setAddingEditor] = useState(false);
  const resolvedLanguageOptions = course
    ? [
        ...(!COURSE_LANGUAGE_OPTIONS.some((option) => option.code === course.language)
          ? [{ code: course.language, label: course.language.toUpperCase() }]
          : []),
        ...COURSE_LANGUAGE_OPTIONS,
      ]
    : COURSE_LANGUAGE_OPTIONS;

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

  useEffect(() => {
    if (course?.courseId && !course.parentCourseId) {
      fetch(`/api/admin/courses?parentCourseId=${encodeURIComponent(course.courseId)}`)
        .then((r) => r.json())
        .then((d) => setShorts(d.success ? d.courses || [] : []))
        .catch(() => setShorts([]));
    } else {
      setShorts([]);
    }
  }, [course?.courseId, course?.parentCourseId]);

  useEffect(() => {
    if (!course?.courseId || !course.parentCourseId) {
      setSyncStatusData(null);
      return;
    }
    fetch(`/api/admin/courses/${course.courseId}/sync-status`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setSyncStatusData({
            computedStatus: d.computedStatus ?? 'out_of_sync',
            missingLessonIds: d.missingLessonIds ?? [],
            lastSyncedAt: d.lastSyncedAt ?? null,
          });
        } else {
          setSyncStatusData(null);
        }
      })
      .catch(() => setSyncStatusData(null));
  }, [course?.courseId, course?.parentCourseId]);

  useEffect(() => {
    fetch('/api/admin/access')
      .then((r) => r.json())
      .then((d) => setIsAdmin(d.isAdmin === true))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    const ids = course?.assignedEditors?.filter((id) => typeof id === 'string' && id) ?? [];
    if (ids.length === 0) {
      setEditorNames({});
      return;
    }
    fetch(`/api/admin/players?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.success || !Array.isArray(d.players)) return;
        const map: Record<string, string> = {};
        for (const p of d.players) {
          const id = p._id ?? p.id;
          if (id) map[String(id)] = p.displayName || p.email || String(id);
        }
        setEditorNames(map);
      })
      .catch(() => setEditorNames({}));
  }, [course?.assignedEditors]);

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
        const data = await response.json();
        if (data.success && data.course) {
          setCourse(data.course);
        }
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

  const _updateCourseFeature = (flag: CourseFeatureFlag, enabled: boolean) => {
    if (!course) return;
    setCourse({
      ...course,
      [flag]: enabled,
    });
  };

  const handleExportCourse = async () => {
    if (!courseId) {
      alert('Course ID is missing');
      return;
    }
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/export`);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert(err.details ? `${err.error}: ${err.details}` : err.error || 'Failed to export course');
        return;
      }
      const data = await response.json();
      if (!data.course?.courseId) {
        alert('Invalid export data received');
        return;
      }
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
      alert(`Failed to export course: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleExportCourseAsZip = async () => {
    if (!courseId) {
      alert('Course ID is missing');
      return;
    }
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/export?format=zip`);
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert(err.details ? `${err.error}: ${err.details}` : err.error || 'Failed to export ZIP');
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${courseId}_package_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export ZIP:', error);
      alert(`Failed to export ZIP: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleImportCourse = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm('Merge package into this course? Content will be updated; progress, upvotes, certificates, and shorts are preserved.')) {
      event.target.value = '';
      return;
    }

    try {
      const isZip = file.name.toLowerCase().endsWith('.zip');
      let response: Response;

      if (isZip) {
        const formData = new FormData();
        formData.set('file', file);
        formData.set('overwrite', 'true');
        response = await fetch('/api/admin/courses/import', {
          method: 'POST',
          body: formData,
        });
      } else {
        const text = await file.text();
        const courseData = JSON.parse(text);
        response = await fetch('/api/admin/courses/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseData, overwrite: true }),
        });
      }

      const data = await response.json();

      if (data.success) {
        alert(`Course ${data.message}\n\nLessons: ${data.stats.lessonsCreated} created, ${data.stats.lessonsUpdated} updated\nQuestions: ${data.stats.questionsCreated} created, ${data.stats.questionsUpdated} updated`);
        window.location.reload();
      } else {
        alert(data.error || 'Failed to import course');
      }
    } catch (error) {
      console.error('Failed to import course:', error);
      alert('Failed to import course. Please check the file format (.json or .zip).');
    } finally {
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
            Export JSON
          </button>
          <button
            onClick={handleExportCourseAsZip}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export ZIP
          </button>
          <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            Import (JSON or ZIP)
            <input
              type="file"
              accept=".json,.zip"
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
              {resolvedLanguageOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-brand-black mb-2">Course Thumbnail</label>
            <div className="space-y-3">
              {course.thumbnail && (
                <div className="relative w-full h-48 bg-brand-darkGrey rounded-lg overflow-hidden border-2 border-brand-accent">
                  <Image
                    src={course.thumbnail}
                    alt="Course thumbnail"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 24rem"
                  />
                  <button
                    onClick={() => setCourse({ ...course, thumbnail: undefined })}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors cursor-pointer w-fit">
                <Upload className="w-5 h-5" />
                {course.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    try {
                      const formData = new FormData();
                      formData.append('image', file);

                      const response = await fetch('/api/admin/upload-image', {
                        method: 'POST',
                        body: formData,
                      });

                      const data = await response.json();

                      if (data.success) {
                        setCourse({ ...course, thumbnail: data.url });
                      } else {
                        alert(data.error || 'Failed to upload image');
                      }
                    } catch (error) {
                      console.error('Failed to upload image:', error);
                      alert('Failed to upload image. Please try again.');
                    } finally {
                      // Reset file input
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-brand-darkGrey">
                Upload a course thumbnail image (JPEG, PNG, WebP, or GIF, max 10MB). This will be displayed on course cards.
              </p>
            </div>
          </div>
          {isAdmin && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-black mb-2">Assigned editors</label>
              <p className="text-xs text-brand-darkGrey mb-2">
                Editors can edit this course and see it in their admin course list. Only admins can change this list.
              </p>
              <div className="space-y-2">
                {(course.assignedEditors ?? []).map((id) => (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-2 py-2 px-3 bg-gray-100 rounded-lg"
                  >
                    <span className="text-brand-black font-medium">{editorNames[id] ?? id}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        const next = (course.assignedEditors ?? []).filter((e) => e !== id);
                        try {
                          const r = await fetch(`/api/admin/courses/${course.courseId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ assignedEditors: next }),
                          });
                          if (r.ok) {
                            const data = await r.json();
                            setCourse(data.course);
                          } else {
                            const err = await r.json();
                            alert(err.message || err.error || 'Failed to remove editor');
                          }
                        } catch (e) {
                          console.error(e);
                          alert('Failed to remove editor');
                        }
                      }}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Search by email or name..."
                    value={editorSearch}
                    onChange={(e) => setEditorSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), setEditorSearching(true))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-brand-black w-64"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditorSearching(true);
                      if (!editorSearch.trim()) {
                        setEditorSearchResults([]);
                        setEditorSearching(false);
                        return;
                      }
                      fetch(`/api/admin/players?search=${encodeURIComponent(editorSearch.trim())}&limit=10`)
                        .then((r) => r.json())
                        .then((d) => {
                          setEditorSearchResults(d.success && Array.isArray(d.players) ? d.players : []);
                          setEditorSearching(false);
                        })
                        .catch(() => {
                          setEditorSearchResults([]);
                          setEditorSearching(false);
                        });
                    }}
                    disabled={editorSearching}
                    className="bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 disabled:opacity-50"
                  >
                    {editorSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>
                {editorSearchResults.length > 0 && (
                  <ul className="mt-2 border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-48 overflow-y-auto">
                    {editorSearchResults
                      .filter((p) => !(course.assignedEditors ?? []).includes(String(p._id)))
                      .map((p) => (
                        <li key={String(p._id)} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                          <span className="text-brand-black">
                            {p.displayName || p.email || String(p._id)}
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              const current = course.assignedEditors ?? [];
                              const id = String(p._id);
                              if (current.includes(id)) return;
                              const next = [...current, id];
                              try {
                                const r = await fetch(`/api/admin/courses/${course.courseId}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ assignedEditors: next }),
                                });
                                if (r.ok) {
                                  const data = await r.json();
                                  setCourse(data.course);
                                  setEditorSearchResults([]);
                                  setEditorSearch('');
                                } else {
                                  const err = await r.json();
                                  alert(err.message || err.error || 'Failed to add editor');
                                }
                              } catch (e) {
                                console.error(e);
                                alert('Failed to add editor');
                              }
                            }}
                            className="text-brand-accent hover:underline font-medium text-sm"
                          >
                            Add
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          )}
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
                  onChange={(e) => {
                    const newAmount = parseInt(e.target.value) || 0;
                    const currentCurrency = course.price?.currency || 'usd';
                    setCourse({
                      ...course,
                      price: {
                        amount: newAmount,
                        currency: currentCurrency,
                      },
                    });
                  }}
                  className={`w-full px-4 py-2 bg-brand-white border-2 rounded-lg text-brand-black focus:outline-none focus:border-brand-accent ${
                    course.price?.amount && course.price?.currency && !meetsStripeMinimum(course.price.amount, course.price.currency)
                      ? 'border-red-500'
                      : 'border-brand-darkGrey'
                  }`}
                  placeholder="2999"
                />
                {(() => {
                  const currentCurrency = course.price?.currency || 'usd';
                  const currentAmount = course.price?.amount || 0;
                  const isValid = currentAmount > 0 && meetsStripeMinimum(currentAmount, currentCurrency);
                  
                  return !isValid && currentAmount > 0 ? (
                    <p className="text-xs text-red-600 mt-1 font-semibold">
                      ⚠️ Amount too low! Minimum for {currentCurrency.toUpperCase()} is {getFormattedMinimum(currentCurrency)}
                    </p>
                  ) : (
                    <p className="text-xs text-brand-darkGrey mt-1">
                      Enter amount in smallest unit (e.g., 2999 cents = $29.99). Minimum: {getFormattedMinimum(currentCurrency)}
                    </p>
                  );
                })()}
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
                    // Update both currency and amount atomically
                    const updatedPrice = {
                      amount: newAmount,
                      currency: newCurrency,
                    };
                    setCourse({
                      ...course,
                      price: updatedPrice,
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

      {/* Certification Settings */}
      <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent">
        <h2 className="text-xl font-bold text-brand-black mb-4">Certification Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={course.certification?.enabled || false}
                onChange={(e) => setCourse({
                  ...course,
                  certification: {
                    ...course.certification,
                    enabled: e.target.checked,
                    passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                    requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                    requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                    pricePoints: course.certification?.pricePoints ?? 0,
                    premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                    templateId: course.certification?.templateId ?? 'default_v1',
                    credentialTitleId: course.certification?.credentialTitleId ?? '',
                  },
                })}
                className="w-5 h-5 text-brand-accent border-brand-darkGrey rounded focus:ring-brand-accent"
              />
              <span className="text-sm font-medium text-brand-black">Enable Certification</span>
            </label>
            <p className="text-xs text-brand-darkGrey mt-1 ml-7">
              Allow students to earn certificates for completing this course
            </p>
          </div>

          {course.certification?.enabled && (
            <>
              {/* Pass rules — dynamic pass threshold and conditions */}
              <div className="border border-brand-darkGrey/30 rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-bold text-brand-black">Pass rules</h3>
                <p className="text-xs text-brand-darkGrey">
                  Current rule: Pass final exam ≥ {course.certification?.passThresholdPercent ?? 50}%;
                  {course.certification?.requireAllLessonsCompleted !== false ? ' All lessons completed required;' : ' Lessons not required;'}
                  {course.certification?.requireAllQuizzesPassed !== false ? ' All daily quizzes passed required.' : ' Daily quizzes not required.'}
                </p>
                <div>
                  <label className="block text-sm font-medium text-brand-black mb-2">
                    Pass threshold (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={course.certification?.passThresholdPercent ?? 50}
                    onChange={(e) => setCourse({
                      ...course,
                      certification: {
                        ...course.certification,
                        enabled: true,
                        passThresholdPercent: Math.min(100, Math.max(0, parseInt(e.target.value) || 50)),
                        requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                        requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                        pricePoints: course.certification?.pricePoints ?? 0,
                        premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                        templateId: course.certification?.templateId ?? 'default_v1',
                        credentialTitleId: course.certification?.credentialTitleId ?? '',
                      },
                    })}
                    className="w-full max-w-[120px] px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                  />
                  <p className="text-xs text-brand-darkGrey mt-1">Minimum final exam score (0–100) to be eligible for certificate. Default 50.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={course.certification?.requireAllLessonsCompleted !== false}
                      onChange={(e) => setCourse({
                        ...course,
                        certification: {
                          ...course.certification,
                          enabled: true,
                          passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                          requireAllLessonsCompleted: e.target.checked,
                          requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                          pricePoints: course.certification?.pricePoints ?? 0,
                          premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                          templateId: course.certification?.templateId ?? 'default_v1',
                          credentialTitleId: course.certification?.credentialTitleId ?? '',
                        },
                      })}
                      className="w-5 h-5 text-brand-accent border-brand-darkGrey rounded focus:ring-brand-accent"
                    />
                    <span className="text-sm font-medium text-brand-black">Require all lessons completed</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={course.certification?.requireAllQuizzesPassed !== false}
                      onChange={(e) => setCourse({
                        ...course,
                        certification: {
                          ...course.certification,
                          enabled: true,
                          passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                          requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                          requireAllQuizzesPassed: e.target.checked,
                          pricePoints: course.certification?.pricePoints ?? 0,
                          premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                          templateId: course.certification?.templateId ?? 'default_v1',
                          credentialTitleId: course.certification?.credentialTitleId ?? '',
                        },
                      })}
                      className="w-5 h-5 text-brand-accent border-brand-darkGrey rounded focus:ring-brand-accent"
                    />
                    <span className="text-sm font-medium text-brand-black">Require all daily quizzes passed</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Price (Points)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={course.certification?.pricePoints || 0}
                  onChange={(e) => setCourse({
                    ...course,
                    certification: {
                      ...course.certification,
                      enabled: true,
                      passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                      requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                      requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                      pricePoints: parseInt(e.target.value) || 0,
                      premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                      templateId: course.certification?.templateId ?? 'default_v1',
                      credentialTitleId: course.certification?.credentialTitleId ?? '',
                    },
                  })}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                  placeholder="0"
                />
                <p className="text-xs text-brand-darkGrey mt-1">
                  Points required to unlock certification exam (0 = free)
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={course.certification?.premiumIncludesCertification || false}
                    onChange={(e) => setCourse({
                      ...course,
                      certification: {
                        ...course.certification,
                        enabled: true,
                        passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                        requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                        requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                        pricePoints: course.certification?.pricePoints ?? 0,
                        premiumIncludesCertification: e.target.checked,
                        templateId: course.certification?.templateId ?? 'default_v1',
                        credentialTitleId: course.certification?.credentialTitleId ?? '',
                      },
                    })}
                    className="w-5 h-5 text-brand-accent border-brand-darkGrey rounded focus:ring-brand-accent"
                  />
                  <span className="text-sm font-medium text-brand-black">Premium Includes Certification</span>
                </label>
                <p className="text-xs text-brand-darkGrey mt-1 ml-7">
                  Automatically grant certification access to premium course purchasers
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Template ID (Optional)
                </label>
                <input
                  type="text"
                  value={course.certification?.templateId || 'default_v1'}
                  onChange={(e) => setCourse({
                    ...course,
                    certification: {
                      ...course.certification,
                      enabled: true,
                      passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                      requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                      requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                      pricePoints: course.certification?.pricePoints ?? 0,
                      premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                      templateId: e.target.value,
                      credentialTitleId: course.certification?.credentialTitleId ?? '',
                    },
                  })}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                  placeholder="default_v1"
                />
                <p className="text-xs text-brand-darkGrey mt-1">
                  Certificate design template (default: default_v1)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">
                  Credential Title ID (Optional)
                </label>
                <input
                  type="text"
                  value={course.certification?.credentialTitleId || ''}
                  onChange={(e) => setCourse({
                    ...course,
                    certification: {
                      ...course.certification,
                      enabled: true,
                      passThresholdPercent: course.certification?.passThresholdPercent ?? 50,
                      requireAllLessonsCompleted: course.certification?.requireAllLessonsCompleted ?? true,
                      requireAllQuizzesPassed: course.certification?.requireAllQuizzesPassed ?? true,
                      pricePoints: course.certification?.pricePoints ?? 0,
                      premiumIncludesCertification: course.certification?.premiumIncludesCertification ?? false,
                      templateId: course.certification?.templateId ?? 'default_v1',
                      credentialTitleId: e.target.value,
                    },
                  })}
                  className="w-full px-4 py-2 bg-brand-white border-2 border-brand-darkGrey rounded-lg text-brand-black focus:outline-none focus:border-brand-accent"
                  placeholder="e.g., AAE, CERT"
                />
                <p className="text-xs text-brand-darkGrey mt-1">
                  Credential identifier shown on certificate (e.g., &quot;AAE&quot; for Amanoba-Accredited Expert)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Course Feature Toggles */}
      <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent mt-6">
        <h2 className="text-xl font-bold text-brand-black mb-4">Course Feature Toggles</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={course?.discussionEnabled ?? false}
                onChange={(e) => _updateCourseFeature('discussionEnabled', e.target.checked)}
                className="w-5 h-5 text-brand-accent border-brand-darkGrey rounded focus:ring-brand-accent"
              />
              <span className="text-sm font-medium text-brand-black">Course discussion</span>
            </label>
            <p className="text-xs text-brand-darkGrey mt-1 ml-7">
              Show or hide the discussion forum on this course page.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={course?.leaderboardEnabled ?? false}
                onChange={(e) => _updateCourseFeature('leaderboardEnabled', e.target.checked)}
                className="w-5 h-5 text-brand-accent border-brand-darkGrey rounded focus:ring-brand-accent"
              />
              <span className="text-sm font-medium text-brand-black">Course leaderboard</span>
            </label>
            <p className="text-xs text-brand-darkGrey mt-1 ml-7">
              Toggle the leaderboard block that shows top students for this course.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={course?.studyGroupsEnabled ?? false}
                onChange={(e) => _updateCourseFeature('studyGroupsEnabled', e.target.checked)}
                className="w-5 h-5 text-brand-accent border-brand-darkGrey rounded focus:ring-brand-accent"
              />
              <span className="text-sm font-medium text-brand-black">Study groups</span>
            </label>
            <p className="text-xs text-brand-darkGrey mt-1 ml-7">
              Enable or disable the study group widget for this course.
            </p>
          </div>
        </div>
      </div>

      {/* Shorts — create/manage short variants from this parent (only when not a child) */}
      {course && !course.parentCourseId && (
        <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent">
          <h2 className="text-xl font-bold text-brand-black mb-4">Shorts</h2>
          <p className="text-sm text-brand-darkGrey mb-4">
            Create short-course variants from this 30-day course. Select lessons; type is chosen by count (1–3 Essentials, 4–7 Beginner, 8–12 Foundations, 13–20 Core Skills, 21+ Full Program). New shorts start as draft; publish when ready.
          </p>
          {/* Existing shorts */}
          {shorts.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-brand-black mb-2">Existing shorts</p>
              <ul className="space-y-2">
                {shorts.map((s) => (
                  <li
                    key={s.courseId}
                    className="flex items-center justify-between py-2 px-3 bg-brand-darkGrey/10 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-brand-black">{s.name || s.courseId}</span>
                      <span className="text-sm text-brand-darkGrey ml-2">
                        {s.isDraft ? '(Draft)' : '(Published)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/${locale}/admin/courses/${s.courseId}`}
                        className="text-sm bg-brand-accent text-brand-black px-2 py-1 rounded font-bold hover:bg-brand-primary-400"
                      >
                        Edit
                      </Link>
                      {s.isDraft && (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const r = await fetch(`/api/admin/courses/${s.courseId}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ isDraft: false }),
                              });
                              if (r.ok) {
                                const list = await fetch(
                                  `/api/admin/courses?parentCourseId=${encodeURIComponent(course.courseId)}`
                                ).then((x) => x.json());
                                if (list.success) setShorts(list.courses || []);
                              }
                            } catch (e) {
                              console.error('Publish failed', e);
                            }
                          }}
                          className="text-sm bg-green-600 text-white px-2 py-1 rounded font-bold hover:bg-green-700"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Create short — when active, checkboxes appear on the 30-Day Lesson Builder cards below */}
          <div>
            <button
              type="button"
              onClick={() => setShowShortsCreate(!showShortsCreate)}
              className="flex items-center gap-2 bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400"
            >
              <Plus className="w-5 h-5" />
              {showShortsCreate ? 'Cancel' : 'Create short'}
            </button>
            {showShortsCreate && lessons.length > 0 && (
              <div className="mt-4 p-4 bg-brand-darkGrey/10 rounded-lg space-y-4">
                <p className="text-sm text-brand-black font-medium">
                  Tick the lessons you want in the short on the <strong>30-Day Lesson Builder</strong> cards below (order = Day 1..N). Then set cert question count and click Save short.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-black mb-1">Cert question count</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={shortCertCount}
                      onChange={(e) => setShortCertCount(parseInt(e.target.value, 10) || 25)}
                      className="w-24 px-2 py-1 border-2 border-brand-darkGrey rounded"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={shortSelectedIds.length === 0 || shortCreating}
                    onClick={async () => {
                      if (!course?.courseId || shortSelectedIds.length === 0) return;
                      const orderedIds = lessons
                        .filter((l) => shortSelectedIds.includes(l._id))
                        .sort((a, b) => a.dayNumber - b.dayNumber)
                        .map((l) => l._id);
                      setShortCreating(true);
                      try {
                        const r = await fetch('/api/admin/courses/fork', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            parentCourseId: course.courseId,
                            selectedLessonIds: orderedIds,
                            certQuestionCount: shortCertCount,
                          }),
                        });
                        const d = await r.json();
                        if (d.success) {
                          setShorts((prev) => [...prev, { courseId: d.course.courseId, name: d.course.name, courseVariant: d.course.courseVariant, isDraft: d.course.isDraft ?? true }]);
                          setShowShortsCreate(false);
                          setShortSelectedIds([]);
                        } else {
                          alert(d.error || 'Failed to create short');
                        }
                      } catch (e) {
                        console.error(e);
                        alert('Failed to create short');
                      } finally {
                        setShortCreating(false);
                      }
                    }}
                    className="bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 disabled:opacity-50"
                  >
                    {shortCreating ? 'Creating…' : 'Save short'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lesson Builder (read-only for short/child courses) */}
      <div className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-brand-black">
            {course.parentCourseId ? 'Short course — lessons from parent (read-only)' : '30-Day Lesson Builder'}
          </h2>
          {!course.parentCourseId && (
            <button
              onClick={() => setShowLessonForm(true)}
              className="flex items-center gap-2 bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Lesson
            </button>
          )}
        </div>
        {course.parentCourseId && (
          <>
            {/* Sync status and actions for child courses */}
            <div className="mb-4 p-4 rounded-lg border-2 border-brand-accent/50 bg-brand-accent/5">
              <p className="text-sm font-medium text-brand-black mb-2">Sync with parent</p>
              {syncStatusData ? (
                <>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-sm font-medium ${
                        syncStatusData.computedStatus === 'synced'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {syncStatusData.computedStatus === 'synced' ? (
                        <>Synced</>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          Out of sync
                        </>
                      )}
                    </span>
                    {syncStatusData.lastSyncedAt && (
                      <span className="text-sm text-brand-darkGrey">
                        Last synced: {new Date(syncStatusData.lastSyncedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {syncStatusData.missingLessonIds.length > 0 && (
                    <p className="text-sm text-amber-700 mb-2">
                      {syncStatusData.missingLessonIds.length} lesson(s) in this short no longer exist on the parent. Re-sync to remove them.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={syncActionLoading}
                      onClick={async () => {
                        if (!course?.courseId) return;
                        setSyncActionLoading(true);
                        try {
                          const r = await fetch(`/api/admin/courses/${course.courseId}/sync`, { method: 'POST' });
                          const d = await r.json();
                          if (d.success) {
                            setCourse((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    syncStatus: 'synced',
                                    lastSyncedAt: d.course?.lastSyncedAt ?? prev.lastSyncedAt,
                                    selectedLessonIds: d.course?.selectedLessonIds ?? prev.selectedLessonIds,
                                  }
                                : null
                            );
                            setSyncStatusData((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    computedStatus: 'synced',
                                    missingLessonIds: [],
                                    lastSyncedAt: d.course?.lastSyncedAt ?? prev.lastSyncedAt,
                                  }
                                : null
                            );
                            if ((d.removedLessonIds?.length ?? 0) > 0) {
                              alert(`Re-synced. ${d.removedLessonIds.length} invalid lesson reference(s) were removed.`);
                            }
                            fetchLessons(course.courseId);
                          } else {
                            alert(d.message || d.error || 'Re-sync failed');
                          }
                        } finally {
                          setSyncActionLoading(false);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-brand-accent text-brand-black font-medium hover:bg-brand-primary-400 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncActionLoading ? 'animate-spin' : ''}`} />
                      Re-sync from parent
                    </button>
                    <button
                      type="button"
                      disabled={syncActionLoading}
                      onClick={async () => {
                        if (!course?.courseId) return;
                        setSyncActionLoading(true);
                        try {
                          const r = await fetch(`/api/admin/courses/${course.courseId}/unsync`, { method: 'POST' });
                          const d = await r.json();
                          if (d.success) {
                            setCourse((prev) =>
                              prev ? { ...prev, syncStatus: 'out_of_sync' } : null
                            );
                            setSyncStatusData((prev) =>
                              prev ? { ...prev, computedStatus: 'out_of_sync' } : null
                            );
                          } else {
                            alert(d.message || d.error || 'Mark unsync failed');
                          }
                        } finally {
                          setSyncActionLoading(false);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded border-2 border-brand-darkGrey/50 text-brand-black font-medium hover:bg-brand-darkGrey/10 disabled:opacity-50"
                    >
                      Mark out of sync
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-brand-darkGrey">Loading sync status…</p>
              )}
            </div>
            <p className="text-sm text-brand-darkGrey mb-4">
              This is a short course. Lesson and quiz content are managed in the parent course. Only preview is available here.
            </p>
          </>
        )}
        {/* Lessons Grid — when Create short is on, lesson cards get a "Include in short" checkbox */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: course.parentCourseId ? lessons.length : 30 }, (_, i) => i + 1).map((day) => {
            const lesson = lessons.find((l) => l.dayNumber === day);
            const inShortSelection = !course.parentCourseId && showShortsCreate && lesson;
            return (
              <div
                key={day}
                className={`p-4 rounded-lg border-2 ${
                  lesson
                    ? 'bg-brand-accent/10 border-brand-accent'
                    : 'bg-brand-darkGrey/10 border-brand-darkGrey/30'
                } ${inShortSelection && shortSelectedIds.includes(lesson._id) ? 'ring-2 ring-brand-accent ring-offset-2' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {inShortSelection && (
                      <label className="flex items-center gap-1.5 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={shortSelectedIds.includes(lesson._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setShortSelectedIds((prev) => [...prev, lesson._id]);
                            } else {
                              setShortSelectedIds((prev) => prev.filter((id) => id !== lesson._id));
                            }
                          }}
                          className="w-4 h-4 text-brand-accent rounded"
                        />
                        <span className="text-xs font-medium text-brand-black">Short</span>
                      </label>
                    )}
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
                      {!course.parentCourseId && (
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
                      )}
                    </div>
                  </>
                ) : (
                  !course.parentCourseId && (
                    <button
                      onClick={() => {
                        setEditingLesson(day);
                        setShowLessonForm(true);
                      }}
                      className="w-full text-brand-darkGrey hover:text-brand-accent text-sm font-medium"
                    >
                      + Add Lesson
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson Form Modal (not used for child courses) */}
      {showLessonForm && courseId && !course.parentCourseId && (
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
	  lesson: LessonWithQuizConfig | null;
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

  const ensureHtmlContent = (input: string) => {
    const trimmed = (input || '').trim();
    // Heuristic: if it already contains HTML tags, return as-is
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);
    if (looksLikeHtml) return trimmed;
    // Otherwise treat as Markdown and convert to HTML
    return marked.parse(trimmed);
  };

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
          content: ensureHtmlContent(formData.content),
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
                      Number of questions users will answer
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
                      Users must pass quiz to complete lesson
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

        {/* Quiz Manager Modal (shared component; admins and editors with course access) */}
        {showQuizManager && lesson && (
          <QuizManagerModal
            courseId={courseId}
            lessonId={lesson.lessonId}
            onClose={() => setShowQuizManager(false)}
            variant="light"
          />
        )}
      </div>
    </div>
  );
}
