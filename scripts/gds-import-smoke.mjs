#!/usr/bin/env node
/**
 * Smoke-test extendGdsTheme using the same repo-local @gds/theme shim as Next.js (next.config.ts).
 * Does not require a built GDS sibling checkout (no dist/client.mjs on fresh file: installs).
 */
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { extendGdsTheme } = await import(pathToFileURL(join(root, 'app/lib/gds/theme.ts')).href);

const theme = extendGdsTheme({
  colors: {
    amanoba: [
      '#fff9e6',
      '#fff0bf',
      '#ffe38a',
      '#ffd452',
      '#ffc421',
      '#fab908',
      '#c89100',
      '#966c00',
      '#654800',
      '#332400',
    ],
  },
  primaryColor: 'amanoba',
});

if (!theme?.colors) {
  console.error('extendGdsTheme failed');
  process.exit(1);
}

console.log('✅ @gds/theme extendGdsTheme smoke passed (repo-local shim)');
