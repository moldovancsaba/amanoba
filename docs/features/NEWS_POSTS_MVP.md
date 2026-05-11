# News Posts MVP

## Context

The `amanoba-news` automation produces a weekly release-note style summary of learner-facing Amanoba changes. The site now needs a public destination for those updates instead of keeping them only in the automation thread.

## Scope

- Public news index at `/[locale]/news`
- Individual news post pages at `/[locale]/news/[slug]`
- Static content source in `content/news-posts.json`
- Publisher script for automation handoff: `npm run news:publish -- --file <post.json>`
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

4. The script upserts the post into `content/news-posts.json`, sorted newest first.
5. The normal repo workflow commits and pushes to `origin/main`, which triggers the production deployment.

Dry-run validation is available with:

```sh
npm run news:publish -- --file path/to/post.json --dry-run
```

## Public Surfaces

- The public landing header includes a `What's new` menu entry.
- The learner dashboard includes a `What's New` shortcut in the learning action grid.
- The sitemap includes `/[locale]/news` and each localized post URL.

## Rollback

- Remove `content/news-posts.json`
- Remove `app/lib/news.ts`
- Remove `/[locale]/news` routes
- Remove `news:publish` from `package.json`
- Remove the landing/dashboard news links
- Remove news URLs from `app/sitemap.ts`
