import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import Lesson from '../app/lib/models/lesson';

async function findLessonIds() {
  await connectDB();
  
  const lessons = await Lesson.find({})
    .select('lessonId dayNumber')
    .limit(30)
    .sort({ dayNumber: 1 });
  
  console.log('Sample lesson IDs from database:\n');
  lessons.forEach(l => {
    console.log(`Day ${l.dayNumber}: ${l.lessonId}`);
  });
  
  process.exit(0);
}

findLessonIds().catch(e => { console.error(e); process.exit(1); });
