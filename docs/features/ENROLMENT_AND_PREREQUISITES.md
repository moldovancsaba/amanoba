# Enrolment and prerequisites

**Last updated**: 2026-02-09  
**Status**: Active — P2 items 1–3 done (model + API + UI). Email/scheduler (P2 #4) pending.

---

## Overview

- Players can be **enrolled in multiple courses** at once. Each enrolment is one `CourseProgress` document (playerId + courseId, unique).
- A course can declare **prerequisites**: other courses that must be **completed** (CourseProgress status `COMPLETED`) before a player can enrol.
- **Enrolment API** is idempotent and enforces prerequisites when configured.

---

## UI behavior (P2 #3)

- **Dashboard:** Shows all active enrolments with per-course progress and next lesson (multi-course aware).
- **Course discovery:** `/courses` shows a clear **Enrol** CTA for non-enrolled courses and **Continue Learning** for enrolled courses.
- **Prerequisite notices:** Course list and course detail show unmet prerequisites. Enrol is disabled when enforcement is `hard` and prerequisites are not met. UI handles API `PREREQUISITES_NOT_MET` response.

---

## Data model

### Course (relevant fields)

| Field | Type | Description |
|-------|------|-------------|
| `prerequisiteCourseIds` | `ObjectId[]` (ref: Course) | Optional. Course _ids that must be completed before this course can be enrolled. |
| `prerequisiteEnforcement` | `'hard' \| 'soft'` | Default `'hard'`. With `hard`, enrolment is blocked until all prerequisites are completed. `soft` reserved for future (warn but allow). |

- Set via **PATCH** `/api/admin/courses/[courseId]` (body: `{ prerequisiteCourseIds: [...], prerequisiteEnforcement: 'hard' }`). No admin UI yet; use API or add form later.

### CourseProgress (enrolment record)

- One document per (playerId, courseId). Unique index: `playerId + courseId`.
- Fields: `currentDay`, `completedDays`, `status` (`not_started` \| `in_progress` \| `completed` \| `abandoned`), `startedAt`, `completedAt`, `lastAccessedAt`, `emailSentDays`, `assessmentResults`, `totalPointsEarned`, `totalXPEarned`, etc.
- **Completed** means the course is done (all required days/assessments); used for prerequisite checks.

---

## API

### Enrol in a course

**POST** `/api/courses/[courseId]/enroll`

- **Auth**: Required (session).
- **Idempotent**: If the player is already enrolled, returns **200** with `{ success: true, message: 'Already enrolled', progress }` (no new document).
- **Prerequisites**: If the course has `prerequisiteCourseIds`, the API checks that the player has a `CourseProgress` with `status: 'completed'` for **each** of those courses. If `prerequisiteEnforcement === 'hard'` and any prerequisite is not met:
  - **403** with body:
    - `error: 'Prerequisites not met'`
    - `code: 'PREREQUISITES_NOT_MET'`
    - `unmetPrerequisites: [{ courseId, name }, ...]`
- **Other errors**: 404 (course not found / not active), 403 (premium required), 401 (unauthorized).
- **Success**: 201 with `{ success: true, message: 'Enrolled successfully', progress }`.

### List my enrolments

**GET** `/api/my-courses`

- **Auth**: Required.
- **Query**: `locale` (optional) — resolves course name/description for that locale.
- **Response**: `{ success: true, courses: [...], count }`. Each item: `course` (courseId, name, description, thumbnail, language, durationDays) and `progress` (currentDay, completedDays, totalDays, progressPercentage, isCompleted, startedAt, lastAccessedAt).

---

## Related docs

- **TASKLIST.md** — P2 #1–2 done; P2 #3 (UI: Enrol + prerequisite notices), P2 #4 (email/scheduler for multiple enrolments) pending.
- **ARCHITECTURE.md** — High-level enrolment and prerequisites summary in § Learning Platform.
- **RELEASE_NOTES.md** — P2 enrolment + prerequisites (TASKLIST #1–2) entry.
