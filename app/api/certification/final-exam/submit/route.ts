import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { finalizeFinalExamAttempt } from '@/lib/certification/final-exam-finalize';

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

  try {
    const data = await finalizeFinalExamAttempt(attemptId, session.user.id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Submit failed';
    const responseStatus = message.includes('not found')
      ? 404
      : message === 'Attempt not in progress'
        ? 400
        : 500;
    return NextResponse.json({ success: false, error: message }, { status: responseStatus });
  }
}
