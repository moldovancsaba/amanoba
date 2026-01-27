# AMANOBA — 2026 Course Quality Master Prompt (PRODUCTIVITY_2026_* ALL Variants)

Copy/paste this prompt whenever you want the agent to run the full **recursive** “Audit → QC → Refine Lesson → Rewrite Quiz” process for **all `PRODUCTIVITY_2026_*` course variants**.

---

You are the AI developer/content architect for AMANOBA.

Hard rules (must do first, no exceptions):
1) Immediately read and treat as the active rulebook: `agent_working_loop_canonical_operating_document.md`.
2) Immediately read and follow: `docs/QUIZ_QUALITY_PIPELINE_HANDOVER.md` and `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md`.
3) No autonomous assumptions: confirm DB environment + scope before any DB write.
   - Current default for this runbook: **production** (via `.env.local`) — still confirm explicitly before apply-mode.
4) Provide a Safety Rollback Plan before any destructive DB change.
5) Use `functions.update_plan` to track state and allow stopping/continuing.
6) Always run **dry-run first**, summarize, then stop and ask for confirmation before applying.
7) Create/update a single run log file: `docs/course_runs/PRODUCTIVITY_2026__ALL__<timestamp>.md`.
8) Maintain a **persistent tasklist** (required for recursion):
   - Create/update: `docs/tasklists/PRODUCTIVITY_2026__ALL__<timestamp>.md`
   - This must contain actionable checkboxes and be updated after every step (audit/dry-run/apply/verify).
   - Never lose state: mark completed items, add next items, and include the exact next command to run.

Task:
Audit and fix **ALL course variants** matching `PRODUCTIVITY_2026_*` (all languages).

Premium vs free policy (non‑negotiable):
- **Never** lower standards or skip quality control based on `requiresPremium`.
- Premium and free variants must receive the **same highest-quality** audit, refinement, and quiz rewrite process.

## Required Artifacts (Recursive Operating System)

You must produce and keep these up to date throughout the run:

1) **Run log** (narrative + links):
   - `docs/course_runs/PRODUCTIVITY_2026__ALL__<timestamp>.md`
2) **Tasklist** (checkboxes + next actions):
   - `docs/tasklists/PRODUCTIVITY_2026__ALL__<timestamp>.md`

### Tasklist format (mandatory)

Include these sections and keep them current:

- **Environment**: production/staging + `.env.local` confirmation
- **Target list**: all discovered `PRODUCTIVITY_2026_*` courseIds
- **Per-course checklist** (repeat the same structure for each courseId):
  - [ ] Discovery confirmed (course exists, active/premium noted)
  - [ ] Lesson audit completed (report path)
  - [ ] Lesson refinement required? (yes/no)
    - If yes:
      - [ ] Refinement dry-run completed (report path)
      - [ ] Refinement apply completed (backup paths + report path)
  - [ ] Quiz pipeline dry-run completed (report paths)
  - [ ] Quiz pipeline apply completed (backup paths + report path)
  - [ ] Post-apply verification completed (verification report path)
  - [ ] Sample QA captured (one “bad removed” + one “good inserted”, with report paths)
- **Action Items (auto-generated)**:
  - Append action items from:
    - `__lesson-refine-tasks.md` (lessons blocked by quality)
    - `__rewrite-failures.md` (generator improvements needed)
  - Each action item must include: courseId, day, lessonId, reason, and the next command to run.
- **Next Command** (single line):
  - Always end the tasklist with the exact next command to run.

### Run log format (mandatory)

Always include:
- Safety rollback plan (quiz + lesson restore commands)
- Outputs (report paths + backup paths)
- A **Process State** block:
  - Environment:
  - Current courseId:
  - Last completed step:
  - Next step:
  - Next command:
  - Blockers (if any):

Quality requirements (hard):
- 0 `RECALL` questions (hard disallow; if present, remove and replace with APPLICATION/CRITICAL_THINKING).
- Per lesson minimum: **>= 7 valid questions** (pool may be larger; never delete just because >7).
- Per lesson minimum: **>= 5 APPLICATION** questions.
- Standalone wording: no “as described in the lesson / course”, no “A leckében…”, no title-based crutches.
- No checklist-snippet crutches: reject questions that quote `✅ ...` or quoted `...` snippets.
- Options must be detailed and educational (wrong answers plausible; no throwaway options like “no impact / only theoretical / not mentioned”, and no “I just read / wait for others” type answers).
- Proper language match for the course language.
- Proper metadata (uuid, hashtags, difficulty, questionType).
- Remove duplicates by normalized question text: keep first by `_id`, delete others, and log an action item if the kept one is low-quality.

Process (recursive; stop/continue supported):

A) Discovery + confirmation
- List all `PRODUCTIVITY_2026_*` courses found in DB (courseId, language, isActive, requiresPremium, createdAt).
- Ask me to confirm: environment (prod/staging) and target list before any writes.
- Update run log + tasklist with:
  - discovered course list
  - confirmed environment
  - next command

B) For each course variant `PRODUCTIVITY_2026_<LANG>`:

1) Lesson quality audit (creates refinement tasks)
- Run: `npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts --course <COURSE_ID> --min-score 70`
- If lessons score < 70: create refinement tasks and prepare a refinement dry-run.
- Append lesson refinement action items into the tasklist with checkboxes.

2) Lesson refinement (backup-first)
- If a dedicated refine script exists for that language, use it in **dry-run**, summarize, then ask me to approve `--apply`.
- If no refine script exists, do not write lesson content automatically; instead output a clear refinement task list and stop for my decision.
- After apply, record lesson backup paths in run log + tasklist.

3) Quiz pipeline dry-run (no DB writes)
- Run: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course <COURSE_ID> --min-lesson-score 70 --dry-run`
- Summarize: passed / refine-needed / rewrite-failures, and show one sample “bad found” and one sample “new generated”.
- Add checkbox items for:
  - generator rewrite failures (if any) with next steps
  - sample QA capture paths

4) Apply quiz pipeline (DB writes + backups) — only after my explicit confirmation
- Run: `npx tsx --env-file=.env.local scripts/quiz-quality-pipeline.ts --course <COURSE_ID> --min-lesson-score 70`
- Ensure backups are written under `scripts/quiz-backups/<COURSE_ID>/`.
- Provide rollback commands:
  - Quiz restore: `npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json`
  - Lesson restore (if lessons were refined): `npx tsx --env-file=.env.local scripts/restore-lesson-from-backup.ts --file scripts/lesson-backups/<COURSE_ID>/<LESSON_ID__TIMESTAMP>.json`

5) Post-apply verification
- Produce a per-lesson verification summary (counts by type; confirm >=7 total, >=5 application, 0 recall).
- Write any reports into `scripts/reports/` and link them in the run log.
- Stop and ask “Continue?” **only if**:
  - any DB write step needs approval (lesson refinement apply or quiz pipeline apply), **or**
  - there are blockers/rewrite failures requiring clarification, **or**
  - scope/environment is unclear.
  Otherwise, continue automatically to the next course variant.

C) Completion criteria
- Every `PRODUCTIVITY_2026_*` course variant either:
  - Passes strict QC across all lessons, OR
  - Is blocked with a documented lesson-refinement plan + explicit next actions.

Output requirements at each stop:
- Run log path: `docs/course_runs/PRODUCTIVITY_2026__ALL__<timestamp>.md`
- Tasklist path: `docs/tasklists/PRODUCTIVITY_2026__ALL__<timestamp>.md`
- Report file paths created (`scripts/reports/...`)
- Backup file paths created (`scripts/quiz-backups/...`, `scripts/lesson-backups/...` if applicable)
- Rollback commands
- A **Process State** block and “Continue?”.

Start now with step A (Discovery + confirmation).
