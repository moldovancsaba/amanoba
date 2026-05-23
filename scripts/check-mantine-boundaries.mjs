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

const mantineOnlyFiles = new Set([
  'app/[locale]/page.tsx',
  'app/[locale]/auth/error/page.tsx',
  'app/[locale]/courses/page.tsx',
  'app/[locale]/dashboard/page.tsx',
  'app/[locale]/my-courses/page.tsx',
  'app/[locale]/blog/[slug]/page.tsx',
  'app/[locale]/news/[slug]/page.tsx',
  'app/components/LearnerPageHeader.tsx',
  'app/components/ThemeToggle.tsx',
  'app/components/patterns/ArticleShell.tsx',
  'app/components/patterns/CourseCard.tsx',
  'app/components/patterns/MetricCard.tsx',
  'app/components/patterns/StateBlock.tsx',
  'app/components/sign-out-button.tsx',
  'components/CookieConsentBanner.tsx',
  'components/LanguageSwitcher.tsx',
  'components/Logo.tsx',
]);

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
