# Language dropdown / i18n problem — collected information

**Last updated:** 2026-02-03  
**Status:** Root cause identified and fixed (see § Root cause below). Fix is on `main` and pushed to `origin`.  
**Follow-up (same day):** Server-rendered content stayed Hungarian because `getTranslations()` in server components (landing, signin) did not receive the URL locale — fixed by calling `getTranslations({ locale, namespace: '…' })` with `locale` from `params`. English options reduced from 3 to 1: removed `en-GB` and `en-US` from supported locales; middleware redirects `/en-GB` and `/en-US` to `/en`.

---

## Root cause (2026-02-03)

**Why the main UI showed only one language and the language selector didn’t behave correctly**

- **Cause:** The layout (`app/[locale]/layout.tsx`) did **not** pass the current locale into `NextIntlClientProvider`. It only passed `messages={messages}`. The locale was taken from the URL segment (`params.locale` → `validLocale`) for loading messages and for `<html lang>`, but the **client** provider was not given `locale={validLocale}`.
- **Effect:** Client components (e.g. `LanguageSwitcher`) use `useLocale()` from next-intl. That hook reads the locale from the React context provided by `NextIntlClientProvider`. Without an explicit `locale` prop, the provider in next-intl v4 falls back to `getLocaleCached()` (which uses the `X-NEXT-INTL-LOCALE` request header set by middleware). If that header is missing or wrong (e.g. first paint, static generation, or middleware not running for that request), the context locale can be wrong or default (e.g. always `hu`). Result: the dropdown could show the wrong selected language, and the UI could always show Hungarian regardless of the URL.
- **Fix:** Pass the URL-derived locale explicitly so the client tree is always in sync with the path:
  - In `app/[locale]/layout.tsx`: use `<NextIntlClientProvider locale={validLocale} messages={messages}>` instead of `<NextIntlClientProvider messages={messages}>`.
- **Reference:** next-intl’s `NextIntlClientProvider` accepts an optional `locale`; when rendered from a Server Component it can infer locale from the request, but explicitly passing it from `params` is more reliable. See [next-intl configuration](https://next-intl.dev/docs/configuration#locale).

---

## 1. What we know about the problem

### 1.1 User-reported symptoms

| Report | Description |
|--------|-------------|
| **“Only Hungarian language available on the main UI”** | Either the dropdown showed only one option (Hungarian), or the page content stayed in Hungarian regardless of URL/locale. |
| **“URL struggles”** | Example: `https://www.amanoba.com/id/en` — URL contained two locale segments (e.g. `/id/en`, `/en-GB/ru`), leading to 404 or wrong language. |
| **“Language dropdown selector is not working”** | Unclear which of: (A) dropdown doesn’t open on click, (B) selecting a language doesn’t navigate / change language, (C) wrong or no selection is shown. |

### 1.2 Environment

- **App:** Next.js (App Router), next-intl (v4.7.0), `localePrefix: 'always'`.
- **Locales:** 11 (hu, en, ar, hi, id, pt, vi, tr, bg, pl, ru); single source: `app/lib/i18n/locales.ts`. en-GB and en-US were removed; middleware redirects them to `/en`.
- **Where the switcher is used:** Landing page header (`app/[locale]/page.tsx`), and likely elsewhere (e.g. profile).
- **Deployment:** Vercel (production); issues observed on live site (e.g. amanoba.com).

### 1.3 Current implementation (after fixes)

- **Routing:** `app/lib/i18n/routing.ts` — `defineRouting({ locales, defaultLocale: 'hu', localePrefix: 'always', localeDetection: true })`.
- **Navigation:** `app/lib/i18n/navigation.ts` — `createNavigation(routing)` exporting `Link`, `usePathname`, `useRouter`, `getPathname`, `redirect`.
- **Middleware:** Uses `createMiddleware(routing)`; redirects `/localeA/localeB` → `/{localeB}`; redirects `/{loc}/{loc}` → `/{loc}`.
- **LanguageSwitcher:** Uses `usePathname` / `useRouter` / `getPathname` from the above navigation module; `router.push(safePath, { locale: newLocale })` plus a 150 ms fallback to `window.location.href = targetPath` if the URL didn’t change.

---

## 2. What we tried

### 2.1 Implemented fixes (in order)

| # | Change | Purpose |
|---|--------|---------|
| 1 | **Shared routing + locale-aware navigation** | Single config for middleware and client; `usePathname()` returns path *without* locale (e.g. `/dashboard`), so building URLs for a new locale doesn’t produce `/id/en`. |
| 2 | **Middleware: double-locale redirect** | Paths like `/id/en` or `/en-GB/ru` redirect to the second segment only (e.g. `/en`, `/ru`) to avoid 404 and wrong content. |
| 3 | **LanguageSwitcher: next-intl navigation** | Replaced `next/navigation` with `@/app/lib/i18n/navigation` and `router.replace(pathname, { locale })` (later `router.push`) so locale switch keeps the same page. |
| 4 | **Safe path and display value** | `safePath = (typeof pathname === 'string' ? pathname : '') || '/'`; `displayLocale = locales.includes(locale) ? locale : 'hu'` so the select never gets invalid path or value. |
| 5 | **router.replace → router.push** | Use `router.push(safePath, { locale: newLocale })` in case replace had different behaviour. |
| 6 | **Select stacking / clickability** | `relative z-10` and `cursor-pointer` on the `<select>`, `z-0` on the overlay div so the dropdown isn’t covered. |
| 7 | **Full-page fallback** | After `router.push(...)`, setTimeout(150 ms): if `window.location.pathname !== targetPath`, set `window.location.href = targetPath` so language switch happens even if client nav doesn’t. |
| 8 | **Pass locale to NextIntlClientProvider (root-cause fix)** | In `app/[locale]/layout.tsx`, use `<NextIntlClientProvider locale={validLocale} messages={messages}>` so client components receive the URL locale and `useLocale()` matches the page. |

### 2.2 What we did *not* try (or only assumed)

- Replacing the native `<select>` with a custom dropdown (e.g. button + menu) to rule out overlay/click issues.
- Removing the custom arrow overlay entirely and using a plain native select to see if “dropdown doesn’t open” goes away.
- Verifying in production (Vercel) that `usePathname()` from next-intl actually returns the path *without* locale on the first paint and after nav.
- Checking whether `LanguageSwitcher` is rendered in a place where the Next.js App Router context (or next-intl provider) is missing or different (e.g. portaled UI, different layout tree).
- Checking for middleware or cookie behaviour that could immediately redirect back after a client-side locale change (e.g. `NEXT_LOCALE` cookie or `localeDetection` overriding the new URL).
- Testing with next-intl’s `<Link href="/" locale={newLocale} />` (or equivalent) instead of programmatic `router.push` to compare behaviour.

---

## 3. What failed or is still unclear

- **“Language dropdown selector is not working”** was reported *after* the above fixes. So either:
  - The failure is in production only (e.g. build/runtime difference, middleware, or cookie).
  - The failure is interaction/UI (dropdown doesn’t open or options not clickable).
  - The failure is navigation (select changes but URL/content don’t).
- **No confirmation** from the user yet on which of these it is: (A) dropdown doesn’t open, (B) selection doesn’t navigate, (C) wrong language shown.
- **150 ms fallback** could, in theory, race with client navigation (e.g. client nav completes at 200 ms and we already did a full load at 150 ms), or be too short on slow networks; no production data to confirm.

---

## 4. Assumptions about root cause

### 4.1 If “dropdown doesn’t open” or “can’t select”

- **Overlay blocking:** The custom arrow div (even with `pointer-events-none` and `z-0`) might still affect some browsers or focus behaviour so the native select doesn’t receive the click or doesn’t open.
- **Layout/stacking:** Another ancestor (e.g. header, nav) might have `overflow: hidden` or a stacking context that clips or blocks the select’s dropdown.
- **Controlled select:** In rare cases, `value={displayLocale}` with a mismatch (e.g. server/client locale mismatch at hydration) could leave the select in a bad state; we tried to avoid that with `displayLocale`.

### 4.2 If “selection doesn’t change language / URL”

- **Router context:** `useRouter()` from `createNavigation(routing)` might not be the same router instance that owns the current layout (e.g. if the component is rendered in a different tree or after a boundary that doesn’t have the App Router context).
- **next-intl internal behaviour:** The wrapped `router.push(href, { locale })` might not be applied correctly in our setup (e.g. routing config not fully in sync, or next-intl v4 expecting a different signature or usage).
- **Middleware / cookie undoing the switch:** After client-side navigation to e.g. `/hu`, the next request might be sent with a cookie or header that makes middleware redirect back to another locale (e.g. `localeDetection` + cookie winning over the URL).
- **getPathname vs actual URL:** `getPathname({ href: safePath, locale, forcePrefix: true })` might not match what middleware or next-intl expect (e.g. trailing slash, basePath, or segment order) so the fallback URL could be wrong or trigger another redirect.

### 4.3 If “only Hungarian” (content or options)

- **Content always Hungarian:** We assumed this was fixed by using the locale from the URL (middleware + next-intl) and the shared routing; if the dropdown still “doesn’t work”, the user might be stuck on a single URL (e.g. `/hu`) so they only ever see Hungarian.
- **Dropdown shows one option:** We assumed all 13 locales are rendered from `locales`; if something (e.g. CSS, conditional render, or bad locale list at runtime) hides or filters options, we didn’t verify it in production.

### 4.4 Production vs local

- **Build/runtime:** Vercel might use a different Node/runtime or env; no evidence yet that this breaks next-intl or the navigation helpers.
- **Caching / CDN:** Cached responses might serve an old bundle or wrong locale; no verification done.
- **Auth wrapper:** Middleware wraps next-intl in `auth(...)`. The order of execution (auth first, then intl) could in theory affect redirects or headers; we didn’t dig into that.

---

## 5. Suggested next steps (for debugging)

1. **Clarify symptom:** Ask user to specify: (A) dropdown doesn’t open, (B) selecting does nothing (no navigation), (C) navigates but wrong language or URL.
2. **Reproduce in production:** Open amanoba.com, open DevTools (Network + Console), change language in the dropdown, and capture: whether a request is sent, redirects, final URL, and any errors.
3. **Simplify the switcher:** Temporarily use a native `<select>` without the custom arrow overlay; if that works, the cause is overlay/layout.
4. **Try Link-based switch:** Add a simple “Switch to English” link using `<Link href="/" locale="en">` from the navigation module; if that works but the select doesn’t, the cause is programmatic `router.push` or the select handler.
5. **Inspect middleware:** Log or trace middleware for a request to e.g. `/hu` (after switching to Hungarian) to see if it redirects and why (e.g. cookie, Accept-Language).
6. **Check cookie:** After switching language, inspect `NEXT_LOCALE` (or the configured locale cookie) and confirm it matches the chosen locale and isn’t overwritten.

---

## 6. Files involved

| File | Role |
|------|------|
| `app/lib/i18n/locales.ts` | List of supported locales. |
| `app/lib/i18n/routing.ts` | `defineRouting(...)` shared by middleware and navigation. |
| `app/lib/i18n/navigation.ts` | `createNavigation(routing)` → `usePathname`, `useRouter`, `getPathname`, `Link`. |
| `middleware.ts` | Auth + next-intl `createMiddleware(routing)`; double-locale and duplicate-locale redirects. |
| `components/LanguageSwitcher.tsx` | Dropdown using navigation module + 150 ms `window.location` fallback. |
| `i18n.ts` | next-intl request config (messages, defaultLocale). |
| `app/[locale]/layout.tsx` | Locale layout; provides next-intl context. |

---

## 7. Root cause and fix

- **Detail path logic:** The course detail route embeds the language inside `courseId`, so switching locales from `/hu/courses/PRODUCTIVITY_2026_HU` tried to land on `/en/courses/PRODUCTIVITY_2026_HU` (a slug that only exists for the original locale). To avoid the inevitable 404 we had been exiting early whenever `safePath` started with `/courses/`, but that returned from `handleLanguageChange` and left the dropdown inert inside every course page.
- **Resolution:** `components/LanguageSwitcher.tsx` now rewrites `/courses/*` paths to the locale-neutral listing before pushing, keeping `router.push` and the 150 ms `window.location` fallback pointed at valid locales. The dropdown therefore remains clickable everywhere, and the fix also keeps course detail navigation safe by falling back to `/courses` rather than attempting to reuse an incompatible slug.

---

## 8. References

- next-intl routing: https://next-intl-docs.vercel.app/docs/routing/configuration  
- next-intl navigation: https://next-intl-docs.vercel.app/docs/routing/navigation  
- In-repo: `docs/i18n/I18N_SETUP.md`, `docs/product/RELEASE_NOTES.md` (v2.9.42, v2.9.43)
