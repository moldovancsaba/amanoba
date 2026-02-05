/**
 * Admin Courses API
 * 
 * What: REST endpoints for course management
 * Why: Allows admins to create, read, update, and delete courses
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Course, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin, requireAdminOrEditor, getPlayerIdFromSession, isAdmin } from '@/lib/rbac';
import mongoose from 'mongoose';
import { checkRateLimit, adminRateLimiter } from '@/lib/security';
import { DEFAULT_BRAND_THEME_COLORS } from '@/app/lib/constants/color-tokens';

/**
 * GET /api/admin/courses
 *
 * What: List all courses with optional filtering (admins see all; editors see only their courses)
 * Why: Display courses in admin dashboard
 */
export async function GET(request: NextRequest) {
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const session = await auth();
    const accessCheck = await requireAdminOrEditor(request, session);
    if (accessCheck) {
      return accessCheck;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'all' | 'active' | 'inactive'
    const language = searchParams.get('language');
    const search = searchParams.get('search');
    const parentCourseId = searchParams.get('parentCourseId'); // list children of this parent

    const query: Record<string, unknown> = {};

    if (parentCourseId) {
      query.parentCourseId = parentCourseId.toUpperCase();
    }
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    if (language) {
      query.language = language;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { courseId: { $regex: search, $options: 'i' } },
      ];
    }

    // Editors see only courses they created or are assigned to
    let finalQuery: Record<string, unknown> = query;
    if (!isAdmin(session)) {
      const playerId = getPlayerIdFromSession(session);
      if (playerId) {
        const pid = new mongoose.Types.ObjectId(playerId);
        const editorFilter = { $or: [{ createdBy: pid }, { assignedEditors: pid }] };
        finalQuery = Object.keys(query).length > 0 ? { $and: [query, editorFilter] } : editorFilter;
      }
    }

    const courses = await Course.find(finalQuery)
      .sort({ createdAt: -1 })
      .lean();

    logger.info({ count: courses.length, filters: { status, language, search } }, 'Admin fetched courses');

    return NextResponse.json({
      success: true,
      courses,
      count: courses.length,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch courses');
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/courses
 * 
 * What: Create a new course
 * Why: Allow admins to create courses via API
 */
export async function POST(request: NextRequest) {
  // Rate limiting: 50 requests per 15 minutes per IP (admin endpoints)
  const rateLimitResponse = await checkRateLimit(request, adminRateLimiter);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Auth and admin role check
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    const body = await request.json();
    const {
      courseId,
      name,
      description,
      language = 'hu',
      thumbnail,
      requiresPremium = false,
      ccsId,
      brandId,
      pointsConfig,
      xpConfig,
      metadata,
      translations,
    } = body;

    // Validate required fields
    if (!courseId || !name || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: courseId, name, description' },
        { status: 400 }
      );
    }

    // Check if courseId already exists
    const existing = await Course.findOne({ courseId });
    if (existing) {
      return NextResponse.json(
        { error: 'Course ID already exists' },
        { status: 400 }
      );
    }

    // Validate ccsId (optional): uppercase letters, numbers, underscores
    if (ccsId != null) {
      const raw = String(ccsId).trim();
      if (raw.length > 0 && !/^[A-Z0-9_]+$/.test(raw.toUpperCase())) {
        return NextResponse.json(
          { error: 'Invalid ccsId. Use uppercase letters, numbers, and underscores (e.g. PRODUCTIVITY_2026).' },
          { status: 400 }
        );
      }
    }

    // Get or create default brand
    let finalBrandId = brandId;
    if (!finalBrandId) {
      // Find or create default Amanoba brand
      let defaultBrand = await Brand.findOne({ name: 'Amanoba', isActive: true });
      if (!defaultBrand) {
        defaultBrand = new Brand({
          name: 'Amanoba',
          slug: 'amanoba',
          displayName: 'Amanoba',
          isActive: true,
          themeColors: {
            ...DEFAULT_BRAND_THEME_COLORS,
          },
          allowedDomains: ['amanoba.com', 'www.amanoba.com'],
          supportedLanguages: ['hu', 'en'],
          defaultLanguage: 'hu',
        });
        await defaultBrand.save();
      }
      finalBrandId = defaultBrand._id;
    } else if (!mongoose.Types.ObjectId.isValid(finalBrandId)) {
      return NextResponse.json(
        { error: 'Invalid brandId format' },
        { status: 400 }
      );
    } else {
      // Verify brand exists
      const brandExists = await Brand.findById(finalBrandId);
      if (!brandExists) {
        return NextResponse.json(
          { error: 'Brand not found' },
          { status: 400 }
        );
      }
    }

    // Create course
    const course = new Course({
      courseId,
      name,
      description,
      language,
      thumbnail,
      durationDays: 30, // Always 30 for standard courses
      isActive: false, // Start as inactive (draft)
      requiresPremium,
      ccsId: typeof ccsId === 'string' && ccsId.trim() ? ccsId.trim().toUpperCase() : undefined,
      brandId: finalBrandId,
      pointsConfig: pointsConfig || {
        completionPoints: 1000,
        lessonPoints: 50,
        perfectCourseBonus: 500,
      },
      xpConfig: xpConfig || {
        completionXP: 500,
        lessonXP: 25,
      },
      metadata: metadata || {},
      translations: translations || {},
    });

    await course.save();

    logger.info({ courseId, name }, 'Admin created course');

    return NextResponse.json({
      success: true,
      course,
    }, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Failed to create course');
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
