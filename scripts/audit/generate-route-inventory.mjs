#!/usr/bin/env node
/**
 * Generate route inventory for tech audits.
 * Output: docs/audit/generated/ROUTE_INVENTORY.md
 */
import { readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = join(root, 'docs/audit/generated');
const outFile = join(outDir, 'ROUTE_INVENTORY.md');

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walk(abs, acc);
      continue;
    }
    if (entry.name === 'route.ts' || entry.name === 'route.tsx' || entry.name === 'page.tsx') {
      acc.push(relative(root, abs));
    }
  }
  return acc;
}

const apiRoutes = walk(join(root, 'app/api')).filter((p) => p.endsWith('route.ts') || p.endsWith('route.tsx')).sort();
const pages = walk(join(root, 'app/[locale]')).filter((p) => p.endsWith('page.tsx')).sort();

mkdirSync(outDir, { recursive: true });

const lines = [
  '# Generated Route Inventory',
  '',
  `**Generated at:** ${new Date().toISOString()}`,
  `**API routes:** ${apiRoutes.length}`,
  `**Locale pages:** ${pages.length}`,
  '',
  '## API routes',
  '',
  ...apiRoutes.map((p) => `- \`${p}\``),
  '',
  '## Locale pages',
  '',
  ...pages.map((p) => `- \`${p}\``),
  '',
];

writeFileSync(outFile, lines.join('\n'), 'utf8');
console.log(`✅ Wrote ${outFile} (${apiRoutes.length} API, ${pages.length} pages)`);
