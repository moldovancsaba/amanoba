/**
 * Google Analytics Component
 * 
 * What: Integrates Google Analytics (gtag.js) with Consent Mode v2
 * Why: Tracks user behavior while respecting user consent (GDPR/CCPA compliance)
 */

'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-53XPWHKJTM';

/**
 * Google Analytics Component with Consent Mode v2
 * 
 * Why: Implements Google Consent Mode to dynamically adapt cookie usage based on user consent
 * Note: Consent defaults to 'denied' until user explicitly grants consent
 */
export default function GoogleAnalytics() {
  return (
    <>
      {/* Initialize dataLayer and gtag function BEFORE loading gtag.js (beforeInteractive required for consent defaults; App Router has no _document) */}
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script id="google-analytics-init" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Set default consent state to 'denied' (required for Consent Mode v2)
          // This ensures no cookies are set until user grants consent
          gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500, // Wait up to 500ms for consent update
          });
        `}
      </Script>
      
      {/* Google tag (gtag.js) - External script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      
      {/* Google Analytics configuration */}
      <Script id="google-analytics-config" strategy="afterInteractive">
        {`
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            // Additional configuration can be added here
            // Consent will be updated by ConsentProvider when user makes choices
          });
        `}
      </Script>
    </>
  );
}
