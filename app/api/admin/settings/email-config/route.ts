/**
 * Admin Settings - Email Configuration API
 * 
 * What: Returns the current email provider metadata for the admin UI
 * Why: The Admin Settings page surfaces environment-driven provider info so admins know which provider is active
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { requireAdmin } from '@/lib/rbac';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const adminCheck = requireAdmin(request, session);
    if (adminCheck) {
      return adminCheck;
    }

    const emailProvider = (process.env.EMAIL_PROVIDER || 'resend').toLowerCase();

    const settings = {
      emailProvider,
      emailFrom: process.env.EMAIL_FROM || '',
      emailFromName: process.env.EMAIL_FROM_NAME || '',
      emailReplyTo: process.env.EMAIL_REPLY_TO || '',
      smtpHost: process.env.SMTP_HOST ?? null,
      smtpPort: process.env.SMTP_PORT ?? null,
      smtpSecure: process.env.SMTP_SECURE ?? null,
      mailgunDomain: process.env.MAILGUN_DOMAIN ?? null,
    };

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to read email configuration' },
      { status: 500 }
    );
  }
}
