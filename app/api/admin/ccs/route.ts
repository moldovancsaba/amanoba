/**
 * Admin CCS (Course Family) API
 * List and create CCS per §10.3
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { CCS } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';
import { checkRateLimit, adminRateLimiter } from '@/lib/security';

/**
 * GET /api/admin/ccs
 * List all CCS (course families).
 */
export async function GET(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    await connectDB();

    const list = await CCS.find({})
      .sort({ createdAt: -1 })
      .lean();

    logger.info({ count: list.length }, 'Admin fetched CCS list');

    return NextResponse.json({
      success: true,
      ccs: list,
      count: list.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch CCS');
    return NextResponse.json({ error: 'Failed to fetch CCS' }, { status: 500 });
  }
}

/**
 * POST /api/admin/ccs
 * Create a new CCS (course family).
 */
export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    await connectDB();

    const body = await request.json().catch(() => ({}));
    const ccsId = (body.ccsId as string)?.toUpperCase()?.trim();
    const name = (body.name as string)?.trim();
    const idea = (body.idea as string)?.trim();
    const outline = (body.outline as string)?.trim();

    if (!ccsId || !/^[A-Z0-9_]+$/.test(ccsId)) {
      return NextResponse.json(
        { error: 'ccsId is required and must contain only uppercase letters, numbers, and underscores' },
        { status: 400 }
      );
    }

    const existing = await CCS.findOne({ ccsId });
    if (existing) {
      return NextResponse.json({ error: 'CCS with this ccsId already exists' }, { status: 409 });
    }

    const ccs = await CCS.create({
      ccsId,
      name: name || ccsId,
      idea: idea || undefined,
      outline: outline || undefined,
      relatedDocuments: body.relatedDocuments || [],
    });

    logger.info({ ccsId: ccs.ccsId }, 'Admin created CCS');

    return NextResponse.json({ success: true, ccs });
  } catch (error) {
    logger.error({ error }, 'Failed to create CCS');
    return NextResponse.json({ error: 'Failed to create CCS' }, { status: 500 });
  }
}
