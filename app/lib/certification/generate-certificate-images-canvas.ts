/**
 * Certificate Image Generation using Canvas
 * 
 * What: Generates certificate images with proper logo and QR code compositing
 * Why: ImageResponse doesn't support external images reliably
 */

import { createCanvas, loadImage, registerFont } from 'canvas';
import { uploadToImgBB } from '@/lib/utils/imgbb';
import { CourseProgress } from '@/lib/models';
import { logger } from '@/lib/logger';
import QRCode from 'qrcode';
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

async function generateCertificateImage(
  data: CertificateData,
  variant: 'share_1200x627' | 'print_a4'
): Promise<Buffer> {
  const dimensions = variant === 'print_a4' 
    ? { width: 1200, height: 1697 } 
    : { width: 1200, height: 627 };

  const canvas = createCanvas(dimensions.width, dimensions.height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, dimensions.width, dimensions.height);

  // Load and draw logo
  try {
    const logoPath = join(process.cwd(), 'public', 'amanoba_logo.png');
    const logo = await loadImage(logoPath);
    ctx.drawImage(logo, 30, 30, 120, 40);
  } catch (error) {
    logger.error({ error }, 'Failed to load logo');
  }

  // Main content
  ctx.textAlign = 'center';
  
  // Title
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 48px sans-serif';
  ctx.fillText('Certificate of Completion', dimensions.width / 2, 180);

  // Course title
  ctx.fillStyle = '#F1F5F9';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(data.courseTitle, dimensions.width / 2, 240);

  // "This certifies that"
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '20px sans-serif';
  ctx.fillText('This certifies that', dimensions.width / 2, 290);

  // Player name
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(data.playerName, dimensions.width / 2, 350);

  // Completion text
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '18px sans-serif';
  const completionText = data.finalExamScore !== null 
    ? `has successfully completed the course with ${data.finalExamScore}%`
    : 'has successfully completed the course';
  ctx.fillText(completionText, dimensions.width / 2, 390);

  // Footer - QR Code
  if (data.verificationSlug) {
    try {
      const verificationUrl = `https://www.amanoba.com/certificates/${data.verificationSlug}`;
      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 150,
        margin: 1,
        color: {
          dark: '#F59E0B',
          light: '#0F172A',
        },
      });
      const qrImage = await loadImage(qrCodeDataUrl);
      ctx.drawImage(qrImage, 80, dimensions.height - 140, 100, 100);

      // "Scan to verify" text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94A3B8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Scan to verify', 130, dimensions.height - 30);
    } catch (error) {
      logger.error({ error }, 'Failed to generate QR code');
    }
  }

  // Footer - Website branding
  ctx.textAlign = 'right';
  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('www.amanoba.com', dimensions.width - 80, dimensions.height - 50);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '12px sans-serif';
  ctx.fillText('Unified Flexible Learning Platform', dimensions.width - 80, dimensions.height - 30);

  return canvas.toBuffer('image/png');
}

export async function generateAndUploadCertificateImages(
  data: CertificateData
): Promise<{ shareUrl?: string; printUrl?: string } | null> {
  try {
    logger.info({ playerId: data.playerId, courseId: data.courseId }, 'Starting certificate image generation with Canvas');
    
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      logger.error({}, 'IMGBB_API_KEY not configured for certificate upload');
      return null;
    }

    logger.info({}, 'Generating certificate images with Canvas...');
    const [shareBuffer, printBuffer] = await Promise.all([
      generateCertificateImage(data, 'share_1200x627'),
      generateCertificateImage(data, 'print_a4'),
    ]);

    logger.info({ shareSize: shareBuffer.length, printSize: printBuffer.length }, 'Images generated, uploading to ImgBB...');
    
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
