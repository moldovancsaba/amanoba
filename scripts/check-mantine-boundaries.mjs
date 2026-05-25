#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const trackedFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .filter((file) => /^(app|components)\//.test(file))
  .filter((file) => /\.(tsx?|jsx?)$/.test(file))
  .filter((file) => existsSync(file));

const gdsManifest = JSON.parse(readFileSync('config/gds-adoption.json', 'utf8'));

const allowedLegacyHelpers = new Set([]);
const mantineOnlyFiles = new Set(gdsManifest.mantineOnlyFiles ?? []);

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function forbiddenImportMessage(specifier) {
  switch (specifier) {
    case '@radix-ui/':
      return 'Radix primitives are frozen for product UI; use Mantine primitives or thin Mantine wrappers.';
    case 'sonner':
      return 'Sonner is frozen for product UI; use Mantine notifications.';
    case 'vaul':
      return 'Vaul is frozen for product UI; use Mantine Drawer.';
    case '@/components/ui/card':
      return 'Legacy shared Card is frozen; use Mantine Card or a thin Mantine wrapper.';
    case '@/components/ui/button':
      return 'Legacy shared Button is frozen; use Mantine Button or a thin Mantine wrapper.';
    case 'class-variance-authority':
      return 'CVA is legacy primitive infrastructure; do not use it for new product UI.';
    case 'tailwind-merge':
      return 'tailwind-merge is legacy Tailwind adapter infrastructure; do not use it for new product UI.';
    default:
      return `Forbidden UI stack import detected: ${specifier}`;
  }
}

function importPattern(specifier) {
  if (specifier.endsWith('/')) {
    return new RegExp(`from\\s+['"]${escapeRegex(specifier)}`);
  }
  return new RegExp(`from\\s+['"]${escapeRegex(specifier)}['"]`);
}

const forbiddenImports = (gdsManifest.forbiddenImports ?? []).map((specifier) => ({
  id: specifier,
  pattern: importPattern(specifier),
  message: forbiddenImportMessage(specifier),
}));

const findings = [];

const mantineOnlyRules = [
  {
    id: 'tailwind-classname',
    pattern: /\bclassName\s*=/,
    message: 'This file is Mantine-only; do not use className/Tailwind utility styling here.',
  },
  {
    id: 'native-button',
    pattern: /<button[\s>]/,
    message: 'This file is Mantine-only; use Mantine Button, ActionIcon, Menu.Item, or another Mantine control.',
  },
  {
    id: 'native-input',
    pattern: /<(input|select|textarea)[\s>]/,
    message: 'This file is Mantine-only; use Mantine form controls.',
  },
  {
    id: 'lucide-icons',
    pattern: /from\s+['"]lucide-react['"]/,
    message: 'This file is Mantine-only; use the project Mantine/Tabler icon set.',
  },
];

for (const file of trackedFiles) {
  const source = readFileSync(file, 'utf8');

  for (const rule of forbiddenImports) {
    if (rule.pattern.test(source) && !allowedLegacyHelpers.has(file)) {
      findings.push({ file, rule });
    }
  }

  if (mantineOnlyFiles.has(file)) {
    for (const rule of mantineOnlyRules) {
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
