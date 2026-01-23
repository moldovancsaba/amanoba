import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import { Course } from '@/lib/models';
import { getCertificationPoolCount, resolvePoolCourse } from '@/lib/certification';

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

  const courses = await Course.find({ 'certification.enabled': true })
    .sort({ courseId: 1 })
    .lean()
    .limit(200);

  const pools = await Promise.all(
    courses.map(async (course) => {
      const poolCourse = await resolvePoolCourse(course.courseId);
      const poolCount = await getCertificationPoolCount(course.courseId);
      return {
        courseId: course.courseId,
        courseTitle: course.name,
        certificationEnabled: Boolean(course.certification?.enabled),
        poolCourseId: poolCourse?.courseId ?? course.courseId,
        poolCount,
        premiumIncludesCertification: Boolean(course.certification?.premiumIncludesCertification),
        priceMoney: course.certification?.priceMoney || null,
        pricePoints: course.certification?.pricePoints ?? null,
      };
    })
  );

  return NextResponse.json({
    success: true,
    data: {
      pools,
    },
  });
}
