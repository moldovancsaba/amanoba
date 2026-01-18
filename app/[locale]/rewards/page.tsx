'use client';

/**
 * Rewards Page
 * 
 * Why: Display rewards store with beautiful UI instead of raw JSON
 * What: Shows available rewards for redemption with points balance
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Gift, ChevronLeft, Sparkles, ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { LocaleLink } from '@/components/LocaleLink';

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  pointsCost: number;
  type?: string;
  isActive: boolean;
  stock?: number;
  premiumOnly?: boolean;
}


export default function RewardsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('rewards');
  const tCommon = useTranslations('common');
  const tDashboard = useTranslations('dashboard');
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push(`/${locale}/auth/signin`);
      return;
    }

    const fetchData = async () => {
      try {
        const user = session.user as { id?: string; playerId?: string };
        const playerId = user.playerId || user.id;
        
        // Fetch rewards
        const rewardsResponse = await fetch('/api/rewards');
        if (!rewardsResponse.ok) {
          throw new Error('Failed to load rewards');
        }
        const rewardsData = await rewardsResponse.json();
        setRewards(rewardsData.rewards || []);
        
        // Fetch player data for points
        const playerResponse = await fetch(`/api/players/${playerId}`);
        if (!playerResponse.ok) {
          throw new Error('Failed to load player data');
        }
        const playerData = await playerResponse.json();
        setPlayerPoints(playerData.wallet?.currentBalance || 0);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router, locale]);

  const handleRedeem = async (rewardId: string, pointsCost: number) => {
    if (playerPoints < pointsCost) {
      return;
    }
    
    setRedeeming(rewardId);
    setRedeemSuccess(null);
    
    try {
      const user = session!.user as { id?: string; playerId?: string };
      const playerId = user.playerId || user.id;
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          rewardId,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to redeem reward');
      }
      
      const data = await response.json();
      setPlayerPoints(data.newBalance);
      setRedeemSuccess(rewardId);
      
      setTimeout(() => setRedeemSuccess(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to redeem reward');
    } finally {
      setRedeeming(null);
    }
  };

  // Loading state
  if (loading || status === 'loading') {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-brand-white text-2xl">{tCommon('loading')}</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-shell flex items-center justify-center p-4">
        <div className="page-card p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-brand-black mb-4">{t('unableToLoad')}</h2>
          <p className="text-brand-darkGrey mb-6">{error}</p>
          <LocaleLink
            href="/dashboard"
            className="page-button-primary inline-block"
          >
            {tDashboard('backToDashboard')}
          </LocaleLink>
        </div>
      </div>
    );
  }

  const categories = ['all', ...new Set(rewards.map(r => r.category))];
  const filteredRewards = filterCategory === 'all'
    ? rewards.filter(r => r.isActive)
    : rewards.filter(r => r.isActive && r.category === filterCategory);

  return (
    <div className="page-shell">
      {/* Header */}
      <header className="page-header">
        <div className="page-container py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-brand-white flex items-center gap-3">
                <Gift className="w-10 h-10" />
                {t('storeTitle')}
              </h1>
              <p className="text-brand-white/80 mt-1">{t('storeDescription')}</p>
            </div>
            <LocaleLink
              href="/dashboard"
              className="page-button-secondary border-2 border-brand-accent flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              {tCommon('dashboard')}
            </LocaleLink>
          </div>
        </div>
      </header>

      <main className="page-container py-8">
        {/* Points Balance */}
        <div className="page-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-brand-black mb-1">{t('yourBalance')}</h2>
              <p className="text-brand-darkGrey">{t('balanceDescription')}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-brand-black">
                {playerPoints.toLocaleString()}
              </div>
              <div className="text-brand-darkGrey flex items-center gap-2 justify-end">
                <span className="text-2xl">💎</span>
                <span>{tCommon('points')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="page-card p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize border-2 ${
                  filterCategory === category
                    ? 'bg-brand-accent text-brand-black border-brand-accent shadow-md'
                    : 'bg-brand-white text-brand-darkGrey border-brand-darkGrey/20 hover:border-brand-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Rewards Grid */}
        {filteredRewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map(reward => {
              const canAfford = playerPoints >= reward.pointsCost;
              const isRedeeming = redeeming === reward.id;
              const wasRedeemed = redeemSuccess === reward.id;

              return (
                <div
                  key={reward.id}
                  className={`page-card p-6 relative overflow-hidden transition-all ${
                    canAfford ? 'border-2 border-brand-accent' : 'border-2 border-brand-darkGrey/30 opacity-75'
                  }`}
                >
                  {reward.premiumOnly && (
                    <div className="absolute top-0 left-0 bg-yellow-400 text-black px-3 py-1 rounded-br-lg font-bold text-xs">
                      ⭐ {tCommon('premium')}
                    </div>
                  )}
                  
                  {wasRedeemed && (
                    <div className="absolute top-0 right-0 bg-brand-accent text-brand-black px-3 py-1 rounded-bl-lg font-bold text-sm animate-pulse">
                      <Check className="w-4 h-4 inline mr-1" />
                      {t('redeemed')}!
                    </div>
                  )}
                  
                  <div className="text-6xl mb-4 text-center">{reward.icon}</div>
                  
                  {reward.type && (
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                      {reward.type.toUpperCase()}
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-brand-black mb-2">
                    {reward.name}
                  </h3>
                  <p className="text-brand-darkGrey text-sm mb-4">
                    {reward.description}
                  </p>
                  
                  {reward.stock !== undefined && reward.stock > 0 && (
                    <div className="text-xs text-brand-darkGrey font-medium mb-3">
                      <AlertCircle className="w-3 h-3 inline mr-1" />
                      {t('stockLeft', { count: reward.stock })}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-brand-accent">
                      💎 {reward.pointsCost.toLocaleString()}
                    </span>
                    <span className="text-sm text-brand-darkGrey capitalize">
                      {reward.category}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleRedeem(reward.id, reward.pointsCost)}
                    disabled={!canAfford || isRedeeming || wasRedeemed}
                    className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                      canAfford && !wasRedeemed
                        ? 'bg-brand-accent text-brand-black hover:bg-brand-primary-400 transform hover:scale-105'
                        : 'bg-brand-darkGrey/20 text-brand-darkGrey cursor-not-allowed'
                    }`}
                  >
                    {isRedeeming ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('redeeming')}
                      </>
                    ) : wasRedeemed ? (
                      <>
                        <Check className="w-5 h-5" />
                        {t('redeemed')}!
                      </>
                    ) : !canAfford ? (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        {t('insufficientPoints')}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        {t('redeemNow')}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="page-card p-12 text-center">
            <Sparkles className="w-16 h-16 text-brand-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-brand-black mb-2">
              {t('noRewardsAvailable')}
            </h3>
            <p className="text-brand-darkGrey">
              {filterCategory === 'all'
                ? t('checkBackLater')
                : t('tryDifferentCategory')}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
