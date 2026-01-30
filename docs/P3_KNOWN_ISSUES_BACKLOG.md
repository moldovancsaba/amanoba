# P3 Known Issues — Backlog

**Purpose**: Track P3 items from Tech Audit Jan 2026 (resolve or ticket).  
**Source**: `docs/2026-01-30_TECH_AUDIT_JANUARY.md` §4.1; tasklist P3.1.

---

## P3.1 — Resolve or ticket

| Item | Location | Status |
|------|----------|--------|
| Profile `highestScore` / `perfectGames` | `app/api/profile/[playerId]/route.ts` — currently hardcoded `0` | Backlog: Add to model/aggregation if needed |
| Admin settings save | `app/[locale]/admin/settings/page.tsx` — TODO: Implement settings save | Backlog |
| System-info uptime | `app/api/admin/system-info/route.ts` | **Done**: Uses `process.uptime()` and `formatUptime()`; returns `uptime` (e.g. "2h 30m") and `uptimeSeconds`. |
| Game status API | `app/[locale]/admin/games/page.tsx` — TODO: Create API endpoint for updating game status | Backlog |
| Challenge retry queue | `app/lib/gamification/session-manager.ts` — TODO Phase 4: Queue challenge progress update for retry | Backlog |

---

## P3.4–P3.5 — Consistency

- **Import alias**: tsconfig has `@/*` → `./*` and `./app/*`; both `@/` and `@/app/` resolve. No bulk change; prefer `@/app/` for app code when disambiguation helps.
- **Logger**: Prefer `logger` over `console` — **done**: `useCourseTranslations` now uses `logger`; app/api had no direct console usage.
- **Unused imports/vars**: Removed or prefixed across app (pages, API routes, lib). Removed: Logo, Users, Lock, QuestionDifficulty, mongoose, Player, LeaderboardEntry, DailyChallenge, CourseProgress, Brand, Course, Lesson, User, z, crypto, redirect, fileToBase64, isCertificationAvailable, etc. Prefixed with `_` where kept intentionally. **ESLint**: `.eslintrc.json` now uses `varsIgnorePattern`/`argsIgnorePattern`/`caughtErrorsIgnorePattern` `^_` for `@typescript-eslint/no-unused-vars`; zero ESLint warnings.

---

**Updated**: 2026-01-28
