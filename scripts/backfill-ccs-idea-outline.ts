/**
 * Backfill CCS idea + outline from linked courses and lessons.
 *
 * Why:
 * - Many CCS records exist but have missing `idea` and `outline`, which blocks the canonical workflow.
 * - This script generates a minimal, factual CCS "idea" and a day-by-day "outline" based on DB content.
 *
 * Safety:
 * - Dry-run by default (no DB writes).
 * - On apply, writes a backup file under scripts/ccs-backups/.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/backfill-ccs-idea-outline.ts                   # dry-run
 *   npx tsx --env-file=.env.local scripts/backfill-ccs-idea-outline.ts --apply          # apply
 *   npx tsx --env-file=.env.local scripts/backfill-ccs-idea-outline.ts --ccs AI_30_DAY  # single CCS
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { CCS, Course, Lesson } from '../app/lib/models';

function getArgValue(flag: string) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function normalizeWs(s: string) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function pickCanonicalCourse(courses: any[]) {
  const order = ['en', 'hu', 'de', 'fr', 'es', 'pt', 'pl', 'tr', 'ru', 'bg', 'vi', 'id', 'hi', 'ar'];
  const scored = courses
    .map(c => ({
      c,
      score:
        (c.language && order.includes(String(c.language).toLowerCase())
          ? order.indexOf(String(c.language).toLowerCase())
          : 9999) +
        (String(c.courseId || '').toUpperCase().endsWith('_EN') ? -10 : 0),
    }))
    .sort((a, b) => a.score - b.score);
  return scored[0]?.c || null;
}

type BackupFile = {
  generatedAt: string;
  env: string;
  action: string;
  ccs: Array<{
    ccsId: string;
    name?: string | null;
    idea?: string | null;
    outline?: string | null;
    relatedDocuments?: any[];
  }>;
};

async function main() {
  const apply = process.argv.includes('--apply');
  const ccsFilterRaw = getArgValue('--ccs');
  const onlyEmpty = !process.argv.includes('--force');

  const OUT_DIR = join(process.cwd(), 'scripts', 'reports');
  const BACKUP_DIR = join(process.cwd(), 'scripts', 'ccs-backups');
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(BACKUP_DIR, { recursive: true });

  await connectDB();

  const ccsFilter: any = {};
  if (ccsFilterRaw) ccsFilter.ccsId = String(ccsFilterRaw).toUpperCase();

  const ccsDocs = await CCS.find(ccsFilter).sort({ createdAt: 1, _id: 1 }).lean();
  const stamp = isoStamp();

  const backup: BackupFile = {
    generatedAt: new Date().toISOString(),
    env: 'production (via .env.local)',
    action: 'backfill-ccs-idea-outline',
    ccs: ccsDocs.map((c: any) => ({
      ccsId: String(c.ccsId || '').toUpperCase(),
      name: c.name ?? null,
      idea: c.idea ?? null,
      outline: c.outline ?? null,
      relatedDocuments: Array.isArray(c.relatedDocuments) ? c.relatedDocuments : [],
    })),
  };

  const report: any = {
    generatedAt: backup.generatedAt,
    env: backup.env,
    dryRun: !apply,
    onlyEmpty,
    totals: {
      ccs: ccsDocs.length,
      updated: 0,
      skipped: 0,
      missingCourses: 0,
      missingLessons: 0,
    },
    updates: [] as any[],
  };

  for (const ccs of ccsDocs as any[]) {
    const ccsId = String(ccs.ccsId || '').toUpperCase();
    if (!ccsId) continue;

    const hasIdea = Boolean(String(ccs.idea || '').trim());
    const hasOutline = Boolean(String(ccs.outline || '').trim());
    const hasName = Boolean(String(ccs.name || '').trim());
    if (onlyEmpty && hasIdea && hasOutline && hasName) {
      report.totals.skipped++;
      continue;
    }

    const courses = await Course.find({ ccsId })
      .select('courseId name description language durationDays isActive isDraft requiresPremium parentCourseId courseVariant')
      .sort({ isActive: -1, parentCourseId: 1, language: 1, courseId: 1 })
      .lean();

    if (courses.length === 0) {
      report.totals.missingCourses++;
      report.totals.skipped++;
      continue;
    }

    const canonical = pickCanonicalCourse(courses);
    if (!canonical) {
      report.totals.missingCourses++;
      report.totals.skipped++;
      continue;
    }

    const durationDays = Number(canonical.durationDays || 0) || 30;

    const lessons = await Lesson.find({ courseId: canonical._id, isActive: true })
      .select({ _id: 0, dayNumber: 1, title: 1 })
      .sort({ dayNumber: 1, displayOrder: 1, createdAt: 1, lessonId: 1 })
      .lean();

    const seenDays = new Set<number>();
    const dayRows: Array<{ day: number; title: string }> = [];
    for (const l of lessons as any[]) {
      const day = Number(l.dayNumber);
      if (!Number.isFinite(day) || day <= 0) continue;
      if (seenDays.has(day)) continue;
      seenDays.add(day);
      dayRows.push({ day, title: normalizeWs(String(l.title || '')) });
    }

    const missingDays: number[] = [];
    for (let d = 1; d <= durationDays; d++) if (!seenDays.has(d)) missingDays.push(d);
    if (missingDays.length > 0) report.totals.missingLessons += missingDays.length;

    const nextName = hasName && onlyEmpty ? String(ccs.name) : normalizeWs(String(ccs.name || canonical.name || ccsId));

    const nextIdea =
      hasIdea && onlyEmpty
        ? String(ccs.idea)
        : [
            `# ${nextName}`,
            ``,
            `**CCS ID**: \`${ccsId}\``,
            ``,
            `## Course Idea`,
            ``,
            `**Canonical course**: \`${String(canonical.courseId || '')}\` (${String(canonical.language || '').toLowerCase() || '—'})`,
            ``,
            canonical.description ? normalizeWs(String(canonical.description)) : '',
            ``,
            `## Current Status (DB)`,
            ``,
            `- Courses in family: ${courses.length}`,
            `- Expected durationDays (canonical): ${durationDays}`,
            `- Active lesson days found (canonical): ${seenDays.size}`,
            missingDays.length > 0 ? `- Missing day(s): ${missingDays.join(', ')}` : `- Missing day(s): none`,
            ``,
          ]
            .filter(Boolean)
            .join('\n');

    const nextOutline =
      hasOutline && onlyEmpty
        ? String(ccs.outline)
        : [
            `# ${nextName} — 30-Day Outline`,
            ``,
            `**CCS ID**: \`${ccsId}\``,
            `**Canonical course**: \`${String(canonical.courseId || '')}\` (${String(canonical.language || '').toLowerCase() || '—'})`,
            ``,
            `## Day-by-day`,
            ``,
            ...dayRows.map(r => `- Day ${r.day}: ${r.title ? r.title : 'Title missing in DB'}`),
            missingDays.length > 0 ? `` : '',
            missingDays.length > 0 ? `## Missing days (missing lesson in DB)` : '',
            missingDays.length > 0 ? missingDays.map(d => `- Day ${d}: missing lesson in DB`).join('\n') : '',
            ``,
          ]
            .filter(Boolean)
            .join('\n');

    if (apply) {
      await CCS.updateOne(
        { ccsId },
        {
          $set: {
            ...(onlyEmpty && hasName ? {} : { name: nextName }),
            ...(onlyEmpty && hasIdea ? {} : { idea: nextIdea }),
            ...(onlyEmpty && hasOutline ? {} : { outline: nextOutline }),
          },
        }
      );
    }

    report.totals.updated++;
    report.updates.push({
      ccsId,
      canonicalCourseId: String(canonical.courseId || ''),
      durationDays,
      lessonsFound: seenDays.size,
      missingDays,
      updatedFields: {
        name: !(onlyEmpty && hasName),
        idea: !(onlyEmpty && hasIdea),
        outline: !(onlyEmpty && hasOutline),
      },
    });
  }

  const reportPath = join(OUT_DIR, `ccs-idea-outline-backfill__${stamp}.json`);
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  let backupPath: string | null = null;
  if (apply) {
    backupPath = join(BACKUP_DIR, `backfill-ccs-idea-outline__${stamp}.json`);
    writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  }

  console.log(`✅ CCS idea/outline backfill complete (${apply ? 'APPLY' : 'DRY-RUN'})`);
  console.log(`- Report: ${reportPath}`);
  if (backupPath) console.log(`- Backup: ${backupPath}`);
  console.log(report.totals);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
