/**
 * Admin Certificate Template Library API (#10)
 *
 * GET  /api/admin/certificate-templates — list templates
 * POST /api/admin/certificate-templates — create a template
 *
 * Admin only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import connectDB from '@/lib/mongodb';
import { CertificateTemplate } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be #RRGGBB').optional();

const CreateSchema = z.object({
  key: z.string().trim().toLowerCase().regex(/^[a-z0-9][a-z0-9_-]{1,63}$/, 'Key must be a slug'),
  name: z.string().trim().min(1).max(120),
  baseLayout: z.enum(['default', 'minimal']).default('default'),
  themeColors: z.object({ accent: hex, primary: hex, secondary: hex }).partial().optional(),
  backgroundUrl: z.string().url().optional(),
  description: z.string().trim().max(500).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    await connectDB();
    const templates = await CertificateTemplate.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, templates });
  } catch (error) {
    logger.error({ error }, 'Failed to list certificate templates');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    const parsed = CreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    await connectDB();
    const exists = await CertificateTemplate.findOne({ key: parsed.data.key }).lean();
    if (exists) return NextResponse.json({ error: 'A template with this key already exists' }, { status: 409 });

    const created = await CertificateTemplate.create(parsed.data);
    logger.info({ key: created.key }, 'Certificate template created');
    return NextResponse.json({ success: true, template: created }, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Failed to create certificate template');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
