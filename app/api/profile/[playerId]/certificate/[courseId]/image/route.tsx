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

import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface CertificateData {
  playerName: string;
  courseTitle: string;
  finalExamScore: number | null;
  issuedDate: string;
  certificateId: string;
  locale: string;
  colors?: {
    bgStart?: string;
    bgMid?: string;
    accent?: string;
    border?: string;
  };
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
 * GET /api/profile/[playerId]/certificate/[courseId]/image
 * 
 * Generates a PNG certificate image using edge runtime.
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
    const locale = searchParams.get('locale') || 'en';

    // Dimensions based on variant
    const dimensions = variant === 'print_a4' 
      ? { width: 1200, height: 1697 } // A4 ratio (1:1.414)
      : { width: 1200, height: 627 }; // LinkedIn/social ratio (1.91:1)

    // Fetch certificate data from API endpoint (which can use nodejs runtime)
    const baseUrl = request.url.includes('localhost') 
      ? 'http://localhost:3000'
      : `https://${request.headers.get('host') || 'www.amanoba.com'}`;
    
    const dataUrl = `${baseUrl}/api/profile/${playerId}/certificate-status?courseId=${encodeURIComponent(courseId)}`;
    const dataResponse = await fetch(dataUrl);
    
    if (!dataResponse.ok) {
      return new Response('Failed to fetch certificate data', { status: 500 });
    }

    const { data: certStatus } = await dataResponse.json();
    
    if (!certStatus || !certStatus.certificateEligible) {
      return new Response('Certificate not eligible', { status: 403 });
    }

    const playerName = certStatus.playerName || 'Unknown';
    const courseTitle = certStatus.courseTitle || 'Course';
    const finalExamScore = certStatus.finalExamScore;
    const certificateId = `${playerId.slice(-8)}-${courseId.slice(-8)}`.toUpperCase();
    
    const issuedDate = new Date().toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const certColors = { ...DEFAULT_COLORS };
    const isMinimal = false;

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
                color: certColors.accent,
                marginBottom: isMinimal ? '24px' : '40px',
                lineHeight: 1.2,
              }}
            >
              Certificate of Completion
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
              This certifies that
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
              has successfully completed the course
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
                Final Exam Score: {finalExamScore}%
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
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to generate certificate image:', errorMessage);
    return new Response(`Failed to generate certificate image: ${errorMessage}`, { status: 500 });
  }
}
