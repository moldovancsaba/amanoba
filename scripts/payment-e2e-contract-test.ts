/**
 * Payment E2E contract test
 *
 * Verifies API contract for payment endpoints without requiring Stripe or a real session.
 * Run against a running app: BASE_URL=http://localhost:3000 npx tsx scripts/payment-e2e-contract-test.ts
 *
 * See docs/PAYMENT_E2E_TEST_PLAN.md for full E2E scenarios.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function run() {
  const results: { name: string; pass: boolean; detail?: string }[] = [];

  // 1. Unauthenticated POST create-checkout → 401
  try {
    const res = await fetch(`${BASE_URL}/api/payments/create-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: 'TEST_COURSE', premiumDurationDays: 30 }),
      redirect: 'manual',
    });
    const ok = res.status === 401;
    results.push({
      name: 'POST /api/payments/create-checkout without auth → 401',
      pass: ok,
      detail: ok ? undefined : `got ${res.status}`,
    });
  } catch (e) {
    results.push({
      name: 'POST /api/payments/create-checkout without auth → 401',
      pass: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }

  // 2. Unauthenticated POST create-checkout with empty body → still 401 (auth checked first)
  try {
    const res = await fetch(`${BASE_URL}/api/payments/create-checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      redirect: 'manual',
    });
    const ok = res.status === 401;
    results.push({
      name: 'POST /api/payments/create-checkout (empty body, no auth) → 401',
      pass: ok,
      detail: ok ? undefined : `got ${res.status}`,
    });
  } catch (e) {
    results.push({
      name: 'POST /api/payments/create-checkout (empty body, no auth) → 401',
      pass: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }

  // 3. GET success without cookies → redirect (sign-in when unauthed, or dashboard when authed + no session_id)
  try {
    const res = await fetch(`${BASE_URL}/api/payments/success`, {
      method: 'GET',
      redirect: 'manual',
    });
    const isRedirect = res.status === 302 || res.status === 307;
    const location = res.headers.get('location') || '';
    const ok =
      isRedirect &&
      (location.includes('/dashboard') || location.includes('signin') || location.includes('auth'));
    results.push({
      name: 'GET /api/payments/success (unauthed) → redirect to sign-in or dashboard',
      pass: ok,
      detail: ok ? undefined : `status=${res.status} location=${location}`,
    });
  } catch (e) {
    results.push({
      name: 'GET /api/payments/success (unauthed) → redirect to sign-in or dashboard',
      pass: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }

  const failed = results.filter((r) => !r.pass);
  for (const r of results) {
    console.log(r.pass ? '✓' : '✗', r.name, r.detail ? `(${r.detail})` : '');
  }
  if (failed.length) {
    console.error('\nContract test failed:', failed.length, 'of', results.length);
    const all404 = results.every((r) => r.detail?.includes('404'));
    if (all404) {
      console.error('Tip: 404 usually means the app is not running. Start it with: npm run dev');
    }
    process.exit(1);
  }
  console.log('\nContract test passed:', results.length);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
