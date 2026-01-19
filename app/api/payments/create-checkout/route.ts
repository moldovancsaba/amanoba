/**
 * Payment Checkout API
 * 
 * What: Creates a Stripe Checkout session for course purchase
 * Why: Enables students to purchase premium courses via Stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Player, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';
import { meetsStripeMinimum, getFormattedMinimum } from '@/lib/utils/stripe-minimums';
import Stripe from 'stripe';

// Initialize Stripe
// Why: Server-side Stripe client for creating checkout sessions
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.amanoba.com';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/payments/create-checkout
 * 
 * What: Create Stripe Checkout session for course purchase
 * 
 * Request Body:
 * {
 *   courseId: string,
 *   amount: number, // Amount in cents (e.g., 2999 = $29.99)
 *   currency?: string, // ISO currency code (default: 'usd')
 *   premiumDurationDays?: number // Number of days premium access (default: 30)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check Stripe is configured
    if (!stripe) {
      logger.error({}, 'Stripe not configured - STRIPE_SECRET_KEY missing');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    await connectDB();

    // Get request body
    const body = await request.json();
    const { courseId, amount, currency, premiumDurationDays = 30 } = body;

    // Validate required fields
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Get player
    const user = session.user as { id?: string; playerId?: string };
    const playerId = user.playerId || user.id;
    const player = await Player.findById(playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Find course
    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (!course.isActive) {
      return NextResponse.json(
        { error: 'Course is not available' },
        { status: 400 }
      );
    }

    // Check if course requires premium
    if (!course.requiresPremium) {
      return NextResponse.json(
        { error: 'This course does not require premium access' },
        { status: 400 }
      );
    }

    // Get price from course or use provided amount
    const paymentAmount = course.price?.amount || amount || 2999; // Default to $29.99 if not set
    const paymentCurrency = course.price?.currency?.toLowerCase() || currency || 'usd';

    if (!paymentAmount || paymentAmount <= 0) {
      return NextResponse.json(
        { error: 'Course price is not set. Please set a price for this premium course.' },
        { status: 400 }
      );
    }

    // Validate Stripe minimum amount
    if (!meetsStripeMinimum(paymentAmount, paymentCurrency)) {
      const minimum = getFormattedMinimum(paymentCurrency);
      return NextResponse.json(
        { 
          error: `Payment amount is too low. The minimum amount for ${paymentCurrency.toUpperCase()} is ${minimum}. Please update the course price in the admin panel.` 
        },
        { status: 400 }
      );
    }

    // Check if already has premium access
    if (player.isPremium && player.premiumExpiresAt && player.premiumExpiresAt > new Date()) {
      return NextResponse.json(
        { error: 'You already have active premium access' },
        { status: 400 }
      );
    }

    // Get brand for metadata
    const brand = await Brand.findById(course.brandId).lean();
    const brandName = brand?.displayName || 'Amanoba';

    // Get or create Stripe customer
    let stripeCustomerId = player.stripeCustomerId;

    if (!stripeCustomerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: player.email,
        name: player.displayName,
        metadata: {
          playerId: player._id.toString(),
          brandId: course.brandId.toString(),
        },
      });

      stripeCustomerId = customer.id;

      // Save customer ID to player
      player.stripeCustomerId = stripeCustomerId;
      await player.save();

      logger.info(
        { playerId: player._id.toString(), stripeCustomerId },
        'Created Stripe customer for player'
      );
    }

    // Calculate premium expiration date
    const premiumExpiresAt = new Date();
    premiumExpiresAt.setDate(premiumExpiresAt.getDate() + premiumDurationDays);

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: paymentCurrency.toLowerCase(),
            product_data: {
              name: course.name,
              description: course.description.substring(0, 500), // Stripe limit
              images: course.thumbnail ? [course.thumbnail] : undefined,
            },
            unit_amount: paymentAmount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/courses/${courseId}?canceled=true`,
      metadata: {
        playerId: player._id.toString(),
        courseId: course.courseId,
        courseName: course.name,
        brandId: course.brandId.toString(),
        brandName: brandName,
        premiumDurationDays: premiumDurationDays.toString(),
        premiumExpiresAt: premiumExpiresAt.toISOString(),
      },
      customer_email: player.email || undefined,
      allow_promotion_codes: true, // Allow discount codes
    });

    logger.info(
      {
        playerId: player._id.toString(),
        courseId: course.courseId,
        checkoutSessionId: checkoutSession.id,
        amount: paymentAmount,
        currency: paymentCurrency,
      },
      'Created Stripe checkout session'
    );

    return NextResponse.json({
      success: true,
      checkoutSessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to create checkout session');

    // Handle Stripe-specific errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Payment error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
