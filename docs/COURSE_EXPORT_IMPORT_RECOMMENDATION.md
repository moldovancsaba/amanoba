# Course Export / Import / Update — Brutal Honest Recommendation

**Purpose**: Enable a single, authoritative course package format so you can **export** everything, **import** new courses, and **update** existing courses without losing stats (upvotes, students, certifications, shorts).  
**Status**: Recommendation only — not implemented.  
**Constraint**: Stop creating new content until this is in place so all content is secured in one format.

---

## 1. What Exists Today

| Capability | Status | Gap |
|------------|--------|-----|
| **Export** | `GET /api/admin/courses/[courseId]/export` returns JSON | Missing: CCS (canonical spec), course-idea docs, feature toggles, certification config, prerequisites, ccsId, quiz metadata (uuid, questionType, hashtags). Not a “package” (single download with manifest + optional human-readable files). |
| **Import (new)** | `POST /api/admin/courses/import` with `courseData` | Works for course + lessons + questions. Does not handle CCS/course-idea in package. |
| **Import (overwrite)** | Same API with `overwrite: true` | **Critical bug**: Current code **deletes** all lessons and all quiz questions for the course, then re-creates them. So **upvotes, progress, certificates, enrolments, and short-course links are at risk** (course doc is updated in place, but lesson/question `_id`s change; any reference by lessonId is OK, but stats on questions are wiped). |

**UI**: Course editor has “Export” (downloads JSON) and “Import” (file picker + overwrite confirm). No package structure; no “update preserving stats” flow.

---

## 2. Recommended Package Format (Human + Machine Readable)

**Single source of truth**: A **course package** = one artifact that contains everything.

### Option A — Single JSON file (simplest)

- One `.json` file with a **schema version** (e.g. `packageVersion: "2.0"`) and top-level keys: `course`, `lessons`, `quizQuestions`, `canonicalSpec`, `courseIdea`.
- **Pros**: One file, easy to upload/download, versionable.  
- **Cons**: Large; diffing “day 5” in 30-day course is noisy; CCS/course-idea are embedded as strings (or omitted and kept in repo only).

### Option B — Package = ZIP (recommended)

- **ZIP** containing:
  - `manifest.json` — schema version, `courseId`, optional checksums, list of files.
  - `course.json` — full course document (content + config only; no `_id`, no `createdAt`/`updatedAt` from DB).
  - `lessons.json` (or `lessons/day-01.json` … `day-30.json`) — all lessons for the course.
  - `quiz.json` (or `quiz/day-01.json` …) — all quiz questions keyed by lesson/day.
  - `canonical/<ccsId>.canonical.json` + `<ccsId>_CCS.md` — copy of CCS from `docs/canonical/`.
  - `course_idea.md` — copy of course idea from `docs/course_ideas/` (optional).
- **Pros**: Human-editable (markdown, JSON per day), good for git and review; CCS and course-idea are first-class.  
- **Cons**: More logic to build and parse.

**Recommendation**: **Option B (ZIP package)** so that:
- Docs in repo (`docs/canonical/`, `docs/course_ideas/`) can remain source of truth; export = “DB content + these files”. Import can write to DB and optionally back to repo.
- One package = one course; no ambiguity.

---

## 3. Export Scope (Everything You Asked For)

Include in the package:

| Item | Source | Notes |
|------|--------|--------|
| **Canonical spec** | `docs/canonical/<ccsId>/` (from course.ccsId or derived from courseId) | `<ccsId>.canonical.json` + `_CCS.md`. |
| **Course idea** | `docs/course_ideas/` (map courseId → filename convention) | e.g. `amanoba_course_<slug>.md`; optional in package. |
| **Name / title** | Course document | Already in export. |
| **Language** | Course + lessons | Already in export. |
| **Description** | Course document | Already in export. |
| **Course thumbnail URL** | Course document | Already in export. |
| **30-day lessons** | Lesson collection | Already in export; add any missing fields (e.g. metadata, unlockConditions). |
| **Quiz questions (by day)** | QuizQuestion collection | Add **uuid**, **questionType**, **hashtags** to export so re-import is lossless. |
| **Idea / outline** | Course idea + CCS `lessons[]` | In package as markdown + canonical JSON. |
| **Feature toggles** | Course: discussionEnabled, leaderboardEnabled, studyGroupsEnabled | Add to export. |
| **Certification config** | Course.certification | Add to export. |
| **Prerequisites** | Course.prerequisiteCourseIds, prerequisiteEnforcement | Add to export. |
| **ccsId** | Course.ccsId | Add so import knows which CCS applies. |

Do **not** export (or allow overwrite of): `_id`, `createdAt`, `updatedAt`, `brandId` (unless you have a stable slug), `createdBy`/`assignedEditors` (or export as optional; import can leave as-is on update).

---

## 4. Import (New Course)

- Accept the same package format (ZIP or single JSON with same schema).
- Create: one Course, N Lessons, M QuizQuestions.
- Optionally create/update files in `docs/canonical/` and `docs/course_ideas/` if the package contains them and you have a safe write path (e.g. script or CI).
- **Idempotency**: If courseId already exists and overwrite is **false**, return 409 and do nothing.

---

## 5. Update (Overwrite Existing — Preserve Stats)

This is the critical behavioral change.

**Rule**: **Never delete the Course document.** Never delete all lessons or all questions and re-create them. **Merge content only.**

| Entity | Action |
|--------|--------|
| **Course** | Update **content and config** fields only: name, description, language, thumbnail, durationDays, pointsConfig, xpConfig, metadata, feature toggles, certification, prerequisiteCourseIds, prerequisiteEnforcement, ccsId, translations. Do **not** overwrite: _id, courseId, createdAt, brandId (unless explicitly in payload and validated), createdBy, assignedEditors (unless you define a clear rule). |
| **Lessons** | Match by `lessonId` (within the course). **Update in place**: title, content, emailSubject, emailBody, quizConfig, unlockConditions, pointsReward, xpReward, isActive, displayOrder, metadata, translations. If the package contains a lesson that doesn’t exist → **create** it. If the DB has a lesson for this course that is **not** in the package → **leave it** (do not delete). So “update” = additive/merge for lessons. |
| **Quiz questions** | Match by `lessonId` + `courseId` + stable key (**uuid** if present, else question text hash). **Update in place**: question, options, correctIndex, difficulty, category, questionType, hashtags, isActive. If package has a question not in DB → create. If DB has a question for that lesson not in package → **do not delete** (preserves stats and any manual edits). Optionally support an explicit “replace all questions for this lesson” flag in the package for a lesson so you can intentionally replace a lesson’s quiz set. |
| **Preserve (never touch)** | CourseProgress, ContentVote (upvotes), Certificate, CertificateEntitlement, PaymentTransaction, child courses (shorts), enrolments. These stay because we do not delete or replace Course or Lesson documents; we only merge content. |

**Current bug**: In `POST /api/admin/courses/import` with `overwrite: true`, the code does:

```ts
await Lesson.deleteMany({ courseId: existingCourse._id });
await QuizQuestion.deleteMany({ courseId: existingCourse._id, isCourseSpecific: true });
```

So all progress, votes, and question-level stats are effectively lost on “overwrite”. Fix: remove this delete path; implement the merge logic above.

---

## 6. Implementation Order (So You Can Stop Creating Content)

1. **Define the package schema (v2)**  
   - Manifest + course + lessons + quiz (+ optional canonical + course_idea).  
   - Document it in `docs/` (e.g. `COURSE_PACKAGE_FORMAT.md`).

2. **Extend export**  
   - Add missing course fields (toggles, certification, prerequisites, ccsId).  
   - Add quiz uuid/questionType/hashtags.  
   - Optionally: add canonical + course_idea by reading from repo (or from DB if you ever store them there).  
   - Either keep single JSON download or add “Download as ZIP” that builds the package.

3. **Fix import overwrite**  
   - Replace “delete all + recreate” with **merge**: update course doc, upsert lessons by lessonId, upsert questions by lessonId+uuid (or hash).  
   - Do not delete lessons/questions that exist in DB but are not in the package (unless you add an explicit “replace lesson quiz” flag and implement it carefully).

4. **Import (new course)**  
   - Accept the same v2 format; create course + lessons + questions. Optionally write canonical/course_idea to repo.

5. **UI**  
   - Course manager: “Export” → “Export as JSON” (current) and “Export as package (ZIP)” when implemented.  
   - “Import” → file picker (ZIP or JSON), checkbox “Overwrite existing course (preserve stats)” with short warning.  
   - New course page: “Import from package” to create from file.

6. **Testing**  
   - Export a course that has progress, votes, certificates, shorts.  
   - Import with overwrite.  
   - Verify: course content updated, progress/votes/certificates/shorts intact.

---

## 7. Harsh Truths

- **Content freeze**: Stopping new content until this is done is the right call. Otherwise you keep creating data that is hard to back up, version, or restore in one format.
- **Overwrite today is dangerous**: Anyone using “Import with overwrite” today may believe they are “updating” the course; in reality the implementation deletes and re-creates lessons/questions. Fix overwrite before relying on it.
- **Canonical and course-idea live in repo**: Export/import can bundle them, but the single source of truth today is files in `docs/`. Either (a) export reads from repo and bundles, or (b) you move CCS/course-idea into DB and sync to repo. (a) is simpler short-term.
- **Effort**: Rough order: 2–3 days for schema + export extension + overwrite merge + tests; 1 day for ZIP packaging and optional UI. So about **3–5 days** for a solid, stats-preserving flow.

---

## 8. Summary

- **Export**: Extend to full content (course + lessons + quiz + optional CCS + course_idea), one package (ZIP recommended), human- and machine-readable.
- **Import (new)**: Same format; create course + lessons + questions.
- **Update**: Same format; **merge** into existing course (no delete-all); preserve progress, upvotes, certifications, shorts, enrolments.
- **Stop new content** until this is implemented; then all content is secured in one format and you can resume creation with a clear backup/restore/versioning path.
