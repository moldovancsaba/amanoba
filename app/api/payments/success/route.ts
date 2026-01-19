/**
 * Payment Success Handler
 * 
 * What: Handles redirect after successful Stripe payment
 * Why: Verifies payment and redirects user to course or dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { PaymentTransaction } from '@/lib/models';
import { logger } from '@/lib/logger';
import Stripe from 'stripe';
import { redirect } from 'next/navigation';

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/payments/success
 * 
 * What: Verify payment success and redirect user
 * Query Params: session_id (Stripe Checkout Session ID)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      // Redirect to sign in if not authenticated
      const { searchParams } = new URL(request.url);
      const sessionId = searchParams.get('session_id');
      return NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${encodeURIComponent(`/api/payments/success?session_id=${sessionId}`)}`, APP_URL)
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      // No session ID, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', APP_URL));
    }

    if (!stripe) {
      logger.error({}, 'Stripe not configured');
      return NextResponse.redirect(new URL('/dashboard?payment_error=configuration', APP_URL));
    }

    await connectDB();

    // Retrieve checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify payment was successful
    if (checkoutSession.payment_status !== 'paid') {
      logger.warn({ sessionId, paymentStatus: checkoutSession.payment_status }, 'Payment not completed');
      return NextResponse.redirect(new URL('/dashboard?payment_error=not_paid', APP_URL));
    }

    // Get metadata
    const metadata = checkoutSession.metadata;
    const courseId = metadata?.courseId;
    const playerId = metadata?.playerId;

    // Verify transaction exists in database (webhook should have created it)
    const transaction = await PaymentTransaction.findOne({
      stripeCheckoutSessionId: sessionId,
    });

    if (!transaction) {
      // Transaction not found - webhook might not have processed yet
      // Wait a moment and check again, or redirect with pending status
      logger.warn({ sessionId }, 'Payment transaction not found in database (webhook may be processing)');
      
      // Redirect to course or dashboard with success message
      // The webhook will process the payment in the background
      if (courseId) {
        return NextResponse.redirect(new URL(`/courses/${courseId}?payment_success=true&processing=true`, APP_URL));
      }
      return NextResponse.redirect(new URL('/dashboard?payment_success=true&processing=true', APP_URL));
    }

    // Payment verified - redirect to course or dashboard
    if (courseId) {
      return NextResponse.redirect(new URL(`/courses/${courseId}?payment_success=true`, APP_URL));
    }

    return NextResponse.redirect(new URL('/dashboard?payment_success=true', APP_URL));
  } catch (error) {
    logger.error({ error }, 'Payment success handler failed');
    return NextResponse.redirect(new URL('/dashboard?payment_error=unknown', APP_URL));
  }
}
