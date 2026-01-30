/**
 * Admin Certificate by Slug API
 *
 * What: PATCH to revoke or unrevoke a certificate by verification slug
 * Why: Admins need to revoke invalid/fraudulent certificates or unrevoke after appeal
 *
 * Route: /api/admin/certificates/[slug]
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import connectDB from '@/lib/mongodb';
import { Certificate } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/certificates/[slug]
 *
 * Body: { isRevoked: boolean, revokedReason?: string }
 * - isRevoked: true = revoke (set revokedAtISO, optional revokedReason)
 * - isRevoked: false = unrevoke (clear revokedAtISO, revokedReason)
 *
 * Admin only.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isRevoked, revokedReason } = body;

    if (typeof isRevoked !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isRevoked must be a boolean' },
        { status: 400 }
      );
    }

    const certificate = await Certificate.findOne({ verificationSlug: slug });

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    certificate.isRevoked = isRevoked;
    if (isRevoked) {
      certificate.revokedAtISO = new Date().toISOString();
      certificate.revokedReason =
        typeof revokedReason === 'string' && revokedReason.trim()
          ? revokedReason.trim()
          : undefined;
    } else {
      certificate.revokedAtISO = undefined;
      certificate.revokedReason = undefined;
    }
    await certificate.save();

    logger.info(
      { slug, isRevoked, revokedReason: certificate.revokedReason, adminId: session?.user?.id },
      'Admin certificate revoke/unrevoke'
    );

    return NextResponse.json({
      success: true,
      certificate: {
        certificateId: certificate.certificateId,
        recipientName: certificate.recipientName,
        courseTitle: certificate.courseTitle,
        courseId: certificate.courseId,
        playerId: certificate.playerId,
        verificationSlug: certificate.verificationSlug,
        issuedAtISO: certificate.issuedAtISO,
        finalExamScorePercentInteger: certificate.finalExamScorePercentInteger,
        isPublic: certificate.isPublic,
        isRevoked: certificate.isRevoked,
        revokedAtISO: certificate.revokedAtISO,
        revokedReason: certificate.revokedReason,
        locale: certificate.locale,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Admin PATCH certificate by slug failed');
    return NextResponse.json(
      { success: false, error: 'Failed to update certificate' },
      { status: 500 }
    );
  }
}
