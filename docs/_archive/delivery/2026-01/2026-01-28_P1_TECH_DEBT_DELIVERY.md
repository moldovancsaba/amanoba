# P1 Tech Debt — Delivery Summary

**Date**: 2026-01-28  
**Ref**: ROADMAP § Tech Debt P1; TASKLIST “Recommended Next 3” #3.

---

## 1. Design system / globals alignment (gold/black); remove straggler styles

- **design-system.css**: Added `--color-heading: #141414` so heading color is a single token (aligned with brand near-black).
- **globals.css**: Replaced hardcoded `color: #141414` on h1–h4 with `color: var(--color-heading)`.
- **Certificate image routes**: Introduced `SECONDARY_HEX` in `app/lib/constants/app-url.ts` (`#2D2D2D`, aligned with design-system `--color-secondary-800` and Tailwind `brand.darkGrey`). Both certificate image routes (`app/api/profile/[playerId]/certificate/[courseId]/image/route.tsx` and `app/api/certificates/[slug]/image/route.tsx`) now use `SECONDARY_HEX` for `bgMid` instead of inline `#2d2d2d`.
- **Per-page styles**: No separate per-page CSS files duplicate gold/black; `mobile-styles.css` only overrides responsive typography/spacing and is left as-is.

---

## 2. Client debug logs (remove or gate before production)

- **components/Icon.tsx**: Removed the only remaining client `console.warn` (previously gated by `NODE_ENV === 'development'`) so the production client bundle has no console calls from app/components. Logger implementation in `app/lib/logger.ts` still uses `console.*` internally and is server-side only.

---

## 3. Facebook cleanup (remove/migrate facebookId and authProvider)

- **Player model**: Already SSO-only (`authProvider: 'sso' | 'anonymous'`, no `facebookId`). No code changes.
- **app/[locale]/data-deletion/page.tsx**:
  - “Account Information” list: “Facebook ID” → “SSO identifier”.
  - “Method 3: Facebook Disconnection” replaced with “Method 3: Revoke SSO Access” and copy updated to SSO (e.g. Google, Microsoft, organisation provider).
  - “Third-Party Data” note: “Facebook or other services” → “SSO or other third-party services”.
- **app/api/auth/anonymous/route.ts**: Comment “consistency with Facebook login” → “consistency with SSO login”.
- **docs/SSO_MIGRATION_COMPLETE.md**: Noted that data-deletion page and auth comments now use SSO wording (no Facebook copy).

**Left as-is (per SSO_MIGRATION_COMPLETE)**: Migration script `scripts/migrate-remove-facebookid.ts` and npm scripts; env var removal instructions; messages keys like `signInWithFacebook` (values already “Sign in” etc.). Optional doc updates (ENVIRONMENT_SETUP, VERCEL_DEPLOYMENT, PRODUCTION_STATUS) to remove Facebook sections can be done separately.

---

## Verification

- `npx next lint`: no new warnings.
- Build: not run in this pass; recommend `npm run build` before deploy.
- Rollback: revert this doc and the touched files; certificate routes can temporarily revert to inline `#2d2d2d` if needed.
