# AGENTS.md

Guidance for human and AI contributors working in this repository.

## 1. Read This First

Before making changes, read in this order:

1. `READMEDEV.md`
2. `docs/HANDOVER.md`
3. `docs/core/agent_working_loop_canonical_operating_document.md`
4. `docs/status/PRODUCTION_STATUS.md`

If the task touches docs, architecture, lessons, quizzes, or UI layout, also read `docs/architecture/layout_grammar.md`.

## 2. Repo Workflow

- The work-tracking SSOT is the MVP Factory board, not this repo.
- Amanoba work items live in `moldovancsaba/mvp-factory-control`.
- Start each session with `git fetch origin && git status -sb` to confirm the latest baseline.
- Find assigned Amanoba issues with:

```sh
gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10
```

- Use the `sentinel-squad/` prefix for local branch names before making changes.
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
npm run docs:check
DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check
```

UI layout and foundation audit / CI checks:

```sh
npm run ui:audit:layout
npm run ui:check:layout
npm run ui:audit:foundation
npm run ui:check:foundation
```

Background workers:

```sh
npm run workers
```

Typical script pattern for operational scripts that need env:

```sh
npx tsx --env-file=.env.local scripts/<script-name>.ts
```

## 4. Repo-Specific Notes

- `npm run docs:check` runs generated-doc checks and active-doc link validation.
- `npm run docs:check` refreshes generated docs first and can fail if regenerated docs changed but were not committed with the rest of the doc work.
- CI currently runs `npm run ui:check:foundation` on pushes to `main` and pull requests.
- `npm run workers` starts the background job workers and requires `MONGODB_URI` from `.env.local`.
- Release scripts in `package.json` are `npm run release:patch`, `npm run release:minor`, and `npm run release:major`.

## 5. Definition of Done

A change is done when all of the following are true:

1. The relevant quality gates have been run for the scope of the change.
2. Docs were updated if commands, behavior, architecture, or workflow changed.
3. `docs/HANDOVER.md` was appended when the change affects runtime behavior, process, or status.
