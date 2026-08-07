import React from 'react';
import { ImageResponse } from '@vercel/og';
import { writeFileSync } from 'fs';

async function test() {
  console.log('Testing ImageResponse with external URLs...\n');

  const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&bgcolor=0F172A&color=F59E0B&data=https://www.amanoba.com/certificates/test123';
  const logoUrl = 'https://www.amanoba.com/amanoba_logo.png';

  console.log('QR Code URL:', qrCodeUrl);
  console.log('Logo URL:', logoUrl);
  console.log('\nGenerating certificate...\n');

  try {
    const response = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0F172A',
            padding: '60px',
            position: 'relative',
          }}
        >
          {/* Logo at top */}
          <div style={{ display: 'flex', position: 'absolute', top: '30px', left: '30px' }}>
            <img src={logoUrl} alt="Amanoba" width={120} height={40} />
          </div>

          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{ display: 'flex', fontSize: 48, fontWeight: 'bold', color: '#F59E0B', marginBottom: '40px' }}>
              Certificate of Completion
            </div>
            <div style={{ display: 'flex', fontSize: 32, color: '#F1F5F9', marginBottom: '30px', textAlign: 'center', maxWidth: '90%' }}>
              Test Course
            </div>
            <div style={{ display: 'flex', fontSize: 20, color: '#CBD5E1', marginBottom: '20px' }}>
              This certifies that
            </div>
            <div style={{ display: 'flex', fontSize: 40, fontWeight: 'bold', color: '#F59E0B', marginBottom: '20px' }}>
              Test User
            </div>
            <div style={{ display: 'flex', fontSize: 18, color: '#CBD5E1' }}>
              has successfully completed the course with 95%
            </div>
          </div>

          {/* Footer with QR code and URL */}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* QR Code */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={qrCodeUrl} alt="QR Code" width={100} height={100} />
              <div style={{ display: 'flex', fontSize: 12, color: '#94A3B8', marginTop: '8px' }}>
                Scan to verify
              </div>
            </div>

            {/* Website URL */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', fontSize: 16, color: '#F59E0B', fontWeight: 'bold' }}>
                www.amanoba.com
              </div>
              <div style={{ display: 'flex', fontSize: 12, color: '#94A3B8', marginTop: '4px' }}>
                Unified Flexible Learning Platform
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 627 }
    );

    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync('/tmp/test-cert-external.png', buffer);
    
    console.log('✅ Certificate generated successfully!');
    console.log('📊 File size:', buffer.length, 'bytes');
    console.log('📁 Saved to: /tmp/test-cert-external.png');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();
