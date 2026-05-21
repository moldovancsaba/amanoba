# Release Notes Wiki

**Last updated**: 2026-05-21

The Amanoba GitHub wiki is the canonical release-note archive. It is organized as one page per release date using ISO UTC timestamps with milliseconds.

## Canonical page format

- Wiki home: `https://github.com/moldovancsaba/amanoba/wiki`
- Dated page title: `Release-Notes-YYYY-MM-DDT00-00-00.000Z`
- Visible page date: `YYYY-MM-DDT00:00:00.000Z`
- Time rule: use midnight UTC for date-only release-note entries.

Example:

```text
Release-Notes-2026-05-20T00-00-00.000Z
```

## Export workflow

The repo keeps `docs/product/RELEASE_NOTES.md` as a local mirror and migration seed for docs checks and code-review context. To regenerate wiki pages from that mirror:

```sh
npm run release-notes:wiki:export -- --out=tmp/release-notes-wiki
```

The exporter writes:

- `Home.md` — wiki index and update workflow.
- `Release-Notes-YYYY-MM-DDT00-00-00.000Z.md` — one page per dated release-note group.
- `Release-Notes-Undated-Legacy.md` — historical entries that did not contain a date in their heading.

## Publish workflow

```sh
rm -rf tmp/amanoba-wiki-publish tmp/release-notes-wiki-pages
git clone https://github.com/moldovancsaba/amanoba.wiki.git tmp/amanoba-wiki-publish
npm run release-notes:wiki:export -- --out=tmp/release-notes-wiki-pages
rsync -a --delete --exclude .git tmp/release-notes-wiki-pages/ tmp/amanoba-wiki-publish/
git -C tmp/amanoba-wiki-publish status -sb
git -C tmp/amanoba-wiki-publish add .
git -C tmp/amanoba-wiki-publish commit -m "Publish Amanoba release notes wiki"
git -C tmp/amanoba-wiki-publish push origin master
```

The GitHub wiki remote currently uses `master`, which is normal for GitHub wiki repositories.

## Source-of-truth rule

- Use the wiki for canonical published release notes.
- Keep the repo mirror aligned when release notes are referenced by docs checks, handover, or code-review context.
- New release-note wiki pages must use the ISO UTC timestamp format above.
