# Amanoba Doc SSOT + GDS Closure Program

**Milestone**: [Amanoba: Doc SSOT + GDS Closure (2026-05)](https://github.com/moldovancsaba/mvp-factory-control/milestone/2)
**Project Board**: [Project 12](https://github.com/users/moldovancsaba/projects/12/views/1)
**Canonical repo**: `/Users/Shared/Projects/amanoba`
**GDS authority**: `/Users/Shared/Projects/amanoba/gds-adoption.json`

## Issue Index

| Seq | Issue | Title | Status | Depends on |
| --- | --- | --- | --- | --- |
| 1 | [#890](https://github.com/moldovancsaba/mvp-factory-control/issues/890) | Amanoba: Docs: PROJECT_STATE - canonical one-page snapshot | Delivered | — |
| 2 | [#891](https://github.com/moldovancsaba/mvp-factory-control/issues/891) | Amanoba: Docs: Brain dump continuity - pointer-only restore checklist | Delivered | #890 |
| 3 | [#892](https://github.com/moldovancsaba/mvp-factory-control/issues/892) | Amanoba: Docs: TASKLIST execution lane - Project 12 reality sync | Delivered | #890 |
| 4 | [#893](https://github.com/moldovancsaba/mvp-factory-control/issues/893) | Amanoba: Docs: Agent working loop - GDS gates and PROJECT_STATE cold start | Delivered | #890 |
| 5 | [#894](https://github.com/moldovancsaba/mvp-factory-control/issues/894) | Amanoba: Ops: HANDOVER chronology - tarball-era supersede normalization | Delivered | #890 |
| 6 | [#895](https://github.com/moldovancsaba/mvp-factory-control/issues/895) | Amanoba: Docs: Truth guard - stale GDS references blocked in active docs | Delivered | #890 |
| 7 | [#896](https://github.com/moldovancsaba/mvp-factory-control/issues/896) | Amanoba: Docs: PROJECT_STATE refresh - semi-automated read-only field generator | Delivered | #890 |
| 8 | [#897](https://github.com/moldovancsaba/mvp-factory-control/issues/897) | Amanoba: Docs: Validation pipeline - truth guard wired into docs:check | Delivered | #895, #896 |
| 9 | [#898](https://github.com/moldovancsaba/mvp-factory-control/issues/898) | Amanoba: Ops: Production status - post-GDS route smoke reconciliation | Delivered | — |
| 10 | [#899](https://github.com/moldovancsaba/mvp-factory-control/issues/899) | Amanoba: Docs: Release notes governance - GDS 2.6.1 adoption entry decision | Delivered | #898 |
| 11 | [#900](https://github.com/moldovancsaba/mvp-factory-control/issues/900) | Amanoba: UI: Learner shell adapter - future LearnerAppShell boundary defined | Delivered (adapter shipped; upstream shell still blocked on `general-design-system#80`) | general-design-system#80 |
| 12 | [#901](https://github.com/moldovancsaba/mvp-factory-control/issues/901) | Amanoba: UI: Course cards - ProductCard migration for learner surfaces | Delivered | — |
| 13 | [#902](https://github.com/moldovancsaba/mvp-factory-control/issues/902) | Amanoba: UI: Editor content ops - ContentOpsEditor and section adoption | Delivered | — |
| 14 | [#903](https://github.com/moldovancsaba/mvp-factory-control/issues/903) | Amanoba: Quality: Shell accessibility - GDS runtime verification matrix | Delivered | #901, #902 |

## Sequence

1. #890 establishes `docs/core/PROJECT_STATE.md` as the canonical project-state snapshot.
2. #891, #892, #893, #894, #895, and #896 reconcile downstream docs/tooling against that snapshot.
3. #897 wires the new doc-truth/project-state checks into the aggregate docs gate.
4. #898 refreshes active production-status evidence; #899 records the release-note ship/N/A decision after that evidence exists.
5. #900 remains IDEABANK and externally blocked on `sovereignsquad/general-design-system#80`.
6. #901 and #902 close the actionable GDS 2.6.1 product gaps; #903 verifies shell accessibility/runtime behavior afterward.

## Notes

- All issues were created in `moldovancsaba/mvp-factory-control` and assigned to [milestone #2](https://github.com/moldovancsaba/mvp-factory-control/milestone/2).
- Issue bodies follow the section structure of [sovereignsquad/general-design-system#81](https://github.com/sovereignsquad/general-design-system/issues/81) and reference the canonical Amanoba repo plus `gds-adoption.json`.
- This program intentionally uses independently executable issues rather than an umbrella ticket.
- **Board:** [Project 12](https://github.com/users/moldovancsaba/projects/12/views/1) — filter by milestone or search `Amanoba: Doc SSOT`.
- **Set status from repo:** `MVP_PROJECT_NUMBER=12 ./scripts/mvp-factory-set-project-fields.sh ISSUE_NUMBER --status "Todo (NEXT)"`
