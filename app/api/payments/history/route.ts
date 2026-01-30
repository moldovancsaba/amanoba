/**
 * Payment History API
 * 
 * What: Fetches payment transaction history for the current user
 * Why: Allows users to view their payment history and receipts
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { PaymentTransaction, Course } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/payments/history
 * 
 * What: Get payment history for authenticated user
 * Query Params:
 *   - limit?: number (default: 50)
 *   - offset?: number (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;

    if (!playerId) {
      return NextResponse.json({ error: 'Player ID not found' }, { status: 400 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Fetch payment transactions
    const transactions = await PaymentTransaction.find({ playerId })
      .populate('courseId', 'courseId name')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    // Get total count for pagination
    const totalCount = await PaymentTransaction.countDocuments({ playerId });

    // Format transactions for response
    const formattedTransactions = transactions.map((tx) => ({
      id: tx._id.toString(),
      courseId: tx.courseId ? (tx.courseId as { courseId?: string; name?: string }).courseId : null,
      courseName: tx.courseId ? (tx.courseId as { courseId?: string; name?: string }).name : null,
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
      premiumGranted: tx.premiumGranted || false,
      premiumExpiresAt: tx.premiumExpiresAt || null,
      paymentMethod: tx.paymentMethod || null,
      createdAt: tx.createdAt,
      stripePaymentIntentId: tx.stripePaymentIntentId,
      stripeCheckoutSessionId: tx.stripeCheckoutSessionId,
    }));

    logger.info({ playerId, count: formattedTransactions.length }, 'Payment history fetched');

    return NextResponse.json({
      success: true,
      transactions: formattedTransactions,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch payment history');
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}
