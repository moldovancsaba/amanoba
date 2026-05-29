#!/usr/bin/env node
/**
 * Static guard: admin route PATCH/POST/DELETE must reference requireAdmin or requireAdminOrEditor.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const adminRoot = join(root, 'app/api/admin');

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, files);
    else if (entry.name === 'route.ts') files.push(abs);
  }
  return files;
}

const mutating = ['export async function POST', 'export async function PATCH', 'export async function PUT', 'export async function DELETE'];
const guards = ['requireAdmin', 'requireAdminOrEditor', 'getAdminApiActor'];

const findings = [];

for (const file of walk(adminRoot)) {
  const content = readFileSync(file, 'utf8');
  const rel = relative(root, file);
  for (const sig of mutating) {
    if (!content.includes(sig)) continue;
    const hasGuard = guards.some((g) => content.includes(g));
    if (!hasGuard) {
      findings.push({ file: rel, issue: `Mutating handler without admin guard helper` });
      continue;
    }
    // PATCH blocks that only check session?.user
    if (sig === 'export async function PATCH' && content.includes('export async function PATCH')) {
      const patchBlock = content.split('export async function PATCH')[1]?.split('export async function')[0] ?? '';
      if (patchBlock.includes('session?.user') && !patchBlock.includes('requireAdmin')) {
        findings.push({ file: rel, issue: 'PATCH may be missing requireAdmin in handler body' });
      }
    }
  }
}

if (findings.length) {
  console.error('❌ Admin API guard audit failed:\n');
  for (const f of findings) console.error(`- ${f.file}: ${f.issue}`);
  process.exit(1);
}

console.log('✅ Admin mutating routes reference admin guard helpers');
