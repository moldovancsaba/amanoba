import { readFile, stat, writeFile } from 'node:fs/promises';
import { relative } from 'node:path';

export type DocFile = {
  path: string;
  relPath: string;
  basename: string;
  sizeBytes: number;
  title: string;
};

export async function readText(filePath: string) {
  return readFile(filePath, 'utf8');
}

export function generatedFileHeader(generatorRelPath: string) {
  return (
    `<!--\n` +
    `  GENERATED FILE — DO NOT EDIT BY HAND\n` +
    `  Regenerate via: node --import tsx ${generatorRelPath}\n` +
    `-->\n\n`
  );
}

export async function getDocFile(absPath: string): Promise<DocFile> {
  const fileStat = await stat(absPath);
  const text = await readText(absPath);
  const title =
    text
      .split('\n')
      .map((line) => line.trimEnd())
      .find((line) => line.startsWith('# '))?.slice(2).trim() || '';

  const relPath = relative(process.cwd(), absPath).replaceAll('\\', '/');
  const basename = relPath.split('/').at(-1) || relPath;

  return {
    path: absPath,
    relPath,
    basename,
    sizeBytes: fileStat.size,
    title: title || basename.replace(/\.md$/i, '').replaceAll('_', ' '),
  };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

export function mdEscapePipes(text: string) {
  return text.replaceAll('|', '\\|');
}

export async function writeGeneratedMarkdown(
  outPath: string,
  generatorAbsPath: string,
  content: string,
) {
  const generatorRelPath = relative(process.cwd(), generatorAbsPath).replaceAll('\\', '/');
  await writeFile(outPath, generatedFileHeader(generatorRelPath) + content, 'utf8');
}
