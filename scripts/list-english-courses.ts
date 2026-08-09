import connectDB from '../app/lib/mongodb';
import { Course } from '../app/lib/models';

(async () => {
  await connectDB();
  const courses = await Course.find({ language: 'en' }).select('courseId name durationDays').lean();
  console.log('Available English courses to translate:\n');
  courses.forEach(c => console.log(`  - ${c.courseId} (${c.name}) - ${c.durationDays} days`));
  process.exit(0);
})();
