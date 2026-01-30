# Quiz Item QA Handover

## Purpose & workflow summary
This handover captures the repeatable agent workflow for maintaining **quiz items (question + answers) via MongoDB Atlas** using direct database access. The goal is a deterministic audit-ready loop: inspect the most recently modified item, pick the next oldest item, compare both question and answers against the golden standards, apply any safe fixes, verify persistence, and record progress before moving on.

**Workflow**
1. Connect directly to MongoDB Atlas database to fetch questions sorted by `metadata.updatedAt`.
2. Determine the next item by sorting all questions via `metadata.updatedAt` ascending and choosing the first item whose timestamp is strictly newer than the last processed item stored in `.state/quiz_item_qa_state.json`.
3. Evaluate the question and the four options against the golden standard rules.
4. Apply autopatches (trim/normalize whitespace, fix option lengths) if evaluation provides them.
5. Re-fetch the item from MongoDB to verify the update matches the intended patch.
6. Append a handover entry, update the state file, and repeat for the next item (loop is controlled by `loop:run`).

## CLI Commands (MongoDB Direct Access)
All commands use the MongoDB CLI with environment file loading:

```bash
# Check most recently modified question
npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts audit:last-modified

# See what's next to process
npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts pick:next

# Evaluate a specific question
npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts evaluate:item --id QUESTION_ID

# Process questions (dry run)
npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts loop:run --items 5 --dry-run true

# Process questions (live changes)
npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts loop:run --items 5

# Apply specific updates
npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts apply:update --id QUESTION_ID --from-last-eval true

# Record handover entry
npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts handover:record --id QUESTION_ID --agent "agent-name" --notes "Manual review required"
```

## Golden standards
- **Source of truth #1:** `docs/QUIZ_QUALITY_PIPELINE_PLAYBOOK.md#gold-standard-question-type` (defines the five golden rules, no recall questions, minimum lengths, concrete distractors, scenario-based, standalone).
- **Source of truth #2:** `docs/COURSE_BUILDING_RULES.md#gold-standard-only-acceptable-form` (reinforces the same “standalone, grounded, scenario, concrete deliverable, concrete distractors” constraint and the 7-question minimum).
All evaluations must cite one or both sources when flagging violations.

## Determining the most recently modified item
- API endpoint: `GET https://amanoba.com/api/admin/questions`.
- Authentication: `Authorization: Bearer <token>` or `X-Admin-Api-Key: <token>` where `<token>` is any value declared in `ADMIN_API_TOKEN`/`ADMIN_API_TOKENS` or `QUIZ_ITEM_ADMIN_TOKEN`.
- The API response includes `metadata.updatedAt` (ISO 8601). Sort the returned items client-side (`Date.parse(metadata.updatedAt)`), descending.
- The **audit:last-modified** command uses the same API to surface the top item for immediate inspection.

## Picking the next item (oldest-to-newest)
- Fetch all quiz items through repeated `GET` calls (respecting `pageSize` and pagination).
- Sort them by `metadata.updatedAt` ascending (oldest update first).
- Compare each timestamp to `state.last_completed_item_updated_at`; the next item is the first one with a strictly greater timestamp.
- If no previous state exists, the oldest item in the sorted list becomes the initial candidate.
- Persist this state in `.state/quiz_item_qa_state.json` before moving on (see “State” section).

## Definition of DONE for a processed item
- The question passes all automatic golden-standard checks (length, banned phrases, question type, option uniqueness, option length).
- Any autopatch (whitespace normalization) has been applied and verified.
- Validation-run metadata (`metadata.updatedAt`) reflects the new timestamp and the `metadata.auditedAt`/`auditedBy` fields can be optionally stamped via `audit: true`.
- The updated quiz item mirrors the patch payload exactly when re-fetched.
- The handover document log contains an entry for this item and the state file is updated with:
  - `last_completed_item_id`
  - `last_completed_item_updated_at`
  - `run_timestamp`
  - `agent` (optional)
  - `notes` (if manual review required)

## State (single source)
State file: `.state/quiz_item_qa_state.json`

```
{
  "lastCompletedItemId": "QUESTION_OBJECT_ID",
  "lastCompletedItemUpdatedAt": "2026-01-29T12:34:56.789Z",
  "runTimestamp": "2026-01-29T12:36:00.123Z",
  "agent": "codex-qa",
  "notes": ["Manual rewrite required (question too short)"]
}
```

This file is authoritative for the next `pick:next` run. Do not reset or delete unless you are restarting the entire workflow (in that case, archive the file and start from the first question).

## Troubleshooting
### Authentication errors (401/403)
- Confirm `QUIZ_ITEM_ADMIN_TOKEN` or `ADMIN_API_TOKEN(S)` is set.
- Use matching headers: `Authorization: Bearer <token>` **or** `X-Admin-Api-Key: <token>`. Headers may be verified with `curl -H "Authorization: Bearer $token" https://amanoba.com/api/admin/questions`.

### Rate limits / 429
- Respect the configured `rateLimitMs` (default 200ms) between API calls.
- If the API responds with 429, exponential backoff is applied by the CLI; rerun `loop:run` once the cooldown passes.

### Validation errors (400)
- The API enforces: exactly four unique options, `correctIndex` between 0–3, `hashtags` must be an array, and mandatory fields (`question`, `options`, `correctIndex`).
- Trim/normalize text before patching. The CLI auto-normalizes whitespace and rejects duplicates; any other violation usually requires manual editing and note-taking in the handover entry.

### Partial updates or mismatched verification
- If verification fails, the CLI stops and logs the mismatch. Re-run `apply:update` with the exact payload and re-check with `GET /api/admin/questions/[questionId]`.

### Manual review needed
- When the evaluator flags `HAS_LESSON_REF`, `RECALL_TYPE`, or question length still fails, log `notes` (e.g., “Needs rewrite for Scenario rule”) and do **not** mark the item as DONE until the text is curated manually (document this in handover notes).
## 2026-01-29T19:14:54.271Z — 68f4c5c5ea642066cb28500a
- Updated at: 2026-01-24T12:32:38.397Z
- Question: What is the capital of France?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T20:43:04.584Z — 68f4c5c5ea642066cb28500b
- Updated at: 2026-01-24T12:32:38.434Z
- Question: What is 2 + 2?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T20:44:28.304Z — 68f4c5c5ea642066cb28500c
- Updated at: 2026-01-24T12:32:38.463Z
- Question: What color is the sky on a clear day?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T20:50:39.143Z — 68f4c5c5ea642066cb28500a
- Updated at: 2026-01-24T12:32:38.397Z
- Question: What is the capital of France?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T20:56:33.035Z — 68f4c5c5ea642066cb28500b
- Updated at: 2026-01-24T12:32:38.434Z
- Question: What is 2 + 2?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T21:03:39.095Z — 68f4c5c5ea642066cb28500c
- Updated at: 2026-01-24T12:32:38.463Z
- Question: What color is the sky on a clear day?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T21:04:25.092Z — 68f4c5c5ea642066cb28500c
- Updated at: 2026-01-24T12:32:38.463Z
- Question: What color is the sky on a clear day?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Testing workflow functionality

## 2026-01-29T21:06:17.588Z — 68f4c5c5ea642066cb28500d
- Updated at: 2026-01-24T12:32:38.496Z
- Question: How many days are in a week?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T21:07:38.401Z — 68f4c5c5ea642066cb28500e
- Updated at: 2026-01-24T12:32:38.528Z
- Question: What is the opposite of hot?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T21:55:56.160Z — 68f4c5c5ea642066cb28500f
- Updated at: 2026-01-24T12:32:38.559Z
- Question: Which planet is known as the Red Planet?
- Violations: 4
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T21:57:12.754Z — 68f4c5c5ea642066cb285010
- Updated at: 2026-01-24T12:32:38.591Z
- Question: How many legs does a spider have?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T21:57:34.558Z — 68f4c5c5ea642066cb285011
- Updated at: 2026-01-24T12:32:38.620Z
- Question: What gas do plants absorb from the atmosphere?
- Violations: 4
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T21:57:35.528Z — 68f4c5c5ea642066cb285012
- Updated at: 2026-01-24T12:32:38.650Z
- Question: What is water made of?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T21:57:36.415Z — 68f4c5c5ea642066cb285013
- Updated at: 2026-01-24T12:32:38.681Z
- Question: Which is the hottest planet in our solar system?
- Violations: 4
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-29T22:02:10.160Z — 68f4c5c5ea642066cb285014
- Updated at: 2026-01-24T12:32:38.714Z
- Question: What is 5 × 3?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-30T08:12:46.523Z — 68f4c5c5ea642066cb285015
- Updated at: 2026-01-24T12:32:38.743Z
- Question: What is 10 ÷ 2?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-30T08:12:47.562Z — 68f4c5c5ea642066cb285016
- Updated at: 2026-01-24T12:32:38.778Z
- Question: How many sides does a triangle have?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-30T08:12:48.614Z — 68f4c5c5ea642066cb285017
- Updated at: 2026-01-24T12:32:38.805Z
- Question: What is 100 - 50?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-30T08:12:49.652Z — 68f4c5c5ea642066cb285018
- Updated at: 2026-01-24T12:32:38.838Z
- Question: What is half of 20?
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-30T08:12:50.654Z — 68f4c5c5ea642066cb285019
- Updated at: 2026-01-24T12:32:38.865Z
- Question: Who was the first president of the United States?
- Violations: 4
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-30T08:38:40.757Z — 697485d0a29f6c252cb77e1c
- Updated at: 2026-01-24T12:34:23.571Z
- Question: ماذا يعني S في SMART؟
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Arabic course question
  - Question too short
  - All options too short
  - Needs manual rewrite for golden standards

## 2026-01-30T08:38:54.122Z — 697485d0a29f6c252cb77e1e
- Updated at: 2026-01-24T12:34:23.521Z
- Question: ماذا تعني OKR؟
- Violations: 1
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Arabic course question
  - Similar violations expected
  - Needs manual rewrite

## 2026-01-30T08:39:11.681Z — 697485d0a29f6c252cb77e1c
- Updated at: 2026-01-24T12:34:23.571Z
- Question: ماذا يعني S في SMART؟
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Course-specific question
  - Lesson: PRODUCTIVITY_2026_AR_DAY_11
  - Violations: 5
  - Needs manual review for golden standards

## 2026-01-30T08:39:11.682Z — 69748dcb963721474820541d
- Updated at: 2026-01-24T12:34:23.661Z
- Question: كم مرة يجب على شريك المساءلة الخاص بك أن يراجع التقدم؟
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Course-specific question
  - Lesson: PRODUCTIVITY_2026_AR_DAY_12
  - Violations: 5
  - Needs manual review for golden standards

## 2026-01-30T08:39:11.683Z — 69748dcb9637214748205421
- Updated at: 2026-01-24T12:34:23.693Z
- Question: ما أهم عنصر في نظام التتبع؟
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Course-specific question
  - Lesson: PRODUCTIVITY_2026_AR_DAY_12
  - Violations: 5
  - Needs manual review for golden standards

## 2026-01-30T08:39:11.683Z — 69748dcb9637214748205419
- Updated at: 2026-01-24T12:34:23.728Z
- Question: ما نسبة الأهداف المعلنة علنًا التي تم تحقيقها؟
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Course-specific question
  - Lesson: PRODUCTIVITY_2026_AR_DAY_12
  - Violations: 5
  - Needs manual review for golden standards

## 2026-01-30T08:39:11.683Z — 69748dcb963721474820541b
- Updated at: 2026-01-24T12:34:23.758Z
- Question: ما هي الفائدة الرئيسية لشراكة المساءلة؟
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Course-specific question
  - Lesson: PRODUCTIVITY_2026_AR_DAY_12
  - Violations: 5
  - Needs manual review for golden standards

## 2026-01-30T08:42:46.902Z — 69748dcb963721474820541f
- Updated at: 2026-01-24T12:34:23.787Z
- Question: ماذا يجب أن تفعل إذا فاتتك معلم؟
- Violations: 3
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Arabic course question
  - Question too short (32 chars)
  - Options 1&4 too short
  - Needs manual rewrite for golden standards
  - Lesson: PRODUCTIVITY_2026_AR_DAY_12

## 2026-01-30T08:42:55.289Z — 69748f7db7f52a06fe077a4c
- Updated at: 2026-01-24T12:34:23.846Z
- Question: في أي فئة يمكنك أن تقرر على الفور، مما يسمح بالإصلاح لاحقاً؟
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-30T08:42:56.299Z — 69748f7db7f52a06fe077a46
- Updated at: 2026-01-24T12:34:23.878Z
- Question: كم ساعة تحليل لقرار "كبير"؟
- Violations: 6
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-30T08:42:57.262Z — 69748f7db7f52a06fe077a43
- Updated at: 2026-01-24T12:34:23.909Z
- Question: ما هي "شلل التحليل"؟
- Violations: 5
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-30T08:42:58.233Z — 69748f7db7f52a06fe077a4a
- Updated at: 2026-01-24T12:34:23.942Z
- Question: ماذا تعني "قاعدة 80-20" في اتخاذ القرار؟
- Violations: 1
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

## 2026-01-30T08:42:59.218Z — 69748f7eb7f52a06fe077a4e
- Updated at: 2026-01-24T12:34:23.974Z
- Question: ماذا تفعل إذا كان حكمك العاطفي يتعارض مع القرار المستنير؟
- Violations: 3
- State stored in `.state/quiz_item_qa_state.json`
- Notes:
  - Manual review required

