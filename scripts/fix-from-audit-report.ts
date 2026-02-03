/**
 * Fix quiz questions from the messy-content audit report, in batches of 200.
 *
 * Applies: bad_term + mixed_language replace pairs per locale. Truncation is not
 * auto-fixed (would need source text). Template leakage (TBD/TODO) is removed when possible.
 *
 * Usage:
 *   BATCH_INDEX=1 BATCH_SIZE=200 npx tsx --env-file=.env.local scripts/fix-from-audit-report.ts [--apply]
 *   REPORT=path/to/report.json  (default: docs/audit-messy-content-report-2026-01-31.json)
 *
 * Run BATCH_INDEX=1 for first 200, BATCH_INDEX=2 for next 200, etc.
 */

import { config } from 'dotenv';
import { resolve, join } from 'path';
import { mkdirSync, writeFileSync, readFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { QuizQuestion } from '../app/lib/models';

const APPLY = process.argv.includes('--apply');
const FIX_ALL = process.env.FIX_ALL === 'true' || process.env.FIX_ALL === '1'; // update every item (normalize), even if unchanged
const BATCH_INDEX = Math.max(1, parseInt(process.env.BATCH_INDEX || '1', 10));
const BATCH_SIZE = Math.min(500, Math.max(1, parseInt(process.env.BATCH_SIZE || '200', 10)));
const REPORT_PATH = process.env.REPORT || resolve(process.cwd(), 'docs/audit-messy-content-report-2026-01-31.json');

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

// ---- HU rephrase (same as fix-rephrase-questions-by-locale) ----
function rephraseStemHu(q: string): string {
  let s = String(q || '');
  s = s.replace(
    /Egy új gyakorlatot vezetsz be:\s*„(.*?)"\.\s*Melyik bevezetési terv biztosít mérhető kimenetet és gyors visszacsatolást\?/gs,
    'Bevezetsz egy új gyakorlatot: „$1". Melyik bevezetési terv biztosít mérhető kimenetelt és gyors visszajelzést?'
  );
  s = s.replace(
    /A „(.*?)" témában új gyakorlatot próbálsz ki:\s*„(.*?)"\.\s*Melyik bevezetési terv teszi a hatást ellenőrizhetővé \(előtte\/utána\)\?/gs,
    'A „$1" témában bevezetsz egy új gyakorlatot: „$2". Melyik bevezetési terv teszi a hatást ellenőrizhetővé (előtte/utána)?'
  );
  s = s.replace(
    /Egy csapatban szabályként vezeted be:\s*„(.*?)"\.\s*Melyik terv ad mérhető kimenetet és gyors iterációt\?/gs,
    'Egy csapatban bevezeted szabályként: „$1". Melyik terv ad mérhető kimenetelt és gyors iterációt?'
  );
  s = s.replace(/\bmérhető kimenetet és gyors visszacsatolást\b/g, 'mérhető kimenetelt és gyors visszajelzést');
  s = s.replace(/\bgyors visszacsatolást\b/g, 'gyors visszajelzést');
  s = s.replace(/\bEgy új gyakorlatot vezetsz be\b/g, 'Bevezetsz egy új gyakorlatot');
  s = s.replace(/\búj gyakorlatot próbálsz ki\b/g, 'bevezetsz egy új gyakorlatot');
  return s;
}

function rephraseOptionHu(opt: string): string {
  let s = String(opt || '');
  if (/Túl nagy scope-pal indulok.*nincs gyors visszacsatolás.*nem látszik, mi okozza az eredményt/.test(s)) {
    return 'Túl nagy teret adok a gyakorlatnak egyszerre (minden csapat részt vesz), ezért nincs gyors visszajelzés, és nem derül ki, mi okozza az eredményt.';
  }
  s = s.replace(/\bvisszacsatolást\b/g, 'visszajelzést');
  s = s.replace(/\bvisszacsatolás\b/g, 'visszajelzés');
  return s;
}

type ReplacePair = [RegExp | string, string];

function applyReplaceList(text: string, pairs: ReplacePair[]): string {
  let s = String(text || '');
  for (const [from, to] of pairs) {
    s = typeof from === 'string' ? s.split(from).join(to) : s.replace(from, to);
  }
  return s;
}

// Mixed language: English terms that must be localized (per locale)
const MIXED_LANGUAGE_PAIRS: Record<string, ReplacePair[]> = {
  hu: [
    [/\boutput\b/gi, 'kimenet'],
    [/\bOutput\b/g, 'Kimenet'],
    [/\breview\b/gi, 'felülvizsgálat'],
    [/\bReview\b/g, 'Felülvizsgálat'],
    [/\bscope\b/gi, 'hatókör'],
    [/\bScope\b/g, 'Hatókör'],
    [/\bfeedback\b/gi, 'visszajelzés'],
    [/\binput\b/gi, 'bemenet'],
    [/\bdeliverable\b/gi, 'levezethető eredmény'],
    [/\bsprint\b/gi, 'futam'],
    [/\bSprint\b/g, 'Futam'],
    [/\bbacklog\b/gi, 'feladatlista'],
    [/\bBacklog\b/g, 'Feladatlista'],
    [/\bstakeholder\b/gi, 'érdekelt'],
    [/\bStakeholder\b/g, 'Érdekelt'],
    [/\bstakeholder-ek\b/gi, 'érdekeltek'],
    [/\bdashboard\b/gi, 'irányítópult'],
    [/\bDashboard\b/g, 'Irányítópult'],
    [/\btrigger\b/gi, 'indító'],
    [/\bTrigger\b/g, 'Indító'],
  ],
  pl: [
    [/\bfeedback\s+loop\b/gi, 'pętla informacji zwrotnej'],
    [/\bfeedback\b/gi, 'informacja zwrotna'],
    [/\boutput\b/gi, 'wynik'],
    [/\breview\b/gi, 'przegląd'],
    [/\bscope\b/gi, 'zakres'],
  ],
  ru: [
    [/\bfeedback\b/gi, 'обратная связь'],
    [/\boutput\b/gi, 'результат'],
    [/\breview\b/gi, 'обзор'],
    [/\bscope\b/gi, 'область'],
  ],
  pt: [
    [/\bfeedback\b/gi, 'retroalimentação'],
    [/\boutput\b/gi, 'resultado'],
    [/\breview\b/gi, 'revisão'],
    [/\bscope\b/gi, 'escopo'],
    [/\bdeliverable\b/gi, 'entregável'],
  ],
  vi: [
    [/\bfeedback\s+loop\b/gi, 'vòng phản hồi'],
    [/\bfeedback\b/gi, 'phản hồi'],
    [/\boutput\b/gi, 'đầu ra'],
    [/\breview\b/gi, 'xem xét'],
    [/\bscope\b/gi, 'phạm vi'],
  ],
  id: [
    [/\bfeedback\b/gi, 'umpan balik'],
    [/\boutput\b/gi, 'keluaran'],
    [/\breview\b/gi, 'tinjauan'],
    [/\bscope\b/gi, 'cakupan'],
    [/\bdeliverable\b/gi, 'hasil yang dapat diserahkan'],
    [/\bcheckpoint\b/gi, 'titik periksa'],
  ],
  tr: [
    [/\bfeedback\b/gi, 'geri bildirim'],
    [/\boutput\b/gi, 'çıktı'],
    [/\breview\b/gi, 'inceleme'],
    [/\bscope\b/gi, 'kapsam'],
    [/\bdeliverable\b/gi, 'teslim edilebilir'],
  ],
  bg: [
    [/\bfeedback\b/gi, 'обратна връзка'],
    [/\boutput\b/gi, 'изход'],
    [/\breview\b/gi, 'преглед'],
    [/\bscope\b/gi, 'обхват'],
  ],
  hi: [
    [/\bfeedback\b/gi, 'प्रतिक्रिया'],
    [/\boutput\b/gi, 'परिणाम'],
    [/\breview\b/gi, 'समीक्षा'],
    [/\bscope\b/gi, 'दायरा'],
  ],
  ar: [
    [/\bfeedback\b/gi, 'تغذية راجعة'],
    [/\boutput\b/gi, 'مخرجات'],
    [/\breview\b/gi, 'مراجعة'],
    [/\bscope\b/gi, 'نطاق'],
  ],
  en: [], // no replace for English content
};

function getReplacePairsForLocale(locale: string): ReplacePair[] {
  return MIXED_LANGUAGE_PAIRS[locale] || [];
}

function rephraseQuestion(locale: string, q: string): string {
  let s = q;
  if (locale === 'hu') s = rephraseStemHu(s);
  s = applyReplaceList(s, getReplacePairsForLocale(locale));
  return s;
}

function rephraseOptions(locale: string, options: string[]): string[] {
  const arr = locale === 'hu' ? options.map(rephraseOptionHu) : options.slice();
  return arr.map((o) => applyReplaceList(o, getReplacePairsForLocale(locale)));
}

// Remove template leakage (TBD, TODO, FIXME, {{...}}) — replace with safe text
function removeTemplateLeakage(text: string): string {
  let s = String(text || '');
  s = s.replace(/\bTBD\b/gi, '').replace(/\bTODO\b/gi, '').replace(/\bFIXME\b/gi, '');
  s = s.replace(/\{\{([^}]*)\}\}/g, '[$1]');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

// Normalize whitespace: trim leading/trailing, collapse multiple spaces (fixes truncation-from-trailing-space)
function normalizeWhitespace(text: string): string {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

interface ReportItem {
  _id: string;
  lessonId?: string;
  language: string;
  question?: string;
  questionFull?: string;
  options?: string[];
  issues?: Array<{ kind: string; detail: string; snippet?: string }>;
}

interface AuditReport {
  runAt?: string;
  totalScanned?: number;
  totalWithIssues?: number;
  items: ReportItem[];
}

async function main() {
  let report: AuditReport;
  try {
    report = JSON.parse(readFileSync(REPORT_PATH, 'utf-8')) as AuditReport;
  } catch (e) {
    console.error(`Failed to read report: ${REPORT_PATH}`, e);
    process.exit(1);
  }

  const items = report.items || [];
  const start = (BATCH_INDEX - 1) * BATCH_SIZE;
  const batch = items.slice(start, start + BATCH_SIZE);

  if (batch.length === 0) {
    console.log(`\nNo items in batch ${BATCH_INDEX} (start=${start}, size=${BATCH_SIZE}). Total items: ${items.length}\n`);
    process.exit(0);
    return;
  }

  await connectDB();

  const backupDir = join(process.cwd(), 'scripts', 'question-backups');
  const stamp = isoStamp();
  const backupPath = join(backupDir, `AUDIT_FIX_BATCH${BATCH_INDEX}_${stamp}.json`);

  const updates: Array<{
    _id: string;
    language: string;
    question: string;
    options: string[];
    before: { question: string; options: string[] };
  }> = [];
  let notFound = 0;

  for (const item of batch) {
    const id = item._id;
    const locale = (item.language || 'en').toLowerCase();
    const doc = await (QuizQuestion as any).findById(id).select({ question: 1, options: 1 }).lean();
    if (!doc) {
      notFound++;
      continue;
    }
    const beforeQ = (doc as { question: string }).question || '';
    const beforeOpts = ((doc as { options: string[] }).options || []).map(String);
    let afterQ = rephraseQuestion(locale, beforeQ);
    let afterOpts = rephraseOptions(locale, beforeOpts);
    afterQ = removeTemplateLeakage(afterQ);
    afterOpts = afterOpts.map(removeTemplateLeakage);
    // Always normalize whitespace (fixes truncation from trailing space)
    afterQ = normalizeWhitespace(afterQ);
    afterOpts = afterOpts.map(normalizeWhitespace);
    const changed = afterQ !== beforeQ || afterOpts.some((o, i) => o !== beforeOpts[i]);
    if (changed || FIX_ALL) {
      updates.push({
        _id: id,
        language: locale,
        question: afterQ,
        options: afterOpts,
        before: { question: beforeQ, options: beforeOpts },
      });
    }
  }

  console.log(`\nFix from audit report (batch ${BATCH_INDEX}, size=${BATCH_SIZE}, dry-run: ${!APPLY})\n`);
  console.log(`Batch range: items [${start}..${start + batch.length - 1}] of ${items.length}`);
  console.log(`To update: ${updates.length}  Not found: ${notFound}\n`);

  if (updates.length === 0) {
    process.exit(0);
    return;
  }

  if (APPLY) {
    mkdirSync(backupDir, { recursive: true });
    const backupPayload = updates.map((u) => ({
      _id: u._id,
      language: u.language,
      before: u.before,
      after: { question: u.question, options: u.options },
    }));
    writeFileSync(backupPath, JSON.stringify(backupPayload, null, 2), 'utf8');
    console.log(`Backup written: ${backupPath}\n`);
    for (const u of updates) {
      await (QuizQuestion as any).updateOne(
        { _id: u._id },
        { $set: { question: u.question, options: u.options } }
      );
    }
    console.log(`Updated ${updates.length} questions in DB.\n`);
  } else {
    console.log('Sample (first 3):');
    updates.slice(0, 3).forEach((u) => {
      console.log(`ID: ${u._id}  lang: ${u.language}`);
      console.log(`Before Q: ${u.before.question.slice(0, 70)}…`);
      console.log(`After  Q: ${u.question.slice(0, 70)}…`);
      console.log('');
    });
    console.log('Run with --apply to write backup and update DB.');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
