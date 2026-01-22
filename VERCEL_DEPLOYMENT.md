# Vercel Deployment Checklist

**Last Updated**: 2025-01-14T11:06:00.000Z  
**Current Version**: 2.0.0  
**Status**: ⚠️ Deployment needs verification

---

## 🚨 Current Issues

- Anonymous login: "Failed to create anonymous session"
- Facebook login: "Server Configuration Error"

These errors suggest either:
1. Latest code (commits with fixes) hasn't deployed yet
2. Environment variables are missing/incorrect
3. MongoDB connection issues in production

---

## ✅ Required Environment Variables for Vercel

### Authentication (CRITICAL)

Set these in Vercel → Project → Settings → Environment Variables.

**Auth.js / NextAuth**
- `AUTH_SECRET` (secret): generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: `https://amanoba.com` (or `https://www.amanoba.com` if you enforce `www`)

**Facebook OAuth** (only if Facebook login is enabled)
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET` (secret)
- `NEXT_PUBLIC_FACEBOOK_APP_ID` (same value as `FACEBOOK_APP_ID`)

### Database (CRITICAL)

**MongoDB**
- `MONGODB_URI` (secret): MongoDB Atlas connection string for the production cluster
- `DB_NAME`: the application database name (default is `amanoba`)

### Application URLs

```bash
# Base URL
NEXT_PUBLIC_APP_URL=https://amanoba.com

# Node Environment
NODE_ENV=production
```

### Optional but Recommended

**Admin**
- `ADMIN_PASSWORD` (secret): strong password for admin access (if still used)

**ImgBB**
- `IMGBB_API_KEY` (secret): API key for uploads (store only in Vercel, never in git)

**PWA Push** (if enabled)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY` (secret)
- `VAPID_SUBJECT`

**Analytics** (optional)
- `NEXT_PUBLIC_GA_ID`

---

## 🔧 Deployment Steps

### 1. Verify Latest Code is Pushed

```bash
# Check current HEAD matches origin
git log --oneline -1

# Should show:
# 869cb2c docs(learnings): Add PlayerProgression schema synchronization lesson

# If not, push:
git push origin main
```

### 2. Check Vercel Environment Variables

Go to: https://vercel.com/your-project/settings/environment-variables

**Verify these exist**:
- ✅ `AUTH_SECRET`
- ✅ `NEXTAUTH_URL` = `https://amanoba.com`
- ✅ `MONGODB_URI` (with playmass cluster)
- ✅ `FACEBOOK_APP_ID` = `1522241068777501`
- ✅ `FACEBOOK_APP_SECRET` = `36f35cfc31152fbe9fba13ab76908f4c`
- ✅ `NODE_ENV` = `production`

### 3. Trigger New Deployment

**Option A: Via Vercel Dashboard**
1. Go to your project in Vercel
2. Click "Deployments" tab
3. Click "Redeploy" on the latest deployment
4. Select "Use existing Build Cache: No"

**Option B: Via Git Push**
```bash
# Make a small change to trigger deployment
git commit --allow-empty -m "chore: trigger Vercel redeployment"
git push origin main
```

**Option C: Via Vercel CLI**
```bash
vercel --prod
```

### 4. Wait for Deployment

- Watch deployment logs for errors
- Check build completes successfully
- Verify functions deploy without errors

### 5. Test After Deployment

```bash
# Test anonymous login API
curl -X POST https://amanoba.com/api/auth/anonymous

# Should return:
# {"success":true,"credentials":{...},"player":{...}}

# Test Facebook login by visiting:
# https://amanoba.com/auth/signin
```

---

## 🔍 Debugging Production Issues

### Check Vercel Logs

1. Go to: https://vercel.com/your-project
2. Click on latest deployment
3. Click "Functions" tab
4. Look for `/api/auth/anonymous` and `/api/auth/[...nextauth]` logs
5. Check for error messages

### Common Issues

#### "Failed to create anonymous session"

**Possible Causes**:
- MongoDB URI not set or incorrect
- AUTH_SECRET not set
- Guest usernames not seeded in production DB
- Logger errors (should be fixed now)

**Fix**:
```bash
# Seed guest usernames in production DB
# You'll need to run this script against the production DB
# Provide MONGODB_URI securely (shell env or .env.local) – do not commit it.
npm run seed:guest-usernames
```

#### "Server Configuration Error" (Facebook)

**Possible Causes**:
- FACEBOOK_APP_ID or FACEBOOK_APP_SECRET not set
- AUTH_SECRET not set
- PlayerProgression validation errors (should be fixed now)

**Fix**:
- Verify all auth environment variables in Vercel
- Check MongoDB has "amanoba" brand document

---

## 📋 Pre-Deployment Checklist

Before each major deployment:

- [ ] All tests pass locally (`npm run build`)
- [ ] Environment variables documented
- [ ] Database seeded with required data (brands, games, guest usernames)
- [ ] Git commits are pushed to main
- [ ] Version number updated in `package.json`
- [ ] Documentation updated

---

## 🗄️ Database Seeding for Production

After deploying, seed production database:

```bash
# Provide production MongoDB credentials securely (shell env or .env.local)
# Do not paste secrets into documentation or commit history.

# Seed guest usernames (required for anonymous login)
npm run seed:guest-usernames

# Seed core data (brands, games, achievements, rewards)
npm run seed:core
npm run seed:achievements
npm run seed:rewards

# Verify seeding
# Check in MongoDB Atlas that data exists
```

---

## 🎯 Success Criteria

Deployment is successful when:

- ✅ Build completes without errors
- ✅ All functions deploy successfully
- ✅ Anonymous login works: https://amanoba.com/auth/signin
- ✅ Facebook login works: https://amanoba.com/auth/signin
- ✅ Games accessible after login: https://amanoba.com/games
- ✅ Dashboard loads: https://amanoba.com/dashboard
- ✅ No console errors on client
- ✅ No 500 errors in Vercel function logs

---

## 📞 Support

If issues persist:

1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Verify Facebook App settings at developers.facebook.com
4. Review LEARNINGS.md for known issues
5. Check GitHub issues for similar problems

---

**Remember**: After every code change that fixes authentication, you must:
1. Push to GitHub
2. Wait for Vercel to redeploy (or trigger manually)
3. Test both login methods
4. Check Vercel function logs for errors
