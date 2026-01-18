/**
 * Admin Courses Page
 * 
 * What: Course management interface for admins
 * Why: Allows admins to view, create, edit, and manage courses
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
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
  Users,
  Award,
} from 'lucide-react';

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
  pointsConfig: {
    completionPoints: number;
    lessonPoints: number;
  };
  xpConfig: {
    completionXP: number;
    lessonXP: number;
  };
}

export default function AdminCoursesPage() {
  const locale = useLocale();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Fetch courses
  useEffect(() => {
    fetchCourses();
  }, [statusFilter, search]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (search) {
        params.append('search', search);
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
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Course Management</h1>
          <p className="text-gray-400">Create and manage 30-day learning courses</p>
        </div>
        <Link
          href={`/${locale}/admin/courses/new`}
          className="flex items-center gap-2 bg-brand-accent text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-brand-primary-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Course
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-brand-darkGrey rounded-xl p-4 border-2 border-brand-accent">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
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

          {/* Status Filter */}
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

      {/* Courses List */}
      {loading ? (
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
                    <Icon icon={MdStar} size={14} />
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
  );
}
