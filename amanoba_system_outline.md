# Amanoba System Outline — Table of Contents

**Purpose**: Single reference for all functions, API handlers, components, and models in the Amanoba codebase.  
**Generated**: 2026-01-31

---

## Table of Contents (high-level)

1. [Auth & Middleware](#1-auth--middleware)
2. [App — Pages (route entry points)](#2-app--pages-route-entry-points)
3. [App — API Routes](#3-app--api-routes)
4. [App — Lib (shared logic)](#4-app--lib-shared-logic)
5. [App — Components](#5-app--components)
6. [Root components](#6-root-components)
7. [Models (Mongoose)](#7-models-mongoose)

---

## 1. Auth & Middleware

| Location | Export / function | Description |
|----------|-------------------|-------------|
| `auth.ts` | `handlers`, `auth`, `signIn`, `signOut` | NextAuth instance; callbacks: signIn, jwt, session |
| `middleware.ts` | `default` | Auth-wrapped middleware (i18n, route protection, locale) |

---

## 2. App — Pages (route entry points)

Pages are React components (default export) under `app/[locale]/` or `app/`. Listed by URL path.

| Route path | File | Notes |
|------------|------|--------|
| `/[locale]` | `app/[locale]/page.tsx` | Home |
| `/[locale]/achievements` | `app/[locale]/achievements/page.tsx` | |
| `/[locale]/admin` | `app/[locale]/admin/page.tsx` | |
| `/[locale]/admin/achievements` | `app/[locale]/admin/achievements/page.tsx` | |
| `/[locale]/admin/achievements/[achievementId]` | `app/[locale]/admin/achievements/[achievementId]/page.tsx` | |
| `/[locale]/admin/achievements/new` | `app/[locale]/admin/achievements/new/page.tsx` | |
| `/[locale]/admin/analytics` | `app/[locale]/admin/analytics/page.tsx` | |
| `/[locale]/admin/certificates` | `app/[locale]/admin/certificates/page.tsx` | |
| `/[locale]/admin/challenges` | `app/[locale]/admin/challenges/page.tsx` | |
| `/[locale]/admin/courses` | `app/[locale]/admin/courses/page.tsx` | |
| `/[locale]/admin/courses/[courseId]` | `app/[locale]/admin/courses/[courseId]/page.tsx` | Course editor; includes `LessonFormModal`, `QuizManagerModal` |
| `/[locale]/admin/courses/new` | `app/[locale]/admin/courses/new/page.tsx` | |
| `/[locale]/admin/email-analytics` | `app/[locale]/admin/email-analytics/page.tsx` | |
| `/[locale]/admin/feature-flags` | `app/[locale]/admin/feature-flags/page.tsx` | |
| `/[locale]/admin/games` | `app/[locale]/admin/games/page.tsx` | |
| `/[locale]/admin/payments` | `app/[locale]/admin/payments/page.tsx` | |
| `/[locale]/admin/players` | `app/[locale]/admin/players/page.tsx` | |
| `/[locale]/admin/questions` | `app/[locale]/admin/questions/page.tsx` | |
| `/[locale]/admin/quests` | `app/[locale]/admin/quests/page.tsx` | |
| `/[locale]/admin/rewards` | `app/[locale]/admin/rewards/page.tsx` | |
| `/[locale]/admin/settings` | `app/[locale]/admin/settings/page.tsx` | |
| `/[locale]/admin/surveys` | `app/[locale]/admin/surveys/page.tsx` | |
| `/[locale]/admin/votes` | `app/[locale]/admin/votes/page.tsx` | |
| `/[locale]/auth/error` | `app/[locale]/auth/error/page.tsx` | |
| `/[locale]/auth/signin` | `app/[locale]/auth/signin/page.tsx` | |
| `/[locale]/certificate/[slug]` | `app/[locale]/certificate/[slug]/page.tsx` | Public cert verification |
| `/[locale]/certificate/[slug]` layout | `app/[locale]/certificate/[slug]/layout.tsx` | `generateMetadata` |
| `/[locale]/certificate/verify/[playerId]/[courseId]` | `app/[locale]/certificate/verify/[playerId]/[courseId]/page.tsx` | Legacy verify |
| `/[locale]/challenges` | `app/[locale]/challenges/page.tsx` | |
| `/[locale]/courses` | `app/[locale]/courses/page.tsx` | |
| `/[locale]/courses/[courseId]` | `app/[locale]/courses/[courseId]/page.tsx` | Course detail; layout has `generateMetadata` |
| `/[locale]/courses/[courseId]/day/[dayNumber]` | `app/[locale]/courses/[courseId]/day/[dayNumber]/page.tsx` | Lesson |
| `/[locale]/courses/[courseId]/day/[dayNumber]/quiz` | `app/[locale]/courses/[courseId]/day/[dayNumber]/quiz/page.tsx` | Quiz |
| `/[locale]/courses/[courseId]/final-exam` | `app/[locale]/courses/[courseId]/final-exam/page.tsx` | |
| `/[locale]/dashboard` | `app/[locale]/dashboard/page.tsx` | |
| `/[locale]/data-deletion` | `app/[locale]/data-deletion/page.tsx` | |
| `/[locale]/games` | `app/[locale]/games/page.tsx` | |
| `/[locale]/games/madoku` | `app/[locale]/games/madoku/page.tsx` | |
| `/[locale]/games/memory` | `app/[locale]/games/memory/page.tsx` | |
| `/[locale]/games/quizzz` | `app/[locale]/games/quizzz/page.tsx` | |
| `/[locale]/games/sudoku` | `app/[locale]/games/sudoku/page.tsx` | |
| `/[locale]/games/whackpop` | `app/[locale]/games/whackpop/page.tsx` | |
| `/[locale]/leaderboards` | `app/[locale]/leaderboards/page.tsx` | |
| `/[locale]/my-courses` | `app/[locale]/my-courses/page.tsx` | |
| `/[locale]/onboarding` | `app/[locale]/onboarding/page.tsx` | |
| `/[locale]/partners` | `app/[locale]/partners/page.tsx` | |
| `/[locale]/privacy` | `app/[locale]/privacy/page.tsx` | Includes `List`, `SectionBlock` |
| `/[locale]/profile/[playerId]` | `app/[locale]/profile/[playerId]/page.tsx` | |
| `/[locale]/profile/[playerId]/certificate/[courseId]` | `app/[locale]/profile/[playerId]/certificate/[courseId]/page.tsx` | Certificate page |
| `/[locale]/quests` | `app/[locale]/quests/page.tsx` | |
| `/[locale]/rewards` | `app/[locale]/rewards/page.tsx` | |
| `/[locale]/settings/email` | `app/[locale]/settings/email/page.tsx` | |
| `/[locale]/stats` | `app/[locale]/stats/page.tsx` | |
| `/[locale]/terms` | `app/[locale]/terms/page.tsx` | |

---

## 3. App — API Routes

Each row is a route file; columns list HTTP method handlers (exported async functions).

### 3.1 Admin

| Path | GET | POST | PATCH | DELETE | Other |
|------|-----|------|-------|--------|-------|
| `api/admin/access/route.ts` | ✓ | | | | |
| `api/admin/achievements/route.ts` | ✓ | ✓ | | | |
| `api/admin/achievements/[achievementId]/route.ts` | ✓ | | ✓ | ✓ | |
| `api/admin/analytics/route.ts` | ✓ | | | | |
| `api/admin/analytics/realtime/route.ts` | ✓ | | | | |
| `api/admin/brands/route.ts` | ✓ | | | | |
| `api/admin/ccs/route.ts` | ✓ | ✓ | | | |
| `api/admin/ccs/[ccsId]/route.ts` | ✓ | | ✓ | ✓ | |
| `api/admin/certificates/route.ts` | ✓ | | | | |
| `api/admin/certificates/[slug]/route.ts` | | | ✓ | | |
| `api/admin/certification/settings/route.ts` | ✓ | | ✓ | | |
| `api/admin/challenges/route.ts` | ✓ | | | | |
| `api/admin/courses/route.ts` | ✓ | ✓ | | | |
| `api/admin/courses/[courseId]/route.ts` | ✓ | | ✓ | ✓ | |
| `api/admin/courses/[courseId]/export/route.ts` | ✓ | | | | |
| `api/admin/courses/[courseId]/fork/route.ts` | | ✓ | | | |
| `api/admin/courses/[courseId]/import/route.ts` | | ✓ | | | |
| `api/admin/courses/[courseId]/lessons/route.ts` | ✓ | ✓ | | | |
| `api/admin/courses/[courseId]/lessons/[lessonId]/route.ts` | ✓ | | ✓ | ✓ | |
| `api/admin/courses/[courseId]/lessons/[lessonId]/quiz/route.ts` | ✓ | ✓ | | | |
| `api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]/route.ts` | | | ✓ | ✓ | |
| `api/admin/courses/[courseId]/lessons/[lessonId]/quiz/[questionId]/permanent/route.ts` | | | | ✓ | |
| `api/admin/courses/[courseId]/sync/route.ts` | | ✓ | | | |
| `api/admin/courses/[courseId]/sync-status/route.ts` | ✓ | | | | |
| `api/admin/courses/[courseId]/unsync/route.ts` | | ✓ | | | |
| `api/admin/email-analytics/route.ts` | ✓ | | | | |
| `api/admin/feature-flags/route.ts` | ✓ | | ✓ | | |
| `api/admin/games/route.ts` | ✓ | | | | |
| `api/admin/games/[gameId]/route.ts` | | | ✓ | | |
| `api/admin/leaderboards/recalculate/route.ts` | ✓ | ✓ | | | |
| `api/admin/payments/route.ts` | ✓ | | | | |
| `api/admin/players/route.ts` | ✓ | | | | |
| `api/admin/questions/route.ts` | ✓ | ✓ | | | |
| `api/admin/questions/batch/route.ts` | | ✓ | | | |
| `api/admin/questions/[questionId]/route.ts` | ✓ | | ✓ | ✓ | |
| `api/admin/quests/route.ts` | ✓ | | | | |
| `api/admin/rewards/route.ts` | ✓ | ✓ | | | |
| `api/admin/rewards/[rewardId]/route.ts` | ✓ | | ✓ | ✓ | |
| `api/admin/settings/default-thumbnail/route.ts` | ✓ | ✓ | | ✓ | |
| `api/admin/stats/route.ts` | ✓ | | | | |
| `api/admin/stats/repair/route.ts` | | ✓ | | | |
| `api/admin/stats/verify/route.ts` | ✓ | | | | |
| `api/admin/surveys/route.ts` | ✓ | | ✓ | | |
| `api/admin/system-info/route.ts` | ✓ | | | | |
| `api/admin/translations/route.ts` | ✓ | ✓ | | | |
| `api/admin/upload-image/route.ts` | | ✓ | | | |
| `api/admin/votes/aggregates/route.ts` | ✓ | | | | |

### 3.2 Auth

| Path | GET | POST | PATCH | DELETE | Other |
|------|-----|------|-------|--------|-------|
| `api/auth/[...nextauth]/route.ts` | (NextAuth handlers) | | | | |
| `api/auth/anonymous/route.ts` | | ✓ | | | |
| `api/auth/sso/login/route.ts` | ✓ | | | | |
| `api/auth/sso/callback/route.ts` | ✓ | | | | |
| `api/auth/sso/logout/route.ts` | ✓ | ✓ | | | |

### 3.3 Certification & Certificates

| Path | GET | POST | PATCH | DELETE | Other |
|------|-----|------|-------|--------|-------|
| `api/certification/entitlement/route.ts` | ✓ | | | | |
| `api/certification/entitlement/purchase/route.ts` | | ✓ | | | |
| `api/certification/entitlement/redeem-points/route.ts` | | ✓ | | | |
| `api/certification/final-exam/start/route.ts` | | ✓ | | | |
| `api/certification/final-exam/answer/route.ts` | | ✓ | | | |
| `api/certification/final-exam/submit/route.ts` | | ✓ | | | |
| `api/certification/final-exam/discard/route.ts` | | ✓ | | | |
| `api/certificates/[slug]/route.ts` | ✓ | | ✓ | | |
| `api/certificates/[slug]/image/route.tsx` | ✓ | | | | (ImageResponse) |

### 3.4 Courses & Learning

| Path | GET | POST | PATCH | DELETE | Other |
|------|-----|------|-------|--------|-------|
| `api/courses/route.ts` | ✓ | | | | |
| `api/courses/[courseId]/route.ts` | ✓ | | | | |
| `api/courses/[courseId]/day/[dayNumber]/route.ts` | ✓ | ✓ | | | |
| `api/courses/[courseId]/enroll/route.ts` | | ✓ | | | |
| `api/courses/[courseId]/lessons/route.ts` | ✓ | | | | |
| `api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts` | | ✓ | | | |
| `api/courses/[courseId]/discussion/route.ts` | ✓ | ✓ | | | |
| `api/courses/[courseId]/discussion/[postId]/route.ts` | | | ✓ | ✓ | |
| `api/courses/[courseId]/study-groups/route.ts` | ✓ | ✓ | | | |
| `api/courses/[courseId]/study-groups/[groupId]/join/route.ts` | | ✓ | | | |
| `api/courses/[courseId]/study-groups/[groupId]/leave/route.ts` | | ✓ | | | |
| `api/courses/[courseId]/study-groups/[groupId]/members/route.ts` | ✓ | | | | |
| `api/courses/recommendations/route.ts` | ✓ | | | | |
| `api/my-courses/route.ts` | ✓ | | | | |

### 3.5 Profile & Player

| Path | GET | POST | PATCH | DELETE | Other |
|------|-----|------|-------|--------|-------|
| `api/profile/route.ts` | ✓ | | ✓ | | |
| `api/profile/[playerId]/route.ts` | ✓ | | | | |
| `api/profile/[playerId]/certificate-status/route.ts` | ✓ | | | | |
| `api/profile/[playerId]/certificate/[courseId]/image/route.tsx` | ✓ | | | | (ImageResponse) |
| `api/profile/[playerId]/courses/route.ts` | ✓ | | | | |
| `api/profile/photo/route.ts` | | ✓ | | | |
| `api/players/[playerId]/route.ts` | ✓ | | | | |
| `api/players/[playerId]/achievements/route.ts` | ✓ | | | | |
| `api/players/[playerId]/rank/route.ts` | ✓ | | | | |

### 3.6 Payments & Rewards

| Path | GET | POST | PATCH | DELETE | Other |
|------|-----|------|-------|--------|-------|
| `api/payments/create-checkout/route.ts` | | ✓ | | | |
| `api/payments/history/route.ts` | ✓ | | | | |
| `api/payments/success/route.ts` | ✓ | | | | |
| `api/payments/webhook/route.ts` | | ✓ | | | |
| `api/rewards/route.ts` | ✓ | ✓ | | | |

### 3.7 Games & Quizzz

| Path | GET | POST | PATCH | DELETE | Other |
|------|-----|------|-------|--------|-------|
| `api/games/route.ts` | ✓ | | | | |
| `api/games/quizzz/questions/route.ts` | ✓ | | | | |
| `api/games/quizzz/questions/answers/route.ts` | ✓ | | | | |
| `api/games/quizzz/questions/track/route.ts` | | ✓ | | | |
| `api/games/whackpop/emojis/route.ts` | ✓ | | | | |
| `api/game-sessions/start/route.ts` | | ✓ | | | |
| `api/game-sessions/complete/route.ts` | | ✓ | | | |
| `api/challenges/route.ts` | ✓ | | | | |
| `api/leaderboards/[gameId]/route.ts` | ✓ | | | | |
| `api/leaderboards/course/[courseId]/route.ts` | ✓ | | | | |

### 3.8 Email, Surveys, Translations, Cron, Other

| Path | GET | POST | PATCH | DELETE | Other |
|------|-----|------|-------|--------|-------|
| `api/email/click/[messageId]/route.ts` | ✓ | | | | |
| `api/email/open/[messageId]/route.ts` | ✓ | | | | |
| `api/email/unsubscribe/route.ts` | ✓ | ✓ | | | |
| `api/surveys/onboarding/route.ts` | ✓ | ✓ | | | |
| `api/translations/route.ts` | ✓ | | | | |
| `api/referrals/route.ts` | ✓ | ✓ | ✓ | | |
| `api/votes/route.ts` | ✓ | ✓ | | | |
| `api/feature-flags/route.ts` | ✓ | | | | |
| `api/health/route.ts` | ✓ | | | | |
| `api/quests/route.ts` | ✓ | | | | |
| `api/cron/send-daily-lessons/route.ts` | ✓ | ✓ | | | |
| `api/cron/analytics-snapshot/route.ts` | | ✓ | | | |
| `api/cron/calculate-leaderboards/route.ts` | ✓ | ✓ | | | |
| `api/debug/player/[playerId]/route.ts` | ✓ | | | | |

---

## 4. App — Lib (shared logic)

Functions listed by file; only **exported** functions are included.

### 4.1 Analytics

| File | Functions |
|------|-----------|
| `app/lib/analytics/ga-events.ts` | `trackGAEvent` |
| `app/lib/analytics/event-logger.ts` | `logEvent`, `logPlayerRegistration`, `logGamePlayed`, `logAchievementUnlocked`, `logPointsTransaction`, `logLevelUp`, `logStreakEvent`, `logChallengeCompleted`, `logQuestEvent`, `logRewardRedemption`, `logAuthEvent`, `logSystemEvent`, `getEventContextFromRequest` |
| `app/lib/analytics/aggregation-pipelines.ts` | `aggregateActiveUsers`, `aggregateGameSessions`, `aggregateRevenue`, `aggregateRetentionCohorts`, `aggregateEngagement`, `aggregateConversions` |

### 4.2 Auth & RBAC

| File | Functions |
|------|-----------|
| `app/lib/auth/sso.ts` | `getSSOConfig`, `getJWKSSet`, `validateSSOToken`, `mapSSORole`, `extractSSOUserInfo` |
| `app/lib/rbac.ts` | `isAdmin`, `hasRole`, `requireAuth`, `requireAdmin`, `getAdminApiActor`, `requireRole`, `getUserRole`, `getPlayerIdFromSession`, `hasEditorAccess`, `requireAdminOrEditor`, `canAccessCourse` |

### 4.3 Certification

| File | Functions |
|------|-----------|
| `app/lib/certification.ts` | `resolvePoolCourse`, `getCertificationPoolCount`, `getCertQuestionLimit`, `isCertificationAvailable`, `mapDesignTemplateIdToRender`, `resolveTemplateVariantAtIssue` |

### 4.4 Constants & Helpers

| File | Functions |
|------|-----------|
| `app/lib/constants/app-url.ts` | `getAuthBaseUrl` |
| `app/lib/constants/certificate-strings.ts` | `getCertificateStrings`, `formatCertificateDate` |
| `app/lib/course-helpers.ts` | `getParentCourse`, `getChildSyncStatus`, `reSyncChildFromParent`, `resolveLessonForChildDay` |
| `app/lib/course-recommendations.ts` | `getCourseRecommendations` |
| `app/lib/content-votes.ts` | `resetVotesForLesson` |

### 4.5 Courses (email scheduler)

| File | Functions |
|------|-----------|
| `app/lib/courses/email-scheduler.ts` | `sendDailyLessons`, `sendCatchUpEmails` |

### 4.6 Email

| File | Functions |
|------|-----------|
| `app/lib/email/email-localization.ts` | `renderLessonUnsubscribeFooterHtml`, `renderPaymentUnsubscribeFooterHtml`, `renderWelcomeEmailHtml`, `renderWelcomeEmailSubject`, `renderCompletionEmailHtml`, `renderCompletionEmailSubject`, `renderReminderEmailHtml`, `renderReminderEmailSubject`, `renderPaymentConfirmationEmail` |
| `app/lib/email/email-service.ts` | `sendLessonEmail`, `sendWelcomeEmail`, `sendCompletionEmail`, `sendReminderEmail`, `sendPaymentConfirmationEmail` |

### 4.7 Gamification

| File | Functions |
|------|-----------|
| `app/lib/gamification/achievement-engine.ts` | `checkAndUnlockAchievements`, `evaluateAchievementCriteria`, `getAchievementCompletionRate`, `getPlayerAchievementsByCategory`, `checkAndUnlockCourseAchievements`, `checkAndUnlockCourseCompletionAchievements` |
| `app/lib/gamification/session-manager.ts` | `startGameSession`, `completeGameSession`, `abandonGameSession` |
| `app/lib/gamification/points-calculator.ts` | `calculatePoints`, `calculateConsolationPoints`, `validatePointsInput` |
| `app/lib/gamification/xp-progression.ts` | `calculateXP`, `calculateXPToNextLevel`, `processXPGain`, `getLevelUpRewards`, `estimateGamesToNextLevel`, `getLevelProgressPercentage`, `calculateTotalXP` |
| `app/lib/gamification/progressive-disclosure.ts` | `isFeatureUnlocked`, `getUnlockedFeatures`, `getLockedFeaturesWithProgress`, `getNewlyUnlockedFeatures`, `getNextFeatureToUnlock`, `getOnboardingChecklist` |
| `app/lib/gamification/daily-challenge-tracker.ts` | `updateDailyChallengeProgress` |
| `app/lib/gamification/daily-challenge-service.ts` | `ensureDailyChallengesForToday` |
| `app/lib/gamification/leaderboard-calculator.ts` | `calculateLeaderboard`, `calculateAllLeaderboards` |
| `app/lib/gamification/elo-calculator.ts` | `calculateEloChange`, `getKFactor`, `getAiElo`, `getEloRank`, `getEloIcon`, `getGameResult` |
| `app/lib/gamification/streak-manager.ts` | `updateWinStreak`, `updateDailyLoginStreak`, `getPlayerStreaks`, `expireOldStreaks` |

### 4.8 Games (engines)

| File | Functions |
|------|-----------|
| `app/lib/games/madoku-engine.ts` | `applyGhost`, `createInitialState`, `getAvailableMoves`, `isValidMove`, `executeMove`, `cloneGameState`, `getGameResult` |
| `app/lib/games/madoku-ai.ts` | `findBestMove`, `getRandomAIPersona` |
| `app/lib/games/sudoku-engine.ts` | `createEmptyGrid`, `cloneGrid`, `isValidPlacement`, `generateSolution`, `generatePuzzle`, `solvePuzzle`, `validatePuzzle`, `getHint`, `isPuzzleComplete`, `getCandidates`, `getCompletionPercentage`, `getDifficultyScore` |
| `app/lib/games/memory-engine.ts` | `getDifficultyConfig`, `initializeGame`, `flipCard`, `checkMatch`, `resetFlippedCards`, `calculateScore`, `updateTime`, `togglePause`, `getGameStats` |
| `app/lib/games/ghost-config.ts` | `getGhostTierByPercentile`, `getRecommendedMadokuSettings` |

### 4.9 Hooks & i18n

| File | Functions |
|------|-----------|
| `app/lib/hooks/useCourseTranslations.ts` | `useCourseTranslations` |
| `app/lib/hooks/useDebounce.ts` | `useDebounce` |
| `app/lib/i18n/translation-service.ts` | `getTranslationsForLocale`, `seedTranslations` |
| `app/lib/utils/course-i18n.ts` | `resolveCourseNameForLocale`, `resolveCourseDescriptionForLocale` |

### 4.10 Logger, MongoDB, Queue

| File | Functions |
|------|-----------|
| `app/lib/logger.ts` | `createLogger` |
| `app/lib/mongodb.ts` | `disconnectDB`, `getConnectionState`, `isDbConnected` |
| `app/lib/queue/job-queue-manager.ts` | `enqueueJob`, `fetchPendingJobs`, `getQueueHealth`, `cleanupCompletedJobs`, `getFailedJobs`, `retryFailedJob` |
| `app/lib/queue/workers/achievement-worker.ts` | `processAchievementJob`, `processAchievementBatch`, `startAchievementWorker` |
| `app/lib/queue/workers/leaderboard-worker.ts` | `processLeaderboardJob`, `startLeaderboardWorker`, `enqueueLeaderboardUpdate`, `enqueueAllLeaderboardsUpdate` |

### 4.11 Quality & Security

| File | Functions |
|------|-----------|
| `app/lib/quality/language-integrity.ts` | `validateLessonTextLanguageIntegrity`, `validateLessonRecordLanguageIntegrity` |
| `app/lib/security.ts` | `checkRateLimit`, `getCorsHeaders`, `sanitizeString`, `sanitizeObject`, `isValidEmail`, `isValidUrl`, `isValidObjectId`, `generateSecureToken`, `hashString`, `getBearerToken`, `logSecurityEvent`, `secureCompare`, `isValidOrigin`, `verifyWebhookSignature` |

### 4.12 Utils

| File | Functions |
|------|-----------|
| `app/lib/utils/anonymous-auth.ts` | `getRandomGuestUsername`, `createAnonymousPlayer`, `convertAnonymousToRegistered` |
| `app/lib/utils/cn.ts` | `cn` |
| `app/lib/utils/imgbb.ts` | `uploadToImgBB`, `fileToBase64` |
| `app/lib/utils/stripe-minimums.ts` | `getStripeMinimum`, `meetsStripeMinimum`, `getFormattedMinimum` |

---

## 5. App — Components

| File | Default export | Other exports |
|------|----------------|---------------|
| `app/components/AnonymousLoginButton.tsx` | — | `AnonymousLoginButton` |
| `app/components/CourseDiscussion.tsx` | `CourseDiscussion` | — |
| `app/components/CourseStudyGroups.tsx` | `CourseStudyGroups` | — |
| `app/components/LessonQuiz.tsx` | `LessonQuiz` | — |
| `app/components/PlayerAvatar.tsx` | `PlayerAvatar` | `PlayerAvatarWithName`, `PlayerAvatarList` |
| `app/components/ReferralCard.tsx` | — | `ReferralCard` |
| `app/components/ThemeToggle.tsx` | — | `ThemeToggle` |
| `app/components/session-provider.tsx` | `SessionProvider` | — |
| `app/components/sign-out-button.tsx` | `SignOutButton` | — |
| `app/components/providers/ConsentProvider.tsx` | — | `ConsentProvider`, `useConsent` |
| `app/components/providers/ThemeProvider.tsx` | — | `ThemeProvider` |
| `app/components/games/MemoryGame.tsx` | `MemoryGame` | — |
| `app/components/ui/button.tsx` | (UI primitives) | — |
| `app/components/ui/card.tsx` | — | — |
| `app/components/ui/rich-text-editor.tsx` | `RichTextEditor` | — |

---

## 6. Root components

| File | Default export | Other exports |
|------|----------------|---------------|
| `components/ContentVoteWidget.tsx` | `ContentVoteWidget` | — |
| `components/CookieConsentBanner.tsx` | `CookieConsentBanner` | — |
| `components/CourseDiscussion.tsx` | `CourseDiscussion` | — |
| `components/CourseStudyGroups.tsx` | `CourseStudyGroups` | — |
| `components/GoogleAnalytics.tsx` | `GoogleAnalytics` | — |
| `components/Icon.tsx` | `Icon` | — |
| `components/LanguageSwitcher.tsx` | `LanguageSwitcher` | — |
| `components/LocaleLink.tsx` | — | `LocaleLink` |
| `components/Logo.tsx` | `Logo` | — |

---

## 7. Models (Mongoose)

All models live under `app/lib/models/` and are re-exported from `app/lib/models/index.ts`.

| Model | Interface | File |
|-------|-----------|------|
| Brand | IBrand | brand.ts |
| Game | IGame, GameType | game.ts |
| GameBrandConfig | IGameBrandConfig | game-brand-config.ts |
| Player | IPlayer | player.ts |
| PlayerSession | IPlayerSession | player-session.ts |
| PlayerProgression | IPlayerProgression | player-progression.ts |
| PointsWallet | IPointsWallet | points-wallet.ts |
| PointsTransaction | IPointsTransaction | points-transaction.ts |
| PaymentTransaction | IPaymentTransaction, PaymentStatus | payment-transaction.ts |
| Achievement | IAchievement | achievement.ts |
| AchievementUnlock | IAchievementUnlock | achievement-unlock.ts |
| Streak | IStreak | streak.ts |
| LeaderboardEntry | ILeaderboardEntry | leaderboard-entry.ts |
| Reward | IReward | reward.ts |
| RewardRedemption | IRewardRedemption | reward-redemption.ts |
| EventLog | IEventLog | event-log.ts |
| AnalyticsSnapshot | IAnalyticsSnapshot | analytics-snapshot.ts |
| SystemVersion | ISystemVersion | system-version.ts |
| EmailActivity | IEmailActivity, EmailType, EmailSegment | email-activity.ts |
| ReferralTracking | IReferralTracking | referral-tracking.ts |
| Certificate | ICertificate | certificate.ts |
| CertificateEntitlement | ICertificateEntitlement | certificate-entitlement.ts |
| FinalExamAttempt | IFinalExamAttempt, FinalExamStatus | final-exam-attempt.ts |
| CertificationSettings | ICertificationSettings | certification-settings.ts |
| AnonymousNameWord | IAnonymousNameWord | anonymous-name-word.ts |
| GuestUsername | IGuestUsername | guest-username.ts |
| DailyChallenge, PlayerChallengeProgress | IDailyChallenge, IPlayerChallengeProgress, ChallengeType, ChallengeDifficulty | daily-challenge.ts |
| Quest, PlayerQuestProgress | IQuest, IPlayerQuestProgress, IQuestStep, QuestCategory, QuestStepType, StepDependency | quest.ts |
| QuizQuestion | IQuizQuestion, QuestionDifficulty, QuestionType | quiz-question.ts |
| WhackPopEmoji | IWhackPopEmoji | whackpop-emoji.ts |
| CCS | ICCS, IRelatedDocument | ccs.ts |
| Course | ICourse | course.ts |
| Lesson | ILesson | lesson.ts |
| CourseProgress | ICourseProgress, CourseProgressStatus | course-progress.ts |
| AssessmentResult | IAssessmentResult | assessment-result.ts |
| Translation | ITranslation | translation.ts |
| FeatureFlags | IFeatureFlags | feature-flags.ts |
| Survey | ISurvey, QuestionType | survey.ts |
| SurveyResponse | ISurveyResponse | survey-response.ts |
| ContentVote | IContentVote, VoteTargetType | content-vote.ts |
| DiscussionPost | IDiscussionPost | discussion-post.ts |
| StudyGroup | IStudyGroup | study-group.ts |
| StudyGroupMembership | IStudyGroupMembership, StudyGroupRole | study-group-membership.ts |
| JobQueue | IJobQueue, JobType, JobStatus | job-queue.ts |

---

*End of Amanoba System Outline.*
