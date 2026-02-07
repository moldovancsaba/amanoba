# Sitemap submission (GSC and Bing)

Submit the sitemap so search engines and AI crawlers discover all course and lesson view URLs.

## Google Search Console (via API)

Use the script to submit the sitemap programmatically:

```bash
npm run seo:submit-sitemap
```

Or with env:

```bash
SITE_URL="https://www.amanoba.com" SITEMAP_URL="https://www.amanoba.com/sitemap.xml" tsx --env-file=.env.local scripts/submit-sitemap-search-console.ts
```

### Setup (one-time)

1. **Google Cloud Console**: Create a [service account](https://console.cloud.google.com/iam-admin/serviceaccounts), download JSON key.
2. **Enable API**: Enable [Google Search Console API](https://console.cloud.google.com/apis/library/webmasters.googleapis.com) for the project.
3. **Search Console**: Add the property (URL-prefix `https://www.amanoba.com/` or domain `sc-domain:amanoba.com`). Add the **service account email** as a user with **Full** permission.
4. **Env**: Set one of:
   - `GOOGLE_APPLICATION_CREDENTIALS` = path to the service account JSON file, or
   - `GSC_SERVICE_ACCOUNT_JSON` = inline JSON string of the key.

Optional:

- `SITE_URL` — GSC property (default: `NEXT_PUBLIC_APP_URL` or `https://www.amanoba.com/`). For domain property use `sc-domain:amanoba.com`.
- `SITEMAP_URL` — full sitemap URL (default: `{SITE_URL}/sitemap.xml`).

Ref: [Search Console API – Sitemaps: submit](https://developers.google.com/webmaster-tools/v1/sitemaps/submit).

## Bing Webmaster Tools

### Site verification (BingSiteAuth.xml)

To verify your site in [Bing Webmaster Tools](https://www.bing.com/webmasters):

1. Add your site (e.g. `https://www.amanoba.com` or `https://amanoba.com`).
2. Choose **XML file** as the verification method and **download** the `BingSiteAuth.xml` file Bing provides.
3. Place the file in the project **`public/`** folder so it is served at the root:
   - **Path:** `public/BingSiteAuth.xml`
   - **URL:** `https://www.amanoba.com/BingSiteAuth.xml` (or your domain).
4. Deploy; then in Bing Webmaster Tools click **Verify**. The middleware skips `/BingSiteAuth.xml` so the file is served correctly.

Do **not** commit the file if it contains a secret; use a build step or env-served route instead. Otherwise, committing `public/BingSiteAuth.xml` is the usual approach.

Ref: [Bing – Add and verify site](https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b).

### Sitemap submission

Bing does not expose a simple “submit sitemap” REST API like GSC. Options:

1. **Manual**: In [Bing Webmaster Tools](https://www.bing.com/webmasters), add your site, then **Sitemaps** → submit `https://www.amanoba.com/sitemap.xml`.
2. **robots.txt**: Bing discovers the sitemap via `Sitemap: https://www.amanoba.com/sitemap.xml` in `robots.txt` (already set in `app/robots.ts`).
3. **Bing Webmaster API**: For automation you can use the [Bing Webmaster API](https://learn.microsoft.com/en-us/bingwebmaster/) (API key or OAuth) to manage site/sitemap configuration if needed.

## After submission

- **GSC**: In Search Console, **Sitemaps** should list the sitemap; indexation may take days.
- **Bing**: Similarly in Bing Webmaster Tools.
- Re-run `npm run seo:submit-sitemap` after deploying if you want to ping GSC that the sitemap URL is updated (optional; crawlers also re-fetch periodically).
