/**
 * Certificate Image Generation API (Minimal Version)
 * 
 * Returns PNG certificate image
 */

import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';

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

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0F172A',
          }}
        >
          <div style={{ fontSize: 48, color: '#F59E0B' }}>
            Certificate for {courseId}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 627,
      }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown';
    console.error('Certificate image error:', msg);
    return new Response(`Error: ${msg}`, { status: 500 });
  }
}
