# Tech Audit — January 2026 (System Health)

**Date**: 2026-01-30  
**Scope**: Dependencies, deprecated modules, build/lint, known issues, code style, hardcoded values, consistency, security, UI best practices  
**Status**: ACTIVE — Use for prioritised remediation

---

## Executive summary

- **Build**: ✅ Passes (Next.js 16.1.6, Turbopack). Baseline-browser-mapping override in package.json.
- **Dependencies**: Next 16.1.6, React 19.2; **0 npm audit vulnerabilities**. One extraneous package (`@emnapi/runtime`, transitive). Optional deps (WebAuthn, nodemailer) unmet — acceptable if not used.
- **Deprecated**: `next lint` removed in Next 16 (use `npm run lint`). Lesson model field `assessmentGameId` deprecated (use `quizConfig`).
- **Lint**: **ESLint** — **0 errors, 0 warnings** (scripts/public ignored; auth, i18n, middleware fixed). **TypeScript**: Enforced in build (`typescript.ignoreBuildErrors: false`); see `docs/2026-01-28_TYPESCRIPT_AUDIT_COMPLETE.md`.
- **Hardcoded values**: Centralised in `app/lib/constants/theme-colors.ts` where done; some fallbacks remain (cert, email, analytics).
- **Security**: **0 vulnerabilities**. Security headers present. Env used for secrets; some fallback URLs hardcoded.
- **UI**: Some `<img>` without Next.js `<Image />`; inline hex in admin analytics; progress widths use inline `style` (acceptable for dynamic values). CTA and design tokens documented in `layout_grammar.md` / `DESIGN_UPDATE.md` but not fully applied everywhere.

---

## 1. Dependencies

### 1.1 Stack (package.json)

- **Node**: `>=24.0.0` (engines)
- **Next.js**: 16.1.6 (Turbopack; upgraded from 15.x — see RELEASE_NOTES)
- **React**: ^19 (19.2.x in use)
- **MongoDB/Mongoose**: mongodb ^6.18.0, mongoose ^8.18.0
- **Auth**: next-auth ^5.0.0-beta.29, @auth/mongodb-adapter ^3.11.0, jose ^6.1.3
- **Payments**: stripe ^20.2.0, @stripe/stripe-js ^8.6.1
- **UI**: Radix primitives, Tailwind, framer-motion, lucide-react, recharts, sonner, vaul
- **i18n**: next-intl ^4.7.0
- **Dev**: TypeScript ^5, ESLint ^9, eslint-config-next 15.5.2, tsx ^4.20.6

### 1.2 Optional / extraneous

- **Unmet optional dependencies** (from @auth/core): `@simplewebauthn/browser`, `@simplewebauthn/server`, `nodemailer` — only relevant if using WebAuthn or email provider; otherwise safe to ignore.
- **Extraneous**: `@emnapi/runtime@1.5.0` (not in package.json). Consider removing with `npm uninstall @emnapi/runtime` if not required.

### 1.3 Overrides

- `brace-expansion`: ^2.0.2  
- `nanoid`: ^3.3.8  

---

## 2. Deprecated modules / APIs

| Item | Location | Recommendation |
|------|----------|----------------|
| **next lint** | Next.js CLI | Deprecated; removal in Next.js 16. Migrate to ESLint CLI: `npx @next/codemod@canary next-lint-to-eslint-cli .` |
| **assessmentGameId** | `app/lib/models/lesson.ts` | Deprecated; use `quizConfig` for lesson assessments. Documented in schema; still present for backward compatibility. |
| **baseline-browser-mapping** | Build warning | Data over two months old. Update: `npm i baseline-browser-mapping@latest -D` (or remove if not needed). |

---

## 3. Warnings and errors

### 3.1 Build

- **Status**: ✅ Compiles successfully.
- **Warning**: `[baseline-browser-mapping] The data in this module is over two months old.` — Update or remove dependency.
- **Config** (updated 2026-01-28): `next.config.ts` has `eslint: { ignoreDuringBuilds: false }` and `typescript: { ignoreBuildErrors: false }` — **builds now fail on lint and TypeScript errors**. Lint: 0 warnings/errors; `npx tsc --noEmit` passes for app code (scripts excluded).

### 3.2 ESLint

- **Total** (updated 2026-01-28): **0** warnings and **0** errors.
- **Fixes applied**: All prior errors and warnings resolved (Sparkles, unescaped entities, no-img-element, no-unused-vars, anonymous default export, beforeInteractive). `@typescript-eslint/no-unused-vars` uses `argsIgnorePattern`/`varsIgnorePattern`/`caughtErrorsIgnorePattern` `^_`. See `docs/tasklists/TECH_AUDIT_JANUARY__2026-01-30.md`.

---

## 4. Known issues / bugs

### 4.1 TODOs and placeholders

| Location | Issue |
|----------|--------|
| `app/api/profile/[playerId]/route.ts` | **Done**: highestScore/perfectGames aggregated from PlayerSession (max score; perfect = win + 100% accuracy or score === maxScore). |
| `app/[locale]/admin/settings/page.tsx` | **Done**: Certification settings and default thumbnail save implemented. |
| `app/api/admin/system-info/route.ts` | **Done**: Uses `process.uptime()` and `formatUptime()`. |
| `app/[locale]/admin/games/page.tsx` | **Done**: GET /api/admin/games, PATCH /api/admin/games/[gameId] (isActive); page wired. |
| `app/lib/gamification/session-manager.ts` | **Done**: On challenge update failure, job enqueued (jobType: 'challenge'); worker planned. |

### 4.2 Debug logging (client/server)

- **app/api/auth/sso/callback/route.ts**: Multiple `logger.info(…, 'DEBUG: …')` for ID token claims, user info, signIn. Prefer removing or gating behind `NODE_ENV === 'development'` and a debug flag.
- **app/[locale]/dashboard/page.tsx**: `console.log('Dashboard data refreshed:', data)` in development.
- **app/[locale]/games/whackpop/page.tsx**: `console.log` / `console.warn` for cached emojis, loaded emojis, fallback emoji set, challenges refresh — all gated by `NODE_ENV === 'development'`.

**Recommendation**: Remove or centralise behind a small debug logger that is no-op in production.

---

## 5. Style in code

### 5.1 Positive

- **Naming**: kebab-case files, camelCase functions/vars, PascalCase components/types — aligned with `docs/NAMING_GUIDE.md`.
- **Structure**: App Router, locale under `[locale]`, API under `api/`, lib under `lib/`.
- **Design tokens**: `design-system.css` and `tailwind.config.ts` define brand colors and CTA tokens; used in many places.

### 5.2 Inconsistencies

- **Imports**: Mix of `@/app/lib/` and `@/lib/` (e.g. certificate layout uses `@/app/lib/`, API routes use `@/lib/`). Prefer one alias convention.
- **Logging**: Mix of `console.error` in UI components and `logger` in API/lib. Prefer `logger` in server code and a single client-side error reporting approach.
- **any types**: Widespread in admin, gamification, i18n, and components. Reduces type safety and maintainability.

---

## 6. Hardcoded values

### 6.1 URLs and origins

| Location | Value | Recommendation |
|----------|--------|----------------|
| `app/lib/constants/app-url.ts` | `CANONICAL_APP_URL = 'https://www.amanoba.com'` | Keep as default; env overrides already used. |
| `app/lib/security.ts` | `allowedOrigins`: `localhost:3000`, `amanoba.vercel.app` | Prefer env list (e.g. `ALLOWED_ORIGINS`) for production. |
| `app/lib/rbac.ts` | `SSO_USERINFO_URL` fallback `'https://sso.doneisbetter.com/api/oauth/userinfo'` | Ensure production uses env; document fallback. |
| `app/lib/utils/anonymous-auth.ts` | `allowedDomains: ['amanoba.com', 'localhost']` | Consider env-driven list. |

### 6.2 Colors (hex)

| Location | Usage | Recommendation |
|----------|--------|----------------|
| `app/api/certificates/[slug]/image/route.tsx` | Default palette | **Done**: Both cert image APIs import from `app/lib/constants/certificate-colors.ts` (THEME_COLOR, SECONDARY_HEX); Brand.themeColors override at runtime. See RELEASE_NOTES v2.9.25. |
| `app/api/profile/[playerId]/certificate/[courseId]/image/route.tsx` | Same certificate palette | Same as above. |
| `app/[locale]/layout.tsx` | `themeColor: "#FAB908"` | Use CSS variable or Tailwind token. |
| `app/lib/email/email-service.ts` | ctaBg, ctaText, bodyText, muted, border hex | Map to design tokens or a single email theme object. |
| `app/[locale]/admin/analytics/page.tsx` | Recharts stroke/fill: #fff3, #fff, #1f2937, #6366f1, #22c55e, #f59e0b, #ec4899, #a855f7 | Move to a small analytics chart theme (e.g. from design-system or Tailwind). |
| `app/api/admin/courses/route.ts` | themeColors fallback `primary: '#000000', secondary: '#374151', accent: '#FAB908'` | Prefer shared default theme constant. |

### 6.3 Other

- **app/[locale]/admin/layout.tsx**: `style={{ width: '260px' }}` for sidebar — consider Tailwind class (e.g. `w-[260px]`) or token.
- **app/[locale]/games/madoku/page.tsx**: `style={{ width: 'fit-content' }}` — acceptable for layout; Tailwind `w-fit` is an option.

---

## 7. Inconsistent coding standards

- **Lint/TS off in build**: Enabling lint and type-check in CI and optionally in build will enforce consistency.
- **any**: Replace with proper types in admin, gamification, i18n, and shared components.
- **Unused code**: Remove unused imports and variables (or use underscore prefix if intentionally unused).
- **Effect dependencies**: Fix or document exhaustive-deps exceptions; avoid stale closures.
- **Import path alias**: Standardise on `@/` vs `@/app/` for app code (see `tsconfig.json` paths).

---

## 8. Security issues

### 8.1 npm audit (2026-01-30)

**Status (updated)**: P0.1/P0.2 done — `npm audit fix` run; Next.js upgraded to 16.x. **0 vulnerabilities** reported after fixes. Re-run `npm audit` after any dependency change.

| Package | Severity | Issue | Status |
|---------|----------|--------|--------|
| **js-yaml** | moderate | Prototype pollution | Fixed (audit fix). |
| **jws** | high | HMAC signature | Fixed (audit fix). |
| **next** | high | DoS/memory advisories | Addressed via Next 16 upgrade. |
| **next-auth** | moderate | Email misdelivery | Fixed (audit fix). |

**Actions**: Done. For future: run `npm audit fix` after dependency updates; track next-auth and Next.js advisories.

### 8.2 Application security

- **Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy set. Consider CSP if not already strict.
- **Auth**: NextAuth with MongoDB adapter; SSO callback uses env for URLs and secrets. Ensure no secrets in client bundles.
- **CORS / origins**: `app/lib/security.ts` validates origin; allowlist should be env-driven in production.
- **Debug route**: `app/api/debug/player/[playerId]/route.ts` — restrict to development or protect with admin auth and remove/disable in production if not needed.

---

## 9. UI best practices

### 9.1 Image usage

- **Next.js Image**: Lint reports `<img>` in admin (courses, games, rewards). Prefer `<Image />` from `next/image` for better optimisation and consistency (see `docs/layout_grammar.md`).
- **Alt text**: Several `<img>` usages have `alt={course.name}` or similar; keep alt meaningful and concise.

### 9.2 Inline styles and tokens

- **Progress bars / dynamic width**: Inline `style={{ width: `${…}%` }}` is acceptable for dynamic values (dashboard, profile, courses, achievements, quizzz).
- **Analytics charts**: Inline hex colors in Recharts; move to a shared theme for consistency and maintainability.
- **CTA and brand**: CTA yellow (#FAB908) should be used only for primary actions (see `DESIGN_UPDATE.md`). Audit non-CTA use of yellow (e.g. table of contents, badges) and replace with neutral/secondary tokens.

### 9.3 Accessibility

- **aria-label**: Used on some controls (e.g. course family id/name, theme toggle). Ensure all interactive elements have accessible names and roles.
- **Buttons**: Prefer `<button>` or clearly labelled `role="button"` with keyboard support; `app/mobile-styles.css` references `[role="button"]` — ensure focus and semantics are correct.

### 9.4 Responsive and layout

- No systematic issues identified; Tailwind and responsive patterns are used. Continue to test critical flows on small viewports.

---

## 10. Recommended actions (prioritised)

1. **Security**: Run `npm audit fix`; then plan Next.js upgrade/fix and next-auth update; restrict or remove debug API in production.
2. **Lint/TypeScript**: Fix ESLint errors (undefined `Sparkles`, unescaped entities, critical `any`); then re-enable lint (and optionally TS) in build or CI.
3. **Deprecated**: Migrate from `next lint` to ESLint CLI; plan removal of `assessmentGameId` usage where possible.
4. **Hardcoded values**: Centralise certificate colors and email theme; move analytics chart colors to a theme; use env for origin/domain allowlists.
5. **TODOs**: Implement or ticket admin settings save, system-info uptime, game status API, and challenge retry queue.
6. **Debug logging**: Remove or gate SSO and client debug logs for production.
7. **UI**: Replace admin `<img>` with Next.js `<Image />`; audit CTA yellow usage against design rules.
8. **Consistency**: Standardise import alias; replace `any` in hot paths; fix React Hook dependency warnings.

---

## 11. References

- **Layout and design**: `docs/layout_grammar.md`, `docs/DESIGN_UPDATE.md`
- **Naming**: `docs/NAMING_GUIDE.md`
- **Deep code audit (historical)**: `docs/2026-01-28_DEEP_CODE_AUDIT.md`
- **Roadmap tech debt**: `docs/ROADMAP.md` § Tech Debt
- **Task list**: `docs/TASKLIST.md`

---

## 12. What we can do with these findings (priority-ordered)

Work in this order: **P0 → P1 → P2 → P3**. Track progress in **`docs/tasklists/TECH_AUDIT_JANUARY__2026-01-30.md`**.

### P0 — Security (do first)

| Priority | Action | Why |
|----------|--------|-----|
| P0.1 | Run `npm audit fix` | Resolves js-yaml, jws, next-auth (and possibly next) vulnerabilities. |
| P0.2 | Evaluate `npm audit fix --force` for Next.js | Addresses Next DoS/memory advisories; test thoroughly after upgrade. |
| P0.3 | Restrict or remove `app/api/debug/player/[playerId]` in production | Prevents info exposure. |
| P0.4 | Move origin allowlists to env (e.g. `ALLOWED_ORIGINS`) | Avoid hardcoded production URLs in security.ts. |
| P0.5 | Remove or gate SSO callback DEBUG logs | Reduce noise and potential info leakage. |

### P1 — Lint and TypeScript (unblock quality gates)

| Priority | Action | Why |
|----------|--------|-----|
| P1.1 | Fix `Sparkles` undefined in `app/[locale]/achievements/page.tsx` | Removes react/jsx-no-undef error; add import from lucide-react. |
| P1.2 | Fix unescaped `"` in admin courses page (~line 859) | Removes react/no-unescaped-entities errors. |
| P1.3 | Fix remaining critical ESLint errors (undefined refs, unescaped entities) | So lint can be re-enabled in build. |
| P1.4 | Fix or document React Hook exhaustive-deps | Prevents stale closures. |
| P1.5 | Replace high-impact `any` types (admin, session-manager, LocaleLink, i18n) | Improves type safety. |
| P1.6 | Re-enable ESLint during build | Enforce quality at deploy time. |
| P1.7 | (Optional) Re-enable TypeScript errors during build | After critical errors fixed. |
| P1.8 | Migrate from deprecated `next lint` to ESLint CLI | `npx @next/codemod@canary next-lint-to-eslint-cli .` |

### P2 — Deprecated and hardcoded values

| Priority | Action | Why |
|----------|--------|-----|
| P2.1 | Update or remove `baseline-browser-mapping` | Clears build warning. |
| P2.2 | Remove extraneous `@emnapi/runtime` if unused | `npm uninstall @emnapi/runtime`. |
| P2.3 | Certificate image routes: source colors from Brand/CertificationSettings | Single source for certificate theme. |
| P2.4 | Email service: map hex to design tokens or single email theme | Consistency with design system. |
| P2.5 | Admin analytics Recharts: move hex to shared chart theme | Consistency; easier to change. |
| P2.6 | Layout themeColor and APP_URL fallbacks | Use tokens / env. |
| P2.7 | (Low) Plan removal of `assessmentGameId` usage | Keep field until migration. |

### P3 — Known issues, UI, consistency

| Priority | Action | Why |
|----------|--------|-----|
| P3.1 | Resolve or ticket profile highestScore/perfectGames, admin settings save, system-info uptime, game status API, challenge retry queue | Clear TODOs or track in backlog. |
| P3.2 | Replace admin `<img>` with Next.js `<Image />` | Better performance and consistency. |
| P3.3 | Audit CTA yellow usage (only primary actions) | Align with DESIGN_UPDATE.md. |
| P3.4 | Standardise import alias (`@/` vs `@/app/`) and prefer `logger` over `console` in server code | Consistency. |
| P3.5 | Remove unused imports and variables | Cleaner codebase. |

---

**How to use**: Start with P0; then P1 so lint/TS can be re-enabled; then P2 and P3. The tasklist **`docs/tasklists/TECH_AUDIT_JANUARY__2026-01-30.md`** mirrors this order with checkboxes. TASKLIST and ROADMAP already reference the audit follow-up in the backlog.

---

**Audit performed**: 2026-01-30  
**Next review**: Schedule next tech audit (e.g. end of Q1 2026 or after major dependency upgrades).
