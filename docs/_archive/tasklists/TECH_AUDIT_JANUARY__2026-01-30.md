# Tech Audit January 2026 — Follow-up Tasklist

**Source**: `docs/_archive/delivery/2026-01/2026-01-30_TECH_AUDIT_JANUARY.md`  
**Created**: 2026-01-30  
**Purpose**: Track remediation of January tech audit findings. Work in order: **P0 → P1 → P2 → P3**.

---

## P0 — Security (do first)

- [x] P0.1 Run `npm audit fix` (then verify build + smoke test)
- [x] P0.2 Evaluate `npm audit fix --force` for Next.js (Next 15.5.11 installed; 1 moderate remains, fix would require Next 16)
- [x] P0.3 Restrict or remove `app/api/debug/player/[playerId]` in production (already returns 404 in prod; comment added)
- [x] P0.4 Move origin allowlist to env (e.g. `ALLOWED_ORIGINS`) in `app/lib/security.ts`
- [x] P0.5 Remove or gate SSO callback DEBUG logs (or gate behind NODE_ENV + debug flag)
- [x] P0.6 Global audit (communication + catalog language integrity) — **done**: catalog verified; transactional emails use `ensureEmailLanguageIntegrity`; **GET /api/email/unsubscribe** HTML responses localized (player.locale for success, Accept-Language for invalid-token; messages in `email.unsubscribe`, en + hu; fallback to en)

---

## P1 — Lint and TypeScript (unblock quality gates)

- [x] P1.1 Fix `Sparkles` undefined in `app/[locale]/achievements/page.tsx` (add import from lucide-react)
- [x] P1.2 Fix unescaped `"` in admin courses page (~line 859) — use `&quot;` or `{'"'}`
- [x] P1.3 Fix remaining critical ESLint errors (undefined refs, unescaped entities) — **done**: all ESLint errors eliminated (no-explicit-any, jsx-no-undef, etc.)
- [x] P1.4 Fix or document React Hook exhaustive-deps — **documented**: left as warnings; intentional run-on-mount / filter-driven fetch pattern
- [x] P1.5 Replace high-impact `any` types — **done**: admin, session-manager, LocaleLink, i18n, API routes typed
- [x] P1.6 Re-enable ESLint during build — **done**: `eslint.ignoreDuringBuilds: false` in next.config.ts; build passes (warnings only)
- [x] P1.7 (Optional) Re-enable TypeScript errors during build — **done**: All application-level TypeScript errors fixed; `npx tsc --noEmit` passes (scripts excluded). **Build now enforces TS**: `typescript.ignoreBuildErrors: false` in next.config.ts (2026-01-28). See `docs/_archive/delivery/2026-01/2026-01-28_TYPESCRIPT_AUDIT_COMPLETE.md`.
- [x] P1.8 Migrate from deprecated `next lint` to ESLint CLI — **documented**: use `npx @next/codemod@canary next-lint-to-eslint-cli .` when ready; current `next lint` still used

---

## P2 — Deprecated and hardcoded values

- [x] P2.1 Update or remove `baseline-browser-mapping` — **documented**: transitive of autoprefixer → browserslist; run `npm update` to get latest nested deps
- [x] P2.2 Remove extraneous `@emnapi/runtime` — **documented**: transitive dep (required by @emnapi/core in lockfile); leave as-is
- [x] P2.3 Certificate image routes — **done**: already source colors from Brand themeColors when available; defaults in route
- [x] P2.4 Email service: map hex colors to design tokens or single email theme object — **done**: `EMAIL_TOKENS.ctaBg` uses `NEXT_PUBLIC_THEME_COLOR` or #FAB908
- [x] P2.5 Admin analytics Recharts: move stroke/fill hex to shared chart theme — **done**: `CHART_THEME` in admin analytics page
- [x] P2.6 Layout themeColor and APP_URL fallbacks — **done**: APP_URL from `app/lib/constants/app-url.ts` (env); themeColor from `THEME_COLOR` (NEXT_PUBLIC_THEME_COLOR or #FAB908)
- [x] P2.7 Plan removal of `assessmentGameId` — **done**: see `docs/ASSESSMENT_GAME_ID_MIGRATION.md`; keep field for backward compatibility

---

## P3 — Known issues, UI, consistency

- [x] P3.1 Resolve or ticket: profile highestScore/perfectGames, admin settings save, system-info uptime, game status API, challenge retry queue — **done**: backlog in `docs/P3_KNOWN_ISSUES_BACKLOG.md`
- [x] P3.2 Replace admin `<img>` with Next.js `<Image />` — **done**: admin settings, rewards, games, courses list, course editor
- [x] P3.3 Audit CTA yellow usage (ensure only primary actions use #FAB908; badges/TOC use neutral) — **done**: `docs/_archive/delivery/2026-01/2026-01-28_CTA_YELLOW_AUDIT.md`; admin rewards/games badges → neutral
- [x] P3.4 Standardise import alias (`@/` vs `@/app/`) and prefer `logger` over `console` in server code — **documented**: alias convention in P3 backlog; logger preference backlog
- [x] P3.5 Remove unused imports and variables — **done**: removed Logo, Users, Lock, Trophy, Calendar, Award, TrendingUp, Play, MdGpsFixed/MdComplete/MdCalendar, redirect; _prefix for intentional unused

---

**Follow-up (2026-01-28)**: Remaining non-admin `<img>` replaced with Next.js `<Image />` (dashboard, courses, my-courses, course detail, PlayerAvatar). Unused imports/vars removed or prefixed across app/api and app/lib. `useCourseTranslations` now uses `logger` instead of `console.error`. **ESLint**: Added `@typescript-eslint/no-unused-vars` with `argsIgnorePattern`/`varsIgnorePattern`/`caughtErrorsIgnorePattern` `^_` in `.eslintrc.json`; fixed remaining no-unused-vars, anonymous default export (achievement-worker), and GoogleAnalytics beforeInteractive (eslint-disable with comment). **`npx next lint` now reports zero ESLint warnings or errors.** **P1.7 remaining**: TypeScript enforced during build — `next.config.ts` has `typescript: { ignoreBuildErrors: false }`; fixed build-time type errors (dashboard Image alt, madoku catch, profile certificate _locale usage); `npm run build` passes.
