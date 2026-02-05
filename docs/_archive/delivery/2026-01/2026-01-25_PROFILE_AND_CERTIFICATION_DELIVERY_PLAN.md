# Profile Page Restoration & Certification Delivery Plan

**Date Created**: 2026-01-25  
**Status**: IN PROGRESS  
**Approach**: Ultra-Safe Incremental (One Feature at a Time)  
**Purpose**: Complete handover document for continuing work at any time

---

## 🎯 Overview

This document provides a complete, handover-ready plan for:
1. **Profile Page Restoration** (8 incremental steps)
2. **Certification System Implementation** (3 isolated phases)

Both will be delivered using the safest possible approach: one small change at a time, tested after each step.

---

## 📋 Part 1: Profile Page Restoration

### Current Status

**Step 0: Minimal Version** ✅ COMPLETE
- **Commit**: `7e4c96c` - "fix: Simplify profile page to minimal working version"
- **Status**: ✅ WORKING
- **Test URL**: https://www.amanoba.com/hu/profile/69707e9104e16077f8ea9728
- **What Works**: Routing, params unwrapping, playerId display

**Step 1: Add API Call** ✅ COMPLETE
- **Commit**: `bb04b87` - "feat: Profile page Step 1 - Add API call"
- **Status**: ✅ COMPLETE (waiting for user test)
- **What Added**: API fetch, loading states, error handling, JSON display

### Remaining Steps

#### Step 2: Display Basic Profile Info (NEXT)

**Goal**: Display player name and level from API response

**File**: `app/[locale]/profile/[playerId]/page.tsx`

**Changes**:
```typescript
// Add after profileData check:
{profileData && (
  <div className="mt-4">
    <h2 className="text-2xl font-bold text-white mb-2">
      {profileData.player?.displayName || 'Unknown Player'}
    </h2>
    <p className="text-brand-white">
      Level {profileData.progression?.level || 1}
    </p>
  </div>
)}
```

**Testing Checklist**:
- [ ] Page loads without errors
- [ ] Player name displays correctly
- [ ] Level displays correctly
- [ ] Build passes (0 errors, 0 warnings)
- [ ] User tests and approves

**Rollback Command** (if needed):
```bash
git reset --hard bb04b87
git push --force
```

---

#### Step 3: Add Profile Header

**Goal**: Add full profile header with avatar, stats

**File**: `app/[locale]/profile/[playerId]/page.tsx`

**Changes**:
- Import `PlayerAvatar` component
- Add profile header section with:
  - Avatar (using PlayerAvatar component)
  - Display name
  - Premium badge (if applicable)
  - Stats row (Level, Games Played, Win Rate, Achievements)
  - XP progress bar

**Testing Checklist**:
- [ ] Header displays correctly
- [ ] Avatar shows
- [ ] Stats display correctly
- [ ] XP progress bar works
- [ ] Build passes (0 errors, 0 warnings)
- [ ] User tests and approves

---

#### Step 4: Add Tabs

**Goal**: Add tab navigation (overview, achievements, activity, payments)

**File**: `app/[locale]/profile/[playerId]/page.tsx`

**Changes**:
- Add `activeTab` state: `useState<'overview' | 'achievements' | 'activity' | 'payments'>('overview')`
- Add tab buttons section
- Add tab content sections (empty for now)
- Add conditional rendering based on `activeTab`

**Testing Checklist**:
- [ ] Tabs display correctly
- [ ] Tab switching works
- [ ] Active tab highlights correctly
- [ ] Build passes (0 errors, 0 warnings)
- [ ] User tests and approves

---

#### Step 5: Add Overview Tab Content

**Goal**: Display streaks, wallet, performance in overview tab

**File**: `app/[locale]/profile/[playerId]/page.tsx`

**Changes**:
- Add streaks display (win streak, daily streak)
- Add wallet display (conditional - only if `profileData.wallet` exists)
- Add performance stats (highest score, perfect games, avg session)

**Testing Checklist**:
- [ ] Overview tab displays correctly
- [ ] Streaks show correct data
- [ ] Wallet shows (if own profile) or hidden (if other profile)
- [ ] Performance stats display correctly
- [ ] Build passes (0 errors, 0 warnings)
- [ ] User tests and approves

---

#### Step 6: Add Achievements Tab

**Goal**: Display achievements in achievements tab

**File**: `app/[locale]/profile/[playerId]/page.tsx`

**Changes**:
- Add achievements list from `profileData.achievements.featured`
- Add achievement cards with:
  - Icon
  - Name
  - Description
  - Tier badge
  - Unlocked date

**Testing Checklist**:
- [ ] Achievements tab displays correctly
- [ ] Achievement cards show all data
- [ ] Empty state works (if no achievements)
- [ ] Build passes (0 errors, 0 warnings)
- [ ] User tests and approves

---

#### Step 7: Add Activity Tab

**Goal**: Display recent activity in activity tab

**File**: `app/[locale]/profile/[playerId]/page.tsx`

**Changes**:
- Add recent activity list from `profileData.recentActivity`
- Add activity cards with:
  - Game icon/name
  - Outcome (win/loss/draw)
  - Score
  - Points earned
  - Date/time

**Testing Checklist**:
- [ ] Activity tab displays correctly
- [ ] Activity cards show all data
- [ ] Empty state works (if no activity)
- [ ] Build passes (0 errors, 0 warnings)
- [ ] User tests and approves

---

#### Step 8: Add Payments Tab

**Goal**: Display payment history (only for own profile)

**File**: `app/[locale]/profile/[playerId]/page.tsx`

**Changes**:
- Add payment history API call (only if `isOwnProfile`)
- Add payment history display with:
  - Transaction date
  - Amount
  - Status
  - Payment method
  - Premium expiration (if applicable)

**Testing Checklist**:
- [ ] Payments tab only shows for own profile
- [ ] Payment history displays correctly
- [ ] Empty state works (if no payments)
- [ ] Build passes (0 errors, 0 warnings)
- [ ] User tests and approves

---

### Profile Page Restoration - Testing Protocol

**Before Every Commit**:
1. Run `npm run build` - must pass with 0 errors, 0 warnings
2. Test profile page manually
3. Verify no regressions in other pages (dashboard, admin, courses)

**After Every Commit**:
1. User tests the change
2. User confirms it's safe
3. Only then proceed to next step

**Red Flags (Stop Immediately)**:
- ❌ Profile page doesn't load
- ❌ Build fails
- ❌ Build has warnings
- ❌ Dashboard breaks
- ❌ Admin breaks
- ❌ Courses break

---

## 📋 Part 2: Certification System Implementation

### Phase 0: Baseline Verification ✅ COMPLETE

**Status**: ✅ COMPLETE
- **Tag**: `certification-baseline-20260125-170306`
- **Documentation**: `docs/_archive/delivery/2026-01/2026-01-25_CERTIFICATION_BASELINE_VERIFICATION.md`
- **Patterns Documented**: All code patterns documented

**Rollback Command**:
```bash
git reset --hard certification-baseline-20260125-170306
git push --force
```

---

### Phase 1: Isolated API Routes (NEW FILES ONLY)

**Goal**: Create certificate API routes without touching existing code

**Approach**: 100% NEW FILES ONLY - Zero risk to existing code

#### Route 1.1: Certificate Verification API

**File**: `app/api/certificates/[slug]/route.ts` (NEW FILE)

**Purpose**: Public certificate verification and privacy toggle

**Implementation**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Certificate, Course } from '@/lib/models';
import { logger } from '@/lib/logger';
import { auth } from '@/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET: Fetch certificate by verification slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    
    const certificate = await Certificate.findOne({ verificationSlug: slug }).lean();
    
    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }
    
    // Privacy check: if private, only owner can view
    const session = await auth();
    const currentUserId = session?.user?.id;
    const isOwner = certificate.playerId === currentUserId;
    
    if (!certificate.isPublic && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' }, // Don't reveal it exists
        { status: 404 }
      );
    }
    
    // Enrich with course info
    const course = await Course.findOne({ courseId: certificate.courseId })
      .select('name description language')
      .lean();
    
    return NextResponse.json({
      success: true,
      certificate: {
        certificateId: certificate.certificateId,
        courseId: certificate.courseId,
        courseTitle: certificate.courseTitle,
        courseName: course?.name,
        playerName: certificate.playerName,
        score: certificate.finalExamScorePercentInteger,
        issuedAt: certificate.issuedAtISO,
        revokedAt: certificate.revokedAtISO,
        isRevoked: certificate.isRevoked,
        isPublic: certificate.isPublic,
        verificationSlug: certificate.verificationSlug,
        locale: certificate.locale,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch certificate');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificate' },
      { status: 500 }
    );
  }
}

// PATCH: Toggle privacy (owner only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    const { slug } = await params;
    const { isPublic } = await request.json();
    
    const certificate = await Certificate.findOne({ verificationSlug: slug });
    
    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }
    
    // Only owner can toggle privacy
    if (certificate.playerId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    certificate.isPublic = isPublic;
    await certificate.save();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Failed to update certificate privacy');
    return NextResponse.json(
      { success: false, error: 'Failed to update certificate' },
      { status: 500 }
    );
  }
}
```

**Testing Checklist**:
- [ ] Create file (NEW FILE ONLY)
- [ ] Test GET with valid slug
- [ ] Test GET with invalid slug (404)
- [ ] Test GET with private certificate (404 for non-owner)
- [ ] Test PATCH to toggle privacy (owner only)
- [ ] Test PATCH unauthorized (401)
- [ ] Test PATCH forbidden (403)
- [ ] Verify build passes (0 errors, 0 warnings)
- [ ] Verify no impact on existing routes
- [ ] User testing required before proceeding

**Rollback Command** (if needed):
```bash
git rm app/api/certificates/[slug]/route.ts
git commit -m "revert: Remove certificate verification API"
git push
```

---

#### Route 1.2: Certificate Render API

**File**: `app/api/certificates/[certificateId]/render/route.tsx` (NEW FILE - NOTE: .tsx extension)

**Purpose**: Generate certificate image (PNG) for sharing/downloading

**CRITICAL REQUIREMENTS**:
- File extension MUST be `.tsx` (for JSX support)
- MUST declare `export const runtime = 'nodejs'` (ImageResponse requires Node.js)
- MUST declare `export const dynamic = 'force-dynamic'`

**Implementation**:
```typescript
import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import connectDB from '@/lib/mongodb';
import { Certificate } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs'; // CRITICAL: Required for ImageResponse
export const dynamic = 'force-dynamic'; // CRITICAL: Required for dynamic rendering

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    await connectDB();
    const { certificateId } = await params;
    const { searchParams } = new URL(request.url);
    const variant = searchParams.get('variant') || 'share_1200x627';
    
    const certificate = await Certificate.findOne({ certificateId }).lean();
    
    if (!certificate) {
      return new Response('Certificate not found', { status: 404 });
    }
    
    // Dimensions based on variant
    const dimensions = variant === 'print_a4' 
      ? { width: 1200, height: 1697 } // A4 ratio
      : { width: 1200, height: 627 }; // LinkedIn ratio
    
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            color: 'white',
            fontFamily: 'system-ui',
            padding: '60px',
          }}
        >
          <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
            Certificate of Completion
          </div>
          <div style={{ fontSize: '36px', marginBottom: '40px' }}>
            {certificate.courseTitle}
          </div>
          <div style={{ fontSize: '32px', marginBottom: '20px' }}>
            Awarded to: {certificate.playerName}
          </div>
          <div style={{ fontSize: '28px', marginBottom: '20px' }}>
            Score: {certificate.finalExamScorePercentInteger}%
          </div>
          <div style={{ fontSize: '24px', color: '#888' }}>
            Issued: {new Date(certificate.issuedAtISO).toLocaleDateString()}
          </div>
          {certificate.isRevoked && (
            <div style={{ fontSize: '32px', color: '#ff4444', marginTop: '20px' }}>
              REVOKED
            </div>
          )}
        </div>
      ),
      dimensions
    );
  } catch (error) {
    logger.error({ error }, 'Failed to render certificate');
    return new Response('Failed to render certificate', { status: 500 });
  }
}
```

**Testing Checklist**:
- [ ] Create file with `.tsx` extension (NEW FILE ONLY)
- [ ] Verify `export const runtime = 'nodejs'` is present
- [ ] Verify `export const dynamic = 'force-dynamic'` is present
- [ ] Test GET with valid certificateId
- [ ] Test GET with invalid certificateId (404)
- [ ] Verify image dimensions are correct
- [ ] Verify build passes (0 errors, 0 warnings)
- [ ] Verify no impact on existing routes
- [ ] User testing required before proceeding

**Rollback Command** (if needed):
```bash
git rm app/api/certificates/[certificateId]/render/route.tsx
git commit -m "revert: Remove certificate render API"
git push
```

---

#### Route 1.3: Profile Certificates API

**File**: `app/api/profile/[playerId]/certificates/route.ts` (NEW FILE)

**Purpose**: List all certificates for a player (for profile display)

**Implementation**:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Certificate, Course } from '@/lib/models';
import { logger } from '@/lib/logger';
import { auth } from '@/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    await connectDB();
    const { playerId } = await params;
    
    // Authorization: anyone can view (certificates are public via verification slug)
    // But we can add session check if needed for future features
    
    const certificates = await Certificate.find({ playerId })
      .sort({ issuedAtISO: -1 })
      .lean();
    
    // Enrich with course info
    const courseIds = [...new Set(certificates.map(c => c.courseId))];
    const courses = await Course.find({ courseId: { $in: courseIds } })
      .select('courseId name language')
      .lean();
    
    const courseMap = new Map(courses.map(c => [c.courseId, c]));
    
    const enrichedCertificates = certificates.map(cert => ({
      certificateId: cert.certificateId,
      courseId: cert.courseId,
      courseTitle: cert.courseTitle,
      courseName: courseMap.get(cert.courseId)?.name,
      score: cert.finalExamScorePercentInteger,
      issuedAt: cert.issuedAtISO,
      verificationSlug: cert.verificationSlug,
      isPublic: cert.isPublic ?? true,
      isRevoked: cert.isRevoked ?? false,
      revokedAt: cert.revokedAtISO,
      locale: cert.locale || 'en',
    }));
    
    return NextResponse.json({
      success: true,
      certificates: enrichedCertificates,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch certificates');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
```

**Testing Checklist**:
- [ ] Create file (NEW FILE ONLY)
- [ ] Test GET with valid playerId
- [ ] Test GET with invalid playerId (empty array)
- [ ] Verify certificates are sorted by date (newest first)
- [ ] Verify build passes (0 errors, 0 warnings)
- [ ] Verify no impact on existing routes
- [ ] User testing required before proceeding

**Rollback Command** (if needed):
```bash
git rm app/api/profile/[playerId]/certificates/route.ts
git commit -m "revert: Remove profile certificates API"
git push
```

---

### Phase 2: Isolated Frontend Page (NEW FILES ONLY)

**Goal**: Create certificate verification page without touching existing pages

**Approach**: 100% NEW FILES ONLY - Zero risk to existing pages

#### Page 2.1: Certificate Verification Page

**File**: `app/[locale]/certificate/[slug]/page.tsx` (NEW FILE)

**Purpose**: Public certificate verification and display page

**Implementation**:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { LocaleLink } from '@/components/LocaleLink';
import { CheckCircle, XCircle, ExternalLink, Download, Copy } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CertificateData {
  certificateId: string;
  courseId: string;
  courseTitle: string;
  courseName?: string;
  playerName: string;
  score: number;
  issuedAt: string;
  revokedAt?: string;
  isRevoked: boolean;
  isPublic: boolean;
  verificationSlug: string;
  locale: string;
}

export default function CertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations('certificates');
  
  // Unwrap params
  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (error) {
        console.error('Failed to unwrap params:', error);
        if (typeof window !== 'undefined') {
          const pathParts = window.location.pathname.split('/');
          const certIndex = pathParts.findIndex(part => part === 'certificate');
          if (certIndex !== -1 && pathParts[certIndex + 1]) {
            setSlug(pathParts[certIndex + 1]);
          }
        }
      }
    };
    loadParams();
  }, [params]);
  
  // Fetch certificate
  const { data, isLoading, error } = useQuery<{ success: boolean; certificate: CertificateData }>({
    queryKey: ['certificate', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug');
      const res = await fetch(`/api/certificates/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: !!slug,
  });
  
  // Check if owner
  const user = session?.user as { id?: string; playerId?: string } | undefined;
  const currentUserId = user?.playerId || user?.id;
  const isOwner = data?.certificate && currentUserId === data.certificate.certificateId.split('_')[0]; // Extract playerId from certificateId
  
  // Toggle privacy
  const togglePrivacy = async () => {
    if (!slug || !data?.certificate) return;
    
    try {
      const res = await fetch(`/api/certificates/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !data.certificate.isPublic }),
      });
      
      if (res.ok) {
        // Refetch
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to toggle privacy:', error);
    }
  };
  
  // Copy verification link
  const copyLink = () => {
    if (typeof window !== 'undefined' && slug) {
      const url = `${window.location.origin}/${locale}/certificate/${slug}`;
      navigator.clipboard.writeText(url);
      // Could add toast notification here
    }
  };
  
  // Download image
  const downloadImage = () => {
    if (data?.certificate) {
      const url = `/api/certificates/${data.certificate.certificateId}/render`;
      window.open(url, '_blank');
    }
  };
  
  if (isLoading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="text-brand-white text-xl">{t('loadingCertificate')}</div>
      </div>
    );
  }
  
  if (error || !data?.success || !data.certificate) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="page-card-dark p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('certificateNotFound')}</h2>
          <p className="text-gray-400 mb-6">{t('certificateNotFoundDescription')}</p>
          <LocaleLink href="/" className="inline-block bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold">
            {t('backToHome')}
          </LocaleLink>
        </div>
      </div>
    );
  }
  
  const cert = data.certificate;
  
  return (
    <div className="page-shell p-6">
      <div className="max-w-4xl mx-auto">
        <div className="page-card-dark rounded-2xl p-8">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-6">
            {cert.isRevoked ? (
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="w-6 h-6" />
                <span className="font-bold">{t('certificateRevoked')}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-6 h-6" />
                <span className="font-bold">{t('certificateVerified')}</span>
              </div>
            )}
            
            {/* Owner Actions */}
            {isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={togglePrivacy}
                  className="bg-brand-darkGrey text-white px-4 py-2 rounded-lg text-sm"
                >
                  {cert.isPublic ? t('makePrivate') : t('makePublic')}
                </button>
              </div>
            )}
          </div>
          
          {/* Certificate Content */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">{cert.courseTitle}</h1>
            <p className="text-2xl text-brand-white mb-6">{t('awardedTo')} {cert.playerName}</p>
            <div className="text-3xl font-bold text-brand-accent mb-4">
              {t('finalExamScore')}: {cert.score}%
            </div>
            <p className="text-gray-400">
              {t('issued')}: {new Date(cert.issuedAt).toLocaleDateString()}
            </p>
            {cert.isRevoked && cert.revokedAt && (
              <p className="text-red-400 mt-2">
                {t('revoked')}: {new Date(cert.revokedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={copyLink}
              className="bg-brand-accent text-brand-black px-6 py-3 rounded-lg font-bold flex items-center gap-2"
            >
              <Copy className="w-5 h-5" />
              {t('copyLink')}
            </button>
            <button
              onClick={downloadImage}
              className="bg-brand-darkGrey text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              {t('downloadImage')}
            </button>
          </div>
          
          {/* Verification Info */}
          <div className="mt-8 p-4 bg-brand-black/40 rounded-lg">
            <p className="text-gray-400 text-sm">{t('verificationInfo')}</p>
            <p className="text-gray-500 text-xs mt-2">
              {t('certificateId')}: {cert.certificateId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Testing Checklist**:
- [ ] Create file (NEW FILE ONLY)
- [ ] Test page with valid slug
- [ ] Test page with invalid slug (404 message)
- [ ] Test privacy toggle (owner only)
- [ ] Test copy link functionality
- [ ] Test download image functionality
- [ ] Verify build passes (0 errors, 0 warnings)
- [ ] Verify no impact on existing pages
- [ ] User testing required before proceeding

**Rollback Command** (if needed):
```bash
git rm app/[locale]/certificate/[slug]/page.tsx
git commit -m "revert: Remove certificate verification page"
git push
```

---

### Phase 3: Profile Integration (OPTIONAL - SKIPPED FOR NOW)

**Goal**: Add certificate viewing to profile page

**Status**: SKIPPED (Ultra-Safe Approach)
**Reason**: Certificates work via direct URL only - zero risk to existing code

**Future**: Can be added later after Phases 1 & 2 are proven stable

---

## 🔄 Delivery Order

### Recommended Sequence

1. **Profile Page Restoration** (Steps 2-8)
   - Complete profile page first
   - Establish working pattern
   - Then add certificates to profile (if desired)

2. **Certification Phase 1** (Routes 1.1, 1.2, 1.3)
   - Create all 3 API routes
   - Test each independently
   - User tests each route

3. **Certification Phase 2** (Page 2.1)
   - Create certificate verification page
   - Test independently
   - User tests page

4. **Certification Phase 3** (Optional)
   - Add certificates tab to profile
   - Only if Phases 1 & 2 are stable

---

## 🛡️ Safety Mechanisms

### Mandatory Testing Protocol

**Before EVERY Commit**:
1. Run `npm run build` - must pass with 0 errors, 0 warnings
2. Test affected functionality manually
3. Verify no regressions in core pages (dashboard, admin, courses)

**After EVERY Commit**:
1. User tests the change
2. User confirms it's safe
3. Only then proceed to next step

### Incremental Commits

**Rule**: One logical change per commit

**Example**:
- Commit 1: Step 2 - Display basic profile info (test, verify)
- Commit 2: Step 3 - Add profile header (test, verify)
- Commit 3: Route 1.1 - Certificate verification API (test, verify)

**NEVER**: Multiple features in one commit

### Rollback Checkpoints

**Before starting each phase/step**:
- Tag current commit: `git tag profile-step-X-start` or `git tag cert-phase-X-start`
- Document rollback command in this document

**If ANY issue**:
- Immediately rollback
- Document the issue
- Fix the approach
- Restart from checkpoint

### Red Flags - Stop Immediately

**If ANY of these occur, STOP and rollback**:

- ❌ Dashboard doesn't load
- ❌ Admin panel doesn't load
- ❌ Courses don't show
- ❌ Profile page doesn't load (after Step 2+)
- ❌ Build fails
- ❌ Build has warnings
- ❌ Any existing functionality breaks
- ❌ Console errors appear
- ❌ TypeScript errors
- ❌ ESLint errors

**Response**: Immediate rollback, document issue, fix approach, restart

---

## 📝 Documentation Updates

**After Each Step/Phase**:
- [ ] Update this document with completion status
- [ ] Update `docs/_archive/delivery/2026-01/2026-01-25_PROFILE_PAGE_RESTORATION_LOG.md`
- [ ] Update `docs/_archive/delivery/2026-01/2026-01-25_CERTIFICATION_IMPLEMENTATION_LOG.md`
- [ ] Update `docs/TASKLIST.md` (if applicable)
- [ ] Update `docs/RELEASE_NOTES.md` (after completion)

---

## 🎯 Success Criteria

### Profile Page Restoration

**Profile page is "done" when**:
1. ✅ All 8 steps complete
2. ✅ Profile displays all data correctly
3. ✅ All tabs work
4. ✅ Own profile shows wallet/payments
5. ✅ Other profiles show public data only
6. ✅ Build passes (0 errors, 0 warnings)
7. ✅ No regressions in other pages
8. ✅ User approves

### Certification System

**Certification is "done" when**:
1. ✅ All 3 API routes work independently
2. ✅ Certificate verification page works
3. ✅ (Optional) Certificates visible in profile
4. ✅ Dashboard works perfectly
5. ✅ Admin panel works perfectly
6. ✅ Courses work perfectly
7. ✅ Profile works perfectly
8. ✅ Build passes (0 errors, 0 warnings)
9. ✅ No regressions in existing functionality
10. ✅ All documentation updated

---

## 🔑 Key Principles

1. **Isolation First**: New features must work alone before integration
2. **Incremental Changes**: One small change at a time
3. **Test Everything**: After every single change
4. **Rollback Ready**: Always know how to rollback
5. **Match Patterns**: Study and match existing code patterns
6. **No Assumptions**: Verify everything, assume nothing
7. **Document Everything**: Every change, every test, every issue
8. **User Approval**: User tests and approves before proceeding

---

## 📚 Reference Documents

- **Baseline Verification**: `docs/_archive/delivery/2026-01/2026-01-25_CERTIFICATION_BASELINE_VERIFICATION.md`
- **Stabilization Plan**: `docs/_archive/delivery/2026-01/2026-01-25_CERTIFICATION_STABILIZATION_PLAN.md`
- **Failure Analysis**: `docs/_archive/delivery/2026-01/2026-01-25_CERTIFICATION_FAILURE_ROOT_CAUSES.md`
- **Profile Restoration Log**: `docs/_archive/delivery/2026-01/2026-01-25_PROFILE_PAGE_RESTORATION_LOG.md`
- **Certification Implementation Log**: `docs/_archive/delivery/2026-01/2026-01-25_CERTIFICATION_IMPLEMENTATION_LOG.md`
- **Operating Document**: `agent_working_loop_canonical_operating_document.md`

---

**Last Updated**: 2026-01-25  
**Current Status**: Profile Step 1 Complete, Starting Step 2  
**Next Action**: Continue with Profile Step 2 - Display Basic Profile Info
