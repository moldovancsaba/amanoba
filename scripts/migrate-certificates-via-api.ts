/**
 * Migration Script: Upload Existing Certificates via API
 * 
 * What: Triggers certificate image generation via the production API
 * Why: ImageResponse requires Next.js runtime, so we call the API instead
 * 
 * Usage: npx tsx --env-file=.env.local scripts/migrate-certificates-via-api.ts
 */

import connectDB from '../app/lib/mongodb';
import { Certificate } from '../app/lib/models';

const PRODUCTION_URL = 'https://www.amanoba.com';

async function migrateCertificatesViaAPI() {
  console.log('🚀 Starting certificate migration via API...\n');

  await connectDB();

  // Find all valid (non-revoked) certificates
  const certificates = await Certificate.find({
    isRevoked: { $ne: true },
  }).lean();

  console.log(`📊 Found ${certificates.length} valid certificates\n`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const cert of certificates) {
    try {
      console.log(`\n🔍 Processing certificate: ${cert.certificateId}`);
      console.log(`   Player: ${cert.playerId}`);
      console.log(`   Course: ${cert.courseId}`);

      // Check certificate status via API
      const statusUrl = `${PRODUCTION_URL}/api/profile/${cert.playerId}/certificate-status?courseId=${cert.courseId}`;
      const statusResponse = await fetch(statusUrl);
      
      if (!statusResponse.ok) {
        console.log(`   ❌ Failed - could not fetch certificate status (${statusResponse.status})`);
        failed++;
        continue;
      }

      const statusData = await statusResponse.json();
      
      // Check if images already exist
      if (statusData.data?.certificateImages?.share?.url && statusData.data?.certificateImages?.print?.url) {
        console.log(`   ⏭️  Skipped - already uploaded`);
        skipped++;
        continue;
      }

      // Generate both variants via API
      console.log(`   📤 Uploading share image to ImgBB...`);
      const shareResponse = await fetch(
        `${PRODUCTION_URL}/api/profile/${cert.playerId}/certificate/${cert.courseId}/generate-imgbb`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variant: 'share_1200x627' }),
        }
      );

      if (!shareResponse.ok) {
        console.log(`   ❌ Failed - share image generation failed (${shareResponse.status})`);
        failed++;
        continue;
      }

      const shareData = await shareResponse.json();
      
      if (!shareData.success) {
        console.log(`   ❌ Failed - ${shareData.error || 'Unknown error'}`);
        failed++;
        continue;
      }

      console.log(`   📤 Uploading print image to ImgBB...`);
      const printResponse = await fetch(
        `${PRODUCTION_URL}/api/profile/${cert.playerId}/certificate/${cert.courseId}/generate-imgbb`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variant: 'print_a4' }),
        }
      );

      if (!printResponse.ok) {
        console.log(`   ❌ Failed - print image generation failed (${printResponse.status})`);
        failed++;
        continue;
      }

      const printData = await printResponse.json();
      
      if (!printData.success) {
        console.log(`   ❌ Failed - ${printData.error || 'Unknown error'}`);
        failed++;
        continue;
      }

      console.log(`   ✅ Success!`);
      console.log(`      Share: ${shareData.url}`);
      console.log(`      Print: ${printData.url}`);
      migrated++;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`   ❌ Failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📈 Migration Summary:');
  console.log(`   ✅ Migrated: ${migrated}`);
  console.log(`   ⏭️  Skipped:  ${skipped}`);
  console.log(`   ❌ Failed:   ${failed}`);
  console.log(`   📊 Total:    ${certificates.length}`);
  console.log('='.repeat(60) + '\n');
}

// Run migration
migrateCertificatesViaAPI()
  .then(() => {
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
