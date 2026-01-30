/**
 * Stripe Webhook Handler
 * 
 * What: Handles Stripe webhook events for payment processing
 * Why: Processes payment events to activate premium status and create transaction records
 * 
 * Events handled:
 * - checkout.session.completed: Payment successful, activate premium
 * - payment_intent.succeeded: Payment succeeded
 * - payment_intent.payment_failed: Payment failed
 * - charge.refunded: Refund processed
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Player, Course, PaymentTransaction, PaymentStatus, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';
import { sendPaymentConfirmationEmail } from '@/lib/email';
import Stripe from 'stripe';
import mongoose from 'mongoose';

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  : null;

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/payments/webhook
 * 
 * What: Handle Stripe webhook events
 * 
 * Security: Verifies webhook signature using STRIPE_WEBHOOK_SECRET
 */
export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    // Check Stripe is configured
    if (!stripe || !WEBHOOK_SECRET) {
      logger.error({}, 'Stripe webhook not configured - missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    // Get raw body for signature verification
    // Why: Stripe requires raw body (not parsed) for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      logger.warn({}, 'Stripe webhook missing signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    try {
      event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    } catch (err) {
      logger.error({ error: err }, 'Stripe webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    await connectDB();

    // Handle different event types with retry logic
    let retryCount = 0;
    const maxRetries = 3;
    let lastError: Error | null = null;

    while (retryCount < maxRetries) {
      try {
        switch (event.type) {
          case 'checkout.session.completed':
            await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
            break;

          case 'payment_intent.succeeded':
            await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
            break;

          case 'payment_intent.payment_failed':
            await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
            break;

          case 'charge.refunded':
            await handleChargeRefunded(event.data.object as Stripe.Charge);
            break;

          default:
            logger.info({ eventType: event.type, eventId: event.id }, 'Unhandled Stripe webhook event type');
        }

        // Success - break retry loop
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        retryCount++;

        // Log retry attempt
        if (retryCount < maxRetries) {
          logger.warn(
            {
              error: lastError.message,
              eventType: event.type,
              eventId: event.id,
              retryCount,
              maxRetries,
            },
            `Stripe webhook processing failed, retrying (${retryCount}/${maxRetries})`
          );

          // Exponential backoff: wait 1s, 2s, 4s
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retryCount - 1) * 1000));
        } else {
          // Max retries reached
          logger.error(
            {
              error: lastError.message,
              stack: lastError.stack,
              eventType: event.type,
              eventId: event.id,
              retryCount,
            },
            'Stripe webhook processing failed after max retries'
          );
          throw lastError;
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    logger.error(
      {
        error: errorMessage,
        stack: errorStack,
        eventType: event?.type,
        eventId: event?.id,
      },
      'Stripe webhook processing failed'
    );

    // Return 200 to Stripe to prevent retries for non-recoverable errors
    // Stripe will retry on 4xx/5xx, but we log the error for manual investigation
    return NextResponse.json(
      { received: true, error: 'Webhook processing failed (logged for investigation)' },
      { status: 200 }
    );
  }
}

/**
 * Handle checkout.session.completed event
 * 
 * What: Payment successful, activate premium and create transaction
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    // Validate session status
    if (session.payment_status !== 'paid') {
      logger.warn(
        { sessionId: session.id, paymentStatus: session.payment_status },
        'Checkout session completed but payment not paid'
      );
      return;
    }

    const metadata = session.metadata;
    if (!metadata || !metadata.playerId) {
      logger.warn(
        { sessionId: session.id, metadata: session.metadata },
        'Checkout session missing playerId metadata'
      );
      return;
    }

    const playerId = metadata.playerId;
    const courseId = metadata.courseId;
    // Normalize courseId to uppercase (Course schema stores courseId in uppercase)
    const normalizedCourseId = courseId ? courseId.toUpperCase().trim() : null;
    const premiumDurationDays = parseInt(metadata.premiumDurationDays || '30', 10);
    const premiumExpiresAt = metadata.premiumExpiresAt
      ? new Date(metadata.premiumExpiresAt)
      : new Date(Date.now() + premiumDurationDays * 24 * 60 * 60 * 1000);

    // Get player
    const player = await Player.findById(playerId);
    if (!player) {
      logger.error({ playerId }, 'Player not found for checkout session');
      return;
    }

    // Get course if provided (using normalized courseId)
    let course = null;
    if (normalizedCourseId) {
      course = await Course.findOne({ courseId: normalizedCourseId });
    }

    // Get brand
    const brandId = metadata.brandId
      ? new mongoose.Types.ObjectId(metadata.brandId)
      : player.brandId;

    // Get payment intent to get charge details
    let paymentIntent: Stripe.PaymentIntent | null = null;
    let charge: Stripe.Charge | null = null;
    let paymentMethod: Stripe.PaymentMethod | null = null;

    if (session.payment_intent) {
      if (typeof session.payment_intent === 'string') {
        paymentIntent = await stripe!.paymentIntents.retrieve(session.payment_intent);
      } else {
        paymentIntent = session.payment_intent as Stripe.PaymentIntent;
      }

      if (paymentIntent.latest_charge) {
        if (typeof paymentIntent.latest_charge === 'string') {
          charge = await stripe!.charges.retrieve(paymentIntent.latest_charge);
        } else {
          charge = paymentIntent.latest_charge as Stripe.Charge;
        }

        if (charge.payment_method) {
          if (typeof charge.payment_method === 'string') {
            paymentMethod = await stripe!.paymentMethods.retrieve(charge.payment_method);
          } else {
            paymentMethod = charge.payment_method as Stripe.PaymentMethod;
          }
        }
      }
    }

    // Check if transaction already exists (idempotency)
    // Check by payment intent ID first (most reliable)
    const paymentIntentId = paymentIntent?.id || (session.payment_intent as string);
    const existingTransaction = await PaymentTransaction.findOne({
      $or: [
        { stripePaymentIntentId: paymentIntentId },
        { stripeCheckoutSessionId: session.id },
      ],
    });

    if (existingTransaction) {
      // If transaction exists but status is different, update it
      if (existingTransaction.status !== PaymentStatus.SUCCEEDED) {
        logger.info(
          {
            transactionId: existingTransaction._id,
            sessionId: session.id,
            oldStatus: existingTransaction.status,
          },
          'Updating existing transaction status to succeeded'
        );
        existingTransaction.status = PaymentStatus.SUCCEEDED;
        existingTransaction.premiumGranted = true;
        existingTransaction.premiumExpiresAt = premiumExpiresAt;
        existingTransaction.metadata.processedAt = new Date();
        await existingTransaction.save();

        // Update player premium status if not already set
        if (!player.isPremium || !player.premiumExpiresAt || player.premiumExpiresAt < premiumExpiresAt) {
          player.isPremium = true;
          player.premiumExpiresAt = premiumExpiresAt;
          if (!player.stripeCustomerId && session.customer) {
            player.stripeCustomerId = session.customer as string;
          }
          await player.save();
        }
      } else {
        logger.info(
          { transactionId: existingTransaction._id, sessionId: session.id },
          'Payment transaction already processed (idempotency)'
        );
      }
      return;
    }

    // Extract payment method details
    const paymentMethodDetails: Record<string, unknown> = {};
    if (paymentMethod) {
      if (paymentMethod.type === 'card' && paymentMethod.card) {
        paymentMethodDetails.type = 'card';
        paymentMethodDetails.brand = paymentMethod.card.brand;
        paymentMethodDetails.last4 = paymentMethod.card.last4;
        paymentMethodDetails.country = paymentMethod.card.country;
      }
    }

    // Create payment transaction with transaction safety
    let transaction;
    try {
      transaction = new PaymentTransaction({
        playerId: player._id,
        courseId: course?._id,
        brandId: brandId,
        stripePaymentIntentId: paymentIntentId,
        stripeCheckoutSessionId: session.id,
        stripeCustomerId: session.customer as string,
        stripeChargeId: charge?.id,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: PaymentStatus.SUCCEEDED,
        paymentMethod: Object.keys(paymentMethodDetails).length > 0 ? paymentMethodDetails : undefined,
        premiumGranted: true,
        premiumExpiresAt: premiumExpiresAt,
        premiumDurationDays: premiumDurationDays,
        metadata: {
          createdAt: new Date(),
          processedAt: new Date(),
          ipAddress: session.customer_details?.ip_address,
          userAgent: session.customer_details?.email, // Store email as user agent placeholder
        },
      });

      await transaction.save();
    } catch (saveError) {
      // Check if it's a duplicate key error (race condition)
      if (saveError instanceof Error && saveError.message.includes('duplicate')) {
        logger.warn(
          { sessionId: session.id, paymentIntentId },
          'Duplicate transaction detected (race condition), checking for existing transaction'
        );
        // Try to find the transaction that was created by another webhook instance
        const existing = await PaymentTransaction.findOne({
          $or: [
            { stripePaymentIntentId: paymentIntentId },
            { stripeCheckoutSessionId: session.id },
          ],
        });
        if (existing) {
          transaction = existing;
        } else {
          throw saveError;
        }
      } else {
        throw saveError;
      }
    }

    // Activate premium status for player (only if not already premium or if new expiration is later)
    const shouldUpdatePremium = !player.isPremium || 
                                !player.premiumExpiresAt || 
                                player.premiumExpiresAt < premiumExpiresAt;

    if (shouldUpdatePremium) {
      player.isPremium = true;
      player.premiumExpiresAt = premiumExpiresAt;
    }

    if (!player.stripeCustomerId && session.customer) {
      player.stripeCustomerId = session.customer as string;
    }
    
    // Add transaction to payment history (avoid duplicates)
    if (!player.paymentHistory) {
      player.paymentHistory = [];
    }
    if (!player.paymentHistory.includes(transaction._id)) {
      player.paymentHistory.push(transaction._id);
    }
    
    await player.save();

    logger.info(
      {
        playerId: player._id.toString(),
        courseId: courseId || 'general',
        transactionId: transaction._id.toString(),
        amount: transaction.amount,
        premiumExpiresAt: premiumExpiresAt.toISOString(),
      },
      'Premium access activated via Stripe payment'
    );

    // Send payment confirmation email (non-blocking)
    sendPaymentConfirmationEmail(
      player._id.toString(),
      courseId || null,
      transaction.amount,
      transaction.currency,
      premiumExpiresAt,
      transaction._id.toString(),
      player.locale as 'hu' | 'en' | undefined
    ).catch((emailError) => {
      // Log email error but don't fail the webhook
      logger.error(
        { error: emailError, playerId: player._id.toString(), transactionId: transaction._id.toString() },
        'Failed to send payment confirmation email (non-critical)'
      );
    });
  } catch (error) {
    logger.error({ error, sessionId: session.id }, 'Failed to process checkout.session.completed');
    throw error;
  }
}

/**
 * Handle payment_intent.succeeded event
 * 
 * What: Payment succeeded (backup handler)
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Check if transaction already exists
    const existingTransaction = await PaymentTransaction.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (existingTransaction) {
      // Update status if needed
      if (existingTransaction.status !== PaymentStatus.SUCCEEDED) {
        existingTransaction.status = PaymentStatus.SUCCEEDED;
        existingTransaction.metadata.processedAt = new Date();
        await existingTransaction.save();
      }
      return;
    }

    // If no transaction exists, try to find by metadata
    const metadata = paymentIntent.metadata;
    if (metadata && metadata.playerId) {
      // This might be a direct payment (not via checkout)
      // For now, just log it - checkout.session.completed is the primary handler
      logger.info(
        { paymentIntentId: paymentIntent.id, playerId: metadata.playerId },
        'Payment intent succeeded (no checkout session)'
      );
    }
  } catch (error) {
    logger.error({ error, paymentIntentId: paymentIntent.id }, 'Failed to process payment_intent.succeeded');
    throw error;
  }
}

/**
 * Handle payment_intent.payment_failed event
 * 
 * What: Payment failed, create failed transaction record
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Check if transaction exists
    const existingTransaction = await PaymentTransaction.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (existingTransaction) {
      // Update status
      existingTransaction.status = PaymentStatus.FAILED;
      existingTransaction.metadata.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
      await existingTransaction.save();
      return;
    }

    // Create failed transaction if metadata available
    const metadata = paymentIntent.metadata;
    if (metadata && metadata.playerId) {
      const player = await Player.findById(metadata.playerId);
      if (player) {
        const transaction = new PaymentTransaction({
          playerId: player._id,
          brandId: player.brandId,
          stripePaymentIntentId: paymentIntent.id,
          stripeCustomerId: paymentIntent.customer as string,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: PaymentStatus.FAILED,
          premiumGranted: false,
          metadata: {
            createdAt: new Date(),
            failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
          },
        });

        await transaction.save();

        logger.info(
          { playerId: player._id.toString(), paymentIntentId: paymentIntent.id },
          'Payment failed transaction recorded'
        );
      }
    }
  } catch (error) {
    logger.error({ error, paymentIntentId: paymentIntent.id }, 'Failed to process payment_intent.payment_failed');
    throw error;
  }
}

/**
 * Handle charge.refunded event
 * 
 * What: Refund processed, update transaction and revoke premium
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  try {
    // Find transaction by charge ID
    const transaction = await PaymentTransaction.findOne({
      stripeChargeId: charge.id,
    });

    if (!transaction) {
      logger.warn({ chargeId: charge.id }, 'Refunded charge not found in transactions');
      return;
    }

    // Check if already refunded
    if (transaction.status === PaymentStatus.REFUNDED || transaction.status === PaymentStatus.PARTIALLY_REFUNDED) {
      logger.info({ transactionId: transaction._id }, 'Transaction already marked as refunded');
      return;
    }

    // Determine if full or partial refund
    const refundAmount = charge.amount_refunded;
    const originalAmount = transaction.amount;
    const isPartialRefund = refundAmount < originalAmount;

    // Update transaction status
    transaction.status = isPartialRefund ? PaymentStatus.PARTIALLY_REFUNDED : PaymentStatus.REFUNDED;
    transaction.metadata.refundedAt = new Date();
    transaction.metadata.refundReason = 'Refund processed via Stripe';
    await transaction.save();

    // Revoke premium access if full refund
    if (!isPartialRefund && transaction.premiumGranted) {
      const player = await Player.findById(transaction.playerId);
      if (player) {
        // Only revoke if this was the most recent premium purchase
        // (in case player has multiple premium purchases)
        if (player.premiumExpiresAt && transaction.premiumExpiresAt) {
          // Check if this transaction's premium is still active
          if (transaction.premiumExpiresAt >= player.premiumExpiresAt) {
            player.isPremium = false;
            player.premiumExpiresAt = undefined;
            await player.save();

            logger.info(
              { playerId: player._id.toString(), transactionId: transaction._id.toString() },
              'Premium access revoked due to refund'
            );
          }
        }
      }
    }

    logger.info(
      {
        transactionId: transaction._id.toString(),
        chargeId: charge.id,
        refundAmount,
        isPartialRefund,
      },
      'Refund processed'
    );
  } catch (error) {
    logger.error({ error, chargeId: charge.id }, 'Failed to process charge.refunded');
    throw error;
  }
}
