import QRCode from 'qrcode';
import { readFileSync } from 'fs';
import { join } from 'path';

async function test() {
  console.log('🔍 Testing certificate asset generation...\n');

  // Test QR code
  const verificationUrl = 'https://www.amanoba.com/certificates/62f729b1aeef8ab7dda5';
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 150,
      margin: 1,
      color: {
        dark: '#F59E0B',
        light: '#0F172A',
      },
    });
    console.log('✅ QR code generated successfully');
    console.log('   Length:', qrCodeDataUrl.length, 'bytes');
    console.log('   Has data URL prefix:', qrCodeDataUrl.startsWith('data:image/png'));
  } catch (error) {
    console.error('❌ QR code generation failed:', error);
  }

  // Test logo loading
  let logoDataUrl = '';
  try {
    const logoPath = join(process.cwd(), 'public', 'amanoba_logo.png');
    console.log('\n📂 Logo path:', logoPath);
    const logoBuffer = readFileSync(logoPath);
    logoDataUrl = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    console.log('✅ Logo loaded successfully');
    console.log('   File size:', logoBuffer.length, 'bytes');
    console.log('   Data URL length:', logoDataUrl.length, 'bytes');
    console.log('   Has data URL prefix:', logoDataUrl.startsWith('data:image/png'));
  } catch (error) {
    console.error('❌ Logo loading failed:', error);
  }

  if (qrCodeDataUrl && logoDataUrl) {
    console.log('\n✅ All assets ready for certificate generation!');
    console.log('   QR code is truthy:', !!qrCodeDataUrl);
    console.log('   Logo is truthy:', !!logoDataUrl);
  } else {
    console.log('\n❌ Some assets failed to load');
    console.log('   QR code is truthy:', !!qrCodeDataUrl);
    console.log('   Logo is truthy:', !!logoDataUrl);
  }
}

test();
