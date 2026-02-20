import { execFileSync } from 'node:child_process';

function runGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function main() {
  const files = [
    'docs/core/DOCS_INVENTORY.md',
    'docs/core/DOCS_CANONICAL_MAP.md',
    'docs/core/DOCS_TRIAGE.md',
  ];

  try {
    // If any of these files changed after regeneration, fail.
    runGit(['diff', '--exit-code', '--', ...files]);
    console.log('✅ Docs generated files are up to date.');
  } catch {
    const changed = runGit(['diff', '--name-only', '--', ...files]);
    console.error('❌ Docs generated files are out of date.');
    if (changed) console.error(`Changed:\n${changed}`);
    console.error('\nFix: run `npm run docs:refresh` and commit the results.');
    process.exit(1);
  }
}

main();
