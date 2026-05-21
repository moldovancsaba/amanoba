# Amanoba Task List

**Last Updated**: 2026-05-21
**Status**: Reference mirror only. The live work-tracking source of truth is the [Amanoba Project 12 board](https://github.com/users/moldovancsaba/projects/12/views/1) and issues in `moldovancsaba/mvp-factory-control`.

---

## How To Use This File

Use this file to understand the current high-level backlog shape from inside the Amanoba repo. Do not treat it as the live task board.

- Create and update work items in `moldovancsaba/mvp-factory-control`.
- Use Project 12 statuses: `IDEABANK (SOMEDAY)`, `Roadmap (LATER)`, `Backlog (SOONER)`, `Todo (NEXT)`, `In Progress (NOW)`, `Review (ALMOST)`, `Done`, `Declined (NEVER)`.
- Move completed work into `docs/product/RELEASE_NOTES.md` only when it is shipped.
- Keep future vision in `docs/product/ROADMAP.md`.

## Current Execution Lane

No assigned Amanoba issue is in `Todo (NEXT)` or `In Progress (NOW)` as of the 2026-05-20 Project 12 reconciliation.

Recently closed / Done on Project 12:

| Issue | Title | Status |
|-------|-------|--------|
| `#371` | Amanoba: Establish audit plan & SSOT inventory | Done / closed |
| `#373` | Amanoba: Document-to-code inventory for audit | Done / closed |
| `#374` | Amanoba: Audit readiness checklist & handover prep | Done / closed |
| `#750` | Amanoba ideabank: streak system for habit formation and daily return behavior | Done / closed |
| `#752` | Amanoba ideabank: friend streaks and long-run peer accountability loops | Done / closed |
| `#770` | Amanoba ideabank: learner bookmarks, saved content, and resume library | Done / closed |
| `#771` | Amanoba ideabank: AI answer explanations and mistake-aware feedback | Done / closed |
| `#781` | Amanoba practice hub MVP 1/3: define review modes, prioritization signals, and content contract | Done / closed |
| `#782` | Amanoba practice hub MVP 2/3: learner UI shell, entry points, and review flows | Done / closed |
| `#783` | Amanoba practice hub MVP 3/3: telemetry, rewards, and progress integration | Done / closed |
| `#16` | Email/scheduler: Respect multiple enrolments | Done / closed |
| `#104` | Cross-repo documentation federation (amanoba + amanoba_courses) | Done / closed |
| `#225` | Lesson quiz governance #10 | Done / closed |

## Current Known Product / Platform Follow-Ups

These are the main repo-visible follow-ups that still matter after the May documentation refresh. Confirm exact status on Project 12 before starting work.

| Area | Current repo-visible status | Next action |
|------|-----------------------------|-------------|
| Broader Practice Hub ideabank | MVP contract/UI/telemetry are shipped, but the broader listening/speaking/mistakes vision is not complete. | Keep Project 12 issue `#749` in Backlog until the next review-mode expansion is prioritized. |
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
- Release notes wiki migration.
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
