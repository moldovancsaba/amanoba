import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import {
  Course,
  CourseProgress,
  CertificateEntitlement,
  FinalExamAttempt,
  QuizQuestion,
} from '@/lib/models';
import { getCertificationPoolCount, getCertQuestionLimit, resolvePoolCourse } from '@/lib/certification';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const courseIdParam = body?.courseId as string | undefined;
  if (!courseIdParam) {
    return NextResponse.json({ success: false, error: 'courseId is required' }, { status: 400 });
  }

  await connectDB();

  const course = await Course.findOne({ courseId: courseIdParam.toUpperCase() });
  if (!course || !course.certification?.enabled) {
    return NextResponse.json({ success: false, error: 'Certification unavailable' }, { status: 400 });
  }

  const poolCount = await getCertificationPoolCount(courseIdParam);
  const questionLimit = getCertQuestionLimit(course);
  if (poolCount < questionLimit) {
    return NextResponse.json(
      { success: false, error: 'Certification unavailable. Contact the course creator.' },
      { status: 400 }
    );
  }

  // Ensure completion
  const progress = await CourseProgress.findOne({
    playerId: session.user.id,
    courseId: course._id,
  }).lean();

  if (!progress || progress.status !== 'completed') {
    return NextResponse.json({ success: false, error: 'Course not completed' }, { status: 400 });
  }

  const priceMoney = course.certification?.priceMoney || null;
  const pricePoints = course.certification?.pricePoints ?? null;
  const hasMoneyPrice = Boolean(priceMoney && typeof priceMoney.amount === 'number' && priceMoney.amount > 0);
  const hasPointsPrice = typeof pricePoints === 'number' && pricePoints > 0;

  // Entitlement policy:
  // - Required if premium-gated OR priced (money/points).
  // - Not required for free courses with certification enabled and no pricing configured.
  const entitlementRequired = course.requiresPremium || hasMoneyPrice || hasPointsPrice;

  // Ensure entitlement or premium include (only when required)
  let entitlement = await CertificateEntitlement.findOne({
    playerId: session.user.id,
    courseId: course._id,
  });

  if (!entitlement && entitlementRequired && course.certification?.premiumIncludesCertification && course.requiresPremium) {
    entitlement = await CertificateEntitlement.create({
      playerId: session.user.id,
      courseId: course._id,
      source: 'INCLUDED_IN_PREMIUM',
      entitledAtISO: new Date().toISOString(),
    });
  }

  if (!entitlement && entitlementRequired) {
    return NextResponse.json({ success: false, error: 'Certification entitlement required' }, { status: 403 });
  }

  const poolCourse = await resolvePoolCourse(courseIdParam);
  if (!poolCourse?._id) {
    return NextResponse.json(
      { success: false, error: 'Certification pool not found' },
      { status: 400 }
    );
  }

  // Select up to questionLimit questions via $sample (50 for standard, certQuestionCount for child)
  const questions = await QuizQuestion.aggregate([
    {
      $match: {
        courseId: new mongoose.Types.ObjectId(String(poolCourse._id)),
        isCourseSpecific: true,
        isActive: true,
      },
    },
    { $sample: { size: questionLimit } },
  ]);

  if (questions.length < questionLimit) {
    return NextResponse.json(
      { success: false, error: 'Certification unavailable. Contact the course creator.' },
      { status: 400 }
    );
  }

  const questionOrder = questions.map((q) => q._id.toString());
  const answerOrderByQuestion: Record<string, number[]> = {};
  const firstQuestion = questions[0];
  answerOrderByQuestion[firstQuestion._id.toString()] = shuffle([0, 1, 2, 3]);

  // Pre-shuffle options for first question
  const firstPayload = {
    questionId: firstQuestion._id.toString(),
    question: firstQuestion.question,
    options: answerOrderByQuestion[firstQuestion._id.toString()].map((idx) => firstQuestion.options[idx]),
    index: 0,
    total: questions.length,
  };

  const attempt = await FinalExamAttempt.create({
    playerId: session.user.id,
    courseId: course._id,
    poolCourseId: poolCourse._id,
    questionIds: questionOrder,
    questionOrder,
    answerOrderByQuestion,
    answers: [],
    correctCount: 0,
    status: 'IN_PROGRESS',
    startedAtISO: new Date().toISOString(),
  });

  type AttemptDoc = { _id: { toString(): string } };
  return NextResponse.json({
    success: true,
    data: {
      attemptId: (attempt as AttemptDoc)._id.toString(),
      question: firstPayload,
    },
  });
}
