# ROADMAP vs TASKLIST vs System Outline — Comparison

**Purpose**: Compare **ROADMAP.md** (vision), **TASKLIST.md** (open tasks), and current code to identify what to deliver next and alignment.  
**Rules**: Follow **agent_working_loop_canonical_operating_document.md** — single-place rule (ROADMAP = vision only; TASKLIST = open tasks; RELEASE_NOTES = done).  
**Status**: **P2 #1** and **P2 #2** (enrolment model + API) are **done** — see **RELEASE_NOTES.md** and **ENROLMENT_AND_PREREQUISITES.md**.  
**Last Updated**: 2026-02-04

---

## 1. What we need to deliver next

**Next open work** comes from **TASKLIST.md**. All P1 (Certificate enhancements) items are ✅ DONE (see RELEASE_NOTES v2.9.38–v2.9.40).

| Priority | Section | Next action |
|----------|---------|-------------|
| **P2** | Multiple courses: enrolment + prerequisites | **P2 #1** → **P2 #2** → **P2 #3** → **P2 #4** (in order) |

**Concrete next deliverables (TASKLIST):**

1. ~~**P2 #1**~~ — ✅ **DONE**. Course.prerequisiteCourseIds + prerequisiteEnforcement; multiple courses via CourseProgress.  
2. ~~**P2 #2**~~ — ✅ **DONE**. POST /api/courses/[courseId]/enroll idempotent + prerequisite check; list = GET /api/my-courses.  
3. **P2 #3** — UI: My courses / dashboard shows multiple courses in progress; course detail shows “Enrol” and prerequisite notice if not met.  
4. **P2 #4** — Email/scheduler: Respect multiple enrolments (e.g. daily lesson per enrolled course, no duplicate sends).

**Recommendation:** Proceed with **P2 #3** (UI), then P2 #4 (scheduler). See **ENROLMENT_AND_PREREQUISITES.md**.

---

## 2. Do we miss items from the roadmap?

**ROADMAP.md** (vision) currently contains:

- **Certificate enhancements (remaining)** — Dynamic pass rules; A/B testing of certificate designs.
- **Future quarters** — Multiple courses; Live sessions; AI-powered personalisation; Instructor dashboard; Mobile app; Video lessons.

**Findings:**

| ROADMAP item | On TASKLIST? | Delivered? | Action |
|--------------|--------------|-------------|--------|
| Certificate enhancements (remaining) | Yes — was P1 #1–#5 | **Yes** (RELEASE_NOTES v2.9.38–v2.9.40) | **Remove from ROADMAP** (single-place rule: delivered → RELEASE_NOTES only). |
| Multiple courses | Yes — P2 #1–#4 | No | None. |
| Live sessions | Yes — P4 (4 tasks) | No | None. |
| AI-powered personalisation | Yes — P4 (3 tasks) | No | None. |
| Instructor dashboard | Yes — P4 (3 tasks) | No | None. |
| Mobile app & offline | Yes — P4 (3 tasks) | No | None. |
| Video lessons | Yes — P4 (3 tasks) | No | None. |
| (Community Phase 3, Email Phase 2, achievements/leaderboards) | Yes — P3/P4 optional | No | None. |

**Conclusion:** We do **not** miss any roadmap items on the tasklist. All “Future quarters” and optional items are already broken down in TASKLIST (P2, P3, P4).  

**One correction:** The ROADMAP still lists “Certificate enhancements (remaining)”. That work is delivered; per agent doc, it should not stay on ROADMAP. **Action:** Remove the “Certificate enhancements (remaining)” bullet from ROADMAP (or replace with a short note that certificate tooling is done and see RELEASE_NOTES).

---

## 3. System outline vs TASKLIST (gap for P2)

**Current system (from amanoba_system_outline.md):**

- **Enrolment:** One course progress per player–course (`CourseProgress`); enroll via `POST /api/courses/[courseId]/enroll`; “My courses” via `GET /api/my-courses` and dashboard/my-courses page.
- **Courses:** No `prerequisiteCourseIds` on Course; no “list my enrolments” as a first-class API (my-courses derives from progress).
- **Email/scheduler:** `sendDailyLessons` / cron — behaviour w.r.t. multiple courses is per current design (single-course assumption or one lesson per course; needs confirmation for P2 #4).

**What P2 requires (not yet in outline):**

| P2 item | In system outline? | Gap |
|---------|--------------------|-----|
| P2 #1 — Multiple enrolments model; prerequisite courseIds | No | Need CourseEnrolment (or extended CourseProgress) and `Course.prerequisiteCourseIds` (or equivalent). |
| P2 #2 — Enrol (idempotent); list enrolments; prerequisite check | Partially | Enrol exists; need explicit “list my enrolments” API and prerequisite check on enrol. |
| P2 #3 — UI: multiple in progress; Enrol + prerequisite notice | Partially | My courses/dashboard exist; need multiple courses in progress + “Enrol” + prerequisite notice on course detail. |
| P2 #4 — Scheduler respects multiple enrolments | Unclear | Need to verify/implement daily lesson per enrolled course, no duplicate sends. |

So: **next delivery** is P2 #1 (data model + prerequisite field), then P2 #2–#4. No roadmap items are missing from the tasklist; ROADMAP should be updated to remove the delivered certificate-enhancements bullet.

---

## 4. Suggested ROADMAP change (single-place rule)

In **docs/ROADMAP.md**, under “Future Functions We Want to Implement”:

- **Remove** the subsection “Certificate enhancements (remaining)” (dynamic pass rules; A/B testing of certificate designs), because that work is **delivered** (RELEASE_NOTES v2.9.38–v2.9.40).
- **Keep** “Future quarters (Q2–Q4 2026 and beyond)” as-is (multiple courses, live sessions, AI, instructor dashboard, mobile, video).

Optional: add one line such as: “Certificate tooling (pass rules, template A/B) is delivered; see RELEASE_NOTES.” That stays vision-level and points to the single place for done work.

---

**Summary**

- **Deliver next:** P2 #1 → #2 → #3 → #4 (multiple courses: data model, API, UI, scheduler).
- **Missing from TASKLIST:** Nothing; all roadmap items are covered.
- **ROADMAP cleanup:** Remove “Certificate enhancements (remaining)” so only future vision remains (per agent doc).
