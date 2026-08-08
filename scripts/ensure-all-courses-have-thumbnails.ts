import connectDB from '../app/lib/mongodb';
import { Course } from '../app/lib/models';

const thumbnailPool = [
  'https://i.ibb.co/C5GmMSCX/60-A14650-AEFA-41-B9-85-B3-3-F2-C63241-F1-A.png',
  'https://i.ibb.co/Q3dWrqC3/4-ABC0-DD4-F387-4-A36-86-D1-4-BABBADA791-D.png',
  'https://i.ibb.co/DDpm7xg5/9-D06-E9-E9-5421-4000-8170-EA863-BB10-E5-B.png',
  'https://i.ibb.co/3mrrqg4y/4-F494472-114-E-44-EB-922-D-EE9-A798-E781-E.png',
  'https://i.ibb.co/Y4CMSWRc/3-B15-FA86-2-CDE-4-DF5-A07-F-43-E09791-F999.png',
  'https://i.ibb.co/S7rTB05C/A6526412-05-E6-4227-88-AE-6-A566-BCD970-D.png',
  'https://i.ibb.co/0VVdfyCj/274-FEFD4-FB1-F-44-EC-8-E6-B-A671-EBFFBBD2.png',
  'https://i.ibb.co/jYR5TmB/8-BD937-BA-DFC2-4-CBC-BD5-C-2-D3-B78-B5-F4-E2.png',
];

async function ensureThumbnails() {
  console.log('\n🖼️  Ensuring All Courses Have Thumbnails\n');
  console.log('='.repeat(70));
  
  await connectDB();

  const allCourses = await Course.find({});
  console.log(`\nFound ${allCourses.length} total courses`);

  const coursesWithoutThumbnails = allCourses.filter(
    c => !c.thumbnail || c.thumbnail.trim() === ''
  );

  if (coursesWithoutThumbnails.length === 0) {
    console.log('\n✅ All courses already have thumbnails!\n');
    process.exit(0);
  }

  console.log(`\n⚠️  ${coursesWithoutThumbnails.length} courses missing thumbnails:\n`);

  for (let i = 0; i < coursesWithoutThumbnails.length; i++) {
    const course = coursesWithoutThumbnails[i];
    const thumbnail = thumbnailPool[i % thumbnailPool.length];
    
    console.log(`  ${i + 1}. ${course.courseId}`);
    console.log(`     Name: ${course.name}`);
    console.log(`     Assigning: ${thumbnail}`);
    
    course.thumbnail = thumbnail;
    await course.save();
    console.log(`     ✓ Saved\n`);
  }

  console.log('='.repeat(70));
  console.log('\n✅ All courses now have thumbnails!\n');
  
  process.exit(0);
}

ensureThumbnails();
