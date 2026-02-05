import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

type Finding = {
  file: string;
  line: number;
  patternId: string;
  matches: string[];
  snippet: string;
};

type Pattern = {
  id: string;
  title: string;
  severity: 'blocker' | 'major' | 'minor' | 'info';
  include: (file: string) => boolean;
  regex: RegExp;
  note: string;
};

function runGit(args: string[]) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function listTrackedFiles(): string[] {
  const out = runGit(['ls-files', '--', 'app', 'components']);
  return out
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'));
}

function groupForFile(file: string): string {
  if (file.startsWith('app/[locale]/admin/')) return 'admin';
  if (file.startsWith('app/[locale]/games/') || file.startsWith('app/components/games/')) return 'games';
  if (file.startsWith('components/')) return 'components';
  if (file.startsWith('app/')) return 'app';
  return 'other';
}

function auditFile(file: string, patterns: Pattern[]): Finding[] {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');

  const lineStartOffsets: number[] = [];
  {
    let offset = 0;
    for (const line of lines) {
      lineStartOffsets.push(offset);
      offset += line.length + 1;
    }
  }

  const offsetToLine = (offset: number) => {
    let lo = 0;
    let hi = lineStartOffsets.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const start = lineStartOffsets[mid]!;
      const nextStart = mid + 1 < lineStartOffsets.length ? lineStartOffsets[mid + 1]! : Number.POSITIVE_INFINITY;
      if (offset >= start && offset < nextStart) return mid + 1;
      if (offset < start) hi = mid - 1;
      else lo = mid + 1;
    }
    return 1;
  };

  // Aggregate to avoid duplicate entries for the same (file,line,pattern).
  const bucket = new Map<string, Finding>();

  for (const pattern of patterns) {
    if (!pattern.include(file)) continue;
    pattern.regex.lastIndex = 0;
    for (const match of text.matchAll(pattern.regex)) {
      const idx = match.index ?? 0;
      const line = offsetToLine(idx);
      const key = `${file}:${line}:${pattern.id}`;
      const existing = bucket.get(key);
      const matchText = match[0] ?? '';
      const lineText = lines[line - 1] ?? '';
      if (existing) {
        if (matchText) existing.matches.push(matchText);
        continue;
      }
      bucket.set(key, {
        file,
        line,
        patternId: pattern.id,
        matches: matchText ? [matchText] : [],
        snippet: lineText.trim().slice(0, 260),
      });
    }
  }

  const findings = Array.from(bucket.values());
  for (const f of findings) {
    f.matches = Array.from(new Set(f.matches)).slice(0, 12);
  }
  return findings;
}

function formatMarkdown(params: {
  generatedAtISO: string;
  totalFiles: number;
  totalsByGroup: Record<string, number>;
  totalsBySeverity: Record<string, number>;
  totalsByPattern: Record<string, number>;
  topFiles: Array<{ file: string; count: number }>;
  patterns: Pattern[];
  sampleFindings: Finding[];
}) {
  const {
    generatedAtISO,
    totalFiles,
    totalsByGroup,
    totalsBySeverity,
    totalsByPattern,
    topFiles,
    patterns,
    sampleFindings,
  } = params;

  const patternMeta = new Map(patterns.map((p) => [p.id, p]));

  function mdTable(rows: Array<Record<string, string>>, headers: string[]) {
    const headerLine = `| ${headers.join(' | ')} |`;
    const sep = `| ${headers.map(() => '---').join(' | ')} |`;
    const body = rows.map((r) => `| ${headers.map((h) => r[h] ?? '').join(' | ')} |`).join('\n');
    return [headerLine, sep, body].filter(Boolean).join('\n');
  }

  const totalsByGroupRows = Object.entries(totalsByGroup)
    .sort((a, b) => b[1] - a[1])
    .map(([group, count]) => ({ Group: group, Findings: String(count) }));

  const totalsBySeverityRows = Object.entries(totalsBySeverity)
    .sort((a, b) => {
      const order = { blocker: 0, major: 1, minor: 2, info: 3 } as const;
      return order[a[0] as keyof typeof order] - order[b[0] as keyof typeof order];
    })
    .map(([severity, count]) => ({ Severity: severity, Findings: String(count) }));

  const totalsByPatternRows = Object.entries(totalsByPattern)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([patternId, count]) => {
      const meta = patternMeta.get(patternId);
      return {
        Pattern: meta ? meta.title : patternId,
        Severity: meta ? meta.severity : '',
        Findings: String(count),
      };
    });

  const topFilesRows = topFiles.slice(0, 25).map((t) => ({
    File: `\`${t.file}\``,
    Findings: String(t.count),
    Group: groupForFile(t.file),
  }));

  const sampleRows = sampleFindings.slice(0, 120).map((f) => ({
    Where: `\`${f.file}:${f.line}\``,
    Pattern: patternMeta.get(f.patternId)?.title ?? f.patternId,
    Matches: f.matches.map((m) => `\`${m}\``).join(' '),
  }));

  const patternRulesRows = patterns.map((p) => ({
    Rule: p.title,
    Severity: p.severity,
    Scope: p.id.startsWith('admin:') ? '`app/[locale]/admin/**`' : '`app/**` + `components/**`',
    Notes: p.note,
  }));

  const sections: string[] = [];
  sections.push('# UI Layout Grammar Audit', '');
  sections.push(`**Generated at**: ${generatedAtISO}`, '');
  sections.push(
    'This report scans tracked UI code (`app/**`, `components/**`) for **layout-grammar / design-token** drift. It is a *heuristic* scan: it finds likely violations, then humans decide which are intentional.',
    '',
  );
  sections.push('## How to run', '');
  sections.push('- Regenerate this file: `node --import tsx scripts/audit-layout-grammar-ui.ts --write`');
  sections.push('- Quick scan (stdout only): `node --import tsx scripts/audit-layout-grammar-ui.ts`', '');
  sections.push('## Summary', '');
  sections.push(`- Files scanned: **${totalFiles}**`, '');
  sections.push('### Findings by area');
  sections.push(mdTable(totalsByGroupRows, ['Group', 'Findings']), '');
  sections.push('### Findings by severity');
  sections.push(mdTable(totalsBySeverityRows, ['Severity', 'Findings']), '');
  sections.push('### Top patterns (most frequent)');
  sections.push(mdTable(totalsByPatternRows, ['Pattern', 'Severity', 'Findings']), '');
  sections.push('### Top files (most findings)');
  sections.push(mdTable(topFilesRows, ['File', 'Group', 'Findings']), '');
  sections.push('## Rules checked (what counts as a “defect”)', '');
  sections.push(
    'These rules are derived from `docs/layout_grammar.md` (§ UI layout) + the design tokens in `app/design-system.css` and Tailwind brand colors (`tailwind.config.ts`).',
    '',
  );
  sections.push(mdTable(patternRulesRows, ['Rule', 'Severity', 'Scope', 'Notes']), '');
  sections.push('## Sample findings (first 120)', '');
  sections.push('Use this section to spot-check; the totals above are the authoritative counts.', '');
  sections.push(mdTable(sampleRows, ['Where', 'Pattern', 'Matches']), '');
  sections.push('## Actionable next steps (recommended)', '');
  sections.push(
    '1. **Admin UI first:** Replace `indigo-*` / `gray-*` button + panel styling in `app/[locale]/admin/**` with the page primitives in `app/globals.css` (`.page-shell`, `.page-card(-dark)`, `.page-button-primary`, `.page-button-secondary`, `.input-on-dark`).',
  );
  sections.push(
    '2. **Shared components next:** Fix `components/LanguageSwitcher.tsx` and any other shared component that uses default Tailwind palettes (these leak inconsistent styling across the app).',
  );
  sections.push(
    '3. **Decide policy for games:** Either (A) treat games as allowed to use non-brand palettes, or (B) migrate them to brand tokens incrementally and update this audit script to include/exclude them.',
  );
  sections.push(
    '4. **Add guardrails:** Turn the “blocker/major” rules into a `--check` CI step once we’ve reduced the current findings to an acceptable baseline.',
  );
  sections.push('');

  return sections.join('\n');
}

function main() {
  const args = new Set(process.argv.slice(2));
  const shouldWrite = args.has('--write');
  const shouldCheck = args.has('--check');
  const files = listTrackedFiles()
    .filter((f) => !f.startsWith('app/api/'));

  const patterns: Pattern[] = [
    {
      id: 'blocker:hex-colors-in-ui',
      title: 'Hardcoded hex Tailwind colors (e.g. bg-[#...] )',
      severity: 'blocker',
      include: (file) => file.endsWith('.tsx'),
      regex: /\b(?:bg|text|border|ring|from|to)-\[#(?:[0-9a-fA-F]{3}){1,2}\]/g,
      note: 'Use design tokens / brand palette. Exception: explicit external brand colors (e.g. social share) should be centralized.',
    },
    {
      id: 'blocker:inline-color-literals-in-style',
      title: 'Inline color literals in style={{...}} (hex/rgb/hsl)',
      severity: 'blocker',
      include: (file) => file.endsWith('.tsx'),
      regex: /\bstyle=\{\{[\s\S]{0,500}?(#(?:[0-9a-fA-F]{3}){1,2}\b|rgba?\(|hsla?\()/g,
      note: 'Avoid hardcoded colors in inline styles; use design tokens / Tailwind brand palette. (Heuristic scan: may include some false positives.)',
    },
    {
      id: 'major:tailwind-indigo-blue',
      title: 'Default Tailwind indigo/blue palette in UI',
      severity: 'major',
      include: (file) => !file.startsWith('app/components/games/'),
      regex: /\b(?:bg|text|border|ring)-(?:indigo|blue)-\d{2,3}\b/g,
      note: 'Amanoba UI grammar expects brand tokens (CTA yellow + dark shell). Indigo/blue typically indicates template leftovers.',
    },
    {
      id: 'major:tailwind-gray-scale',
      title: 'Default Tailwind gray scale in UI',
      severity: 'major',
      include: (file) => !file.startsWith('app/components/games/'),
      regex: /\b(?:bg|text|border|ring|from|to)-(?:gray|slate|zinc|neutral|stone)-\d{2,3}\b/g,
      note: 'Prefer brand tokens (brand-darkGrey, brand-white, brand-black) and design-system CSS variables.',
    },
    {
      id: 'major:tailwind-yellow-palette',
      title: 'Tailwind yellow palette usage (prefer brand accent token)',
      severity: 'major',
      include: (file) => !file.startsWith('app/components/games/'),
      regex: /\b(?:bg|text|border|ring)-yellow-\d{2,3}(?:\/\d{1,3})?\b/g,
      note: 'CTA yellow should be applied via brand tokens (`brand-accent` / `primary-*`) and used only for primary actions.',
    },
    {
      id: 'major:cta-bg-on-non-action-element',
      title: 'CTA accent background on non-action elements (likely misuse)',
      severity: 'major',
      include: (file) => file.endsWith('.tsx') && !file.startsWith('app/components/games/'),
      regex: /<(?:div|span|p|li|section|header|footer|article|aside|h[1-6])[^>]*className=(?:"[^"]*\bbg-brand-accent\b[^"]*"|\{`[^`]*\bbg-brand-accent\b[^`]*`)/g,
      note: 'Layout grammar: CTA yellow is exclusive to primary actions. If this is an intentional CTA-like element, change to button/link or adjust styling.',
    },
    {
      id: 'major:cta-text-on-non-link-element',
      title: 'CTA accent text on non-link elements (review)',
      severity: 'major',
      include: (file) => file.endsWith('.tsx') && !file.startsWith('app/components/games/'),
      regex: /<(?:div|span|p|li|section|header|footer|article|aside|h[1-6])[^>]*className=(?:"[^"]*\btext-brand-accent\b[^"]*"|\{`[^`]*\btext-brand-accent\b[^`]*`)/g,
      note: 'Accent text is usually for primary links or emphasis. Ensure it is not used as a generic label/badge.',
    },
    {
      id: 'minor:plain-white-black',
      title: 'Plain white/black classes (bg-white, text-white, bg-black, text-black)',
      severity: 'minor',
      include: (file) => !file.startsWith('app/components/games/'),
      regex: /\b(?:bg|text|border)-(?:white|black)\b/g,
      note: 'Prefer `brand-*` tokens (`bg-brand-white`, `text-brand-white`, etc.) for consistency.',
    },
    {
      id: 'info:dark-mode-classes',
      title: 'Uses Tailwind dark: variants',
      severity: 'info',
      include: (file) => file.endsWith('.tsx'),
      regex: /\bdark:[\w-]+\b/g,
      note: 'Dark mode exists (`darkMode: class`), but the product grammar is “dark shell by default”. Review for consistency.',
    },
    {
      id: 'info:inline-style-attr',
      title: 'Inline style={{...}} in components/pages',
      severity: 'info',
      include: (file) => file.endsWith('.tsx'),
      regex: /\bstyle=\{\{/g,
      note: 'Often needed for progress widths/aspect ratios. Prefer Tailwind utilities when possible; ensure tokens for colors.',
    },
  ];

  const findings: Finding[] = [];
  for (const file of files) {
    findings.push(...auditFile(file, patterns));
  }

  const totalsByGroup: Record<string, number> = {};
  const totalsBySeverity: Record<string, number> = {};
  const totalsByPattern: Record<string, number> = {};
  const totalsByFile: Record<string, number> = {};

  const patternById = new Map(patterns.map((p) => [p.id, p]));

  for (const f of findings) {
    const group = groupForFile(f.file);
    totalsByGroup[group] = (totalsByGroup[group] ?? 0) + 1;

    const severity = patternById.get(f.patternId)?.severity ?? 'info';
    totalsBySeverity[severity] = (totalsBySeverity[severity] ?? 0) + 1;

    totalsByPattern[f.patternId] = (totalsByPattern[f.patternId] ?? 0) + 1;
    totalsByFile[f.file] = (totalsByFile[f.file] ?? 0) + 1;
  }

  const topFiles = Object.entries(totalsByFile)
    .sort((a, b) => b[1] - a[1])
    .map(([file, count]) => ({ file, count }));

  const generatedAtISO = new Date().toISOString();
  const markdown = formatMarkdown({
    generatedAtISO,
    totalFiles: files.length,
    totalsByGroup,
    totalsBySeverity,
    totalsByPattern,
    topFiles,
    patterns,
    sampleFindings: findings,
  });

  if (shouldWrite) {
    writeFileSync('docs/UI_LAYOUT_GRAMMAR_AUDIT.md', markdown);
  }

  if (shouldCheck) {
    const blocker = totalsBySeverity.blocker ?? 0;
    if (blocker > 0) {
      console.error(`❌ UI layout grammar check failed: ${blocker} blocker finding(s).`);
      process.exit(1);
    }
    console.log('✅ UI layout grammar check passed (no blocker findings).');
    return;
  }

  if (!shouldWrite) {
    // Keep stdout short in normal mode.
    const major = totalsBySeverity.major ?? 0;
    const blocker = totalsBySeverity.blocker ?? 0;
    const minor = totalsBySeverity.minor ?? 0;
    console.log(`UI layout grammar audit: ${blocker} blocker, ${major} major, ${minor} minor findings across ${files.length} files.`);
    console.log('Top offenders:');
    for (const row of topFiles.slice(0, 10)) {
      console.log(`- ${row.file}: ${row.count}`);
    }
    console.log('\nTip: run with --write to generate docs/UI_LAYOUT_GRAMMAR_AUDIT.md');
  }
}

main();
