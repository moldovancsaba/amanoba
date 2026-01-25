/**
 * Profile Certificates API
 * 
 * What: List all certificates for a player (for profile display)
 * Why: Allows profile page to display user's certificates
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Certificate, Course } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/profile/[playerId]/certificates
 * 
 * What: Get all certificates for a player
 * Privacy: Anyone can view (certificates are public via verification slug)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    await connectDB();
    const { playerId } = await params;
    
    if (!playerId) {
      return NextResponse.json(
        { success: false, error: 'Player ID is required' },
        { status: 400 }
      );
    }
    
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
    
    logger.info({ playerId, count: enrichedCertificates.length }, 'Certificates fetched for profile');
    
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
