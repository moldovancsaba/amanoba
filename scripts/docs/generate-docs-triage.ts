import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { mdEscapePipes, writeGeneratedMarkdown } from './_shared';

type Row = {
  action: string;
  path: string;
  title: string;
  size: string;
  target: string;
  reason: string;
};

function parseCanonicalMap(markdown: string): Row[] {
  const rows: Row[] = [];
  const lines = markdown.split('\n');
  const tableStart = lines.findIndex((l) => l.trim() === '| Action | Path | Title | Size | Target | Reason |');
  if (tableStart === -1) return rows;

  for (let i = tableStart + 2; i < lines.length; i += 1) {
    const line = lines[i]?.trim();
    if (!line?.startsWith('|')) break;
    const parts = line.split('|').map((p) => p.trim());
    if (parts.length < 7) continue;

    const action = parts[1] || '';
    const path = (parts[2] || '').replace(/^`|`$/g, '');
    const title = parts[3] || '';
    const size = parts[4] || '';
    const target = (parts[5] || '').replace(/^`|`$/g, '');
    const reason = parts[6] || '';

    rows.push({ action, path, title, size, target: target === '—' ? '' : target, reason });
  }

  return rows;
}

function groupBy<T>(items: T[], keyFn: (item: T) => string) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    map.set(key, [...(map.get(key) || []), item]);
  }
  return map;
}

async function main() {
  const cwd = process.cwd();
  const canonicalMapPath = resolve(cwd, 'docs', 'DOCS_CANONICAL_MAP.md');
  const markdown = await readFile(canonicalMapPath, 'utf8');
  const rows = parseCanonicalMap(markdown);

  const now = new Date().toISOString().slice(0, 10);
  const deletes = rows.filter((r) => r.action === 'DELETE');
  const merges = rows.filter((r) => r.action === 'MERGE');
  const archives = rows.filter((r) => r.action === 'ARCHIVE');
  const unclassified = rows.filter((r) => r.action === 'KEEP' && r.reason.startsWith('Unclassified;'));
  const maxPerGroup = 60;

  const lines: string[] = [];
  lines.push('# Docs Triage');
  lines.push('');
  lines.push(`**Last Updated**: ${now}`);
  lines.push('');
  lines.push(`**Counts**: DELETE=${deletes.length}, MERGE=${merges.length}, ARCHIVE=${archives.length}, KEEP(unclassified)=${unclassified.length}`);
  lines.push('');
  lines.push('This file is the “what to do next” view derived from `docs/DOCS_CANONICAL_MAP.md`.');
  lines.push('');

  lines.push('## DELETE');
  if (deletes.length === 0) {
    lines.push('- —');
  } else {
    for (const r of deletes) lines.push(`- \`${r.path}\` — ${r.reason}`);
  }
  lines.push('');

  lines.push('## MERGE');
  if (merges.length === 0) {
    lines.push('- —');
  } else {
    for (const r of merges) lines.push(`- \`${r.path}\` → \`${r.target}\` — ${r.reason}`);
  }
  lines.push('');

  lines.push('## ARCHIVE (grouped by target)');
  if (archives.length === 0) {
    lines.push('- —');
  } else {
    const byTarget = groupBy(archives, (r) => r.target || '(no target)');
    const targets = [...byTarget.keys()].sort((a, b) => a.localeCompare(b));
    for (const target of targets) {
      const items = (byTarget.get(target) || []).sort((a, b) => a.path.localeCompare(b.path));
      lines.push(`### ${mdEscapePipes(target)}`);
      for (const r of items.slice(0, maxPerGroup)) lines.push(`- \`${r.path}\` — ${r.title} (${r.size})`);
      if (items.length > maxPerGroup) lines.push(`- … +${items.length - maxPerGroup} more`);
      lines.push('');
    }
  }

  lines.push('## KEEP (needs review)');
  if (unclassified.length === 0) {
    lines.push('- —');
  } else {
    const items = [...unclassified].sort((a, b) => a.path.localeCompare(b.path));
    for (const r of items.slice(0, maxPerGroup)) lines.push(`- \`${r.path}\` — ${r.title}`);
    if (items.length > maxPerGroup) lines.push(`- … +${items.length - maxPerGroup} more`);
  }
  lines.push('');

  lines.push('## Next suggested move');
  lines.push('- Create `docs/_archive/delivery/2026-01/` and `docs/_archive/tasklists/`, then move the corresponding files and update links.');
  lines.push('- After moves, rerun `npm run docs:refresh` and ensure `docs/DOCS_INDEX.md` still points to canonical docs only.');
  lines.push('');

  const outPath = resolve(cwd, 'docs', 'DOCS_TRIAGE.md');
  await writeGeneratedMarkdown(outPath, resolve(cwd, 'scripts', 'docs', 'generate-docs-triage.ts'), lines.join('\n'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
