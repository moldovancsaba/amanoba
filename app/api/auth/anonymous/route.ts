/**
 * Anonymous Guest Login API
 * 
 * Creates or retrieves an anonymous guest player account and signs them in.
 * Uses NextAuth session for consistency with Facebook login.
 * 
 * Why: Frictionless onboarding - let users play without registration
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getRandomGuestUsername, createAnonymousPlayer } from '@/lib/utils/anonymous-auth';
import { logAuthEvent } from '@/lib/analytics';
import logger from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    logger.info('Starting anonymous login request');
    
    await connectDB();
    logger.info('Database connected');
    
    // Get random pre-generated guest username
    const username = await getRandomGuestUsername();
    logger.info(`Selected guest username: ${username}`);
    
    // Create or retrieve player
    const { player, isNew } = await createAnonymousPlayer(username);
    logger.info(`Player ${isNew ? 'created' : 'retrieved'}: ${username}`);
    
    if (!player) {
      throw new Error('Failed to create player');
    }
    
    // Log authentication event
    await logAuthEvent(
      player._id.toString(),
      (player.brandId as any).toString(),
      'login' // Log as login for both new and returning anonymous users
    );
    
    const playerId = player._id.toString();
    
    logger.info(`Anonymous player ready: ${username}`);
    
    // Return player credentials for client-side signIn
    // Why: Client will call NextAuth signIn with these credentials
    return NextResponse.json({
      success: true,
      credentials: {
        playerId,
        displayName: player.displayName,
        isAnonymous: 'true',
      },
      player: {
        id: playerId,
        displayName: player.displayName,
        isAnonymous: true,
        isNew,
      },
      message: isNew 
        ? `Welcome, ${player.displayName}!` 
        : `Welcome back, ${player.displayName}!`,
    }, { status: 200 });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    logger.error(`Anonymous login failed: ${errorMessage}`);
    if (errorStack) {
      logger.error(`Stack trace: ${errorStack}`);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create anonymous session',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
