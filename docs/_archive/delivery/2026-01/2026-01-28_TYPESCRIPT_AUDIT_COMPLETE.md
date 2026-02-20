# TypeScript Audit — Application Code (Complete)

**Date**: 2026-01-28  
**Scope**: Application code under `app/`, `auth.ts`, `components/`, `middleware.ts`; `scripts/` excluded from `tsconfig.json`  
**Status**: ✅ **Complete** — `npx tsc --noEmit` passes with 0 errors

---

## Summary

All TypeScript errors in application code were fixed so that the project compiles with strict TypeScript checking. As of 2026-01-28 the build enforces TypeScript: `next.config.ts` has `typescript: { ignoreBuildErrors: false }`; `npm run build` fails on type errors. Running `npx tsc --noEmit` locally or in CI passes for app code (scripts excluded).

---

## Scope and approach

- **Included**: `app/**/*`, `auth.ts`, `components/**/*`, `middleware.ts`, `types/**/*` (per `tsconfig.json` include).
- **Excluded**: `scripts/` (excluded in `tsconfig.json`) — scripts remain untyped for now.
- **Strategy**: Minimal, targeted fixes: session guards, document/lean types, Mongoose `ObjectId` and pipeline casts, Stripe/callback types, and explicit types for API responses and logger. No large refactors.

---

## Fixes by area

### API routes

- **Day route** (`app/api/courses/[courseId]/day/[dayNumber]/route.ts`): Added `import mongoose from 'mongoose'` for `mongoose.Types.ObjectId`.
- **Payments**
  - **create-checkout**: Typed `player` as `PlayerDoc`; fixed duplicate `normalizedCourseId` (assignment instead of redeclaration).
  - **webhook**: Initialized `event` as `undefined`; introduced `DocWithObjectId` for `player`/`transaction`; used `(session.customer_details as { ip_address?: string })?.ip_address`.
- **Admin**: surveys (string keys for `answerCounts`), SSO callback (claims/error types), certification start/submit (ObjectId, `attempt._id`, `assessmentResults` as `Map`), enroll/quiz-submit (player `_id`), recommendations (player.interests), feature-flags (features), games/quizzz (options as `string[]`), certificate-status (assessmentResults Map), referrals, surveys/onboarding (player/surveyResponse `_id`).
- **Profile courses**: Populated `courseId` typed as `PopulatedCourse` for `courseId`/`name`/`language`.

### Lib

- **auth/sso.ts**: `mapSSORole(roleValue as string | string[] | undefined)`.
- **certification.ts**: `new mongoose.Types.ObjectId(String(poolCourse._id))`.
- **courses/email-scheduler.ts**: `PlayerDoc`/`CourseDoc`, guards for `_id`, `resolveLessonForChildDay(course as unknown as ICourse)`, `progressWithLessons` for `lessonsCompleted`, `progress.lessonsCompleted` cast.
- **gamification**
  - **achievement-engine**: Casts via `unknown` for `IAchievement`; corrected `grouped` Map value type; `unlockedAt` optional.
  - **leaderboard-calculator**: Pipeline cast `as unknown as PipelineStage[]` for all `aggregate()` calls.
  - **progressive-disclosure**: `statistics`/`achievements` cast for partial progression; `previousProgression`/`currentProgression` cast to `IPlayerProgression` for `isFeatureUnlocked`.
- **session-manager**: `IGameBrandConfig` cast; typed `newAchievements`/`AchItem`; `progression.statistics` uses `totalWins`/`totalLosses`/`totalDraws`; `sessionId`/`gameId` and job payload types; `markFailed` cast via `unknown`.
- **logger.ts**: `msg` and `data` typed so `formatMessage(level, msg, data)` receives `string` and optional `LogData`.
- **hooks/useCourseTranslations**: `value` as `unknown` in `getNestedValue`; `loadTranslations` return and cache typed as `Translations`.
- **i18n/translation-service**: `result[namespace]` / `result[actualNamespace]` cast to `Record<string, unknown>` for `setNestedValue`.
- **queue**
  - **job-queue-manager**: `jobs as unknown as IJobQueue[]` for fetch return types.
  - **job-queue model**: `calculateNextRetry` cast via `unknown`.
  - **final-exam-attempt**: `answers` schema uses `Schema.Types.Mixed` (not array of Mixed).
  - **achievement-worker**: `achievement.code` fallback and `markFailed` cast via `unknown`.
  - **leaderboard-worker**: Uses `fetchPendingJobs`; `JobQueue` for complete/retry; `jobType` + `playerId` + payload for `enqueueJob`; return type `string` (job id); payload cast for `Record<string, unknown>`.

### Auth, components, middleware

- **auth.ts**: `session.user.locale` and `session.user.ssoSub` (e.g. `?? undefined`, locale as `'en' | 'hu'`).
- **components/Icon.tsx**: `ReactIconType` → `IconType` from `react-icons`.
- **LocaleLink.tsx**: `href.pathname` guarded with `pathname = href.pathname ?? ''`.
- **middleware.ts**: `locale` narrowed to `Locale` (`'en' | 'hu'`) when assigning from pathname.

---

## Verification

```bash
npx tsc --noEmit
# Exit code 0; no output
```

Build remains unchanged: `npm run build` still passes with `typescript.ignoreBuildErrors: true`. To enforce TypeScript in the build, set `typescript.ignoreBuildErrors: false` in `next.config.ts` after confirming CI and local builds pass.

---

## Related docs

- **Tech audit**: `docs/_archive/delivery/2026-01/2026-01-30_TECH_AUDIT_JANUARY.md` §3 (Lint/TS).
- **Tasklist**: `docs/_archive/tasklists/TECH_AUDIT_JANUARY__2026-01-30.md` — P1.7 marked complete.
- **Release**: `docs/product/RELEASE_NOTES.md` — v2.9.21 TypeScript audit.
