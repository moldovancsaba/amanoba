import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import { Certificate, CertificateEntitlement, FinalExamAttempt } from '@/lib/models';

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

  const [totalCertificates, revokedCount, publicCount] = await Promise.all([
    Certificate.countDocuments({}),
    Certificate.countDocuments({ isRevoked: true }),
    Certificate.countDocuments({ isPublic: true }),
  ]);

  const attemptAggregation = await FinalExamAttempt.aggregate([
    {
      $group: {
        _id: '$courseId',
        attempts: { $sum: 1 },
        passed: { $sum: { $cond: [{ $eq: ['$status', 'GRADED'] }, { $cond: ['$passed', 1, 0] }, 0] } },
        failed: { $sum: { $cond: [{ $eq: ['$status', 'GRADED'] }, { $cond: ['$passed', 0, 1] }, 0] } },
      },
    },
    {
      $project: {
        courseId: '$_id',
        attempts: 1,
        passed: 1,
        failed: 1,
        _id: 0,
      },
    },
  ]);

  const entitlementAggregation = await CertificateEntitlement.aggregate([
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 },
      },
    },
  ]);

  return NextResponse.json({
    success: true,
    data: {
      certificates: {
        total: totalCertificates,
        revoked: revokedCount,
        publicCount,
      },
      attempts: attemptAggregation,
      entitlements: entitlementAggregation.map((entry) => ({
        source: entry._id,
        count: entry.count,
      })),
    },
  });
}
