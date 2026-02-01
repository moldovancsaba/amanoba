/**
 * Google Analytics custom events (client-side)
 *
 * What: Helper to send GA4 events from the app when consent is granted
 * Why: Enriches GA with course enrollments, survey completion, purchases, certificates
 *
 * Use: Call trackGAEvent from client components after key actions.
 * Consent: gtag Consent Mode v2 controls whether cookies/storage are used; events still fire (cookieless pings when denied).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type GAEventName =
  | 'course_enroll'
  | 'survey_complete'
  | 'purchase'
  | 'certificate_earned'
  | 'certificate_viewed'
  | 'lesson_complete'
  | 'quiz_submit';

export type GAEventParams = {
  course_enroll: { course_id: string; course_name?: string };
  survey_complete: { survey_id: string; time_spent_seconds?: number };
  purchase: { transaction_id?: string; value?: number; currency?: string; course_id?: string };
  certificate_earned: { course_id: string; course_name?: string };
  certificate_viewed: { course_id: string; course_name?: string; template_variant_id?: string };
  lesson_complete: { course_id: string; day_number: number };
  quiz_submit: { course_id: string; lesson_id?: string; score?: number };
};

/**
 * Send a custom event to Google Analytics (client-side only).
 * No-op if gtag is not available (e.g. GA not loaded or server).
 */
export function trackGAEvent<E extends GAEventName>(
  eventName: E,
  params: GAEventParams[E]
): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  try {
    window.gtag('event', eventName, params);
  } catch {
    // ignore
  }
}
