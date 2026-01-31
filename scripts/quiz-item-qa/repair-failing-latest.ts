import { readFileSync } from 'fs';
import { applyUpdate, evaluateItem, recordHandover } from './mongodb-actions';
import { loadState } from './state';
import { disconnectDB } from '../../app/lib/mongodb';

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  let currentKey: string | null = null;
  argv.forEach((value) => {
    if (value.startsWith('--')) {
      currentKey = value.replace('--', '');
      args[currentKey] = '';
    } else if (currentKey) {
      args[currentKey] = value;
      currentKey = null;
    }
  });
  return args;
}

function latestViolationsFromNew2Old(path: string): Map<string, number> {
  const text = readFileSync(path, 'utf-8');
  const lines = text.split(/\r?\n/);
  const headerRe = /^##\s+\d{4}-\d{2}-\d{2}T.*—\s+([0-9a-f]{24})\s*$/;
  const violRe = /^-\s+Violations:\s+(\d+)\s*$/;

  const latest = new Map<string, number>();
  let currentId: string | null = null;

  for (const line of lines) {
    const h = line.match(headerRe);
    if (h) {
      const id = h[1];
      currentId = latest.has(id) ? null : id;
      continue;
    }
    const v = line.match(violRe);
    if (v && currentId) {
      latest.set(currentId, Number(v[1]));
      currentId = null;
    }
  }
  return latest;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const limit = args.limit ? Math.max(1, Number(args.limit)) : Number.POSITIVE_INFINITY;
  const dryRun = args['dry-run'] === 'true';
  const maxAttempts = args.attempts ? Math.max(1, Number(args.attempts)) : 3;

  const state = loadState();
  const cursorUpdatedAt = state.cursorUpdatedAt || state.lastCompletedItemUpdatedAt;
  const cursorItemId = state.cursorItemId || state.lastCompletedItemId;
  if (!cursorUpdatedAt || !cursorItemId) {
    throw new Error('Missing cursor in .state/quiz_item_qa_state.json');
  }

  const latest = latestViolationsFromNew2Old('docs/QUIZ_ITEM_QA_HANDOVER_NEW2OLD.md');
  const failingIds = Array.from(latest.entries())
    .filter(([, v]) => Number.isFinite(v) && v > 0)
    .map(([id]) => id)
    .slice(0, limit);

  let fixed = 0;
  let reloggedWithoutDbChange = 0;
  let stillFailing = 0;
  let noAutoPatch = 0;

  for (const id of failingIds) {
    const latestLoggedViolations = latest.get(id) ?? null;
    const first = await evaluateItem(id);
    let question = first.question;
    let evalResult = first.evaluation;

    let changed = false;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (!evalResult.needsUpdate) break;
      if (!evalResult.autoPatch || Object.keys(evalResult.autoPatch).length === 0) break;

      const res = await applyUpdate(id, evalResult.autoPatch, { dryRun });
      if (!dryRun && !res.verified) {
        throw new Error(`Verification failed for ${id}`);
      }
      changed = changed || Object.keys(evalResult.autoPatch).length > 0;

      const nextEval = await evaluateItem(id);
      question = nextEval.question;
      evalResult = nextEval.evaluation;
    }

    if (!evalResult.needsUpdate) {
      if (!dryRun) {
        const baseNote =
          changed
            ? 'Auto-repaired failing latest entry'
            : 'Re-logged as passing (no DB change; latest NEW2OLD entry was failing)';
        recordHandover(
          question,
          evalResult,
          [
            baseNote,
            ...(latestLoggedViolations === null
              ? []
              : [`Previous latest NEW2OLD violations: ${latestLoggedViolations}`]),
          ],
          {
            agent: 'codex-qa',
            cursorUpdatedAt,
            cursorItemId,
          }
        );
        if (!changed) {
          reloggedWithoutDbChange += 1;
        }
      }
      fixed += 1;
      continue;
    }

    if (!evalResult.autoPatch || Object.keys(evalResult.autoPatch).length === 0) {
      noAutoPatch += 1;
      continue;
    }

    stillFailing += 1;
  }

  console.log(
    JSON.stringify(
      {
        failingIdsConsidered: failingIds.length,
        dryRun,
        results: {
          fixed,
          reloggedWithoutDbChange,
          noAutoPatch,
          stillFailingAfterAttempts: stillFailing,
        },
      },
      null,
      2
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
