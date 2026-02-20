# P2 Onboarding Survey & Email Automation — Status

**Date**: 2026-01-28  
**Source**: ROADMAP § Onboarding Survey & Segmentation, Email Automation Enhancement  
**Purpose**: Single place for what is delivered and what is next for P2 (Onboarding Survey, Email Automation, Multi-Format Forking).

---

## Delivered

### Onboarding Survey & Segmentation

| Component | Status | Location |
|-----------|--------|----------|
| Survey model | ✅ | `app/lib/models/survey.ts` |
| SurveyResponse model | ✅ | `app/lib/models/survey-response.ts` |
| GET/POST /api/surveys/onboarding | ✅ | `app/api/surveys/onboarding/route.ts` |
| Onboarding survey page | ✅ | `app/[locale]/onboarding/page.tsx` |
| Player fields: surveyCompleted, skillLevel, interests | ✅ | `app/lib/models/player.ts` |
| Course recommendation engine | ✅ | `app/lib/course-recommendations.ts` |
| GET /api/courses/recommendations | ✅ | `app/api/courses/recommendations/route.ts` |
| Dashboard recommendations widget | ✅ | `app/[locale]/dashboard/page.tsx` (calls API when featureFlags.courses) |
| Default survey seed | ✅ | `scripts/seed-onboarding-survey.ts` (npm run seed:survey) |
| Admin survey analytics | ✅ | `app/[locale]/admin/surveys/page.tsx`, GET/PATCH /api/admin/surveys |

**Deployment**: Ensure default brand exists (slug `amanoba`); run `npm run seed:survey` (or equivalent) to create/update onboarding survey. See `docs/core/ENVIRONMENT_SETUP.md` / `docs/deployment/DEPLOYMENT.md` for order of seeds.

### Email Automation (Phase 1)

| Component | Status | Location |
|-----------|--------|----------|
| Completion email upsell (recommended courses) | ✅ | `app/lib/email/email-service.ts` — `sendCompletionEmail` uses `getCourseRecommendations` |
| Course recommendations shared logic | ✅ | `app/lib/course-recommendations.ts` (used by API and email) |
| Segment-specific completion email (beginner/intermediate/advanced) | ✅ | `email-localization.ts` — optional segment param; upsell intro line by segment (EN); `sendCompletionEmail` passes `player.skillLevel` |
| Email open tracking | ✅ | `app/api/email/open/[messageId]` — 1x1 pixel; `EmailActivity.openedAt` |
| Email click tracking | ✅ | `app/api/email/click/[messageId]?url=` — redirect + `EmailActivity.clickedAt`, `clickCount` |
| EmailActivity model | ✅ | `app/lib/models/email-activity.ts` — messageId, playerId, brandId, emailType, segment, sentAt, openedAt, clickedAt, clickCount |
| Completion email: inject tracking + save activity | ✅ | `sendCompletionEmail` generates messageId, injects pixel and click-wrapped links, saves EmailActivity after send |
| Admin email analytics | ✅ | `GET /api/admin/email-analytics`, `app/[locale]/admin/email-analytics/page.tsx` — summary + by type + by segment (7/30/90 days) |

### Multi-Format Course Forking

| Component | Status | Location |
|-----------|--------|----------|
| Create short (fork) from parent course | ✅ | `POST /api/admin/courses/fork`, admin course editor Shorts |
| Child course editor (read-only lessons) | ✅ | `app/[locale]/admin/courses/[courseId]/page.tsx` |
| Day/progress/certificate for child courses | ✅ | See RELEASE_NOTES v2.9.24 |

---

## Next (priority order)

1. **Email Automation (optional follow-up)**
   - Extend tracking to lesson, reminder, welcome, payment emails (same pattern: messageId, pixel, click wrap, EmailActivity).
   - Optional: `emailSegment` on Player (auto from progress) and template selection by segment for other email types.

2. **Onboarding Survey (operational)**
   - Ensure production has default brand and onboarding survey seeded (`npm run seed:survey`).
   - Optional: prompt new users to complete survey from dashboard if `!surveyCompleted`.

3. **Minimal test harness** (ROADMAP P2 item 6)
   - `npm test`, smoke tests for dashboard, courses, critical APIs.

---

## References

- **ROADMAP**: `docs/product/ROADMAP.md` § Onboarding Survey & Segmentation, Email Automation Enhancement.
- **TASKLIST**: `docs/product/TASKLIST.md` — Recommended next: Onboarding Survey / Email Automation / Multi-Format Forking.
- **Multi-Format Forking**: `/Users/moldovancsaba/Projects/amanoba_courses/process_them/docs/_archive/delivery/2026-01/2026-01-27_RAPID_CHILDREN_COURSES_DELIVERY_PLAN.md`, RELEASE_NOTES v2.9.24.
