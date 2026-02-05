# Quiz Item QA Runbook

## Exact commands
1. **Audit latest question**
   ```bash
   npx tsx scripts/quiz-item-qa/cli.ts audit:last-modified
   ```
2. **Pick the next item (only for inspection)**
   ```bash
   npx tsx scripts/quiz-item-qa/cli.ts pick:next
   ```
3. **Evaluate a specific question**
   ```bash
   npx tsx scripts/quiz-item-qa/cli.ts evaluate:item --id <questionId> --output-file ./tmp/eval.json
   ```
4. **Apply updates (dry-run by default, toggled via `--dry-run=false` or environment)**
   ```bash
   npx tsx scripts/quiz-item-qa/cli.ts apply:update --id <questionId> --from-last-eval --dry-run=false
   ```
5. **Record handover/state after verification**
   ```bash
   npx tsx scripts/quiz-item-qa/cli.ts handover:record --id <questionId> --agent codex-qa
   ```
6. **Full loop (N items, default uses `itemsPerRun` from config)**
   ```bash
   npx tsx scripts/quiz-item-qa/cli.ts loop:run --items 1
   ```

## Required environment variables
| Name | Purpose |
| --- | --- |
| `QUIZ_ITEM_API_BASE_URL` | Base admin API URL (default `https://amanoba.com/api/admin/questions`). |
| `QUIZ_ITEM_ADMIN_TOKEN` | Admin API token used by the CLI (fallbacks to `ADMIN_API_TOKEN(S)`). |
| `ADMIN_API_TOKEN` / `ADMIN_API_TOKENS` | Alternative token list for cross-tool compatibility. |
| `QUIZ_ITEM_PAGE_SIZE` | Pagination size per `GET` call (default 100). |
| `QUIZ_ITEM_RATE_LIMIT_MS` | Minimum delay between API calls (default 200ms). |
| `QUIZ_ITEM_MAX_RETRIES` | Number of retries after transient failures (default 3). |
| `QUIZ_ITEM_ITEMS_PER_RUN` | Default `loop:run` batch size when `--items` omitted (default 1). |
| `QUIZ_ITEM_DRY_RUN` | `true` to skip writes while exercising `loop:run`. |

## Dry-run mode
- Set `QUIZ_ITEM_DRY_RUN=true` or pass `--dry-run=true` to `loop:run`/`apply:update`. The CLI will skip `PATCH` calls and only log the intended payload.
- The `dry-run` flag still runs evaluation and verification logic but will exit before hitting the network.
- Use dry-run whenever you need to preview changes or demonstrate the workflow without mutating production data.

## How to resume safely
1. Ensure `.state/quiz_item_qa_state.json` exists; it keeps `lastCompletedItemId` and `lastCompletedItemUpdatedAt`.
2. Run `npx tsx scripts/quiz-item-qa/cli.ts pick:next` to confirm the next record matches expectations.
3. Continue with `loop:run` (optionally limited by `--items`) or manual evaluate/apply cycles.
4. Never delete the state file mid-run; if you must restart, archive it, restart from the oldest item, and note the reset in the handover doc (append a `notes` entry).

## How to verify changes
1. Run `GET /api/admin/questions/[questionId]` (same as `fetchQuestionById`) after `patch`.
2. Compare each patched field to the desired value. In the CLI, `apply:update` already re-fetches and throws if any value diverges.
3. Inspect `metadata.updatedAt` to confirm the row was updated and `metadata.auditedBy` if `audit: true` was supplied.
4. Use `audit:last-modified` again to ensure the updated item surfaces near the top of the sorted list (for sanity).

## Rollback / mitigation
- The API does not expose a “transactional rollback,” so rollback is manual:
  1. Re-fetch the question via `GET /api/admin/questions/[questionId]`.
  2. Reapply the previous values using `PATCH`, or use a saved backup (`scripts/quiz-backups/<course>/<lesson>.json`) with `npx tsx scripts/restore-lesson-quiz-from-backup.ts --file <path>`.
  3. Re-run `eval` to confirm golden standards still pass after rollback.
- Always log the rollback action in `docs/_archive/reference/QUIZ_ITEM_QA_HANDOVER.md` (include reason, timestamp, agent).

## Configuration layer (all derived from env vars)
- `pageSize`: number of items fetched per page (`QUIZ_ITEM_PAGE_SIZE` or 100).
- `rateLimitMs`: delay between API requests (`QUIZ_ITEM_RATE_LIMIT_MS` or 200ms).
- `maxRetries`: reattempt count for transient HTTP issues (`QUIZ_ITEM_MAX_RETRIES` or 3).
- `itemsPerRun`: how many items `loop:run` processes when `--items` isn't supplied (`QUIZ_ITEM_ITEMS_PER_RUN` or 1).

All configuration is centralized in `scripts/quiz-item-qa/config.ts`.
