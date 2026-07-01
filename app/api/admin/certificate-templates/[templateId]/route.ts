/**
 * Admin Certificate Template item API (#10)
 *
 * PATCH  /api/admin/certificate-templates/[templateId] — update
 * DELETE /api/admin/certificate-templates/[templateId] — remove
 *
 * Admin only. templateId is the Mongo _id.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import connectDB from '@/lib/mongodb';
import { CertificateTemplate } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be #RRGGBB').optional();

// key is immutable (it is the stored designTemplateId on issued certs).
const UpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  baseLayout: z.enum(['default', 'minimal']).optional(),
  themeColors: z.object({ accent: hex, primary: hex, secondary: hex }).partial().optional(),
  backgroundUrl: z.string().url().nullable().optional(),
  description: z.string().trim().max(500).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ templateId: string }> }) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    const { templateId } = await params;
    if (!mongoose.isValidObjectId(templateId)) {
      return NextResponse.json({ error: 'Invalid template id' }, { status: 400 });
    }

    const parsed = UpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    await connectDB();
    const updated = await CertificateTemplate.findByIdAndUpdate(templateId, { $set: parsed.data }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    return NextResponse.json({ success: true, template: updated });
  } catch (error) {
    logger.error({ error }, 'Failed to update certificate template');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ templateId: string }> }) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) return adminCheck;

    const { templateId } = await params;
    if (!mongoose.isValidObjectId(templateId)) {
      return NextResponse.json({ error: 'Invalid template id' }, { status: 400 });
    }

    await connectDB();
    const deleted = await CertificateTemplate.findByIdAndDelete(templateId).lean();
    if (!deleted) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ error }, 'Failed to delete certificate template');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
