#!/usr/bin/env node
/**
 * Run static audit gates and print markdown summary.
 * Does not fail the process — use exit code from individual npm scripts in CI.
 */
import { execSync } from 'node:child_process';

const gates = [
  ['type-check', 'npm run type-check'],
  ['test', 'npm test'],
  ['lint', 'npm run lint'],
  ['ui:gds:check', 'npm run ui:gds:check'],
  ['docs:check', 'npm run docs:check'],
  ['build', 'npm run build'],
];

console.log('# Static gate results\n');
console.log('| Gate | Exit |');
console.log('| --- | ---: |');

for (const [name, cmd] of gates) {
  let code = 0;
  try {
    execSync(cmd, { stdio: 'pipe', encoding: 'utf8' });
  } catch (e) {
    code = e.status ?? 1;
  }
  console.log(`| \`${name}\` | ${code} |`);
}
