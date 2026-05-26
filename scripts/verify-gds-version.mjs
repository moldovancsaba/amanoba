#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const expected = process.env.GDS_VERSION_EXPECTED ?? '2.5.1';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkgs = ['@gds/theme', '@gds/core', '@gds/admin'];

for (const name of pkgs) {
  const pkgPath = join(root, 'node_modules', name, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (pkg.version !== expected) {
    console.error(`GDS version mismatch: ${name}@${pkg.version} expected ${expected}`);
    process.exit(1);
  }
}

const gdsVersion = readFileSync(
  join(root, '../../../Shared/Projects/GENERAL_DESIGN_SYSTEM/VERSION'),
  'utf8',
).trim();
if (gdsVersion !== expected) {
  console.error(`GDS SSOT VERSION ${gdsVersion} != expected ${expected}`);
  process.exit(1);
}

console.log(`✅ GDS packages aligned at ${expected}`);
