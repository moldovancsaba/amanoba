/**
 * Admin Payments API
 * 
 * What: REST endpoint for admins to view all payment transactions and analytics
 * Why: Allows admins to track revenue, view transactions, and analyze payment data
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { PaymentTransaction, PaymentStatus, Course, Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import mongoose from 'mongoose';
import { checkRateLimit, adminRateLimiter } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/payments
 * 
 * What: Get all payment transactions with filters and analytics
 * Query Params:
 *   - status?: string (pending, succeeded, failed, refunded, etc.)
 *   - courseId?: string
 *   - playerId?: string
 *   - startDate?: string (ISO date)
 *   - endDate?: string (ISO date)
 *   - limit?: number (default: 50)
 *   - offset?: number (default: 0)
 *   - analytics?: boolean (include analytics in response)
 */
export async function GET(request: NextRequest) {
  // Rate limiting for admin endpoints
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin role check when role system is implemented
    // For now, any authenticated user can access (should be restricted to admins)

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const courseId = searchParams.get('courseId');
    const playerId = searchParams.get('playerId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const includeAnalytics = searchParams.get('analytics') === 'true';

    // Build query
    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    }

    if (courseId) {
      // Find course by courseId string
      const course = await Course.findOne({ courseId }).lean();
      if (course) {
        query.courseId = course._id;
      } else {
        // If course not found, return empty results
        return NextResponse.json({
          success: true,
          transactions: [],
          pagination: { total: 0, limit, offset, hasMore: false },
          analytics: includeAnalytics ? getEmptyAnalytics() : undefined,
        });
      }
    }

    if (playerId) {
      if (mongoose.Types.ObjectId.isValid(playerId)) {
        query.playerId = new mongoose.Types.ObjectId(playerId);
      }
    }

    if (startDate || endDate) {
      query['metadata.createdAt'] = {};
      if (startDate) {
        query['metadata.createdAt'].$gte = new Date(startDate);
      }
      if (endDate) {
        query['metadata.createdAt'].$lte = new Date(endDate);
      }
    }

    // Fetch transactions
    // Note: PaymentTransaction uses metadata.createdAt, not createdAt
    const transactions = await PaymentTransaction.find(query)
      .populate('playerId', 'username displayName email')
      .populate('courseId', 'courseId name')
      .sort({ 'metadata.createdAt': -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    // Get total count for pagination
    const totalCount = await PaymentTransaction.countDocuments(query);

    // Format transactions for response
    const formattedTransactions = transactions.map((tx) => ({
      id: tx._id.toString(),
      playerId: tx.playerId ? (tx.playerId as any)._id.toString() : null,
      playerName: tx.playerId ? ((tx.playerId as any).displayName || (tx.playerId as any).username || 'Unknown') : 'Unknown',
      playerEmail: tx.playerId ? (tx.playerId as any).email : null,
      courseId: tx.courseId ? (tx.courseId as any).courseId : null,
      courseName: tx.courseId ? (tx.courseId as any).name : null,
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
      premiumGranted: tx.premiumGranted || false,
      premiumExpiresAt: tx.premiumExpiresAt || null,
      premiumDurationDays: tx.premiumDurationDays || null,
      paymentMethod: tx.paymentMethod || null,
      stripePaymentIntentId: tx.stripePaymentIntentId,
      stripeCheckoutSessionId: tx.stripeCheckoutSessionId || null,
      stripeCustomerId: tx.stripeCustomerId || null,
      stripeChargeId: tx.stripeChargeId || null,
      createdAt: tx.metadata.createdAt,
      processedAt: tx.metadata.processedAt || null,
      refundedAt: tx.metadata.refundedAt || null,
      failureReason: tx.metadata.failureReason || null,
      refundReason: tx.metadata.refundReason || null,
    }));

    // Calculate analytics if requested
    let analytics = undefined;
    if (includeAnalytics) {
      analytics = await calculateAnalytics(query);
    }

    logger.info({ 
      filters: { status, courseId, playerId, startDate, endDate },
      count: formattedTransactions.length,
      total: totalCount,
    }, 'Admin payment transactions fetched');

    return NextResponse.json({
      success: true,
      transactions: formattedTransactions,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      analytics,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch admin payment transactions');
    return NextResponse.json(
      { error: 'Failed to fetch payment transactions' },
      { status: 500 }
    );
  }
}

/**
 * Calculate payment analytics
 */
async function calculateAnalytics(query: Record<string, unknown>) {
  try {
    // Total revenue (succeeded payments only)
    const succeededPayments = await PaymentTransaction.aggregate([
      { $match: { ...query, status: PaymentStatus.SUCCEEDED } },
      {
        $group: {
          _id: '$currency',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Revenue by course
    const revenueByCourse = await PaymentTransaction.aggregate([
      { $match: { ...query, status: PaymentStatus.SUCCEEDED, courseId: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$courseId',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 },
    ]);

    // Populate course names
    const courseIds = revenueByCourse.map((r) => r._id).filter(Boolean);
    const courses = await Course.find({ _id: { $in: courseIds } })
      .select('courseId name')
      .lean();

    const revenueByCourseFormatted = revenueByCourse.map((r) => {
      const course = courses.find((c) => c._id.toString() === r._id.toString());
      return {
        courseId: course?.courseId || null,
        courseName: course?.name || 'Unknown Course',
        totalAmount: r.totalAmount,
        count: r.count,
      };
    });

    // Payment status breakdown
    const statusBreakdown = await PaymentTransaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Revenue by period (last 30 days, last 7 days, today)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const revenueToday = await PaymentTransaction.aggregate([
      {
        $match: {
          ...query,
          status: PaymentStatus.SUCCEEDED,
          'metadata.createdAt': { $gte: todayStart },
        },
      },
      {
        $group: {
          _id: '$currency',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const revenueLast7Days = await PaymentTransaction.aggregate([
      {
        $match: {
          ...query,
          status: PaymentStatus.SUCCEEDED,
          'metadata.createdAt': { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: '$currency',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const revenueLast30Days = await PaymentTransaction.aggregate([
      {
        $match: {
          ...query,
          status: PaymentStatus.SUCCEEDED,
          'metadata.createdAt': { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: '$currency',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Success rate
    const totalPayments = await PaymentTransaction.countDocuments(query);
    const succeededCount = await PaymentTransaction.countDocuments({ ...query, status: PaymentStatus.SUCCEEDED });
    const failedCount = await PaymentTransaction.countDocuments({ ...query, status: PaymentStatus.FAILED });
    const refundedCount = await PaymentTransaction.countDocuments({ 
      ...query, 
      status: { $in: [PaymentStatus.REFUNDED, PaymentStatus.PARTIALLY_REFUNDED] } 
    });

    return {
      totalRevenue: succeededPayments.map((r) => ({
        currency: r._id,
        amount: r.totalAmount,
        count: r.count,
      })),
      revenueByCourse: revenueByCourseFormatted,
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s._id,
        count: s.count,
      })),
      revenueByPeriod: {
        today: revenueToday.map((r) => ({
          currency: r._id,
          amount: r.totalAmount,
          count: r.count,
        })),
        last7Days: revenueLast7Days.map((r) => ({
          currency: r._id,
          amount: r.totalAmount,
          count: r.count,
        })),
        last30Days: revenueLast30Days.map((r) => ({
          currency: r._id,
          amount: r.totalAmount,
          count: r.count,
        })),
      },
      successRate: totalPayments > 0 ? (succeededCount / totalPayments) * 100 : 0,
      failureRate: totalPayments > 0 ? (failedCount / totalPayments) * 100 : 0,
      refundRate: totalPayments > 0 ? (refundedCount / totalPayments) * 100 : 0,
      totalTransactions: totalPayments,
      succeededTransactions: succeededCount,
      failedTransactions: failedCount,
      refundedTransactions: refundedCount,
    };
  } catch (error) {
    logger.error({ error }, 'Failed to calculate payment analytics');
    return getEmptyAnalytics();
  }
}

function getEmptyAnalytics() {
  return {
    totalRevenue: [],
    revenueByCourse: [],
    statusBreakdown: [],
    revenueByPeriod: {
      today: [],
      last7Days: [],
      last30Days: [],
    },
    successRate: 0,
    failureRate: 0,
    refundRate: 0,
    totalTransactions: 0,
    succeededTransactions: 0,
    failedTransactions: 0,
    refundedTransactions: 0,
  };
}
