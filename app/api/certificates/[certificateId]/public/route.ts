/**
 * Certificate Public Data API
 *
 * What: Returns certificate data for rendering or public display
 * Why: Edge render route cannot access the database
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Certificate } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { certificateId: string } }
) {
  try {
    const { certificateId } = params;
    await connectDB();

    const cert = await Certificate.findOne({
      $or: [{ certificateId }, { _id: certificateId }],
    }).lean();

    if (!cert) {
      return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      certificate: {
        certificateId: cert.certificateId,
        certificateNumber: cert.certificateNumber,
        recipientName: cert.recipientName,
        courseTitle: cert.courseTitle,
        credentialTitle: cert.credentialTitle,
        completionPhrase: cert.completionPhrase,
        awardedPhrase: cert.awardedPhrase,
        deliverableBullets: cert.deliverableBullets,
        issuedAtISO: cert.issuedAtISO,
        verificationSlug: cert.verificationSlug,
        finalExamScorePercentInteger: cert.finalExamScorePercentInteger,
        isRevoked: cert.isRevoked,
        locale: cert.locale,
        designTemplateId: cert.designTemplateId,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to load public certificate data');
    return NextResponse.json({ success: false, error: 'Failed to load certificate' }, { status: 500 });
  }
}
