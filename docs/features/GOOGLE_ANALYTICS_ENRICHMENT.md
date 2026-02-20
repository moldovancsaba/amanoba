# Google Analytics Enrichment

**What:** Client-side GA4 integration with custom events for key product actions.  
**Why:** Enriched knowledge in GA for conversions, engagement, and funnel analysis.

---

## Configuration

- **Measurement ID:** Set `NEXT_PUBLIC_GA_ID` in env (e.g. `G-XXXXXXXXXX`). Fallback hardcoded ID is used if unset (see `components/GoogleAnalytics.tsx`).
- **Consent:** Consent Mode v2 is used; defaults are `denied` until the user grants consent. Events still fire (cookieless pings when denied).
- **Loader:** `GoogleAnalytics` is included in the app layout so `window.gtag` is available on client pages.

---

## Custom Events (client-side)

All events are sent via `trackGAEvent()` from `app/lib/analytics/ga-events.ts`. No-op when `window.gtag` is missing (e.g. GA not loaded or server).

| Event               | When fired | Parameters |
|---------------------|------------|------------|
| `course_enroll`     | User successfully enrolls in a course | `course_id`, `course_name?` |
| `survey_complete`   | User completes onboarding survey      | `survey_id`, `time_spent_seconds?` |
| `purchase`          | User lands on course/dashboard with `?payment_success=true` after payment | `course_id?`, `transaction_id?`, `value?`, `currency?` (course page sends `course_id`; dashboard sends minimal params) |
| `certificate_earned`| User views their own certificate page (profile certificate) and is eligible | `course_id`, `course_name` |

**Planned / optional:** `lesson_complete`, `quiz_submit` (types exist in `ga-events.ts`; not yet wired in UI).

---

## Where events are fired

- **course_enroll:** `app/[locale]/courses/[courseId]/page.tsx` — after successful enrollment API call.
- **survey_complete:** `app/[locale]/onboarding/page.tsx` — after successful survey submission.
- **purchase:**  
  - `app/[locale]/courses/[courseId]/page.tsx` — when URL has `payment_success=true` (course-specific purchase).  
  - `app/[locale]/dashboard/page.tsx` — when URL has `payment_success=true` (e.g. general premium redirect).
- **certificate_earned:** `app/[locale]/profile/[playerId]/certificate/[courseId]/page.tsx` — once when certificate data is loaded and `certificateEligible` is true (ref used to avoid duplicate).

---

## Server-side (Measurement Protocol)

Not implemented. For server-side events (e.g. email opens, backend conversions), you could add a small service that calls GA4 Measurement Protocol with a server-side API key. Client-side events remain the primary source for user-facing actions.

---

## Docs and code

- **Helper:** `app/lib/analytics/ga-events.ts` — `trackGAEvent(eventName, params)` and event type definitions.
- **Loader:** `components/GoogleAnalytics.tsx` — gtag script and Consent Mode v2 defaults.

Last updated: 2026-01-28
