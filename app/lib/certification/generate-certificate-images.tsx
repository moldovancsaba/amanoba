/**
 * Certificate Image Generation Helper
 * 
 * What: Generates certificate images and uploads to ImgBB
 * Why: Automatically creates shareable certificate images when exam is passed
 */

import { ImageResponse } from '@vercel/og';
import { uploadToImgBB } from '@/lib/utils/imgbb';
import { CourseProgress } from '@/lib/models';
import { logger } from '@/lib/logger';
import QRCode from 'qrcode';
import { readFileSync } from 'fs';
import { join } from 'path';

interface CertificateData {
  playerName: string;
  courseTitle: string;
  finalExamScore: number | null;
  locale: string;
  playerId: string;
  courseId: string;
  verificationSlug?: string;
}

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

  // Generate QR code as data URL if verification slug is available
  let qrCodeDataUrl = '';
  if (data.verificationSlug) {
    const verificationUrl = `https://www.amanoba.com/certificates/${data.verificationSlug}`;
    try {
      qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 150,
        margin: 1,
        color: {
          dark: '#F59E0B',
          light: '#0F172A',
        },
      });
    } catch (error) {
      logger.error({ error }, 'Failed to generate QR code');
    }
  }

  // Load logo as base64
  let logoDataUrl = '';
  try {
    const logoPath = join(process.cwd(), 'public', 'amanoba_logo.png');
    const logoBuffer = readFileSync(logoPath);
    logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  } catch (error) {
    logger.error({ error }, 'Failed to load logo');
  }

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#0F172A',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Logo at top */}
        {logoDataUrl && (
          <div style={{ display: 'flex', position: 'absolute', top: '30px', left: '30px' }}>
            <img src={logoDataUrl} alt="Amanoba" width="120" height="40" />
          </div>
        )}

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <div style={{ display: 'flex', fontSize: 48, fontWeight: 'bold', color: '#F59E0B', marginBottom: '40px' }}>
            Certificate of Completion
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: '#F1F5F9', marginBottom: '30px', textAlign: 'center', maxWidth: '90%' }}>
            {data.courseTitle}
          </div>
          <div style={{ display: 'flex', fontSize: 20, color: '#CBD5E1', marginBottom: '20px' }}>
            This certifies that
          </div>
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 'bold', color: '#F59E0B', marginBottom: '20px' }}>
            {data.playerName}
          </div>
          <div style={{ display: 'flex', fontSize: 18, color: '#CBD5E1' }}>
            has successfully completed the course{data.finalExamScore !== null ? ` with ${data.finalExamScore}%` : ''}
          </div>
        </div>

        {/* Footer with QR code and URL */}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {/* QR Code */}
          {qrCodeDataUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={qrCodeDataUrl} alt="QR Code" width="100" height="100" />
              <div style={{ display: 'flex', fontSize: 12, color: '#94A3B8', marginTop: '8px' }}>
                Scan to verify
              </div>
            </div>
          )}

          {/* Website URL */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', fontSize: 16, color: '#F59E0B', fontWeight: 'bold' }}>
              www.amanoba.com
            </div>
            <div style={{ display: 'flex', fontSize: 12, color: '#94A3B8', marginTop: '4px' }}>
              Unified Flexible Learning Platform
            </div>
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
    logger.info({ playerId: data.playerId, courseId: data.courseId }, 'Starting certificate image generation');
    
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      logger.error({}, 'IMGBB_API_KEY not configured for certificate upload');
      return null;
    }

    logger.info({}, 'Generating certificate images...');
    // Generate both variants
    const [shareBuffer, printBuffer] = await Promise.all([
      generateCertificateImage(data, 'share_1200x627'),
      generateCertificateImage(data, 'print_a4'),
    ]);

    logger.info({ shareSize: shareBuffer.length, printSize: printBuffer.length }, 'Images generated, uploading to ImgBB...');
    
    // Upload both to ImgBB
    const [shareResult, printResult] = await Promise.all([
      uploadToImgBB(shareBuffer.toString('base64'), apiKey),
      uploadToImgBB(printBuffer.toString('base64'), apiKey),
    ]);

    logger.info({ 
      shareSuccess: shareResult.success, 
      printSuccess: printResult.success,
      shareUrl: shareResult.data?.url,
      printUrl: printResult.data?.url,
    }, 'ImgBB upload completed');

    if (!shareResult.success || !printResult.success) {
      logger.error({ shareResult, printResult }, 'Failed to upload certificate images to ImgBB');
      return null;
    }

    logger.info({ playerId: data.playerId, courseId: data.courseId }, 'Storing URLs in CourseProgress...');
    
    // Store URLs in CourseProgress
    const updated = await CourseProgress.findOneAndUpdate(
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

    if (!updated) {
      logger.error({ playerId: data.playerId, courseId: data.courseId }, 'CourseProgress not found for update');
      return null;
    }

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
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    logger.error({ 
      error: errorMsg, 
      stack: errorStack,
      playerId: data.playerId, 
      courseId: data.courseId 
    }, 'Failed to generate certificate images');
    return null;
  }
}
