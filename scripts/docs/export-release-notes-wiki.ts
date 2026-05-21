import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { readText } from './_shared';

type ReleaseSection = {
  heading: string;
  body: string;
  dateKey: string | null;
};

type ReleaseGroup = {
  isoTimestamp: string;
  safeTimestamp: string;
  sections: ReleaseSection[];
};

function getArg(name: string, fallback: string): string {
  const prefix = `--${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

function safeTimestamp(isoTimestamp: string): string {
  return isoTimestamp.replaceAll(':', '-');
}

function extractDateFromHeading(heading: string): string | null {
  const match = heading.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  return match?.[1] ?? null;
}

function parseSections(markdown: string): ReleaseSection[] {
  const lines = markdown.split('\n');
  const sections: ReleaseSection[] = [];
  let currentHeading: string | null = null;
  let currentBody: string[] = [];

  function flush() {
    if (!currentHeading) return;
    sections.push({
      heading: currentHeading,
      body: currentBody.join('\n').trim(),
      dateKey: extractDateFromHeading(currentHeading),
    });
  }

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush();
      currentHeading = line.slice(3).trim();
      currentBody = [];
      continue;
    }
    if (currentHeading) {
      currentBody.push(line);
    }
  }

  flush();
  return sections;
}

function groupByDate(sections: ReleaseSection[]): ReleaseGroup[] {
  const byDate = new Map<string, ReleaseSection[]>();
  for (const section of sections) {
    if (!section.dateKey) continue;
    const existing = byDate.get(section.dateKey) ?? [];
    existing.push(section);
    byDate.set(section.dateKey, existing);
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, groupedSections]) => {
      const isoTimestamp = `${dateKey}T00:00:00.000Z`;
      return {
        isoTimestamp,
        safeTimestamp: safeTimestamp(isoTimestamp),
        sections: groupedSections,
      };
    });
}

function renderHome(groups: ReleaseGroup[], undatedCount: number): string {
  const lines = [
    '# Amanoba Release Notes',
    '',
    'The Amanoba GitHub wiki is the canonical release-note archive. Pages are grouped by ISO UTC date with milliseconds; each dated page uses midnight UTC for that release date.',
    '',
    '## Dated release pages',
    '',
    ...groups.map(
      (group) =>
        `- [${group.isoTimestamp}](Release-Notes-${group.safeTimestamp}) — ${group.sections.length} entr${group.sections.length === 1 ? 'y' : 'ies'}`,
    ),
  ];

  if (undatedCount > 0) {
    lines.push('', '## Legacy notes without a date', '', `- [Undated legacy notes](Release-Notes-Undated-Legacy) — ${undatedCount} entries`);
  }

  lines.push(
    '',
    '## Update workflow',
    '',
    '1. Add shipped release content to the matching dated wiki page, or create a new page named `Release-Notes-YYYY-MM-DDT00-00-00.000Z`.',
    '2. Keep the ISO UTC timestamp visible at the top of each page.',
    '3. If using the repository mirror as a migration seed, regenerate these files with `npm run release-notes:wiki:export -- --out=<wiki-worktree>` before pushing the wiki repo.',
    '',
  );

  return lines.join('\n');
}

function renderDatedPage(group: ReleaseGroup): string {
  const lines = [
    `# Release Notes ${group.isoTimestamp}`,
    '',
    `**Canonical date**: ${group.isoTimestamp}`,
    '**Product**: Amanoba',
    '',
  ];

  for (const section of group.sections) {
    lines.push(`## ${section.heading}`, '', section.body, '');
  }

  return lines.join('\n').trimEnd() + '\n';
}

function renderUndatedPage(sections: ReleaseSection[]): string {
  const lines = [
    '# Release Notes Undated Legacy',
    '',
    'These entries did not contain an ISO-style date in their heading when the wiki archive was initialized. Keep new release notes on dated wiki pages.',
    '',
  ];

  for (const section of sections) {
    lines.push(`## ${section.heading}`, '', section.body, '');
  }

  return lines.join('\n').trimEnd() + '\n';
}

async function main() {
  const source = resolve(process.cwd(), getArg('source', 'docs/product/RELEASE_NOTES.md'));
  const outDir = resolve(process.cwd(), getArg('out', 'tmp/release-notes-wiki'));
  const markdown = await readText(source);
  const sections = parseSections(markdown);
  const groups = groupByDate(sections);
  const undated = sections.filter((section) => !section.dateKey);

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const homePath = resolve(outDir, 'Home.md');
  await writeFile(homePath, renderHome(groups, undated.length), 'utf8');

  for (const group of groups) {
    const pagePath = resolve(outDir, `Release-Notes-${group.safeTimestamp}.md`);
    await mkdir(dirname(pagePath), { recursive: true });
    await writeFile(pagePath, renderDatedPage(group), 'utf8');
  }

  if (undated.length > 0) {
    await writeFile(resolve(outDir, 'Release-Notes-Undated-Legacy.md'), renderUndatedPage(undated), 'utf8');
  }

  console.log(`Exported ${groups.length} dated wiki pages and ${undated.length} undated legacy entries to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
