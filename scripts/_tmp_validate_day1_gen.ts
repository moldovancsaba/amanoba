import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { generateContentBasedQuestions } from './content-based-question-generator';
import { validateQuestionQuality, validateLessonQuestions } from './question-quality-validator';

async function main() {
  await connectDB();
  const course = await Course.findOne({ courseId: 'GEO_SHOPIFY_30_EN' }).lean();
  const lesson = await Lesson.findOne({ courseId: course!._id, lessonId: 'GEO_SHOPIFY_30_EN_DAY_01' }).lean();
  const qs = generateContentBasedQuestions(1, lesson!.title, lesson!.content, 'en', 'GEO_SHOPIFY_30_EN', [], 7);

  const val = qs.map((q, i) => {
    const r = validateQuestionQuality(q.question, q.options, q.questionType as any, q.difficulty as any, 'en', lesson!.title, lesson!.content);
    return { i: i+1, ok: r.isValid, errors: r.errors.slice(0,3) };
  });
  const kept = qs.filter((q, i) => val[i].ok);
  const batch = validateLessonQuestions(kept.slice(0,7) as any, 'en', lesson!.title);
  console.log(JSON.stringify({ generated: qs.length, valid: kept.length, perQuestion: val, batchErrors: batch.errors.slice(0,5) }, null, 2));
}

main().catch(e=>{console.error(e);process.exit(1)});
