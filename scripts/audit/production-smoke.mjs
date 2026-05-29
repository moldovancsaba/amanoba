#!/usr/bin/env node
/**
 * Production baseline + API auth smoke for tech audits.
 * Usage: node scripts/audit/production-smoke.mjs [--base https://www.amanoba.com]
 */
const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : process.env.AUDIT_BASE_URL || 'https://www.amanoba.com';

const ROUTES = [
  '/',
  '/robots.txt',
  '/sitemap.xml',
  '/en/auth/signin',
  '/en/courses',
  '/en/my-courses',
  '/en/practice',
  '/en/saved',
  '/en/blog',
  '/en/dashboard',
  '/en/admin',
  '/en/editor/courses',
  '/hu/courses',
  '/ar/courses',
];

const API_CHECKS = [
  { method: 'POST', path: '/api/payments/create-checkout', body: { courseId: 'AUDIT_TEST' }, expect: [401, 403] },
  { method: 'GET', path: '/api/admin/access', expect: [200, 401, 403] },
  { method: 'GET', path: '/api/editor/access', expect: [200, 401, 403] },
  { method: 'GET', path: '/api/admin/courses', expect: [401, 403] },
  { method: 'POST', path: '/api/admin/courses', body: {}, expect: [401, 403] },
  { method: 'GET', path: '/api/practice-hub', expect: [401, 403] },
  { method: 'GET', path: '/api/saved-lessons', expect: [401, 403] },
  { method: 'GET', path: '/api/friend-streaks', expect: [401, 403] },
  { method: 'GET', path: '/api/games', expect: [200, 401] },
];

function snippet(text, max = 120) {
  return String(text || '').replace(/\s+/g, ' ').slice(0, max);
}

async function fetchRoute(path, redirect = 'follow') {
  const res = await fetch(`${BASE}${path}`, { redirect, headers: { Accept: 'text/html' } });
  return { status: res.status, url: res.url, ok: res.ok };
}

async function fetchApi({ method, path, body }) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    redirect: 'manual',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: res.status, body: json ?? text, raw: text };
}

async function main() {
  console.log(`# Production smoke — ${BASE}\n`);
  console.log('## HTML routes\n');
  console.log('| Path | Status | Final URL | Pass |');
  console.log('| --- | ---: | --- | --- |');

  let htmlFails = 0;
  for (const path of ROUTES) {
    try {
      const r = await fetchRoute(path);
      const pass = r.status >= 200 && r.status < 400;
      if (!pass) htmlFails += 1;
      console.log(`| \`${path}\` | ${r.status} | ${r.url.replace(BASE, '')} | ${pass ? '✅' : '❌'} |`);
    } catch (e) {
      htmlFails += 1;
      console.log(`| \`${path}\` | ERR | ${snippet(e.message)} | ❌ |`);
    }
  }

  console.log('\n## API auth smoke (no session)\n');
  console.log('| Method | Path | Status | Expected | Pass | Snippet |');
  console.log('| --- | --- | ---: | --- | --- | --- |');

  let apiFails = 0;
  for (const check of API_CHECKS) {
    try {
      const r = await fetchApi(check);
      const pass = check.expect.includes(r.status);
      if (!pass) apiFails += 1;
      const detail = typeof r.body === 'object' ? snippet(JSON.stringify(r.body)) : snippet(r.body);
      console.log(
        `| ${check.method} | \`${check.path}\` | ${r.status} | ${check.expect.join('/')} | ${pass ? '✅' : '❌'} | ${detail} |`
      );
    } catch (e) {
      apiFails += 1;
      console.log(`| ${check.method} | \`${check.path}\` | ERR | ${check.expect.join('/')} | ❌ | ${snippet(e.message)} |`);
    }
  }

  console.log(`\n---\nHTML failures: ${htmlFails}; API failures: ${apiFails}`);
  process.exit(htmlFails + apiFails > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
