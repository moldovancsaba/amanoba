#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const trackedFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .filter((file) => /^(app|components)\//.test(file))
  .filter((file) => /\.(tsx?|jsx?)$/.test(file))
  .filter((file) => existsSync(file));

const allowedLegacyHelpers = new Set([]);

const hardBlockedImports = [
  {
    id: 'radix',
    pattern: /from\s+['"]@radix-ui\//,
    message: 'Radix primitives are frozen for product UI; use Mantine primitives or thin Mantine wrappers.',
  },
  {
    id: 'sonner',
    pattern: /from\s+['"]sonner['"]/,
    message: 'Sonner is frozen for product UI; use Mantine notifications.',
  },
  {
    id: 'vaul',
    pattern: /from\s+['"]vaul['"]/,
    message: 'Vaul is frozen for product UI; use Mantine Drawer.',
  },
];

const legacyPrimitiveImports = [
  {
    id: 'legacy-card',
    pattern: /from\s+['"]@\/components\/ui\/card['"]/,
    allow: () => false,
    message: 'Legacy shared Card is frozen; use Mantine Card or a thin Mantine wrapper.',
  },
  {
    id: 'legacy-button',
    pattern: /from\s+['"]@\/components\/ui\/button['"]/,
    allow: () => false,
    message: 'Legacy shared Button is frozen; use Mantine Button or a thin Mantine wrapper.',
  },
];

const helperImports = [
  {
    id: 'class-variance-authority',
    pattern: /from\s+['"]class-variance-authority['"]/,
    message: 'CVA is legacy primitive infrastructure; keep it only in already-listed legacy adapter files.',
  },
  {
    id: 'tailwind-merge',
    pattern: /from\s+['"]tailwind-merge['"]/,
    message: 'tailwind-merge is legacy Tailwind adapter infrastructure; keep it only in already-listed legacy adapter files.',
  },
];

const findings = [];

for (const file of trackedFiles) {
  const source = readFileSync(file, 'utf8');

  for (const rule of hardBlockedImports) {
    if (rule.pattern.test(source)) {
      findings.push({ file, rule });
    }
  }

  for (const rule of legacyPrimitiveImports) {
    if (rule.pattern.test(source) && !rule.allow(file)) {
      findings.push({ file, rule });
    }
  }

  if (!allowedLegacyHelpers.has(file)) {
    for (const rule of helperImports) {
      if (rule.pattern.test(source)) {
        findings.push({ file, rule });
      }
    }
  }
}

if (findings.length > 0) {
  console.error('Mantine boundary check failed:');
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.rule.message}`);
  }
  process.exit(1);
}

console.log('✅ Mantine boundary check passed.');
