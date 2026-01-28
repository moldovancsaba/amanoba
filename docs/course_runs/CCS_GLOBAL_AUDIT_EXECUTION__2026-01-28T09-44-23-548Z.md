# CCS Global Audit Execution Run Log

Generated: 2026-01-28T09:44:23.548Z  
Environment: **production** (via `.env.local`)  
Scope: **All active courses** (all CCS families)  

## Safety Rollback Plan (Mandatory)

### Baseline (code)
- Baseline commit: `b0ed350c6d496712caa773ec442fda815d89c499`
- Rollback code:
  - `git reset --hard b0ed350c6d496712caa773ec442fda815d89c499`

### Backfill rollback (Course.ccsId)
- Backup file:
  - `scripts/course-backups/backfill-ccs-from-courses__2026-01-28T09-39-27-314Z.json`
- Rollback (dry-run):
  - `npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file scripts/course-backups/backfill-ccs-from-courses__2026-01-28T09-39-27-314Z.json`
- Rollback (apply):
  - `npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file scripts/course-backups/backfill-ccs-from-courses__2026-01-28T09-39-27-314Z.json --apply`

### Quiz rollback (per lesson)
- Restore a lesson’s quiz from a backup written by the pipeline:
  - `npx tsx --env-file=.env.local scripts/restore-lesson-quiz-from-backup.ts --file scripts/quiz-backups/<COURSE_ID>/<LESSON_ID>__<TIMESTAMP>.json`

### Verification after rollback
- Re-run master audit:
  - `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70`

## Inputs / References
- Latest master audit tasklist:
  - `docs/tasklists/CCS_GLOBAL_AUDIT__2026-01-28T09-39-35-973Z.md`
- Latest master audit report:
  - `scripts/reports/ccs-global-audit__2026-01-28T09-39-35-973Z.json`

## Process State
- Current phase: **Follow-up actions (lesson refinement + remaining generator gaps)**
- Last completed step: **Refined PRODUCTIVITY_2026_HU + PRODUCTIVITY_2026_BG lessons (backups written) and re-ran quiz pipeline**
- Next step: **Reduce remaining language integrity fails + generator-insufficient lessons (AR/HI/RU)**
- Next command:
  - `npx tsx --env-file=.env.local scripts/audit-ccs-global-quality.ts --min-lesson-score 70`
- Blockers: none
