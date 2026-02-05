import { glob } from 'glob';
import { resolve } from 'node:path';
import { getDocFile, formatBytes, mdEscapePipes, writeGeneratedMarkdown } from './_shared';

async function main() {
  const cwd = process.cwd();
  const paths = await glob('docs/**/*.md', {
    cwd,
    absolute: true,
    ignore: ['docs/_archive/**'],
    nodir: true,
  });

  const docs = (await Promise.all(paths.map(getDocFile))).sort((a, b) =>
    a.relPath.localeCompare(b.relPath),
  );

  const now = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];

  lines.push(`# Docs Inventory`);
  lines.push('');
  lines.push(`**Last Updated**: ${now}`);
  lines.push(`**Scope**: \`docs/**/*.md\` (excluding \`docs/_archive/**\`)`);
  lines.push(`**Count**: ${docs.length}`);
  lines.push('');
  lines.push('| Path | Title | Size |');
  lines.push('|------|-------|------|');

  for (const doc of docs) {
    const path = mdEscapePipes(doc.relPath);
    const title = mdEscapePipes(doc.title);
    const size = formatBytes(doc.sizeBytes);
    lines.push(`| \`${path}\` | ${title} | ${size} |`);
  }

  const outPath = resolve(cwd, 'docs', 'DOCS_INVENTORY.md');
  await writeGeneratedMarkdown(outPath, resolve(cwd, 'scripts', 'docs', 'generate-docs-inventory.ts'), lines.join('\n') + '\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
