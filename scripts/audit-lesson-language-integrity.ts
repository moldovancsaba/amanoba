/**
 * Lesson Language Integrity Audit
 *
 * Purpose:
 * - Detect mixed-language lessons/emails (e.g., English sentences inside HU lessons).
 * - Produce a report + actionable task list.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/audit-lesson-language-integrity.ts [--course COURSE_ID] [--out-dir scripts/reports]
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Course, Lesson } from '../app/lib/models';
import { validateLessonRecordLanguageIntegrity } from './language-integrity';

function getArgValue(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

const COURSE_ID = getArgValue('--course');
const OUT_DIR = getArgValue('--out-dir') || join(process.cwd(), 'scripts', 'reports');
const INCLUDE_INACTIVE = hasFlag('--include-inactive');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function main() {
  await connectDB();

  const courseFilter: any = INCLUDE_INACTIVE ? {} : { isActive: true };
  if (COURSE_ID) courseFilter.courseId = COURSE_ID;
  const courses = await Course.find(courseFilter).sort({ createdAt: 1, _id: 1 }).lean();

  const results: any[] = [];
  const tasks: string[] = [];

  for (const course of courses) {
    const lessons = await Lesson.find({ courseId: course._id, ...(INCLUDE_INACTIVE ? {} : { isActive: true }) })
      .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, _id: 1 })
      .select({ lessonId: 1, dayNumber: 1, title: 1, content: 1, emailSubject: 1, emailBody: 1, language: 1, createdAt: 1 })
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
      const language = String(course.language || lesson.language || 'en').toLowerCase();
      const integrity = validateLessonRecordLanguageIntegrity({
        language,
        content: lesson.content || '',
        emailSubject: lesson.emailSubject || null,
        emailBody: lesson.emailBody || null,
      });

      results.push({
        courseId: course.courseId,
        courseName: course.name,
        language,
        dayNumber: lesson.dayNumber,
        lessonId: lesson.lessonId,
        title: lesson.title,
        createdAt: lesson.createdAt,
        ok: integrity.ok,
        errors: integrity.errors,
        warnings: integrity.warnings,
        findings: integrity.findings,
      });

      if (!integrity.ok) {
        const sample = integrity.findings?.[0]?.snippet ? `  - Example: ${integrity.findings[0].snippet}\n` : '';
        tasks.push(
          `- [ ] **${course.courseId}** Day ${lesson.dayNumber} — ${lesson.title} (lessonId: \`${lesson.lessonId}\`)\n` +
            `  - Language: **${language}**\n` +
            `  - Error: ${integrity.errors[0] || 'Language integrity failed'}\n` +
            sample
        );
      }
    }
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const stamp = isoStamp();
  const jsonPath = join(OUT_DIR, `lesson-language-integrity-audit__${stamp}.json`);
  const mdPath = join(OUT_DIR, `lesson-language-integrity-tasks__${stamp}.md`);

  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        courseFilter: COURSE_ID || null,
        includeInactive: INCLUDE_INACTIVE,
        total: results.length,
        failed: results.filter(r => r.ok === false).length,
        results,
      },
      null,
      2
    )
  );

  writeFileSync(
    mdPath,
    `# Lesson Language Integrity Tasks\n\n` +
      `Generated: ${new Date().toISOString()}\n` +
      `Course filter: ${COURSE_ID || 'ALL'}\n\n` +
      `Include inactive: ${INCLUDE_INACTIVE}\n\n` +
      (tasks.length ? tasks.join('\n') : '✅ No lessons failed language integrity.\n')
  );

  console.log('✅ Lesson language integrity audit complete');
  console.log(`- JSON: ${jsonPath}`);
  console.log(`- Tasks: ${mdPath}`);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
