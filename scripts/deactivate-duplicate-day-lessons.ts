/**
 * Deactivate duplicate lessons per dayNumber for a course.
 *
 * Why:
 * - Duplicate day lessons break navigation and audits and can create mismatched quiz associations.
 *
 * Safety:
 * - Dry-run by default.
 * - On apply, creates per-lesson backups under scripts/lesson-backups/<COURSE_ID>/.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/deactivate-duplicate-day-lessons.ts --course GEO_SHOPIFY_30_EN
 *   npx tsx --env-file=.env.local scripts/deactivate-duplicate-day-lessons.ts --course GEO_SHOPIFY_30_EN --apply
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function preferredLessonId(courseId: string, dayNumber: number) {
  const d = String(dayNumber).padStart(2, '0');
  return `${courseId}_DAY_${d}`;
}

async function main() {
  const courseIdRaw = getArgValue('--course');
  const apply = process.argv.includes('--apply');
  if (!courseIdRaw) throw new Error('Missing --course <COURSE_ID>');
  const courseId = String(courseIdRaw).toUpperCase();

  await connectDB();

  const course = await Course.findOne({ courseId }).select('_id courseId').lean();
  if (!course) throw new Error(`Course not found: ${courseId}`);

  const lessons = await Lesson.find({ courseId: course._id, isActive: true })
    .select({ _id: 0, lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, createdAt: 1 })
    .sort({ dayNumber: 1, createdAt: 1, lessonId: 1 })
    .lean();

  const byDay = new Map<number, any[]>();
  for (const l of lessons as any[]) {
    const day = Number(l.dayNumber);
    if (!Number.isFinite(day) || day <= 0) continue;
    const bucket = byDay.get(day);
    if (bucket) bucket.push(l);
    else byDay.set(day, [l]);
  }

  const stamp = isoStamp();
  const backupBase = join(process.cwd(), 'scripts', 'lesson-backups');
  const backupDir = join(backupBase, courseId);

  const actions: Array<{ dayNumber: number; keepLessonId: string; deactivateLessonIds: string[] }> = [];

  for (const [dayNumber, xs] of Array.from(byDay.entries()).sort((a, b) => a[0] - b[0])) {
    if (xs.length <= 1) continue;

    const preferred = preferredLessonId(courseId, dayNumber);
    const keep =
      xs.find(x => String(x.lessonId || '').toUpperCase() === preferred) ||
      xs[0];

    const deactivate = xs.filter(x => String(x.lessonId || '') !== String(keep.lessonId || ''));
    actions.push({
      dayNumber,
      keepLessonId: String(keep.lessonId || ''),
      deactivateLessonIds: deactivate.map(d => String(d.lessonId || '')).filter(Boolean),
    });

    if (apply) {
      mkdirSync(backupDir, { recursive: true });
      for (const d of deactivate) {
        const lessonId = String(d.lessonId || '');
        if (!lessonId) continue;
        const payload = {
          generatedAt: new Date().toISOString(),
          courseId,
          lessonId,
          title: d.title || '',
          content: String(d.content || ''),
          emailSubject: String(d.emailSubject || ''),
          emailBody: String(d.emailBody || ''),
        };
        const backupPath = join(backupDir, `${lessonId}__${stamp}.json`);
        writeFileSync(backupPath, JSON.stringify(payload, null, 2));
        await Lesson.updateOne({ lessonId }, { $set: { isActive: false } });
      }
    }
  }

  console.log(`✅ Duplicate-day lesson deactivation (${apply ? 'APPLY' : 'DRY-RUN'})`);
  console.log(`- courseId: ${courseId}`);
  console.log(`- duplicateDayGroups: ${actions.length}`);
  if (apply) console.log(`- backups: ${backupDir}`);

  for (const a of actions) {
    console.log(`- Day ${a.dayNumber}: keep ${a.keepLessonId}; deactivate ${a.deactivateLessonIds.join(', ')}`);
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

