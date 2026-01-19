# Environment Setup Guide

**Project**: Amanoba  
**Version**: 1.0.0  
**Last Updated**: 2025-10-10T10:58:22.000Z

---

## Overview

This document provides complete instructions for setting up the Amanoba development and production environments.

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

#### Email Service (Resend)
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@amanoba.com
EMAIL_FROM_NAME=Amanoba Learning
EMAIL_REPLY_TO=support@amanoba.com
```

**What**: Resend API credentials for email delivery  
**Why**: Sends daily lesson emails, welcome emails, and course completion emails  
**Source**: Get from https://resend.com/api-keys  
**Note**: Required for course email functionality

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
   | `RESEND_API_KEY` | [Resend API key] | ✅ |
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

## Facebook App Configuration

### App Settings

1. **App Domains**: 
   - Development: `localhost`
   - Production: `amanoba.com` (or your domain)

2. **Valid OAuth Redirect URIs**:
   - Development: `http://localhost:3000/api/auth/facebook/callback`
   - Production: `https://amanoba.com/api/auth/facebook/callback`

3. **Site URL**: Your production domain

### Required Permissions
- `public_profile`
- `email`

---

## Security Best Practices

### Secrets Management

**NEVER commit** the following to version control:
- `.env.local`
- `.env.production`
- Any file containing `MONGODB_URI`
- Any file containing `FACEBOOK_APP_SECRET`
- Any file containing `VAPID_PRIVATE_KEY`
- Any file containing `ADMIN_PASSWORD`

### Secret Rotation

Rotate secrets regularly:

1. **Admin Password**: Every 90 days
2. **Facebook App Secret**: When compromised
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
| `RESEND_API_KEY` | Secret | `re_xxxxx...` | Resend API key for email delivery |
| `EMAIL_FROM` | Public | `noreply@amanoba.com` | Email sender address |
| `EMAIL_FROM_NAME` | Public | `Amanoba Learning` | Email sender name |
| `EMAIL_REPLY_TO` | Public | `support@amanoba.com` | Email reply-to address |
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
