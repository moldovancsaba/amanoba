import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson, QuizQuestion } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';

async function main() {
  await connectDB();

  const course = await Course.findOne({ courseId: 'PRODUCTIVITY_2026_PL' }).lean();
  if (!course) throw new Error('Course not found: PRODUCTIVITY_2026_PL');

  const lessons = await Lesson.find({ courseId: course._id, dayNumber: 1, isActive: true })
    .sort({ createdAt: 1, _id: 1 })
    .lean();
  if (lessons.length === 0) throw new Error('No Day 1 lesson found');

  const lesson = lessons[0];
  const clean = String(lesson.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const existingQs = await QuizQuestion.find({
    isActive: true,
    isCourseSpecific: true,
    courseId: course._id,
    lessonId: lesson.lessonId,
  })
    .sort({ _id: 1 })
    .lean();

  const quality = assessLessonQuality({ title: lesson.title || '', content: lesson.content || '', language: course.language || lesson.language || 'pl' });

  console.log(JSON.stringify({
    course: { courseId: course.courseId, name: course.name, language: course.language, createdAt: course.createdAt },
    lesson: { lessonId: lesson.lessonId, dayNumber: lesson.dayNumber, title: lesson.title, createdAt: lesson.createdAt, contentLength: clean.length, contentPreview: clean.slice(0, 1400) },
    lessonQuality: quality,
    existingQuestions: {
      count: existingQs.length,
      sample: existingQs.slice(0, 3).map(q => ({
        _id: String(q._id),
        uuid: q.uuid,
        questionType: q.questionType,
        difficulty: q.difficulty,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        hashtags: q.hashtags,
      }))
    }
  }, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
