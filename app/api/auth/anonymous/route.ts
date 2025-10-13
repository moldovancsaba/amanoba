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
import { generateAnonymousUsername, createAnonymousPlayer } from '@/lib/utils/anonymous-auth';
import logger from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // Generate random 3-word username
    const username = await generateAnonymousUsername();
    logger.info(`Generated anonymous username: ${username}`);
    
    // Create or retrieve player
    const { player, isNew } = await createAnonymousPlayer(username);
    
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
    logger.error(`Anonymous login failed: ${error}`);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create anonymous session' 
      },
      { status: 500 }
    );
  }
}
