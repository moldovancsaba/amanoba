#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const manifest = JSON.parse(readFileSync(join(root, 'gds-adoption.json'), 'utf8'));

const extraTruthPatterns = [
  { label: '~/Projects/amanoba duplicate path', regex: /(^|[^A-Za-z0-9._/-])~\/Projects\/amanoba(?:[^A-Za-z0-9._/-]|$)/ },
  {
    label: 'GitHub tarball install URL',
    regex: /https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/releases\/download\/[^)\s]+(?:\.tgz|\.tar\.gz)/,
  },
];

const ignoreLinePattern = /<!--\s*docs-truth:\s*ignore-line\s*-->/;
const ignoreBlockStart = /<!--\s*docs-truth:\s*ignore:start\b.*-->/;
const ignoreBlockEnd = /<!--\s*docs-truth:\s*ignore:end\s*-->/;

function gitList(args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
  });
}

function listDocFiles() {
  const tracked = gitList(['ls-files', '-z', '--', 'README.md', 'READMEDEV.md', 'AGENTS.md', 'docs']);
  const untracked = gitList(['ls-files', '--others', '--exclude-standard', '-z', '--', 'README.md', 'READMEDEV.md', 'AGENTS.md', 'docs']);

  return [...tracked.split('\0'), ...untracked.split('\0')]
    .map((file) => file.trim())
    .filter(Boolean)
    .filter((file, index, all) => all.indexOf(file) === index)
    .filter((file) =>
      file === 'README.md' ||
      file === 'READMEDEV.md' ||
      file === 'AGENTS.md' ||
      file === 'docs/README.md' ||
      file === 'docs/HANDOVER.md' ||
      file.startsWith('docs/core/') ||
      file.startsWith('docs/product/') ||
      file.startsWith('docs/status/') ||
      file.startsWith('docs/architecture/')
    )
    .filter((file) => !file.startsWith('docs/_archive/'))
    .filter((file) => existsSync(resolve(root, file)));
}

function buildChecks() {
  return [
    ...(manifest.compliance?.staleDocumentationReferences ?? []).map((reference) => ({
      label: `stale reference: ${reference}`,
      regex: new RegExp(reference.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    })),
    ...extraTruthPatterns,
  ];
}

function scanFile(filePath, checks) {
  const content = readFileSync(resolve(root, filePath), 'utf8');
  const findings = [];
  const lines = content.split('\n');
  let ignoreBlock = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (ignoreBlockStart.test(line)) {
      ignoreBlock = true;
    }
    if (ignoreBlock || ignoreLinePattern.test(line)) {
      if (ignoreBlockEnd.test(line)) {
        ignoreBlock = false;
      }
      continue;
    }

    for (const check of checks) {
      if (check.regex.test(line)) {
        findings.push({
          filePath,
          line: index + 1,
          label: check.label,
          content: line.trim(),
        });
      }
    }

    if (ignoreBlockEnd.test(line)) {
      ignoreBlock = false;
    }
  }

  return findings;
}

function main() {
  const files = listDocFiles();
  const checks = buildChecks();
  const findings = files.flatMap((filePath) => scanFile(filePath, checks));

  if (findings.length > 0) {
    console.error('❌ Documentation truth check failed:');
    for (const finding of findings) {
      console.error(`- ${finding.filePath}:${finding.line} [${finding.label}] ${finding.content}`);
    }
    process.exit(1);
  }

  console.log(`✅ Documentation truth check passed (${files.length} current-truth docs scanned).`);
}

main();
