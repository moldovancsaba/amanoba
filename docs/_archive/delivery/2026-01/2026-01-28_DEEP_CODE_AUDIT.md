# Deep Code Audit — Amanoba

**Date**: 2026-01-28  
**Scope**: Full codebase — inconsistencies, deprecated/obsolete items, hardcoded values, design system deviation, inline styles, hardening  
**Rulebook**: `agent_working_loop_canonical_operating_document.md`  
**Related**: `docs/product/ROADMAP.md`, `docs/product/TASKLIST.md`, `docs/product/DESIGN_UPDATE.md`, `docs/architecture/ARCHITECTURE.md`

---

## Executive Summary

This audit identifies **inconsistencies**, **deprecated/obsolete references**, **hardcoded values** that should be config/DB, **design system deviations**, **inline style usage**, and **hardening gaps**. Each finding is actionable and linked to ROADMAP/TASKLIST where applicable.

---

## 1. Inconsistencies

### 1.1 Design System Palette Conflict (P1)

**Finding**: Two competing color systems exist.

| Source | Primary | Secondary | Accent | CTA |
|--------|--------|-----------|--------|-----|
| `app/design-system.css` | Indigo (#6366f1) | Pink (#ec4899) | Purple (#a855f7) | #FAB908 |
| `app/globals.css` + `docs/product/DESIGN_UPDATE.md` | Gold (#FAB908) | Dark grey (#2D2D2D) | Gold (#FAB908) | #FAB908 |
| `tailwind.config.ts` | #FAB908 (primary) | #2D2D2D (secondary) | — | — |

**Impact**: Components or pages importing `design-system.css` get indigo/pink/purple; rest of app uses gold/black. Recharts in admin analytics use indigo/pink/purple hex directly.

**Action**: Reconcile `design-system.css` with `globals.css`/Tailwind (gold/black); remove or alias indigo/pink/purple to semantic tokens; update any component using `--color-primary-*` to brand tokens.  
**Ref**: ROADMAP P1 — "Reconcile design-system.css palette (indigo/pink) with globals.css gold/black".

---

### 1.2 Locale-Aware Links (P1)

**Finding**: Many links use plain `href="/path"` instead of `LocaleLink` or `href={/${locale}/path}`, so locale is lost on navigation.

**Files / examples** (non-exhaustive):

- `app/[locale]/dashboard/page.tsx`: `href="/courses"`, `href="/admin"`, `href="/my-courses"`, `href="/games"`, `href="/stats"`, `href="/leaderboards"`, `href="/challenges"`, `href="/quests"`, `href="/achievements"`, `href="/rewards"`
- `app/[locale]/courses/[courseId]/page.tsx`: `href="/courses"`
- `app/[locale]/courses/page.tsx`: `href="/auth/signin"`
- `app/[locale]/my-courses/page.tsx`: `href="/auth/signin"`, `href="/courses"`
- `app/[locale]/rewards/page.tsx`, `quests/page.tsx`, `onboarding/page.tsx`, `leaderboards/page.tsx`, `achievements/page.tsx`, `games/page.tsx`, `page.tsx`: various `href="/dashboard"`, `href="/auth/signin"`, `href="/courses"`, `href="/games"`
- `app/[locale]/courses/[courseId]/day/[dayNumber]/page.tsx`: `href="/my-courses"`
- `app/[locale]/games/quizzz/page.tsx`: `<a href="/challenges">` (and teal-600 class, off design system)

**Action**: Replace root-relative `href="/..."` with LocaleLink or `/${locale}/...` so all in-app links preserve locale.  
**Ref**: ROADMAP P1 — "switch plain Link/href=\"/\" to LocaleLink".

---

### 1.3 App URL Fallback Inconsistency (P2)

**Finding**: Base URL fallback is not uniform.

- `process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com'` (email-service, payments, scripts)
- `process.env.NEXT_PUBLIC_APP_URL || 'https://amanoba.com'` (email-service in one place)
- `process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'` (auth)

**Action**: Define a single constant (e.g. in `app/lib/constants/app-url.ts` or env helper) and use it everywhere; document canonical production URL.

---

## 2. Deprecated / Obsolete Items

### 2.1 Facebook / Legacy Auth Still in Codebase (P1)

**Finding**: Docs state SSO-only and "Facebook removed", but code and docs still reference Facebook.

| Location | Content |
|----------|---------|
| `app/lib/models/player.ts` | `facebookId?: string`, `authProvider: 'facebook' \| 'sso' \| 'anonymous'`, default `'facebook'`, index on `facebookId`, validation allowing `facebookId` |
| `docs/architecture/ARCHITECTURE.md` | "Facebook OAuth", "api/auth/facebook/" |
| `messages/*.json` (11 files) | `signInWithFacebook` key |
| `app/[locale]/privacy/page.tsx` | Section "Facebook Login", "Facebook OAuth" |
| `app/[locale]/terms/page.tsx` | "Facebook OAuth authentication" |
| `docs/core/ENVIRONMENT_SETUP.md`, `VERCEL_DEPLOYMENT.md`, `PRODUCTION_STATUS.md` | Facebook app, callback, test steps |
| `app/lib/security.ts` | CSP: `connect.facebook.net`, `frame-src https://www.facebook.com` |
| `app/lib/utils/anonymous-auth.ts` | Comment "Called when anonymous user signs in with Facebook" |
| `scripts/migrate-player-roles.ts` | Default `authProvider: 'facebook'` |

**Action** (after migration): (1) Run `migrate:remove-facebookid` if not done; (2) Remove `facebookId` and `'facebook'` from Player schema and types; (3) Remove Facebook from CSP and env/docs; (4) Replace privacy/terms copy with SSO/anonymous; (5) Remove `signInWithFacebook` from messages or repurpose; (6) Update ARCHITECTURE.md and all docs to remove Facebook.  
**Ref**: `docs/sso/SSO_MIGRATION_COMPLETE.md`, `docs/sso/SSO_ALIGNMENT_ANALYSIS.md`.

---

### 2.2 ARCHITECTURE.md Directory Map Outdated (P2)

**Finding**: ARCHITECTURE still lists `api/auth/facebook/`; no such route exists in App Router.

**Action**: Update directory structure in ARCHITECTURE.md to reflect current `api/auth/` (e.g. `[...nextauth]`, `anonymous`, `sso/*`).

---

## 3. Hardcoded Values That Should Be Config / Database

### 3.1 Email Templates (P1)

**Finding**: `app/lib/email/email-service.ts` uses hardcoded hex colors and inline styles (e.g. #FAB908, #6366f1, #333, #666, #ddd). One CTA uses indigo (#6366f1) instead of brand CTA (#FAB908). Reply-to and app name are from config but visual design is fixed in code.

**Action**: (1) Use design tokens or a shared email style module (e.g. CSS variables or constants) for colors; (2) Use CTA token for all primary buttons (#FAB908); (3) Consider moving template layout/colors to DB or config (e.g. Brand) for future white-label.

---

### 3.2 Certificate Image Generation (P2)

**Finding**: `app/api/profile/[playerId]/certificate/[courseId]/image/route.tsx` uses hardcoded colors (#1a1a1a, #2d2d2d, #FFD700, #FFA500, #FFFFFF, #CCCCCC, #999999) for background, border, progress bar, and text.

**Action**: Source colors from CertificationSettings or Brand (e.g. primary, secondary, accent) and use design tokens; fallback to current hex only if no config.

---

### 3.3 Admin / Anonymous Theme Objects (P2)

**Finding**:  
- `app/api/admin/courses/route.ts`: `primary: '#000000', secondary: '#374151', accent: '#FAB908'` (export theme).  
- `app/lib/utils/anonymous-auth.ts`: `primary: '#6366f1', secondary: '#ec4899', accent: '#a855f7'` (indigo/pink/purple).

**Action**: Use a single theme constant derived from design system (e.g. brand black, dark grey, accent #FAB908); remove indigo/pink/purple from anonymous-auth so it matches brand.

---

### 3.4 Progressive Disclosure Levels (P2)

**Finding**: `app/lib/gamification/progressive-disclosure.ts` defines `FEATURES` with fixed `minLevel` (1, 3, 5, 10, 15, 20, 25) and feature ids.

**Action**: Consider moving feature list and unlock levels to DB (e.g. FeatureFlags or new collection) for admin-configurable progression; keep current values as default seed.

---

### 3.5 Course Languages (P2)

**Finding**: `app/lib/constants/course-languages.ts` holds fixed `COURSE_LANGUAGE_OPTIONS`. Adding a language requires code change.

**Action**: Optional: move to DB or admin-editable config for flexibility; otherwise document that new languages require a code deploy.

---

## 4. Design System Deviation

### 4.1 CTA Yellow Exclusivity (P1)

**Finding**: DESIGN_UPDATE and design system state: CTA yellow (#FAB908) only for primary actions. Violations:

- Email lesson CTA: `#6366f1` (indigo) in one template — should be #FAB908.
- Admin analytics (Recharts): stroke/fill use indigo/pink/purple/green/amber — acceptable for charts but should use semantic or chart palette from design tokens for consistency.
- Certificate image: gold/orange used; align with CTA/brand tokens.

**Action**: Replace non-CTA use of yellow (or CTA-like buttons) with neutral/secondary; use CTA token for all primary CTAs (including email); define a chart color set in design-system if needed.

---

### 4.2 In-Code Hex and Inline Styles (P1)

**Finding**:  
- **38** instances of `style={{ ... }}` across **18** TSX files (dashboard, admin, courses, profile, games, etc.).  
- Hardcoded hex in TS/TSX: admin analytics (Recharts), certificate image route, email-service, anonymous-auth, admin courses route, rich-text-editor, unsubscribe route, madoku-ai.

**Action**: (1) Prefer Tailwind/design-system classes over inline styles; (2) Replace hex with CSS variables or Tailwind theme (e.g. `var(--cta-bg)`, `bg-brand-accent`); (3) Centralize chart colors in design-system or a chart theme file.

---

### 4.3 design-system.css vs Tailwind/globals (P1)

**Finding**: design-system.css defines indigo/pink/purple primary/secondary/accent and utility classes (e.g. `.btn-primary` using indigo). Tailwind and globals use gold/black. `.focus-ring:focus-visible` uses `--color-primary-500` (indigo).

**Action**: Align design-system.css with brand: map primary/secondary/accent to gold/dark grey; update utility classes and focus ring to use brand tokens; remove or deprecate indigo/pink/purple from default theme.

---

## 5. In-Code Style Elements (Summary)

| Category | Count | Action |
|----------|--------|--------|
| `style={{ }}` in TSX | 38 in 18 files | Migrate to Tailwind/design tokens |
| Hardcoded hex in app code | 50+ across email, certificate, admin, auth, games | Replace with design tokens / theme |
| design-system.css indigo/pink/purple | Full palette | Reconcile with globals/Tailwind |

---

## 6. Hardening

### 6.1 Client-Side Console Logs (P1)

**Finding**: ROADMAP says "Remove client debug logs before production builds". Logs found in:

- `app/[locale]/dashboard/page.tsx`: console.log (data refresh, user role)
- `app/[locale]/games/quizzz/page.tsx`: console.log / console.warn (pool exhausted, tracking, session, completion, API response)
- `app/[locale]/achievements/page.tsx`, `challenges/page.tsx`: console.log (data loaded, visibility/focus)
- `app/[locale]/games/madoku/page.tsx`, `sudoku/page.tsx`, `whackpop/page.tsx`: console.warn / console.log
- `app/components/games/MemoryGame.tsx`: console.warn

**Action**: Remove or guard with `process.env.NODE_ENV === 'development'`; prefer shared logger that is no-op in production for client.

---

### 6.2 Content Security Policy (P2)

**Finding**: `app/lib/security.ts` still allows `https://connect.facebook.net` and `frame-src https://www.facebook.com`. Facebook login is deprecated.

**Action**: Remove Facebook domains from CSP when Facebook is fully removed from codebase and docs.

---

### 6.3 Admin Route Protection (Verified)

**Finding**: All admin API routes under `app/api/admin/*` use `requireAdmin(request, session)` before handling. No missing protection found.

**Action**: None; keep pattern for any new admin routes.

---

## 7. Summary Table

| Priority | Category | Item | Doc Ref |
|----------|----------|------|--------|
| P1 | Inconsistency | Design system palette (design-system.css vs globals) | ROADMAP |
| P1 | Inconsistency | Locale-aware links (LocaleLink / locale prefix) | ROADMAP |
| P1 | Deprecated | Facebook: Player model, docs, messages, CSP, privacy/terms | This doc + SSO_MIGRATION |
| P1 | Hardcoded | Email template colors + CTA indigo → tokens + #FAB908 | This doc |
| P1 | Design | CTA yellow exclusivity (email, charts, certificate) | DESIGN_UPDATE |
| P1 | Design | Inline styles + hex → Tailwind/tokens | This doc |
| P1 | Design | design-system.css align with Tailwind/globals | ROADMAP |
| P1 | Hardening | Remove or guard client console.log/warn | ROADMAP |
| P2 | Inconsistency | Single APP_URL constant | This doc |
| P2 | Deprecated | ARCHITECTURE.md auth directory | This doc |
| P2 | Hardcoded | Certificate image colors from config | This doc |
| P2 | Hardcoded | Admin/anonymous theme objects → brand tokens | This doc |
| P2 | Hardcoded | Progressive disclosure → DB (optional) | This doc |
| P2 | Hardcoded | Course languages → config (optional) | This doc |
| P2 | Hardening | CSP remove Facebook | This doc |

---

## 8. Safety Rollback Plan

- **Baseline**: Current main branch (pre-audit doc and ROADMAP/TASKLIST edits).  
- **Rollback**: Revert commits that only touch docs (`docs/_archive/delivery/2026-01/2026-01-28_DEEP_CODE_AUDIT.md`, `docs/product/ROADMAP.md`, `docs/product/TASKLIST.md`, `agent_working_loop_canonical_operating_document.md`).  
- **Verification**: No application code is changed in this audit delivery; build and tests remain unchanged.  
- **Future code changes** from this audit will each have their own rollback plan in the implementing task.

---

**Last Updated**: 2026-01-28  
**Next Review**: After P1 items are addressed or at next quarterly audit.

---

## P1 Delivery (2026-01-28)

AUDIT1–AUDIT5 delivered:

- **AUDIT1**: `design-system.css` primary/secondary/accent aligned to brand gold (#FAB908) and dark grey (#2D2D2D); CTA and utility classes use `--cta-bg` / brand tokens; shadows updated to gold.
- **AUDIT2**: Quizzz Daily Challenges link → LocaleLink; Sudoku "Back to Games" → LocaleLink; data-deletion page → locale-prefixed Link hrefs; other pages already used LocaleLink.
- **AUDIT3**: `EMAIL_TOKENS` added in `email-service.ts` (ctaBg, ctaText, bodyText, muted, border); lesson reminder CTA button uses #FAB908; unsubscribe/completion/payment footers use tokens.
- **AUDIT4**: All client `console.log`/`console.warn` in dashboard, quizzz, achievements, challenges, madoku, sudoku, whackpop, MemoryGame, Icon guarded with `process.env.NODE_ENV === 'development'`.
- **AUDIT5**: Certificate image route uses `CERT_COLORS` constants; course detail thumbnail uses `aspect-video` class instead of inline aspectRatio.

---

## P2 Delivery (2026-01-28)

AUDIT6–AUDIT11 delivered:

- **AUDIT6**: Created `app/lib/constants/app-url.ts` with `APP_URL`, `CANONICAL_APP_URL` (`https://www.amanoba.com`), and `getAuthBaseUrl()`. Replaced inline env fallbacks in email-service, payments (create-checkout, success), auth (sso logout/callback/login, anonymous), layout, courses layout, referrals.
- **AUDIT7**: Certificate image route loads course’s Brand; uses `themeColors.accent` (and optionally primary/secondary) when present; falls back to `CERT_COLORS_DEFAULT` otherwise.
- **AUDIT8**: `anonymous-auth.ts` default brand themeColors set to primary `#000000`, secondary `#2D2D2D`, accent `#FAB908`. Admin courses route already used brand colors.
- **AUDIT9**: ARCHITECTURE.md auth section updated: removed `api/auth/facebook/`; added `[...nextauth]`, `anonymous`, `sso/`; Security and Authentication sections now describe SSO and anonymous only.
- **AUDIT10**: Player model: removed `facebookId` field and index; `authProvider` enum is `'sso' | 'anonymous'`, default `'sso'`; pre-save validates `ssoSub` only. Privacy and terms: replaced Facebook Login section with “Sign-In and Authentication” (SSO/guest); account bullets now “SSO or anonymous sign-up”. Messages: repurposed `signInWithFacebook` to generic “Sign in” (and localized equivalents). Updated `migrate-player-roles.ts` default to `'sso'`; anonymous-auth comment updated.
- **AUDIT11**: CSP in `app/lib/security.ts`: removed `https://connect.facebook.net` from script-src and `https://www.facebook.com` from frame-src; frame-src set to `'none'`.
