#!/usr/bin/env node
/**
 * Product UI GDS compliance: scans app/ + components/ only (not scripts/seeds).
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateManifest } from '@doneisbetter/gds-compliance';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'gds-adoption.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const TOKEN_PATH_PREFIXES = [
  'app/lib/constants/',
  'app/lib/ui/',
  'app/design-system.css',
  'app/globals.css',
];

const SCAN_ROOTS = ['app', 'components'];
const SOURCE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const IGNORED = new Set(['node_modules', '.next', 'dist']);
const RAW_COLOR = /#(?:[0-9a-fA-F]{3,8})\b|rgb[a]?\s*\(/;
const IMPORT_RE = /(?:import\s+[^'"]*?from\s*|import\s*)['"]([^'"]+)['"]/g;
const FORBIDDEN = ['@/components/ui/', '@radix-ui/', 'tailwindcss', 'lucide-react'];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORED.has(entry.name)) continue;
      walk(join(dir, entry.name), files);
      continue;
    }
    if (SOURCE_EXT.has(entry.name.slice(entry.name.lastIndexOf('.')))) {
      files.push(join(dir, entry.name));
    }
  }
  return files;
}

function isTokenPath(file) {
  const rel = file.replace(`${root}/`, '');
  return TOKEN_PATH_PREFIXES.some((prefix) => rel.startsWith(prefix) || rel === prefix);
}

function isForbidden(source, allowed) {
  if (allowed.has(source)) return false;
  return FORBIDDEN.some((entry) => (entry.endsWith('/') ? source.startsWith(entry) : source === entry || source.startsWith(`${entry}/`)));
}

const allowedImports = new Set();
for (const ex of manifest.approvedExceptions ?? []) {
  if (ex.dependency) allowedImports.add(ex.dependency);
  for (const v of ex.allowImports ?? []) allowedImports.add(v);
}

const findings = [...validateManifest(manifest)];

for (const scanRoot of SCAN_ROOTS) {
  const abs = join(root, scanRoot);
  if (!existsSync(abs)) continue;
  for (const file of walk(abs)) {
    const rel = file.replace(`${root}/`, '');
    const content = readFileSync(file, 'utf8');
    if (!isTokenPath(rel) && RAW_COLOR.test(content)) {
      findings.push({
        rule: 'forbidden-color',
        severity: 'error',
        file: rel,
        message: 'Raw color literal in product UI; use theme tokens or color-tokens.ts.',
      });
    }
    for (const match of content.matchAll(IMPORT_RE)) {
      const source = match[1];
      if (source && isForbidden(source, allowedImports)) {
        findings.push({
          rule: 'forbidden-import',
          severity: 'error',
          file: rel,
          message: `Forbidden UI import (${source}); use @doneisbetter/* or Mantine via GDS patterns.`,
        });
      }
    }
  }
}

for (const adapter of manifest.localAdapters ?? []) {
  const adapterPath = resolve(root, adapter.path);
  if (!existsSync(adapterPath)) {
    findings.push({
      rule: 'missing-adapter',
      severity: 'error',
      file: adapter.path,
      message: `Declared adapter path does not exist: ${adapter.path}`,
    });
  }
}

if (findings.length > 0) {
  console.error(`GDS product UI compliance failed (${findings.length} issue(s)):`);
  for (const f of findings) {
    console.error(`- [${f.severity}] ${f.rule} (${f.file ?? 'manifest'}): ${f.message}`);
  }
  process.exit(1);
}

console.log(`✅ GDS product UI compliance passed (${manifest.gdsVersion})`);
