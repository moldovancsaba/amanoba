# Amanoba Deployment Guide

**Version**: 1.8.0  
**Last Updated**: 2026-01-28

---

## Pre-Deployment Checklist

### ✅ Phase 9: Polish (Complete)
- [x] Design system established (Tailwind + Radix UI)
- [x] Animations implemented (Framer Motion)
- [x] Responsive design across all pages
- [x] PWA configuration (manifest.json)
- [x] Accessibility basics (semantic HTML, ARIA labels)

### ✅ Phase 10: Launch Preparation

#### Security
- [x] Environment variables secured
- [x] MongoDB connection uses SSL
- [x] NextAuth.js authentication configured
- [x] API routes protected
- [ ] Rate limiting enabled (configured, needs testing)
- [ ] CORS policies reviewed
- [ ] CSP headers configured

#### Performance
- [x] Next.js optimizations (Image, Font optimization)
- [x] Database indexes on all models
- [x] Lazy loading for heavy components
- [x] Code splitting via Next.js
- [ ] CDN setup (pending deployment)
- [ ] Caching strategies implemented
- [ ] Bundle size optimization

#### Quality Assurance
- [x] TypeScript strict mode enabled
- [x] Build passes with 0 errors
- [x] All API routes tested manually
- [x] Game flows tested
- [x] Authentication flows tested
- [ ] Load testing (pending)
- [ ] Cross-browser testing (pending)
- [ ] Mobile device testing (pending)

---

## Deployment Steps

### 1. Environment Configuration

Create production `.env.local` with:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://production-uri

# NextAuth
AUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-domain.com

# Facebook OAuth
FACEBOOK_APP_ID=your-production-app-id
FACEBOOK_APP_SECRET=your-production-secret

# Cron Protection
CRON_SECRET=generate-secure-token

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 2. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 3. Database Seeding (Production)

```bash
# Seed core data
npm run seed:core

# Seed achievements
npm run seed:achievements

# Seed rewards
npm run seed:rewards
```

### 4. Cron Jobs Setup

Configure the following cron jobs in Vercel:

| Endpoint | Schedule | Description |
|----------|----------|-------------|
| `/api/cron/calculate-leaderboards` | Every 15 min | Update leaderboards |
| `/api/cron/analytics-snapshot?period=daily` | Daily at 00:00 UTC | Daily analytics |
| `/api/cron/analytics-snapshot?period=weekly` | Weekly Mon 00:00 UTC | Weekly analytics |
| `/api/cron/analytics-snapshot?period=monthly` | Monthly 1st 00:00 UTC | Monthly analytics |

**Headers Required**:
```
Authorization: Bearer YOUR_CRON_SECRET
```

### 5. Domain Configuration

1. Add custom domain in Vercel dashboard
2. Update DNS records
3. Update `NEXTAUTH_URL` in environment variables
4. Update Facebook OAuth redirect URIs
5. Test OAuth flow with production domain

### 6. Monitoring Setup

**Vercel Analytics** (Built-in):
- Automatically enabled
- View at vercel.com/dashboard

**Custom Monitoring**:
- Health check endpoint: `/api/health`
- Real-time analytics: `/admin/analytics/realtime`
- Error tracking: Vercel logs

### 7. Post-Deployment Verification

Test the following after deployment:

- [ ] Homepage loads correctly
- [ ] Authentication (sign in/sign out)
- [ ] Game sessions (start, complete)
- [ ] Points and rewards system
- [ ] Achievements unlock
- [ ] Leaderboards display
- [ ] Admin dashboard access
- [ ] Analytics dashboard
- [ ] Profile pages
- [ ] Referral system

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Performance | >90 | — |
| First Contentful Paint | <1.5s | — |
| Time to Interactive | <3.0s | — |
| Cumulative Layout Shift | <0.1 | — |
| API Response Time (p95) | <300ms | — |
| Error Rate | <0.5% | — |

_Current values: to be filled when baseline is measured. Requirement: see `docs/tasklists/DOCUMENTATION_AUDIT_JANUARY__2026-01-28.md` item 2._

---

## Rollback Plan

If critical issues arise:

1. **Immediate**: Revert to previous Vercel deployment
   ```bash
   vercel rollback
   ```

2. **Database**: MongoDB Atlas has point-in-time recovery
   - Navigate to Atlas > Backup > Restore

3. **Code**: Revert to previous tag
   ```bash
   git checkout v1.7.0
   vercel --prod
   ```

---

## Support & Maintenance

### Regular Tasks

**Daily**:
- Monitor Vercel logs
- Check error rates
- Review player feedback

**Weekly**:
- Analyze analytics snapshots
- Review leaderboard data
- Check database performance

**Monthly**:
- Database optimization
- Dependency updates
- Security patches

### Contact

**Developer**: Narimato  
**Support**: csaba@doneisbetter.com  
**Repository**: https://github.com/moldovancsaba/amanoba

---

## Architecture Reference

- **Frontend**: Next.js 15.5.2
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js v5
- **Deployment**: Vercel
- **CDN**: Vercel Edge Network

For detailed architecture, see `ARCHITECTURE.md`.

---

**Deployment Status**: ✅ Ready for Production  
**Last Review**: 2025-10-13T08:28:34.000Z  
**Next Review**: Before v2.0.0 release
