/**
 * Consent Provider
 * 
 * What: Manages user consent for cookies and analytics (GDPR/CCPA compliance)
 * Why: Required for Google Consent Mode v2 and legal compliance in EEA and other regions
 */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ConsentType = 'analytics_storage' | 'ad_storage' | 'ad_user_data' | 'ad_personalization';

export interface ConsentState {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
}

const CONSENT_STORAGE_KEY = 'amanoba_consent';
const CONSENT_VERSION = '1.0';

const defaultConsent: ConsentState = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

interface ConsentContextType {
  consent: ConsentState | null;
  hasConsent: boolean;
  updateConsent: (newConsent: Partial<ConsentState>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

/**
 * Consent Provider Component
 * 
 * Why: Manages consent state and syncs with Google Consent Mode v2
 */
export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if version matches (for future migrations)
        if (parsed.version === CONSENT_VERSION && parsed.consent) {
          setConsent(parsed.consent);
          setHasConsent(true);
          setShowBanner(false);
          // Update Google Consent Mode
          updateGoogleConsent(parsed.consent);
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load consent:', error);
    }

    // No consent found - show banner
    setConsent(defaultConsent);
    setHasConsent(false);
    setShowBanner(true);
    // Set default (denied) consent for Google
    updateGoogleConsent(defaultConsent);
  }, []);

  // Update Google Consent Mode
  const updateGoogleConsent = (consentState: ConsentState) => {
    if (typeof window === 'undefined' || !window.gtag) return;

    try {
      window.gtag('consent', 'update', {
        analytics_storage: consentState.analytics_storage,
        ad_storage: consentState.ad_storage,
        ad_user_data: consentState.ad_user_data,
        ad_personalization: consentState.ad_personalization,
      });
    } catch (error) {
      console.error('Failed to update Google consent:', error);
    }
  };

  // Update consent state
  const updateConsent = (newConsent: Partial<ConsentState>) => {
    if (!consent) return;

    const updated: ConsentState = {
      ...consent,
      ...newConsent,
    };

    setConsent(updated);
    setHasConsent(true);
    setShowBanner(false);

    // Save to localStorage
    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({
          version: CONSENT_VERSION,
          consent: updated,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error('Failed to save consent:', error);
    }

    // Update Google Consent Mode
    updateGoogleConsent(updated);
  };

  // Accept all consent
  const acceptAll = () => {
    updateConsent({
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
  };

  // Reject all consent
  const rejectAll = () => {
    updateConsent({
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  };

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasConsent,
        updateConsent,
        acceptAll,
        rejectAll,
        showBanner,
        setShowBanner,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

/**
 * Hook to use consent context
 */
export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
