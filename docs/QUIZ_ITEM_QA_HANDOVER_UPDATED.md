# Quiz Item QA Handover - MongoDB Direct Access

## Purpose & workflow summary
This handover captures the repeatable agent workflow for maintaining **course-specific quiz items (question + answers) via MongoDB Atlas** using direct database access. The goal is a deterministic audit-ready loop: inspect the most recently modified item, pick the next oldest item, compare both question and answers against the golden standards, apply any safe fixes, verify persistence, and record progress before moving on.

**CRITICAL: Only process course-specific quiz items with `isCourseSpecific: true`. Do NOT process general game questions.**

**Workflow**
1. Connect directly to MongoDB Atlas database to fetch questions sorted by `metadata.updatedAt`.
2. **FILTER**: Only process questions where `isCourseSpecific: true` (skip general game questions).
3. Determine the next item by sorting all course-specific questions via `metadata.updatedAt` ascending and choosing the first item whose timestamp is strictly newer than the last processed item stored in `.state/quiz_item_qa_state.json`.
4. Evaluate the question and the four options against the golden standard rules.
5. Apply autopatches (trim/normalize whitespace, fix option lengths) if evaluation provides them.
6. Re-fetch the item from MongoDB to verify the update matches the intended patch.
7. Append a handover entry, update the state file, and repeat for the next item (loop is controlled by `loop:run`).

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
- **Source of truth #2:** `docs/COURSE_BUILDING_RULES.md#gold-standard-only-acceptable-form` (reinforces the same "standalone, grounded, scenario, concrete deliverable, concrete distractors" constraint and the 7-question minimum).
All evaluations must cite one or both sources when flagging violations.

## Database Connection Requirements
- **MongoDB Atlas URI**: Must be configured in `.env.local` as `MONGODB_URI`
- **Database Name**: Set as `DB_NAME=amanoba` in `.env.local`
- **Environment Loading**: All CLI commands require `--env-file=.env.local` flag
- **Connection Management**: CLI automatically connects and disconnects properly
- **FILTER REQUIREMENT**: Only process questions with `isCourseSpecific: true`
  - Skip general game questions (Science, History, Geography, etc.)
  - Only process course-specific questions with `courseId` and `lessonId`
  - Look for course hashtags like `#day-11`, `#productivity`, `#sales`, etc.

## Current Progress Status
- **Last Processed Item**: `68f4c5c5ea642066cb285013`
- **Last Updated**: `2026-01-24T12:32:38.681Z`
- **Total Items Processed**: 15+ items logged below
- **Current Status**: All recent items require manual review due to golden standard violations

## Definition of DONE for a processed item
- The question passes all automatic golden-standard checks (length, banned phrases, question type, option uniqueness, option length).
- Any autopatch (whitespace normalization) has been applied and verified.
- Validation-run metadata (`metadata.updatedAt`) reflects the new timestamp and the `metadata.auditedAt`/`auditedBy` fields can be optionally stamped via `audit: true`.
- The updated quiz item mirrors the patch payload exactly when re-fetched.
- The handover document log contains an entry for this item and the state file is updated with:
  - `lastCompletedItemId`
  - `lastCompletedItemUpdatedAt`
  - `runTimestamp`
  - `agent` (optional)
  - `notes` (if manual review required)

## State (single source)
State file: `.state/quiz_item_qa_state.json`

```json
{
  "lastCompletedItemId": "68f4c5c5ea642066cb285013",
  "lastCompletedItemUpdatedAt": "2026-01-24T12:32:38.681Z",
  "runTimestamp": "2026-01-29T21:57:36.415Z",
  "notes": ["Manual review required"]
}
```

This file is authoritative for the next `pick:next` run. Do not reset or delete unless you are restarting the entire workflow (in that case, archive the file and start from the first question).

## Troubleshooting
### MongoDB Connection errors
- Confirm `MONGODB_URI` and `DB_NAME` are set in `.env.local`.
- Ensure you're using `--env-file=.env.local` flag with all CLI commands.
- Check MongoDB Atlas network access and authentication.

### Environment Loading Issues
- Always use: `npx tsx --env-file=.env.local scripts/quiz-item-qa/mongodb-cli.ts COMMAND`
- Verify `.env.local` file exists and contains `MONGODB_URI` and `DB_NAME`.

### Database Connection Hanging
- The CLI automatically disconnects after each command.
- If process hangs, check MongoDB connection status and network.

### Manual review needed
- When the evaluator flags violations against golden standards, items are logged with "Manual review required".
- These items need human intervention to rewrite according to the quality playbook.
- Do **not** mark items as DONE until they pass all golden standard checks.

---

## Processing Log

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