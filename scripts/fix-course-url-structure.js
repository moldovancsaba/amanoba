/**
 * Fix Course URL Structure - Delete wrong language/courseId mismatches
 */

const { config } = require('dotenv');
const { resolve } = require('path');

config({ path: resolve(process.cwd(), '.env.local') });

const connectDB = require('../app/lib/mongodb').default;
const { Course } = require('../app/lib/models');

const LANGUAGE_MAP = {
  'hu': 'HU', 'en': 'EN', 'ar': 'AR', 'ru': 'RU',
  'pt': 'PT', 'vi': 'VI', 'id': 'ID', 'hi': 'HI',
  'tr': 'TR', 'bg': 'BG', 'pl': 'PL'
};

async function fixCourseURLStructure() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    const allCourses = await Course.find({}).sort({ courseId: 1 });
    console.log(`Found ${allCourses.length} total courses\n`);

    const wrongCourses = [];
    const correctCourses = [];

    for (const course of allCourses) {
      const parts = course.courseId.split('_');
      const courseIdSuffix = parts[parts.length - 1];
      const expectedSuffix = LANGUAGE_MAP[course.language];

      if (courseIdSuffix === expectedSuffix) {
        correctCourses.push({
          courseId: course.courseId,
          language: course.language,
          url: `/${course.language}/courses/${course.courseId}`
        });
      } else {
        wrongCourses.push({
          _id: course._id,
          courseId: course.courseId,
          language: course.language,
          courseIdSuffix,
          expectedSuffix
        });
      }
    }

    console.log(`📊 ANALYSIS RESULTS\n`);
    console.log(`✅ Correct: ${correctCourses.length} courses`);
    correctCourses.slice(0, 5).forEach(c => {
      console.log(`  ✓ ${c.courseId} → ${c.url}`);
    });
    if (correctCourses.length > 5) {
      console.log(`  ... and ${correctCourses.length - 5} more`);
    }

    console.log(`\n❌ WRONG: ${wrongCourses.length} courses`);
    if (wrongCourses.length > 0) {
      wrongCourses.forEach(c => {
        console.log(`  ✗ ${c.courseId}`);
        console.log(`    Language=${c.language}, Suffix=${c.courseIdSuffix} (expected=${c.expectedSuffix})`);
      });

      console.log(`\n🗑️  DELETING ${wrongCourses.length} WRONG COURSES\n`);
      
      for (const wrongCourse of wrongCourses) {
        console.log(`Deleting: ${wrongCourse.courseId}`);
        const result = await Course.deleteOne({ _id: wrongCourse._id });
        if (result.deletedCount > 0) {
          console.log(`  ✅ DELETED\n`);
        }
      }

      console.log(`✅ Deleted ${wrongCourses.length} courses`);
    }

    const remaining = await Course.find({}).sort({ courseId: 1 });
    console.log(`\n📋 FINAL: ${remaining.length} courses\n`);
    remaining.forEach(course => {
      const parts = course.courseId.split('_');
      const suffix = parts[parts.length - 1];
      console.log(`✅ ${course.courseId} (${course.language}) → /${course.language}/courses/${course.courseId}`);
    });

    console.log('\n✅ Course URL structure fixed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixCourseURLStructure();
