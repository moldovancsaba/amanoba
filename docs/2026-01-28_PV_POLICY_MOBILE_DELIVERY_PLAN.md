# PV + Policy/LocaleLink + Mobile — Actionable Delivery Plan

**Date**: 2026-01-28  
**Scope**: Profile Visibility & Privacy (PV1–PV4), Policy/legal localization + LocaleLink, Mobile responsiveness (MOB1–MOB8)  
**Source**: `docs/TASKLIST.md`, `docs/ROADMAP.md`  
**Status**: Phase 1 (POL) and Phase 2 (PV full PV1–PV4) delivered 2026-01-28. Phase 3 (MOB) baseline already in place; page-level MOB2–MOB8 remain.

---

## 1. Executive summary

| Pack | Goal | Task count | Dependencies |
|------|------|------------|--------------|
| **Profile Visibility & Privacy** | Private/public profile, section visibility | 18 tasks (PV1.1–PV4.5) | PV1 → PV2 → PV3; PV4 builds on PV2/PV3 |
| **Policy/legal + LocaleLink** | Localized policy pages, locale-preserving links, design shell | 6 tasks (POL1–POL6) | Independent |
| **Mobile (MOB)** | Responsive typography, nav, course/lesson/dashboard, forms, media | 8 tasks (MOB1–MOB8) | MOB1 before others; MOB2 supports all flows |

**Suggested delivery order**: (A) Policy/LocaleLink first (small, unblocks UX consistency); (B) PV1–PV4 (feature pack); (C) MOB (finish in-progress, then MOB2/MOB8). Alternatively: MOB first if mobile traffic is priority.

---

## 2. Pack A: Profile Visibility & Privacy (PV1–PV4)

**Reference**: `docs/TASKLIST.md` § P1 Profile Visibility & Privacy  
**Owner**: Tribeca (dev); content/copy: Katja

### 2.1 Goal 1 — User can see their private profile

| ID | Task | Deliverable | Status |
|----|------|-------------|--------|
| **PV1.1** | Ensure `GET /api/profile/[playerId]` and/or `GET /api/players/[playerId]` return full private data when `playerId` matches session user | API returns full private fields (email, wallet, lastLoginAt, etc.) for self | ✅ |
| **PV1.2** | Ensure `app/[locale]/profile/[playerId]/page.tsx` renders private view when viewer is the profile owner (no redirect when session exists and ids match) | Profile page shows full private view for owner | ✅ |
| **PV1.3** | Add or fix entry point so user can open “My profile” (e.g. from dashboard, header, menu) and land on `/profile/<own-playerId>` | Dashboard/header/menu link “My profile” → `/[locale]/profile/<ownId>` | ✅ |
| **PV1.4** | Document acceptance: logged-in user visiting `/profile/<own-id>` sees full private profile | Doc or TASKLIST note; optional manual test checklist | ✅ |

### 2.2 Goal 2 — User can set profile to public/private

| ID | Task | Deliverable | Status |
|----|------|-------------|--------|
| **PV2.1** | Add `profileVisibility` (or `isProfilePublic`) field to Player model; default `private`; migration if needed | `app/lib/models/player.ts` + optional migration script | ✅ |
| **PV2.2** | Add PATCH (or extend existing) profile API so owner can update `profileVisibility`; enforce “only owner can change” | e.g. PATCH `/api/profile` or `/api/players/[playerId]` with auth check | ✅ |
| **PV2.3** | Add UI on profile or settings: control “Profile visibility: Public / Private” (toggle or dropdown) and persist via API | Toggle/dropdown on profile or settings page | ✅ |
| **PV2.4** | Enforce in API and page: when profile is private, non-owner requests to `/profile/[playerId]` get 404 or “not available”; when public, allow public view (see §2.3) | API returns 404/403 for private non-owner; page shows “not available” or redirect | ✅ |

### 2.3 Goal 3 — Others can see public profile (read-only, allowed fields only)

| ID | Task | Deliverable | Status |
|----|------|-------------|--------|
| **PV3.1** | Define public profile schema: which fields are shown (e.g. displayName, avatar, bio, public achievements/courses; no email, wallet, lastLoginAt) | Doc or code comment: list of public fields | ✅ |
| **PV3.2** | Ensure `GET /api/players/[playerId]` (or profile API) returns only public fields when requester is not owner and profile is public; otherwise 404 or restricted | API response shape for public viewer | ✅ |
| **PV3.3** | Ensure `app/[locale]/profile/[playerId]/page.tsx` renders public view for other users when profile is public (read-only, no private sections) | Public profile UI: no email, wallet, lastLoginAt | ✅ |
| **PV3.4** | Add “View as others see it” / public preview for profile owner on their profile or settings page | Button/link that shows public view for owner | ✅ |

### 2.4 Goal 4 — Per-section visibility (About, Courses, Achievements, Certificates, Stats)

| ID | Task | Deliverable | Status |
|----|------|-------------|--------|
| **PV4.1** | Define profile sections and add model/schema for per-section visibility (e.g. `profileSectionVisibility: { about, courses, achievements, certificates, stats }` each `'public' \| 'private'`) | Player schema extension + default values | ✅ |
| **PV4.2** | Add API to get/update per-section visibility (PATCH profile); only owner can update; validate section keys | PATCH accepts `profileSectionVisibility` | ✅ |
| **PV4.3** | Add UI on profile/settings: per-section toggles “Visible to everyone / Only me” and persist via API | Section toggles on profile/settings | ✅ |
| **PV4.4** | When rendering another user’s public profile, show only sections marked public; for self, show all sections with clear visibility indicator | Profile page respects section visibility; owner sees indicators | ✅ |
| **PV4.5** | Enforce section visibility in `GET /api/players/[playerId]` (and any profile aggregate API) and in profile page rendering | API and UI both filter by section visibility | ✅ |

**PV dependency order**: PV1.1 → PV1.2 → PV1.3 → PV1.4; then PV2.1 → PV2.2 → PV2.3 → PV2.4; then PV3.1 → PV3.2 → PV3.3 → PV3.4; then PV4.1 → PV4.2 → PV4.3 → PV4.4 → PV4.5. PV3 can start after PV2.4; PV4 needs PV2 and PV3.

---

## 3. Pack B: Policy/legal localization + LocaleLink

**Reference**: `docs/ROADMAP.md` § Tech Debt P1 — “Localize and brand policy/legal pages; switch plain Link/href to LocaleLink, add missing HU/EN messages, and apply globals.css shell”

### 3.1 Policy/legal pages

| ID | Task | Deliverable | Status |
|----|------|-------------|--------|
| **POL1** | Audit privacy, terms, data-deletion pages for any plain `Link href="/"` or `href="/path"`; replace with LocaleLink or `href={\`/${locale}/...\`}` | All in-app links on policy pages preserve locale | ✅ |
| **POL2** | Add missing HU/EN (and other locale) message keys for policy/legal page copy if any strings are still hardcoded | `messages/*.json` entries for policy/legal; pages use `useTranslations` where applicable | Deferred |
| **POL3** | Apply globals.css shell to policy/legal pages: consistent layout, typography, container padding, and design tokens | `app/[locale]/privacy/page.tsx`, `terms/page.tsx`, `data-deletion/page.tsx` use shared layout/classes | ✅ |
| **POL4** | Brand policy pages: use design-system/CTA tokens for primary links and buttons (e.g. replace indigo-600 with brand/CTA where appropriate) | Policy pages use `--cta-*` or brand tokens per design system | ✅ |

### 3.2 LocaleLink sweep (rest of app)

| ID | Task | Deliverable | Status |
|----|------|-------------|--------|
| **POL5** | Audit remaining app pages for root-relative `href="/..."`: rewards, quests, leaderboards, onboarding, home, games subpages, settings | List of files and links to update | ✅ |
| **POL6** | Replace root-relative links with LocaleLink or `href={\`/${locale}/...\`}` on all pages identified in POL5 | No locale loss on navigation from those pages | ✅ |

**POL order**: POL1 → POL2 → POL3 → POL4 (policy pages); POL5 → POL6 (LocaleLink sweep). POL1–POL4 can run in parallel with POL5–POL6 after POL5 audit.

---

## 4. Pack C: Mobile responsiveness (MOB1–MOB8)

**Reference**: `docs/TASKLIST.md` § Mobile UX & Responsive Polish

### 4.1 Tasks in recommended order

| ID | Task | Deliverable | Status |
|----|------|-------------|--------|
| **MOB1** | Global type/spacing: mobile type scale (H1 22–24px, H2 18–20px, body 16–17px, lh 1.5–1.6), container padding (16–20px), tap-target ≥44px in `app/globals.css` + `app/mobile-styles.css` (and shared design tokens) | CSS variables / classes for mobile; applied globally | 🟡 IN PROGRESS |
| **MOB2** | Mobile nav/header: compact sticky header with hamburger and language switcher; back button on detail/quiz flows; implement in `app/layout.tsx` (shared header) with aria/tap spacing | Header component responsive; back button on course/lesson/quiz | ⏳ PENDING |
| **MOB3** | Course lists (discovery + my-courses): single-column cards, full/90% width CTAs, truncation for long HU text; `app/[locale]/courses/page.tsx`, `app/[locale]/my-courses/page.tsx` | Cards and CTAs mobile-friendly | 🟡 IN PROGRESS |
| **MOB4** | Course detail page: title/short desc/progress/enroll above fold; sticky bottom CTA; long sections (what you’ll learn/outline) as accordions; `app/[locale]/courses/[courseId]/page.tsx` | Above-fold content; accordions; sticky CTA | 🟡 IN PROGRESS |
| **MOB5** | Lesson & quiz pages: nav/CTA buttons full-width stacked; body line-height; clear “Back to lesson”; quiz progress bar; `app/[locale]/courses/[courseId]/day/[dayNumber]/page.tsx` (and quiz subpage) | Lesson/quiz flow usable on small screens | 🟡 IN PROGRESS |
| **MOB6** | Dashboard/Stats cards: single-column on &lt;640px; card spacing; charts readable on mobile; `app/[locale]/dashboard/page.tsx`, `app/[locale]/stats/page.tsx` | Dashboard and stats responsive | 🟡 IN PROGRESS |
| **MOB7** | Forms & onboarding: full-width inputs/buttons, label-above, 16px padding, concise errors; `app/[locale]/onboarding/page.tsx` and shared form styles | Forms and onboarding mobile-friendly | 🟡 IN PROGRESS |
| **MOB8** | Media & performance: constrain hero/media heights, lazy-load images, avoid heavy shadows on mobile; audit shared hero and course detail hero | Lazy-load and mobile-friendly media | ⏳ PENDING |

**MOB order**: MOB1 first (global baseline); then MOB2 (nav supports all flows); then MOB3–MOB7 (page-level); MOB8 last (media/performance).

---

## 5. Master task list (execution order)

Use this order to minimise rework and dependencies.

### Phase 1 — Quick wins (Policy + LocaleLink)

1. POL5 — Audit links (list pages with root-relative href).
2. POL6 — Replace with LocaleLink / locale-prefixed href.
3. POL1 — Policy pages link audit (if not covered by POL5/6).
4. POL2 — Missing HU/EN messages for policy/legal.
5. POL3 — Globals.css shell on policy/legal pages.
6. POL4 — Brand policy pages (design tokens).

### Phase 2 — Profile Visibility & Privacy

7. PV1.1 → PV1.2 → PV1.3 → PV1.4 (private profile).
8. PV2.1 → PV2.2 → PV2.3 → PV2.4 (public/private toggle).
9. PV3.1 → PV3.2 → PV3.3 → PV3.4 (public profile view).
10. PV4.1 → PV4.2 → PV4.3 → PV4.4 → PV4.5 (per-section visibility).

### Phase 3 — Mobile

11. MOB1 — Finalise global type/spacing and tap targets.
12. MOB2 — Mobile nav/header and back button.
13. MOB3 → MOB4 → MOB5 → MOB6 → MOB7 — Page-level responsive (course lists, detail, lesson/quiz, dashboard/stats, forms).
14. MOB8 — Media and performance.

---

## 6. Verification and docs

- **Profile Visibility**: After PV1–PV4, verify: (1) owner sees full private profile at `/profile/<ownId>`; (2) owner can set profile to public/private and section visibility; (3) other users see only public view when profile is public; (4) private profile returns 404/“not available” for non-owner.
- **Policy/LocaleLink**: After POL1–POL6, verify: (1) no root-relative `href="/"` or `href="/path"` on policy pages and swept pages; (2) policy pages use shared layout and design tokens; (3) all supported locales have required message keys.
- **Mobile**: After MOB1–MOB8, verify: (1) key flows (discovery → course → lesson → quiz, dashboard, onboarding) are usable on 320px–640px width; (2) tap targets ≥44px; (3) no horizontal scroll on content; (4) charts and forms readable.

**Update after delivery**: Mark tasks in this doc and in `docs/TASKLIST.md`; add release note to `docs/RELEASE_NOTES.md`; optionally update `docs/ROADMAP.md` and `docs/STATUS.md`.

---

## 7. File reference

| Area | Key files |
|------|-----------|
| Profile API | `app/api/profile/[playerId]/route.ts`, `app/api/players/[playerId]/route.ts` |
| Profile page | `app/[locale]/profile/[playerId]/page.tsx` |
| Player model | `app/lib/models/player.ts` |
| Policy pages | `app/[locale]/privacy/page.tsx`, `app/[locale]/terms/page.tsx`, `app/[locale]/data-deletion/page.tsx` |
| LocaleLink | `components/LocaleLink.tsx` (or project equivalent); layout/dashboard for “My profile” |
| Mobile CSS | `app/globals.css`, `app/mobile-styles.css` |
| Layout / header | `app/[locale]/layout.tsx` |
| Course/list/detail/lesson | `app/[locale]/courses/page.tsx`, `app/[locale]/my-courses/page.tsx`, `app/[locale]/courses/[courseId]/page.tsx`, `app/[locale]/courses/[courseId]/day/[dayNumber]/page.tsx` |
| Dashboard / stats | `app/[locale]/dashboard/page.tsx`, `app/[locale]/stats/page.tsx` |
| Onboarding | `app/[locale]/onboarding/page.tsx` |
| Messages | `messages/en.json`, `messages/hu.json`, … |
