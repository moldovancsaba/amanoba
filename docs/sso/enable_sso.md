# SSO Integration Guide (Amanoba)

This document describes the current Amanoba integration with `https://sso.doneisbetter.com`.

## Current User Journey

Recommended user journey for Amanoba:

1. User opens any Amanoba page.
2. User clicks a sign-in entry point.
3. Amanoba sends the user to `/{locale}/auth/signin`.
4. The sign-in page shows:
   - `Continue with Google` as the primary action
   - `Sign in another way` as the secondary action
5. The Google-first path sends the user into SSO with `provider=google`.
6. After Google and the SSO callback complete, the user returns to the page where the journey started.

This is the production behavior behind `https://www.amanoba.com/en/auth/signin`.

## Why This Flow Exists

- It removes one unnecessary provider-choice step for Google users.
- It preserves Amanoba branding on the first screen.
- It keeps SSO as the identity provider and OAuth authority.
- It returns users to the exact page they started from instead of forcing `/dashboard`.

## Implementation Summary

### 1. App-Owned Sign-In Page

File:
- `/Users/moldovancsaba/Projects/amanoba/app/[locale]/auth/signin/page.tsx`

Behavior:
- Reads `callbackUrl` from the query string.
- Defaults to `/${locale}` when `callbackUrl` is missing or invalid.
- Renders two localized buttons:
  - `auth.signInWithGoogle`
  - `auth.signInAnotherWay`

### 2. Primary Google Button

Primary button URL pattern:

```text
/api/auth/sso/login?provider=google&returnTo=<encoded callbackUrl>
```

This sends the user to Amanoba's SSO login route, which then redirects to the SSO authorization endpoint with `provider=google`.

Result:
- SSO skips the generic login chooser.
- Google starts immediately.

### 3. Secondary Generic SSO Button

Secondary button URL pattern:

```text
/api/auth/sso/login?returnTo=<encoded callbackUrl>
```

This keeps the SSO provider choice generic for cases where the user does not want Google.

### 4. Return-To Preservation

Files:
- `/Users/moldovancsaba/Projects/amanoba/app/api/auth/sso/login/route.ts`
- `/Users/moldovancsaba/Projects/amanoba/app/api/auth/sso/callback/route.ts`

Behavior:
- Amanoba accepts `returnTo` from the sign-in page.
- `returnTo` is normalized to a safe in-app path.
- Amanoba stores the intended path during the OAuth redirect.
- After the SSO callback finishes, Amanoba redirects back to that original path.

This is the key fix that prevents users from landing on the dashboard when they started somewhere else.

## Recommended Pattern for New Entry Points

Any page that links to sign-in should preserve the current page in `callbackUrl`.

Example:

```tsx
const signInHref = `/${locale}/auth/signin?callbackUrl=${encodeURIComponent(
  pathname + search
)}`;
```

Use this pattern for:
- marketing pages
- course pages
- game pages
- premium/paywall prompts
- any protected page that redirects unauthenticated users

## i18n Requirements

The sign-in buttons must not be hardcoded.

Current translation keys:
- `auth.signInWithGoogle`
- `auth.signInAnotherWay`

Files:
- `/Users/moldovancsaba/Projects/amanoba/messages/en.json`
- `/Users/moldovancsaba/Projects/amanoba/messages/en-US.json`
- `/Users/moldovancsaba/Projects/amanoba/messages/en-GB.json`
- `/Users/moldovancsaba/Projects/amanoba/messages/hu.json`
- other locale files in `/Users/moldovancsaba/Projects/amanoba/messages`

## How Amanoba Uses SSO

### Login Route

Amanoba server route:

```text
/api/auth/sso/login
```

Supported query parameters:
- `provider`: currently used for `google`
- `returnTo`: in-app page to restore after callback
- `login_hint`: optional email hint
- `prompt`: optional OAuth prompt override

### Callback Route

Amanoba server route:

```text
/api/auth/sso/callback
```

Responsibilities:
- validate OAuth callback state
- exchange code via SSO
- create/update local Amanoba session
- restore the original `returnTo` destination

## Recommended UX Rules

1. Use `Continue with Google` as the top button when Google is the most common path.
2. Keep a fallback button such as `Sign in another way`.
3. Never lose the original page location during sign-in.
4. Only force `prompt=select_account` when the user explicitly wants another Google account.
5. Keep button copy localized in every supported language.

## Related SSO Documentation

For SSO provider-side details, see:
- `/Users/moldovancsaba/Projects/sso/docs/THIRD_PARTY_INTEGRATION_GUIDE.md`
- `/Users/moldovancsaba/Projects/sso/docs/README.md`
