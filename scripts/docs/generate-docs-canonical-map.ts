import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import {
  formatBytes,
  getDocFile,
  listGitTrackedFiles,
  mdEscapePipes,
  readText,
  writeGeneratedMarkdown,
} from './_shared';

type Action = 'KEEP' | 'MERGE' | 'ARCHIVE' | 'DELETE';

type Decision = {
  action: Action;
  reason: string;
  mergeInto?: string;
  archiveTo?: string;
};

function isDatedRootDoc(relPath: string) {
  const name = relPath.replace(/^docs\//, '');
  return (
    /^(\d{4}-\d{2}-\d{2}|\d{4}-\d{2})[._-]/.test(name) &&
    !relPath.includes('/course_runs/') &&
    !relPath.includes('/tasklists/')
  );
}

function parseDocsIndexCoreDocs(docsIndex: string) {
  const core = new Set<string>();
  const reference = new Set<string>();

  const lines = docsIndex.split('\n');
  const coreStart = lines.findIndex((l) => l.trim() === '## Core docs (source of truth)');
  const refStart = lines.findIndex((l) => l.trim() === '**Feature / reference**');
  let sectionEnd = -1;
  for (let i = Math.max(coreStart, refStart, 0) + 1; i < lines.length; i += 1) {
    if (lines[i]?.trim() === '---') {
      sectionEnd = i;
      break;
    }
  }

  const coreSlice =
    coreStart >= 0
      ? lines.slice(coreStart, refStart > coreStart ? refStart : sectionEnd > coreStart ? sectionEnd : undefined).join('\n')
      : '';
  const refSlice =
    refStart >= 0
      ? lines.slice(refStart, sectionEnd > refStart ? sectionEnd : undefined).join('\n')
      : '';

  for (const match of coreSlice.matchAll(/\*\*([A-Za-z0-9_.-]+\.md)\*\*/g)) core.add(match[1]);
  for (const match of refSlice.matchAll(/\*\*([A-Za-z0-9_.-]+\.md)\*\*/g)) reference.add(match[1]);

  return { core, reference };
}

function decide(relPath: string, coreDocs: Set<string>): Decision {
  const filename = relPath.split('/').at(-1) || relPath;

  if (relPath === 'docs/core/DOCS_INDEX.md') {
    return { action: 'KEEP', reason: 'Single entry point (canonical docs index).' };
  }

  if (relPath.startsWith('docs/canonical/')) {
    return { action: 'KEEP', reason: 'Canonical course spec (CCS).' };
  }

  if (relPath.startsWith('docs/course_ideas/')) {
    return { action: 'KEEP', reason: 'Working notes (reference-only course ideation).' };
  }

  if (relPath.startsWith('docs/course_runs/')) {
    return { action: 'KEEP', reason: 'Course run logs / execution reference.' };
  }

  if (relPath.startsWith('docs/tasklists/')) {
    return {
      action: 'ARCHIVE',
      reason: 'Generated tasklists / audit snapshots (keep for reference, not “active docs”).',
      archiveTo: 'docs/_archive/tasklists/',
    };
  }

  if (coreDocs.has(filename)) {
    return { action: 'KEEP', reason: 'Listed in DOCS_INDEX.md (core docs section).' };
  }

  if (isDatedRootDoc(relPath)) {
    return {
      action: 'ARCHIVE',
      reason: 'Dated delivery/audit doc (point-in-time reference).',
      archiveTo: `docs/_archive/delivery/${filename.slice(0, 7)}/`,
    };
  }

  if (/ copy\.md$/i.test(filename) || / copy \(\d+\)\.md$/i.test(filename)) {
    return { action: 'DELETE', reason: 'Obvious duplicate “copy” file.' };
  }

  if (/^WARP(\.DEV_AI_CONVERSATION)?\.md$/i.test(filename)) {
    return { action: 'KEEP', reason: 'Reference notes (kept but not canonical).' };
  }

  if (/^STATUS\.md$/i.test(filename)) {
    return {
      action: 'MERGE',
      reason: 'Status should live in TASKLIST/ROADMAP/RELEASE_NOTES.',
      mergeInto: 'docs/product/TASKLIST.md',
    };
  }

  if (/(PLAN|ROLLBACK_PLAN|DELIVERY_PLAN|EXECUTION_PLAN|PROGRESS_TRACKER|AUDIT|HANDOVER|SUMMARY|REPORT|CHECKLIST|RUNBOOK|PLAYBOOK)\.md$/i.test(filename)) {
    return {
      action: 'ARCHIVE',
      reason: 'Process/delivery doc; keep for context but treat as non-canonical.',
      archiveTo: 'docs/_archive/reference/',
    };
  }

  return { action: 'KEEP', reason: 'Unclassified; keep pending human review.' };
}

async function main() {
  const cwd = process.cwd();
  const docsIndexPathPrimary = resolve(cwd, 'docs', 'core', 'DOCS_INDEX.md');
  const docsIndexPathFallback = resolve(cwd, 'docs', 'DOCS_INDEX.md');
  const docsIndexPath = existsSync(docsIndexPathPrimary) ? docsIndexPathPrimary : docsIndexPathFallback;
  const docsIndex = await readText(docsIndexPath);
  const { core: coreDocs, reference: referenceDocs } = parseDocsIndexCoreDocs(docsIndex);

  const relPaths = listGitTrackedFiles(['docs/*.md', 'docs/**/*.md']).filter(
    (p) => !p.startsWith('docs/_archive/'),
  );
  const paths = relPaths.map((p) => resolve(cwd, p)).filter((p) => existsSync(p));

  const docs = (await Promise.all(paths.map(getDocFile))).sort((a, b) =>
    a.relPath.localeCompare(b.relPath),
  );

  const now = new Date().toISOString().slice(0, 10);

  const decisions = docs.map((doc) => ({
    doc,
    decision: (() => {
      const filename = doc.relPath.split('/').at(-1) || doc.relPath;
      if (referenceDocs.has(filename)) {
        return { action: 'KEEP' as const, reason: 'Listed in DOCS_INDEX.md (feature/reference section).' };
      }
      return decide(doc.relPath, coreDocs);
    })(),
  }));

  const counts = new Map<Action, number>();
  for (const { decision } of decisions) {
    counts.set(decision.action, (counts.get(decision.action) || 0) + 1);
  }

  const lines: string[] = [];
  lines.push(`# Docs Canonicalization Map`);
  lines.push('');
  lines.push(`**Last Updated**: ${now}`);
  lines.push(`**Scope**: \`docs/**/*.md\` (excluding \`docs/_archive/**\`)`);
  lines.push('');
  lines.push(`**Counts**: KEEP=${counts.get('KEEP') || 0}, MERGE=${counts.get('MERGE') || 0}, ARCHIVE=${counts.get('ARCHIVE') || 0}, DELETE=${counts.get('DELETE') || 0}`);
  lines.push('');
  lines.push('This is a *proposed* map. Apply moves/deletes only after review.');
  lines.push('');
  lines.push('| Action | Path | Title | Size | Target | Reason |');
  lines.push('|--------|------|-------|------|--------|--------|');

  for (const { doc, decision } of decisions) {
    const action = decision.action;
    const path = mdEscapePipes(doc.relPath);
    const title = mdEscapePipes(doc.title);
    const size = formatBytes(doc.sizeBytes);
    const target = mdEscapePipes(decision.mergeInto || decision.archiveTo || '—');
    const reason = mdEscapePipes(decision.reason);
    lines.push(`| ${action} | \`${path}\` | ${title} | ${size} | ${target === '—' ? '—' : `\`${target}\``} | ${reason} |`);
  }

  const outPath = resolve(cwd, 'docs', 'core', 'DOCS_CANONICAL_MAP.md');
  await writeGeneratedMarkdown(
    outPath,
    resolve(cwd, 'scripts', 'docs', 'generate-docs-canonical-map.ts'),
    lines.join('\n') + '\n',
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
