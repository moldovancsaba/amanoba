import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

async function main() {
  await connectDB();
  const course = await Course.findOne({ courseId: 'PRODUCTIVITY_2026_PL' }).lean();
  if (!course) throw new Error('course not found');
  const lesson = await Lesson.findOne({ courseId: course._id, lessonId: 'PRODUCTIVITY_2026_PL_DAY_01' }).lean();
  if (!lesson) throw new Error('lesson not found');

  const qs = await QuizQuestion.find({
    isActive: true,
    isCourseSpecific: true,
    courseId: course._id,
    lessonId: lesson.lessonId,
  }).sort({ _id: 1 }).lean();

  const counts = {
    total: qs.length,
    recall: qs.filter(q=>q.questionType==='recall').length,
    application: qs.filter(q=>q.questionType==='application').length,
    critical: qs.filter(q=>q.questionType==='critical-thinking').length,
  };

  console.log(JSON.stringify({
    course: { courseId: course.courseId, name: course.name, language: course.language },
    lesson: { lessonId: lesson.lessonId, dayNumber: lesson.dayNumber, title: lesson.title },
    counts,
    questions: qs.map(q=>({
      _id: String(q._id),
      questionType: q.questionType,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      hashtags: q.hashtags,
    }))
  }, null, 2));
}

main().catch(e=>{console.error(e);process.exit(1)});
