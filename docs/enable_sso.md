# SSO Integration Plan (sso.doneisbetter.com)

Goal: Replace Facebook login with sso.doneisbetter.com (OIDC), keep anonymous browsing for public pages, enforce roles (`admin`, `user`) for all protected UI/API paths.

Assumptions:
- Provider exposes standard OIDC endpoints (auth, token, userinfo, JWKS, issuer).
- Role claim is `roles: ["admin" | "user"]`; default to `user` if missing.
- Local logout is sufficient unless provider logout URL is confirmed.
- No downstream provider API calls needed; we do not persist access/refresh unless later required.

## Tasks
1) Provider Intake & Config
   - Collect endpoints: `authorization_endpoint`, `token_endpoint`, `userinfo_endpoint` (optional), `jwks_uri`, `issuer`, logout endpoint (if any), supported scopes.
   - Confirm role claim name/values; confirm refresh-token support.
   - Add envs: `SSO_AUTH_URL`, `SSO_TOKEN_URL`, `SSO_USERINFO_URL`, `SSO_JWKS_URL`, `SSO_ISSUER`, `SSO_CLIENT_ID`, `SSO_CLIENT_SECRET`, `SSO_REDIRECT_URI`, `SSO_SCOPES` (e.g., `openid profile email roles`).
   - Document envs in ENVIRONMENT_SETUP/README.

2) Auth Flow
   - `/auth/sso/login`: redirect with state+nonce (PKCE if required).
   - `/auth/sso/callback`: exchange code → tokens; validate ID token (sig via JWKS, iss/aud/exp/nonce). Extract `sub`, `email`, `name`, `roles`.
   - `/auth/sso/logout`: clear local session; if provider logout exists, call it.
   - Session: HTTP-only cookie with `playerId`, `email`, `role`; short-lived.

3) User Upsert & Role Mapping
   - Upsert Player by provider `sub`; sync `email`, `name`.
   - Map roles: contains `admin` → `role=admin`; else `role=user` (default).
   - Store admin flag for admin UI gating.

4) Guards & UI
   - Replace Facebook buttons with “Sign in with SSO”.
   - Middleware/guards: admin routes → admin only; protected user routes → session required; allow anonymous for public browse.
   - Preserve `returnTo` across login.

5) API Enforcement
   - Protect profile/progress to self; admin APIs require `admin`.
   - Optionally apply existing rate limiter to auth/profile/admin/progress endpoints.

6) UX & Errors
   - Friendly errors for canceled/invalid/expired login; retry link.
   - Sign-out confirmation → home redirect.
   - i18n for new SSO strings.

7) Testing
   - Unit/integration: ID token validation (good/bad sig, iss/aud/exp/nonce), role mapping, upsert logic.
   - E2E: login → protected page; admin gate; anon browse still works; logout clears access.
   - API checks: admin-only endpoints reject non-admin; profile limited to self.

## Open Items (to confirm from provider docs)
- Role claim name and values; any superadmin?
- Logout endpoint and required params (front/back-channel or RP-initiated).
- Refresh token availability/requirement for downstream API calls.
