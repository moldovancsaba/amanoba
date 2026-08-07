import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export function GET() {
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
          Deep Route Test
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 627,
    }
  );
}
