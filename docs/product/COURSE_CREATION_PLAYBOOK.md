# Amanoba Course Creation Playbook

**Status**: ACTIVE
**Last updated**: 2026-06-24

This playbook collects the current information required to create, upload, seed, certify, and QA an Amanoba course. It reflects the current flexible-course implementation: courses are no longer fixed to 30 lessons.

## Quick Answer

- **Minimum lessons**: 1 active lesson.
- **Maximum lessons**: no hard product maximum in the course and lesson models. `dayNumber` must be a positive whole number.
- **Stored `durationDays`**: planned/fallback length only. Learner-facing length is resolved from active lessons, child-course selected lessons, canonical specs, then `durationDays`.
- **Short courses**: created as child courses from selected parent lessons. Current short labels are Essentials (1-3), Beginner Course (4-7), Foundations (8-12), Core Skills (13-20), and Full Program (21+).
- **Lesson quiz authoring minimum**: 7 valid questions per lesson by quality rule.
- **Lesson quiz runtime display**: controlled by `course.lessonQuizPolicy.questionCount`; code supports 1-50 and defaults to 5 if unset.
- **Final certification exam**: default 50 questions unless `course.certification.certQuestionCount` is set. The active certification pool must contain at least that many active course-specific questions.
- **Certificates**: set `course.certification.enabled = true`, configure eligibility rules, final-exam rules, pricing/entitlement if needed, and certificate template IDs.
- **Upload/import**: Admin UI uses a single JSON course package. API also accepts ZIP for backward compatibility.
- **Seeding**: use `npx tsx --env-file=.env.local scripts/inject-course-from-json.ts <course-export.json>` for JSON packages, or course-specific seed scripts when they exist.
- **Local AI autopilot**: use `npm run course:ai:create` to draft an import-ready package from a brief, or `npm run course:ai:maintain` to generate a maintenance plan for a live course. The create flow can also `--apply` and then run the existing quiz-generation pipeline.
- **Weekly content-fix autopilot**: use `npm run course:ai:content-fix` for a local preview bundle, or add `--apply` to audit the oldest modified course, create or refresh fix issues in `mvp-factory-control`, and move them to Project 12 `CONTENT fix`.

### Weekly content-fix automation

- The weekly audit targets the oldest modified course first, so stale content gets attention before freshly edited courses.
- It groups findings into GitHub issues for lesson content, quiz quality, certification/final-exam sanity, and structural cleanup.
- Dry runs now write a preview manifest plus one markdown and one JSON draft per planned issue under `docs/course-ai/content-fix/preview/`.
- The Project 12 board needs a `CONTENT fix` status option, which the autopilot will create if it is missing.
- For fully automated runs, use a self-hosted runner or local machine that can reach MongoDB, GitHub CLI auth, and the Ollama local model endpoint.

## Course Record

Required course fields:

- `courseId`: unique uppercase identifier, letters/numbers/underscores only, for example `PRODUCTIVITY_2026_EN`.
- `name`: learner-facing title, maximum 200 characters.
- `description`: learner-facing summary, maximum 2000 characters.
- `language`: course language code, for example `en` or `hu`.
- `brandId`: usually the Amanoba brand; admin creation auto-creates/fills the default Amanoba brand when omitted.
- `durationDays`: positive fallback number. Use the intended lesson count at creation time, but the live course length follows lessons after lessons exist.
- `pointsConfig`: `completionPoints`, `lessonPoints`, optional `perfectCourseBonus`.
- `xpConfig`: `completionXP`, `lessonXP`.

Common optional course fields:

- `thumbnail`
- `requiresPremium`
- `price.amount` and `price.currency`
- `metadata.category`, `metadata.difficulty`, `metadata.estimatedHours`, `metadata.prerequisites`, `metadata.tags`, `metadata.instructor`
- `discussionEnabled`, `leaderboardEnabled`, `studyGroupsEnabled`
- `ccsId` for course-family grouping
- `prerequisiteCourseIds` and `prerequisiteEnforcement` (`hard` or `soft`)
- `isActive` and `isDraft`

## Lesson Rules

Required lesson fields:

- `lessonId`: unique stable identifier.
- `courseId`: database reference to the parent course.
- `dayNumber`: positive whole number; this is the lesson position, starting at 1.
- `language`: must match the course language unless deliberately building a localized variant.
- `title`
- `content`: Markdown preferred; legacy HTML is normalized by import/export paths.
- `emailSubject`
- `emailBody`: Markdown preferred.
- `pointsReward`
- `xpReward`
- `isActive`
- `displayOrder`

Lesson content grammar:

- Introduction: context and why it matters.
- Main content: concepts and procedures aligned to the canonical course spec.
- Summary: short recap.
- `Student tasks`: concrete learner work that can be completed after the lesson.
- `Useful external sources`: 2-4 topic-relevant links students can use for deeper reading, standards, or evidence.
- `Bibliography`: source list for the references used in the lesson. Use real sources only; do not fabricate citations or URLs.

Authoring quality rules:

- Write in the course language only. No English leakage in non-English lessons.
- Keep lesson, email subject, and email body in the same language.
- Target 20-30 minutes of reading/work.
- Make every lesson specific, actionable, and grounded in the course outcome.
- Do not publish lessons that lack visible learner tasks, useful external sources, or bibliography/references.
- Do not rely on old fixed 30-day assumptions.

## Quiz Rules

Course-level quiz authority:

- `course.lessonQuizPolicy.enabled`: default true.
- `course.lessonQuizPolicy.required`: default true.
- `course.lessonQuizPolicy.questionCount`: runtime displayed question count; supported range 1-50.
- `course.lessonQuizPolicy.shownAnswerCount`: supported range 2-4; default 3.
- `course.lessonQuizPolicy.maxWrongAllowed`: optional supported range 0-10.
- `course.lessonQuizPolicy.successThreshold`: supported range 0-100; default 70.

Legacy fields:

- `course.quizMaxWrongAllowed`
- `course.defaultLessonQuizQuestionCount`
- `lesson.quizConfig`

These remain for import/export and compatibility only. New behavior should use `course.lessonQuizPolicy`.

Package import/export routes resolve and persist `course.lessonQuizPolicy` canonically. Legacy course fields are preserved when present, but `lesson.quizConfig` is never promoted to runtime authority during import.

Question authoring minimum:

- Minimum 7 valid questions per lesson.
- Use 0 recall questions.
- Minimum 5 application questions.
- Minimum 2 critical-thinking questions recommended.
- Each question should be standalone, scenario-based, and grounded in the lesson.
- Hard final-exam portability rule: do not mention `Day N`, `Lesson N`, the lesson title, "this lesson", "as described in the lesson", or any local context that disappears when the same question appears in the final certification exam.
- Use plausible educational distractors that a real trainee might choose. Never use joke, lazy, unrelated, obviously dumb, or generic productivity answers such as "effort fixes it", "more tasks closed is enough", "do nothing", or "ignore constraints".
- For trainer/professional courses, answer choices must stay inside the professional domain: client safety, scope, screening, anatomy, cueing, apparatus setup, progression/regression, documentation, ethics, and business practice as relevant.

Question data formats:

- Legacy: `options` with at least 4 options and `correctIndex`.
- Preferred/current final-exam display: `correctAnswer` plus at least 2 `wrongAnswers`; runtime can build 3 displayed options.

Important fields:

- `uuid`: v4 UUID recommended for stable import/merge.
- `question`
- `explanation`: bounded teaching note, maximum 800 characters.
- `difficulty`: `EASY`, `MEDIUM`, `HARD`, or `EXPERT`.
- `category`: use `Course Specific` unless a supported category fits.
- `questionType`: use `application` or `critical-thinking` for quality-aligned lesson quizzes.
- `hashtags`
- `lessonId`
- `courseId`
- `isCourseSpecific: true`
- `isActive: true`

## Short Courses

Short courses are child courses created from selected parent lessons. They do not duplicate lesson content; they store an ordered `selectedLessonIds` list and map those parent lessons to child day 1..N.

Current short labels:

| Selected lessons | Variant | Label |
| --- | --- | --- |
| 1-3 | `essentials` | Essentials |
| 4-7 | `beginner` | Beginner Course |
| 8-12 | `foundations` | Foundations |
| 13-20 | `core_skills` | Core Skills |
| 21+ | `full_program` | Full Program |

Child course fields:

- `parentCourseId`: parent course ID.
- `selectedLessonIds`: ordered parent lesson `_id` values.
- `courseVariant`: variant label key.
- `durationDays`: selected lesson count.
- `ccsId`: inherited from parent.
- `isDraft`: true when created.
- `syncStatus`: `synced` or `out_of_sync`.
- `certification.poolCourseId`: usually the parent course ID.
- `certification.certQuestionCount`: final exam question count for the child course; must be at least 1.

## Certificates

Enable certificates on the course with `course.certification.enabled = true`.

Core certificate settings:

- `certification.poolCourseId`: source course for final-exam questions. If omitted, the course itself is used.
- `certification.certQuestionCount`: final-exam question count. Default is 50 when unset; minimum is 1 when set.
- `certification.passThresholdPercent`: passing score, 0-100, default 50.
- `certification.maxErrorPercent`: optional immediate-fail error-rate threshold, 0-100.
- `certification.requireAllLessonsCompleted`: default true.
- `certification.requireAllQuizzesPassed`: default true.
- `certification.priceMoney.amount` and `certification.priceMoney.currency`: optional money price.
- `certification.pricePoints`: optional points price.
- `certification.premiumIncludesCertification`: if true, premium entitlement can include certificate access.
- `certification.templateId`: single certificate design, for example `default_v1` or `minimal`.
- `certification.templateVariantIds`: optional A/B list of template IDs. If more than one is configured, the issued certificate stores one variant selected by stable hash of learner and course.
- `certification.credentialTitleId`: stored as the certificate credential ID fallback.

Certificate availability rule:

- Certification must be enabled.
- The resolved final-exam pool must have at least `certQuestionCount` active course-specific questions, or 50 active questions when `certQuestionCount` is unset.
- The learner must complete the course before starting the final exam.
- If pricing or premium gating applies, the learner must have certificate entitlement unless premium includes certification.

Certificate issue rule:

- The learner must pass the final exam.
- If enabled, all lessons must be completed.
- If enabled, all daily quizzes must be passed.
- The issued certificate stores `designTemplateId`; rendering uses the issued certificate, not the current course template.

Global certificate fallback:

- Global settings live in `CertificationSettings` with key `global`.
- Global template/pricing values are used only when the course does not provide a specific value.

## Course Package Format

The canonical upload package is a single JSON object:

```json
{
  "packageVersion": "2.0",
  "version": "2.0",
  "quizGovernance": {
    "authority": "course.lessonQuizPolicy",
    "lessonQuizConfigRole": "compatibility-only"
  },
  "course": {
    "courseId": "EXAMPLE_COURSE_EN",
    "name": "Example Course",
    "description": "What learners will achieve.",
    "language": "en",
    "durationDays": 3,
    "isActive": true,
    "requiresPremium": false,
    "pointsConfig": {
      "completionPoints": 1000,
      "lessonPoints": 50,
      "perfectCourseBonus": 500
    },
    "xpConfig": {
      "completionXP": 500,
      "lessonXP": 25
    },
    "lessonQuizPolicy": {
      "enabled": true,
      "required": true,
      "questionCount": 7,
      "shownAnswerCount": 3,
      "successThreshold": 70
    },
    "certification": {
      "enabled": true,
      "certQuestionCount": 25,
      "passThresholdPercent": 70,
      "requireAllLessonsCompleted": true,
      "requireAllQuizzesPassed": true,
      "templateId": "default_v1"
    }
  },
  "lessons": [
    {
      "lessonId": "EXAMPLE_COURSE_EN_DAY_01",
      "dayNumber": 1,
      "language": "en",
      "title": "Lesson title",
      "content": "Markdown lesson content.",
      "emailSubject": "Day 1: Lesson title",
      "emailBody": "Markdown email body.",
      "pointsReward": 50,
      "xpReward": 25,
      "isActive": true,
      "displayOrder": 1,
      "quizQuestions": [
        {
          "uuid": "00000000-0000-4000-8000-000000000001",
          "question": "Scenario-based question text?",
          "correctAnswer": "The correct answer.",
          "wrongAnswers": [
            "Plausible wrong answer one.",
            "Plausible wrong answer two.",
            "Plausible wrong answer three."
          ],
          "difficulty": "MEDIUM",
          "category": "Course Specific",
          "questionType": "application",
          "hashtags": ["#example", "#application"],
          "isActive": true
        }
      ]
    }
  ]
}
```

Import accepts:

- Raw JSON package: `{ "course": {...}, "lessons": [...] }`
- Wrapped JSON package: `{ "courseData": { "course": {...}, "lessons": [...] }, "overwrite": true }`
- ZIP with `package.json`, or legacy ZIP with `course.json` and `lessons.json`

Question import modes:

- `merge`: update existing questions matched by `uuid` or question text and add missing questions.
- `add`: add only missing questions.
- `overwrite`: delete existing lesson questions for the course and recreate from package.

## Upload Or Seed

Admin upload:

1. Sign in as admin or editor.
2. Open the localized admin course area, for example `/en/admin/courses`.
3. Use course import/upload with a JSON package.
4. Use `overwrite=true` only when intentionally merging into an existing course.
5. Verify course, lessons, quiz questions, certification settings, and active/draft status before learners use it.

Script seed from JSON:

```sh
npx tsx --env-file=.env.local scripts/inject-course-from-json.ts path/to/course-export.json
```

Seed scripts must set `course.lessonQuizPolicy` for quiz behavior. Do not encode lesson-level behavior authority in `lesson.quizConfig`; keep that field null or compatibility-only when a legacy payload still needs to round-trip.

Backfill existing courses with divergent legacy lesson configs:

```sh
npm run backfill:course-quiz-policy
npm run backfill:course-quiz-policy -- --apply
```

The backfill writes `course.lessonQuizPolicy` only, uses most-common lesson behavior with strictest tie-breakers, and emits a JSON conflict report under `scripts/reports/`.

Course-specific seed scripts:

- Use only when the script is written for that exact course family.
- Prefer dry-run mode when available.
- Use `--apply` only after reviewing the script output.

CCS seed example:

```sh
npx tsx --env-file=.env.local scripts/seed-ccs-generative-ai-2026.ts --apply
```

Operational requirements:

- `.env.local` must contain `MONGODB_URI`.
- Use the same database as the app (`DB_NAME` or default `amanoba`).
- Back up or export the target course before overwrite/import.
- After import, run course and quiz audits before publishing.

## Local AI Workflow

The local AI flow is split into two safe stages:

1. Draft an import-ready course package with local AI.
2. Finalize the course with the repo's existing deterministic tooling.

Recommended commands:

```sh
# Draft a package only
npm run course:ai:create -- --topic "AI for customer support" --language en --days 7

# Draft, import, and generate quiz coverage
npm run course:ai:create -- --topic "AI for customer support" --language en --days 7 --apply

# Review a live course and generate a maintenance plan
npm run course:ai:maintain -- --course-id AI_30_NAP
```

Notes:

- Generated courses are saved as draft content first (`course.isActive = false`).
- Quiz questions are still filled by `scripts/process-course-questions-generic.ts`, so the existing quality gate remains the source of truth.
- Maintenance mode is low-risk by default: it proposes actions and only auto-applies safe fixes such as child-course resync, duration sync, and question regeneration when coverage is low.

## Publishing Checklist

Before publishing:

- Course has correct `courseId`, name, description, language, and `ccsId`.
- Course has at least 1 active lesson.
- Active lessons use consecutive positive `dayNumber` values unless there is an intentional gap.
- Each lesson has title, content, email subject, email body, points, XP, active status, and display order.
- Lesson content follows the required structure.
- Course and lessons are in the same language.
- Each lesson has at least 7 quality-approved questions.
- Quiz questions do not contain day names, lesson numbers, lesson-title fragments, or lesson-only references; they must work in the final exam without surrounding context.
- Wrong answers are plausible domain mistakes, not throwaway/dumb answers.
- `course.lessonQuizPolicy` is set intentionally.
- Certification is disabled if not ready.
- If certification is enabled, the final-exam pool has enough active course-specific questions.
- Certificate template and eligibility rules are set.
- Pricing and premium requirements are correct.
- Short courses are draft until reviewed.
- Import/export roundtrip works for the package.

Suggested verification:

```sh
npm run type-check
npm run docs:check
npx tsx --env-file=.env.local scripts/check-all-courses.ts
npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts
npx tsx --env-file=.env.local scripts/audit-full-quiz-system.ts
```

Use targeted commands when full DB audits are too expensive, but do not publish without checking the touched course and its quiz pools.
