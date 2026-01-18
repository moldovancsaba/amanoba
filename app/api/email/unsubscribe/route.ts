/**
 * Email Unsubscribe API
 * 
 * What: Handles one-click email unsubscribe
 * Why: Allows students to opt out of lesson emails
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Player } from '@/lib/models';
import { logger } from '@/lib/logger';
import { generateSecureToken } from '@/lib/security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/email/unsubscribe
 * 
 * What: Unsubscribe player from lesson emails
 * Why: Respects user preferences and CAN-SPAM compliance
 * 
 * Request Body:
 * - playerId: Player ID (optional, can use token)
 * - token: Unsubscribe token (optional, for email links)
 * - email: Email address (optional, for email-based unsubscribe)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { playerId, token, email } = body;

    // Find player by ID, token, or email
    let player = null;

    if (playerId) {
      player = await Player.findById(playerId);
    } else if (token) {
      // Token-based lookup (for email links)
      player = await Player.findOne({ unsubscribeToken: token });
      if (!player) {
        return NextResponse.json(
          { error: 'Invalid unsubscribe token' },
          { status: 400 }
        );
      }
    } else if (email) {
      player = await Player.findOne({ email: email.toLowerCase() });
    }

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Update email preferences
    if (!player.emailPreferences) {
      player.emailPreferences = {
        receiveLessonEmails: false,
        emailFrequency: 'never',
      };
    } else {
      player.emailPreferences.receiveLessonEmails = false;
      player.emailPreferences.emailFrequency = 'never';
    }

    await player.save();

    logger.info({ playerId: player._id }, 'Player unsubscribed from lesson emails');

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from lesson emails',
    });
  } catch (error) {
    logger.error({ error }, 'Failed to unsubscribe player');

    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/email/unsubscribe
 * 
 * What: Unsubscribe via URL (for email links)
 * Why: One-click unsubscribe from email
 * 
 * Query Params:
 * - token: Unsubscribe token
 * - email: Email address
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token && !email) {
      return NextResponse.json(
        { error: 'Token or email required' },
        { status: 400 }
      );
    }

    // Find player
    let player = null;

    if (token) {
      // Token-based lookup (for email links)
      player = await Player.findOne({ unsubscribeToken: token });
      if (!player) {
        // Return HTML error page for invalid token
        return new NextResponse(
          `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invalid Unsubscribe Link</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  margin: 0;
                  background: #000;
                  color: #fff;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                  background: #2D2D2D;
                  border-radius: 8px;
                  border: 2px solid #FAB908;
                }
                h1 { color: #FAB908; }
                .error { color: #ff4444; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1 class="error">Invalid Unsubscribe Link</h1>
                <p>The unsubscribe link is invalid or has expired.</p>
                <p>Please contact support if you need to unsubscribe from emails.</p>
              </div>
            </body>
          </html>
          `,
          {
            headers: { 'Content-Type': 'text/html' },
            status: 400,
          }
        );
      }
    } else if (email) {
      player = await Player.findOne({ email: email.toLowerCase() });
    }

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Update email preferences
    if (!player.emailPreferences) {
      player.emailPreferences = {
        receiveLessonEmails: false,
        emailFrequency: 'never',
      };
    } else {
      player.emailPreferences.receiveLessonEmails = false;
      player.emailPreferences.emailFrequency = 'never';
    }

    await player.save();

    logger.info({ playerId: player._id }, 'Player unsubscribed from lesson emails via link');

    // Return HTML success page
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribed</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: #000;
              color: #fff;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: #2D2D2D;
              border-radius: 8px;
              border: 2px solid #FAB908;
            }
            h1 { color: #FAB908; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✓ Successfully Unsubscribed</h1>
            <p>You have been unsubscribed from lesson emails.</p>
            <p>You can re-enable emails in your account settings.</p>
          </div>
        </body>
      </html>
      `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (error) {
    logger.error({ error }, 'Failed to unsubscribe player via link');

    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
