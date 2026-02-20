# P3 Known Issues — Backlog

**Purpose**: Track P3 items from Tech Audit Jan 2026 (resolve or ticket).  
**Source**: `docs/_archive/delivery/2026-01/2026-01-30_TECH_AUDIT_JANUARY.md` §4.1; tasklist P3.1.

---

## P3.1 — Resolve or ticket

| Item | Location | Status |
|------|----------|--------|
| Profile `highestScore` / `perfectGames` | `app/api/profile/[playerId]/route.ts` | **Done**: Aggregated from PlayerSession (max score; perfect = win + 100% accuracy or score === maxScore). |
| Admin settings save | `app/[locale]/admin/settings/page.tsx` | **Done**: Certification settings and default thumbnail save implemented. |
| System-info uptime | `app/api/admin/system-info/route.ts` | **Done**: Uses `process.uptime()` and `formatUptime()`; returns `uptime` (e.g. "2h 30m") and `uptimeSeconds`. |
| Game status API | `app/[locale]/admin/games/page.tsx` | **Done**: GET /api/admin/games (all games), PATCH /api/admin/games/[gameId] (isActive); admin games page wired. |
| Challenge retry queue | `app/lib/gamification/session-manager.ts` | **Done**: On daily challenge update failure, job enqueued (jobType: challenge); challenge-worker to process jobs is planned. |

---

## P3.4–P3.5 — Consistency

- **Import alias**: tsconfig has `@/*` → `./*` and `./app/*`; both `@/` and `@/app/` resolve. No bulk change; prefer `@/app/` for app code when disambiguation helps.
- **Logger**: Prefer `logger` over `console` — **done**: `useCourseTranslations` now uses `logger`; app/api had no direct console usage.
- **Unused imports/vars**: Removed or prefixed across app (pages, API routes, lib). Removed: Logo, Users, Lock, QuestionDifficulty, mongoose, Player, LeaderboardEntry, DailyChallenge, CourseProgress, Brand, Course, Lesson, User, z, crypto, redirect, fileToBase64, isCertificationAvailable, etc. Prefixed with `_` where kept intentionally. **ESLint**: `.eslintrc.json` now uses `varsIgnorePattern`/`argsIgnorePattern`/`caughtErrorsIgnorePattern` `^_` for `@typescript-eslint/no-unused-vars`; zero ESLint warnings.

---

**Updated**: 2026-01-28
