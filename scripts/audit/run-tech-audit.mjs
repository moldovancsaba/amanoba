#!/usr/bin/env node
/**
 * Orchestrate tech audit artifacts.
 * Usage: node scripts/audit/run-tech-audit.mjs [--production]
 */
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = join(root, 'docs/audit/generated');
const withProduction = process.argv.includes('--production');

mkdirSync(outDir, { recursive: true });

function run(cmd) {
  return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

const sections = [];
sections.push(`# Tech audit run\n\n**At:** ${new Date().toISOString()}\n`);

try {
  sections.push('## Git baseline\n\n```\n' + run('git log -1 --oneline origin/main') + run('git status -sb') + '```\n');
} catch {
  sections.push('## Git baseline\n\n(unavailable)\n');
}

sections.push('## Route inventory\n\n```\n' + run('node scripts/audit/generate-route-inventory.mjs') + '```\n');

if (withProduction) {
  try {
    sections.push('## Production smoke\n\n' + run('node scripts/audit/production-smoke.mjs') + '\n');
  } catch (e) {
    sections.push('## Production smoke\n\n```\n' + (e.stdout || e.message) + '\n```\n');
  }
}

writeFileSync(join(outDir, 'AUDIT_RUN.md'), sections.join('\n'), 'utf8');
console.log(`✅ Wrote docs/audit/generated/AUDIT_RUN.md`);
