# Handoff Model — mvp-factory-control (Feature issues)

**Version**: 1.0  
**Last Updated**: 2026-02-07

This document describes how to **assign work via Feature issues** in **mvp-factory-control**. Creation is assigned to an agent **by instruction**, not by automation.

---

## One-step handoff (correct way)

**Do this:** Tell the agent (Tribeca, Katja, Becca, Gwen, or Chappie):

> **"Create a Feature issue in mvp-factory-control using the Feature template for \<objective\>."**

Agents create **Issues only**; they never bypass templates. You approve by moving the card to **Ready**. Work starts only after the card is in **Ready**. That is the handoff model.

---

## Rules

| Rule | Meaning |
|------|--------|
| **Agents create Issues only** | Agents do not start implementation from a raw objective; they create the Feature issue using the template. |
| **Never bypass templates** | Every feature request is turned into a proper Feature issue via the template in mvp-factory-control. |
| **Approve by moving to Ready** | Product/you approve the issue by moving the card to **Ready**. |
| **Work starts only after Ready** | Development (or further agent work) begins only when the card is in **Ready**. |

---

## Objectives queued for handoff

Objectives below are candidates for creating a Feature issue in mvp-factory-control. Use the instruction above with the given \<objective\>.

| # | Objective | TASKLIST reference | Status |
|---|-----------|--------------------|--------|
| 1 | Dashboard/course pages: show every course in progress, surface "Enrol" with prerequisite notices, respect multi-course state | P2 § Multiple courses #3 | **Issue**: [mvp-factory-control #2](https://github.com/moldovancsaba/mvp-factory-control/issues/2) · Board: [Status Backlog, Agent Tribeca, Product amanoba, Type Feature, Priority P0](https://github.com/users/moldovancsaba/projects/1/views/2?pane=issue&itemId=155570517&issue=moldovancsaba%7Cmvp-factory-control%7C2). Move to **Ready** to start work. |

---

## Feature issue drafts (in-repo)

When an agent is asked to "Create a Feature issue in mvp-factory-control using the Feature template for \<objective\>", it produces a **draft** in this repo (since the agent has no API access to mvp-factory-control). You then create the real issue in mvp-factory-control from the draft and move the card to **Ready**.

| Draft document | Objective |
|----------------|-----------|
| **docs/handoff/feature_issues/FEATURE_DASHBOARD_MULTI_COURSE_ENROL_P2_3.md** | Dashboard/course pages (P2 #3) — **Issue**: [mvp-factory-control #2](https://github.com/moldovancsaba/mvp-factory-control/issues/2) · **Assigned:** Tribeca |

---

---

## MVP Factory Board — project fields and how to manage

**Board:** [GitHub Project 1](https://github.com/users/moldovancsaba/projects/1) (MVP Factory Board)  
**Repo:** [moldovancsaba/mvp-factory-control](https://github.com/moldovancsaba/mvp-factory-control)  
**Example issue in board:** [Issue #2 in project view](https://github.com/users/moldovancsaba/projects/1/views/2?pane=issue&itemId=155570517&issue=moldovancsaba%7Cmvp-factory-control%7C2)

### Project fields (set on each card)

| Field     | Purpose                    | Example values                          |
|----------|----------------------------|-----------------------------------------|
| **Status** | Workflow state             | `Backlog` → `Ready` (start work) → …    |
| **Agent**  | Who does the work          | `Tribeca`, `Katja`, `Becca`, `Gwen`, `Chappie` |
| **Product**| Which product/repo         | `amanoba`, (others as needed)           |
| **Type**   | Kind of work               | `Feature`, (e.g. Bug, Refactor, Docs)    |
| **Priority** | Urgency                  | `P0`, `P1`, `P2`, `P3`                  |

- **Work starts when:** Status is set to **Ready** (handoff rule).
- **Managing from this repo:** Run **`./scripts/mvp-factory-set-project-fields.sh ISSUE_NUMBER`** to set Status, Agent, Product, Type, Priority from defaults (amanoba, Tribeca, Feature, P0, Backlog). Override with `--status`, `--agent`, `--product`, `--type`, `--priority` or env vars `MVP_STATUS`, `MVP_AGENT`, `MVP_PRODUCT`, `MVP_TYPE`, `MVP_PRIORITY`. **One-time:** grant project scope: see **docs/handoff/MVP_FACTORY_PROJECT_SETUP.md** (`gh auth refresh -h github.com -s read:project,project`).

### Current task (P2 #3) on the board

| Field     | Value     |
|----------|-----------|
| Status   | Backlog   |
| Agent    | Tribeca   |
| Product  | amanoba   |
| Type     | Feature   |
| Priority | P0        |

Link: [mvp-factory-control #2 in project](https://github.com/users/moldovancsaba/projects/1/views/2?pane=issue&itemId=155570517&issue=moldovancsaba%7Cmvp-factory-control%7C2).

### Setting fields from this repo (script)

| What | How |
|------|-----|
| **Defaults** | `scripts/mvp-factory-defaults.env`: Product=amanoba, Agent=Tribeca, Type=Feature, Priority=P0, Status=Backlog |
| **Set fields for an issue** | `./scripts/mvp-factory-set-project-fields.sh ISSUE_NUM` (e.g. `./scripts/mvp-factory-set-project-fields.sh 2`) |
| **Override** | `--status Ready`, `--agent Katja`, etc., or env: `MVP_STATUS=Ready ./scripts/mvp-factory-set-project-fields.sh 2` |
| **One-time auth** | See **docs/handoff/MVP_FACTORY_PROJECT_SETUP.md** — run `gh auth refresh -h github.com -s read:project,project` and complete browser flow |

---

**Maintained By**: Product / Engineering  
**Review**: When handoff process or mvp-factory-control workflow changes
