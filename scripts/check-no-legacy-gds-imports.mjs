#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scanRoots = ['app', 'components', 'scripts'];
const ignoredDirs = new Set(['node_modules', '.next', 'dist']);
const sourceExt = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.md']);
const ignoredFiles = new Set([
  'scripts/check-no-legacy-gds-imports.mjs',
  'scripts/check-gds-adoption.ts',
  'scripts/create-gds-23-issues.sh',
]);
const legacyPattern = /@gds\//;

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      walk(abs, files);
      continue;
    }
    if (!sourceExt.has(entry.name.slice(entry.name.lastIndexOf('.')))) continue;
    files.push(abs);
  }
  return files;
}

const findings = [];

for (const scanRoot of scanRoots) {
  const absRoot = join(root, scanRoot);
  for (const file of walk(absRoot)) {
    const rel = relative(root, file);
    if (ignoredFiles.has(rel.replace(/\\/g, '/'))) continue;

    const content = readFileSync(file, 'utf8');
    if (!legacyPattern.test(content)) continue;

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      if (legacyPattern.test(lines[i])) {
        findings.push(`${rel}:${i + 1}:${lines[i].trim()}`);
      }
    }
  }
}

if (findings.length) {
  console.error('Legacy @gds/* imports or references found (use @doneisbetter/* only):');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log('✅ No legacy @gds/* imports in app/, components/, or scripts/');
