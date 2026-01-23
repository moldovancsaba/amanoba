import { ImageResponse } from '@vercel/og';
import { jsx, jsxs } from 'react/jsx-runtime';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Certificate, Course } from '@/lib/models';
import { format } from 'date-fns';

export const runtime = 'nodejs';
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
  const issuerLabelStyle = { fontSize: 24, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 };
  const courseTitleStyle = { marginTop: 8, fontSize: 48, fontWeight: 700 };
  const recipientStyle = { marginTop: 8, fontSize: 20, opacity: 0.85 };
  const contentContainerStyle = {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    gap: 32,
  };
  const sectionRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
  };
  const issuedColumnStyle = { display: 'flex', flexDirection: 'column', gap: 4 };
  const statusColor = isRevoked ? '#ffb703' : '#adffb7';
  const statusText = isRevoked ? 'Revoked' : 'Certified';
  const rootStyle = {
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
  };
  const topRightBadgeStyle = {
    position: 'absolute',
    top: 32,
    right: 32,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: '0.3em',
    opacity: 0.7,
    zIndex: 2,
  };
  const revokedOverlayStyle = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage:
      'repeating-linear-gradient(120deg, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 2px, transparent 2px, transparent 18px)',
    mixBlendMode: 'screen',
    zIndex: 0,
  };
  const verificationStyle = { fontSize: 16, opacity: 0.9, lineHeight: 1.6 };
  const issuedLabelStyle = { fontSize: 14, letterSpacing: '0.3em' };
  const issuedValueStyle = { fontSize: 18, fontWeight: 600 };
  const scoreLabelStyle = { fontSize: 16, opacity: 0.75 };
  const scoreValueStyle = { fontSize: 72, fontWeight: 700, lineHeight: 1 };
  const statusLabelStyle = { fontSize: 14, letterSpacing: '0.3em' };
  const statusValueStyle = { fontSize: 18, fontWeight: 600, color: statusColor };

  const certificateHeader = jsxs('div', {
    children: [
      jsx('div', { style: issuerLabelStyle, children: 'Amanoba Certification' }),
      jsx('div', { style: courseTitleStyle, children: title }),
      jsx('div', { style: recipientStyle, children: certificate.recipientName }),
    ],
  });

  const issuedColumn = jsxs('div', {
    style: issuedColumnStyle,
    children: [
      jsx('span', { style: issuedLabelStyle, children: 'ISSUED' }),
      jsx('span', { style: issuedValueStyle, children: issuedDate }),
    ],
  });

  const scoreColumn = jsxs('div', {
    style: { textAlign: 'center' },
    children: [
      jsx('div', { style: scoreLabelStyle, children: 'Score' }),
      jsx('div', { style: scoreValueStyle, children: `${score}%` }),
    ],
  });

  const statusColumn = jsxs('div', {
    style: { textAlign: 'right' },
    children: [
      jsx('div', { style: statusLabelStyle, children: 'STATUS' }),
      jsx('div', { style: statusValueStyle, children: statusText }),
    ],
  });

  const statsRow = jsxs('div', {
    style: sectionRowStyle,
    children: [issuedColumn, scoreColumn, statusColumn],
  });

  const verificationText = jsx('div', {
    style: verificationStyle,
    children: `Verification: ${certificate.verificationSlug}`,
  });

  const contentColumn = jsxs('div', {
    style: contentContainerStyle,
    children: [certificateHeader, statsRow, verificationText],
  });

  const badge = jsx('div', {
    style: topRightBadgeStyle,
    children: statusText === 'Revoked' ? 'Revoked' : 'Amanoba Verified',
  });

  const rootElement = jsxs('div', {
    style: rootStyle,
    children: [
      contentColumn,
      badge,
      isRevoked ? jsx('div', { style: revokedOverlayStyle }) : null,
    ],
  });

  return new ImageResponse(rootElement, { width: 1200, height: 627 });
}
