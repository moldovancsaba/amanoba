/**
 * Admin Users Management Page
 * 
 * What: Manage all users in the platform
 * Why: Allows admins to view, search, and manage users
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useDebounce } from '@/app/lib/hooks/useDebounce';
import {
  Search,
  Users,
  Crown,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Player {
  _id: string;
  displayName: string;
  email?: string;
  isPremium: boolean;
  isActive: boolean;
  isAnonymous: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  lastLoginAt?: string;
}

export default function AdminPlayersPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [players, setPlayers] = useState<Player[]>([]);
  const [initialLoading, setInitialLoading] = useState(true); // Only for first load
  const [loading, setLoading] = useState(false); // For subsequent searches
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // Wait 500ms after user stops typing
  const [filters, setFilters] = useState({
    isActive: 'all',
    userType: 'all', // 'all' | 'guest' | 'user' | 'admin'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchPlayers();
  }, [debouncedSearch, filters, pagination.page]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      if (filters.isActive !== 'all') {
        params.append('isActive', filters.isActive);
      }
      if (filters.userType !== 'all') {
        params.append('userType', filters.userType);
      }
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/admin/players?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setPlayers(data.players || []);
        setPagination(data.pagination || pagination);
      }
    } catch (error) {
      console.error('Failed to fetch players:', error);
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
          <h1 className="text-3xl font-bold text-white mb-2">{t('playersManagement')}</h1>
          <p className="text-gray-400">{t('playersDescription')}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchPlayers')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={filters.userType}
          onChange={(e) => {
            setFilters({ ...filters, userType: e.target.value });
            setPagination({ ...pagination, page: 1 });
          }}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">{t('allUsers')}</option>
          <option value="guest">GUEST</option>
          <option value="user">USER</option>
          <option value="admin">ADMIN</option>
        </select>
        <select
          value={filters.isActive}
          onChange={(e) => {
            setFilters({ ...filters, isActive: e.target.value });
            setPagination({ ...pagination, page: 1 });
          }}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">{t('allStatus')}</option>
          <option value="true">{t('activeOnly')}</option>
          <option value="false">{t('inactiveOnly')}</option>
        </select>
      </div>

      {/* Players Table */}
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
                  {t('player')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {tCommon('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {tCommon('type')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {t('joined')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {t('lastLogin')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {tCommon('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {players.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    {tCommon('noDataFound')}
                  </td>
                </tr>
              ) : (
                players.map((player) => (
                  <tr key={player._id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{player.displayName}</div>
                          <div className="text-gray-400 text-xs">{player._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{player.email || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {player.isActive ? (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          {tCommon('active')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
                          <XCircle className="w-3 h-3" />
                          {tCommon('inactive')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {player.isAnonymous ? (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs font-medium">
                            GUEST
                          </span>
                        ) : player.role === 'admin' ? (
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            ADMIN
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                            USER
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">
                        {new Date(player.createdAt).toLocaleDateString('hu-HU')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm">
                        {player.lastLoginAt
                          ? new Date(player.lastLoginAt).toLocaleDateString('hu-HU')
                          : t('never')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/${locale}/profile/${player._id}`}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                      >
                        {t('viewProfile')} →
                      </Link>
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
            {t('showing')} {((pagination.page - 1) * pagination.limit) + 1} {t('to')}{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} {t('of')}{' '}
            {pagination.total} {t('users')}
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
              {t('page')} {pagination.page} {t('of')} {pagination.pages}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{t('totalUsers')}</div>
          <div className="text-2xl font-bold text-white">{pagination.total}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{t('activeUsers')}</div>
          <div className="text-2xl font-bold text-green-400">
            {players.filter((p) => p.isActive).length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Admin Users</div>
          <div className="text-2xl font-bold text-purple-400">
            {players.filter((p) => p.role === 'admin').length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{t('guestUsers')}</div>
          <div className="text-2xl font-bold text-blue-400">
            {players.filter((p) => p.isAnonymous).length}
          </div>
        </div>
      </div>
    </div>
  );
}
