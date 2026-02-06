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
| ccsId | string | CCS family id (e.g. SPORT_SALES_NETWORK_EUROPE_2026). Can also be set in the Admin UI (create/edit course) to link language variants to a family. |
| prerequisiteCourseIds | string[] | Course IDs (string; import resolves to ObjectId). |
| prerequisiteEnforcement | "hard" \| "soft" | |
| quizMaxWrongAllowed | number | Lesson quiz: max wrong answers allowed (0–10). If set, fail when wrongCount > this; else use successThreshold %. |
| certification | object | See Course model: enabled, passThresholdPercent, maxErrorPercent, requireAllLessonsCompleted, requireAllQuizzesPassed, templateId, templateVariantIds, credentialTitleId, priceMoney, pricePoints, etc. |

Do **not** include in package (or import must ignore): `_id`, `createdAt`, `updatedAt`, `brandId`, `createdBy`, `assignedEditors`, `parentCourseId`, `selectedLessonIds`, `isDraft`, `syncStatus`, `lastSyncedAt`.

---

## Lesson object

Lesson **content** and **emailBody** are stored and exchanged as **Markdown** (headings, lists, **bold**, *italic*, [links](url)). Legacy packages may contain HTML; display/email layers render to HTML via `contentToHtml`.

| Field | Type | Notes |
|-------|------|--------|
| lessonId | string | Required. Unique per course. |
| dayNumber | number | |
| language | string | |
| title | string | |
| content | string | **Markdown.** |
| emailSubject | string | |
| emailBody | string | **Markdown.** |
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
| questionType | string | recall \| application \| critical-thinking \| definition \| concept \| best_practice \| diagnostic \| metric. |
| hashtags | string[] | Optional. |
| isActive | boolean | |

Do **not** include: `_id`, `lessonId`/`courseId` (import sets from context), `showCount`, `correctCount`, `metadata.createdAt`/`updatedAt` (import sets).

**Merge key on update**: For existing course, import matches questions by `lessonId` + `uuid` if present, else by `lessonId` + question text (hash or exact). Update in place; create if no match. Do not delete questions that exist in DB but are not in the package.

---

## Import behaviour

- **New course** (no existing course with same courseId): Create Course, Lessons, QuizQuestions. Use default brand (e.g. amanoba) for brandId.
- **Overwrite (update)** (existing course, overwrite=true): Merge only. Update course document (content/config fields above). Upsert lessons by lessonId. Upsert quiz questions by lessonId + uuid (or question text). Do **not** delete existing lessons or questions that are not in the package. Preserve: CourseProgress, ContentVote, Certificate, CertificateEntitlement, PaymentTransaction, child courses (shorts), enrolments.

### How to create or update a course from a package

**Standard workflow (single JSON):**

1. **Export:** Open a course in the editor (Admin → Courses → open course) and use **Export**. This downloads a single `.json` file (v2 package).
2. Edit the JSON: set a new **courseId** (and name/description if desired). Optionally adjust lessonIds in **lessons** if you want different lesson keys. Save as UTF-8 so characters like en-dash (–), em-dash (—), and accented letters are preserved.
3. **Import:**  
   - **New/update from list:** Admin → **Course Management** → **Import**. Choose the `.json` file. The app creates a new course (by courseId) or updates an existing one and opens its editor.  
   - **Merge into current course:** From the course editor, use **Import**. Choose the `.json` file. Content is merged; progress, upvotes, certificates, and shorts are preserved.

A template is in **docs/course/sample.json** — copy and edit it to create a new course, then import that file.

**API:** POST `/api/admin/courses/import` with `Content-Type: application/json` and body either `{ courseData: { course, lessons }, overwrite: true }` or directly `{ course, lessons, overwrite: true }`.

---

## ZIP (API backward compatibility)

The API still accepts a **ZIP** containing `package.json` (single file with course + lessons) or the older 3-file layout (`manifest.json` + `course.json` + `lessons.json`). The **UI uses only single JSON**: Export produces JSON; Import accepts `.json` only. Use ZIP only if calling the API directly (e.g. scripts).
