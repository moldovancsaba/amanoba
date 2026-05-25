# Practice Hub MVP Contract

**Last Updated**: 2026-05-20
**Status**: Active

## Context

Amanoba issue `#781` defines the first bounded slice of the Practice Hub: which review modes exist in MVP, how the system decides what to show, and which current Amanoba models can support that behavior without inventing placeholder intelligence.

The contract in this document is intentionally narrow. It is designed to unblock:

- `#782` learner UI shell, entry points, and review flows
- `#783` telemetry, rewards, and progress integration

## Scope

- Define the MVP review modes that can be powered by real Amanoba data today
- Define the prioritization rule for each mode
- Map each mode to the current code and data sources
- Record the current data limits that must shape the UI and telemetry work

Out of scope:

- A fully adaptive recommendation engine
- A true per-question mistake history mode
- Broad XP, streak, or badge economics for review sessions beyond the bounded MVP rule below

## Implementation

### Product rule

The Practice Hub is a recovery-and-reinforcement surface, not a second course catalog. MVP should only expose review work that is explainable from existing learner progress and quiz signals.

### MVP review modes

The first Practice Hub release should expose exactly three actionable modes:

1. `Continue Next`
2. `Quiz Recovery`
3. `Stale Refresh`

`Mistakes` is explicitly not an MVP mode yet. Amanoba does not currently persist learner-specific wrong-answer history at question level, so presenting a mistake-driven mode now would be misleading.

### Mode 1: `Continue Next`

Purpose:
Resume the learner in the most immediate unfinished course flow.

What appears:

- In-progress course enrolments with an available next lesson
- The next actionable lesson position for each active course

Primary source signals:

- `CourseProgress.status`
- `CourseProgress.currentDay`
- `CourseProgress.completedDays`
- course duration from `Course.durationDays`
- lesson unlock/completion semantics from `GET /api/courses/[courseId]/day/[dayNumber]`

Primary code/data sources:

- `app/lib/models/course-progress.ts`
- `app/api/courses/[courseId]/day/[dayNumber]/route.ts`
- existing learner course routing under `app/[locale]/courses/*`, `app/[locale]/dashboard/page.tsx`, and `app/[locale]/my-courses/page.tsx`

Prioritization rule:

1. Include only enrolments with status `in_progress` or `not_started`.
2. Derive the next candidate day from `currentDay`, clamped to the course duration.
3. Rank earlier actionable days ahead of later days.
4. Break ties by most recently active course first using `lastAccessedAt`.

Learner explanation:
"Pick up where you left off."

Why this is valid for MVP:
This mode reuses the strongest existing signal Amanoba already has: next unfinished course day.

### Mode 2: `Quiz Recovery`

Purpose:
Return the learner to lesson quizzes that are available but not yet secured in progress.

What appears:

- Course days where a quiz exists and the learner does not yet have a completion marker for that day

Primary source signals:

- `Course.lessonQuizPolicy`
- question availability for the lesson in `QuizQuestion`
- `CourseProgress.assessmentResults` day markers
- lesson/day metadata already exposed by the day API

Primary code/data sources:

- `app/api/courses/[courseId]/day/[dayNumber]/route.ts`
- `app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts`
- `app/lib/models/course-progress.ts`
- `app/lib/models/quiz-question.ts`

Prioritization rule:

1. Include only days where the course-level quiz policy is enabled and the lesson has at least one active quiz question.
2. Exclude days that already have an `assessmentResults` completion marker for that learner and course progress.
3. Rank lower day numbers before higher day numbers so unresolved earlier learning gates are recovered first.
4. Break ties by course recency: more recently accessed courses first.

Learner explanation:
"Complete lesson quizzes you have not secured yet."

Important MVP constraint:
This is not a "questions you got wrong" mode. The current submit path only stores a day-level completion marker on pass and updates global question counters. It does not persist learner-specific failed attempts or wrong-answer history.

### Mode 3: `Stale Refresh`

Purpose:
Bring the learner back to previously completed lessons that have likely gone cold.

What appears:

- Completed lesson positions from active or completed courses that have not been touched recently

Primary source signals:

- `CourseProgress.completedDays`
- `CourseProgress.lastAccessedAt`
- `CourseProgress.completedAt`
- course language and lesson titles for labeling the review entry

Primary code/data sources:

- `app/lib/models/course-progress.ts`
- `app/api/courses/[courseId]/day/[dayNumber]/route.ts`
- course and lesson lookup paths already used by the learner experience

Prioritization rule:

1. Include only completed lesson positions from courses where at least one lesson is complete.
2. Use a simple staleness score based on how long it has been since the course was last accessed.
3. Prefer courses with older `lastAccessedAt` first.
4. Within the same course, prefer the earliest completed days first for MVP simplicity and explainability.

Learner explanation:
"Revisit lessons you completed a while ago."

Important MVP constraint:
Staleness is only available at course-progress level today, not per lesson revisit timestamp. The first version therefore treats completed lesson positions inside a stale course as refresh candidates rather than pretending to know which exact lesson memory is weakest.

### Explicit non-MVP modes

The following ideas are valid future extensions, but they are not part of the MVP contract:

- `Mistakes`: blocked by missing learner-specific wrong-answer persistence
- `Weak Questions`: blocked by missing per-learner question performance history
- `Saved for Review`: blocked by missing bookmark/save model
- `AI Recommended`: blocked by lack of inspectable recommendation logic and telemetry baseline

These should not appear in the UI shell from `#782` unless they are clearly marked unavailable and backed by a real product decision.

### Shared content contract

Each Practice Hub mode should resolve into the same normalized recommendation shape before UI rendering:

```ts
type PracticeRecommendation = {
  mode: 'continue-next' | 'quiz-recovery' | 'stale-refresh';
  courseId: string;
  lessonDay: number;
  lessonId?: string;
  title: string;
  reasonLabel: string;
  priorityScore: number;
  sourceSignals: string[];
  actionHref: string;
  quizAvailable?: boolean;
};
```

Contract rules:

- `mode` is stable and operator-readable.
- `reasonLabel` must be learner-readable and explainable from real signals.
- `priorityScore` may be implementation-specific, but sorting must still follow the documented rules above.
- `sourceSignals` should remain internal or operator-facing; it exists so telemetry and debugging can explain why an item was shown.
- `actionHref` must launch into an existing Amanoba learner flow, not a synthetic dead-end.

### Ordering across modes

The default Practice Hub mode order for MVP is:

1. `Continue Next`
2. `Quiz Recovery`
3. `Stale Refresh`

Why:

- unfinished core progression should outrank optional reinforcement
- unresolved quiz gates are a stronger learning-risk signal than generic stale review
- stale refresh is valuable, but it should not distract from active course completion

### Current implementation limits

These limits must be treated as real product constraints, not as TODO comments inside the UI:

1. `CourseProgress.assessmentResults` is currently used as a day-level completion marker, not a rich per-attempt history.
2. `POST /quiz/submit` updates `QuizQuestion.showCount` and `correctCount`, but those are global content counters, not learner-specific weakness signals.
3. `AssessmentResult` can store richer performance metadata, but the lesson-quiz submit path does not currently write those documents for practice-ready analytics.
4. `lastAccessedAt` is tracked at course-progress level, so staleness is course-scoped rather than lesson-scoped.

### Downstream guidance

For `#782`:

- The UI should expose only the three MVP modes above.
- Empty states must distinguish between:
  - no active enrolments
  - no unresolved quiz recoveries
  - no stale refresh candidates
- The first launch path can safely start with `Continue Next` because it has the cleanest current signal quality.

For `#783`:

- If the product wants a true `Mistakes` or `Weak Questions` mode, telemetry work must add learner-level wrong-answer persistence first.
- Telemetry should capture which mode was surfaced, which mode was launched, and whether the learner completed the suggested review path.
- The MVP reward loop must stay bounded to verified completion and must not reward page views or recommendation opens.

### MVP telemetry contract

Practice Hub MVP should log exactly four operator-readable events:

1. `practice_hub_viewed`
2. `practice_hub_recommendation_opened`
3. `practice_hub_completion_recorded`
4. `practice_hub_reward_granted`

Contract rules:

- `viewed` fires when the learner loads the Practice Hub shell and recommendation payload successfully.
- `recommendation_opened` fires when the learner launches a suggested Practice Hub action.
- `completion_recorded` fires only after the backend verifies the underlying learner progress state for the suggested action.
- `reward_granted` fires only when a bounded Practice Hub reward is actually applied.
- Completion and reward telemetry must carry the normalized Practice Hub context (`mode`, `courseId`, `lessonDay`) so operators can trace why a reward was granted.

### MVP reward and anti-farming contract

The first Practice Hub reward rule should be deliberately narrow:

- `Continue Next`: telemetry only, no extra reward
- `Stale Refresh`: telemetry only, no extra reward
- `Quiz Recovery`: one-time `3 points` and `3 XP`, but only after verified quiz completion

Safeguards:

1. Rewards are never granted for Practice Hub page views or recommendation clicks.
2. Rewards are granted only after backend verification against real `CourseProgress` state.
3. `lesson_completed` can only verify when the target day is present in `completedDays`.
4. `quiz_passed` can only verify when the target day is present in `assessmentResults`.
5. The reward is one-time per learner recommendation key: `{ playerId, mode, courseId, lessonDay }`.

Why this shape is valid for MVP:

- it creates a measurable incentive for the highest-friction recovery mode
- it avoids teaching the system to reward navigation spam
- it keeps the persistence model explainable and auditable

## Verification

- Review `app/lib/models/course-progress.ts` against the mode definitions
- Review `app/lib/models/quiz-question.ts` against the quiz-recovery constraints
- Review `app/api/courses/[courseId]/day/[dayNumber]/route.ts` and `app/api/courses/[courseId]/lessons/[lessonId]/quiz/submit/route.ts` against the documented signals
- Review `app/api/practice-hub/track/route.ts`, `app/api/practice-hub/complete/route.ts`, and `app/lib/practice-hub-rewards.ts` against the telemetry/reward contract
- Run `npm run docs:refresh`
- Run `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check`
- Run `npm run docs:check`

## Rollback

- Remove `/Users/Shared/Projects/amanoba/docs/features/PRACTICE_HUB_MVP_CONTRACT.md`
- Remove the related `#781` entry from `/Users/Shared/Projects/amanoba/docs/HANDOVER.md`
- Re-run `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check` to confirm the docs set is back to the prior state
