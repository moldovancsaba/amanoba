/**
 * Admin i18n Settings API
 *
 * What: Manage brand-level supported languages and default language
 * Why: Allows admin settings UI to update internationalization preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import { Brand } from '@/lib/models';
import { logger } from '@/lib/logger';
import { requireAdmin } from '@/lib/rbac';
import { locales, type Locale } from '@/app/lib/i18n/locales';

const DEFAULT_BRAND_SLUG = 'amanoba';

const getDefaultBrand = async () => {
  let brand = await Brand.findOne({ isActive: true }).sort({ createdAt: 1 });
  if (!brand) {
    brand = await Brand.findOne({ slug: DEFAULT_BRAND_SLUG });
  }
  return brand;
};

const normalizeLanguageList = (langs: string[]) => {
  const deduped = Array.from(new Set(langs.map((lang) => lang.trim().toLowerCase())));
  return deduped.filter((lang) => locales.includes(lang as Locale));
};

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    await connectDB();

    const brand = await getDefaultBrand();
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      settings: {
        supportedLanguages: brand.supportedLanguages || [],
        defaultLanguage: brand.defaultLanguage || 'en',
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch i18n settings');
    return NextResponse.json({ error: 'Failed to fetch language settings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    const body = await request.json();
    const supportedLanguages = Array.isArray(body?.supportedLanguages) ? body.supportedLanguages : null;
    const defaultLanguage = typeof body?.defaultLanguage === 'string' ? body.defaultLanguage.trim().toLowerCase() : null;

    if (!supportedLanguages || !defaultLanguage) {
      return NextResponse.json({ error: 'Supported languages and default language are required' }, { status: 400 });
    }

    const normalizedSupported = normalizeLanguageList(supportedLanguages);
    if (normalizedSupported.length === 0) {
      return NextResponse.json({ error: 'At least one supported language is required' }, { status: 400 });
    }

    if (!normalizedSupported.includes(defaultLanguage)) {
      return NextResponse.json({ error: 'Default language must be included in supported languages' }, { status: 400 });
    }

    await connectDB();

    const brand = await getDefaultBrand();
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    brand.supportedLanguages = normalizedSupported;
    brand.defaultLanguage = defaultLanguage;
    await brand.save();

    return NextResponse.json({
      success: true,
      settings: {
        supportedLanguages: brand.supportedLanguages,
        defaultLanguage: brand.defaultLanguage,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to update i18n settings');
    return NextResponse.json({ error: 'Failed to update language settings' }, { status: 500 });
  }
}
