import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { enforceLessonQuality } from '../app/lib/content-quality/enforcement';
import { EnforcementLevel } from '../app/lib/content-quality/enforcement';

async function validate() {
  await connectDB();
  
  const course = await Course.findOne({ courseId: 'AI_DUMMIES_1DAY_EN' });
  if (!course) throw new Error('Course not found');
  
  const lessons = await Lesson.find({ courseId: course._id });
  
  console.log('\n🔍 Validating Stage 1 Content Quality\n');
  console.log('='.repeat(70));
  
  for (const lesson of lessons) {
    console.log(`\nLesson ${lesson.dayNumber}: ${lesson.title}`);
    
    const lessonData = {
      lessonId: lesson.lessonId,
      dayNumber: lesson.dayNumber,
      language: lesson.language,
      title: lesson.title,
      content: lesson.content,
      emailSubject: lesson.emailSubject,
      emailBody: lesson.emailBody,
      pointsReward: 100,
      xpReward: 50,
      isActive: true,
      displayOrder: lesson.displayOrder,
    };
    
    const result = enforceLessonQuality(lessonData, {
      level: EnforcementLevel.STRICT,
      context: 'validation_check',
      enforcedBy: 'agent',
    });
    
    console.log(`  Quality Score: ${result.validation.qualityScore}/100`);
    console.log(`  Status: ${result.allowed ? '✅ PASSED' : '❌ BLOCKED'}`);
    
    if (!result.allowed) {
      console.log(`  Reason: ${result.enforcement.reason}`);
      console.log(`  Errors:`, result.validation.errors);
    }
    
    if (result.validation.warnings.length > 0) {
      console.log(`  Warnings:`, result.validation.warnings);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  process.exit(0);
}

validate();
