# Course package format (v2)

**Purpose**: Single machine- and human-readable format for exporting and importing a full course (content only). Update = merge into existing course without losing stats.  
**Used by**: `GET /api/admin/courses/[courseId]/export`, `POST /api/admin/courses/import`.  
**Schema version**: `2.0`.

---

## Top-level shape (single JSON)

When using a single JSON file (current export/import), the payload has:

```json
{
  "packageVersion": "2.0",
  "exportedAt": "ISO8601",
  "exportedBy": "string",
  "course": { ... },
  "lessons": [ ... ],
  "canonicalSpec": null | { "json": { ... }, "ccsMd": "string" },
  "courseIdea": null | "string"
}
```

- **packageVersion**: Must be `"2.0"` for this format. Import rejects unknown versions or missing version.
- **exportedAt**, **exportedBy**: Metadata only; not applied on import.
- **course**: Course content and config (no `_id`, no `createdAt`/`updatedAt`). See Course object below.
- **lessons**: Array of lesson objects; each may include **quizQuestions** for that lesson. See Lesson object below.
- **canonicalSpec**: Optional. If present, `json` = canonical JSON object; `ccsMd` = _CCS.md content. Import may ignore or persist to repo (implementation-defined).
- **courseIdea**: Optional markdown string. Import may ignore or persist to repo (implementation-defined).

---

## Course object (content/config only)

All fields below are optional in the package unless noted. Omitted fields are not overwritten on update (merge).

| Field | Type | Notes |
|-------|------|--------|
| courseId | string | Required. Unique key. |
| name | string | |
| description | string | |
| language | string | |
| thumbnail | string | URL. |
| durationDays | number | |
| isActive | boolean | |
| requiresPremium | boolean | |
| pointsConfig | { completionPoints, lessonPoints, perfectCourseBonus? } | |
| xpConfig | { completionXP, lessonXP } | |
| metadata | object | |
| translations | object | Map-like: locale → { name, description }. |
| discussionEnabled | boolean | Feature toggle. |
| leaderboardEnabled | boolean | Feature toggle. |
| studyGroupsEnabled | boolean | Feature toggle. |
| ccsId | string | CCS family id (e.g. SPORT_SALES_NETWORK_EUROPE_2026). |
| prerequisiteCourseIds | string[] | Course IDs (string; import resolves to ObjectId). |
| prerequisiteEnforcement | "hard" \| "soft" | |
| certification | object | See Course model: enabled, passThresholdPercent, requireAllLessonsCompleted, requireAllQuizzesPassed, templateId, templateVariantIds, credentialTitleId, priceMoney, pricePoints, etc. |

Do **not** include in package (or import must ignore): `_id`, `createdAt`, `updatedAt`, `brandId`, `createdBy`, `assignedEditors`, `parentCourseId`, `selectedLessonIds`, `isDraft`, `syncStatus`, `lastSyncedAt`.

---

## Lesson object

| Field | Type | Notes |
|-------|------|--------|
| lessonId | string | Required. Unique per course. |
| dayNumber | number | |
| language | string | |
| title | string | |
| content | string | |
| emailSubject | string | |
| emailBody | string | |
| quizConfig | object \| null | { enabled, successThreshold, questionCount, poolSize, required }. |
| unlockConditions | object | |
| pointsReward | number | |
| xpReward | number | |
| isActive | boolean | |
| displayOrder | number | |
| metadata | object | |
| translations | object | Map-like. |
| quizQuestions | array | Quiz items for this lesson. See Quiz question object. |

Do **not** include: `_id`, `courseId` (import sets from context), `createdAt`, `updatedAt`.

---

## Quiz question object

| Field | Type | Notes |
|-------|------|--------|
| uuid | string | Optional but recommended. Stable id for merge (upsert by lessonId + uuid). |
| question | string | |
| options | string[] | |
| correctIndex | number | |
| difficulty | string | EASY \| MEDIUM \| HARD \| EXPERT. |
| category | string | |
| questionType | string | application \| critical-thinking \| recall. |
| hashtags | string[] | Optional. |
| isActive | boolean | |

Do **not** include: `_id`, `lessonId`/`courseId` (import sets from context), `showCount`, `correctCount`, `metadata.createdAt`/`updatedAt` (import sets).

**Merge key on update**: For existing course, import matches questions by `lessonId` + `uuid` if present, else by `lessonId` + question text (hash or exact). Update in place; create if no match. Do not delete questions that exist in DB but are not in the package.

---

## Import behaviour

- **New course** (no existing course with same courseId): Create Course, Lessons, QuizQuestions. Use default brand (e.g. amanoba) for brandId.
- **Overwrite (update)** (existing course, overwrite=true): Merge only. Update course document (content/config fields above). Upsert lessons by lessonId. Upsert quiz questions by lessonId + uuid (or question text). Do **not** delete existing lessons or questions that are not in the package. Preserve: CourseProgress, ContentVote, Certificate, CertificateEntitlement, PaymentTransaction, child courses (shorts), enrolments.

---

## Optional: ZIP package (future)

A ZIP may contain:

- `manifest.json` — packageVersion, courseId, list of files.
- `course.json` — course object.
- `lessons.json` — array of lesson objects (or `lessons/day-01.json` …).
- `canonical/<ccsId>.canonical.json`, `canonical/<ccsId>_CCS.md`.
- `course_idea.md`.

Import would parse ZIP and then apply the same merge/create rules as for single JSON.
