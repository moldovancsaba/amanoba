# Amanoba Task List

**Last Updated**: 2026-01-31

This document lists **actionable tasks** derived from the roadmap and current backlog. Each item is something to do. When a task is completed, move it to **RELEASE_NOTES.md** and remove it from this list. Ideas and vision live in **ROADMAP.md**. Completed work lives only in RELEASE_NOTES (not here). **Only related items:** Only open/actionable tasks that belong in the TASKLIST may appear here — no completed work (→ RELEASE_NOTES), no vision (→ ROADMAP), no unrelated content.

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
| 4 | Define A/B test design: certificate template variants (e.g. templateId A vs B); assign variant at issue or by cohort. | ✅ DONE (docs/CERTIFICATE_AB_TEST_DESIGN.md) |
| 5 | Implement A/B assignment and tracking (which variant issued); optional analytics event for certificate view/share. | ✅ DONE (resolve at issue, render from cert.designTemplateId, certificate_viewed GA) |

---

### P2 — Multiple courses: enrolment + prerequisites (from ROADMAP)

**Goal:** Enrolment in several courses at once; prerequisites so learners follow a sensible order.

| # | Action item | Status |
|---|-------------|--------|
| 1 | Data model: Support multiple active enrolments per player (e.g. CourseEnrolment or extend CourseProgress); optional prerequisite courseIds on Course. | ⏳ PENDING |
| 2 | API: Enrol in course (idempotent); list my enrolments; enforce prerequisite check on enrol (optional: soft vs hard). | ⏳ PENDING |
| 3 | UI: My courses / dashboard shows multiple courses in progress; course detail shows “Enrol” and prerequisite notice if not met. | ⏳ PENDING |
| 4 | Email/scheduler: Respect multiple enrolments (e.g. daily lesson per enrolled course, no duplicate sends). | ⏳ PENDING |

---

### P3 — Email automation Phase 2 (from ROADMAP)

**Goal:** A/B testing for key emails; optional MailerLite/ActiveCampaign integration.

| # | Action item | Status |
|---|-------------|--------|
| 1 | (Optional) Design A/B test for one key email (e.g. welcome or day-1); variant selection and track which variant sent. | ⏳ PENDING |
| 2 | (Optional) MailerLite or ActiveCampaign integration: sync subscribers, send campaign from platform or webhook. | ⏳ PENDING |

---

### P3 — Further course achievements and leaderboards (from ROADMAP)

**User story:** As a learner I want additional course achievements and richer course-specific leaderboards.

| # | Action item | Status |
|---|-------------|--------|
| 1 | (Optional) Add more leaderboard metrics (e.g. consistency) — course_points and course_completion_speed already exist. | ⏳ PENDING |
| 2 | (Optional) New course achievement types (e.g. early finisher, perfect week); seed and wire to achievement engine. | ⏳ PENDING |

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
