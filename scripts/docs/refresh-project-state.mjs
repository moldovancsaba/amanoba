#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const projectStatePath = join(root, 'docs/core/PROJECT_STATE.md');
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const gdsAdoption = JSON.parse(readFileSync(join(root, 'gds-adoption.json'), 'utf8'));

const START_MARKER = '<!-- gds-project-state:generated:start -->';
const END_MARKER = '<!-- gds-project-state:generated:end -->';

function git(args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
  }).trim();
}

function formatList(values) {
  return values.map((value) => `- ${value}`).join('\n');
}

function renderGeneratedBlock() {
  const branch = git(['branch', '--show-current']) || 'detached';
  const head = git(['rev-parse', 'HEAD']);
  const shortHead = git(['rev-parse', '--short', 'HEAD']);
  const dirty = git(['status', '--porcelain']) ? 'dirty' : 'clean';
  const generatedAt = new Date().toISOString();

  const activeAdapters = (gdsAdoption.localAdapters ?? []).filter((adapter) => adapter.status === 'active');
  const docsScripts = Object.entries(packageJson.scripts ?? {})
    .filter(([name]) => name.startsWith('docs:'))
    .map(([name]) => `\`${name}\``);

  return [
    START_MARKER,
    `- Generated at: \`${generatedAt}\``,
    `- Package version: \`${packageJson.version}\``,
    `- Git branch: \`${branch}\``,
    `- Git HEAD: \`${shortHead}\` (\`${head}\`)`,
    `- Git worktree state: \`${dirty}\``,
    `- GDS version: \`${gdsAdoption.gdsVersion}\``,
    `- GDS migration status: \`${gdsAdoption.migrationStatus}\``,
    `- Product archetype: \`${gdsAdoption.productArchetype}\``,
    '- Supported GDS entry points:',
    formatList((gdsAdoption.supportedEntryPoints ?? []).map((entry) => `\`${entry}\``)),
    '- Required GDS contracts:',
    formatList((gdsAdoption.requiredContracts ?? []).map((entry) => `\`${entry}\``)),
    `- Active local adapters: ${activeAdapters.length}`,
    formatList(activeAdapters.map((adapter) => `\`${adapter.contract}\` -> \`${adapter.path}\``)),
    '- Docs command set:',
    formatList(docsScripts),
    END_MARKER,
  ].join('\n');
}

function main() {
  const current = readFileSync(projectStatePath, 'utf8');
  const start = current.indexOf(START_MARKER);
  const end = current.indexOf(END_MARKER);

  if (start === -1 || end === -1 || end < start) {
    console.error(`Missing or invalid project-state markers in ${projectStatePath}`);
    process.exit(1);
  }

  const generated = renderGeneratedBlock();
  const next =
    current.slice(0, start) +
    generated +
    current.slice(end + END_MARKER.length);

  writeFileSync(projectStatePath, next, 'utf8');
  console.log(`✅ Refreshed docs/core/PROJECT_STATE.md from package.json, gds-adoption.json, and git HEAD (${git(['rev-parse', '--short', 'HEAD'])}).`);
}

main();
