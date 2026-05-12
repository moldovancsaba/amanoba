# News Posts MVP

## Context

The `amanoba-news` automation produces a weekly release-note style summary of learner-facing Amanoba changes. The public destination is the Amanoba Blog; `/news` remains a compatibility alias for the same weekly update content.

## Scope

- Public blog index at `/[locale]/blog`
- Individual blog post pages at `/[locale]/blog/[slug]`
- Compatibility news index at `/[locale]/news`
- Compatibility news post pages at `/[locale]/news/[slug]`
- Static content source in `content/news-posts.json`
- Publisher script for automation handoff: `npm run blog:publish -- --file <post.json>`
- Locale coverage for every enabled locale from `app/lib/i18n/locales.ts`

## Content Contract

Each post stores:

- `slug`
- `publishedAt`
- `updatedAt`
- `source`
- `translations`

The `en` translation is required and acts as the fallback. The publisher script copies the fallback into every enabled locale when locale-specific copy is not provided, so the post is reachable on all enabled language routes.

## Automation Workflow

1. The automation reviews the last 7 days of shipped repository and GitHub history.
2. It writes a JSON post containing `headline`, `summary`, and `body`.
3. It runs:

```sh
npm run news:publish -- --file path/to/post.json
```

   The canonical command is now:

```sh
npm run blog:publish -- --file path/to/post.json
```

4. The script upserts the post into `content/news-posts.json`, sorted newest first.
5. The normal repo workflow commits and pushes to `origin/main`, which triggers the production deployment.

Dry-run validation is available with:

```sh
npm run news:publish -- --file path/to/post.json --dry-run
```

Canonical dry-run validation:

```sh
npm run blog:publish -- --file path/to/post.json --dry-run
```

## Public Surfaces

- The public landing header includes a `Blog` menu entry.
- The learner dashboard includes a `Blog` shortcut in the learning action grid.
- The sitemap includes `/[locale]/blog`, `/[locale]/blog/[slug]`, `/[locale]/news`, and `/[locale]/news/[slug]` for every enabled locale.

## Rollback

- Remove `content/news-posts.json`
- Remove `app/lib/news.ts`
- Remove `/[locale]/blog` routes
- Remove `/[locale]/news` routes
- Remove `blog:publish` and `news:publish` from `package.json`
- Remove the landing/dashboard blog links
- Remove blog/news URLs from `app/sitemap.ts`
