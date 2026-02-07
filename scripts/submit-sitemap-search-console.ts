/**
 * Submit sitemap to Google Search Console via the Webmasters API.
 *
 * Prerequisites:
 * 1. Create a service account in Google Cloud Console (APIs & Services > Credentials).
 * 2. Enable the "Google Search Console API" for the project.
 * 3. In Search Console, add the service account email as a user (Full permission) to the property.
 * 4. Set GOOGLE_APPLICATION_CREDENTIALS to the path of the service account JSON key,
 *    or set GSC_SERVICE_ACCOUNT_JSON to the JSON string.
 *
 * Usage:
 *   SITE_URL="https://www.amanoba.com" tsx --env-file=.env.local scripts/submit-sitemap-search-console.ts
 *   SITE_URL="sc-domain:amanoba.com" SITEMAP_URL="https://www.amanoba.com/sitemap.xml" tsx scripts/submit-sitemap-search-console.ts
 *
 * Env:
 *   SITE_URL       - GSC property (URL-prefix e.g. https://www.amanoba.com/ or domain sc-domain:amanoba.com). Default from NEXT_PUBLIC_APP_URL.
 *   SITEMAP_URL    - Full sitemap URL. Default: {SITE_URL}/sitemap.xml
 *   GOOGLE_APPLICATION_CREDENTIALS - Path to service account JSON (or GSC_SERVICE_ACCOUNT_JSON)
 *   GSC_SERVICE_ACCOUNT_JSON - Inline JSON string of service account key (alternative to file)
 *
 * Ref: https://developers.google.com/webmaster-tools/v1/sitemaps/submit
 */

const SCOPE = 'https://www.googleapis.com/auth/webmasters';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SITEMAPS_BASE = 'https://www.googleapis.com/webmasters/v3/sites';

async function getServiceAccountKey(): Promise<{
  client_email: string;
  private_key: string;
}> {
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const inline = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (inline) {
    const key = JSON.parse(inline) as { client_email?: string; private_key?: string };
    if (!key.client_email || !key.private_key) throw new Error('GSC_SERVICE_ACCOUNT_JSON must include client_email and private_key');
    return { client_email: key.client_email, private_key: key.private_key };
  }
  if (!path) {
    throw new Error('Set GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON) or GSC_SERVICE_ACCOUNT_JSON');
  }
  const fs = await import('fs/promises');
  const content = await fs.readFile(path, 'utf-8');
  const key = JSON.parse(content) as { client_email?: string; private_key?: string };
  if (!key.client_email || !key.private_key) throw new Error('Service account JSON must include client_email and private_key');
  return { client_email: key.client_email, private_key: key.private_key };
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const { SignJWT } = await import('jose');
  const { importPKCS8 } = await import('jose');
  const key = await importPKCS8(privateKey.replace(/\\n/g, '\n'), 'RS256');
  const now = Math.floor(Date.now() / 1000);
  const jwt = await new SignJWT({})
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(clientEmail)
    .setAudience(TOKEN_URL)
    .setSubject(clientEmail)
    .setClaim('scope', SCOPE)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${t}`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('No access_token in response');
  return data.access_token;
}

async function submitSitemap(siteUrl: string, feedpath: string, accessToken: string): Promise<void> {
  // Path params must be encoded: siteUrl and feedpath (sitemap URL)
  const encodedSite = encodeURIComponent(siteUrl);
  const encodedFeed = encodeURIComponent(feedpath);
  const url = `${SITEMAPS_BASE}/${encodedSite}/sitemaps/${encodedFeed}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Submit sitemap failed: ${res.status} ${t}`);
  }
}

async function main() {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.SITE_URL || 'https://www.amanoba.com').replace(/\/$/, '');
  const siteUrl = process.env.SITE_URL || `${baseUrl}/`;
  const sitemapUrl = process.env.SITEMAP_URL || `${baseUrl}/sitemap.xml`;

  console.log('Site URL (GSC property):', siteUrl);
  console.log('Sitemap URL:', sitemapUrl);

  const key = await getServiceAccountKey();
  const token = await getAccessToken(key.client_email, key.private_key);
  await submitSitemap(siteUrl, sitemapUrl, token);
  console.log('Sitemap submitted successfully to Google Search Console.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
