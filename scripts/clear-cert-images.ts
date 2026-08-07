import connectDB from '../app/lib/mongodb';
import { CourseProgress, Course } from '../app/lib/models';

async function clearCertImages() {
  await connectDB();
  
  // Find the course
  const course = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN' }).lean();
  if (!course) {
    console.error('Course not found');
    process.exit(1);
  }
  
  // Clear certificate images
  const result = await CourseProgress.findOneAndUpdate(
    { 
      playerId: '68ee3bd02b16d01cdcdfb2cf',
      courseId: course._id,
    },
    {
      $unset: { certificateImages: 1 },
    },
    { new: true }
  );
  
  console.log('✅ Cleared certificate images for regeneration');
  process.exit(0);
}

clearCertImages();
