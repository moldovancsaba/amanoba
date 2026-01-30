/**
 * Certificate Image by Slug (Shareable / OG)
 *
 * What: Serves certificate image by verification slug for social sharing and Open Graph
 * Why: Shareable public URL (e.g. /api/certificates/abc123/image) for LinkedIn/social previews
 *
 * GET /api/certificates/[slug]/image
 * Query: variant=share_1200x627 (default) | print_a4
 */

import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import connectDB from '@/lib/mongodb';
import { Certificate, Course, Brand } from '@/lib/models';
import { logger } from '@/lib/logger';
import { SECONDARY_HEX } from '@/app/lib/constants/app-url';

const CERT_COLORS_DEFAULT = {
  bgStart: '#1a1a1a',
  bgMid: SECONDARY_HEX,
  border: '#FFD700',
  borderMuted: 'rgba(255, 215, 0, 0.3)',
  titleGradientEnd: '#FFA500',
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  accent: '#FFD700',
  footer: '#999999',
} as const;
type CertColors = { [K in keyof typeof CERT_COLORS_DEFAULT]: string };

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return new Response('Slug is required', { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const variant = searchParams.get('variant') || 'share_1200x627';
    const dimensions =
      variant === 'print_a4'
        ? { width: 1200, height: 1697 }
        : { width: 1200, height: 627 };

    await connectDB();

    const certificate = await Certificate.findOne({ verificationSlug: slug }).lean();
    if (!certificate) {
      return new Response('Certificate not found', { status: 404 });
    }
    if (certificate.isRevoked) {
      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1a1a1a',
              color: '#ef4444',
              fontSize: 32,
              fontWeight: 'bold',
            }}
          >
            Certificate revoked
          </div>
        ),
        { width: 1200, height: 627 }
      );
    }

    const course = await Course.findOne({ courseId: certificate.courseId }).lean();
    let certColors: CertColors = { ...CERT_COLORS_DEFAULT };
    if (course?.brandId) {
      const brand = await Brand.findById(course.brandId).lean();
      if (brand?.themeColors?.accent) {
        certColors = {
          ...certColors,
          border: brand.themeColors.accent,
          accent: brand.themeColors.accent,
          titleGradientEnd: brand.themeColors.accent,
          borderMuted: `${brand.themeColors.accent}4D`,
        };
      }
      if (brand?.themeColors?.primary && /^#[0-9a-fA-F]{6}$/.test(brand.themeColors.primary)) {
        certColors = { ...certColors, bgStart: brand.themeColors.primary };
      }
      if (brand?.themeColors?.secondary && /^#[0-9a-fA-F]{6}$/.test(brand.themeColors.secondary)) {
        certColors = { ...certColors, bgMid: brand.themeColors.secondary };
      }
    }

    const issuedDate = new Date(certificate.issuedAtISO).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    logger.info({ slug, variant }, 'Certificate image by slug');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${certColors.bgStart} 0%, ${certColors.bgMid} 50%, ${certColors.bgStart} 100%)`,
            position: 'relative',
            padding: '80px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: `8px solid ${certColors.border}`,
              borderRadius: '16px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              right: '8px',
              bottom: '8px',
              border: `4px solid ${certColors.borderMuted}`,
              borderRadius: '12px',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: variant === 'print_a4' ? 72 : 56,
                fontWeight: 'bold',
                background: `linear-gradient(90deg, ${certColors.accent} 0%, ${certColors.titleGradientEnd} 100%)`,
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: '40px',
                lineHeight: 1.2,
              }}
            >
              Certificate of Completion
            </div>
            <div
              style={{
                width: '200px',
                height: '4px',
                background: `linear-gradient(90deg, transparent 0%, ${certColors.accent} 50%, transparent 100%)`,
                marginBottom: '60px',
              }}
            />
            <div
              style={{
                fontSize: variant === 'print_a4' ? 48 : 36,
                fontWeight: 'bold',
                color: certColors.textPrimary,
                marginBottom: '40px',
                lineHeight: 1.3,
                maxWidth: '90%',
              }}
            >
              {certificate.courseTitle}
            </div>
            <div
              style={{
                fontSize: variant === 'print_a4' ? 32 : 24,
                color: certColors.textSecondary,
                marginBottom: '20px',
              }}
            >
              This is to certify that
            </div>
            <div
              style={{
                fontSize: variant === 'print_a4' ? 56 : 42,
                fontWeight: 'bold',
                color: certColors.accent,
                marginBottom: '20px',
                lineHeight: 1.2,
              }}
            >
              {certificate.recipientName}
            </div>
            <div
              style={{
                fontSize: variant === 'print_a4' ? 32 : 24,
                color: certColors.textSecondary,
                marginBottom: '60px',
              }}
            >
              has successfully completed the course
            </div>
            {certificate.finalExamScorePercentInteger != null && (
              <div
                style={{
                  fontSize: variant === 'print_a4' ? 40 : 32,
                  color: certColors.accent,
                  marginBottom: '40px',
                  fontWeight: 'bold',
                }}
              >
                Final Exam Score: {certificate.finalExamScorePercentInteger}%
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                bottom: '60px',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 80px',
                fontSize: variant === 'print_a4' ? 20 : 16,
                color: certColors.footer,
              }}
            >
              <div>ID: {certificate.certificateId}</div>
              <div>{issuedDate}</div>
            </div>
          </div>
        </div>
      ),
      { ...dimensions }
    );
  } catch (error) {
    logger.error({ error, slug: (await params).slug }, 'Certificate image by slug failed');
    return new Response('Failed to generate image', { status: 500 });
  }
}
