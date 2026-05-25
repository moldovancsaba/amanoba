#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateManifest } from '@gds/compliance';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'gds-adoption.json'), 'utf8'));
const findings = validateManifest(manifest);

for (const adapter of manifest.localAdapters ?? []) {
  if (!existsSync(resolve(root, adapter.path))) {
    findings.push({
      rule: 'missing-adapter',
      severity: 'error',
      file: adapter.path,
      message: `Declared adapter path does not exist: ${adapter.path}`,
    });
  }
}

if (findings.length > 0) {
  console.error('gds-adoption.json validation failed:');
  for (const f of findings) {
    console.error(`- [${f.severity}] ${f.rule}: ${f.message}`);
  }
  process.exit(1);
}

console.log(`✅ gds-adoption.json valid for GDS ${manifest.gdsVersion}`);
