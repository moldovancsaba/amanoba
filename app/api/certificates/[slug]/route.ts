/**
 * Certificate Verification API (Slug-based)
 * 
 * What: REST endpoints for certificate verification using slug
 * Why: More secure verification with privacy controls
 * 
 * Route: /api/certificates/[slug]
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Certificate } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/certificates/[slug]
 * 
 * What: Get certificate by verification slug for public verification
 * Why: Allows public verification without exposing playerId/courseId
 * 
 * Privacy Rules:
 * - If certificate is public (isPublic: true): Return certificate (anyone can view)
 * - If certificate is private (isPublic: false): Only return if user is owner
 * - If certificate not found: Return 404 (don't reveal existence)
 * - If certificate is revoked: Return certificate with isRevoked flag
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Find certificate by verificationSlug
    const certificate = await Certificate.findOne({ verificationSlug: slug }).lean();

    if (!certificate) {
      // Return 404 - don't reveal that certificate doesn't exist
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Check if certificate is revoked
    if (certificate.isRevoked) {
      // Return certificate with revoked status (public information)
      return NextResponse.json({
        success: true,
        certificate: {
          certificateId: certificate.certificateId,
          recipientName: certificate.recipientName,
          courseTitle: certificate.courseTitle,
          courseId: certificate.courseId,
          issuedAtISO: certificate.issuedAtISO,
          finalExamScorePercentInteger: certificate.finalExamScorePercentInteger,
          isRevoked: true,
          revokedAtISO: certificate.revokedAtISO,
          revokedReason: certificate.revokedReason,
          isPublic: certificate.isPublic,
        },
      });
    }

    // Check privacy: if private, only owner can view
    if (!certificate.isPublic) {
      // Get session to check if user is owner
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId || userId !== certificate.playerId) {
        // Not owner and certificate is private - return 404 (don't reveal existence)
        return NextResponse.json(
          { success: false, error: 'Certificate not found' },
          { status: 404 }
        );
      }
    }

    // Certificate is public OR user is owner - return full certificate data
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
        isRevoked: false,
        locale: certificate.locale,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch certificate by slug');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch certificate' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/certificates/[slug]
 * 
 * What: Update certificate privacy (toggle public/private)
 * Why: Allows certificate owner to control visibility
 * 
 * Authentication: Required (must be logged in)
 * Authorization: Owner only (playerId must match session user id)
 * 
 * Body: { isPublic: boolean }
 */
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

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isPublic } = body;

    if (typeof isPublic !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isPublic must be a boolean' },
        { status: 400 }
      );
    }

    // Find certificate by verificationSlug
    const certificate = await Certificate.findOne({ verificationSlug: slug });

    if (!certificate) {
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Verify user is owner
    if (certificate.playerId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - you do not own this certificate' },
        { status: 403 }
      );
    }

    // Update isPublic flag
    certificate.isPublic = isPublic;
    await certificate.save();

    logger.info(
      { slug, playerId: session.user.id, isPublic },
      'Certificate privacy updated'
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
        locale: certificate.locale,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to update certificate privacy');
    return NextResponse.json(
      { success: false, error: 'Failed to update certificate' },
      { status: 500 }
    );
  }
}
