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
import {
  Search,
  Users,
  Crown,
  Ban,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react';

interface Player {
  _id: string;
  displayName: string;
  email?: string;
  isPremium: boolean;
  isActive: boolean;
  isAnonymous: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export default function AdminPlayersPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    isPremium: 'all',
    isActive: 'all',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchPlayers();
  }, [search, filters, pagination.page]);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) {
        params.append('search', search);
      }
      if (filters.isPremium !== 'all') {
        params.append('isPremium', filters.isPremium);
      }
      if (filters.isActive !== 'all') {
        params.append('isActive', filters.isActive);
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
    }
  };

  if (loading) {
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
          value={filters.isPremium}
          onChange={(e) => {
            setFilters({ ...filters, isPremium: e.target.value });
            setPagination({ ...pagination, page: 1 });
          }}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">{t('allPlayers')}</option>
          <option value="true">{t('premiumOnly')}</option>
          <option value="false">{t('freeOnly')}</option>
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
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
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
                        {player.isPremium && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            {tCommon('premium')}
                          </span>
                        )}
                        {player.isAnonymous && (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
                            Vendég
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
          <div className="text-gray-400 text-sm mb-1">{t('premiumUsers')}</div>
          <div className="text-2xl font-bold text-yellow-400">
            {players.filter((p) => p.isPremium).length}
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
