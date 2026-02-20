# Handover: Open Tasks and How to Deliver Them

**Date**: 2026-01-28  
**Purpose**: Single document with everything needed to pick up and deliver the remaining open work.  
**Related**: `docs/product/TASKLIST.md`, `docs/product/ROADMAP.md`, `docs/product/RELEASE_NOTES.md`, `docs/_archive/delivery/2026-01/2026-01-28_PV_POLICY_MOBILE_DELIVERY_PLAN.md`

---

## 1. What Was Delivered (v2.9.15)

### Profile Visibility & Privacy (PV1–PV4) — ✅ COMPLETE

- **Player model** (`app/lib/models/player.ts`): `profileVisibility` (`'public' | 'private'`, default `'private'`), `profileSectionVisibility` (about, courses, achievements, certificates, stats — each `'public' | 'private'`, default `'private'`).
- **GET /api/players/[playerId]** and **GET /api/profile/[playerId]**: Private profile → 404 "Profile not available" for non-owner. Public profile → only public fields and sections where `profileSectionVisibility[section] === 'public'`.
- **PATCH /api/profile**: Accepts `profileVisibility` and `profileSectionVisibility`; only current user; GET /api/profile returns these fields.
- **Profile page** (`app/[locale]/profile/[playerId]/page.tsx`): "Profile not available" for 404; owner: Profile visibility dropdown, "View as others see it", per-section toggles; sections (streaks, wallet, achievements, certificates) respect visibility; LocaleLink for certificate links; locale from `useParams`.
- **Schema**: `docs/features/PUBLIC_PROFILE_SCHEMA.md` — list of public fields and section keys.

### Policy/LocaleLink (POL) — MOSTLY COMPLETE

- **POL1, POL3, POL4, POL5, POL6**: Done. Policy pages use shared layout and brand tokens; LocaleLink sweep done.
- **POL2**: Deferred. Policy/legal message keys (HU/EN) — policy pages currently use inline content; no `useTranslations` for full body copy.

### Mobile (MOB) — BASELINE ONLY

- **MOB1**: Partially in place via `app/mobile-styles.css` (type scale, tap targets, padding, single-column grids). Can be finalized.
- **MOB2–MOB8**: Not delivered. See §3 below.

---

## 2. What Remains (Open Tasks)

| Area | Task(s) | Status | Owner |
|------|---------|--------|-------|
| **CCS / Email** | CCS-AUDIT-EMAIL-3: Localize transactional emails (welcome/completion/reminder/payment) for all supported locales (or gate sending by locale) | ⏳ TODO | AI/Dev |
| **Policy** | POL2: Add HU/EN (and other locale) message keys for policy/legal page copy; pages use `useTranslations` where applicable | Deferred | Dev |
| **Mobile** | MOB1: Finalise global type/spacing and tap targets in `app/globals.css` + `app/mobile-styles.css` | 🟡 IN PROGRESS | Dev |
| **Mobile** | MOB2: Mobile nav/header — compact sticky header, hamburger, language switcher, back button on course/lesson/quiz | ⏳ PENDING | Dev |
| **Mobile** | MOB3: Course lists (discovery + my-courses) — single-column cards, full-width CTAs, truncation | 🟡 IN PROGRESS | Dev |
| **Mobile** | MOB4: Course detail — above fold content, sticky bottom CTA, accordions for long sections | 🟡 IN PROGRESS | Dev |
| **Mobile** | MOB5: Lesson & quiz pages — full-width stacked buttons, "Back to lesson", quiz progress bar | 🟡 IN PROGRESS | Dev |
| **Mobile** | MOB6: Dashboard/Stats — single-column &lt;640px, card spacing, charts readable | 🟡 IN PROGRESS | Dev |
| **Mobile** | MOB7: Forms & onboarding — full-width inputs/buttons, label-above, 16px padding | 🟡 IN PROGRESS | Dev |
| **Mobile** | MOB8: Media & performance — constrain hero heights, lazy-load images, lighter shadows on mobile | ⏳ PENDING | Dev |

---

## 3. How to Deliver Open Tasks

### 3.1 CCS-AUDIT-EMAIL-3 (Transactional email localization)

- **Goal**: All transactional emails (welcome, completion, reminder, payment) sent in the user’s locale, or gate sending by locale so we only send when we have content for that locale.
- **Where**: `app/lib/email/email-service.ts` and any templates; `messages/*.json` for email copy if moved to i18n.
- **Steps**:
  1. Audit `email-service.ts` for every `send*` (welcome, completion, reminder, payment). Identify which strings are hardcoded.
  2. Either: (a) Add message keys to `messages/{locale}.json` and load by `locale` when sending, or (b) Keep templates per-locale (e.g. files or inline objects keyed by locale) and pass `locale` into send.
  3. Ensure unsubscribe footer and any appended HTML are localized (CCS-AUDIT-EMAIL-2 already did daily-lesson footer).
  4. If a locale has no copy yet, either skip sending for that locale or add a fallback (e.g. EN).
- **Verification**: Run `npx tsx scripts/audit-email-communications-language-integrity.ts`; send test emails in HU and EN and confirm body language matches.

### 3.2 POL2 (Policy/legal message keys)

- **Goal**: Policy pages (privacy, terms, data-deletion) use `useTranslations` for body copy where possible; missing HU/EN (and other locale) keys added to `messages/*.json`.
- **Where**: `app/[locale]/privacy/page.tsx`, `app/[locale]/terms/page.tsx`, `app/[locale]/data-deletion/page.tsx`, `messages/en.json`, `messages/hu.json`, and other `messages/*.json`.
- **Steps**:
  1. Extract inline copy from the three pages into keys (e.g. `privacy.title`, `privacy.section1`, …).
  2. Add keys to all locale files. Start with EN and HU; then replicate for ar, bg, hi, id, pl, pt, tr, vi if those pages are served in those locales.
  3. Replace inline text with `useTranslations('privacy')` (or similar namespace) and `t('key')`.
- **Note**: Currently policy pages use inline content and shared layout/branding; POL2 is optional if we keep copy inline and only need consistency.

### 3.3 MOB1 (Global type/spacing and tap targets)

- **Goal**: Single place (e.g. `app/globals.css` + `app/mobile-styles.css`) defines mobile type scale (H1 22–24px, H2 18–20px, body 16–17px, line-height 1.5–1.6), container padding (16–20px), and tap targets ≥44px.
- **Where**: `app/globals.css`, `app/mobile-styles.css`, design tokens if used.
- **Steps**:
  1. Review `app/mobile-styles.css` and ensure it’s imported in layout or globals.
  2. Define CSS variables or classes for mobile type scale and spacing; ensure buttons/links have min-height/min-width 44px on touch targets.
  3. Apply to global layout so all pages inherit; fix any overrides that break tap targets.

### 3.4 MOB2 (Mobile nav/header)

- **Goal**: Compact sticky header with hamburger menu and language switcher; back button on course/lesson/quiz flows; aria and tap spacing.
- **Where**: `app/[locale]/layout.tsx` or shared header component; course/lesson/quiz pages for back button.
- **Steps**:
  1. Implement or extend shared header: collapse to hamburger on small viewport; include language switcher; ensure 44px tap targets.
  2. Add "Back" (or localized) to course detail, lesson, and quiz pages that link to previous step; use LocaleLink so locale is preserved.

### 3.5 MOB3–MOB7 (Page-level responsive)

- **MOB3**: `app/[locale]/courses/page.tsx`, `app/[locale]/my-courses/page.tsx` — single-column cards, full/90% width CTAs, truncation for long text.
- **MOB4**: `app/[locale]/courses/[courseId]/page.tsx` — title/short desc/progress/enroll above fold; sticky bottom CTA; long sections as accordions.
- **MOB5**: `app/[locale]/courses/[courseId]/day/[dayNumber]/page.tsx` and quiz subpage — full-width stacked nav/CTA; "Back to lesson"; quiz progress bar.
- **MOB6**: `app/[locale]/dashboard/page.tsx`, `app/[locale]/stats/page.tsx` — single-column on &lt;640px; card spacing; charts readable.
- **MOB7**: `app/[locale]/onboarding/page.tsx` and shared form styles — full-width inputs/buttons, label-above, 16px padding, concise errors.
- **Approach**: Use existing `app/mobile-styles.css` and Tailwind breakpoints (`sm:`, `md:`, etc.); test at 320px–640px width.

### 3.6 MOB8 (Media & performance)

- **Goal**: Constrain hero/media heights on mobile, lazy-load images, avoid heavy shadows on mobile.
- **Where**: Shared hero components, course detail hero, any large images.
- **Steps**:
  1. Audit hero and course detail hero components; set max-height or aspect-ratio on small viewports.
  2. Add `loading="lazy"` (or Next.js Image) where appropriate; reduce box-shadow on mobile if needed for performance.

---

## 4. File Reference (Quick Lookup)

| Area | Key files |
|------|-----------|
| Profile visibility | `app/lib/models/player.ts`, `app/api/profile/route.ts`, `app/api/profile/[playerId]/route.ts`, `app/api/players/[playerId]/route.ts`, `app/[locale]/profile/[playerId]/page.tsx` |
| Public profile schema | `docs/features/PUBLIC_PROFILE_SCHEMA.md` |
| Policy pages | `app/[locale]/privacy/page.tsx`, `app/[locale]/terms/page.tsx`, `app/[locale]/data-deletion/page.tsx` |
| Email | `app/lib/email/email-service.ts`, `messages/*.json` (if email copy moved to i18n) |
| Mobile CSS | `app/globals.css`, `app/mobile-styles.css` |
| Layout / header | `app/[locale]/layout.tsx` |
| Course/list/detail/lesson | `app/[locale]/courses/page.tsx`, `app/[locale]/my-courses/page.tsx`, `app/[locale]/courses/[courseId]/page.tsx`, `app/[locale]/courses/[courseId]/day/[dayNumber]/page.tsx` |
| Dashboard / stats | `app/[locale]/dashboard/page.tsx`, `app/[locale]/stats/page.tsx` |
| Onboarding | `app/[locale]/onboarding/page.tsx` |
| Delivery plan | `docs/_archive/delivery/2026-01/2026-01-28_PV_POLICY_MOBILE_DELIVERY_PLAN.md` |
| CCS audit | `scripts/audit-ccs-global-quality.ts`, `scripts/audit-email-communications-language-integrity.ts` (if present) |

---

## 5. Verification After Delivery

- **Profile**: (1) Owner sees full private profile at `/profile/<ownId>`; (2) Owner can set profile to public/private and section visibility; (3) Other users see only public view when profile is public; (4) Private profile returns 404/“Profile not available” for non-owner. ✅ Already verified for v2.9.15.
- **Policy/LocaleLink**: No root-relative `href="/"` or `href="/path"` on policy and swept pages; policy pages use shared layout and design tokens. POL2: if done, all supported locales have required message keys.
- **Mobile**: Key flows (discovery → course → lesson → quiz, dashboard, onboarding) usable at 320px–640px; tap targets ≥44px; no horizontal scroll; charts and forms readable.
- **Email**: Transactional emails in correct locale; audit script passes.

---

## 6. Docs to Update When Delivering

- **TASKLIST.md**: Set task status to ✅ DONE and Expected Delivery to actual date.
- **ROADMAP.md**: Update relevant P0/P1 bullets and status lines.
- **RELEASE_NOTES.md**: Add new version entry (e.g. v2.9.16) with what was delivered.
- **This handover**: Optionally add a “Last delivered” subsection or link to latest release note.
