# SSO Migration Complete - Cleanup Guide

## ✅ Migration Status

The system has been successfully refactored to be **100% SSO-aligned**. All Facebook authentication code has been removed.

---

## 🧹 Database Cleanup (Optional but Recommended)

### Remove `facebookId` Field from Existing Documents

If you have existing Player documents with `facebookId` fields, you can clean them up using the migration script:

```bash
npm run migrate:remove-facebookid
```

**What it does:**
- Removes `facebookId` field from all Player documents
- Updates `authProvider: 'facebook'` to `'sso'` (if `ssoSub` exists) or `'anonymous'`
- Verifies the migration completed successfully

**Note:** This is safe to run even if no `facebookId` fields exist - it will simply report that no migration is needed.

---

## 🔐 Environment Variables Cleanup

### Remove Facebook OAuth Environment Variables

The following environment variables are **no longer needed** and can be removed from Vercel (or your deployment platform):

- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`

**How to remove in Vercel:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Delete `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`
4. Redeploy your application

**Note:** Removing these variables will not break anything - they're simply not used anymore.

---

## ✅ Verification Checklist

After cleanup, verify the following:

- [ ] Database migration script runs successfully (if needed)
- [ ] No `facebookId` fields remain in Player documents
- [ ] No `authProvider: 'facebook'` values remain
- [ ] Facebook OAuth environment variables removed from Vercel
- [ ] Application still works correctly with SSO login
- [ ] Anonymous login still works
- [ ] Admin users can access admin panel
- [ ] Regular users can access user features

---

## 📊 Current Authentication Methods

The system now supports **only**:

1. **SSO Authentication** (`authProvider: 'sso'`)
   - Users authenticate via SSO provider
   - Roles (`user` | `admin`) come from SSO token
   - Uses `ssoSub` as unique identifier

2. **Anonymous Authentication** (`authProvider: 'anonymous'`)
   - Guest users can use the platform without SSO
   - Always has `role: 'user'`
   - Can be converted to SSO account later

---

## 🎯 System State

- ✅ **100% SSO-aligned**: No Facebook authentication code
- ✅ **Two personas only**: `user` and `admin` roles
- ✅ **Clean codebase**: No obsolete authentication methods
- ✅ **Type-safe**: All TypeScript types updated

---

## 🚨 Breaking Changes

### For Existing Users

If you have existing users with `facebookId`:
- They will need to migrate to SSO
- Run the migration script to clean up `facebookId` fields
- Update `authProvider` from `'facebook'` to `'sso'` or `'anonymous'`

### For Developers

- `facebookId` field no longer exists in Player model
- `authProvider` enum changed from `'facebook' | 'sso' | 'anonymous'` to `'sso' | 'anonymous'`
- Facebook OAuth provider removed from NextAuth configuration
- All Facebook-related code removed from codebase

---

## 📝 Migration Script Usage

```bash
# Run the migration script
npm run migrate:remove-facebookid

# Expected output:
# - Count of players with facebookId
# - Number of documents updated
# - Verification that all facebookId fields are removed
# - Update of authProvider from 'facebook' to 'sso'/'anonymous'
```

---

## 🔍 Troubleshooting

### Migration Script Fails

If the migration script fails:
1. Check database connection
2. Verify you have write permissions
3. Check logs for specific error messages
4. Ensure MongoDB indexes are not blocking the update

### Users Can't Login

If users can't login after migration:
1. Verify SSO configuration is correct
2. Check that `ssoSub` is being set correctly
3. Verify `authProvider` is set to `'sso'` (not `'facebook'`)
4. Check NextAuth session includes correct role

---

## ✨ Summary

The system is now **fully aligned with SSO** and ready for production use. All Facebook authentication has been removed, and the codebase is clean and maintainable.
