# Tech Audit January 2026 — Follow-up Tasklist

**Source**: `docs/2026-01-30_TECH_AUDIT_JANUARY.md`  
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
- [ ] P1.7 (Optional) Re-enable TypeScript errors during build — **progress**: fixed layout, leaderboards, privacy/terms, certificate page, profile page; settings/email (Intl.supportedValuesOf); certificate image routes (CertColors type); admin certification (credentialTitleId, settings cast); admin courses/lessons (Session type, assertCourseAccess); admin export (session guard); admin payments (query dateFilter, createdAt); admin questions batch (correctIndex, ObjectId, trim, error type); admin stats repair (session guard, gameType/finalScore/score, totalWins, earn, currentBalance); Logger overloads (msg, data); tsconfig excludes scripts. Remaining: admin questions/route (filter.$in), admin stats/verify (session, wins→totalWins, balance, earned, createdAt/lastCalculatedAt), admin surveys/translations, auth/courses/payments/profile API routes (ObjectId, model props), lib/auth/components. `ignoreBuildErrors: true` so build passes.
- [x] P1.8 Migrate from deprecated `next lint` to ESLint CLI — **documented**: use `npx @next/codemod@canary next-lint-to-eslint-cli .` when ready; current `next lint` still used

---

## P2 — Deprecated and hardcoded values

- [x] P2.1 Update or remove `baseline-browser-mapping` — **documented**: transitive of autoprefixer → browserslist; run `npm update` to get latest nested deps
- [x] P2.2 Remove extraneous `@emnapi/runtime` — **documented**: transitive dep (required by @emnapi/core in lockfile); leave as-is
- [x] P2.3 Certificate image routes — **done**: already source colors from Brand themeColors when available; defaults in route
- [ ] P2.4 Email service: map hex colors to design tokens or single email theme object (future)
- [ ] P2.5 Admin analytics Recharts: move stroke/fill hex to shared chart theme (future)
- [x] P2.6 Layout themeColor and APP_URL fallbacks — **done**: APP_URL from `app/lib/constants/app-url.ts` (env); themeColor from `THEME_COLOR` (NEXT_PUBLIC_THEME_COLOR or #FAB908)
- [x] P2.7 Plan removal of `assessmentGameId` — **done**: see `docs/ASSESSMENT_GAME_ID_MIGRATION.md`; keep field for backward compatibility

---

## P3 — Known issues, UI, consistency

- [ ] P3.1 Resolve or ticket: profile highestScore/perfectGames, admin settings save, system-info uptime, game status API, challenge retry queue
- [ ] P3.2 Replace admin `<img>` with Next.js `<Image />` (courses, games, rewards pages)
- [ ] P3.3 Audit CTA yellow usage (ensure only primary actions use #FAB908; badges/TOC use neutral)
- [ ] P3.4 Standardise import alias (`@/` vs `@/app/`) and prefer `logger` over `console` in server code
- [ ] P3.5 Remove unused imports and variables (or use underscore prefix where intentional)

---

**Next command (suggested)**: P1.7 (TS in build), P2.4–P2.5 (email/analytics colors), P3 items.
