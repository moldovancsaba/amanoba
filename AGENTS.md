# AGENTS.md

Guidance for human and AI contributors working in this repository.

## 1. Read This First

Before making changes, read in this order:

1. `READMEDEV.md`
2. `docs/HANDOVER.md`
3. `docs/core/agent_working_loop_canonical_operating_document.md`
4. `docs/status/PRODUCTION_STATUS.md`

If the task touches docs, architecture, lessons, quizzes, or UI layout, also read `docs/architecture/layout_grammar.md`.
If the task touches GitHub Project 12 workflow or board field updates, also read `docs/handoff/HANDOFF_MVP_FACTORY_CONTROL.md` and `docs/handoff/MVP_FACTORY_PROJECT_SETUP.md`.

## 2. Repo Workflow

- **Canonical local checkout:** `/Users/Shared/Projects/amanoba` (do not use `~/Projects/amanoba`; that path was a mistaken duplicate and must not be recreated).
- The work-tracking SSOT is the MVP Factory board, not this repo.
- Amanoba work items live in `moldovancsaba/mvp-factory-control`.
- Start each session with `git fetch origin && git status -sb` to confirm the latest baseline.
- Find assigned Amanoba issues with:

```sh
gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10
```

- Use the `sentinel-squad/` prefix for local branch names before making changes.
- Update GitHub Project 12 fields from this repo with `./scripts/mvp-factory-set-project-fields.sh ISSUE_NUMBER` when board status or ownership metadata changes.
- Keep `docs/HANDOVER.md` current when runtime behavior, process, or board status changes.

## 3. Core Commands

Install and start local development:

```sh
npm install
npm run dev
```

Quality gates used in this repo:

```sh
npm run lint
npm test
npm run type-check
npm run build
```

Docs checks:

```sh
npm run docs:refresh
npm run docs:links:check
npm run docs:check
DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check
```

UI layout and foundation audit / CI checks:

```sh
npm run ui:audit:layout
npm run ui:check:layout
npm run ui:audit:foundation
npm run ui:check:foundation
npm run ui:gds:check
npm run ui:check:mantine
```

GDS adoption (product UI must use `@gds/*` primitives via `app/components/patterns/gds/`; see `gds-adoption.json`):

```sh
npm run ui:gds:verify
npm run gds:import-smoke
npm run ui:check:gds-patterns
npm run ui:gds:compliance
```

Background workers:

```sh
npm run workers
```

Typical script pattern for operational scripts that need env:

```sh
npx tsx --env-file=.env.local scripts/<script-name>.ts
```

Project board auth bootstrap:

```sh
gh auth refresh -h github.com -s read:project,project
```

## 4. Repo-Specific Notes

- `npm run docs:check` runs generated-doc checks and active-doc link validation.
- `npm run docs:check` refreshes generated docs first and can fail if regenerated docs changed but were not committed with the rest of the doc work.
- `npm run docs:links:check` validates active docs only; add `DOCS_CHECK_INCLUDE_ARCHIVE=1` when archive docs are in scope.
- GitHub Project field writes require one-time project scope auth via `gh auth refresh -h github.com -s read:project,project`.
- CI currently runs `npm run ui:check:foundation` on pushes to `main` and pull requests.
- `npm run workers` starts the background job workers and requires `MONGODB_URI` from `.env.local`.
- Release scripts in `package.json` are `npm run release:patch`, `npm run release:minor`, and `npm run release:major`.

## 5. Definition of Done

A change is done when all of the following are true:

1. The relevant quality gates have been run for the scope of the change.
2. Docs were updated if commands, behavior, architecture, or workflow changed.
3. `docs/HANDOVER.md` was appended when the change affects runtime behavior, process, or status.
