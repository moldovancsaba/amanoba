import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';
import CertificationSettings, { type ICertificationSettings } from '@/lib/models/certification-settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function ensureSettings(): Promise<ICertificationSettings> {
  const settings = await CertificationSettings.findOne().lean();
  if (settings) {
    return settings;
  }
  const created = await CertificationSettings.create({});
  return created;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const adminCheck = requireAdmin(request, session);
  if (!adminCheck.success) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: 403 });
  }

  await connectDB();
  const settings = await ensureSettings();

  return NextResponse.json({ success: true, data: settings });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const adminCheck = requireAdmin(request, session);
  if (!adminCheck.success) {
    return NextResponse.json({ success: false, error: adminCheck.error }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  await connectDB();
  const settings = await ensureSettings();

  const mutableFields: (keyof ICertificationSettings)[] = [
    'questionCount',
    'passPercentExclusive',
    'randomizeSelection',
    'randomizeQuestionOrder',
    'randomizeAnswerOrder',
    'oneSittingOnly',
    'discardOnLeave',
    'showWrongQuestionsOnFail',
    'showCorrectAnswersOnFail',
    'certificateScorePolicy',
    'revokeAtOrBelowPercent',
    'shareImageSize',
    'verificationPrivacyMode',
    'paywallEnabled',
    'premiumIncludesCertification',
    'paywallCopy',
  ];

  for (const field of mutableFields) {
    if (body[field] !== undefined) {
      (settings as any)[field] = body[field];
    }
  }

  await settings.save();

  return NextResponse.json({ success: true, data: settings });
}
