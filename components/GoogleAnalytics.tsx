/**
 * Google Analytics Component
 * 
 * What: Integrates Google Analytics (gtag.js) into the application
 * Why: Tracks user behavior and provides analytics insights
 */

'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-53XPWHKJTM';

/**
 * Google Analytics Component
 * 
 * Why: Loads Google Analytics scripts and initializes tracking
 * Note: Uses Next.js Script component for optimal loading performance
 */
export default function GoogleAnalytics() {
  return (
    <>
      {/* Google tag (gtag.js) - External script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      {/* Google Analytics initialization script */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
