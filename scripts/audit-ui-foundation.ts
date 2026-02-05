import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

type Finding = {
  file: string;
  line: number;
  ruleId: string;
  match: string;
  snippet: string;
};

type Rule = {
  id: string;
  title: string;
  severity: 'blocker';
  include: (file: string) => boolean;
  regex: RegExp;
  note: string;
};

function runGit(args: string[]) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function listTrackedFiles(): string[] {
  const out = runGit(['ls-files', '--', 'app', 'components', 'public']);
  return out
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((file) => {
      const lower = file.toLowerCase();
      return (
        lower.endsWith('.ts') ||
        lower.endsWith('.tsx') ||
        lower.endsWith('.js') ||
        lower.endsWith('.jsx') ||
        lower.endsWith('.css') ||
        lower.endsWith('.html') ||
        lower.endsWith('.svg') ||
        lower.endsWith('.json')
      );
    });
}

function computeLineStartOffsets(lines: string[]) {
  const offsets: number[] = [];
  let offset = 0;
  for (const line of lines) {
    offsets.push(offset);
    offset += line.length + 1;
  }
  return offsets;
}

function offsetToLine(lineStartOffsets: number[], offset: number) {
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
}

function normalizeHex(hex: string) {
  return hex.toLowerCase();
}

function formatMarkdown(params: {
  generatedAtISO: string;
  totalFiles: number;
  totalFindings: number;
  totalsByRule: Record<string, number>;
  topFiles: Array<{ file: string; count: number }>;
  rules: Rule[];
  findings: Finding[];
}) {
  const { generatedAtISO, totalFiles, totalFindings, totalsByRule, topFiles, rules, findings } = params;
  const ruleMeta = new Map(rules.map((r) => [r.id, r]));

  function mdTable(rows: Array<Record<string, string>>, headers: string[]) {
    const headerLine = `| ${headers.join(' | ')} |`;
    const sep = `| ${headers.map(() => '---').join(' | ')} |`;
    const body = rows.map((r) => `| ${headers.map((h) => r[h] ?? '').join(' | ')} |`).join('\n');
    return [headerLine, sep, body].filter(Boolean).join('\n');
  }

  const totalsByRuleRows = Object.entries(totalsByRule)
    .sort((a, b) => b[1] - a[1])
    .map(([ruleId, count]) => ({
      Rule: ruleMeta.get(ruleId)?.title ?? ruleId,
      Severity: ruleMeta.get(ruleId)?.severity ?? 'blocker',
      Findings: String(count),
    }));

  const topFilesRows = topFiles.slice(0, 50).map((t) => ({
    File: `\`${t.file}\``,
    Findings: String(t.count),
  }));

  const rulesRows = rules.map((r) => ({
    Rule: r.title,
    Severity: r.severity,
    Scope: '`app/**`, `components/**`, `public/**` (tracked)',
    Notes: r.note,
  }));

  const sampleRows = findings.slice(0, 200).map((f) => ({
    Where: `\`${f.file}:${f.line}\``,
    Rule: ruleMeta.get(f.ruleId)?.title ?? f.ruleId,
    Match: `\`${f.match}\``,
  }));

  const sections: string[] = [];
  sections.push('# UI Foundation Audit (Hard Rules)', '');
  sections.push(`**Generated at**: ${generatedAtISO}`, '');
  sections.push(
    [
      'This report enforces **hard UI foundation rules** derived from `docs/layout_grammar.md` (UI layout).',
      'Goal: a rock-solid, maintainable UI foundation by preventing **raw color literals** (hex/rgb/hsl) from leaking into UI/output code, except in explicit token or asset sources.',
      '',
      'This is intentionally stricter than `docs/UI_LAYOUT_GRAMMAR_AUDIT.md` (which is heuristic and counts “likely drift”).',
    ].join('\n'),
    '',
  );
  sections.push('## How to run', '');
  sections.push('- Regenerate this file: `npm run ui:audit:foundation`');
  sections.push('- Check (CI gate): `npm run ui:check:foundation`', '');
  sections.push('## Summary', '');
  sections.push(`- Files scanned: **${totalFiles}**`);
  sections.push(`- Findings (blockers): **${totalFindings}**`, '');
  sections.push('### Findings by rule');
  sections.push(mdTable(totalsByRuleRows, ['Rule', 'Severity', 'Findings']), '');
  sections.push('### Top files');
  sections.push(mdTable(topFilesRows, ['File', 'Findings']), '');
  sections.push('## Rules checked', '');
  sections.push(mdTable(rulesRows, ['Rule', 'Severity', 'Scope', 'Notes']), '');
  sections.push('## Findings (first 200)', '');
  sections.push(mdTable(sampleRows, ['Where', 'Rule', 'Match']), '');
  return sections.join('\n');
}

function main() {
  const args = new Set(process.argv.slice(2));
  const shouldWrite = args.has('--write');
  const shouldCheck = args.has('--check');

  const reportPath = 'docs/UI_FOUNDATION_AUDIT.md';

  // Token sources are allowed to contain raw literals; everywhere else they are treated as hard violations.
  const tokenSourceFiles = new Set<string>([
    'app/design-system.css',
    'app/globals.css',
    'app/mobile-styles.css',
    'tailwind.config.ts',
    'app/lib/constants/app-url.ts',
    'app/lib/constants/certificate-colors.ts',
    'app/lib/constants/color-tokens.ts',
  ]);

  const assetRestrictedFiles = new Set<string>(['public/manifest.json', 'public/offline.html', 'public/icon-192.svg']);

  const approvedAssetHex = new Set<string>(
    [
      '#000000',
      '#ffffff',
      '#2d2d2d',
      '#fab908',
      '#374151',
      '#ef4444',
      '#fbbf24',
      '#f59e0b',
    ].map(normalizeHex),
  );

  const rules: Rule[] = [
    {
      id: 'blocker:color-literals-outside-tokens',
      title: 'Raw color literals outside token sources (hex/rgb/hsl)',
      severity: 'blocker',
      include: (file) => !tokenSourceFiles.has(file) && !assetRestrictedFiles.has(file),
      regex: /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\(|hsla?\(/g,
      note: 'Move colors to token sources (`app/design-system.css`, Tailwind brand palette, or a dedicated constants file) and reference those tokens.',
    },
    {
      id: 'blocker:non-approved-asset-hex',
      title: 'Non-approved hex colors in restricted public assets',
      severity: 'blocker',
      include: (file) => assetRestrictedFiles.has(file),
      regex: /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g,
      note: 'Public assets may use hex, but only from the approved brand + semantic palette.',
    },
  ];

  const files = listTrackedFiles();
  const findings: Finding[] = [];

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const lines = text.split('\n');
    const lineStartOffsets = computeLineStartOffsets(lines);

    for (const rule of rules) {
      if (!rule.include(file)) continue;
      rule.regex.lastIndex = 0;
      for (const match of text.matchAll(rule.regex)) {
        const idx = match.index ?? 0;
        const line = offsetToLine(lineStartOffsets, idx);
        const matchText = match[0] ?? '';

        if (rule.id === 'blocker:non-approved-asset-hex') {
          const hex = normalizeHex(matchText);
          if (!approvedAssetHex.has(hex)) {
            findings.push({
              file,
              line,
              ruleId: rule.id,
              match: matchText,
              snippet: (lines[line - 1] ?? '').trim().slice(0, 260),
            });
          }
          continue;
        }

        findings.push({
          file,
          line,
          ruleId: rule.id,
          match: matchText,
          snippet: (lines[line - 1] ?? '').trim().slice(0, 260),
        });
      }
    }
  }

  const totalsByRule: Record<string, number> = {};
  const countsByFile = new Map<string, number>();
  for (const f of findings) {
    totalsByRule[f.ruleId] = (totalsByRule[f.ruleId] ?? 0) + 1;
    countsByFile.set(f.file, (countsByFile.get(f.file) ?? 0) + 1);
  }

  const topFiles = Array.from(countsByFile.entries())
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count);

  const markdown = formatMarkdown({
    generatedAtISO: new Date().toISOString(),
    totalFiles: files.length,
    totalFindings: findings.length,
    totalsByRule,
    topFiles,
    rules,
    findings,
  });

  if (shouldWrite) {
    writeFileSync(reportPath, markdown, 'utf8');
  }

  if (shouldCheck) {
    if (findings.length > 0) {
      console.error(`[ui-foundation-audit] Found ${findings.length} blocker finding(s). See ${reportPath}`);
      process.exit(1);
    }
    console.log('✅ UI foundation check passed (no blocker findings).');
    return;
  }

  if (!shouldWrite && !shouldCheck) {
    const findingCount = findings.length;
    console.log(
      JSON.stringify(
        {
          filesScanned: files.length,
          findings: findingCount,
          topFiles: topFiles.slice(0, 10),
        },
        null,
        2,
      ),
    );
  }
}

main();
