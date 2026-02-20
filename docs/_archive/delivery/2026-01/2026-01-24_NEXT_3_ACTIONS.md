# Recommended Next 3 Actions by Priority

**Date**: 2026-01-24  
**Status**: 📋 RECOMMENDATIONS  
**Based on**: Current bug list, certification system progress, and business impact  
**Update (2026-01-27)**: BUG7 marked **DONE** in TASKLIST. Admin can open user profile from user list (e.g. https://www.amanoba.com/hu/profile/6970a39a4d9263663b412d96). Further work (self-view, public/private, section visibility) is captured in **Profile Visibility & Privacy** — see `docs/product/ROADMAP.md` and `docs/product/TASKLIST.md` § P1: Profile Visibility & Privacy.

---

## 🎯 Action 1: Fix Profile Pages (BUG7) - P0 CRITICAL ✅ DONE

**Priority**: P0 (Critical Bug)  
**Status**: ✅ **DONE** (2026-01-27) — Admin can open profile from user list. Remaining behaviour (self-view, public/private, section-level visibility) is in Profile Visibility & Privacy tasks (TASKLIST PV1–PV4).  
**Estimated**: 2-4 hours  
**Impact**: HIGH - Blocks all user profile access

### Why First
- **Critical bug** blocking user functionality
- Users cannot view their own or others' profiles
- Affects user experience and trust
- Quick fix likely (middleware/auth issue)

### Investigation Steps
1. Check middleware.ts - verify `/profile/[playerId]` route handling
2. Check authentication logic in `app/[locale]/profile/[playerId]/page.tsx`
3. Verify API endpoint `/api/profile/[playerId]/route.ts` is accessible
4. Test with authenticated vs unauthenticated users
5. Check if route requires authentication (should be public or optional)

### Expected Outcome
- Profile pages load correctly for all users
- Public profiles accessible without login
- Own profile accessible when logged in
- Proper error handling for invalid playerIds

### Files to Check/Modify
- `middleware.ts` - Route protection logic
- `app/[locale]/profile/[playerId]/page.tsx` - Page component
- `app/api/profile/[playerId]/route.ts` - API endpoint

---

## 🏅 Action 2: Profile Certificates Tab (CS4) - P1 HIGH

**Priority**: P1 (High Value Feature)  
**Estimated**: 1-2 days  
**Impact**: HIGH - Completes user-facing certification feature

### Why Second
- **Completes certification system** user experience (70% done, this is the missing user-facing piece)
- Leverages existing backend (Phases 1-4 complete)
- High user value - learners can see and share their certificates
- Natural next step after backend is done

### Implementation Tasks
1. Add "Certificates" tab to profile page (`app/[locale]/profile/[playerId]/page.tsx`)
2. Create certificate list component showing:
   - Course name, completion date, score
   - Certificate status (active/revoked)
   - Download button (calls `/api/certificates/[certificateId]/render`)
   - Share button (opens verification page)
3. Fetch certificates via new API endpoint (or extend existing)
4. Handle empty state (no certificates yet)
5. Add certificate detail modal/view

### Expected Outcome
- Users can view all their certificates in profile
- Download certificates as images/PDFs
- Share certificates via verification links
- Clean, intuitive UI matching profile design

### Files to Create/Modify
- `app/[locale]/profile/[playerId]/page.tsx` - Add certificates tab
- `app/components/CertificateCard.tsx` - New component (optional)
- `app/api/profile/[playerId]/certificates/route.ts` - New API endpoint (or extend existing)

### Dependencies
- ✅ Backend complete (Phases 1-4 done)
- ✅ Verification API exists (`/api/certificates/[slug]`)
- ✅ Render endpoint exists (`/api/certificates/[certificateId]/render`)

---

## 🔧 Action 3: Admin Certification Surface (CS5) - P1 HIGH

**Priority**: P1 (High Value Feature)  
**Estimated**: 2-3 days  
**Impact**: HIGH - Enables admin management of certification system

### Why Third
- **Completes admin tooling** for certification system
- Enables admins to manage, audit, and troubleshoot certificates
- Required for production operations
- Natural completion after user-facing features

### Implementation Tasks

#### API Endpoints (4 endpoints)
1. **`/api/admin/certificates`** (GET)
   - List all certificates with filters (playerId, courseId, status, date range)
   - Pagination and search
   - Include player and course details

2. **`/api/admin/certification/analytics`** (GET)
   - Total certificates issued
   - Pass/fail rates
   - Average scores
   - Certificate revocation stats
   - Time-based trends

3. **`/api/admin/certification/pools`** (GET, POST, PATCH)
   - List question pools
   - Create/edit pools
   - Pool statistics (usage, question counts)

4. **`/api/admin/certification/settings`** (GET, PATCH)
   - Global certification settings
   - Default pricing
   - Template configuration

#### Admin Pages (2-3 pages)
1. **`/admin/certificates`** - Certificate management
   - Search and filter certificates
   - View certificate details
   - Revoke/regenerate certificates
   - Export certificate data

2. **`/admin/certification/analytics`** - Analytics dashboard
   - Charts and metrics
   - Trends over time
   - Pass/fail breakdowns

3. **`/admin/certification/settings`** - Settings page (or add to existing settings)
   - Global certification configuration
   - Default pricing
   - Template management

### Expected Outcome
- Admins can search and manage all certificates
- Analytics dashboard shows certification metrics
- Question pools can be managed
- Global settings can be configured
- Complete admin control over certification system

### Files to Create
- `app/api/admin/certificates/route.ts`
- `app/api/admin/certification/analytics/route.ts`
- `app/api/admin/certification/pools/route.ts`
- `app/api/admin/certification/settings/route.ts`
- `app/[locale]/admin/certificates/page.tsx`
- `app/[locale]/admin/certification/analytics/page.tsx`
- `app/[locale]/admin/certification/settings/page.tsx` (or extend existing)

### Dependencies
- ✅ Backend complete (Phases 1-4 done)
- ✅ Certificate models exist
- ✅ Admin authentication working

---

## 📊 Summary

| Action | Priority | Time | Impact | Dependencies |
|--------|----------|------|--------|--------------|
| **BUG7: Fix Profile Pages** | P0 | 2-4h | HIGH | None |
| **CS4: Profile Certificates Tab** | P1 | 1-2d | HIGH | ✅ Backend ready |
| **CS5: Admin Certification Surface** | P1 | 2-3d | HIGH | ✅ Backend ready |

**Total Estimated Time**: 3.5-5.5 days

**Recommended Order**:
1. Fix BUG7 first (critical bug, quick win)
2. Then CS4 (completes user experience)
3. Then CS5 (completes admin tooling)

---

## 🎯 Success Criteria

### BUG7 Complete When:
- ✅ Profile pages load for all users (authenticated and public)
- ✅ No redirects to sign-in page
- ✅ Proper error handling for invalid IDs

### CS4 Complete When:
- ✅ Certificates tab visible in profile
- ✅ Users can view all their certificates
- ✅ Download and share functionality works
- ✅ Empty state handled gracefully

### CS5 Complete When:
- ✅ All 4 API endpoints working
- ✅ Admin pages functional
- ✅ Search, filter, and analytics working
- ✅ Settings can be updated

---

**Last Updated**: 2026-01-24  
**Next Action**: Fix BUG7 (Profile Pages)
