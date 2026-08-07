/**
 * Certificate Image Generation API (Minimal Version)
 * 
 * Returns PNG certificate image
 */

import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export function GET(
  request: NextRequest
) {
  try {
    // Extract params from URL path instead of awaiting Promise
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const playerId = pathParts[3]; // /api/profile/[playerId]/...
    const courseId = pathParts[5]; // .../certificate/[courseId]/image
    
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
