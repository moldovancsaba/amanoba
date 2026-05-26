#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scanRoots = ['app', 'components', 'scripts'];
const ignoredGlobs = [
  '!node_modules/**',
  '!.next/**',
  '!scripts/check-no-legacy-gds-imports.mjs',
  '!scripts/check-gds-adoption.ts',
  '!scripts/create-gds-23-issues.sh',
];

for (const scanRoot of scanRoots) {
  const result = spawnSync(
    'rg',
    ['@gds/', join(root, scanRoot), ...ignoredGlobs.flatMap((glob) => ['--glob', glob])],
    { encoding: 'utf8' },
  );

  if (result.error?.code === 'ENOENT') {
    console.error('ripgrep (rg) is required for ui:check:no-legacy-gds-imports');
    process.exit(1);
  }

  // rg exit 1 with no output = no matches (success)
  if (result.status === 0 && result.stdout.trim()) {
    console.error('Legacy @gds/* imports or references found (use @doneisbetter/* only):');
    console.error(result.stdout.trim());
    process.exit(1);
  }

  if (result.status !== 0 && result.status !== 1) {
    console.error(`rg failed for ${scanRoot}:`, result.stderr || result.stdout);
    process.exit(1);
  }

  if (result.status === 0 && !result.stdout.trim()) {
    continue;
  }

  if (result.status === 1 && result.stdout.trim()) {
    console.error('Legacy @gds/* imports or references found (use @doneisbetter/* only):');
    console.error(result.stdout.trim());
    process.exit(1);
  }
}

console.log('✅ No legacy @gds/* imports in app/, components/, or scripts/');
