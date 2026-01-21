import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import {
  Certificate,
  Course,
  FinalExamAttempt,
  Player,
} from '@/lib/models';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const attemptId = body?.attemptId as string | undefined;
  if (!attemptId) {
    return NextResponse.json({ success: false, error: 'attemptId is required' }, { status: 400 });
  }

  await connectDB();

  const attempt = await FinalExamAttempt.findOne({ _id: attemptId, playerId: session.user.id });
  if (!attempt) {
    return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
  }
  if (attempt.status !== 'IN_PROGRESS') {
    return NextResponse.json({ success: false, error: 'Attempt not in progress' }, { status: 400 });
  }

  const total = attempt.questionOrder.length || 50;
  const correctCount = attempt.correctCount;
  const scorePercentRaw = (correctCount / total) * 100;
  const scorePercentInteger = Math.round(scorePercentRaw);
  const passed = scorePercentInteger > 50;

  attempt.scorePercentRaw = scorePercentRaw;
  attempt.scorePercentInteger = scorePercentInteger;
  attempt.passed = passed;
  attempt.status = 'GRADED';
  attempt.submittedAtISO = new Date().toISOString();

  await attempt.save();

  // Update certificate state according to "most recent wins"
  const course = await Course.findById(attempt.courseId).lean();
  const player = await Player.findById(session.user.id).lean();
  if (!course || !player) {
    return NextResponse.json({ success: false, error: 'Course or player not found' }, { status: 404 });
  }

  const existing = await Certificate.findOne({
    playerId: player._id.toString(),
    courseId: course.courseId,
  });

  if (passed) {
    if (existing) {
      existing.finalExamScorePercentInteger = scorePercentInteger;
      existing.lastAttemptId = attempt._id.toString();
      existing.isRevoked = false;
      existing.revokedAtISO = undefined;
      existing.revokedReason = undefined;
      await existing.save();
    } else {
      await Certificate.create({
        certificateId: crypto.randomUUID(),
        playerId: player._id.toString(),
        recipientName: player.displayName || player.email || 'Learner',
        courseId: course.courseId,
        courseTitle: course.name,
        locale: course.language || 'hu',
        designTemplateId: course.certification?.templateId || 'default_v1',
        credentialId: course.certification?.credentialTitleId || 'CERT',
        completionPhraseId: 'completion_final_exam',
        deliverableBulletIds: [],
        issuedAtISO: new Date().toISOString(),
        awardedPhraseId: 'awarded_verified_mastery',
        verificationSlug: crypto.randomBytes(10).toString('hex'),
        finalExamScorePercentInteger: scorePercentInteger,
        lastAttemptId: attempt._id.toString(),
        isRevoked: false,
        isPublic: true,
      });
    }
  } else if (existing) {
    existing.finalExamScorePercentInteger = scorePercentInteger;
    existing.lastAttemptId = attempt._id.toString();
    existing.isRevoked = true;
    existing.revokedAtISO = new Date().toISOString();
    existing.revokedReason = 'score_below_threshold';
    await existing.save();
  }

  return NextResponse.json({
    success: true,
    data: {
      scorePercentInteger,
      passed,
      certificateUpdated: passed || Boolean(existing),
    },
  });
}
