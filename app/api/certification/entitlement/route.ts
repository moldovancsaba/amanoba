import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, CertificateEntitlement } from '@/lib/models';
import { isCertificationAvailable, getCertificationPoolCount, resolvePoolCourse } from '@/lib/certification';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseIdParam = searchParams.get('courseId');
  if (!courseIdParam) {
    return NextResponse.json({ success: false, error: 'courseId is required' }, { status: 400 });
  }

  await connectDB();

  const course = await Course.findOne({ courseId: courseIdParam.toUpperCase() }).lean();
  if (!course) {
    return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
  }

  const poolCount = await getCertificationPoolCount(courseIdParam);
  const certificationEnabled = Boolean(course.certification?.enabled);
  const available = certificationEnabled && poolCount >= 50;

  const entitlement = await CertificateEntitlement.findOne({
    playerId: session.user.id,
    courseId: course._id,
  }).lean();

  const premiumIncludesCertification = Boolean(course.certification?.premiumIncludesCertification);
  const priceMoney = course.certification?.priceMoney || null;
  const pricePoints = course.certification?.pricePoints ?? null;

  return NextResponse.json({
    success: true,
    data: {
      certificationEnabled,
      poolCount,
      certificationAvailable: available,
      entitlementOwned: Boolean(entitlement),
      premiumIncludesCertification,
      priceMoney,
      pricePoints,
      poolCourseId: (await resolvePoolCourse(courseIdParam))?.courseId || course.courseId,
    },
  });
}
