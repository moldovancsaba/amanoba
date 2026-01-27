# CCS Audit and Backfill — Why the List Was Empty / Unusable

**Date**: 2026-01-27  
**Context**: At `/en/admin/courses`, "By course family (CCS)" showed no (or wrong) data; one CCS was added by mistake and could not be edited or deleted.

---

## 1. What Happened (Quick Audit)

### 1.1 Why "existing CCS list" was empty or wrong

- **CCS list** comes from `GET /api/admin/ccs` → reads the **`ccs`** collection. That collection was **never seeded**; it stayed empty after launch.
- **Language variants under a CCS** come from `GET /api/admin/ccs/[ccsId]` → returns courses where `course.ccsId === ccsId` and `!course.parentCourseId`. Existing courses (e.g. `PRODUCTIVITY_2026_HU`, `PRODUCTIVITY_2026_EN`) have **no `ccsId`** set, so they never appear under any CCS.
- So even if you create a CCS (e.g. PRODUCTIVITY_2026) via the "Create course family" form, it shows **"0 language variants"** because no course has `ccsId: "PRODUCTIVITY_2026"`.

### 1.2 Why the accidental CCS could not be removed or edited

- The UI has **Create course family** but **no Edit CCS** and **no Delete CCS**.
- The API has **PATCH** `/api/admin/ccs/[ccsId]` (name, idea, outline, relatedDocuments) but the page does not call it.
- There is **no DELETE** for CCS, so mistaken or duplicate entries cannot be removed.

### 1.3 Design vs current data

- **Design**: CCS = course family; language variants are courses with the same `ccsId` (e.g. `PRODUCTIVITY_2026_HU`, `PRODUCTIVITY_2026_EN` → `ccsId: "PRODUCTIVITY_2026"`). See `docs/2026-01-27_RAPID_CHILDREN_COURSES_ACTION_PLAN_AND_HANDOVER.md` §0.1 and `docs/canonical/PRODUCTIVITY_2026/`.
- **Current DB**: Courses use `courseId` like `PRODUCTIVITY_2026_HU`, `GEO_SHOPIFY_30_HU`, etc., but **`course.ccsId` is unset** and the **`ccs`** collection is empty (or contains only manually created rows).

---

## 2. Plan (What We Did / Do)

| # | Action | Owner | Status |
|---|--------|--------|--------|
| 1 | **Backfill script** — From existing courses (no `parentCourseId`), derive family id (e.g. `PRODUCTIVITY_2026_HU` → `PRODUCTIVITY_2026`). For each family: create CCS doc if missing, set `course.ccsId` on all its courses. Dry-run by default, `--apply` to write. | Dev | Implemented |
| 2 | **DELETE** ` /api/admin/ccs/[ccsId]` — Allow delete only when no courses have this `ccsId` (or document "delete unlinks courses"). | Dev | Implemented |
| 3 | **Admin UI** — Per CCS row: **Edit** (modal/inline to PATCH name, optionally idea/outline) and **Delete** (confirm → DELETE, refresh list). | Dev | Implemented |

### 2.1 Backfill grouping rule

- Consider only courses with `parentCourseId` null/empty (language variants, not shorts).
- **Derive `ccsId` from `courseId`**: if `courseId` matches `^(.+)_(HU|EN|TR|BG|PL|VI|ID|AR|PT|HI)$` (case-insensitive), then `ccsId = $1`.  
  Example: `PRODUCTIVITY_2026_HU` → `PRODUCTIVITY_2026`; `GEO_SHOPIFY_30_EN` → `GEO_SHOPIFY_30`.
- For each such `ccsId`: ensure one CCS document exists (create with `name: ccsId` if missing), then set `course.ccsId = ccsId` for every course in that family.

### 2.2 Script usage

```bash
# Dry-run (default): report what would be created/updated
npx tsx --env-file=.env.local scripts/backfill-ccs-from-courses.ts

# Apply changes to DB
npx tsx --env-file=.env.local scripts/backfill-ccs-from-courses.ts --apply
```

---

## 3. After Backfill

- **By course family (CCS)** will list one row per family (e.g. PRODUCTIVITY_2026, GEO_SHOPIFY_30).
- Each row shows the correct **language variants** (courses with that `ccsId`).
- You can **Edit** (name/idea/outline) and **Delete** (only if 0 variants) from the UI.

---

## 4. Rollback

- To undo backfill: clear `course.ccsId` for affected courses and delete the created CCS documents, or restore from DB backup.
- DELETE is only allowed when no courses reference the CCS, so it does not leave orphaned courses.
