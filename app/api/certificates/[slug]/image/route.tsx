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
import { CERT_COLORS_DEFAULT, type CertColors } from '@/app/lib/constants/certificate-colors';
import { getCertificateStrings, formatCertificateDate } from '@/app/lib/constants/certificate-strings';
import { mapDesignTemplateIdToRender } from '@/lib/certification';
import { SEMANTIC_COLORS } from '@/app/lib/constants/color-tokens';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type TemplateId = 'default' | 'minimal';

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
    const localeParam = searchParams.get('locale');
    const stringsRevoked = getCertificateStrings(localeParam || 'en');

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
              background: CERT_COLORS_DEFAULT.bgStart,
              color: SEMANTIC_COLORS.error,
              fontSize: 32,
              fontWeight: 'bold',
            }}
          >
            {stringsRevoked.revoked}
          </div>
        ),
        { width: 1200, height: 627 }
      );
    }

    const course = await Course.findOne({ courseId: certificate.courseId }).lean();
    let certColors: CertColors = { ...CERT_COLORS_DEFAULT };
    const courseCert = course?.certification as { themeColors?: { primary?: string; secondary?: string; accent?: string } } | undefined;
    if (!courseCert?.themeColors?.accent && course?.brandId) {
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
    if (courseCert?.themeColors?.accent && /^#[0-9a-fA-F]{6}$/.test(courseCert.themeColors.accent)) {
      certColors = {
        ...certColors,
        border: courseCert.themeColors.accent,
        accent: courseCert.themeColors.accent,
        titleGradientEnd: courseCert.themeColors.accent,
        borderMuted: `${courseCert.themeColors.accent}4D`,
      };
    }
    if (courseCert?.themeColors?.primary && /^#[0-9a-fA-F]{6}$/.test(courseCert.themeColors.primary)) {
      certColors = { ...certColors, bgStart: courseCert.themeColors.primary };
    }
    if (courseCert?.themeColors?.secondary && /^#[0-9a-fA-F]{6}$/.test(courseCert.themeColors.secondary)) {
      certColors = { ...certColors, bgMid: courseCert.themeColors.secondary };
    }

    const locale = localeParam || (course as { language?: string })?.language || 'en';
    const strings = getCertificateStrings(locale);
    const issuedDate = formatCertificateDate(new Date(certificate.issuedAtISO), locale);
    // Use certificate.designTemplateId (variant assigned at issue) so each cert renders with its variant
    const templateId: TemplateId = mapDesignTemplateIdToRender(certificate.designTemplateId);
    const isMinimal = templateId === 'minimal';

    logger.info({ slug, variant, locale, templateId }, 'Certificate image by slug');

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
              border: `${isMinimal ? 4 : 8}px solid ${certColors.border}`,
              borderRadius: isMinimal ? '8px' : '16px',
            }}
          />
          {!isMinimal && (
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
          )}
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
                fontSize: variant === 'print_a4' ? (isMinimal ? 52 : 72) : (isMinimal ? 42 : 56),
                fontWeight: 'bold',
                background: `linear-gradient(90deg, ${certColors.accent} 0%, ${certColors.titleGradientEnd} 100%)`,
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: isMinimal ? '24px' : '40px',
                lineHeight: 1.2,
              }}
            >
              {strings.title}
            </div>
            {!isMinimal && (
              <div
                style={{
                  width: '200px',
                  height: '4px',
                  background: `linear-gradient(90deg, transparent 0%, ${certColors.accent} 50%, transparent 100%)`,
                  marginBottom: '60px',
                }}
              />
            )}
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
              {strings.certifyThat}
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
              {strings.hasCompleted}
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
                {strings.finalExamScore}: {certificate.finalExamScorePercentInteger}%
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
