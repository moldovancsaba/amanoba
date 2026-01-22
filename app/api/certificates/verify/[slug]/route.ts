/**
 * Certificate Verification API
 *
 * What: Public endpoint to verify a certificate by slug
 * Why: Public verification page needs a simple lookup
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Certificate } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const cert = await Certificate.findOne({ verificationSlug: params.slug }).lean();

    if (!cert) {
      return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
    }

    if (!cert.isPublic) {
      return NextResponse.json({ success: false, error: 'Certificate is private' }, { status: 403 });
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
        imageUrl: cert.imageUrl,
        isRevoked: cert.isRevoked,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to verify certificate');
    return NextResponse.json({ success: false, error: 'Failed to verify certificate' }, { status: 500 });
  }
}
