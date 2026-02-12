/**
 * Cookie Consent Banner
 * 
 * What: Displays cookie consent banner for GDPR/CCPA compliance
 * Why: Required for legal compliance and Google Consent Mode v2
 */

'use client';

import { useConsent } from '@/app/components/providers/ConsentProvider';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

/**
 * Cookie Consent Banner Component
 * 
 * Why: Allows users to manage their cookie preferences
 */
export default function CookieConsentBanner() {
  const { showBanner, acceptAll, rejectAll, updateConsent, consent } = useConsent();
  const t = useTranslations('consent');
  const [showDetails, setShowDetails] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showBanner || !consent) return;
    const banner = bannerRef.current;
    if (!banner) return;

    const updateSpacing = () => {
      const height = banner.getBoundingClientRect().height;
      document.body.style.setProperty('--consent-banner-height', `${height}px`);
      document.body.classList.add('consent-banner-open');
    };

    updateSpacing();
    const observer = new ResizeObserver(updateSpacing);
    observer.observe(banner);

    return () => {
      observer.disconnect();
      document.body.style.removeProperty('--consent-banner-height');
      document.body.classList.remove('consent-banner-open');
    };
  }, [showBanner, consent, showDetails]);

  if (!showBanner || !consent) {
    return null;
  }

  return (
    <div
      ref={bannerRef}
      className="sticky bottom-0 left-0 right-0 z-50 bg-brand-white dark:bg-brand-black border-t border-brand-gray-200 dark:border-brand-gray-800 shadow-lg sm:fixed"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {/* Main message */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-brand-black dark:text-brand-white mb-2">
              {t('title')}
            </h3>
            <p className="text-sm text-brand-gray-700 dark:text-brand-gray-300">
              {t('description')}
            </p>
          </div>

          {/* Details section */}
          {showDetails && (
            <div className="mt-4 space-y-3 text-sm text-brand-gray-600 dark:text-brand-gray-400">
              <div>
                <h4 className="font-medium text-brand-black dark:text-brand-white mb-1">
                  {t('analytics.title')}
                </h4>
                <p>{t('analytics.description')}</p>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={consent.analytics_storage === 'granted'}
                    onChange={(e) =>
                      updateConsent({
                        analytics_storage: e.target.checked ? 'granted' : 'denied',
                      })
                    }
                    className="rounded border-brand-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span>{t('analytics.label')}</span>
                </label>
              </div>

              <div>
                <h4 className="font-medium text-brand-black dark:text-brand-white mb-1">
                  {t('advertising.title')}
                </h4>
                <p>{t('advertising.description')}</p>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={consent.ad_storage === 'granted'}
                      onChange={(e) =>
                        updateConsent({
                          ad_storage: e.target.checked ? 'granted' : 'denied',
                        })
                      }
                      className="rounded border-brand-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <span>{t('advertising.storageLabel')}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={consent.ad_user_data === 'granted'}
                      onChange={(e) =>
                        updateConsent({
                          ad_user_data: e.target.checked ? 'granted' : 'denied',
                        })
                      }
                      className="rounded border-brand-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <span>{t('advertising.userDataLabel')}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={consent.ad_personalization === 'granted'}
                      onChange={(e) =>
                        updateConsent({
                          ad_personalization: e.target.checked ? 'granted' : 'denied',
                        })
                      }
                      className="rounded border-brand-gray-300 text-brand-primary focus:ring-brand-primary"
                    />
                    <span>{t('advertising.personalizationLabel')}</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300 hover:text-brand-black dark:hover:text-brand-white transition-colors"
            >
              {showDetails ? t('hideDetails') : t('showDetails')}
            </button>
            <div className="flex gap-2 sm:ml-auto">
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-sm font-medium text-brand-gray-700 dark:text-brand-gray-300 bg-brand-gray-100 dark:bg-brand-gray-800 rounded-lg hover:bg-brand-gray-200 dark:hover:bg-brand-gray-700 transition-colors"
              >
                {t('rejectAll')}
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm font-medium text-brand-white bg-brand-primary hover:bg-brand-primary-dark rounded-lg transition-colors"
              >
                {t('acceptAll')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
