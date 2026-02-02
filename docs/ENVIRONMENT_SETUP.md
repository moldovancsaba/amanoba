# Environment Setup Guide

**Project**: Amanoba  
**Version**: 1.0.0  
**Last Updated**: 2026-01-28

---

## Overview

This document provides complete instructions for setting up the Amanoba development and production environments.

### Where admins configure 3rd party services

**Email, Stripe, VAPID, etc.** are configured **via environment variables**, not in the Admin UI:

- **Local**: `.env.local` (see sections below for each service).
- **Production (e.g. Vercel)**: Project Settings → Environment Variables.

The **Admin Settings** page (`/[locale]/admin/settings`) has an "Email Configuration" section with a Resend/SendGrid dropdown and From address — that section is **UI placeholder only**; it does not save or change the email provider. The app chooses the email provider via **`EMAIL_PROVIDER`** (`resend` | `smtp` | `mailgun`) and reads the corresponding env vars. To switch provider or address, update env vars and redeploy.

## Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0
- MongoDB Atlas account (using Madoku cluster)
- Facebook App (for social login)
- VAPID keys (for push notifications)

---

## Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/moldovancsaba/amanoba.git
cd amanoba
npm install
```

### 2. Environment Variables

Copy the example file and configure:

```bash
cp .env.local.example .env.local
```

### 3. Required Variables

#### MongoDB (Using Madoku Atlas Cluster)
```env
MONGODB_URI=mongodb+srv://moldovancsaba:x0OMCvaTFhSicXEb@madoku-cluster.kqamwf8.mongodb.net/amanoba?retryWrites=true&w=majority&appName=madoku-cluster
DB_NAME=amanoba
```

**What**: Connection to MongoDB Atlas  
**Why**: Stores all game data, player profiles, gamification state, and analytics  
**Source**: Madoku cluster, database name changed to "amanoba"

#### Admin Authentication
```env
ADMIN_PASSWORD=amanoba2025
```

**What**: Password for admin dashboard access  
**Why**: Secures admin panel for game management and analytics  
**Security**: Change this in production to a strong password

#### Facebook Login
```env
NEXT_PUBLIC_FACEBOOK_APP_ID=804700345578279
FACEBOOK_APP_ID=804700345578279
FACEBOOK_APP_SECRET=7adcee3e1fa1e36feb0ea81599c9c537
```

**What**: Facebook App credentials for player authentication  
**Why**: Enables social login for seamless player onboarding  
**Source**: PlayMass Facebook App  
**Note**: These are shared credentials; update for production

#### Application Configuration
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Amanoba
NODE_ENV=development
```

**What**: Base URL and app name  
**Why**: Required for OAuth redirects and branding  
**Production**: Update NEXT_PUBLIC_APP_URL to your domain

#### PWA Push Notifications
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BJutDYURhY88PRhFGkIgV0i9xrR7IvbKHg1y7TlRH_ddnJsbvkXm0Dpf51wjm5nWuIZqvB2d8h7aPM1LDWWQDVE
VAPID_PRIVATE_KEY=VkJfSJPSnNKxFpyQrKUS7lfCbzJvX0dJEoCeYo4lZX0
VAPID_SUBJECT=mailto:csaba@doneisbetter.com
```

**What**: VAPID keys for web push notifications  
**Why**: Enables push notifications for achievements, challenges, etc.  
**Source**: Generated for PlayMass on 2025-10-07  
**Generate New**: `npx web-push generate-vapid-keys`

#### Email providers

The app supports **Resend**, **SMTP** (Gmail, Mailgun SMTP, SendGrid SMTP), and **Mailgun API**. Set **`EMAIL_PROVIDER`** to `resend`, `smtp`, or `mailgun` (default: `resend`). All providers use the same sender/reply-to vars: `EMAIL_FROM`, `EMAIL_FROM_NAME`, `EMAIL_REPLY_TO`.

**Resend** (`EMAIL_PROVIDER=resend` or unset):
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@amanoba.com
EMAIL_FROM_NAME=Amanoba Learning
EMAIL_REPLY_TO=support@amanoba.com
```
**Source**: https://resend.com/api-keys

**SMTP** (`EMAIL_PROVIDER=smtp`) — Gmail, Mailgun SMTP, SendGrid SMTP, etc.:
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
# SMTP_USERNAME / SMTP_PASSWORD are accepted as aliases
EMAIL_FROM=noreply@amanoba.com
EMAIL_FROM_NAME=Amanoba Learning
EMAIL_REPLY_TO=support@amanoba.com
```
**Note**: Gmail requires an [App Password](https://support.google.com/accounts/answer/185833). Mailgun/SendGrid: use their SMTP host and credentials from their dashboard.

**Mailgun API** (`EMAIL_PROVIDER=mailgun`):
```env
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.yourdomain.com
# MAILGUN_HOST=https://api.eu.mailgun.net  # optional; default is https://api.mailgun.net
EMAIL_FROM=noreply@amanoba.com
EMAIL_FROM_NAME=Amanoba Learning
EMAIL_REPLY_TO=support@amanoba.com
```
**Source**: Mailgun dashboard → Sending → Domain & API keys

**What**: Email delivery for daily lesson emails, welcome emails, and course completion emails  
**Why**: Lets you use Resend, Gmail SMTP, Mailgun (SMTP or API), or other SMTP providers via env config

#### Payment Processing (Stripe)
```env
# Replace [YOUR_KEY] with actual keys from Stripe Dashboard
STRIPE_SECRET_KEY=[YOUR_STRIPE_SECRET_KEY]
STRIPE_PUBLISHABLE_KEY=[YOUR_STRIPE_PUBLISHABLE_KEY]
STRIPE_WEBHOOK_SECRET=[YOUR_STRIPE_WEBHOOK_SECRET]
```

**What**: Stripe API keys for payment processing  
**Why**: Enables premium course purchases and subscription management  
**Source**: Get from https://dashboard.stripe.com/apikeys (Test mode) and https://dashboard.stripe.com/webhooks (Webhook secret)  
**Note**: 
- Replace `[YOUR_STRIPE_SECRET_KEY]` with your actual key (starts with `sk_test_...` for testing or `sk_live_...` for production)
- Replace `[YOUR_STRIPE_PUBLISHABLE_KEY]` with your actual key (starts with `pk_test_...` for testing or `pk_live_...` for production)
- Replace `[YOUR_STRIPE_WEBHOOK_SECRET]` with your actual webhook secret (starts with `whsec_...`)
- Webhook secret is generated when you create a webhook endpoint in Stripe Dashboard
- **Never commit real keys to version control**

---

## Production Setup

### Vercel Deployment

1. **Connect Repository**
   ```bash
   vercel --prod
   ```

2. **Environment Variables in Vercel**

   Go to Project Settings → Environment Variables and add:

   | Variable | Value | Encrypted |
   |----------|-------|-----------|
   | `MONGODB_URI` | [MongoDB connection string] | ✅ |
   | `ADMIN_PASSWORD` | [Strong password] | ✅ |
   | `FACEBOOK_APP_SECRET` | [Facebook secret] | ✅ |
   | `VAPID_PRIVATE_KEY` | [VAPID private key] | ✅ |
   | `EMAIL_PROVIDER` | `resend` \| `smtp` \| `mailgun` | ❌ |
   | `RESEND_API_KEY` | [Resend API key] (if `EMAIL_PROVIDER=resend`) | ✅ |
   | SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | (if `EMAIL_PROVIDER=smtp`) | ✅ for pass |
   | Mailgun: `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` | (if `EMAIL_PROVIDER=mailgun`) | ✅ for key |
   | `STRIPE_SECRET_KEY` | [Stripe secret key] | ✅ |
   | `STRIPE_WEBHOOK_SECRET` | [Stripe webhook secret] | ✅ |
   | `NEXT_PUBLIC_APP_URL` | https://amanoba.com | ❌ |
   | `NEXT_PUBLIC_APP_NAME` | Amanoba | ❌ |
   | `NEXT_PUBLIC_FACEBOOK_APP_ID` | 804700345578279 | ❌ |
   | `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | [VAPID public key] | ❌ |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | [Stripe publishable key] | ❌ |
   | `VAPID_SUBJECT` | mailto:csaba@doneisbetter.com | ❌ |
   | `EMAIL_FROM` | noreply@amanoba.com | ❌ |
   | `EMAIL_FROM_NAME` | Amanoba Learning | ❌ |
   | `EMAIL_REPLY_TO` | support@amanoba.com | ❌ |

3. **Build Configuration**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Node Version: 20.x

### MongoDB Atlas Configuration

1. **Database Name**: `amanoba`
2. **Collections**: Will be created automatically by Mongoose on first connection
3. **Network Access**: Add Vercel IP ranges or allow all (0.0.0.0/0) for serverless
4. **Connection String**: Update cluster name if using different cluster

---

## SSO / Auth Configuration

Authentication uses SSO (OIDC) and anonymous sign-up. No Facebook login.

1. **Valid OAuth Redirect URIs** (from your SSO provider):
   - Development: `http://localhost:3000/api/auth/sso/callback`
   - Production: `https://www.amanoba.com/api/auth/sso/callback` (or your domain)

2. **Site URL**: Your production domain (e.g. `https://www.amanoba.com`)

See `docs/SSO_MIGRATION_COMPLETE.md` for details.

---

## Security Best Practices

### Secrets Management

**NEVER commit** the following to version control:
- `.env.local`
- `.env.production`
- Any file containing `MONGODB_URI`
- Any file containing SSO/OAuth secrets (e.g. `SSO_CLIENT_SECRET`, `NEXTAUTH_SECRET`)
- Any file containing `VAPID_PRIVATE_KEY`
- Any file containing `ADMIN_PASSWORD`

### Secret Rotation

Rotate secrets regularly:

1. **Admin Password**: Every 90 days
2. **SSO/OAuth secrets**: When compromised
3. **VAPID Keys**: When compromised
4. **MongoDB Password**: Every 180 days

### Database Security

1. **Network Access**: Restrict to known IPs when possible
2. **User Permissions**: Use principle of least privilege
3. **Connection String**: Always use encrypted connection (`mongodb+srv://`)
4. **Backups**: Daily automated backups enabled in Atlas

---

## Testing Environment Setup

For automated testing (when implemented):

```env
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/amanoba_test
ADMIN_PASSWORD=test_password
```

**Note**: Tests are currently prohibited per MVP Factory policy.

---

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoServerError: Authentication failed`
- Check username and password in connection string
- Verify network access in MongoDB Atlas
- Ensure database user has correct permissions

**Error**: `MongooseServerSelectionError: connect ETIMEDOUT`
- Check internet connection
- Verify MongoDB Atlas status
- Check Network Access IP whitelist

### Facebook Login Issues

**Error**: `Invalid OAuth redirect URI`
- Verify redirect URI in Facebook App settings
- Check `NEXT_PUBLIC_APP_URL` matches your domain
- Ensure protocol (http/https) matches

### Push Notification Issues

**Error**: `Web Push error: Unauthorized`
- Regenerate VAPID keys
- Ensure public/private key pair matches
- Verify VAPID_SUBJECT is a valid mailto: URI

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (auto version bump)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Database initialization
npm run db:init

# Database seeding
npm run db:seed
```

---

## Environment Variable Reference

### Required

| Variable | Type | Example | Description |
|----------|------|---------|-------------|
| `MONGODB_URI` | Secret | `mongodb+srv://...` | MongoDB connection string |
| `ADMIN_PASSWORD` | Secret | `secure_password` | Admin dashboard password |
| `FACEBOOK_APP_ID` | Secret | `123456789` | Facebook App ID (server) |
| `FACEBOOK_APP_SECRET` | Secret | `abc123...` | Facebook App Secret |
| `NEXT_PUBLIC_FACEBOOK_APP_ID` | Public | `123456789` | Facebook App ID (client) |
| `NEXT_PUBLIC_APP_URL` | Public | `http://localhost:3000` | Application base URL |
| `VAPID_PRIVATE_KEY` | Secret | `abc123...` | VAPID private key |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Public | `BJut...` | VAPID public key |
| `VAPID_SUBJECT` | Public | `mailto:you@example.com` | VAPID subject |
| `EMAIL_PROVIDER` | Public | `resend` | Email provider: `resend`, `smtp`, or `mailgun` |
| `RESEND_API_KEY` | Secret | `re_xxxxx...` | Resend API key (when `EMAIL_PROVIDER=resend`) |
| `EMAIL_FROM` | Public | `noreply@amanoba.com` | Email sender address (all providers) |
| `EMAIL_FROM_NAME` | Public | `Amanoba Learning` | Email sender name (all providers) |
| `EMAIL_REPLY_TO` | Public | `support@amanoba.com` | Email reply-to address (all providers) |
| `STRIPE_SECRET_KEY` | Secret | `[YOUR_STRIPE_SECRET_KEY]` | Stripe secret key (server-side, starts with `sk_live_...` or `sk_test_...`) |
| `STRIPE_PUBLISHABLE_KEY` | Public | `[YOUR_STRIPE_PUBLISHABLE_KEY]` | Stripe publishable key (client-side, starts with `pk_live_...` or `pk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Secret | `[YOUR_STRIPE_WEBHOOK_SECRET]` | Stripe webhook signing secret (starts with `whsec_...`) |

### Optional

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NEXT_PUBLIC_GA_ID` | Public | - | Google Analytics ID |
| `NODE_ENV` | Public | `development` | Environment mode |
| `DB_NAME` | Public | `amanoba` | Database name |
| `LOG_LEVEL` | Public | `info` | Logging level |
| `LOG_PRETTY` | Public | `true` | Pretty logging |
| `NEXT_PUBLIC_DEBUG_MODE` | Public | `false` | Debug mode |
| `NEXT_PUBLIC_SHOW_VERSION` | Public | `true` | Show version in UI |
| **SMTP** (when `EMAIL_PROVIDER=smtp`) | | | |
| `SMTP_HOST` | Secret | - | SMTP server host (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | Public | `587` or `465` | SMTP port |
| `SMTP_SECURE` | Public | `false` | Use TLS; set `true` for port 465 |
| `SMTP_USER` / `SMTP_USERNAME` | Secret | - | SMTP username |
| `SMTP_PASS` / `SMTP_PASSWORD` | Secret | - | SMTP password (e.g. Gmail App Password) |
| **Mailgun** (when `EMAIL_PROVIDER=mailgun`) | | | |
| `MAILGUN_API_KEY` | Secret | - | Mailgun API key |
| `MAILGUN_DOMAIN` | Public | - | Mailgun sending domain |
| `MAILGUN_HOST` | Public | `https://api.mailgun.net` | Mailgun API base URL (e.g. `https://api.eu.mailgun.net` for EU) |

---

## Contact & Support

For environment setup issues:
- Email: csaba@doneisbetter.com
- Check: LEARNINGS.md for common issues
- Review: MongoDB Atlas dashboard for connection logs

---

**Document Version**: 1.0.0  
**Maintained By**: Narimato  
**Review Cycle**: Monthly or on infrastructure changes
