/**
 * Admin Certification Settings API
 *
 * What: Manage global certificate settings
 * Why: Admins configure certificate defaults in one place
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { CertificateSettings } from '@/lib/models';
import { checkAdminAccess } from '@/lib/auth/admin';
import { logger } from '@/lib/logger';
import { getOrCreateCertificateSettings } from '@/lib/certificates/settings';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await checkAdminAccess(session, '/api/admin/certification/settings');
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();
    const settings = await getOrCreateCertificateSettings();

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    logger.error({ error }, 'Failed to load certificate settings');
    return NextResponse.json({ error: 'Failed to load certificate settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminCheck = await checkAdminAccess(session, '/api/admin/certification/settings');
    if (adminCheck) {
      return adminCheck;
    }

    const payload = await request.json();
    await connectDB();

    const settings = await getOrCreateCertificateSettings();
    settings.isActive = Boolean(payload.isActive);
    settings.autoIssueOnCompletion = Boolean(payload.autoIssueOnCompletion);
    settings.locale = payload.locale || settings.locale;
    settings.designTemplateId = payload.designTemplateId || settings.designTemplateId;
    settings.credentialId = payload.credentialId || settings.credentialId;
    settings.completionPhraseId = payload.completionPhraseId || settings.completionPhraseId;
    settings.awardedPhraseId = payload.awardedPhraseId || settings.awardedPhraseId;
    if (Array.isArray(payload.deliverableBulletIds)) {
      settings.deliverableBulletIds = payload.deliverableBulletIds.slice(0, 4);
    }

    if (payload.price) {
      settings.price = {
        amount: Number(payload.price.amount || 0),
        currency: String(payload.price.currency || 'USD').toUpperCase(),
      };
    }

    settings.updatedBy = session.user.id as any;
    await settings.save();

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    logger.error({ error }, 'Failed to update certificate settings');
    return NextResponse.json({ error: 'Failed to update certificate settings' }, { status: 500 });
  }
}
