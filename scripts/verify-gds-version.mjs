#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const expected = process.env.GDS_VERSION_EXPECTED ?? '2.6.1';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkgs = [
  '@doneisbetter/gds-theme',
  '@doneisbetter/gds-core',
  '@doneisbetter/gds-admin',
];

for (const name of pkgs) {
  const pkgPath = join(root, 'node_modules', name, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (pkg.version !== expected) {
    console.error(`GDS version mismatch: ${name}@${pkg.version} expected ${expected}`);
    process.exit(1);
  }
}

const manifest = JSON.parse(readFileSync(join(root, 'gds-adoption.json'), 'utf8'));
if (manifest.gdsVersion !== expected) {
  console.error(`gds-adoption.json gdsVersion ${manifest.gdsVersion} != expected ${expected}`);
  process.exit(1);
}

console.log(`✅ @doneisbetter/* packages aligned at ${expected}`);
