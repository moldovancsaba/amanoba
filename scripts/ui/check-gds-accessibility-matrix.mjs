#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const docPath = join(root, 'docs/product/GDS_ACCESSIBILITY_VERIFICATION.md');
const requiredSurfaces = ['Admin shell', 'Editor shell', 'Learner header', 'Course card'];

if (!existsSync(docPath)) {
  console.error(`Missing accessibility verification doc: ${docPath}`);
  process.exit(1);
}

const content = readFileSync(docPath, 'utf8');
const missing = requiredSurfaces.filter((surface) => !content.includes(`| ${surface} |`) && !content.includes(`- \`${surface}\``));

if (missing.length > 0) {
  console.error('GDS accessibility matrix is missing required surfaces:');
  for (const surface of missing) {
    console.error(`- ${surface}`);
  }
  process.exit(1);
}

console.log(`✅ GDS accessibility matrix covers required surfaces (${requiredSurfaces.join(', ')}).`);
