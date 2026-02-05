/**
 * Admin Courses Page
 * 
 * What: Course management interface for admins
 * Why: Allows admins to view, create, edit, and manage courses
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useDebounce } from '@/app/lib/hooks/useDebounce';
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Award,
  Star,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  FileText,
  Upload,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  createdAt: string;
  updatedAt: string;
  ccsId?: string;
  pointsConfig: {
    completionPoints: number;
    lessonPoints: number;
  };
  xpConfig: {
    completionXP: number;
    lessonXP: number;
  };
}

interface CCSItem {
  _id: string;
  ccsId: string;
  name?: string;
  idea?: string;
  outline?: string;
  relatedDocuments?: Array<{ type: string; url?: string; title?: string }>;
}

type ViewMode = 'ccs' | 'flat';

function CreateCourseFamilyForm({ onCreated }: { onCreated: () => void }) {
  const [ccsId, setCcsId] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = ccsId.trim().toUpperCase().replace(/\s+/g, '_');
    if (!id || !/^[A-Z0-9_]+$/.test(id)) {
      setErr('Use only letters, numbers, underscores (e.g. PRODUCTIVITY_2026)');
      return;
    }
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/ccs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ccsId: id, name: name.trim() || id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || 'Create failed');
        return;
      }
      setCcsId('');
      setName('');
      onCreated();
    } catch {
      setErr('Request failed');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="inline-flex flex-wrap items-center gap-2">
      <input
        type="text"
        placeholder="CCS id (e.g. PRODUCTIVITY_2026)"
        value={ccsId}
        onChange={(e) => setCcsId(e.target.value)}
        className="px-3 py-2 bg-brand-black border border-brand-accent/30 rounded-lg text-brand-white placeholder-brand-white/50 text-sm focus:outline-none focus:border-brand-accent min-w-[180px]"
        aria-label="Course family id"
      />
      <input
        type="text"
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-3 py-2 bg-brand-black border border-brand-accent/30 rounded-lg text-brand-white placeholder-brand-white/50 text-sm focus:outline-none focus:border-brand-accent min-w-[140px]"
        aria-label="Course family name"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-bold text-sm hover:bg-brand-primary-400 transition-colors disabled:opacity-50"
      >
        {submitting ? '…' : 'Create course family'}
      </button>
      {err && <span className="text-brand-accent/90 text-sm w-full mt-1">{err}</span>}
    </form>
  );
}

export default function AdminCoursesPage() {
  const locale = useLocale();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('ccs');
  const [importing, setImporting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [ccsList, setCcsList] = useState<CCSItem[]>([]);
  const [ccsCourses, setCcsCourses] = useState<Record<string, Course[]>>({});
  const [expandedCcs, setExpandedCcs] = useState<Set<string>>(new Set());
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [ccsError, setCcsError] = useState<string | null>(null);
  const [editingCcsId, setEditingCcsId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; idea: string; outline: string }>({ name: '', idea: '', outline: '' });
  const [deletingCcsId, setDeletingCcsId] = useState<string | null>(null);

  const handleImportCourse = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!confirm('Import package to create a new course or update an existing one (by courseId). Continue?')) {
      event.target.value = '';
      return;
    }
    setImporting(true);
    try {
      const text = await file.text();
      const courseData = JSON.parse(text);
      const response = await fetch('/api/admin/courses/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseData, overwrite: true }),
      });
      const data = await response.json();
      if (data.success && data.course?.courseId) {
        router.push(`/${locale}/admin/courses/${data.course.courseId}`);
        return;
      }
      alert(data.error || 'Import failed');
    } catch (e) {
      console.error('Import failed', e);
      alert('Import failed. Use a .json package.');
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  const fetchCCS = useCallback(async () => {
    try {
      setLoading(true);
      setCcsError(null);
      const res = await fetch('/api/admin/ccs');
      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = res.status === 401 || res.status === 403
          ? 'Not authorised. Log in as admin.'
          : 'Could not load course families. Ensure the latest version is deployed.';
        setCcsError(msg);
        setCcsList([]);
        setCcsCourses({});
        return;
      }
      if (data.ccs?.length) {
        setCcsList(data.ccs);
        const map: Record<string, Course[]> = {};
        for (const c of data.ccs) {
          const r = await fetch(`/api/admin/ccs/${encodeURIComponent(c.ccsId)}`);
          const d = await r.json();
          if (d.success) map[c.ccsId] = d.courses || [];
        }
        setCcsCourses(map);
      } else {
        setCcsList([]);
        setCcsCourses({});
      }
    } catch (e) {
      console.error('Failed to fetch CCS', e);
      setCcsError('Could not load course families. Check the console.');
      setCcsList([]);
      setCcsCourses({});
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }

      const response = await fetch(`/api/admin/courses?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    setInitialLoading(true);
    if (viewMode === 'ccs') {
      void fetchCCS();
    } else {
      void fetchCourses();
    }
  }, [viewMode, fetchCCS, fetchCourses]);

  const toggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchCourses(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to toggle course status:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string, courseName: string) => {
    if (!confirm(`Are you sure you want to delete "${courseName}"?\n\nThis will permanently delete:\n- All lessons\n- All student progress\n- All quiz questions\n- All assessment results\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingCourseId(courseId);
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCourses(); // Refresh list
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
      alert('Failed to delete course');
    } finally {
      setDeletingCourseId(null);
    }
  };

  const toggleCcs = (id: string) => {
    setExpandedCcs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startEditCcs = (ccs: CCSItem) => {
    setEditingCcsId(ccs.ccsId);
    setEditForm({
      name: ccs.name || ccs.ccsId,
      idea: ccs.idea || '',
      outline: ccs.outline || '',
    });
  };

  const saveEditCcs = async () => {
    if (!editingCcsId) return;
    try {
      const res = await fetch(`/api/admin/ccs/${encodeURIComponent(editingCcsId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editForm.name.trim(), idea: editForm.idea.trim() || undefined, outline: editForm.outline.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Update failed');
        return;
      }
      setEditingCcsId(null);
      fetchCCS();
    } catch (e) {
      console.error(e);
      alert('Update failed');
    }
  };

  const deleteCcs = async (ccsId: string, variantCount: number) => {
    if (variantCount > 0) {
      alert(`Cannot delete: ${variantCount} course(s) are linked. Unlink or remove them first.`);
      return;
    }
    if (!confirm('Delete this course family? This cannot be undone.')) return;
    setDeletingCcsId(ccsId);
    try {
      const res = await fetch(`/api/admin/ccs/${encodeURIComponent(ccsId)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Delete failed');
        return;
      }
      setEditingCcsId(null);
      fetchCCS();
    } catch (e) {
      console.error(e);
      alert('Delete failed');
    } finally {
      setDeletingCcsId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Course Management</h1>
          <p className="text-brand-white/80">Create and manage 30-day learning courses</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <label className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${importing ? 'bg-green-700/70 text-white/90 cursor-wait pointer-events-none' : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'}`}>
            {importing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {importing ? 'Importing…' : 'Import'}
            <input
              type="file"
              accept=".json"
              className="hidden"
              disabled={importing}
              onChange={handleImportCourse}
            />
          </label>
          {importing && (
            <span className="text-sm text-brand-white/80">Importing package… You’ll be redirected when done.</span>
          )}
          <Link
            href={`/${locale}/admin/courses/new`}
            className="flex items-center gap-2 bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Course
          </Link>
        </div>
      </div>

      {/* View mode: CCS-first vs flat */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setViewMode('ccs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
            viewMode === 'ccs'
              ? 'bg-brand-accent text-brand-black'
              : 'bg-brand-darkGrey text-brand-white hover:bg-brand-secondary-700'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          By course family (CCS)
        </button>
        <button
          type="button"
          onClick={() => setViewMode('flat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
            viewMode === 'flat'
              ? 'bg-brand-accent text-brand-black'
              : 'bg-brand-darkGrey text-brand-white hover:bg-brand-secondary-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          All courses
        </button>
      </div>

      {/* Filters (flat view) */}
      {viewMode === 'flat' && (
        <div className="bg-brand-darkGrey rounded-xl p-4 border-2 border-brand-accent">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-white/50" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-brand-black border border-brand-accent/30 rounded-lg text-brand-white placeholder-brand-white/50 focus:outline-none focus:border-brand-accent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-brand-white/50" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-4 py-2 bg-brand-black border border-brand-accent/30 rounded-lg text-brand-white focus:outline-none focus:border-brand-accent"
              >
                <option value="all">All Courses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* CCS-first list */}
      {viewMode === 'ccs' && (
        <div className="relative">
          {loading && !initialLoading && (
            <div className="absolute inset-0 bg-brand-darkGrey/80 flex items-center justify-center z-10 rounded-xl">
              <div className="text-brand-white text-sm">Loading...</div>
            </div>
          )}
          {initialLoading ? (
            <div className="text-center py-12 text-brand-white">Loading course families...</div>
          ) : ccsList.length === 0 ? (
            <div className="bg-brand-darkGrey rounded-xl p-12 text-center border-2 border-brand-accent">
              <FolderOpen className="w-16 h-16 text-brand-white/30 mx-auto mb-4" />
              {ccsError ? (
                <p className="text-brand-accent/90 mb-4 font-medium">{ccsError}</p>
              ) : (
                <h3 className="text-xl font-bold text-brand-white mb-2">No course families (CCS) yet</h3>
              )}
              <p className="text-brand-white/70 mb-4">Switch to &quot;All courses&quot; or create a course family below. Course families group language variants (e.g. PRODUCTIVITY_2026_HU, PRODUCTIVITY_2026_EN).</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('flat')}
                  className="inline-flex items-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  View all courses
                </button>
                <CreateCourseFamilyForm onCreated={fetchCCS} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {ccsList.map((ccs) => {
                const variants = ccsCourses[ccs.ccsId] || [];
                const isExpanded = expandedCcs.has(ccs.ccsId);
                return (
                  <div
                    key={ccs.ccsId}
                    className="bg-brand-white rounded-xl border-2 border-brand-accent overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleCcs(ccs.ccsId)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-brand-accent/10 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-brand-black" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-brand-black" />
                        )}
                        <FileText className="w-5 h-5 text-brand-accent" />
                        <span className="font-bold text-brand-black">{ccs.name || ccs.ccsId}</span>
                        <span className="text-sm text-brand-darkGrey">({ccs.ccsId})</span>
                      </div>
                      <span className="text-sm text-brand-darkGrey">
                        {variants.length} language variant{variants.length !== 1 ? 's' : ''}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="border-t border-brand-accent/30 bg-brand-darkGrey/5 p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <button
                            type="button"
                            onClick={() => startEditCcs(ccs)}
                            className="inline-flex items-center gap-1 bg-brand-darkGrey text-brand-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-brand-secondary-700"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCcs(ccs.ccsId, variants.length)}
                            disabled={!!deletingCcsId}
                            className="inline-flex items-center gap-1 bg-red-600/80 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-600 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                        {editingCcsId === ccs.ccsId && (
                          <div className="mb-4 p-3 bg-brand-white rounded-lg border border-brand-accent/30 space-y-2">
                            <label className="block text-sm font-bold text-brand-black">Name</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                              className="w-full px-3 py-2 border border-brand-accent/30 rounded text-brand-black"
                              placeholder="Display name"
                            />
                            <label className="block text-sm font-bold text-brand-black">Idea (optional)</label>
                            <textarea
                              value={editForm.idea}
                              onChange={(e) => setEditForm((f) => ({ ...f, idea: e.target.value }))}
                              className="w-full px-3 py-2 border border-brand-accent/30 rounded text-brand-black min-h-[60px]"
                              placeholder="Course idea / markdown"
                            />
                            <label className="block text-sm font-bold text-brand-black">Outline (optional)</label>
                            <textarea
                              value={editForm.outline}
                              onChange={(e) => setEditForm((f) => ({ ...f, outline: e.target.value }))}
                              className="w-full px-3 py-2 border border-brand-accent/30 rounded text-brand-black min-h-[80px]"
                              placeholder="30-day outline / markdown"
                            />
                            <div className="flex gap-2">
                              <button type="button" onClick={saveEditCcs} className="px-4 py-2 bg-brand-accent text-brand-black rounded-lg font-bold text-sm">Save</button>
                              <button type="button" onClick={() => setEditingCcsId(null)} className="px-4 py-2 bg-brand-darkGrey text-brand-white rounded-lg font-bold text-sm">Cancel</button>
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-brand-darkGrey mb-2">Language variants — click to edit course</p>
                        <div className="mb-3">
                          <Link
                            href={`/${locale}/admin/courses/new?ccsId=${encodeURIComponent(ccs.ccsId)}`}
                            className="inline-flex items-center gap-2 bg-brand-accent text-brand-black px-3 py-2 rounded-lg font-bold hover:bg-brand-primary-400 text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Create language variant
                          </Link>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {variants.length === 0 ? (
                            <span className="text-brand-darkGrey text-sm">No courses linked to this CCS yet (set course.ccsId when creating/editing).</span>
                          ) : (
                            variants.map((c) => (
                              <Link
                                key={c.courseId}
                                href={`/${locale}/admin/courses/${c.courseId}`}
                                className="inline-flex items-center gap-2 bg-brand-accent text-brand-black px-3 py-2 rounded-lg font-bold hover:bg-brand-primary-400 text-sm"
                              >
                                <Edit className="w-4 h-4" />
                                {c.name || c.courseId} ({c.language})
                              </Link>
                            ))
                          )}
                        </div>
                        {ccs.relatedDocuments && ccs.relatedDocuments.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-brand-darkGrey/20">
                            <p className="text-sm text-brand-darkGrey mb-1">Related documents</p>
                            <ul className="text-sm text-brand-black list-disc list-inside">
                              {ccs.relatedDocuments.map((doc, i) => (
                                <li key={i}>
                                  {doc.title || doc.type}
                                  {doc.url && (
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-brand-accent hover:underline">
                                      Link
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Flat courses list */}
      {viewMode === 'flat' && (
      <div className="relative">
        {loading && !initialLoading && (
          <div className="absolute inset-0 bg-brand-darkGrey/80 flex items-center justify-center z-10 rounded-xl">
            <div className="text-brand-white text-sm">Searching...</div>
          </div>
        )}
        {initialLoading ? (
          <div className="text-center py-12">
            <div className="text-brand-white text-lg">Loading courses...</div>
          </div>
        ) : courses.length === 0 ? (
        <div className="bg-brand-darkGrey rounded-xl p-12 text-center border-2 border-brand-accent">
          <BookOpen className="w-16 h-16 text-brand-white/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-brand-white mb-2">No courses found</h3>
          <p className="text-brand-white/70 mb-6">Get started by creating your first course</p>
          <Link
            href={`/${locale}/admin/courses/new`}
            className="inline-flex items-center gap-2 bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-brand-white rounded-xl p-6 border-2 border-brand-accent hover:shadow-lg transition-all"
            >
              {/* Course Thumbnail */}
              {course.thumbnail && (
                <div className="relative w-full h-40 bg-brand-darkGrey rounded-lg mb-4 overflow-hidden">
                  <Image
                    src={course.thumbnail}
                    alt={course.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 20rem"
                  />
                </div>
              )}
              
              {/* Course Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-brand-black">{course.name}</h3>
                    {course.isActive ? (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Active</span>
                    ) : (
                      <span className="bg-brand-darkGrey text-brand-white text-xs px-2 py-1 rounded">Draft</span>
                    )}
                  </div>
                  <p className="text-brand-darkGrey text-sm line-clamp-2">{course.description}</p>
                </div>
              </div>

              {/* Course Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-brand-darkGrey">
                  <Calendar className="w-4 h-4" />
                  <span>{course.durationDays} days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-darkGrey">
                  <Award className="w-4 h-4" />
                  <span>{course.pointsConfig.completionPoints} points</span>
                </div>
                {course.requiresPremium && (
                  <div className="text-xs text-brand-accent font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" />
                    Premium
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-brand-darkGrey/20">
                <Link
                  href={`/${locale}/admin/courses/${course.courseId}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-accent text-brand-black px-3 py-2 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => toggleCourseStatus(course.courseId, course.isActive)}
                  className="p-2 bg-brand-darkGrey text-brand-white rounded-lg hover:bg-brand-secondary-700 transition-colors"
                  title={course.isActive ? 'Deactivate' : 'Activate'}
                  disabled={deletingCourseId === course.courseId}
                >
                  {course.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.courseId, course.name)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete course"
                  disabled={deletingCourseId === course.courseId}
                >
                  {deletingCourseId === course.courseId ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
      )}
    </div>
  );
}
