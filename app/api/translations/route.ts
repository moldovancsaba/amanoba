import { NextRequest, NextResponse } from 'next/server';
import { getTranslationsForLocale } from '@/app/lib/i18n/translation-service';
import { defaultLocale, locales } from '@/i18n';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function deepMerge(base: any, override: any): any {
  if (Array.isArray(base)) return override ?? base;
  if (typeof base === 'object' && base !== null) {
    const result: any = { ...base };
    if (override && typeof override === 'object') {
      for (const key of Object.keys(override)) {
        result[key] = deepMerge(base[key], override[key]);
      }
    }
    return result;
  }
  return override !== undefined ? override : base;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale');

  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    return NextResponse.json({ success: false, error: 'Valid locale is required' }, { status: 400 });
  }

  const defaultMessages = (await import(`@/messages/${defaultLocale}.json`)).default;
  let localeMessages: Record<string, any> = defaultMessages;

  if (locale !== defaultLocale) {
    try {
      localeMessages = (await import(`@/messages/${locale}.json`)).default;
    } catch {
      localeMessages = {};
    }
  }

  const dbTranslations = await getTranslationsForLocale(locale);
  const merged = deepMerge(localeMessages, dbTranslations);

  return NextResponse.json({
    success: true,
    locale,
    messages: merged,
  });
}
