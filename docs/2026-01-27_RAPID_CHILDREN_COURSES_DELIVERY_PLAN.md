# Rapid / Short Children Courses — Delivery Plan (Action Items)

**Date**: 2026-01-27  
**Status**: ✅ COMPLETE — Phases 1–6 and 2.5, 3 delivered; P5.3 and P6.2 done  
**Priority**: P1  
**Source**: `docs/2026-01-27_RAPID_CHILDREN_COURSES_ACTION_PLAN_AND_HANDOVER.md` — full spec, rules, data model, §10/§11.

**Use this file to**: tick off action items as delivered. The action plan doc remains the single source of truth for scope, phases, and acceptance.

---

## Baseline and Rollback

- **Baseline**: Document before starting: `BASELINE_COMMIT=<hash>` (e.g. `git rev-parse HEAD`).
- **Rollback**: See action plan §7. New Course fields are additive; revert commits or `git reset --hard BASELINE_COMMIT` if needed.
- **Verification after rollback**: `npm run build`; 30-day course lesson/progress/final-exam/certificate still work.

---

## Phase 1: Schema and Resolvers (backend)

**Objective**: Course supports parent/child and selected lessons; no UI yet.  
**Deliverable**: Backend can represent a child course and resolve its lessons and cert question count.

| Done | ID | Action item | Files / touchpoints | Acceptance |
|------|-----|-------------|---------------------|------------|
| [x] | P1.1 | Add `parentCourseId`, `selectedLessonIds`, `courseVariant`, `certification.certQuestionCount`, `ccsId`, `isDraft` (or `status`) to Course schema and types | `app/lib/models/course.ts`, `ICourse` | Schema validates; existing courses unaffected. |
| [x] | P1.2 | Add helper `getParentCourse(course)` returning parent course doc or null | `app/lib/certification.ts` or `app/lib/course-helpers.ts` | Given child course, returns parent; given parent/standard, returns null. |
| [x] | P1.3 | Add helper `resolveLessonForChildDay(childCourse, dayNumber)` returning the parent Lesson for that “day” (using `selectedLessonIds[dayNumber - 1]`) | New or existing lib | Returns correct Lesson doc from parent course for child day 1..N. |
| [x] | P1.4 | Extend `resolvePoolCourse()` / certification flow so that when `certQuestionCount` is set, the final exam uses at most that many questions from the parent pool | `app/lib/certification.ts`, final-exam start/submit logic | Child course final exam uses ≤ certQuestionCount questions. |

---

## Phase 2: Lesson and Progress APIs for Child Courses

**Objective**: Day and progress APIs work for child courses using parent lessons.  
**Deliverable**: Learners enrolled in a child course see the right lessons and progress.

| Done | ID | Action item | Files / touchpoints | Acceptance |
|------|-----|-------------|---------------------|------------|
| [x] | P2.1 | In `GET /api/courses/[courseId]/day/[dayNumber]`, if course has `parentCourseId` and `selectedLessonIds`, resolve lesson via `resolveLessonForChildDay(course, day)` and return that lesson; use child’s `durationDays` for totalDays | `app/api/courses/[courseId]/day/[dayNumber]/route.ts` | For child, day 1..K returns parent lessons in selected order. |
| [x] | P2.2 | Allow `dayNumber` 1..`durationDays` for child (today’s “1..30” becomes 1..durationDays where applicable) | Same route | No 400 for valid child days. |
| [x] | P2.3 | Ensure course progress (currentDay, completedDays) uses child’s `durationDays` so “course complete” and “next lesson” are correct for child | Same route, CourseProgress usage | Progress is per child course; completion = all child days done. |
| [x] | P2.4 | Ensure any lesson/quiz submit or “next lesson” links use child’s courseId and day indices (1..K) | Quiz submit, course detail, day navigation | Learner stays in child course context. |

---

## Phase 2.5: Admin Course Management Reorg (CCS → Language Variants → Course)

**Objective**: Reorganize `/admin/courses` so that we first show CCS, then language variants under each CCS, then the course (language variant) as today. Course Idea and 30-Day Outline are stored as specified in the action plan §10.  
**Prerequisite**: CCS model/collection exists (see action plan §3.0, §10.3).  
**Deliverable**: Admin navigates Course Management as CCS → Language variants → Course.

| Done | ID | Action item | Files / touchpoints | Acceptance |
|------|-----|-------------|---------------------|------------|
| [x] | P2.5.1 | **Course Management** landing: list all **CCS** (and links to Course Prompt, Audited & Fixed Course Prompt). Source: CCS collection (§3.0, §10.3). Optionally seed/import from `docs/canonical/`. | `app/[locale]/admin/courses/page.tsx` or new structure (e.g. `admin/courses/ccs/`, `admin/courses/ccs/[ccsId]/`) | Admin sees CCS-first view. |
| [x] | P2.5.2 | Under each CCS: **submenu “Language variants”** listing courses that implement that CCS (e.g. PRODUCTIVITY_2026_HU, PRODUCTIVITY_2026_EN). | Same or child route | Clicking a CCS shows its language variants. |
| [x] | P2.5.3 | Clicking a **language variant** opens the **course editor** as today: `/[locale]/admin/courses/[courseId]`. No URL change for the editor itself. | Existing `app/[locale]/admin/courses/[courseId]/page.tsx` | Course editor URL and behaviour unchanged. |
| [x] | P2.5.4 | **Course Idea**: store in CCS settings. Markdown free text; Agent creates it, editor inputs via UI. At creation; if Idea/Outline/CCS is modified later, all related courses go draft until published again. | CCS model or equivalent; course-creation flow | Idea is persisted; edits trigger “related courses go draft”. |
| [x] | P2.5.5 | **30-Day Advanced Outline**: same as Idea — stored in CCS settings, Markdown, provided by editor **before** any language variant and before CCS is finalized. Creation order: Idea → Outline → CCS → variants. | Same as P2.5.4 | Outline is persisted; creation order enforced. |

---

## Phase 3: “Shorts” (Create Shorts) and Checkbox Lesson Selection (Admin UI)

**Objective**: On the **language-variant course** page, add **“Shorts”** (like Certification Settings). Admin checks lessons; on Save the system chooses short type by count. Shorts are **draft** until the editor **publishes** them.  
**Prerequisite**: Phase 2.5 is done (§10.7).  
**Deliverable**: Admin creates shorts from the course page via checkboxes; type is chosen by lesson count; shorts are draft until published.

| Done | ID | Action item | Files / touchpoints | Acceptance |
|------|-----|-------------|---------------------|------------|
| [x] | P3.1 | Add **“Shorts”** section on the course editor (same level as “Certification Settings”): entry to create/manage short variants from this (parent) course. | `app/[locale]/admin/courses/[courseId]/page.tsx` | “Shorts” visible on parent (language-variant) course. |
| [x] | P3.2 | Shorts UI: (1) List all parent lessons with **checkboxes**; (2) Reorder selected (order = Day 1..N); (3) On **Save**, system assigns **short type** from count only (1–3→Essentials, 4–7→Beginner, 8–12→Foundations, 13–20→Core Skills, 21+→Full Program); (4) Child name = `{ParentBase}: {TypeLabel}`; (5) Set certQuestionCount; (6) New shorts created as **draft**; editor **publishes** when ready. | New section or modal on course page, or dedicated Shorts tab | Admin selects lessons by checkbox; save derives type; draft until published. |
| [x] | P3.3 | Create child course via API: `courseId` = `{parentCourseId}_{courseVariant}` (§10.5), `parentCourseId`, `selectedLessonIds`, `courseVariant` = derived type, `durationDays = selectedLessonIds.length`, `certification.poolCourseId = parent.courseId`, `certification.certQuestionCount`, `isDraft: true`. Publish endpoint or PATCH sets `isDraft: false` when editor publishes. | `POST /api/admin/courses/fork` or `POST /api/admin/courses`; PATCH or `POST .../publish` | Child is created as draft; courseId unique per parent+type; publish makes it live. |
| [x] | P3.4 | Ensure child is created with distinct `courseId` (per P3.3) and is listable under “Shorts” for this parent. Catalog and “my courses” show only **published** shorts (non-draft). | Course creation, admin Shorts list, catalog visibility (filter by isDraft === false) | Child appears in admin; catalog shows it only when published. |
| [x] | P3.5 | **Publish control**: For each short (Essentials, Beginner, …), show “Draft” vs “Published” and a **Publish** button. When editor publishes, short goes live. | Shorts section on course page | Admin can publish shorts when ready; no date picker. |

---

## Phase 4: Child Course Editor — Read-Only Lessons, No Quiz Edit

**Objective**: In the child course editor, lesson and quiz are not editable; editing is only in the parent.  
**Deliverable**: In the child course, the editor cannot edit lessons or quizzes; they are read-only and managed in the parent.

| Done | ID | Action item | Files / touchpoints | Acceptance |
|------|-----|-------------|---------------------|------------|
| [x] | P4.1 | In admin course editor, if `course.parentCourseId` is set, **hide** “Edit” and “Add Lesson” for the lesson list; show selected parent lessons as read-only (title, day index, optional “Preview” link to parent lesson) | `app/[locale]/admin/courses/[courseId]/page.tsx` | Child editor shows read-only lesson list; no Edit/Add. |
| [x] | P4.2 | In child course editor, **hide** or **disable** quiz management (no QuizManagerModal / “Manage quiz” for lessons). Optional: show “Quiz managed in parent course” or link to parent | Same page, QuizManagerModal usage | Child has no quiz edit UI. |
| [x] | P4.3 | Optionally show a short notice: “This is a short course. Lesson and quiz content are managed in the parent course [link].” | Same page | Clear for operator. |
| [x] | P4.4 | Child course editor may still edit **course-level** fields (name, description, thumbnail, pricing, certification on/off, certQuestionCount, etc.) if desired; only lesson/quiz are locked to parent | Same page, form sections | Scope of “no edit” is lesson + quiz only. |

---

## Phase 5: Certificate with Limited Number of Questions

**Objective**: Child course final exam and certificate use a limited question count.  
**Deliverable**: Child course certificates use a limited number of questions and the same overall certificate flow as 30-day courses.

| Done | ID | Action item | Files / touchpoints | Acceptance |
|------|-----|-------------|---------------------|------------|
| [x] | P5.1 | When starting a final exam for a course with `certification.certQuestionCount`, draw at most that many questions from the parent pool (pool resolved via `resolvePoolCourse` / `poolCourseId`) | `app/api/certification/final-exam/start/route.ts`, pool selection logic | Child exam uses ≤ certQuestionCount questions. |
| [x] | P5.2 | Ensure pass rule (e.g. 70%) and certificate issuance logic work with this smaller set (e.g. “70% of answered” or “70% of certQuestionCount”) | Final exam submit, certificate eligibility | Certificate is issued when the child’s pass rule is met. |
| [x] | P5.3 | Document the chosen rule (e.g. “pass at 70% of questions correct, minimum N questions”) in the action plan or in `docs/certification_final_exam_plan*.md` | This doc or certification_final_exam_plan | Rule is explicit and consistent. |

---

## Phase 6: Catalog, Enrollment, and Email

**Objective**: Child courses appear in catalog; enrollment and daily emails (if any) use child’s day indices.  
**Deliverable**: End-to-end flow from catalog → enroll → lessons → final exam → certificate works for a child course.

| Done | ID | Action item | Files / touchpoints | Acceptance |
|------|-----|-------------|---------------------|------------|
| [x] | P6.1 | Catalog and “my courses” include child courses only when **published** (not draft); display duration and short-type label (Essentials, Beginner, etc.). | Courses list API, `app/[locale]/courses/page.tsx`, my-courses | Child courses discoverable and enrollable only when published. |
| [x] | P6.2 | If daily email sends “next lesson” links, use child’s courseId and day 1..K (not parent’s day numbers) | Email / cron logic that builds lesson links | Links point to child course and correct day. |
| [x] | P6.3 | Enrollment creates progress with `courseId = child._id` and `durationDays = child.durationDays` | Enrollment API, CourseProgress | Enrolled users see child timeline. |

---

## Post-Delivery Checklist

When the feature is delivered:

- [x] Update **TASKLIST**: Add or refine tasks under “Multi-Format / Short Children Courses” to reference this delivery plan and the action plan (P1–P6). Mark completed items.
- [x] Update **ROADMAP**: Under “Multi-Format Course Forking”, state that implementation plan = `docs/2026-01-27_RAPID_CHILDREN_COURSES_ACTION_PLAN_AND_HANDOVER.md` and delivery plan = this file.
- [ ] Update **RELEASE_NOTES**: Add an entry describing rapid/children courses and the new/updated APIs and UI.
- [x] Update **this file**: Set **Status** to ✅ COMPLETE and tick all action items above.

---

## Acceptance Criteria (from action plan §6)

- [ ] Child course can be created from a parent with checkbox-selected lessons and optional cert question count.
- [ ] Child course editor shows lessons in read-only form; no Edit lesson or Edit quiz in child.
- [ ] Learners in a child course see the correct lessons (parent content) for “Day 1” … “Day K”.
- [ ] Progress and completion are correct for the child (K days).
- [ ] Child course final exam uses at most `certQuestionCount` questions from the parent pool.
- [ ] Certificate is issued at the end of the child course when the pass rule is met.
- [ ] Existing 30-day courses and certification remain unchanged.
