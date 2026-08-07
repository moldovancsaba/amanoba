/**
 * Migration Script: Upload Existing Certificates to ImgBB
 * 
 * What: Finds all existing certificates and uploads their images to ImgBB
 * Why: Backfills certificate images for users who passed exams before auto-upload was implemented
 * 
 * Usage: npx tsx --env-file=.env.local scripts/migrate-existing-certificates-to-imgbb.ts
 */

import connectDB from '../app/lib/mongodb';
import { Certificate, Course, Player, CourseProgress } from '../app/lib/models';
import { generateAndUploadCertificateImages } from '../app/lib/certification/generate-certificate-images-canvas';

async function migrateCertificates() {
  console.log('🚀 Starting certificate migration to ImgBB...\n');

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

      // Fetch player and course data first
      const [player, course] = await Promise.all([
        Player.findById(cert.playerId).lean(),
        Course.findOne({ courseId: cert.courseId }).lean(),
      ]);

      if (!player || !course) {
        console.log(`   ❌ Failed - player or course not found`);
        failed++;
        continue;
      }

      // Check if already uploaded (use course._id, not courseId string)
      const progress = await CourseProgress.findOne({
        playerId: cert.playerId,
        courseId: course._id,
      }).lean();

      if (progress?.certificateImages?.share?.url && progress?.certificateImages?.print?.url) {
        console.log(`   ⏭️  Skipped - already uploaded`);
        skipped++;
        continue;
      }

      // Generate and upload
      console.log(`   📤 Uploading to ImgBB...`);
      const result = await generateAndUploadCertificateImages({
        playerName: cert.recipientName || player.displayName || player.email || 'Learner',
        courseTitle: cert.courseTitle || course.name || course.courseId,
        finalExamScore: cert.finalExamScorePercentInteger,
        locale: cert.locale || course.language || 'en',
        playerId: cert.playerId.toString(),
        courseId: course._id.toString(), // Use course's MongoDB _id, not courseId string
      });

      if (result?.shareUrl && result?.printUrl) {
        console.log(`   ✅ Success!`);
        console.log(`      Share: ${result.shareUrl}`);
        console.log(`      Print: ${result.printUrl}`);
        migrated++;
      } else {
        console.log(`   ❌ Failed - upload returned no URLs`);
        failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
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
migrateCertificates()
  .then(() => {
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
