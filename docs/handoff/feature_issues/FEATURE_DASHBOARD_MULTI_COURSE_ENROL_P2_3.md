# Feature issue (mvp-factory-control) — Dashboard / multi-course Enrol + prerequisites

**Template**: Feature  
**Objective**: Dashboard/course pages: show every course in progress, surface "Enrol" with prerequisite notices, respect multi-course state  
**TASKLIST**: P2 § Multiple courses: enrolment + prerequisites — item #3  
**Status**: [mvp-factory-control #2](https://github.com/moldovancsaba/mvp-factory-control/issues/2) · **Board:** Status Backlog, Agent Tribeca, Product amanoba, Type Feature, Priority P0. Move to **Ready** to start work.

---

## Title (short)

Dashboard & course pages: multi-course in progress, Enrol CTA, prerequisite notices

---

## Objective

- **Dashboard/course pages** show **every course in progress** for the learner (all active enrolments).
- **Surface the "Enrol" action** with **prerequisite notices** (e.g. "Complete X before enrolling in Y" when prerequisites exist and are not met).
- **Respect multi-course state everywhere**: today’s lessons (per enrolled course), badge sync, and any other UI that assumes a single course must work with multiple active courses.

---

## Acceptance criteria

- [ ] **Dashboard**: Lists all courses the learner is enrolled in (in progress), with per-course progress (current day, completion %, next lesson).
- [ ] **Course list / discovery**: For each course the learner is not enrolled in, show a clear **Enrol** action (button/link).
- [ ] **Prerequisite notices**: If a course has prerequisites (see `Course.prerequisiteCourseIds`, `prerequisiteEnforcement`) and the learner has not completed them, show a **prerequisite notice** (e.g. "Complete [Course A] first") and either disable Enrol or show Enrol with an explanation; enrolment API already returns 403 + `PREREQUISITES_NOT_MET` when enforced.
- [ ] **Multi-course state**: "Today’s lessons", badge sync, and dashboard summaries reflect **all** active enrolments, not a single course.
- [ ] **Existing API**: Use `GET /api/my-courses` for enrolments; `POST /api/courses/[courseId]/enroll` for enrolment (idempotent); handle 403 `PREREQUISITES_NOT_MET` and `unmetPrerequisites` in UI.

---

## Out of scope (this issue)

- Email/scheduler for multiple enrolments (P2 #4).
- Changes to enrolment API or data model (P2 #1–2 already done).

---

## References

- **TASKLIST**: `docs/product/TASKLIST.md` — P2 #3
- **Enrolment & prerequisites**: `docs/features/ENROLMENT_AND_PREREQUISITES.md` (model, API, GET /api/my-courses, POST /api/courses/[courseId]/enroll)
- **Handoff**: `docs/handoff/HANDOFF_MVP_FACTORY_CONTROL.md` — work starts when this card is in **Ready**

---

**Next step**: Create this as a Feature issue in mvp-factory-control using your Feature template; move to **Ready** when approved so work can start.
