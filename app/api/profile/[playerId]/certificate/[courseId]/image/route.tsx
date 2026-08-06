/**
 * Certificate Image Generation API (Minimal Version)
 * 
 * Returns PNG certificate image
 */

import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string; courseId: string }> }
) {
  try {
    const { playerId, courseId } = await params;
    const { searchParams } = new URL(request.url);
    const variant = searchParams.get('variant') || 'share_1200x627';

    // Dimensions
    const dimensions = variant === 'print_a4' 
      ? { width: 1200, height: 1697 }
      : { width: 1200, height: 627 };

    // Fetch certificate data
    const baseUrl = `https://${request.headers.get('host') || 'www.amanoba.com'}`;
    const dataUrl = `${baseUrl}/api/profile/${playerId}/certificate-status?courseId=${encodeURIComponent(courseId)}`;
    const dataResponse = await fetch(dataUrl);
    
    if (!dataResponse.ok) {
      return new Response('Failed to fetch data', { status: 500 });
    }

    const { data: certStatus } = await dataResponse.json();
    
    if (!certStatus?.certificateEligible) {
      return new Response('Not eligible', { status: 403 });
    }

    const playerName = certStatus.playerName || 'Unknown';
    const courseTitle = certStatus.courseTitle || 'Course';
    const score = certStatus.finalExamScore;

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
            background: '#0F172A',
            padding: '60px',
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 'bold', color: '#F59E0B', marginBottom: '40px' }}>
            Certificate of Completion
          </div>
          <div style={{ fontSize: 32, color: '#F1F5F9', marginBottom: '30px', textAlign: 'center' }}>
            {courseTitle}
          </div>
          <div style={{ fontSize: 20, color: '#CBD5E1', marginBottom: '20px' }}>
            This certifies that
          </div>
          <div style={{ fontSize: 40, fontWeight: 'bold', color: '#F59E0B', marginBottom: '20px' }}>
            {playerName}
          </div>
          <div style={{ fontSize: 18, color: '#CBD5E1' }}>
            has successfully completed the course{score ? ` with ${score}%` : ''}
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
    const msg = error instanceof Error ? error.message : 'Unknown';
    console.error('Certificate image error:', msg);
    return new Response(`Error: ${msg}`, { status: 500 });
  }
}
