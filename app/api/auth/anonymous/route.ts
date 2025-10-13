/**
 * Anonymous Guest Login API
 * 
 * Creates or retrieves an anonymous guest player account.
 * Returns session token for immediate gameplay.
 * 
 * Why: Frictionless onboarding - let users play without registration
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getRandomGuestUsername, createAnonymousPlayer } from '@/lib/utils/anonymous-auth';
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
    
    // Return player data
    if (!player) {
      throw new Error('Failed to create player');
    }
    
    return NextResponse.json({
      success: true,
      player: {
        id: player._id.toString(),
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
