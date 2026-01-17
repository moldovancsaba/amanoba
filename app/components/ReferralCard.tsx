'use client';

/**
 * Referral Card Component
 * 
 * Shows referral code, share link, stats, and referred friends list
 * Allows easy sharing and tracking of referral rewards
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

interface ReferralData {
  referralCode: string;
  shareUrl: string;
  stats: {
    totalReferrals: number;
    pendingRewards: number;
    completedRewards: number;
    totalPointsEarned: number;
  };
  referrals: Array<{
    id: string;
    referredPlayer: {
      displayName: string;
      joinedAt: string;
    };
    status: string;
    rewardDetails?: {
      pointsEarned: number;
    };
    completedAt?: string;
  }>;
}

export function ReferralCard() {
  const { data: session } = useSession();
  const t = useTranslations('referral');
  const tCommon = useTranslations('common');
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!session?.user?.id) return;

      try {
        const playerId = (session.user as { id: string }).id;
        const response = await fetch(`/api/referrals?playerId=${playerId}`);
        
        if (response.ok) {
          const data = await response.json();
          setReferralData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [session]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaWhatsApp = () => {
    if (!referralData) return;
    const message = encodeURIComponent(
      `${t('shareMessage')}: ${referralData.referralCode}\n\n${referralData.shareUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareViaEmail = () => {
    if (!referralData) return;
    const subject = encodeURIComponent(`${tCommon('appName')} - ${t('inviteFriends')}`);
    const body = encodeURIComponent(
      `${t('emailBody')}\n\n${t('shareMessage')}: ${referralData.referralCode}\n${referralData.shareUrl}\n`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="bg-brand-white rounded-xl shadow-lg p-6 border-2 border-brand-accent">
        <div className="animate-pulse">
          <div className="h-6 bg-brand-darkGrey/20 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-brand-darkGrey/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!referralData) {
    return null;
  }

  return (
    <div className="bg-brand-white rounded-xl shadow-lg p-6 border-2 border-brand-accent">
      <h3 className="text-xl font-bold text-brand-black mb-4 flex items-center gap-2">
        <span>🎁</span>
        {t('inviteFriends')}
      </h3>

      {/* Referral Code Display */}
      <div className="bg-brand-darkGrey/10 rounded-lg p-4 mb-4">
        <p className="text-sm text-brand-darkGrey mb-2">{t('yourReferralCode')}</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-2xl font-bold text-brand-accent tracking-wider">
            {referralData.referralCode}
          </code>
          <button
            onClick={() => copyToClipboard(referralData.referralCode)}
            className="px-4 py-2 bg-brand-accent text-brand-black rounded-lg hover:bg-brand-primary-400 transition-colors text-sm font-medium font-bold"
          >
            {copied ? '✓ ' + tCommon('copied') : t('copy')}
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => copyToClipboard(referralData.shareUrl)}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-darkGrey hover:bg-brand-secondary-700 rounded-lg transition-colors font-medium text-brand-white font-bold"
        >
          <span>🔗</span>
          {t('copyLink')}
        </button>
        <button
          onClick={shareViaWhatsApp}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium font-bold"
        >
          <span>📱</span>
          WhatsApp
        </button>
        <button
          onClick={shareViaEmail}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium font-bold"
        >
          <span>✉️</span>
          Email
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: tCommon('appName'),
                text: `${t('shareMessage')}: ${referralData.referralCode}`,
                url: referralData.shareUrl,
              });
            }
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-accent hover:bg-brand-primary-400 text-brand-black rounded-lg transition-colors font-medium font-bold"
        >
          <span>📤</span>
          {t('share')}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-brand-darkGrey/10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-brand-accent">
            {referralData.stats.totalReferrals}
          </div>
          <div className="text-xs text-brand-darkGrey">{t('friendsInvited')}</div>
        </div>
        <div className="bg-brand-darkGrey/10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-brand-accent">
            {referralData.stats.totalPointsEarned}
          </div>
          <div className="text-xs text-brand-darkGrey">{t('pointsEarned')}</div>
        </div>
      </div>

      {/* Referred Friends List */}
      {referralData.referrals.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-brand-black mb-2">
            {t('referredFriends')} ({referralData.referrals.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {referralData.referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-3 bg-brand-darkGrey/10 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-brand-black font-bold">
                    {referral.referredPlayer.displayName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-brand-black text-sm">
                      {referral.referredPlayer.displayName}
                    </div>
                    <div className="text-xs text-brand-darkGrey">
                      {new Date(referral.referredPlayer.joinedAt).toLocaleDateString('hu-HU')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {referral.status === 'completed' ? (
                    <div className="text-green-600 text-sm font-medium">
                      +{referral.rewardDetails?.pointsEarned || 0} {tCommon('points')}
                    </div>
                  ) : (
                    <div className="text-yellow-600 text-xs">
                      {t('pending')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How it Works */}
      {referralData.referrals.length === 0 && (
        <div className="bg-brand-darkGrey/10 rounded-lg p-4 text-sm text-brand-black">
          <p className="font-semibold mb-2">🎯 {t('howItWorks')}</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>{t('step1')}</li>
            <li>{t('step2')}</li>
            <li>{t('step3')}</li>
          </ol>
        </div>
      )}
    </div>
  );
}
