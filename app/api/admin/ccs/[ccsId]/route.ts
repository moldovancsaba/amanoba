/**
 * Admin CCS by id — get one CCS and its language-variant courses
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { CCS, Course } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';
import { checkRateLimit, adminRateLimiter } from '@/lib/security';

/**
 * GET /api/admin/ccs/[ccsId]
 * Single CCS plus language-variant courses (courses where ccsId = this).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ccsId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    await connectDB();
    const { ccsId } = await params;
    const id = ccsId?.toUpperCase();

    const ccs = await CCS.findOne({ ccsId: id }).lean();
    if (!ccs) {
      return NextResponse.json({ error: 'CCS not found' }, { status: 404 });
    }

    const courses = await Course.find({
      ccsId: id,
      parentCourseId: { $in: [null, undefined, ''] },
    })
      .select('courseId name language durationDays isActive isDraft')
      .sort({ language: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      ccs,
      courses,
      count: courses.length,
    });
  } catch (error) {
    logger.error({ error, ccsId: (await params).ccsId }, 'Failed to fetch CCS');
    return NextResponse.json({ error: 'Failed to fetch CCS' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/ccs/[ccsId]
 * Update CCS (idea, outline, relatedDocuments). Plan §10.1: if modified, related courses go draft.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ccsId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    await connectDB();
    const { ccsId } = await params;
    const id = ccsId?.toUpperCase();

    const ccs = await CCS.findOne({ ccsId: id });
    if (!ccs) {
      return NextResponse.json({ error: 'CCS not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));

    if (body.name !== undefined) ccs.name = String(body.name).trim();
    if (body.idea !== undefined) ccs.idea = String(body.idea).trim();
    if (body.outline !== undefined) ccs.outline = String(body.outline).trim();
    if (Array.isArray(body.relatedDocuments)) ccs.relatedDocuments = body.relatedDocuments;

    await ccs.save();

    if (body.idea !== undefined || body.outline !== undefined) {
      await Course.updateMany(
        { ccsId: id },
        { $set: { isDraft: true } }
      );
      logger.info({ ccsId: id }, 'CCS updated — related courses set to draft');
    }

    const updated = await CCS.findOne({ ccsId: id }).lean();
    return NextResponse.json({ success: true, ccs: updated });
  } catch (error) {
    logger.error({ error, ccsId: (await params).ccsId }, 'Failed to update CCS');
    return NextResponse.json({ error: 'Failed to update CCS' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/ccs/[ccsId]
 * Delete a CCS. Allowed only when no courses have this ccsId (so the list shows 0 variants).
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ccsId: string }> }
) {
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    await connectDB();
    const { ccsId } = await params;
    const id = ccsId?.toUpperCase();

    const linked = await Course.countDocuments({
      ccsId: id,
      $or: [
        { parentCourseId: { $in: [null, undefined, ''] } },
        { parentCourseId: { $exists: false } },
      ],
    });
    if (linked > 0) {
      return NextResponse.json(
        { error: `Cannot delete: ${linked} course(s) are linked to this CCS. Unlink or delete them first, or use a different CCS.` },
        { status: 400 }
      );
    }

    const ccs = await CCS.findOneAndDelete({ ccsId: id });
    if (!ccs) {
      return NextResponse.json({ error: 'CCS not found' }, { status: 404 });
    }

    logger.info({ ccsId: id }, 'Admin deleted CCS');
    return NextResponse.json({ success: true, deleted: id });
  } catch (error) {
    logger.error({ error, ccsId: (await params).ccsId }, 'Failed to delete CCS');
    return NextResponse.json({ error: 'Failed to delete CCS' }, { status: 500 });
  }
}
