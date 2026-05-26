#!/usr/bin/env node
/**
 * Ensures `app/components/patterns/gds/*` are GDS-backed (import @doneisbetter/*) except
 * documented brand-composition adapters listed in gds-adoption.json.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const gdsPatternDir = join(root, 'app/components/patterns/gds');
const manifestPath = join(root, 'gds-adoption.json');

const defaultBrandComposition = new Set([
  'AuthShell.tsx',
  'PublicAppShell.tsx',
  'ArticleShell.tsx',
  'DataToolbar.tsx',
  'ResponsiveDataView.tsx',
]);

let brandComposition = defaultBrandComposition;
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const fromManifest = (manifest.localAdapters ?? [])
    .filter((entry) => entry.status === 'brand-composition')
    .map((entry) => entry.path.split('/').pop());
  if (fromManifest.length > 0) {
    brandComposition = new Set(fromManifest);
  }
}

const files = readdirSync(gdsPatternDir).filter((name) => name.endsWith('.tsx'));
const findings = [];

for (const file of files) {
  const path = join(gdsPatternDir, file);
  const source = readFileSync(path, 'utf8');
  if (brandComposition.has(file)) {
    continue;
  }
  if (!/from\s+['"]@doneisbetter\//.test(source)) {
    findings.push(`${path}: must import from @doneisbetter/* (GDS-only pattern layer)`);
  }
  if (/<(?:Card|Alert|Table|Loader|Title)\b/.test(source) && !/from\s+['"]@doneisbetter\//.test(source)) {
    findings.push(`${path}: reimplements GDS primitives with raw Mantine instead of @doneisbetter/*`);
  }
}

if (findings.length > 0) {
  console.error('GDS pattern check failed:');
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(`✅ GDS-only pattern layer verified (${files.length} files, ${brandComposition.size} brand-composition exceptions)`);
