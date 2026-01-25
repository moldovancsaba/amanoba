# Certificate Creation Guide

**Last Updated**: 2026-01-25  
**Status**: Active - Complete System Documentation

---

## Overview

This guide explains how certificates are created in the Amanoba platform. Certificates are automatically issued when students complete all course requirements and pass the final exam. The system handles certificate creation, verification, and management automatically.

---

## How Certificates Are Created

### Automatic Certificate Issuance

Certificates are **automatically created** when a student meets all requirements:

1. **Enrollment**: Student is enrolled in the course
2. **All Lessons Completed**: Student has completed all daily lessons
3. **All Quizzes Passed**: Student has passed all daily quiz assessments
4. **Final Exam Passed**: Student passes the final exam with a score > 50%

### Certificate Creation Flow

```
Student Completes Course
    ↓
All Requirements Met?
    ├─ NO → Certificate Revoked (if exists)
    └─ YES → Certificate Issued/Updated
        ↓
Certificate Record Created
    - certificateId (UUID)
    - verificationSlug (unique, unguessable)
    - recipientName, courseTitle
    - issuedAtISO timestamp
    - isPublic: true (default)
    - isRevoked: false
```

### Technical Implementation

**Location**: `app/api/certification/final-exam/submit/route.ts`

When a student submits their final exam:

1. **Exam is Graded**: Score calculated, pass/fail determined
2. **Requirements Checked**: System verifies:
   - Enrollment exists
   - All lessons completed (`completedDays.length >= durationDays`)
   - All quizzes passed (assessmentResults has entries for all days)
   - Final exam passed (`scorePercentInteger > 50`)
3. **Certificate Action**:
   - **If all requirements met**: Certificate is created (or updated if exists)
   - **If requirements not met**: Certificate is revoked (if exists)

**Code Reference**:
```typescript
// Certificate is eligible only if ALL requirements are met
const certificateEligible = enrolled && 
  allLessonsCompleted && 
  allQuizzesPassed && 
  passed;

if (certificateEligible) {
  // Create or update certificate
  await Certificate.create({
    certificateId: crypto.randomUUID(),
    playerId: player._id.toString(),
    recipientName: player.displayName || player.email || 'Learner',
    courseId: course.courseId,
    courseTitle: course.name || course.courseId,
    verificationSlug: crypto.randomBytes(10).toString('hex'),
    // ... other fields
  });
}
```

---

## Certificate Requirements

### For Students

To earn a certificate, students must:

1. ✅ **Enroll in the course**
   - Course enrollment is automatic when student starts the course
   - Tracked in `CourseProgress` collection

2. ✅ **Complete all daily lessons**
   - All lessons for the course duration must be completed
   - Tracked in `CourseProgress.completedDays` array

3. ✅ **Pass all daily quizzes**
   - All daily quiz assessments must be passed
   - Tracked in `CourseProgress.assessmentResults` Map

4. ✅ **Pass the final exam**
   - Final exam score must be > 50%
   - Tracked in `FinalExamAttempt` collection

### For Course Creators/Admins

To enable certificates for a course:

1. **Enable Certification in Course Settings**
   - Navigate to: `/admin/courses/[courseId]`
   - Go to "Certification Settings" section
   - Check "Enable Certification"
   - Configure:
     - **Price in Points**: Cost to purchase certificate entitlement (if not included in premium)
     - **Premium Includes Certification**: Check if premium course purchase includes certificate
     - **Template ID**: Certificate design template (default: `default_v1`)
     - **Credential Title ID**: Credential identifier (default: `CERT`)

2. **Ensure Question Pool is Ready**
   - Minimum 50 questions required in certification question pool
   - Questions are pulled from the course's certification question pool
   - Admin can manage questions in question pool management

3. **Verify Course Completion Requirements**
   - Course must have `durationDays` set
   - Course must have lessons for each day
   - Course must have quizzes for each day

---

## Certificate Data Model

### Certificate Schema

**Location**: `app/lib/models/certificate.ts`

```typescript
interface ICertificate {
  // Identifiers
  certificateId: string;              // UUID, unique
  certificateNumber?: string;        // Optional certificate number
  verificationSlug: string;          // Unique, unguessable slug for public verification
  
  // Recipient & Course
  playerId: string;                  // Student's player ID
  recipientName: string;              // Student's display name
  courseId: string;                  // Course identifier
  courseTitle: string;               // Course title at time of issuance
  locale: 'en' | 'hu';               // Certificate language
  
  // Certificate Content
  designTemplateId: string;          // Design template (e.g., 'default_v1')
  credentialId: string;               // Credential identifier (e.g., 'CERT')
  completionPhraseId: string;         // Completion phrase ID
  deliverableBulletIds: string[];    // Deliverable bullet points
  
  // Metadata
  issuedAtISO: string;               // ISO timestamp of issuance
  awardedPhraseId: string;           // Award phrase (e.g., 'awarded_verified_mastery')
  finalExamScorePercentInteger?: number; // Final exam score
  lastAttemptId?: string;            // Final exam attempt ID
  
  // Privacy & Status
  isPublic: boolean;                 // Public/private visibility (default: true)
  isRevoked: boolean;                // Revocation status (default: false)
  revokedAtISO?: string;             // Revocation timestamp
  revokedReason?: string;            // Reason for revocation
  
  // Assets (future)
  pdfAssetPath?: string;             // PDF file path
  imageAssetPath?: string;           // Image file path
}
```

### Key Fields Explained

- **`verificationSlug`**: Unique 20-character hex string used for public verification URLs (e.g., `/certificate/[slug]`)
- **`isPublic`**: Controls whether certificate is visible to anyone with the link (true) or only to the owner (false)
- **`isRevoked`**: Indicates if certificate has been revoked (e.g., if requirements no longer met)
- **`certificateId`**: UUID for internal tracking and identification

---

## Certificate Verification

### Public Verification URLs

Certificates can be verified using two URL formats:

1. **New Format (Recommended)**: `/certificate/[slug]`
   - Uses unguessable `verificationSlug`
   - More secure, privacy-controlled
   - Example: `https://www.amanoba.com/en/certificate/a1b2c3d4e5f6...`

2. **Legacy Format (Backward Compatible)**: `/certificate/verify/[playerId]/[courseId]`
   - Uses player ID and course ID
   - Still works for backward compatibility
   - Example: `https://www.amanoba.com/en/certificate/verify/player123/course456`

### Verification Features

- **Public Verification**: Anyone with the link can verify certificate authenticity
- **Privacy Controls**: Certificate owners can toggle public/private visibility
- **Revocation Status**: Revoked certificates are clearly marked
- **Certificate Details**: Shows recipient name, course title, issue date, exam score

---

## Admin Certificate Management

### Viewing Certificates

**Location**: `/admin/certificates`

Features:
- **Search**: Search by certificate ID, recipient name, course title, course ID, player ID, or verification slug
- **Filter**: Filter by status (all, active, revoked)
- **Pagination**: Browse certificates with pagination
- **View Link**: Click "View" to see certificate verification page

### Certificate Actions

Currently available:
- **View**: Open certificate verification page
- **Search & Filter**: Find specific certificates
- **Status Display**: See active/revoked status

Future enhancements:
- Revoke/restore certificates
- Edit certificate details
- Bulk operations

---

## Certificate Display

### Student Certificate Page

**Location**: `/profile/[playerId]/certificate/[courseId]`

Features:
- **Certificate Display**: Shows certificate details and completion requirements
- **Copy Verification Link**: Copy slug-based verification URL to clipboard
- **Download Certificate**: Download certificate as image (share or print format)
- **Privacy Toggle**: Toggle public/private visibility (owner only)

### Public Verification Page

**Location**: `/certificate/[slug]`

Features:
- **Verification Status**: Shows if certificate is verified/revoked
- **Certificate Details**: Displays recipient, course, issue date, exam score
- **Privacy Status**: Shows if certificate is public or private
- **Privacy Controls**: Owner can toggle public/private (if logged in as owner)
- **Link to Full Certificate**: Link to full certificate page (owner only)

---

## Certificate Configuration

### Per-Course Settings

**Location**: `/admin/courses/[courseId]` → "Certification Settings"

Settings:
- **Enable Certification**: Toggle certificate issuance for this course
- **Price in Points**: Cost to purchase certificate entitlement (if not included in premium)
- **Premium Includes Certification**: If checked, premium course purchase includes certificate entitlement
- **Template ID**: Certificate design template identifier
- **Credential Title ID**: Credential identifier

### Global Settings

**Location**: `/admin/settings` → "Certification Settings"

Global defaults:
- Default template ID
- Default credential ID
- Default pricing
- Background URL (if applicable)

---

## Certificate Entitlement

### What is Entitlement?

Certificate entitlement determines if a student can take the final exam and earn a certificate. Students need entitlement before they can start the final exam.

### Entitlement Sources

1. **Purchase**: Student purchases certificate entitlement with points
2. **Premium Inclusion**: Student purchased premium course (if `premiumIncludesCertification` is enabled)
3. **Admin Grant**: Admin can grant entitlement (future feature)

### Entitlement Check

Before starting final exam:
- System checks if student has entitlement
- If no entitlement and `premiumIncludesCertification` is true, entitlement is auto-created
- If no entitlement, student must purchase or is denied access

---

## Troubleshooting

### Certificate Not Issued

**Possible Causes**:
1. **Requirements Not Met**: Check if student has:
   - Completed all lessons
   - Passed all quizzes
   - Passed final exam (> 50%)
2. **Certification Not Enabled**: Check course settings - certification must be enabled
3. **Question Pool Insufficient**: Need minimum 50 questions in certification pool
4. **No Entitlement**: Student needs certificate entitlement

**How to Check**:
- Go to `/admin/certificates`
- Search for student's player ID or course ID
- Check certificate status
- View certificate details to see requirements

### Certificate Revoked

**Possible Causes**:
1. **Requirements No Longer Met**: Student's progress changed
2. **Final Exam Score Below Threshold**: Score dropped below 50%
3. **Manual Revocation**: Admin revoked certificate (future feature)

**How to Restore**:
- Student must meet all requirements again
- System will automatically restore certificate when requirements are met

### Verification Link Not Working

**Possible Causes**:
1. **Certificate is Private**: Private certificates only visible to owner
2. **Certificate Revoked**: Revoked certificates show revocation status
3. **Invalid Slug**: Slug may be incorrect or certificate doesn't exist

**How to Fix**:
- Check certificate privacy settings
- Verify certificate status (active/revoked)
- Ensure correct verification slug is used

---

## API Endpoints

### Certificate Verification

- **GET** `/api/certificates/[slug]`
  - Get certificate by verification slug
  - Public endpoint (respects privacy settings)
  - Returns certificate details or 404

- **PATCH** `/api/certificates/[slug]`
  - Update certificate privacy (owner only)
  - Requires authentication
  - Body: `{ isPublic: boolean }`

### Certificate Status

- **GET** `/api/profile/[playerId]/certificate-status?courseId=[courseId]`
  - Get certificate eligibility status
  - Returns enrollment, completion, quiz, and exam status
  - Includes `verificationSlug` if certificate exists

### Admin Certificate Management

- **GET** `/api/admin/certificates`
  - List all certificates with search, filter, and pagination
  - Admin only
  - Query params: `search`, `status`, `courseId`, `playerId`, `page`, `limit`

---

## Best Practices

### For Course Creators

1. **Enable Certification Early**: Enable certification when creating course
2. **Set Appropriate Pricing**: Set certificate price in points (or include in premium)
3. **Prepare Question Pool**: Ensure at least 50 questions in certification pool
4. **Test Certificate Flow**: Complete a test course to verify certificate issuance

### For Admins

1. **Monitor Certificates**: Regularly check `/admin/certificates` for issues
2. **Verify Requirements**: Ensure courses have proper completion requirements
3. **Check Question Pools**: Verify certification question pools have enough questions
4. **Review Revoked Certificates**: Investigate why certificates were revoked

### For Students

1. **Complete All Requirements**: Ensure all lessons, quizzes, and final exam are completed
2. **Check Entitlement**: Verify certificate entitlement before starting final exam
3. **Share Verification Link**: Use slug-based verification link for sharing
4. **Manage Privacy**: Toggle public/private visibility as needed

---

## Related Documentation

- **Delivery Plan**: `docs/2026-01-25_CERTIFICATE_VERIFICATION_SLUG_DELIVERY_PLAN.md`
- **Handover Document**: `docs/2026-01-25_CERTIFICATION_HANDOVER.md`
- **Certificate Model**: `app/lib/models/certificate.ts`
- **Final Exam API**: `app/api/certification/final-exam/submit/route.ts`
- **Verification API**: `app/api/certificates/[slug]/route.ts`

---

## Support

For issues or questions:
1. Check this guide first
2. Review troubleshooting section
3. Check admin certificate list for certificate status
4. Contact support if issue persists

---

**Last Updated**: 2026-01-25  
**Version**: 1.0  
**Status**: Complete
