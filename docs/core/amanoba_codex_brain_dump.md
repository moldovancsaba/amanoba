# Amanoba Codex Brain Dump

**Last Updated**: 2026-05-28
**Audience**: Agents resuming work after context loss
**Purpose**: Pointer-only continuity note. Do not treat this file as the project-state SSOT.

## Read This First

- Current project-state SSOT: `docs/core/PROJECT_STATE.md`
- Operational chronology: `docs/HANDOVER.md`
- Active rulebook: `docs/core/agent_working_loop_canonical_operating_document.md`
- Production truth: `docs/status/PRODUCTION_STATUS.md`
- Work queue mirror: `docs/product/TASKLIST.md`
- Delivered work only: `docs/product/RELEASE_NOTES.md`

## Restore Checklist

Run in this order after context loss:

1. `git status -sb`
2. Read `docs/core/PROJECT_STATE.md`
3. Read `READMEDEV.md`
4. Read `docs/HANDOVER.md`
5. Read `docs/core/agent_working_loop_canonical_operating_document.md`
6. Read `docs/status/PRODUCTION_STATUS.md`
7. Open `docs/product/TASKLIST.md`
8. Open the top of `docs/product/RELEASE_NOTES.md`
9. If layout, course, quiz, or structural docs are in scope, read `docs/architecture/layout_grammar.md`

## Current Restore Notes

- Use `PROJECT_STATE.md` for repo version, GDS version, git HEAD, required contracts, and current gate commands.
- Do not infer release, deployment, or board status from old handoff sections without checking the current docs and code.
- Historical handoff snapshots and dated issue-program bodies are background material only.
- The active GDS consumer contract is `@doneisbetter/*` plus `gds-adoption.json`.
- The active work-tracking truth remains Project 12 and `moldovancsaba/mvp-factory-control`.

## Minimal Commands

```sh
npm run docs:project-state:refresh
npm run docs:truth:check
npm run docs:check
npm run type-check
npm run lint
npm run ui:gds:check
npm run build
```

## Update Rule

If this file ever starts accumulating detailed product state again, move that detail back into `docs/core/PROJECT_STATE.md` and keep this file pointer-only.
