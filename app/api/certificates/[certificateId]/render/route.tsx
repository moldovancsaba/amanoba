/**
 * Certificate Render API
 * 
 * What: Generate certificate image (PNG) for sharing/downloading
 * Why: Allows certificate sharing on social media and downloading for printing
 * 
 * CRITICAL REQUIREMENTS:
 * - File extension MUST be .tsx (for JSX support)
 * - MUST declare export const runtime = 'nodejs' (ImageResponse requires Node.js)
 * - MUST declare export const dynamic = 'force-dynamic'
 */

import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import connectDB from '@/lib/mongodb';
import { Certificate } from '@/lib/models';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs'; // CRITICAL: Required for ImageResponse
export const dynamic = 'force-dynamic'; // CRITICAL: Required for dynamic rendering

/**
 * GET /api/certificates/[certificateId]/render
 * 
 * What: Generate certificate image (PNG)
 * Query Params:
 *   - variant?: 'share_1200x627' | 'print_a4' (default: share_1200x627)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    await connectDB();
    const { certificateId } = await params;
    const { searchParams } = new URL(request.url);
    const variant = searchParams.get('variant') || 'share_1200x627';
    
    const certificate = await Certificate.findOne({ certificateId }).lean();
    
    if (!certificate) {
      return new Response('Certificate not found', { status: 404 });
    }
    
    // Dimensions based on variant
    const dimensions = variant === 'print_a4' 
      ? { width: 1200, height: 1697 } // A4 ratio (1:1.414)
      : { width: 1200, height: 627 }; // LinkedIn ratio (1.91:1)
    
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            color: 'white',
            fontFamily: 'system-ui',
            padding: '60px',
          }}
        >
          <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
            Certificate of Completion
          </div>
          <div style={{ fontSize: '36px', marginBottom: '40px', textAlign: 'center' }}>
            {certificate.courseTitle}
          </div>
          <div style={{ fontSize: '32px', marginBottom: '20px' }}>
            Awarded to: {certificate.recipientName}
          </div>
          {certificate.finalExamScorePercentInteger !== undefined && (
            <div style={{ fontSize: '28px', marginBottom: '20px' }}>
              Score: {certificate.finalExamScorePercentInteger}%
            </div>
          )}
          <div style={{ fontSize: '24px', color: '#888', marginBottom: '20px' }}>
            Issued: {new Date(certificate.issuedAtISO).toLocaleDateString()}
          </div>
          {certificate.isRevoked && (
            <div style={{ fontSize: '32px', color: '#ff4444', marginTop: '20px', fontWeight: 'bold' }}>
              REVOKED
            </div>
          )}
          <div style={{ fontSize: '16px', color: '#666', marginTop: '40px' }}>
            Verification: {certificate.verificationSlug}
          </div>
        </div>
      ),
      dimensions
    );
  } catch (error) {
    logger.error({ error }, 'Failed to render certificate');
    return new Response('Failed to render certificate', { status: 500 });
  }
}
