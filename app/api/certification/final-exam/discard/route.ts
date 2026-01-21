import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { FinalExamAttempt } from '@/lib/models';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const attemptId = body?.attemptId as string | undefined;
  const reason = body?.reason as string | undefined;

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

  attempt.status = 'DISCARDED';
  attempt.discardedAtISO = new Date().toISOString();
  attempt.discardReason = reason || 'user_exit';
  await attempt.save();

  return NextResponse.json({ success: true });
}
