import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import { Certificate } from '@/lib/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const adminCheck = requireAdmin(request, session);
  if (!adminCheck.success) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: 403 });
  }

  await connectDB();

  const url = new URL(request.url);
  const search = url.searchParams.get('search')?.trim() || '';
  const status = url.searchParams.get('status');
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
  const limit = Math.min(50, Math.max(10, Number(url.searchParams.get('limit')) || 20));

  const filters: Record<string, unknown> = {};
  if (status === 'certified') {
    filters.isRevoked = false;
  } else if (status === 'revoked') {
    filters.isRevoked = true;
  }

  if (search) {
    const re = new RegExp(search, 'i');
    filters.$or = [
      { certificateId: re },
      { recipientName: re },
      { courseTitle: re },
      { verificationSlug: re },
    ];
  }

  const total = await Certificate.countDocuments(filters);
  const certificates = await Certificate.find(filters)
    .sort({ issuedAtISO: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({
    success: true,
    data: {
      certificates: certificates.map((certificate) => ({
        certificateId: certificate.certificateId,
        recipientName: certificate.recipientName,
        courseId: certificate.courseId,
        courseTitle: certificate.courseTitle,
        issuedAt: certificate.issuedAtISO,
        scorePercentInteger: certificate.finalExamScorePercentInteger ?? 0,
        status: certificate.isRevoked ? 'revoked' : 'certified',
        isPublic: Boolean(certificate.isPublic),
        verificationSlug: certificate.verificationSlug,
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    },
  });
}
