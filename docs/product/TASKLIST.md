# Amanoba Task List

**Last Updated**: 2026-05-20
**Status**: Reference mirror only. The live work-tracking source of truth is the [Amanoba Project 12 board](https://github.com/users/moldovancsaba/projects/12/views/1) and issues in `moldovancsaba/mvp-factory-control`.

---

## How To Use This File

Use this file to understand the current high-level backlog shape from inside the Amanoba repo. Do not treat it as the live task board.

- Create and update work items in `moldovancsaba/mvp-factory-control`.
- Use Project 12 statuses: `IDEABANK (SOMEDAY)`, `Roadmap (LATER)`, `Backlog (SOONER)`, `Todo (NEXT)`, `In Progress (NOW)`, `Review (ALMOST)`, `Done`, `Declined (NEVER)`.
- Move completed work into `docs/product/RELEASE_NOTES.md` only when it is shipped.
- Keep future vision in `docs/product/ROADMAP.md`.

## Current Execution Lane

These assigned audit issues are the active documentation lane as of 2026-05-20:

| Issue | Title | Priority | Purpose |
|-------|-------|----------|---------|
| `#371` | Amanoba: Establish audit plan & SSOT inventory | P0 | Keep the audit plan and source-of-truth inventory current. |
| `#373` | Amanoba: Document-to-code inventory for audit | P0 | Compare active docs against code and remove stale guidance. |
| `#374` | Amanoba: Audit readiness checklist & handover prep | P0 | Package audit evidence, validation results, and handover notes. |

## Current Known Product / Platform Follow-Ups

These are the main repo-visible follow-ups that still matter after the May documentation refresh. Confirm exact status on Project 12 before starting work.

| Area | Current repo-visible status | Next action |
|------|-----------------------------|-------------|
| Multi-enrolment email scheduler | Scheduler code has been hardened and unit-tested, but the board still tracks broader multi-enrolment email validation. | Verify Project 12 issue `#16`, update the issue if the remaining work is validation-only, then close or split as appropriate. |
| Lesson quiz governance | Runtime authority is course-level policy, but compatibility payloads and seed/import/export cleanup remain. | Continue Project 12 issue `#225`: package/import docs, seed cleanup, validator alignment, and migration/backfill. |
| Cross-repo documentation federation | Active docs still contain local paths to `amanoba_courses/process_them` for course-quality references. | Finish Project 12 issue `#104`: define portable published-link-first references with optional local path notes. |
| Design-system migration | Hard-rule UI foundation checks pass; heuristic drift remains in older admin/game/profile/certificate surfaces. | Migrate touched surfaces incrementally and keep `docs/product/DESIGN_UPDATE.md` current. |
| Certification templates/defaults | Certificate issuance, verification, entitlement, and template assignment exist; reusable admin-managed defaults/templates remain future work. | Keep as roadmap/backlog until Project 12 prioritizes it. |

## Delivered Work That Should Not Be Re-Added Here

The following are shipped and belong in `docs/product/RELEASE_NOTES.md`, not this task list:

- Flexible course lengths.
- Blog/news publishing and the May 11 weekly post.
- Practice Hub MVP and reward telemetry.
- Saved Lessons MVP.
- Daily learning streak MVP.
- Friend Streaks MVP.
- Quiz answer explanation pilot.
- Course export/import/update package improvements that are already marked shipped in release notes.
- Certificate pass rules and certificate design-template assignment.

## Validation Commands For Task Work

Use the smallest relevant set, then broaden when touching shared behavior:

- `npm run lint`
- `npm test`
- `npm run type-check`
- `npm run docs:check`
- `npm run build`
- `npm run ui:check:foundation`
- `npm run ui:check:layout`

## Related Docs

- `READMEDEV.md`
- `docs/HANDOVER.md`
- `docs/core/DOCS_INDEX.md`
- `docs/product/ROADMAP.md`
- `docs/product/RELEASE_NOTES.md`
- `docs/status/PRODUCTION_STATUS.md`
- `docs/handoff/HANDOFF_MVP_FACTORY_CONTROL.md`
- `docs/handoff/MVP_FACTORY_PROJECT_SETUP.md`
