/**
 * Certificate Image Generation API
 * 
 * Returns PNG certificate image
 */

import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  try {
    // Extract params from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const playerId = pathParts[3]; // /api/profile/[playerId]/...
    const courseId = pathParts[5]; // .../certificate/[courseId]/image
    const { searchParams} = url;
    const variant = searchParams.get('variant') || 'share_1200x627';

    // Dimensions
    const dimensions = variant === 'print_a4' 
      ? { width: 1200, height: 1697 }
      : { width: 1200, height: 627 };

    // Fetch certificate data
    const baseUrl = `https://${request.headers.get('host') || 'www.amanoba.com'}`;
    const dataUrl = `${baseUrl}/api/profile/${playerId}/certificate-status?courseId=${encodeURIComponent(courseId)}`;
    
    // For edge runtime, we can't use async/await for external fetch easily
    // So we'll use a simpler approach - generate with basic info
    // The frontend can pass playerName and courseTitle as query params if needed
    const playerName = searchParams.get('playerName') || 'Learner';
    const courseTitle = searchParams.get('courseTitle') || courseId;
    const score = searchParams.get('score') ? parseInt(searchParams.get('score')!) : null;

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
          <div style={{ fontSize: 32, color: '#F1F5F9', marginBottom: '30px', textAlign: 'center', maxWidth: '90%' }}>
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
      dimensions
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown';
    console.error('Certificate image error:', msg);
    return new Response(`Error: ${msg}`, { status: 500 });
  }
}
