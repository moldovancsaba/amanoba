import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import {
  Course,
  CertificateEntitlement,
  PointsWallet,
  PointsTransaction,
} from '@/lib/models';
import mongoose from 'mongoose';
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

  const pricePoints = course.certification?.pricePoints;
  if (pricePoints === undefined || pricePoints === null || pricePoints <= 0) {
    return NextResponse.json(
      { success: false, error: 'Points price not configured' },
      { status: 400 }
    );
  }

  // Idempotent: if entitlement exists, return
  const existing = await CertificateEntitlement.findOne({
    playerId: session.user.id,
    courseId: course._id,
  }).lean();
  if (existing) {
    return NextResponse.json({ success: true, data: existing });
  }

  const sessionDb = await mongoose.startSession();
  sessionDb.startTransaction();
  try {
    let wallet = await PointsWallet.findOne({ playerId: session.user.id }).session(sessionDb);
    if (!wallet) {
      wallet = new PointsWallet({
        playerId: session.user.id,
        currentBalance: 0,
        lifetimeEarned: 0,
        lifetimeSpent: 0,
        pendingBalance: 0,
        lastTransaction: new Date(),
        metadata: { createdAt: new Date(), updatedAt: new Date(), lastBalanceCheck: new Date() },
      });
    }

    if (wallet.currentBalance < pricePoints) {
      await sessionDb.abortTransaction();
      sessionDb.endSession();
      return NextResponse.json({ success: false, error: 'Insufficient points' }, { status: 400 });
    }

    const balanceBefore = wallet.currentBalance;
    wallet.currentBalance -= pricePoints;
    wallet.lifetimeSpent += pricePoints;
    wallet.lastTransaction = new Date();
    wallet.metadata.updatedAt = new Date();
    await wallet.save({ session: sessionDb });

    await PointsTransaction.create(
      [
        {
          playerId: wallet.playerId,
          walletId: wallet._id,
          type: 'spend',
          amount: -pricePoints,
          balanceBefore,
          balanceAfter: wallet.currentBalance,
          source: {
            type: 'reward_redemption',
            description: 'Certification entitlement redemption',
          },
          metadata: {
            createdAt: new Date(),
          },
        },
      ],
      { session: sessionDb }
    );

    const entitlement = await CertificateEntitlement.create(
      [
        {
          playerId: session.user.id,
          courseId: course._id,
          source: 'POINTS',
          pointsSpent: pricePoints,
          entitledAtISO: new Date().toISOString(),
        },
      ],
      { session: sessionDb }
    );

    await sessionDb.commitTransaction();
    sessionDb.endSession();

    return NextResponse.json({ success: true, data: entitlement[0] });
  } catch (_error) {
    await sessionDb.abortTransaction();
    sessionDb.endSession();
    return NextResponse.json({ success: false, error: 'Failed to redeem points' }, { status: 500 });
  }
}
