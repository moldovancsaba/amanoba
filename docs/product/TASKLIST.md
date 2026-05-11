# Amanoba Task List

> **Source of truth is now the [Amanoba Project board](https://github.com/users/moldovancsaba/projects/12/views/1).** Tasks have been migrated into the Project 12 status lane model (`IDEABANK (SOMEDAY)` -> `Roadmap (LATER)` -> `Backlog (SOONER)` -> `Todo (NEXT)` -> `In Progress (NOW)` -> `Review (ALMOST)` -> `Done` / `Declined (NEVER)`). This file is kept as reference only. For next work, use the board. See [MIGRATION_ROADMAP_TASKLIST.md](https://github.com/moldovancsaba/mvp-factory-control/blob/main/docs/MIGRATION_ROADMAP_TASKLIST.md).

**Last Updated**: 2026-02-12

This document lists **actionable tasks** derived from the roadmap and current backlog. Each item is something to do. When a task is completed, move it to **RELEASE_NOTES.md** and remove it from this list. Ideas and vision live in **ROADMAP.md**. Completed work lives only in RELEASE_NOTES (not here). **Only related items:** Only open/actionable tasks that belong in the TASKLIST may appear here — no completed work (→ RELEASE_NOTES), no vision (→ ROADMAP), no unrelated content. For alignment of ROADMAP vs TASKLIST and "what to deliver next", see **ROADMAP_TASKLIST_SYSTEM_COMPARISON.md**.

**Current status (snapshot)**: Last confirmed production-stable snapshot: 2026-01-28 (PV/POL delivered). Latest archived status: `docs/_archive/reference/STATUS__2026-02-06.md` (includes verification notes). Full historical snapshot: `docs/_archive/reference/STATUS__2026-01-28.md`.

Completed items (formerly 1–4, 6–11, course voting, UI/UX polish, course leaderboard UI, Community Phase 1 & 2) are not listed here; they live only in **RELEASE_NOTES.md**.

---

## Priority legend

| Priority | Meaning |
|----------|--------|
| **P1** | Highest — do first (certificate tooling, core platform) |
| **P2** | High — next (multiple courses, enrolment) |
| **P3** | Medium — after P2 (email automation, achievements) |
| **P4** | Lower — when capacity allows (mobile, live, AI, community optional) |

---

## Action Items (by priority)

### P1 — Certificate enhancements (from ROADMAP)

**Goal:** Dynamic pass rules; A/B testing of certificate designs. Learners get certificates that fit course and language.

| # | Action item | Status |
|---|-------------|--------|
| 1 | Define data model for dynamic pass rules (e.g. per-course or per-credential pass threshold, optional conditions). | ✅ DONE (Course.certification: passThresholdPercent, requireAllLessonsCompleted, requireAllQuizzesPassed) |
| 2 | API: CRUD for pass-rule config (admin); apply rule at certificate issue time. | ✅ DONE (PATCH admin/courses/[courseId] merges certification; final-exam/submit uses pass rule) |
| 3 | Admin UI: Configure pass rules per course/credential; show current rule on certificate config. | ✅ DONE (admin course page: Pass rules subsection with threshold %, require all lessons, require all quizzes; current rule summary) |
| 4 | Define A/B test design: certificate template variants (e.g. templateId A vs B); assign variant at issue or by cohort. | ✅ DONE (docs/certification/CERTIFICATE_AB_TEST_DESIGN.md) |
| 5 | Implement A/B assignment and tracking (which variant issued); optional analytics event for certificate view/share. | ✅ DONE (resolve at issue, render from cert.designTemplateId, certificate_viewed GA) |

---

### P2 — Multiple courses: enrolment + prerequisites (from ROADMAP)

**Goal:** Enrolment in several courses at once; prerequisites so learners follow a sensible order.

| # | Action item | Status |
|---|-------------|--------|
| 1 | Model for multiple active enrolments/prerequisites: design `CourseEnrolment` (or extend `CourseProgress`) so a player can have several active courses and optionally declare prerequisite course IDs per enrolment. | ✅ DONE (Course: prerequisiteCourseIds, prerequisiteEnforcement; multiple courses via existing CourseProgress per player per course) |
| 2 | Idempotent enrolment API that lists a player’s active enrolments and enforces prerequisites (soft or hard) during enrolment. | ✅ DONE (POST /api/courses/[courseId]/enroll idempotent; enforces prerequisiteCourseIds when enforcement 'hard'; list = GET /api/my-courses) |
| 4 | Email/scheduler: Respect multiple enrolments (e.g. daily lesson per enrolled course, no duplicate sends). | ⏳ PENDING |

---

### P2 — Course package (export/import/update) — content safety

**Goal:** One authoritative course package format so we can export everything, import new courses, and update existing courses without losing stats (upvotes, progress, certifications, shorts). See **/Users/moldovancsaba/Projects/amanoba_courses/process_them/docs/COURSE_EXPORT_IMPORT_RECOMMENDATION.md**.

| # | Action item | Status |
|---|-------------|--------|
| 1 | Define package schema v2 and document in `/Users/moldovancsaba/Projects/amanoba_courses/process_them/docs/COURSE_PACKAGE_FORMAT.md` (manifest, course, lessons, quiz; optional canonical/course_idea). | ✅ DONE |
| 2 | Extend export API: add to course payload discussionEnabled, leaderboardEnabled, studyGroupsEnabled, certification, prerequisiteCourseIds, prerequisiteEnforcement, ccsId; add to quiz items uuid, questionType, hashtags. | ✅ DONE |
| 3 | Fix import overwrite: replace delete-all with merge — update course doc (content/config only), upsert lessons by lessonId, upsert questions by lessonId+uuid; do not delete existing lessons/questions not in package. | ✅ DONE |
| 4 | Import (new course): accept v2 package format (same shape as extended export); create course + lessons + questions. | ✅ DONE |
| 5 | UI/API import controls: support question handling mode when updating existing course (`add` missing only vs `overwrite` replace lesson questions), while preserving merge-safe course/lesson updates and learner stats. | ✅ DONE |
| 6 | (Optional) ZIP package: export as ZIP; import from ZIP. | ❌ Not planned — single JSON format in UI; API still accepts ZIP for backward compatibility. |

---

### P2 — Lesson quiz governance centralization (course-level only)

**Goal:** Manage lesson-quiz runtime behavior only at **course level** (question count, shown answer options, accepted wrong answers/pass rule), not in lesson-level config or seed JSON.
**Section contract:** Exactly **10 actionable items** with explicit per-item status tracking (current snapshot: 1 done, 9 pending).

| # | Action item | Status |
|---|-------------|--------|
| 1 | Complete full system inventory and migration plan (data model, runtime business rules, admin/editor UI, import/export/package docs, seed scripts, validators). | ✅ DONE (2026-02-12) |
| 2 | Add canonical course-level quiz policy fields (single source of truth) and validation bounds; keep temporary fallback for compatibility. | ✅ DONE (2026-02-12) |
| 3 | Refactor learner runtime to resolve quiz behavior from course policy only (count, pass/fail, required gate); remove lesson-level authority. | ✅ DONE (2026-02-12) |
| 4 | Remove lesson-level quiz behavior controls from lesson editor/admin lesson modal; keep lesson question-content management only. | ✅ DONE (2026-02-12) |
| 5 | Deprecate and remove `apply-quiz-defaults` flow once runtime no longer depends on lesson `quizConfig.questionCount`. | ✅ DONE (2026-02-12) |
| 6 | Update import/export + package spec to stop treating `lessons[].quizConfig` as authoritative for behavior; support compatibility ingest during transition. | ⏳ PENDING |
| 7 | Update seed scripts to stop setting lesson-level quiz behavior (questionCount/poolSize/successThreshold/required) and move policy to course-level setup. | ⏳ PENDING |
| 8 | Align question authoring + validators with configurable shown-answer-count policy (current system still enforces legacy 4-option authoring in several places). | ⏳ PENDING |
| 9 | Data migration/backfill: compute and persist course-level policy from existing data, with conflict reporting where lessons diverge. | ⏳ PENDING |
| 10 | Documentation alignment: update architecture, package format, and quality docs to reflect course-level-only governance. | ⏳ PENDING |

---

### P2 — Documentation operations (handover continuity)

**Goal:** Keep docs navigable across repos and make handover resilient to context resets.

| # | Action item | Status |
|---|-------------|--------|
| 1 | Decide and standardize cross-repo link strategy for moved course docs (`amanoba` → `amanoba_courses/process_them`) so references are portable and not machine-specific. | ⏳ PENDING |
| 2 | Clean and normalize high-value historical docs in `docs/_archive/**` that still reference moved files with outdated paths. | ✅ DONE (2026-02-12 continuation: archive references normalized; `DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check` passes) |
| 3 | Add/maintain handover package for every major documentation wave (`brain_dump`, handoff snapshot, next-window prompt). | 🟡 IN PROGRESS (updated in this cycle; continue each major docs wave) |

---

### P3 — Email automation Phase 2 (from ROADMAP)

**Goal:** A/B testing for key emails; optional MailerLite/ActiveCampaign integration.

| # | Action item | Status |
|---|-------------|--------|
| 1 | (Optional) Design A/B test for one key email (e.g. welcome or day-1); variant selection and track which variant sent. | ⏳ PENDING |
| 2 | (Optional) MailerLite or ActiveCampaign integration: sync subscribers, send campaign from platform or webhook. | ⏳ PENDING |

---

### P3 — Public lesson view pages (GEO — from GEO_IMPROVEMENT_PLAN.md)

**Goal:** Expose each lesson as a public, read-only page at `/[locale]/courses/[courseId]/day/[dayNumber]/view` for GEO/SEO. No in-app links to `/view`; discovery via sitemap, search, or shared/AI links. **All items (1–7) completed** → **RELEASE_NOTES.md**.

---

### P3 — Further course achievements and leaderboards (from ROADMAP)

**User story:** As a learner I want additional course achievements and richer course-specific leaderboards.

| # | Action item | Status |
|---|-------------|--------|
| 1 | (Optional) Add more leaderboard metrics (e.g. consistency) — course_points and course_completion_speed already exist. | ⏳ PENDING |

---

### P4 — Mobile app & offline (from ROADMAP)

**Goal:** Native app and offline access for learners.

| # | Action item | Status |
|---|-------------|--------|
| 1 | Scope: Document target (React Native / Expo vs PWA-only); offline: which data (lessons, progress) and sync strategy. | ⏳ PENDING |
| 2 | If PWA: Strengthen service worker and caching for course/lesson content and key API responses. | ⏳ PENDING |
| 3 | If native: Repo or prototype for mobile client; auth and API contract alignment. | ⏳ PENDING |

---

### P4 — Live sessions (from ROADMAP)

**Goal:** Scheduled live lessons with instructors.

| # | Action item | Status |
|---|-------------|--------|
| 1 | Data model: LiveSession (courseId, scheduledAt, duration, meetingUrl or provider id); optional instructor. | ⏳ PENDING |
| 2 | API: CRUD for live sessions (admin); list upcoming for a course; optional enrolment/reminder. | ⏳ PENDING |
| 3 | UI: Show upcoming live sessions on course page; link to meeting; optional calendar export. | ⏳ PENDING |
| 4 | Integrate meeting provider (e.g. Zoom, Meet) — link or embed; no custom video required for MVP. | ⏳ PENDING |

---

### P4 — AI-powered personalisation (from ROADMAP)

**Goal:** Adaptive difficulty and recommendations from assessments.

| # | Action item | Status |
|---|-------------|--------|
| 1 | Define “adaptive difficulty” for assessments (e.g. next question difficulty from last N answers); data model or config. | ⏳ PENDING |
| 2 | Recommendation source: use assessment results + course progress to suggest next lesson or course; API and simple algorithm. | ⏳ PENDING |
| 3 | UI: Surface recommendations (e.g. “Recommended for you” on dashboard or course page). | ⏳ PENDING |

---

### P4 — Community Phase 3 — Engagement (optional, from ROADMAP)

| # | Action item | Status |
|---|-------------|--------|
| 1 | (Optional) Notifications: New reply (in-thread or in group); optional mentions. | ⏳ PENDING |
| 2 | (Optional) Reactions/likes on posts (reuse pattern: one model/API/component, discriminator). | ⏳ PENDING |
| 3 | (Optional) Moderation tools: Bulk actions, report queue. | ⏳ PENDING |

---

### P4 — Instructor dashboard (from ROADMAP)

**Goal:** Instructors create and manage their own courses.

| # | Action item | Status |
|---|-------------|--------|
| 1 | Roles: Define “instructor” (e.g. RBAC); link instructor to courses they own. | ⏳ PENDING |
| 2 | Scope instructor admin: which course/lesson/quiz actions they can do vs admin-only. | ⏳ PENDING |
| 3 | UI: Instructor view of “My courses” and course builder (reuse admin patterns with permission checks). | ⏳ PENDING |

---

### P4 — Video lessons (from ROADMAP)

**Goal:** Video in lessons; in-lesson quizzes.

| # | Action item | Status |
|---|-------------|--------|
| 1 | Data model: Lesson supports video URL or embed (e.g. videoUrl, provider); optional in-lesson quiz (e.g. quiz block in content). | ⏳ PENDING |
| 2 | UI: Render video in lesson viewer; optional in-lesson quiz component and submit. | ⏳ PENDING |
| 3 | Email: Lesson email can link to “Watch video” or in-platform lesson; no video in email body for MVP. | ⏳ PENDING |

---

## Legend

- 🟡 **IN PROGRESS** — Currently being worked on  
- ⏳ **PENDING** — Not yet started  
- 🚫 **BLOCKED** — Waiting on dependency  
- ⚠️ **AT RISK** — Behind or facing issues  

---

**Maintained By**: AI Agent / Engineering  
**Review**: When tasks are completed or new work is broken down from ROADMAP  
**Last Major Update**: 2026-01-31 — ROADMAP items broken down into prioritized actionable tasks (P1–P4).
