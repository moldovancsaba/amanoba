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

- **Design**: CCS = course family; language variants are courses with the same `ccsId` (e.g. `PRODUCTIVITY_2026_HU`, `PRODUCTIVITY_2026_EN` → `ccsId: "PRODUCTIVITY_2026"`). See `docs/_archive/delivery/2026-01/2026-01-27_RAPID_CHILDREN_COURSES_ACTION_PLAN_AND_HANDOVER.md` §0.1 and `docs/canonical/PRODUCTIVITY_2026/`.
- **Current DB**: Courses use `courseId` like `PRODUCTIVITY_2026_HU`, `GEO_SHOPIFY_30_HU`, etc., but **`course.ccsId` is unset** and the **`ccs`** collection is empty (or contains only manually created rows).

---

## 2. Plan (What We Did / Do)

| # | Action | Owner | Status |
|---|--------|--------|--------|
| 1 | **Backfill script** — From existing courses (no `parentCourseId`), derive family id (e.g. `PRODUCTIVITY_2026_HU` → `PRODUCTIVITY_2026`). For each family: create CCS doc if missing, set `course.ccsId` on all its courses. Dry-run by default, `--apply` to write. | Dev | Implemented |
| 2 | **DELETE** ` /api/admin/ccs/[ccsId]` — Allow delete only when no courses have this `ccsId` (or document "delete unlinks courses"). | Dev | Implemented |
| 3 | **Admin UI** — Per CCS row: **Edit** (modal/inline to PATCH name, optionally idea/outline) and **Delete** (confirm → DELETE, refresh list). | Dev | Implemented |

### 2.1 Backfill grouping rule

- **Language variants**: if `courseId` ends with `_<LOCALE>` where `<LOCALE>` is one of the supported locales (see `app/lib/i18n/locales.ts`, e.g. `HU`, `EN`, `RU`, `AR`, ...), then `ccsId = courseId` without that suffix.  
  Example: `PRODUCTIVITY_2026_HU` → `PRODUCTIVITY_2026`; `B2B_SALES_2026_30_RU` → `B2B_SALES_2026_30`.
- **Base courses without a language suffix**: if `courseId` is itself a CCS id (i.e. a row exists in `ccs` with the same `ccsId`), then `ccsId = courseId`.  
  Example: `GEO_SHOPIFY_30` → `GEO_SHOPIFY_30`.
- **Shorts / child courses**: if `parentCourseId` is set, inherit `ccsId` from the parent course when possible.
- For each inferred `ccsId`: ensure one CCS document exists (create with `name: ccsId` if missing), then set `course.ccsId = ccsId` for every course in that family that is missing or mismatched.

### 2.2 Script usage

```bash
# Dry-run (default): report what would be created/updated
npx tsx --env-file=.env.local scripts/backfill-ccs-from-courses.ts

# Apply changes to DB (writes a rollback backup file under scripts/course-backups/)
npx tsx --env-file=.env.local scripts/backfill-ccs-from-courses.ts --apply

# Optional: choose a custom backup dir
npx tsx --env-file=.env.local scripts/backfill-ccs-from-courses.ts --apply --backup-dir scripts/course-backups
```

---

## 3. After Backfill

- **By course family (CCS)** will list one row per family (e.g. PRODUCTIVITY_2026, GEO_SHOPIFY_30).
- Each row shows the correct **language variants** (courses with that `ccsId`).
- You can **Edit** (name/idea/outline) and **Delete** (only if 0 variants) from the UI.

---

## 4. Rollback

- Backfill writes a JSON backup file before DB writes (default under `scripts/course-backups/`).
- To undo the backfill, restore `Course.ccsId` from that backup:

```bash
# Dry-run restore
npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file scripts/course-backups/<BACKUP_FILE>.json

# Apply restore
npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file scripts/course-backups/<BACKUP_FILE>.json --apply
```

- If the backfill created new CCS docs and you also want to remove them (only when unreferenced after restore):

```bash
npx tsx --env-file=.env.local scripts/restore-courses-from-backup.ts --file scripts/course-backups/<BACKUP_FILE>.json --apply --delete-created-ccs
```

- As a last resort, restore from a full DB backup/snapshot.
- DELETE is only allowed when no courses reference the CCS, so it does not leave orphaned courses.
