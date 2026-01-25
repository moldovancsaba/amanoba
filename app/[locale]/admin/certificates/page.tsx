/**
 * Admin Certificates Management Page
 * 
 * What: Manage all certificates in the platform
 * Why: Allows admins to view, search, filter, and manage certificates
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useDebounce } from '@/app/lib/hooks/useDebounce';
import {
  Search,
  Award,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  RotateCcw,
} from 'lucide-react';

interface Certificate {
  _id: string;
  certificateId: string;
  recipientName: string;
  courseId: string;
  courseTitle: string;
  playerId: string;
  verificationSlug: string;
  issuedAtISO: string;
  finalExamScorePercentInteger?: number;
  isRevoked?: boolean;
  revokedAtISO?: string;
  revokedReason?: string;
  isPublic?: boolean;
  locale: 'en' | 'hu';
  createdAt: string;
}

export default function AdminCertificatesPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [initialLoading, setInitialLoading] = useState(true); // Only for first load
  const [loading, setLoading] = useState(false); // For subsequent searches
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // Wait 500ms after user stops typing
  const [filters, setFilters] = useState({
    status: 'all', // 'all' | 'active' | 'revoked'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchCertificates();
  }, [debouncedSearch, filters, pagination.page]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/admin/certificates?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCertificates(data.certificates || []);
        setPagination(data.pagination || pagination);
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // Only show full-page loader on initial load
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl">{tCommon('loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Certificates Management</h1>
          <p className="text-gray-400">View, search, and manage all certificates</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search certificates by ID, name, course, or slug..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => {
            setFilters({ ...filters, status: e.target.value });
            setPagination({ ...pagination, page: 1 });
          }}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="revoked">Revoked Only</option>
        </select>
      </div>

      {/* Certificates Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center z-10 rounded-xl">
            <div className="text-white text-sm">Searching...</div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Certificate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {tCommon('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Issued
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {tCommon('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {certificates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    {tCommon('noDataFound')}
                  </td>
                </tr>
              ) : (
                certificates.map((cert) => (
                  <tr key={cert._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{cert.certificateId}</div>
                          <div className="text-gray-400 text-xs">{cert.verificationSlug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{cert.recipientName}</div>
                        <div className="text-gray-400 text-xs">{cert.playerId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{cert.courseTitle}</div>
                        <div className="text-gray-400 text-xs">{cert.courseId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {cert.finalExamScorePercentInteger !== undefined ? (
                        <span className="text-white font-medium">
                          {cert.finalExamScorePercentInteger}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {cert.isRevoked ? (
                        <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                          <XCircle className="w-3 h-3" />
                          Revoked
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">
                        {new Date(cert.issuedAtISO).toLocaleDateString('hu-HU', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${locale}/certificate/${cert.verificationSlug}`}
                          target="_blank"
                          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} certificates
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tCommon('previous')}
            </button>
            <span className="text-gray-400 text-sm">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.pages}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tCommon('next')}
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Total Certificates</div>
          <div className="text-2xl font-bold text-white">{pagination.total}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Active Certificates</div>
          <div className="text-2xl font-bold text-green-400">
            {certificates.filter((c) => !c.isRevoked).length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Revoked Certificates</div>
          <div className="text-2xl font-bold text-red-400">
            {certificates.filter((c) => c.isRevoked).length}
          </div>
        </div>
      </div>
    </div>
  );
}
