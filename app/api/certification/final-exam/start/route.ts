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
import { getCertificationPoolCount, resolvePoolCourse } from '@/lib/certification';
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
  if (poolCount < 50) {
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

  // Ensure entitlement or premium include
  let entitlement = await CertificateEntitlement.findOne({
    playerId: session.user.id,
    courseId: course._id,
  });

  if (!entitlement && course.certification?.premiumIncludesCertification && course.requiresPremium) {
    entitlement = await CertificateEntitlement.create({
      playerId: session.user.id,
      courseId: course._id,
      source: 'INCLUDED_IN_PREMIUM',
      entitledAtISO: new Date().toISOString(),
    });
  }

  if (!entitlement) {
    return NextResponse.json({ success: false, error: 'Certification entitlement required' }, { status: 403 });
  }

  const poolCourse = await resolvePoolCourse(courseIdParam);
  if (!poolCourse?._id) {
    return NextResponse.json(
      { success: false, error: 'Certification pool not found' },
      { status: 400 }
    );
  }

  // Select 50 unique questions via $sample
  const questions = await QuizQuestion.aggregate([
    {
      $match: {
        courseId: new mongoose.Types.ObjectId(poolCourse._id),
        isCourseSpecific: true,
        isActive: true,
      },
    },
    { $sample: { size: 50 } },
  ]);

  if (questions.length < 50) {
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

  return NextResponse.json({
    success: true,
    data: {
      attemptId: attempt._id.toString(),
      question: firstPayload,
    },
  });
}
