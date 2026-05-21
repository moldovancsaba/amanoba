# Release Notes Wiki

**Last updated**: 2026-05-21

The Amanoba GitHub wiki is the intended canonical release-note archive. It is organized as one page per release date using ISO UTC timestamps with milliseconds.

As of 2026-05-21, `https://github.com/moldovancsaba/amanoba.wiki.git` still returns `Repository not found` even though the repository API reports `has_wiki: true`. The exporter and publish workflow below are ready; the remaining publish step requires GitHub to initialize or expose the wiki git repository.

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
tmpdir="$(mktemp -d)"
npm run release-notes:wiki:export -- --out="$tmpdir"
git -C "$tmpdir" init
git -C "$tmpdir" remote add origin https://github.com/moldovancsaba/amanoba.wiki.git
git -C "$tmpdir" add .
git -C "$tmpdir" commit -m "Publish Amanoba release notes wiki"
git -C "$tmpdir" push -u origin main
```

For an existing wiki checkout, regenerate into that checkout, review the diff, commit, and push.

## Source-of-truth rule

- Use the wiki for canonical published release notes once the wiki git repository accepts pushes.
- Keep the repo mirror aligned when release notes are referenced by docs checks, handover, or code-review context.
- New release-note wiki pages must use the ISO UTC timestamp format above.
