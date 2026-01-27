# Rapid / Short Children Courses — Detailed Action Plan & Handover

**Date**: 2026-01-27  
**Last Updated**: 2026-01-27 (grouping, short types, draft/publish, §10 fully resolved, no TBD — §11)  
**Status**: READY FOR IMPLEMENTATION  
**Priority**: P1  
**Owner**: Tribeca (development). Content: Katja.  
**Related**: `docs/2026-01-23_SHORT_COURSES_FEATURE.md`, `docs/ROADMAP.md` (Multi-Format Course Forking), `docs/TASKLIST.md` (MF1–MF8), **`docs/2026-01-27_RAPID_CHILDREN_COURSES_DELIVERY_PLAN.md`** (action-item breakdown for delivery), `docs/canonical/` (CCS), `agent_working_loop_canonical_operating_document.md`

---

## 0. Admin Course Management Grouping (UI and Business Logic)

To keep course creation and variants aligned with the real workflow, **Course Management** (`/admin/courses`) is reorganized around a clear hierarchy. This section defines that structure and how shorts and draft/publish fit in.

### 0.1 Creation and Grouping Hierarchy

When we create or manage courses we work in this order:

| Step | Entity | Description | Stored / Shown |
|------|--------|-------------|----------------|
| 1 | **Course Idea** | The initial idea we use to create the course. | Stored in **CCS (course family) settings** — markdown; at creation (§10.1). |
| 2 | **30-Day Advanced Outline** | The full outline for the 30-day course. | Same: **CCS settings**, markdown; provided by editor **before** any variant/CCS (§10.2). |
| 3 | **CCS (Canonical Course Spec)** | Language-neutral source of truth: concepts, procedures, assessment blueprint. Same role as today’s `docs/canonical/<NAME>/` (e.g. `PRODUCTIVITY_2026_CCS.md` + `.canonical.json`). | In **Course Management** we list: all **CCS**, **Course Prompt**, and **Audited & Fixed Course Prompt** used to create variants. CCS is a DB entity (§10.3). |
| 4 | **Language variants** | One course per language, e.g. `PRODUCTIVITY_2026_HU`, `PRODUCTIVITY_2026_EN`. | Under **CCS** as a submenu: list all language variants. |
| 5 | **Course (language variant)** | The concrete course as we have it now, e.g. `https://www.amanoba.com/en/admin/courses/PRODUCTIVITY_2026_HU`. | Same URL pattern as today; from here we manage lessons, Certification Settings, and **Shorts**. |

**UI implication**:  
- **Course Management** first shows a **CCS-level** view: list of CCS (and links to Course Prompt / Audited & Fixed Course Prompt).  
- Each CCS has a **submenu** “Language variants” listing e.g. PRODUCTIVITY_2026_HU, PRODUCTIVITY_2026_EN.  
- Clicking a language variant opens the **course editor** as today (lessons, Certification Settings, etc.), plus the new **Shorts** (see below).

### 0.2 Shorts: Placement and Behaviour

- **Where**: On the **language-variant course** page, in the same way we have **“Certification Settings”**, we add **“Shorts”** (or “Create shorts” / “Short course variants”).
- **What**: Admin checks which lessons to include; on **Save**, the **system chooses the short type by lesson count** (see 0.3). No separate “variant type” picker — type is derived from count.
- **Activation**: **Any** short type can be **activated even if the 30-day course is still draft**. No dependency on the parent being published first.
- **Timeline**: No date-based timeline. Admin **publishes** each short when ready; until then it stays draft (see §0.4).

### 0.3 Short Type by Lesson Count (System-Chosen)

On save, the system assigns the short type **only** from the number of selected lessons:

| Lesson count | Short type (label) | Example name pattern | Can be activated if 30-day is draft? |
|--------------|--------------------|-----------------------|--------------------------------------|
| 1–3 | **Essentials** | e.g. “SEO 2026: Essentials” | Yes |
| 4–7 | **Beginner Course** | e.g. “SEO 2026: Beginner Course” | Yes |
| 8–12 | **Foundations** | e.g. “SEO 2026: Foundations” | Yes |
| 13–20 | **Core Skills** | e.g. “SEO 2026: Core Skills” | Yes |
| 21+ | **Full Program** | e.g. “SEO 2026: Full Program” | Yes (21+ can be active even if 30-day is draft) |

- **Naming**: Child course name can follow the pattern `{ParentBase} + “: ” + type label` (e.g. “SEO 2026: Essentials”). ParentBase = parent course display name; TypeLabel = Essentials | Beginner Course | …; fixed pattern (§10.5).
- **courseVariant** (or equivalent) in data: map to e.g. `'essentials' | 'beginner' | 'foundations' | 'core_skills' | 'full_program'` for 1–3, 4–7, 8–12, 13–20, 21+.

### 0.4 Shorts: Draft Until Published

- **Keep it simple**: Shorts (child courses) are **draft** until the editor explicitly **publishes** them. When published, they go live. No per-date “timeline” — use **draft / published** (same pattern as course publish if it exists).
- **Business logic**: Each short has an **isDraft** (or **status: 'draft' | 'published'**) flag. Catalog and “my courses” show only published shorts. Editor can publish any short at any time (including while the parent 30-day course is still draft).
- **If the parent/CCS or any upstream step is modified**, course refactoring is required and **all related courses go draft** until the editor manually publishes them again (see §10.1).

---

## 1. Purpose and Scope

### 1.1 Goal

Deliver **rapid/short courses** built from existing 30-day courses by:

- **Selecting existing lessons with checkboxes** from a parent (30-day) course and reusing them in a “child” course.
- **Keeping lesson and quiz editing only on the parent**: in the child course, the editor cannot edit lesson content or quiz; all edits happen on the parent. The child displays a read-only, checkbox-based selection of parent lessons.
- **Issuing a certificate at the end** of the child course in the same way as for 30-day courses, but with a **limited number of questions** (e.g. configurable or fixed per variant).

### 1.2 Out of Scope (Explicitly)

- Creating new lesson or quiz content in the child (content lives only in the parent).
- Auto-sync of parent changes into child (manual re-publish or sync is a later phase).
- New variant types beyond what is defined below (e.g. “1-hour” is not in first delivery if not needed).

### 1.3 Existing Foundation

- **Course model**: `certification.poolCourseId` exists; certification uses parent question pool via `resolvePoolCourse()`.
- **Certification**: Final exam and certificate flow exist for 30-day courses; `isCertificationAvailable()` requires `poolCount >= 50`.
- **Admin course editor**: `app/[locale]/admin/courses/[courseId]/page.tsx` — lessons list, Edit/Add Lesson, QuizManagerModal; lessons and quiz APIs under `/api/admin/courses/[courseId]/lessons/...`.

---

## 2. Product Rules (What We Build)

| Rule | Description |
|------|-------------|
| R1 | Child course is created from one parent (30-day) **language-variant** course (e.g. PRODUCTIVITY_2026_HU). |
| R2 | Admin selects which parent lessons appear in the child via **checkboxes**. Order of selection defines “Day 1, Day 2, …”. On **Save**, the system assigns **short type** from lesson count only (1–3 → Essentials, 4–7 → Beginner, 8–12 → Foundations, 13–20 → Core Skills, 21+ → Full Program). |
| R3 | In the **child** course editor: **no** “Edit lesson” or “Edit quiz” for those lessons. Lesson list is read-only; editing is only in the parent. |
| R4 | Learner experience: child course has fewer “days”. Each “day” shows the corresponding parent lesson and (if enabled) the parent’s quiz. |
| R5 | At the end of the child course, the learner can take a **certificate** (final exam) in the same way as 30-day courses, but with a **limited number of questions**. Question pool remains the parent’s pool (via `poolCourseId`). |
| R6 | Child course reuses parent’s lesson content and quizzes by reference; no duplication of lesson/quiz documents. |
| R7 | **Any** short type (Essentials through Full Program) can be **activated even if the parent 30-day course is still draft**. No dependency on parent publish. |
| R8 | Shorts are **draft** until the editor **publishes** them; when published they go live. No date-based timeline. If any upstream step (Idea, Outline, CCS) is modified, related courses go draft until published again. |

---

## 3. Data Model Changes

### 3.0 CCS (Course Family) Model — see §10.3

Introduce a **CCS** (or **CourseFamily**) collection as the parent of all language variants and grandparent of all length variants. Hierarchy: **CCS → language-variant Course → short Course**. CCS holds: unique id (`ccsId` or slug), **Course Idea** (markdown), **30-Day Advanced Outline** (markdown), **related documents** (Course Prompt, Audited & Fixed — §10.4). Course has **`ccsId`** (or `courseFamilyId`) referencing the CCS; “which courses belong to which CCS?” → query by `Course.ccsId`. Shorts inherit `ccsId` from their parent course.

### 3.1 Course Model (`app/lib/models/course.ts`)

Add to the Course schema (and to `ICourse` if using TypeScript interface):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ccsId` | `ObjectId` or `String` | No | References the CCS (course family). Set for language-variant and short courses; shorts inherit from parent. See §3.0, §10.3. |
| `parentCourseId` | `ObjectId` (ref: `'Course'`) or `String` (courseId) | No | Set only for child courses. References the parent 30-day course. |
| `selectedLessonIds` | `[String]` | No | Only for child courses. Ordered list of parent lessonIds. Index 0 = child “Day 1”, index 1 = “Day 2”, etc. |
| `courseVariant` | `String` enum | No | For shorts: `'essentials' \| 'beginner' \| 'foundations' \| 'core_skills' \| 'full_program'` (derived from lesson count: 1–3, 4–7, 8–12, 13–20, 21+). For 30-day: `'standard'`. Legacy: `'7day' \| 'weekend' \| '1day' \| '1hour'` if kept. |
| `certification.certQuestionCount` | `Number` | No | Max number of questions in the child’s final exam (e.g. 20, 25). If unset, use existing behaviour (e.g. 50 for standard). |
| `isDraft` or `status` | `Boolean` or `'draft' \| 'published'` | No | For shorts (and optionally for CCS/language variants): draft until editor publishes. Catalog shows only non-draft/published. |

- For a child course, set `durationDays = selectedLessonIds.length`.
- Keep `certification.poolCourseId` set to the parent’s `courseId` when creating a child (as today).
- **Short type**: derived on save from `selectedLessonIds.length` and stored in `courseVariant` (or a dedicated `shortType` field if preferred).
- **Child courseId**: human-readable, `{parentCourseId}_{courseVariant}` (e.g. `PRODUCTIVITY_2026_HU_essentials`). Uniqueness: one short per (parent, type) in first delivery (§10.5).
- **Timeline**: not date-based. Use **draft until published**; when published, the short goes live (see §0.4, §10.6).

### 3.2 Migration

- New fields are optional; no migration of existing courses required.
- When implementing, add a single migration or schema change commit that only adds these fields (no data transform).

---

## 4. Implementation Phases and Tasks

### Phase 1: Schema and Resolvers (backend)

**Objective**: Course supports parent/child and selected lessons; no UI yet.

| ID | Task | Files / Touchpoints | Acceptance |
|----|------|---------------------|------------|
| P1.1 | Add `parentCourseId`, `selectedLessonIds`, `courseVariant`, `certification.certQuestionCount` to Course schema and types | `app/lib/models/course.ts`, `ICourse` | Schema validates; existing courses unaffected. |
| P1.2 | Add helper `getParentCourse(course)` returning parent course doc or null | `app/lib/certification.ts` or `app/lib/course-helpers.ts` | Given child course, returns parent; given parent/standard, returns null. |
| P1.3 | Add helper `resolveLessonForChildDay(childCourse, dayNumber)` returning the parent Lesson for that “day” (using `selectedLessonIds[dayNumber - 1]`) | New or existing lib | Returns correct Lesson doc from parent course for child day 1..N. |
| P1.4 | Extend `resolvePoolCourse()` / certification flow so that when `certQuestionCount` is set, the final exam uses at most that many questions from the parent pool | `app/lib/certification.ts`, final-exam start/submit logic | Child course final exam uses ≤ certQuestionCount questions. |

**Deliverable**: Backend can represent a child course and resolve its lessons and cert question count.

---

### Phase 2: Lesson and Progress APIs for Child Courses

**Objective**: Day and progress APIs work for child courses using parent lessons.

| ID | Task | Files / Touchpoints | Acceptance |
|----|------|---------------------|------------|
| P2.1 | In `GET /api/courses/[courseId]/day/[dayNumber]`, if course has `parentCourseId` and `selectedLessonIds`, resolve lesson via `resolveLessonForChildDay(course, day)` and return that lesson; use child’s `durationDays` for totalDays | `app/api/courses/[courseId]/day/[dayNumber]/route.ts` | For child, day 1..K returns parent lessons in selected order. |
| P2.2 | Allow `dayNumber` 1..`durationDays` for child (today’s “1..30” becomes 1..durationDays where applicable) | Same route | No 400 for valid child days. |
| P2.3 | Ensure course progress (currentDay, completedDays) uses child’s `durationDays` so “course complete” and “next lesson” are correct for child | `app/api/courses/[courseId]/day/[dayNumber]/route.ts`, CourseProgress usage | Progress is per child course; completion = all child days done. |
| P2.4 | Ensure any lesson/quiz submit or “next lesson” links use child’s courseId and day indices (1..K) | Quiz submit, course detail, day navigation | Learner stays in child course context. |

**Deliverable**: Learners enrolled in a child course see the right lessons and progress.

---

### Phase 2.5: Admin Course Management Reorg (CCS → Language Variants → Course)

**Objective**: Reorganize `/admin/courses` so that we first show CCS, then language variants under each CCS, then the course (language variant) as today. Course Idea and 30-Day Outline are stored as specified in clarifications.

| ID | Task | Files / Touchpoints | Acceptance |
|----|------|---------------------|------------|
| P2.5.1 | **Course Management** landing: list all **CCS** (and links to Course Prompt, Audited & Fixed Course Prompt). Source: **CCS collection** (see §3.0, §10.3). Optionally seed/import from `docs/canonical/`. | `app/[locale]/admin/courses/page.tsx` or new structure (e.g. `admin/courses/ccs/`, `admin/courses/ccs/[ccsId]/`) | Admin sees CCS-first view. |
| P2.5.2 | Under each CCS: **submenu “Language variants”** listing e.g. PRODUCTIVITY_2026_HU, PRODUCTIVITY_2026_EN (courses that implement that CCS). | Same or child route | Clicking a CCS shows its language variants. |
| P2.5.3 | Clicking a **language variant** opens the **course editor** as today: `/[locale]/admin/courses/[courseId]` (e.g. PRODUCTIVITY_2026_HU). No URL change for the editor itself. | Existing `app/[locale]/admin/courses/[courseId]/page.tsx` | Course editor URL and behaviour unchanged for the editor page. |
| P2.5.4 | **Course Idea**: store in **CCS settings** (or top-level “course” settings for that family). Markdown free text; Agent creates it, editor inputs via UI. Written **at creation**; if Idea/Outline/CCS is modified later, all related courses go draft until published again. | CCS model or equivalent; course-creation flow | Idea is persisted and editable only in a way that triggers “related courses go draft”. |
| P2.5.5 | **30-Day Advanced Outline**: same as Idea — stored in CCS (or top-level) settings, Markdown, provided by the course editor **always before any language variant and before CCS** is finalized. | Same as P2.5.4 | Outline is persisted; creation order enforced (Idea → Outline → CCS → language variants). |

**Deliverable**: Admin navigates Course Management as CCS → Language variants → Course. Course Idea and 30-Day Outline live in CCS-level (or “course family”) settings; creation order is Idea → Outline → CCS → variants.

---

### Phase 3: “Shorts” (Create Shorts) and Checkbox Lesson Selection (Admin UI)

**Objective**: On the **language-variant course** page, add **“Shorts”** (like Certification Settings). Admin checks lessons; on Save the system chooses short type by count. Shorts are **draft** until the editor **publishes** them; when published they go live. **Phase 3 is implemented only after Phase 2.5 (full Course Management reorg) is done** (§10.7).

| ID | Task | Files / Touchpoints | Acceptance |
|----|------|---------------------|------------|
| P3.1 | Add **“Shorts”** section on the course editor (same level as “Certification Settings”): entry to create/manage short variants from this (parent) course. | `app/[locale]/admin/courses/[courseId]/page.tsx` | “Shorts” visible on parent (language-variant) course. |
| P3.2 | Shorts UI: (1) List all parent lessons with **checkboxes**; (2) Reorder selected (order = Day 1..N); (3) On **Save**, system assigns **short type** from count only (1–3 → Essentials, 4–7 → Beginner, 8–12 → Foundations, 13–20 → Core Skills, 21+ → Full Program); (4) Child name follows pattern e.g. “{ParentBase}: {TypeLabel}”; (5) Set certQuestionCount; (6) New shorts are created as **draft**; editor **publishes** when ready (no date-based timeline). | New section or modal on course page, or dedicated Shorts tab | Admin selects lessons by checkbox; save derives type; draft until published. |
| P3.3 | Create child course via API: `courseId` = `{parentCourseId}_{courseVariant}` (§10.5), `parentCourseId`, `selectedLessonIds`, `courseVariant` = derived type, `durationDays = selectedLessonIds.length`, `certification.poolCourseId = parent.courseId`, `certification.certQuestionCount`, `isDraft: true` (or `status: 'draft'`). Publish endpoint or PATCH sets `isDraft: false` when editor publishes. | `POST /api/admin/courses/fork` or `POST /api/admin/courses`; PATCH or `POST .../publish` | Child is created as draft; publish makes it live. |
| P3.4 | Ensure child gets a distinct `courseId` and is listable under “Shorts” for this parent. Catalog and “my courses” show only **published** shorts (non-draft). | Course creation, admin Shorts list, catalog visibility (filter by isDraft === false) | Child appears in admin; catalog shows it only when published. |
| P3.5 | **Publish control**: For each short (Essentials, Beginner, …), show “Draft” vs “Published” and a **Publish** button. When editor publishes, short goes live. | Shorts section on course page | Admin can publish shorts when ready; no date picker. |

**Deliverable**: Admin creates shorts from the course page via checkboxes; type is chosen by lesson count; shorts are draft until published; any short can be published even if 30-day is still draft.

---

### Phase 4: Child Course Editor — Read-Only Lessons, No Quiz Edit

**Objective**: In the child course editor, lesson and quiz are not editable; editing is only in the parent.

| ID | Task | Files / Touchpoints | Acceptance |
|----|------|---------------------|------------|
| P4.1 | In admin course editor, if `course.parentCourseId` is set, **hide** “Edit” and “Add Lesson” for the lesson list; show selected parent lessons as read-only (title, day index, optional “Preview” link to parent lesson) | `app/[locale]/admin/courses/[courseId]/page.tsx` | Child editor shows read-only lesson list; no Edit/Add. |
| P4.2 | In child course editor, **hide** or **disable** quiz management (no QuizManagerModal / “Manage quiz” for lessons). Optional: show “Quiz managed in parent course” or link to parent | Same page, QuizManagerModal usage | Child has no quiz edit UI. |
| P4.3 | Optionally show a short notice: “This is a short course. Lesson and quiz content are managed in the parent course [link].” | Same page | Clear for operator. |
| P4.4 | Child course editor may still edit **course-level** fields (name, description, thumbnail, pricing, certification on/off, certQuestionCount, etc.) if desired; only lesson/quiz are locked to parent | Same page, form sections | Scope of “no edit” is lesson + quiz only. |

**Deliverable**: In the child course, the editor cannot edit lessons or quizzes; they are read-only and managed in the parent.

---

### Phase 5: Certificate with Limited Number of Questions

**Objective**: Child course final exam and certificate use a limited question count.

| ID | Task | Files / Touchpoints | Acceptance |
|----|------|---------------------|------------|
| P5.1 | When starting a final exam for a course with `certification.certQuestionCount`, draw at most that many questions from the parent pool (today pool is already resolved via `resolvePoolCourse` / `poolCourseId`) | `app/api/certification/final-exam/start/route.ts`, pool selection logic | Child exam uses ≤ certQuestionCount questions. |
| P5.2 | Ensure pass rule (e.g. 70%) and certificate issuance logic work with this smaller set (e.g. “70% of answered” or “70% of certQuestionCount”) | Final exam submit, certificate eligibility | Certificate is issued when the child’s pass rule is met. |
| P5.3 | Document the chosen rule (e.g. “pass at 70% of questions correct, minimum N questions”) in this doc or in certification_final_exam_plan | This doc or `docs/certification_final_exam_plan*.md` | Rule is explicit and consistent. |

**Deliverable**: Child course certificates use a limited number of questions and the same overall certificate flow as 30-day courses.

---

### Phase 6: Catalog, Enrollment, and Email (if applicable)

**Objective**: Child courses appear in catalog; enrollment and daily emails (if any) use child’s day indices.

| ID | Task | Files / Touchpoints | Acceptance |
|----|------|---------------------|------------|
| P6.1 | Catalog and “my courses” include child courses only when **published** (not draft); display duration and short-type label (Essentials, Beginner, etc.). | Courses list API, `app/[locale]/courses/page.tsx`, my-courses | Child courses discoverable and enrollable only when published. |
| P6.2 | If daily email sends “next lesson” links, use child’s courseId and day 1..K (not parent’s day numbers) | Email / cron logic that builds lesson links | Links point to child course and correct day. |
| P6.3 | Enrollment creates progress with `courseId = child._id` and `durationDays = child.durationDays` | Enrollment API, CourseProgress | Enrolled users see child timeline. |

**Deliverable**: End-to-end flow from catalog → enroll → lessons → final exam → certificate works for a child course.

---

## 5. File and API Checklist (Handover)

Implementers should touch at least the following:

| Area | Files / Endpoints |
|------|-------------------|
| **Models** | `app/lib/models/course.ts` — `parentCourseId`, `selectedLessonIds`, `courseVariant` (short types), `certQuestionCount`, `isDraft` or `status: 'draft'|'published'`; CCS model (or equivalent) per §10.3 |
| **Helpers** | New or existing: `app/lib/course-helpers.ts` or extend `app/lib/certification.ts` — `getParentCourse`, `resolveLessonForChildDay` |
| **Certification** | `app/lib/certification.ts` — `resolvePoolCourse`; eligibility when `certQuestionCount` is set |
| **APIs** | `app/api/courses/[courseId]/day/[dayNumber]/route.ts` — child-aware lesson resolution |
| **APIs** | `app/api/certification/final-exam/start/route.ts` (and submit if needed) — cap questions by `certQuestionCount` |
| **APIs** | New or existing: `POST /api/admin/courses/fork` or `POST /api/admin/courses` — create child with `parentCourseId`, `selectedLessonIds`, derived `courseVariant`, `isDraft: true`; publish endpoint sets non-draft when editor publishes |
| **Admin UI (reorg)** | `app/[locale]/admin/courses/page.tsx` or new routes — CCS-first list, submenu “Language variants”, links to Course Prompt / Audited & Fixed Course Prompt (see §10) |
| **Admin UI (course)** | `app/[locale]/admin/courses/[courseId]/page.tsx` — “Shorts” section (like Certification Settings), checkbox lesson list, draft/publish per short (no goLiveAt), read-only lesson/quiz when `parentCourseId` is set |
| **Catalog** | Courses list API, `app/[locale]/courses/page.tsx`, my-courses — filter child courses by **published** (non-draft) when returning active courses |

---

## 6. Acceptance Criteria (Summary)

- [ ] Child course can be created from a parent with checkbox-selected lessons and optional cert question count.
- [ ] Child course editor shows lessons in read-only form; no Edit lesson or Edit quiz in child.
- [ ] Learners in a child course see the correct lessons (parent content) for “Day 1” … “Day K”.
- [ ] Progress and completion are correct for the child (K days).
- [ ] Child course final exam uses at most `certQuestionCount` questions from the parent pool.
- [ ] Certificate is issued at the end of the child course when the pass rule is met.
- [ ] Existing 30-day courses and certification remain unchanged.

---

## 7. Safety Rollback Plan (Mandatory)

Per `agent_working_loop_canonical_operating_document.md`, every delivery must include a rollback plan.

### 7.1 Baseline

- **Stable baseline**: Latest tagged or committed version before any change for this feature (e.g. `git describe --tags` or current `main` commit hash).
- **Document the baseline** at the start of implementation:  
  `BASELINE_COMMIT=<hash>`

### 7.2 Rollback Steps

1. **Code rollback**  
   - `git revert <commit-range>` for all commits that implement rapid/children courses, or  
   - `git reset --hard BASELINE_COMMIT` (only if no other work is on the same branch and backups exist).
2. **Data**  
   - New Course fields (`parentCourseId`, `selectedLessonIds`, `courseVariant`, `certQuestionCount`) are additive and optional. No rollback of existing documents is required.  
   - If any child courses were created, they can remain in the DB; old code will ignore the new fields. Optionally hide them from the admin list via a quick filter until re-implementation.
3. **Verification after rollback**  
   - `npm run build` succeeds.  
   - Standard 30-day course: lesson fetch, progress, final exam, certificate still work.  
   - Admin course editor loads for a 30-day course without errors.

### 7.3 When to Roll Back

- Build or runtime errors that block production and cannot be fixed quickly.  
- Certification or progress logic for standard courses is broken.  
- Data inconsistency (e.g. progress or completion wrong for existing courses).

---

## 8. Documentation and References

### 8.1 Update When Implementing

- **Delivery plan**: Track progress in **`docs/2026-01-27_RAPID_CHILDREN_COURSES_DELIVERY_PLAN.md`** — action items P1.1–P6.3 with checkboxes; tick as delivered.
- **TASKLIST**: Add or refine tasks under “Multi-Format / Short Children Courses” (e.g. MF1–MF8) to reference this plan and the delivery plan; point to phases P1–P6.
- **ROADMAP**: Under “Multi-Format Course Forking”, add a line that the implementation plan and handover are in this doc and the **delivery plan** (action-item breakdown) is in `docs/2026-01-27_RAPID_CHILDREN_COURSES_DELIVERY_PLAN.md`.
- **RELEASE_NOTES**: When the feature is delivered, add an entry describing rapid/children courses and the new/updated APIs and UI.

### 8.2 Existing Docs

- **Short courses concept**: `docs/2026-01-23_SHORT_COURSES_FEATURE.md`  
- **ROADMAP**: “Multi-Format Course Forking (30d → 7d / Weekend / 1d / 1h)”  
- **TASKLIST**: MF1–MF8 (forking core, lesson mapping, quiz strategies, 7-day/weekend/1-day/1-hour, parent propagation)  
- **Certification**: `docs/certification_final_exam_plan*.md`, `app/lib/certification.ts`  
- **Agent rules**: `agent_working_loop_canonical_operating_document.md`

---

## 9. Clarifications (Previously Noted)

- **Cert question count default**: If `certQuestionCount` is not set for a child, require an explicit value (e.g. 20 or 25) when creating a child with certification enabled, or disable cert until set.
- **Reordering in UI**: “Order of selection = Day 1..N” can be checkbox order plus optional drag-and-drop or up/down for selected items.

---

## 10. Resolved Clarifications (Grouping and Short Types)

Decisions below are locked for implementation. Where the doc says “CCS (course family)”, it refers to the entity defined in §10.3.

### 10.1 Course Idea and “Course History”

- **Where is “course history” stored?** In **Course settings** — concretely, on the **CCS (course family)** entity (see §10.3). The idea is one of its fields.
- **What is stored as “the idea”?** **Markdown free text**. The Agent creates it; the editor inputs it via UI (or the Agent via API).
- **When is it written?** **At creation**. If any step (Idea, Outline, CCS) is modified later, **course refactoring is required** and **all related courses go draft** until the editor manually publishes them again.

### 10.2 30-Day Advanced Outline

- **Where is it stored?** **Same as above**: on the CCS (course family) entity, in its settings.
- **Format?** **Same as above**: Markdown free text.
- **Who creates it?** Provided by the **course editor**, **always before any language variant and before CCS** is finalized. Creation order: Idea → Outline → CCS → language variants.

### 10.3 CCS and Course Management UI — Architect’s Solution

**Is CCS a new DB entity?** **Yes.** Introduce a **CCS** (or **CourseFamily**) **model/collection** as the **parent of all language variants and grandparent of all length variants**. Hierarchy:

- **CCS (grandparent)** → **language-variant Course (parent)** → **short Course (child)**.

**Concrete design:**

1. **New entity: CCS** (e.g. collection `CCS` or `CourseFamily`). Its fields include, at least: unique id (`ccsId` or slug), **Course Idea** (markdown), **30-Day Advanced Outline** (markdown), **related documents** (Course Prompt, Audited & Fixed Course Prompt — see §10.4), and any existing canonical metadata you today keep in `docs/canonical/<NAME>/`. You can seed/import from `docs/canonical/` or create CCS rows via UI/API; the source of truth for “list all CCS” becomes the DB.
2. **Course model**: add **`ccsId`** (or `courseFamilyId`) referencing the CCS. **Which courses belong to which CCS?** — By **`Course.ccsId`**. Every language-variant course and every short has this set (shorts inherit from their parent course or you resolve via parent → parent’s `ccsId`).
3. **Relationship**: CCS has many language-variant Courses (each with `ccsId = that CCS`). Each language-variant Course can have many short (child) Courses via `parentCourseId`. No need for naming convention to infer family — use `ccsId`.
4. **Where Idea and Outline live:** On the **CCS** document. Course Management UI shows CCS-first; under each CCS, “Language variants” and the related documents (Course Prompt, Audited & Fixed) per §10.4.

**Summary:** CCS is a first-class DB entity. Course has `ccsId`. “Which courses belong to which CCS?” → query by `Course.ccsId`. Optionally keep `docs/canonical/` as export/backup or one-way sync from DB; the list and grouping in the UI come from the DB.

### 10.4 Course Prompt and Audited & Fixed Course Prompt

- **What are they in the UI?** **Related documents** — stored and shown in the system as documents **related to each CCS**, so everything is centralized and findable. Added by the **editor via UI** or by the **Agent via API**.
- **Where are they shown?** **Under each CCS** in the submenu (e.g. “Course Prompt”, “Audited & Fixed Course Prompt” as links or inline). No separate global “Documents” tab — they are per-CCS.

### 10.5 Short Type Naming and courseId — Resolved for Delivery

- **Child course display name:** `{ParentBase}: {TypeLabel}`. **ParentBase** = parent course display name (e.g. "SEO 2026", "Productivity 2026"). **TypeLabel** = Essentials | Beginner Course | Foundations | Core Skills | Full Program. Fixed pattern for first delivery; no configurable template.
- **courseId for shorts:** **Human-readable**, uniqueness guaranteed by parent + type. Use **`{parentCourseId}_{courseVariant}`** (e.g. `PRODUCTIVITY_2026_HU_essentials`, `PRODUCTIVITY_2026_HU_beginner`). At most one short per (parent, type) in first delivery; same slug/ID rules as existing courseIds. No UUID needed.

### 10.6 Timeline and goLiveAt

- **Resolved:** Keep it simple — **draft until published; when published, the short goes live.** No date-based timeline, no `goLiveAt`. Use **isDraft** (or **status: 'draft' | 'published'**). Catalog and “my courses” show only published (non-draft) shorts.

### 10.7 Order of Implementation

- **Resolved:** **Always full course first.** Phase 2.5 (full Course Management reorg: CCS → Language variants → Course) must be implemented **before** Phase 3 (Shorts). Shorts are built only after the CCS-first navigation and course-family model are in place.

---

## 11. Foundation for Delivery

**No open questions.** All items in §10 are **resolved** and locked for implementation:

| §10 | Topic | Status |
|-----|--------|--------|
| 10.1 | Course Idea — where, format, when | Resolved: CCS settings, markdown, at creation; upstream change → related courses go draft. |
| 10.2 | 30-Day Outline — where, format, who | Resolved: CCS settings, markdown; editor before any variant/CCS. |
| 10.3 | CCS and course family | Resolved: CCS = DB entity; Course has `ccsId`; hierarchy CCS → language Course → short Course. |
| 10.4 | Course Prompt & Audited & Fixed | Resolved: related documents per CCS; under each CCS; editor/Agent add via UI/API. |
| 10.5 | Short naming and courseId | Resolved: name = `{ParentBase}: {TypeLabel}`; courseId = `{parentCourseId}_{courseVariant}`. |
| 10.6 | Timeline / goLiveAt | Resolved: draft until published; when published, goes live. No goLiveAt. |
| 10.7 | Order of implementation | Resolved: Phase 2.5 (full course reorg) before Phase 3 (Shorts). |

**Delivery readiness:** The plan is **implementation-ready**. Phases, data model, rules, and clarifications are aligned; no TBDs remain. Follow phases in order, document baseline commit before starting, and update TASKLIST/ROADMAP/RELEASE_NOTES as work progresses.

---

**End of document.**  
This plan is ready for handover to implementation. Follow phases in order; document baseline commit before starting; update TASKLIST/ROADMAP/RELEASE_NOTES as work progresses.
