/**
 * Certificate Image Generation API
 * 
 * What: Generates PNG certificate images using next/og ImageResponse
 * Why: Allows users to download and share certificate images
 * 
 * Endpoint: GET /api/profile/[playerId]/certificate/[courseId]/image
 * 
 * Query Parameters:
 * - variant: 'share_1200x627' (default) or 'print_a4'
 * 
 * Returns: PNG image
 */

import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import {
  Player,
  Course,
  FinalExamAttempt,
  Brand,
  Certificate,
} from '@/lib/models';
import { mapDesignTemplateIdToRender } from '@/lib/certification';
import { logger } from '@/lib/logger';
import { CERT_COLORS_DEFAULT, type CertColors } from '@/app/lib/constants/certificate-colors';
import { getCertificateStrings, formatCertificateDate } from '@/app/lib/constants/certificate-strings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type TemplateId = 'default' | 'minimal';

/**
 * GET /api/profile/[playerId]/certificate/[courseId]/image
 * 
 * Generates a PNG certificate image.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string; courseId: string }> }
) {
  try {
    const { playerId, courseId } = await params;

    if (!playerId || !courseId) {
      return new Response('Player ID and Course ID are required', { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const variant = searchParams.get('variant') || 'share_1200x627';

    // Dimensions based on variant
    const dimensions = variant === 'print_a4' 
      ? { width: 1200, height: 1697 } // A4 ratio (1:1.414)
      : { width: 1200, height: 627 }; // LinkedIn/social ratio (1.91:1)

    logger.info({ playerId, courseId, variant }, 'Generating certificate image');

    await connectDB();

    // Fetch data (courseId in URL is the course's courseId string)
    const [player, course, certificate] = await Promise.all([
      Player.findById(playerId).lean(),
      Course.findOne({ courseId }).lean(),
      Certificate.findOne({ playerId, courseId, isRevoked: { $ne: true } }).lean(),
    ]);

    if (!player || !course) {
      return new Response('Player or course not found', { status: 404 });
    }

    // Resolve colors: per-course certification.themeColors > Brand themeColors > defaults
    let certColors: CertColors = { ...CERT_COLORS_DEFAULT };
    const courseCert = course.certification as { themeColors?: { primary?: string; secondary?: string; accent?: string } } | undefined;
    if (!courseCert?.themeColors?.accent && course.brandId) {
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

    // Get final exam score
    const finalExamAttempt = await FinalExamAttempt.findOne({
      playerId: new mongoose.Types.ObjectId(playerId),
      courseId: course._id,
      status: 'GRADED',
    })
      .sort({ submittedAtISO: -1 })
      .lean();

    const finalExamScore = finalExamAttempt?.scorePercentInteger || null;
    const playerName = player.displayName || 'Unknown';
    const courseTitle = course.name || course.courseId;
    const locale = searchParams.get('locale') || (course as { language?: string })?.language || 'en';
    const strings = getCertificateStrings(locale);
    const issuedDate = certificate?.issuedAtISO
      ? formatCertificateDate(new Date(certificate.issuedAtISO), locale)
      : formatCertificateDate(new Date(), locale);
    // Use certificate.designTemplateId when issued cert exists (A/B variant); else course template for preview
    const templateId: TemplateId = certificate?.designTemplateId
      ? mapDesignTemplateIdToRender(certificate.designTemplateId)
      : ((course as { certification?: { templateId?: string } }).certification?.templateId as TemplateId) === 'minimal'
        ? 'minimal'
        : 'default';

    // Generate certificate ID
    const certificateId = `${playerId.slice(-8)}-${courseId.slice(-8)}`.toUpperCase();

    const isMinimal = templateId === 'minimal';

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
          {/* Decorative border (skip inner border for minimal) */}
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

          {/* Main content */}
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
            {/* Certificate Title */}
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

            {/* Decorative line (skip for minimal) */}
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

            {/* Course Title */}
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
              {courseTitle}
            </div>

            {/* Awarded to */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? 32 : 24,
                color: certColors.textSecondary,
                marginBottom: '20px',
              }}
            >
              {strings.certifyThat}
            </div>

            {/* Player Name */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? 56 : 42,
                fontWeight: 'bold',
                color: certColors.accent,
                marginBottom: '20px',
                lineHeight: 1.2,
              }}
            >
              {playerName}
            </div>

            {/* Completion text */}
            <div
              style={{
                fontSize: variant === 'print_a4' ? 32 : 24,
                color: certColors.textSecondary,
                marginBottom: '60px',
              }}
            >
              {strings.hasCompleted}
            </div>

            {/* Score (if available) */}
            {finalExamScore !== null && (
              <div
                style={{
                  fontSize: variant === 'print_a4' ? 40 : 32,
                  color: certColors.accent,
                  marginBottom: '40px',
                  fontWeight: 'bold',
                }}
              >
                {strings.finalExamScore}: {finalExamScore}%
              </div>
            )}

            {/* Footer */}
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
              <div>ID: {certificateId}</div>
              <div>{issuedDate}</div>
            </div>
          </div>
        </div>
      ),
      {
        ...dimensions,
      }
    );
  } catch (error) {
    logger.error({ error }, 'Failed to generate certificate image');
    return new Response('Failed to generate certificate image', { status: 500 });
  }
}
