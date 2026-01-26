import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { generateContentBasedQuestions } from './content-based-question-generator';
import { validateQuestionQuality, validateLessonQuestions } from './question-quality-validator';

async function main() {
  await connectDB();
  const course = await Course.findOne({ courseId: 'PRODUCTIVITY_2026_PL' }).lean();
  const lesson = await Lesson.findOne({ courseId: course!._id, lessonId: 'PRODUCTIVITY_2026_PL_DAY_01' }).lean();
  const qs = generateContentBasedQuestions(1, lesson!.title, lesson!.content, 'pl', 'PRODUCTIVITY_2026_PL', [], 9);

  const per = qs.map((q, i) => {
    const r = validateQuestionQuality(q.question, q.options, q.questionType as any, q.difficulty as any, 'pl', lesson!.title, lesson!.content);
    return { i: i+1, ok: r.isValid, errors: r.errors.slice(0,2) };
  });
  const kept = qs.filter((q, i) => per[i].ok);
  const batch = validateLessonQuestions(kept as any, 'pl', lesson!.title);
  console.log(JSON.stringify({ generated: qs.length, valid: kept.length, batchOk: batch.isValid, batchErrors: batch.errors.slice(0,5), per }, null, 2));
}

main().catch(e=>{console.error(e);process.exit(1)});
