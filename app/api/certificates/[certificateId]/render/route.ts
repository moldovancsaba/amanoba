import { ImageResponse, NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Certificate, Course } from '@/lib/models';
import { format } from 'date-fns';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    certificateId: string;
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { certificateId } = params;
  if (!certificateId) {
    return NextResponse.json({ success: false, error: 'Certificate ID is required' }, { status: 400 });
  }

  await connectDB();
  const certificate = await Certificate.findOne({ certificateId }).lean();
  if (!certificate) {
    return NextResponse.json({ success: false, error: 'Certificate not found' }, { status: 404 });
  }

  const course = await Course.findOne({ courseId: certificate.courseId }).lean();
  const issuedAt = certificate.issuedAtISO ? new Date(certificate.issuedAtISO) : new Date();
  const issuedDate = format(issuedAt, 'MMMM d, yyyy');
  const score = certificate.finalExamScorePercentInteger ?? 0;
  const isRevoked = Boolean(certificate.isRevoked);
  const title = course?.name || certificate.courseTitle || 'Amanoba Learning';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          padding: 48,
          boxSizing: 'border-box',
          borderRadius: 32,
          border: '1px solid rgba(255,255,255,0.25)',
          background: isRevoked
            ? 'linear-gradient(135deg, #2c0735 0%, #5a0b67 100%)'
            : 'linear-gradient(135deg, #0b4c90 0%, #0d81c3 60%, #10c6d5 100%)',
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            gap: 32,
          }}
        >
          <div>
            <div style={{ fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
              Amanoba Certification
            </div>
            <div style={{ marginTop: 8, fontSize: 48, fontWeight: 700 }}>{title}</div>
            <div style={{ marginTop: 8, fontSize: 20, opacity: 0.85 }}>{certificate.recipientName}</div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 14, letterSpacing: '0.3em' }}>ISSUED</span>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{issuedDate}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, opacity: 0.75 }}>Score</div>
              <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1 }}>{score}%</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, letterSpacing: '0.3em' }}>STATUS</div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: isRevoked ? '#ffb703' : '#adffb7',
                }}
              >
                {isRevoked ? 'Revoked' : 'Certified'}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 16, opacity: 0.9, lineHeight: 1.6 }}>
            Verification: {certificate.verificationSlug}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 32,
            right: 32,
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            opacity: 0.7,
            zIndex: 2,
          }}
        >
          {isRevoked ? 'Revoked' : 'Amanoba Verified'}
        </div>

        {isRevoked && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage:
                'repeating-linear-gradient(120deg, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 2px, transparent 2px, transparent 18px)',
              mixBlendMode: 'screen',
              zIndex: 0,
            }}
          />
        )}
      </div>
    ),
    { width: 1200, height: 627 }
  );
}
