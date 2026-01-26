import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';

async function main() {
  await connectDB();
  const course = await Course.findOne({ courseId: 'PRODUCTIVITY_2026_PL' }).lean();
  const lesson = await Lesson.findOne({ courseId: course!._id, lessonId: 'PRODUCTIVITY_2026_PL_DAY_01' }).lean();
  const qs = await QuizQuestion.find({ isActive: true, isCourseSpecific: true, courseId: course!._id, lessonId: lesson!.lessonId })
    .sort({ _id: 1 })
    .lean();

  const counts = {
    total: qs.length,
    recall: qs.filter(q=>q.questionType==='recall').length,
    application: qs.filter(q=>q.questionType==='application').length,
    critical: qs.filter(q=>q.questionType==='critical-thinking').length,
  };

  const sample = qs[0];
  console.log(JSON.stringify({ counts, sample: sample ? {
    questionType: sample.questionType,
    difficulty: sample.difficulty,
    question: sample.question,
    options: sample.options,
    correctIndex: sample.correctIndex,
    hashtags: sample.hashtags,
  } : null }, null, 2));
}

main().catch(e=>{console.error(e);process.exit(1)});
