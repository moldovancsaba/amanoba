import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, CertificateEntitlement } from '@/lib/models';
import { isCertificationAvailable } from '@/lib/certification';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const courseIdParam = body?.courseId as string | undefined;
  const paymentReference = body?.paymentReference as string | undefined;

  if (!courseIdParam) {
    return NextResponse.json({ success: false, error: 'courseId is required' }, { status: 400 });
  }

  await connectDB();

  const course = await Course.findOne({ courseId: courseIdParam.toUpperCase() });
  if (!course) {
    return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
  }

  if (!course.certification?.enabled) {
    return NextResponse.json({ success: false, error: 'Certification unavailable' }, { status: 400 });
  }

  const availability = await isCertificationAvailable(courseIdParam);
  if (!availability.available) {
    return NextResponse.json(
      { success: false, error: 'Certification unavailable. Contact the course creator.' },
      { status: 400 }
    );
  }

  // Idempotent: if entitlement exists, return it
  const existing = await CertificateEntitlement.findOne({
    playerId: session.user.id,
    courseId: course._id,
  }).lean();
  if (existing) {
    return NextResponse.json({ success: true, data: existing });
  }

  const money = course.certification?.priceMoney;
  if (!money || money.amount === undefined) {
    return NextResponse.json(
      { success: false, error: 'Certification price not configured' },
      { status: 400 }
    );
  }

  const entitlement = await CertificateEntitlement.create({
    playerId: session.user.id,
    courseId: course._id,
    source: 'PAID',
    money: {
      amount: money.amount,
      currency: money.currency,
      paymentReference,
    },
    entitledAtISO: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, data: entitlement });
}
