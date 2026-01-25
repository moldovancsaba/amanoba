/**
 * Certificate Verification API
 * 
 * What: Public certificate verification and privacy toggle
 * Why: Allows certificate verification via public slug and owner privacy control
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Certificate, Course } from '@/lib/models';
import { logger } from '@/lib/logger';
import { auth } from '@/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/certificates/[slug]
 * 
 * What: Fetch certificate by verification slug
 * Privacy: Returns 404 for private certificates (unless owner/admin)
 */
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
      // Don't reveal certificate exists - return 404
      return NextResponse.json(
        { success: false, error: 'Certificate not found' },
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
        playerName: certificate.recipientName,
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

/**
 * PATCH /api/certificates/[slug]
 * 
 * What: Toggle certificate privacy (owner only)
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
    
    logger.info({ certificateId: certificate.certificateId, isPublic }, 'Certificate privacy updated');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Failed to update certificate privacy');
    return NextResponse.json(
      { success: false, error: 'Failed to update certificate' },
      { status: 500 }
    );
  }
}
