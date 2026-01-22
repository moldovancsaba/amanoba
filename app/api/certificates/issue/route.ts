/**
 * Certificate Issue API
 *
 * What: Issue a certificate for a completed course
 * Why: Manual or automated issuance path
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkAdminAccess } from '@/lib/auth/admin';
import { issueCertificateForCompletion } from '@/lib/certificates/issue';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const courseId = payload.courseId as string | undefined;
    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    const user = session.user as { id?: string; playerId?: string; role?: string };
    const sessionPlayerId = user.playerId || user.id;
    const requestedPlayerId = payload.playerId || sessionPlayerId;

    if (!sessionPlayerId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    if (requestedPlayerId !== sessionPlayerId) {
      const adminCheck = await checkAdminAccess(session, '/api/certificates/issue');
      if (adminCheck) {
        return adminCheck;
      }
    }

    const certificate = await issueCertificateForCompletion({
      playerId: requestedPlayerId,
      courseId,
      locale: payload.locale,
      finalExamScorePercentInteger: payload.finalExamScorePercentInteger,
    });

    return NextResponse.json({
      success: true,
      certificate,
      verificationUrl: `/certificate/${certificate.verificationSlug}`,
      imageUrl: certificate.imageUrl || `/api/certificates/${certificate.certificateId}/render?format=png&variant=share_1200x627`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to issue certificate';
    logger.error({ error }, 'Certificate issuance failed');
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
