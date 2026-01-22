/**
 * Certificate Render API (PNG)
 *
 * What: Render certificate to PNG for sharing
 * Why: LinkedIn-friendly image and preview support
 */

import { ImageResponse } from 'next/og';
import { NextResponse } from 'next/server';
import { getTemplateById } from '@/lib/certificates/utils';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: { certificateId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'png';
    const variant = searchParams.get('variant') || 'share_1200x627';

    if (format !== 'png') {
      return NextResponse.json({ success: false, error: 'Only PNG is supported' }, { status: 400 });
    }

    if (variant !== 'share_1200x627') {
      return NextResponse.json(
        { success: false, error: 'Unsupported variant. Use share_1200x627.' },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      'http://localhost:3000';

    const dataResponse = await fetch(
      `${baseUrl}/api/certificates/${params.certificateId}/public`,
      { cache: 'no-store' }
    );

    if (!dataResponse.ok) {
      return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
    }

    const data = await dataResponse.json();
    const cert = data.certificate;

    const width = 1200;
    const height = 627;
    const template = getTemplateById(cert.designTemplateId || 'modernMinimal_v1');
    const accent = template.accent;
    const background = template.background;
    const text = template.text;
    const muted = template.muted;
    const score = cert.finalExamScorePercentInteger;
    const isRevoked = cert.isRevoked;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background,
            color: text,
            display: 'flex',
            flexDirection: 'column',
            padding: '48px',
            fontFamily: 'Inter, Arial, sans-serif',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {isRevoked ? (
            <div
              style={{
                position: 'absolute',
                top: 32,
                right: 32,
                padding: '10px 16px',
                background: '#B91C1C',
                color: '#FEE2E2',
                borderRadius: 10,
                fontWeight: 800,
                letterSpacing: 0.5,
              }}
            >
              REVOKED
            </div>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 0.5 }}>Amanoba</div>
            <div style={{ fontSize: 16, color: muted }}>{cert.certificateNumber || cert.certificateId}</div>
          </div>
          <div style={{ marginTop: 48 }}>
            <div style={{ fontSize: 16, color: muted, textTransform: 'uppercase', letterSpacing: 1.2 }}>
              Certificate of Completion
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, marginTop: 12, color: accent }}>
              {cert.recipientName}
            </div>
            <div style={{ fontSize: 20, marginTop: 12 }}>
              {cert.completionPhrase}
            </div>
            <div style={{ fontSize: 18, marginTop: 8, color: muted }}>
              {cert.courseTitle}
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 16, color: muted, fontSize: 16, alignItems: 'center' }}>
              <span>Issued: {new Date(cert.issuedAtISO).toLocaleDateString('en-US')}</span>
              {typeof score === 'number' ? (
                <span style={{ color: '#FDE68A', fontWeight: 700 }}>Score: {score}%</span>
              ) : null}
            </div>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 16, color: muted }}>amanoba.com</div>
            <div
              style={{
                padding: '10px 16px',
                background: accent,
                color: '#111827',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Verify: amanoba.com/certificate/{cert.verificationSlug}
            </div>
          </div>
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Failed to render certificate' }, { status: 500 });
  }
}
