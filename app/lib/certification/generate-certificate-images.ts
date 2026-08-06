/**
 * Certificate Image Generation Helper
 * 
 * What: Generates certificate images and uploads to ImgBB
 * Why: Automatically creates shareable certificate images when exam is passed
 */

import { ImageResponse } from 'next/og';
import { uploadToImgBB } from '@/lib/utils/imgbb';
import { CourseProgress } from '@/lib/models';
import { logger } from '@/lib/logger';

interface CertificateData {
  playerName: string;
  courseTitle: string;
  finalExamScore: number | null;
  locale: string;
  playerId: string;
  courseId: string;
}

const DEFAULT_COLORS = {
  bgStart: '#0F172A',
  bgMid: '#1E293B',
  accent: '#F59E0B',
  border: '#F59E0B',
  borderMuted: '#F59E0B4D',
  textPrimary: '#F1F5F9',
  textSecondary: '#CBD5E1',
  footer: '#94A3B8',
  titleGradientEnd: '#F59E0B',
};

/**
 * Generate certificate image as PNG buffer
 */
async function generateCertificateImage(
  data: CertificateData,
  variant: 'share_1200x627' | 'print_a4'
): Promise<Buffer> {
  const dimensions = variant === 'print_a4' 
    ? { width: 1200, height: 1697 } 
    : { width: 1200, height: 627 };

  const isMinimal = false;
  const certColors = DEFAULT_COLORS;
  const certificateId = `${data.playerId.slice(-8)}-${data.courseId.slice(-8)}`.toUpperCase();
  const issuedDate = new Date().toLocaleDateString(data.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const imageResponse = new ImageResponse(
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
            Certificate of Completion
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
            {data.courseTitle}
          </div>

          <div
            style={{
              fontSize: variant === 'print_a4' ? 32 : 24,
              color: certColors.textSecondary,
              marginBottom: '20px',
            }}
          >
            This certifies that
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
            {data.playerName}
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

          {data.finalExamScore !== null && (
            <div
              style={{
                fontSize: variant === 'print_a4' ? 40 : 32,
                color: certColors.accent,
                marginBottom: '40px',
                fontWeight: 'bold',
              }}
            >
              Final Exam Score: {data.finalExamScore}%
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
            <div>ID: {certificateId}</div>
            <div>{issuedDate}</div>
          </div>
        </div>
      </div>
    ),
    dimensions
  );

  const arrayBuffer = await imageResponse.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generate and upload certificate images to ImgBB
 * 
 * @param data - Certificate data
 * @returns URLs of uploaded images or null if failed
 */
export async function generateAndUploadCertificateImages(
  data: CertificateData
): Promise<{ shareUrl?: string; printUrl?: string } | null> {
  try {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      logger.error({}, 'IMGBB_API_KEY not configured for certificate upload');
      return null;
    }

    // Generate both variants
    const [shareBuffer, printBuffer] = await Promise.all([
      generateCertificateImage(data, 'share_1200x627'),
      generateCertificateImage(data, 'print_a4'),
    ]);

    // Upload both to ImgBB
    const [shareResult, printResult] = await Promise.all([
      uploadToImgBB(shareBuffer.toString('base64'), apiKey),
      uploadToImgBB(printBuffer.toString('base64'), apiKey),
    ]);

    if (!shareResult.success || !printResult.success) {
      logger.error({ shareResult, printResult }, 'Failed to upload certificate images to ImgBB');
      return null;
    }

    // Store URLs in CourseProgress
    await CourseProgress.findOneAndUpdate(
      { playerId: data.playerId, courseId: data.courseId },
      {
        $set: {
          'certificateImages.share': {
            url: shareResult.data.url,
            deleteUrl: shareResult.data.delete_url,
            uploadedAt: new Date(),
          },
          'certificateImages.print': {
            url: printResult.data.url,
            deleteUrl: printResult.data.delete_url,
            uploadedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    logger.info(
      { 
        playerId: data.playerId, 
        courseId: data.courseId,
        shareUrl: shareResult.data.url,
        printUrl: printResult.data.url,
      },
      'Certificate images uploaded to ImgBB successfully'
    );

    return {
      shareUrl: shareResult.data.url,
      printUrl: printResult.data.url,
    };
  } catch (error) {
    logger.error({ error, playerId: data.playerId, courseId: data.courseId }, 'Failed to generate certificate images');
    return null;
  }
}
