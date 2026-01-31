# Delivery Summary — 2026-01-31

**Version**: 2.9.34  
**Scope**: TASKLIST items from ROADMAP (further course achievements, smoke tests).

---

## Delivered (v2.9.34)

### 1. Perfect Assessment achievement
- **Criteria**: `perfect_assessment` — 100% on course final exam (and course completed).
- **Code**: `app/lib/models/achievement.ts` (new type), `app/lib/gamification/achievement-engine.ts` (context `finalExamScorePercent`, evaluation, load FinalExamAttempt when course completed), `app/api/certification/final-exam/submit/route.ts` (call `checkAndUnlockCourseAchievements` after grading).
- **Seed**: "Perfect Assessment" (mastery, gold) in `scripts/seed-achievements.ts`.

### 2. Consistent Learner achievement
- **Criteria**: `lesson_streak` — longest consecutive lesson streak (e.g. 7 days in a row).
- **Code**: `app/lib/models/achievement.ts` (new type), `app/lib/gamification/achievement-engine.ts` (`computeLessonStreak(completedDays)`, context `courseProgress.lessonStreak`, evaluation).
- **Seed**: "Consistent Learner" (streak, silver, target 7) in `scripts/seed-achievements.ts`.

### 3. Smoke tests for dashboard and critical APIs
- **New**: `__tests__/smoke/dashboard-apis.test.ts` — GET `/api/profile` and GET `/api/my-courses` return 401 when unauthenticated (auth + security mocks).
- **Existing**: health, courses, feature-flags. All 5 smoke tests pass.

### 4. ROADMAP and TASKLIST hygiene
- **ROADMAP**: No delivered items; no items that are on TASKLIST. Only future vision (certificate remaining, multi-format, future quarters).
- **TASKLIST**: Completed items removed (Perfect Assessment, Consistent Learner, smoke tests). Remaining: email A/B (optional), leaderboard metrics + UI, course voting (5 items), UI/UX (5 items).

---

## Current state

| Doc | Purpose |
|-----|---------|
| **ROADMAP.md** | Future vision only (no delivered, no on TASKLIST). |
| **TASKLIST.md** | Open action items: email A/B, leaderboard metrics + UI, course voting, UI/UX. |
| **RELEASE_NOTES.md** | v2.9.34 entry + history; completed work lives only here. |

---

### 5. Course leaderboard on course detail page (TASKLIST)

- **Course detail page** (`app/[locale]/courses/[courseId]/page.tsx`): "Course leaderboard" section that fetches `GET /api/leaderboards/course/[courseId]?period=all_time&metric=course_points&limit=10` and shows top 10 by course points (rank, displayName, score). Translations: `courseLeaderboard`, `noLeaderboardYet` (en, hu).

---

## Next (TASKLIST priority)

1. **Further course achievements**: Richer leaderboard metrics (optional; course_points and course_completion_speed already exist); remaining: optional extra metrics.
2. **Course voting (additional)**: Course up/down voting, aggregates, display, admin view, vote reset.
3. **UI/UX**: Course cards, lesson viewer, mobile, email templates, assessment visuals.

---

**Last Updated**: 2026-01-31
