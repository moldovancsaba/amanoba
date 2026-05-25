# Amanoba Relocation Handover

**Date**: 2026-05-25  
**Prepared for**: continuing Amanoba development on another computer  
**Project repo**: `moldovancsaba/amanoba`  
**Project board SSOT**: `moldovancsaba/mvp-factory-control` on GitHub Project 12  
**Current app version**: `2.9.49`  
**Current working branch**: `sentinel-squad/gds-2-3-0-alignment`  
**Last stable baseline commit in this worktree**: `c96d379` (`Complete GDS admin contracts and Phase 6 design tokens.`)

---

## 1. Executive Summary

Amanoba is a production-learning platform built on Next.js App Router, React 19, TypeScript 5, MongoDB Atlas, NextAuth v5, Stripe, and a Mantine-based UI runtime. It is already live and stable in production. The product is in a mature operational phase, but there is an active design-system consolidation effort underway.

From a relocation standpoint, the most important practical fact is that the repo now depends on a **sibling local checkout** of the General Design System:

- `../GENERAL_DESIGN_SYSTEM`

This is not optional in the current setup. The repo consumes:

- `@gds/theme`
- `@gds/core`
- `@gds/admin`

through local `file:` dependencies declared in `package.json`.

That means the next development machine must restore **both**:

1. the Amanoba repository
2. the shared GDS repository as a sibling directory

If that directory relationship is broken, `npm install`, `npm run build`, and parts of the UI migration workflow will fail.

---

## 2. Product State

### 2.1 What Amanoba is

Amanoba is a unified flexible learning platform with:

- localized learning flows across 17 UI locales
- gamified engagement mechanics
- daily lesson delivery by email
- interactive lessons and quizzes
- public blog and news content
- learner dashboards, stats, leaderboards, quests, rewards, and saved lessons
- admin and editor tools
- premium/payment flows via Stripe
- certification and certificate verification flows

### 2.2 Current production posture

As of the active docs:

- production is stable
- deployment is automated through GitHub -> Vercel
- standard shipping path is `push to origin/main`
- production domains are:
  - `https://www.amanoba.com`
  - `https://amanoba.com`
  - `https://amanoba-narimato.vercel.app`
  - `https://amanoba-git-main-narimato.vercel.app`

### 2.3 Operational SSOT

The **product repo is not the work-tracking SSOT**.

The live work-tracking source of truth is:

- GitHub Project 12
- board URL: `https://github.com/users/moldovancsaba/projects/12/views/1`
- issues repo: `moldovancsaba/mvp-factory-control`

All implementation work should be anchored to a board issue there, not to ad hoc local task notes.

---

## 3. Technology Snapshot

### 3.1 Frontend

- Next.js `16.2.6`
- React `19.2.6`
- TypeScript `5.9.3`
- Mantine `8.3.18`
- Tabler icons `3.44.0`
- Framer Motion `10.18.0`
- React Query `5.56.2`
- next-intl `4.7.0`

### 3.2 Backend and services

- Node.js `>=20 <25`
- MongoDB Atlas
- Mongoose `8.18.0`
- NextAuth v5 beta
- Stripe `20.2.0`
- Pino logging
- optional Google Analytics

### 3.3 Email

The email transport layer supports:

- Resend
- Gmail API
- Mailgun

selected by `EMAIL_PROVIDER`.

### 3.4 Testing and validation

- ESLint
- TypeScript no-emit
- Vitest
- Next production build
- repo-specific docs checks
- repo-specific UI/GDS checks

---

## 4. Relocation-Critical External Dependencies

These are the dependencies that are easy to miss when moving to another computer.

### 4.1 Shared GDS sibling repository

Current local SSOT path:

- `/Users/Shared/Projects/GENERAL_DESIGN_SYSTEM`

Portable upstream reference:

- `https://github.com/sovereignsquad/general-design-system`

Current aligned GDS version/date in Amanoba:

- `2.3.2`
- `2026-05-25`

Current Amanoba package wiring depends on this relative layout:

```text
<parent>/
  amanoba/
  GENERAL_DESIGN_SYSTEM/
```

This is required because `package.json` uses:

- `file:../GENERAL_DESIGN_SYSTEM/packages/gds-theme`
- `file:../GENERAL_DESIGN_SYSTEM/packages/gds-core`
- `file:../GENERAL_DESIGN_SYSTEM/packages/gds-admin`

If the new machine uses a different parent directory name, that is fine.  
What must remain true is:

- `amanoba` and `GENERAL_DESIGN_SYSTEM` are siblings

### 4.2 Environment variables

You must restore `.env.local` from secure storage. Do not rely on git for secrets.

The repo contains `.env.local.example`, but that is only a template.

High-value env domains include:

- MongoDB connection
- NextAuth/auth secrets
- SSO provider config
- Stripe keys and webhook-related config
- email provider credentials
- Google Analytics if used
- any worker/cron/runtime provider config

### 4.3 GitHub CLI scopes

For board field updates, the new machine needs:

```sh
gh auth refresh -h github.com -s read:project,project
```

Without that scope, project field writes from this repo will fail.

### 4.4 Vercel

Standard development does not require manual Vercel deployment, but the new machine should still have the correct Git access to push branches and `main`. Production deploys are triggered by GitHub push to `origin/main`.

---

## 5. Current Architecture and Repo Boundaries

### 5.1 Core runtime

Primary route surface:

- `app/[locale]`

This contains:

- public routes
- learner routes
- admin routes
- editor routes
- games
- blog/news
- auth pages

### 5.2 Core logic

Primary business logic directory:

- `app/lib/`

Important subdomains there include:

- authentication
- courses
- gamification
- analytics
- payments
- email
- translations
- constants and shared utilities

### 5.3 UI structure

The current UI runtime is Mantine-rooted.

Important files:

- `app/components/providers/MantineRuntimeProvider.tsx`
- `app/lib/ui/mantine-theme.ts`
- `app/components/patterns/*`
- `app/components/patterns/gds/*`

### 5.4 Docs and governance

Important doc hubs:

- `docs/HANDOVER.md`
- `READMEDEV.md`
- `docs/status/PRODUCTION_STATUS.md`
- `docs/core/TECH_STACK.md`
- `docs/product/DESIGN_UPDATE.md`
- `docs/product/PATTERN_CONTRACT_INVENTORY.md`
- `docs/handoff/*`

---

## 6. Current GDS Migration State

### 6.1 What has already been done

The repo has already moved to a serious GDS-aligned posture:

- shared GDS version alignment is documented at `2.3.2`
- local GDS adoption manifest exists
- GDS enforcement checks exist
- shared local GDS packages are installed
- Amanoba theme now composes from shared GDS theme extension
- pattern entrypoints are normalized through local adapter files

Important files:

- `gds-adoption.json`
- `docs/product/GDS_ADOPTION_MANIFEST.md`
- `docs/product/GDS_EXCEPTION_REGISTER.md`
- `scripts/check-gds-adoption.ts`
- `scripts/check-mantine-boundaries.mjs`
- `next.config.ts`

### 6.2 Important technical nuance

The repo is **not yet in a state where every local pattern can be replaced directly with a raw `@gds/core` shell component**.

That path was tested and it broke prerender for Amanoba’s server-rendered content routes.

The stable state now is:

- shared GDS packages are installed and resolved
- theme baseline is shared-GDS-based
- some shell and pattern boundaries still remain behind **Amanoba-local adapter files**

This is deliberate. It is not accidental drift. It is the current safe production boundary.

### 6.3 Local adapter layer now present

Current local adapter files restored/added:

- `app/components/patterns/gds/ArticleShell.tsx`
- `app/components/patterns/gds/PublicAppShell.tsx`
- `app/components/patterns/gds/StateBlock.tsx`
- `app/components/patterns/gds/MetricCard.tsx`
- `app/components/patterns/gds/DataToolbar.tsx`
- `app/components/patterns/gds/ResponsiveDataView.tsx`

Public entrypoints in `app/components/patterns/*.tsx` re-export through that adapter layer.

### 6.4 Current tactical conclusion

The product is using a **hybrid but controlled** setup:

- shared package baseline where safe
- local adapter boundary where necessary

That is the correct mental model for whoever continues this work.

---

## 7. Current Worktree State

### 7.1 Branch

Current active branch:

- `sentinel-squad/gds-2-3-0-alignment`

### 7.2 Baseline

Last stable baseline commit before the active uncommitted wave:

- `c96d379` — `Complete GDS admin contracts and Phase 6 design tokens.`

### 7.3 Current uncommitted work

The worktree currently contains a substantial active change set, including:

- GDS package integration
- theme composition changes
- GDS adoption manifest and checks
- docs alignment to shared GDS 2.3.2
- restored local pattern adapter layer under `app/components/patterns/gds`
- docs metadata refresh outputs

This means the next machine must not assume the branch is clean after cloning/pulling unless these changes are committed and pushed first.

### 7.4 Practical relocation implication

Before switching machines, decide which of these two modes you want:

1. **Clean transfer**
   - commit and push the active branch
   - restore that branch on the new machine

2. **Raw worktree transfer**
   - move/copy the full worktree including uncommitted files
   - higher risk
   - only use if there is a specific reason not to commit yet

From an engineering governance standpoint, option 1 is strongly preferable.

---

## 8. New Machine Setup Procedure

### 8.1 Required directory layout

Recommended parent directory on the new machine:

```text
<workspace>/
  amanoba/
  GENERAL_DESIGN_SYSTEM/
```

### 8.2 Clone steps

```sh
cd <workspace>
git clone <amanoba-repo-url> amanoba
git clone https://github.com/sovereignsquad/general-design-system.git GENERAL_DESIGN_SYSTEM
```

If the active Amanoba branch is not yet on `main`, also fetch/switch the working branch:

```sh
cd amanoba
git fetch origin
git switch sentinel-squad/gds-2-3-0-alignment
```

### 8.3 Install and bootstrap

From the Amanoba repo:

```sh
npm install
```

Then restore secrets:

- place a valid `.env.local`

Then validate:

```sh
npm run type-check
npm run lint
npm run ui:check:gds
npm run build
```

### 8.4 Local dev

```sh
npm run dev
```

### 8.5 Worker processes

If you are working on background jobs, start:

```sh
npm run workers
```

This requires valid environment configuration, especially MongoDB.

---

## 9. First-Session Checklist on the New Computer

On the first working session after relocation, do this in order:

1. `git fetch origin && git status -sb`
2. confirm current branch
3. verify sibling GDS checkout exists
4. confirm `.env.local` is present
5. run:
   - `npm install`
   - `npm run type-check`
   - `npm run lint`
   - `npm run ui:check:gds`
   - `npm run build`
6. read:
   - `READMEDEV.md`
   - `docs/HANDOVER.md`
   - `docs/core/agent_working_loop_canonical_operating_document.md`
   - `docs/status/PRODUCTION_STATUS.md`
7. pull the current assigned board issue from `mvp-factory-control`
8. update board status before coding

---

## 10. Commands That Matter Most

### 10.1 Core quality gates

```sh
npm run lint
npm test
npm run type-check
npm run build
```

### 10.2 Docs

```sh
npm run docs:refresh
npm run docs:links:check
npm run docs:check
DOCS_CHECK_INCLUDE_ARCHIVE=1 npm run docs:links:check
```

### 10.3 UI and GDS enforcement

```sh
npm run ui:check:gds-adoption
npm run ui:check:gds
npm run ui:check:foundation
npm run ui:check:layout
npm run ui:check:mantine
```

### 10.4 Dev and workers

```sh
npm run dev
npm run workers
```

### 10.5 Board workflow

```sh
gh issue list --repo moldovancsaba/mvp-factory-control --state open --assignee "@me" --search "amanoba" --limit 10
gh auth refresh -h github.com -s read:project,project
```

---

## 11. Product and Engineering Risks to Keep in Mind

### 11.1 GDS path dependency risk

The local `file:` dependency model means a missing or misplaced `GENERAL_DESIGN_SYSTEM` sibling checkout will block work immediately.

### 11.2 Partial migration risk

The product is in a controlled but incomplete GDS consolidation phase.

Do not assume:

- every local wrapper is obsolete
- every page can consume raw GDS shells directly
- the local adapter layer can be removed wholesale

### 11.3 Auth sensitivity

Authentication is critical and should not be casually changed.

Sensitive files include:

- `auth.ts`
- `auth.config.ts`
- `auth.edge.ts`
- `proxy.ts`

### 11.4 Production discipline

Deployment is live and automatic from `origin/main`. A careless push to `main` is a production action.

### 11.5 Documentation coupling

This repo treats documentation as operationally significant. Changes to runtime, architecture, process, board workflow, or migration status should update:

- `docs/HANDOVER.md`
- relevant product/tech docs

---

## 12. Recommended Next Steps After Relocation

### 12.1 Immediate

1. restore both repos in sibling layout
2. restore `.env.local`
3. run install and full local verification
4. confirm the active branch state matches expectations

### 12.2 Short-term engineering

1. commit and push the current GDS alignment branch if not already done
2. verify the new machine can build from that branch without local path drift
3. continue the GDS migration from the local adapter boundary, not from a forced direct-shell replacement

### 12.3 Product/architecture

1. keep the board issue state synchronized in `mvp-factory-control`
2. continue migrating remaining high-traffic legacy admin/profile/certificate surfaces
3. tighten GDS drift checks only after the replacement contract is proven in the affected surfaces

---

## 13. Practical Relocation Decision

If the objective is low-friction continuation on another machine, the most robust transfer strategy is:

1. commit the active change set on `sentinel-squad/gds-2-3-0-alignment`
2. push the branch to `origin`
3. clone both `amanoba` and `GENERAL_DESIGN_SYSTEM` as siblings on the new machine
4. restore `.env.local`
5. run the verification gates listed above

That gives you:

- reproducible dependency resolution
- reproducible build behavior
- a clean rollback boundary
- auditability against the board and docs

---

## 14. Reference Documents to Read First on the New Machine

Mandatory first reads:

1. `READMEDEV.md`
2. `docs/HANDOVER.md`
3. `docs/core/agent_working_loop_canonical_operating_document.md`
4. `docs/status/PRODUCTION_STATUS.md`

Then read, depending on scope:

- `docs/core/CODING_STANDARDS.md`
- `docs/core/TECH_STACK.md`
- `docs/product/DESIGN_UPDATE.md`
- `docs/product/PATTERN_CONTRACT_INVENTORY.md`
- `docs/architecture/layout_grammar.md`
- `/Users/.../GENERAL_DESIGN_SYSTEM/README.md`
- `/Users/.../GENERAL_DESIGN_SYSTEM/FOUNDATION.md`
- `/Users/.../GENERAL_DESIGN_SYSTEM/COMPONENTS_AND_PATTERNS.md`

---

## 15. Final State Assessment

This project is **relocatable without architectural rework**, but only if the relocation respects the current multi-repo dependency model and the repo’s process discipline.

The main relocation hazards are not product complexity by itself. They are:

- forgetting the sibling GDS checkout
- failing to restore secrets
- ignoring the project-board SSOT
- misunderstanding the current GDS migration as “fully package-native” when it is still partly adapter-mediated

If those four points are handled correctly, the project should be able to continue on the next machine without interruption.
