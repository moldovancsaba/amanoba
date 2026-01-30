/**
 * Admin Rewards Management Page
 * 
 * What: Manage all rewards in the platform
 * Why: Allows admins to view, create, edit, and configure rewards
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Gift,
} from 'lucide-react';

interface Reward {
  _id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  pointsCost: number;
  stock: {
    isLimited: boolean;
    currentStock?: number;
    maxStock?: number;
  };
  availability: {
    isActive: boolean;
    premiumOnly: boolean;
  };
  media: {
    imageUrl?: string;
    iconEmoji?: string;
  };
  metadata: {
    totalRedemptions: number;
  };
}

export default function AdminRewardsPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/rewards?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setRewards(data.rewards || []);
      }
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, search]);

  useEffect(() => {
    void fetchRewards();
  }, [fetchRewards]);

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
          <h1 className="text-3xl font-bold text-white mb-2">{t('rewardsManagement')}</h1>
          <p className="text-gray-400">{t('rewardsDescription')}</p>
        </div>
        <Link
          href={`/${locale}/admin/rewards/new`}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('addReward')}
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchRewards')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">{t('allCategories')}</option>
          <option value="game_unlock">Game Unlock</option>
          <option value="cosmetic">Cosmetic</option>
          <option value="boost">Boost</option>
          <option value="physical">Physical</option>
          <option value="discount">Discount</option>
          <option value="virtual_item">Virtual Item</option>
        </select>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-400">
            {tCommon('noDataFound')}
          </div>
        ) : (
          rewards.map((reward) => (
            <div
              key={reward._id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {reward.media.iconEmoji ? (
                    <div className="text-4xl">{reward.media.iconEmoji}</div>
                  ) : reward.media.imageUrl ? (
                    <img
                      src={reward.media.imageUrl}
                      alt={reward.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-bold text-lg">{reward.name}</h3>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs capitalize">
                      {reward.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                {reward.availability.premiumOnly && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                    Premium
                  </span>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-4">{reward.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{t('cost')}:</span>
                  <span className="text-white font-bold">{reward.pointsCost} pont</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{tCommon('type')}:</span>
                  <span className="text-white capitalize">{reward.type}</span>
                </div>
                {reward.stock.isLimited && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{t('stock')}:</span>
                    <span className="text-white">
                      {reward.stock.currentStock || 0} / {reward.stock.maxStock || 0}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{t('redemptions')}:</span>
                  <span className="text-white">{reward.metadata.totalRedemptions}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-700">
                <Link
                  href={`/${locale}/admin/rewards/${reward._id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  {tCommon('edit')}
                </Link>
                <button
                  className="p-2 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors"
                  title={tCommon('delete')}
                >
                  <Trash2 className="w-4 h-4 text-gray-300" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{t('totalRewards')}</div>
          <div className="text-2xl font-bold text-white">{rewards.length}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{tCommon('active')}</div>
          <div className="text-2xl font-bold text-green-400">
            {rewards.filter((r) => r.availability.isActive).length}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{t('totalRedemptions')}</div>
          <div className="text-2xl font-bold text-yellow-400">
            {rewards.reduce((sum, r) => sum + r.metadata.totalRedemptions, 0)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">{t('premiumOnly')}</div>
          <div className="text-2xl font-bold text-blue-400">
            {rewards.filter((r) => r.availability.premiumOnly).length}
          </div>
        </div>
      </div>
    </div>
  );
}
