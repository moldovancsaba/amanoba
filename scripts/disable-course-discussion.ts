/**
 * One-off: set discussionEnabled = false for a course (e.g. to stop infinite reload on course page).
 * Usage: tsx --env-file=.env.local scripts/disable-course-discussion.ts [courseId]
 * Example: tsx --env-file=.env.local scripts/disable-course-discussion.ts SPORT_SALES_NETWORK_USA_2026_EN
 */
import connectDB from '../lib/mongodb';
import { Course } from '../lib/models';

const COURSE_ID = process.argv[2] || 'SPORT_SALES_NETWORK_USA_2026_EN';

async function main() {
  await connectDB();
  const result = await Course.findOneAndUpdate(
    { courseId: COURSE_ID },
    { $set: { discussionEnabled: false } },
    { new: true }
  ).select('courseId name discussionEnabled').lean();

  if (!result) {
    console.error('Course not found:', COURSE_ID);
    process.exit(1);
  }
  console.log('Updated:', result.courseId, 'discussionEnabled:', result.discussionEnabled);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
