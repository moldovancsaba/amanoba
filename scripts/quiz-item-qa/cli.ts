"use strict";
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { loadConfig } from './config';
import { auditLastModified, applyUpdate, evaluateItem, loopRun, pickNext, recordHandover } from './actions';

const LAST_EVAL_PATH = '.state/quiz_item_last_eval.json';

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

async function run() {
  const [,, command, ...rest] = process.argv;
  const args = parseArgs(rest);
  switch (command) {
    case 'audit:last-modified': {
      const last = await auditLastModified();
      if (!last) {
        console.log('No quiz items available.');
        return;
      }
      console.log(`Most recently updated: ${last._id}`);
      console.log(`Updated at: ${last.metadata.updatedAt}`);
      console.log(`Question: ${last.question}`);
      return;
    }
    case 'pick:next': {
      const result = await pickNext();
      if (!result.next) {
        console.log(`No next item: ${result.reason}`);
        return;
      }
      console.log(`Next item: ${result.next._id}`);
      console.log(`Reason: ${result.reason}`);
      console.log(`Question preview: ${result.next.question.slice(0, 120)}`);
      return;
    }
    case 'evaluate:item': {
      const id = args.id || args['question-id'];
      if (!id) {
        throw new Error('Missing --id');
      }
      const { question, evaluation } = await evaluateItem(id);
      const payload = { question, evaluation };
      if (args.json === 'true') {
        console.log(JSON.stringify(payload, null, 2));
      }
      if (args['output-file']) {
        writeFileSync(args['output-file'], JSON.stringify(payload, null, 2), 'utf-8');
      }
      writeFileSync(LAST_EVAL_PATH, JSON.stringify(payload, null, 2), 'utf-8');
      console.log(`Evaluation written to ${LAST_EVAL_PATH}`);
      return;
    }
    case 'apply:update': {
      const id = args.id || args['question-id'];
      if (!id) {
        throw new Error('Missing --id');
      }
      let patch: Record<string, unknown> = {};
      if (args['patch-file']) {
        patch = JSON.parse(readFileSync(args['patch-file'], 'utf-8'));
      } else if (args['from-last-eval'] === 'true') {
        if (!existsSync(LAST_EVAL_PATH)) {
          throw new Error('No last evaluation');
        }
        const last = JSON.parse(readFileSync(LAST_EVAL_PATH, 'utf-8'));
        patch = last.evaluation.autoPatch || {};
      } else {
        throw new Error('Either --patch-file or --from-last-eval must be provided');
      }
      if (!patch || Object.keys(patch).length === 0) {
        console.log('No changes required; skipping apply');
        return;
      }
      const dryRun = args['dry-run'] === 'true';
      const overrides = args['config-file'] ? JSON.parse(readFileSync(args['config-file'], 'utf-8')) : undefined;
      const result = await applyUpdate(id, patch, { dryRun, overrides });
      console.log(JSON.stringify(result, null, 2));
      return;
    }
    case 'handover:record': {
      const id = args.id || args['question-id'];
      const agent = args.agent;
      const notes = args.notes ? args.notes.split(';') : [];
      if (!id) {
        throw new Error('Missing --id');
      }
      const { question, evaluation } = await evaluateItem(id);
      const state = recordHandover(question, evaluation, notes, { agent });
      console.log(`State updated: ${JSON.stringify(state, null, 2)}`);
      return;
    }
    case 'loop:run': {
      const itemsParam = Number(args.items || args.count || '1');
      const defaultItems = loadConfig().itemsPerRun;
      const items = Number.isFinite(itemsParam) && itemsParam > 0 ? itemsParam : defaultItems;
      const dry = args['dry-run'] === 'true';
      if (dry) {
        process.env.QUIZ_ITEM_DRY_RUN = 'true';
      }
      await loopRun(items);
      return;
    }
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
