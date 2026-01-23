import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Certificate, Course, Player, type ICertificate } from '@/lib/models';
import type { LeanDocument } from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Params {
  params: {
    slug: string;
  };
}

const buildVerificationPayload = async (certificate: LeanDocument<ICertificate>) => {
  const [player, course] = await Promise.all([
    Player.findById(certificate.playerId).lean(),
    Course.findOne({ courseId: certificate.courseId }).lean(),
  ]);

  return {
    certificate: {
      certificateId: certificate.certificateId,
      courseId: certificate.courseId,
      courseTitle: certificate.courseTitle,
      recipientName: certificate.recipientName,
      issuedAtISO: certificate.issuedAtISO,
      finalExamScorePercentInteger: certificate.finalExamScorePercentInteger ?? null,
      isRevoked: Boolean(certificate.isRevoked),
      revokedReason: certificate.revokedReason,
      isPublic: Boolean(certificate.isPublic),
    },
    player: {
      displayName: player?.displayName ?? 'Learner',
      profilePicture: player?.profilePicture || null,
    },
    course: {
      name: course?.name || certificate.courseTitle,
      language: course?.language || 'en',
    },
  };
};

export async function GET(_request: NextRequest, { params }: Params) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ success: false, error: 'Certificate slug is missing' }, { status: 400 });
  }

  await connectDB();
  const certificate = await Certificate.findOne({ verificationSlug: slug }).lean();
  if (!certificate) {
    return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
  }

  const session = await auth();
  const ownerId = certificate.playerId;
  if (!certificate.isPublic && session?.user?.id !== ownerId) {
    return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
  }

  const payload = await buildVerificationPayload(certificate);
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Certificate payload unavailable' }, { status: 500 });
  }

  const shareUrl = new URL(`/certificate/${certificate.verificationSlug}`, _request.nextUrl.origin).toString();
  const courseUrl = new URL(`/courses/${certificate.courseId}`, _request.nextUrl.origin).toString();

  return NextResponse.json({
    success: true,
    data: {
      ...payload,
      shareImageUrl: `/api/certificates/${certificate.certificateId}/render?variant=share_1200x627`,
      verificationUrl: `/certificate/${certificate.verificationSlug}`,
      shareUrl,
      courseUrl,
    },
  });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ success: false, error: 'Certificate slug is required' }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const isPublic = body?.isPublic;
  if (typeof isPublic !== 'boolean') {
    return NextResponse.json({ success: false, error: 'isPublic boolean is required' }, { status: 400 });
  }

  await connectDB();
  const certificate = await Certificate.findOne({ verificationSlug: slug });
  if (!certificate) {
    return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
  }

  const ownerId = certificate.playerId;
  if (session.user.id !== ownerId) {
    return NextResponse.json({ success: false, error: 'Not allowed' }, { status: 403 });
  }

  certificate.isPublic = isPublic;
  await certificate.save();

  return NextResponse.json({
    success: true,
    data: {
      isPublic: certificate.isPublic,
    },
  });
}
