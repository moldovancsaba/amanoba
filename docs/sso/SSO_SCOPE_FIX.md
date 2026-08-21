# SSO Scopes — What This Provider Actually Accepts

**Corrected 2026-08-21.** An earlier version of this document stated that the `roles`
scope is "not a standard OIDC scope" and would cause `invalid_scope`, and instructed
setting `SSO_SCOPES=openid profile email`. **That was wrong**, and following it would
have removed a scope production has been sending successfully.

## Verified behaviour

Production requests `openid profile email roles` and the authorization endpoint accepts
it. Confirmed by calling `/authorize` directly with amanoba's real `client_id` and that
exact scope string:

```
scope=openid+profile+email+roles   ->  302  location: /login?oauth_request=...   (accepted)
scope=openid+profile+email+admin   ->  302  error=invalid_scope&error_description=Invalid+scopes:+admin
```

So `roles` is a registered scope on this SSO. What actually triggers `invalid_scope` is
requesting a scope the provider does not define at all — `admin` is the live example.

## The real catch: `roles` does nothing

The scope is accepted, but requesting it has **no effect on the token**. In the SSO's
ID-token builder (`lib/oauth/tokens.mjs`), role information is attached under the
**`profile`** scope, not `roles`:

- `profile` adds `name`, `updated_at`, `user_type`, and **`role`** (singular)
- there is no code path that emits a plural `roles` claim, under any scope

Consequences for this repo:

- `claims.role` is populated, and comes from `profile`.
- `claims.roles` is always `undefined`. It appears only in a development-only debug log
  in `app/api/auth/sso/callback/route.ts`, so nothing functional depends on it.
- Keeping `roles` in `SSO_SCOPES` is harmless but buys nothing. Dropping it is equally
  safe. Do not drop `profile` — that is where the role actually arrives.

## Which scopes this SSO defines

`openid`, `profile`, `email`, `offline_access`, `roles`, plus app-specific scopes for
other tenants and a machine-only `manage_permissions` that is obtainable solely through
the `client_credentials` grant and is rejected on `/authorize` by design.

Anything outside that set returns `invalid_scope`. A scope also has to be present in
this client's registered `allowed_scopes`, or it is rejected separately.

## If you see `invalid_scope`

1. Read the `error_description` — it names the offending scopes verbatim.
2. Check the scope is one the provider defines (list above).
3. Check it is in this client's `allowed_scopes` registration.

Do not "fix" it by blindly trimming scopes until the error stops; that is how a working
scope gets removed and how this document became wrong in the first place.
