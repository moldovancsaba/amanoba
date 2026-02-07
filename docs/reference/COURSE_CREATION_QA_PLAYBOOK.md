# Course Creation QA Playbook (Idea → Outline → CCS → Build → QA → Publish)

This document is a **general quality assurance checklist** to use every time a new course is created, from the first idea to a **published, ready-to-enroll** course.

It intentionally references the existing SSOT documents and the production-grade scripts already in this repo.

---

## 0) Document Map (start here)

### Course creation + quality SSOT
- `agent_working_loop_canonical_operating_document.md` — repo operating rules (**rollback plan required for every delivery**).
- `docs/layout_grammar.md` — structure/layout rules for lessons + quizzes.
- `docs/COURSE_BUILDING_RULES.md` — course creation rules + quiz hard gates (0 recall, >=7 per lesson, language integrity).
- `docs/_archive/reference/QUIZ_QUALITY_PIPELINE_HANDOVER.md` — operational “how to run the pipeline”.
- `docs/_archive/reference/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md` — gold-standard question type + anti-patterns + commands + outputs.
- `2026_course_creator_prompts.md` — prompts + artifacts for **Idea → Outline → CCS → Create Course**.
- `2026_course_quality_prompt.md` — full recursive QC runbook/prompt (esp. for families like `PRODUCTIVITY_2026_*`).

### CCS + outline sources
- Canonical CCS (repo): `docs/canonical/<COURSE_FAMILY>/`
  - Example: `docs/canonical/PRODUCTIVITY_2026/PRODUCTIVITY_2026.canonical.json`
  - Example: `docs/canonical/PRODUCTIVITY_2026/PRODUCTIVITY_2026_CCS.md`
- Course idea blueprints (repo): `docs/course_ideas/`
- Course runs (logs/stateful execution): `docs/course_runs/`

### Quiz QA workflow + logging
- `docs/_archive/reference/QUIZ_ITEM_QA_HANDOVER.md` — workflow + commands
- `docs/QUIZ_ITEM_QA_HANDOVER_NEW2OLD.md` — run log (newest-first)
- `.state/quiz_item_qa_state.json` — cursor/state (SSOT; do not edit manually)

---

## 1) Definitions (so “done” is unambiguous)

- **CCS (Canonical Course Spec)**: course-family source of truth (concepts, procedures, assessment blueprint, constraints). One CCS can have multiple **language variant courses**.
- **Language variant course**: a specific course document per language (e.g. `PRODUCTIVITY_2026_EN`, `PRODUCTIVITY_2026_HU`) that references a CCS (`course.ccsId`).
- **Lesson quality gate**: minimum score (`>=70`) + language integrity passes.
- **Quiz quality gates (hard)**:
  - **0 RECALL**
  - **>= 7** active course-specific questions per active lesson
  - **>= 5 APPLICATION** per lesson (critical-thinking is recommended; do not lower quality)
  - Gold-standard question type: standalone, grounded, scenario-based, concrete deliverable/outcome, concrete distractors
  - Language integrity: questions + all options are fully in the course language (no leakage)
- **Ready to enroll**: course is published/active, shows in catalog, lessons + emails + quizzes pass gates, and an end-to-end smoke test works.

---

## 2) Safety Rollback Plan (mandatory every time)

Before any DB write:

### Git rollback (code/scripts)
```bash
git log -1 --oneline
git stash push -u -m "wip"
git reset --hard <BASELINE_COMMIT>
```

### DB rollback (content + quizzes)
- Lesson restore:
```bash
npx tsx --env-file=.env.local scripts/restore-lesson-from-backup.ts --file scripts/lesson-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json
```
- Quiz restore:
```bash
npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json
```

### Recommended “backup before apply”
- Backup lessons for a course:
```bash
npx tsx --env-file=.env.local scripts/backup-course-lessons.ts --course <COURSE_ID>
```
- Pipeline auto-writes quiz backups during apply:
  - `scripts/quiz-backups/<COURSE_ID>/...`

---

## 3) End-to-End Course Creation QA Checklist (from idea to publish)

Use this as a literal checklist. For any “apply” action: do a dry-run first.

### Phase A — Prereqs & scope (no DB writes)
- [ ] Confirm environment (which `.env` file / DB are you writing to?).
  - Default for course creation work: **production** via `.env.local`, dbName=`amanoba`.
- [ ] Confirm course family id (`CCS_ID`) and variant courseIds (`<CCS_ID>_<LOCALE>`).
- [ ] Confirm target language(s) and that UI translations exist:
  - If locale missing in `messages/`, **stop** and create UI translations first (`docs/COURSE_BUILDING_RULES.md`).
- [ ] Confirm whether this course already exists / overlaps (avoid duplicates).
- [ ] Create a run log: `docs/course_runs/<COURSE_ID or CCS_ID>__<timestamp>.md` (append every step + report paths).

### Phase B — Idea → stored as a course-family artifact
- [ ] Produce a **course idea** (target audience, measurable promise, differentiation).
- [ ] Persist the idea in one place:
  - Repo: `docs/course_ideas/<TOPIC>_Blueprint.md` (optional but recommended)
  - Admin/DB: store in CCS “Course Idea” field (if using CCS UI)

### Phase C — 30-day outline (must exist before CCS finalization)
- [ ] Produce a full outline (Day 1–30) with:
  - day intent, 3–5 learning objectives, key concepts + definitions, procedure, example(s), common mistakes, action items
- [ ] Ensure it supports gold-standard quiz scenarios (concrete deliverables and failure modes).
- [ ] Persist outline at CCS level (admin/DB and/or repo).

### Phase D — CCS (Canonical Course Spec)
- [ ] Create/update CCS:
  - Repo canonical: `docs/canonical/<CCS_ID>/<CCS_ID>.canonical.json` + `<CCS_ID>_CCS.md`
  - Ensure `assessmentBlueprint` encodes the quiz hard gates.
- [ ] CCS localization rule:
  - EN-first is default; **never inject English text** into non-EN lesson bodies unless you are writing localized text.

### Phase E — Create the course variant (DB)
- [ ] Create the Course record (per language) and ensure it references CCS (`course.ccsId`).
- [ ] Course fields (minimum):
  - `courseId`, `name`, `description`, `language`, `durationDays`, `isActive`/draft status, `requiresPremium`, rewards config
- [ ] Catalog language integrity:
  - `course.name` and `course.description` match `course.language`
  - `course.translations.<locale>` match `<locale>` if present

### Phase F — Lessons (DB) — quality + language gates
- [ ] Create 30 lessons (Day 1–30) per course language variant.
- [ ] Lesson language integrity hard gate:
  - `content`, `emailSubject`, `emailBody` must be in the course language (no leakage).
- [ ] Lesson quality hard gate:
  - Score >= 70 (must be specific, actionable, includes definitions/examples/criteria).
- [ ] Run audits:
```bash
npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --min-score 70
npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts
```
- [ ] If lesson fails gate: **refine lesson first**; do not “invent” quiz questions to cover gaps.

### Phase G — Quizzes (DB) — pipeline (dry-run → apply)
- [ ] Pipeline dry-run:
```bash
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course <COURSE_ID> --min-lesson-score 70 --dry-run
```
- [ ] Review outputs in `scripts/reports/`:
  - `__lesson-refine-tasks.md` → lesson too weak; refine lesson first
  - `__rewrite-failures.md` → generator gap; fix generator; do not lower QC
- [ ] Pipeline apply:
```bash
npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course <COURSE_ID> --min-lesson-score 70
```

### Phase H — Quiz pool coverage + per-question QA (global safety net)
- [ ] Coverage audit (must end with missing=0):
```bash
npx tsx --env-file=.env.local scripts/quiz-item-qa/audit-quiz-coverage.ts
```
- [ ] Fix “checked but failing latest” to 0:
```bash
npx tsx --env-file=.env.local scripts/quiz-item-qa/repair-failing-latest.ts --limit 500 --dry-run true --attempts 3
npx tsx --env-file=.env.local scripts/quiz-item-qa/repair-failing-latest.ts --limit 500 --dry-run false --attempts 3
```
- [ ] Reduce `toCheck` to 0:
```bash
npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts loop:run --items 200
```

### Phase I — System-wide integrity checks (email + catalog)
- [ ] Email language integrity (send-time HTML):
```bash
npx tsx scripts/audit-email-communications-language-integrity.ts
```
- [ ] CCS-wide audit tasklist (optional but recommended before publishing):
```bash
npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70 --course <COURSE_ID>
```

### Phase J — “Ready to enroll” smoke test (manual)
- [ ] Course shows correctly in the catalog in the target locale.
- [ ] Enroll/start course; Day 1 lesson renders correctly.
- [ ] Quiz loads; questions are in correct language; no recall; options are detailed; grading works.
- [ ] Progress tracking works (lesson completion, quiz pass threshold).
- [ ] Completion/certificate path works if enabled.
- [ ] Emails (lesson delivery / transactional) render in correct language end-to-end.

### Phase K — Publish
- [ ] Set course active/published only after gates pass.
- [ ] If using shorts: ensure shorts are draft until published and inherit the correct CCS (`docs/_archive/delivery/2026-01/2026-01-27_RAPID_CHILDREN_COURSES_ACTION_PLAN_AND_HANDOVER.md`).

---

## 4) “Ready to Enroll” Gate (copy/paste acceptance criteria)

A course `<COURSE_ID>` is **ready to enroll** only if all are true:

- `audit-lesson-language-integrity` shows **no language integrity errors** for the course’s lessons + email fields.
- `audit-lesson-quality --min-score 70` shows **no lessons below 70** for the course.
- `audit-quiz-coverage` shows `lessonsBelowMin=0` and `questionsMissing=0` for active lessons.
- `checkedButFailingLatest=0` and `toCheck=0` in the quiz item QA audit.
- Email + catalog audits show **no cross-language leakage** for the course.
- Manual smoke test passes (enroll → lesson → quiz → progress/cert/email).
