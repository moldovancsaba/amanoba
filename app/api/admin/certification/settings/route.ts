/**
 * Admin Certification Settings API
 * 
 * What: Manages global certification settings
 * Why: Allows admins to configure certification defaults
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { CertificationSettings } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/certification/settings
 * 
 * What: Get global certification settings
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    // Get or create global settings
    let settings = await CertificationSettings.findOne({ key: 'global' }).lean();
    
    if (!settings) {
      // Create default settings if they don't exist
      const defaultSettings = await CertificationSettings.create({
        key: 'global',
        priceMoney: { amount: 0, currency: 'USD' },
        pricePoints: 0,
        templateId: 'default_v1',
        credentialTitleId: 'CERT',
        completionPhraseId: 'completion_final_exam',
        deliverableBulletIds: [],
      });
      settings = defaultSettings.toObject() as NonNullable<typeof settings>;
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch certification settings');
    return NextResponse.json(
      { error: 'Failed to fetch certification settings' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/certification/settings
 * 
 * What: Update global certification settings
 * Body: Partial ICertificationSettings (excluding key)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    const body = await request.json();
    const { priceMoney, pricePoints, templateId, credentialTitleId, completionPhraseId, deliverableBulletIds, backgroundUrl } = body;

    // Get or create global settings
    let settings = await CertificationSettings.findOne({ key: 'global' });
    
    if (!settings) {
      settings = await CertificationSettings.create({
        key: 'global',
        priceMoney: priceMoney || { amount: 0, currency: 'USD' },
        pricePoints: pricePoints || 0,
        templateId: templateId || 'default_v1',
        credentialTitleId: credentialTitleId || 'CERT',
        completionPhraseId: completionPhraseId || 'completion_final_exam',
        deliverableBulletIds: deliverableBulletIds || [],
        backgroundUrl: backgroundUrl || undefined,
      });
    } else {
      // Update existing settings
      if (priceMoney !== undefined) settings.priceMoney = priceMoney;
      if (pricePoints !== undefined) settings.pricePoints = pricePoints;
      if (templateId !== undefined) settings.templateId = templateId;
      if (credentialTitleId !== undefined) settings.credentialTitleId = credentialTitleId;
      if (completionPhraseId !== undefined) settings.completionPhraseId = completionPhraseId;
      if (deliverableBulletIds !== undefined) settings.deliverableBulletIds = deliverableBulletIds;
      if (backgroundUrl !== undefined) settings.backgroundUrl = backgroundUrl;
      
      await settings.save();
    }

    logger.info({ settings: settings.toObject() }, 'Certification settings updated');

    return NextResponse.json({
      success: true,
      settings: settings.toObject(),
    });
  } catch (error) {
    logger.error({ error }, 'Failed to update certification settings');
    return NextResponse.json(
      { error: 'Failed to update certification settings' },
      { status: 500 }
    );
  }
}
