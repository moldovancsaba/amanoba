/**
 * Lesson Quality Audit
 *
 * Purpose: Find lessons that are too weak to support 7 high-quality questions (0 recall).
 * Output:
 *  - JSON report with per-lesson scores/issues
 *  - Markdown task list for lesson refinement
 *
 * Usage:
 *  npx tsx --env-file=.env.local scripts/audit-lesson-quality.ts [--course COURSE_ID] [--min-score 70] [--out-dir scripts/reports]
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { assessLessonQuality } from './lesson-quality';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

const COURSE_ID = getArgValue('--course');
const MIN_SCORE = Number(getArgValue('--min-score') || '70');
const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function main() {
  await connectDB();

  const courseFilter: any = { isActive: true };
  if (COURSE_ID) courseFilter.courseId = COURSE_ID;
  const courses = await Course.find(courseFilter).sort({ createdAt: 1, _id: 1 }).lean();

  const results: any[] = [];
  const tasks: string[] = [];

  for (const course of courses) {
    const lessons = await Lesson.find({ courseId: course._id, isActive: true })
      .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
      .select({ lessonId: 1, dayNumber: 1, title: 1, content: 1, language: 1, createdAt: 1 })
      .lean();

    // Deduplicate by dayNumber (keep oldest lesson per day)
    const byDay = new Map<number, any>();
    for (const lesson of lessons) {
      const existing = byDay.get(lesson.dayNumber);
      if (!existing) {
        byDay.set(lesson.dayNumber, lesson);
        continue;
      }
      const a = existing.createdAt ? new Date(existing.createdAt).getTime() : 0;
      const b = lesson.createdAt ? new Date(lesson.createdAt).getTime() : 0;
      if (b < a) byDay.set(lesson.dayNumber, lesson);
    }

    for (const lesson of byDay.values()) {
      const q = assessLessonQuality({
        title: lesson.title || '',
        content: lesson.content || '',
        language: course.language || lesson.language || 'en',
      });

      results.push({
        courseId: course.courseId,
        courseName: course.name,
        language: course.language,
        dayNumber: lesson.dayNumber,
        lessonId: lesson.lessonId,
        title: lesson.title,
        createdAt: lesson.createdAt,
        score: q.score,
        issues: q.issues,
        signals: q.signals,
        refineTemplate: q.refineTemplate,
      });

      if (q.score < MIN_SCORE) {
        tasks.push(
          `- [ ] **${course.courseId}** Day ${lesson.dayNumber} — ${lesson.title} (lessonId: \`${lesson.lessonId}\`)\\n` +
            `  - Score: **${q.score}/100**\\n` +
            `  - Issues: ${q.issues.join(', ') || 'none'}\\n` +
            `  - Add: definition=${q.refineTemplate.addDefinitionSection}, checklist=${q.refineTemplate.addChecklistSection}, examples=${q.refineTemplate.addExamplesSection}, pitfalls=${q.refineTemplate.addPitfallsSection}, metrics=${q.refineTemplate.addMetricsSection}\\n`
        );
      }
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const stamp = isoStamp();
  const jsonPath = join(OUT_DIR, `lesson-quality-audit__${stamp}.json`);
  const mdPath = join(OUT_DIR, `lesson-refine-tasks__${stamp}.md`);

  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        minScore: MIN_SCORE,
        courseFilter: COURSE_ID || null,
        total: results.length,
        belowThreshold: results.filter(r => r.score < MIN_SCORE).length,
        results,
      },
      null,
      2
    )
  );

  writeFileSync(
    mdPath,
    `# Lesson Refinement Task List\\n\\n` +
      `Generated: ${new Date().toISOString()}\\n` +
      `Min score: ${MIN_SCORE}\\n` +
      `Course filter: ${COURSE_ID || 'ALL'}\\n\\n` +
      (tasks.length ? tasks.join('\\n') : '✅ No lessons below threshold.\\n')
  );

  console.log('✅ Lesson quality audit complete');
  console.log(`- JSON: ${jsonPath}`);
  console.log(`- Tasks: ${mdPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
