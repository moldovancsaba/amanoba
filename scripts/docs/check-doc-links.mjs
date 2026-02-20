import { readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { resolve, dirname, isAbsolute, normalize } from 'node:path';
import { execFileSync } from 'node:child_process';

const cwd = process.cwd();
const repoRoot = resolve(cwd);
const strictExternal = process.env.DOCS_CHECK_EXTERNAL === '1';
const includeArchive = process.env.DOCS_CHECK_INCLUDE_ARCHIVE === '1';

function listMarkdownFiles() {
  const tracked = execFileSync('git', ['ls-files', '-z', '--', 'docs/**/*.md'], {
    encoding: 'utf8',
  });
  const untracked = execFileSync(
    'git',
    ['ls-files', '--others', '--exclude-standard', '-z', '--', 'docs/**/*.md'],
    { encoding: 'utf8' }
  );

  return [...tracked.split('\0'), ...untracked.split('\0')]
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i)
    .filter((p) => includeArchive || !p.startsWith('docs/_archive/'))
    .filter((p) => existsSync(resolve(repoRoot, p)));
}

function isHttpLike(target) {
  return (
    target.startsWith('http://') ||
    target.startsWith('https://') ||
    target.startsWith('mailto:') ||
    target.startsWith('#')
  );
}

function isPathInsideRepo(absPath) {
  const normalized = normalize(absPath);
  return normalized === repoRoot || normalized.startsWith(`${repoRoot}/`);
}

function resolveTarget(filePath, target) {
  const noAnchor = target.split('#', 1)[0];
  if (!noAnchor) return null;

  if (noAnchor.startsWith('docs/')) {
    return { absPath: resolve(repoRoot, noAnchor), kind: 'repo' };
  }

  if (isAbsolute(noAnchor)) {
    return { absPath: noAnchor, kind: 'external_fs' };
  }

  const absPath = resolve(dirname(resolve(repoRoot, filePath)), noAnchor);
  return {
    absPath,
    kind: isPathInsideRepo(absPath) ? 'repo' : 'external_fs',
  };
}

function findMissingMarkdownLinks(filePath, content) {
  const missing = [];
  const mdLinkRe = /\[[^\]]+\]\(([^)]+)\)/g;
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line) continue;
    const matches = line.matchAll(mdLinkRe);
    for (const match of matches) {
      const fullTarget = (match[1] || '').trim();
      if (!fullTarget) continue;
      const target = fullTarget.split(' ', 1)[0];
      if (isHttpLike(target)) continue;

      const resolved = resolveTarget(filePath, target);
      if (!resolved) continue;
      if (existsSync(resolved.absPath)) continue;

      if (resolved.kind === 'external_fs' && !strictExternal) {
        continue;
      }

      missing.push({
        filePath,
        line: i + 1,
        ref: target,
        type: resolved.kind === 'repo' ? 'md_link' : 'md_link_external',
      });
    }
  }

  return missing;
}

function findMissingDocTokens(filePath, content) {
  const missing = [];
  const tokenRe = /(^|[^/A-Za-z0-9+.-])(docs\/[A-Za-z0-9_./-]+\.md(?:#[A-Za-z0-9_-]+)?)/g;
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line) continue;
    const matches = line.matchAll(tokenRe);
    for (const match of matches) {
      const ref = match[2];
      const noAnchor = ref.split('#', 1)[0];
      if (!existsSync(resolve(repoRoot, noAnchor))) {
        missing.push({
          filePath,
          line: i + 1,
          ref,
          type: 'doc_token',
        });
      }
    }
  }

  return missing;
}

function main() {
  const files = listMarkdownFiles();
  const missing = [];

  for (const filePath of files) {
    const absPath = resolve(repoRoot, filePath);
    const content = readFileSync(absPath, 'utf8');
    missing.push(...findMissingMarkdownLinks(filePath, content));
    missing.push(...findMissingDocTokens(filePath, content));
  }

  if (missing.length > 0) {
    console.error('❌ Broken documentation references found:');
    for (const item of missing) {
      console.error(`- ${item.filePath}:${item.line} [${item.type}] ${item.ref}`);
    }
    console.error('');
    console.error(
      'Tip: run docs migration/path fixes, then re-run `npm run docs:links:check`.'
    );
    process.exit(1);
  }

  console.log(
    `✅ Documentation links are valid (${files.length} files checked, includeArchive=${includeArchive}, strictExternal=${strictExternal}).`
  );
}

main();
