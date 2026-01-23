import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Certificate } from '@/lib/models';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/rbac';

interface Params {
  params: {
    playerId: string;
  };
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: Params) {
  const { playerId } = params;
  if (!playerId) {
    return NextResponse.json({ success: false, error: 'Player ID is required' }, { status: 400 });
  }

  const session = await auth();
  const viewerId = session?.user?.id;
  const isOwner = viewerId === playerId;
  const adminView = session ? isAdmin(session) : false;
  const canSeeAll = isOwner || adminView;

  await connectDB();

  const certificates = await Certificate.find({ playerId })
    .sort({ issuedAtISO: -1 })
    .lean();

  const filtered = canSeeAll
    ? certificates
    : certificates.filter((certificate) => Boolean(certificate.isPublic));

  const payload = filtered.map((certificate) => ({
    certificateId: certificate.certificateId,
    courseId: certificate.courseId,
    courseTitle: certificate.courseTitle,
    scorePercentInteger: certificate.finalExamScorePercentInteger ?? 0,
    status: certificate.isRevoked ? 'revoked' : 'certified',
    issuedAt: certificate.issuedAtISO,
    verificationSlug: certificate.verificationSlug,
    isPublic: Boolean(certificate.isPublic),
  }));

  return NextResponse.json({
    success: true,
    playerId,
    certificates: payload,
    canViewPrivateCertificates: canSeeAll,
  });
}
