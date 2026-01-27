/**
 * Admin Create Short (fork) API
 * POST /api/admin/courses/fork — create child course from parent with selected lessons.
 * Per plan §10.5: courseId = {parentCourseId}_{courseVariant}, isDraft: true.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';
import { checkRateLimit, adminRateLimiter } from '@/lib/security';

const SHORT_TYPES: Array<{ min: number; max: number; variant: string; label: string }> = [
  { min: 1, max: 3, variant: 'essentials', label: 'Essentials' },
  { min: 4, max: 7, variant: 'beginner', label: 'Beginner Course' },
  { min: 8, max: 12, variant: 'foundations', label: 'Foundations' },
  { min: 13, max: 20, variant: 'core_skills', label: 'Core Skills' },
  { min: 21, max: 999, variant: 'full_program', label: 'Full Program' },
];

function getShortType(count: number): { variant: string; label: string } {
  const t = SHORT_TYPES.find((r) => count >= r.min && count <= r.max);
  return t ? { variant: t.variant, label: t.label } : { variant: 'full_program', label: 'Full Program' };
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    await connectDB();

    const body = await request.json().catch(() => ({}));
    const parentCourseId = (body.parentCourseId as string)?.toUpperCase()?.trim();
    const selectedLessonIds = Array.isArray(body.selectedLessonIds)
      ? (body.selectedLessonIds as string[]).filter((id) => typeof id === 'string' && id.trim())
      : [];
    const certQuestionCount = typeof body.certQuestionCount === 'number' ? body.certQuestionCount : 25;

    if (!parentCourseId) {
      return NextResponse.json({ error: 'parentCourseId is required' }, { status: 400 });
    }
    if (selectedLessonIds.length === 0) {
      return NextResponse.json({ error: 'selectedLessonIds must be a non-empty array of lesson _ids' }, { status: 400 });
    }

    const parent = await Course.findOne({ courseId: parentCourseId });
    if (!parent) {
      return NextResponse.json({ error: 'Parent course not found' }, { status: 404 });
    }
    if (parent.parentCourseId) {
      return NextResponse.json({ error: 'Parent must be a language-variant course (no parentCourseId)' }, { status: 400 });
    }

    const { variant, label } = getShortType(selectedLessonIds.length);
    const childCourseId = `${parentCourseId}_${variant}`;

    const existing = await Course.findOne({ courseId: childCourseId });
    if (existing) {
      return NextResponse.json(
        { error: `Short "${childCourseId}" already exists. Delete or use a different lesson selection.` },
        { status: 409 }
      );
    }

    const parentBase = parent.name || parent.courseId;
    const childName = `${parentBase}: ${label}`;

    const child = await Course.create({
      courseId: childCourseId,
      name: childName,
      description: parent.description || `${parentBase} — ${label} short course`,
      language: parent.language,
      thumbnail: parent.thumbnail,
      durationDays: selectedLessonIds.length,
      isActive: parent.isActive,
      requiresPremium: parent.requiresPremium,
      price: parent.price,
      brandId: parent.brandId,
      pointsConfig: parent.pointsConfig,
      xpConfig: parent.xpConfig,
      metadata: parent.metadata || {},
      translations: parent.translations,
      parentCourseId,
      selectedLessonIds,
      courseVariant: variant,
      ccsId: parent.ccsId,
      isDraft: true,
      certification: {
        ...parent.certification,
        enabled: parent.certification?.enabled ?? false,
        poolCourseId: parent.courseId,
        certQuestionCount: certQuestionCount >= 1 ? certQuestionCount : 25,
      },
    });

    logger.info(
      { parentCourseId, childCourseId, lessonCount: selectedLessonIds.length, variant },
      'Admin created short (fork)'
    );

    return NextResponse.json({ success: true, course: child }, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Failed to create short (fork)');
    return NextResponse.json({ error: 'Failed to create short course' }, { status: 500 });
  }
}
