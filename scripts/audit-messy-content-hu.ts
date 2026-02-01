/**
 * Audit: Messy / low-quality content in quiz questions (per locale)
 *
 * Purpose: Find questions that match the full "messy" definition (plan §1):
 *   truncation, non-native phrasing, typos, mixed language, unclear, template leakage.
 * See docs/2026-01-31_MESSY_CONTENT_AUDIT_AND_GRAMMAR_PLAN.md.
 *
 * Usage: npx tsx --env-file=.env.local scripts/audit-messy-content-hu.ts
 * Optional: LANGUAGE=hu|ru|pl|bg|tr|vi|id|pt|hi|ar  — single locale
 *          LANGUAGE=all  — all courses, all languages, all questions; writes report to file
 *          LIMIT=1000 (default 50000)
 *          OUT=path  — report path when LANGUAGE=all (default: docs/audit-messy-content-report-YYYY-MM-DD.json)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import { default as connectDB } from '../app/lib/mongodb';
import { QuizQuestion } from '../app/lib/models';

const TARGET_LANG = (process.env.LANGUAGE || 'hu').toLowerCase();
const LIMIT = Math.min(Number(process.env.LIMIT) || 50_000, 100_000);
const IS_ALL_LOCALES = TARGET_LANG === 'all';

type IssueKind = 'bad_term' | 'truncation' | 'mixed_language' | 'template_leakage';
interface Issue {
  kind: IssueKind;
  detail: string;
  snippet?: string;
}

interface QuestionAudit {
  _id: string;
  lessonId?: string;
  language: string;
  question: string;
  questionFull?: string;
  options?: string[];
  issues: Issue[];
}

/** Per-locale bad-term patterns (non-native / typo). Extend in docs/REPHRASE_RULES_*.md */
const BAD_TERMS_BY_LOCALE: Record<string, Array<{ pattern: RegExp; label: string }>> = {
  hu: [
    { pattern: /\bvisszacsatolás(t)?\b/i, label: 'visszacsatolás (use visszajelzés)' },
    { pattern: /\bbevezetési\s+táv\b/i, label: 'bevezetési táv (use bevezetési terv)' },
    { pattern: /\btartalo\b/i, label: 'tartalo (typo: use tartalmat)' },
  ],
  ru: [],
  pl: [{ pattern: /\bfeedback\s+loop\b/i, label: 'feedback loop (use pętla informacji zwrotnej)' }],
  bg: [],
  tr: [],
  vi: [{ pattern: /\bfeedback\s+loop\b/i, label: 'feedback loop (use vòng phản hồi)' }],
  id: [],
  pt: [],
  hi: [],
  ar: [],
};
function getBadTermsForLang(lang: string) {
  return BAD_TERMS_BY_LOCALE[lang] || [];
}

/** Common English/product terms that should not appear in localized content (non-EN locales). */
const ENGLISH_TERMS_IN_LOCALIZED: RegExp[] = [
  /\bfeedback\s+loop\b/i,
  /\bfeedback\b/i,
  /\breview\b/i,
  /\boutput\b/i,
  /\binput\b/i,
  /\bplaybook\b/i,
  /\bscope\b/i,
  /\btrigger\b/i,
  /\bdashboard\b/i,
  /\btemplate\b/i,
  /\bworkflow\b/i,
  /\bwidget\b/i,
  /\bhandover\b/i,
  /\bdeliverable\b/i,
  /\bstakeholder\b/i,
  /\bcheckpoint\b/i,
  /\brollout\b/i,
  /\bstandup\b/i,
  /\bbacklog\b/i,
  /\bsprint\b/i,
];

/** Template leakage: placeholders, TODO, variable syntax visible to user. */
const TEMPLATE_LEAKAGE_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\{\{[^}]*\}\}/, label: 'Template placeholder {{...}}' },
  { pattern: /\$\{[^}]*\}/, label: 'Variable placeholder ${...}' },
  { pattern: /\bTBD\b/i, label: 'TBD in user-facing text' },
  { pattern: /\bTODO\b/i, label: 'TODO in user-facing text' },
  { pattern: /\bFIXME\b/i, label: 'FIXME in user-facing text' },
  { pattern: /\[\.\.\.\]|\[\.\.\.\s*\]/, label: 'Ellipsis placeholder [...]' },
];

function mayBeTruncated(text: string): boolean {
  const s = String(text || '').trimEnd();
  if (s.length < 10) return false;
  if (/[\s\u00a0]$/.test(text)) return true;
  if (/[.?!:]$/.test(s)) return false;
  const lastWord = (s.match(/\s+(\S{1,3})$/)?.[1] ?? s.slice(-4)) || '';
  return lastWord.length === 1 && /\p{L}/u.test(lastWord);
}

/** Mid-word cut: ends with a single letter (likely cut); 2-char tokens often valid (đó, az, S?). */
function mayBeMidWordCut(text: string): boolean {
  const s = String(text || '').trimEnd();
  if (s.length < 8) return false;
  if (/[.?!:]$/.test(s)) return false;
  const lastToken = s.split(/\s+/).pop() || '';
  if (lastToken.length === 1 && /\p{L}/u.test(lastToken)) return true;
  return false;
}

/** Very short question or option (stub / fragment). */
const MIN_SENSIBLE_LENGTH = 12;
function tooShort(text: string): boolean {
  return String(text || '').trim().length > 0 && String(text || '').trim().length < MIN_SENSIBLE_LENGTH;
}

function auditText(question: string, options: string[], lang: string): Issue[] {
  const issues: Issue[] = [];
  const blob = `${question}\n${(options || []).join('\n')}`;
  const isNonEn = lang !== 'en' && lang !== 'unknown';
  const badTerms = getBadTermsForLang(lang);

  for (const { pattern, label } of badTerms) {
    if (pattern.test(blob)) {
      const match = blob.match(pattern);
      issues.push({ kind: 'bad_term', detail: label, snippet: match?.[0] });
    }
  }

  if (isNonEn) {
    for (const re of ENGLISH_TERMS_IN_LOCALIZED) {
      const m = blob.match(re);
      if (m) {
        issues.push({ kind: 'mixed_language', detail: 'English term in localized content', snippet: m[0] });
        break;
      }
    }
  }

  for (const { pattern, label } of TEMPLATE_LEAKAGE_PATTERNS) {
    if (pattern.test(blob)) {
      const match = blob.match(pattern);
      issues.push({ kind: 'template_leakage', detail: label, snippet: match?.[0] });
    }
  }

  if (mayBeTruncated(question)) {
    issues.push({ kind: 'truncation', detail: 'Question may be truncated (trailing space/short word)', snippet: question.slice(-30) });
  }
  if (mayBeMidWordCut(question)) {
    issues.push({ kind: 'truncation', detail: 'Question may be cut mid-word', snippet: question.slice(-25) });
  }
  if (tooShort(question)) {
    issues.push({ kind: 'truncation', detail: 'Question very short (stub?)', snippet: question });
  }
  (options || []).forEach((opt, i) => {
    if (mayBeTruncated(opt)) {
      issues.push({ kind: 'truncation', detail: `Option ${i + 1} may be truncated`, snippet: opt.slice(-30) });
    }
    if (mayBeMidWordCut(opt)) {
      issues.push({ kind: 'truncation', detail: `Option ${i + 1} may be cut mid-word`, snippet: opt.slice(-25) });
    }
    if (tooShort(opt)) {
      issues.push({ kind: 'truncation', detail: `Option ${i + 1} very short`, snippet: opt });
    }
  });

  return issues;
}

function languageFromLessonId(lessonId: string): string {
  const m = lessonId.match(/_([A-Z]{2})_DAY_/i) || lessonId.match(/_([A-Z]{2})$/i);
  return m ? m[1].toLowerCase() : '';
}

async function main() {
  await connectDB();
  console.log(`\n🔍 Audit: Messy content (language=${TARGET_LANG}, limit=${LIMIT})\n`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  const query: Record<string, unknown> = {
    isActive: true,
    isCourseSpecific: true,
  };
  const langToRegex: Record<string, RegExp> = {
    hu: /_HU_/i,
    ru: /_RU_/i,
    pl: /_PL_/i,
    bg: /_BG_/i,
    tr: /_TR_/i,
    vi: /_VI_/i,
    id: /_ID_/i,
    pt: /_PT_/i,
    hi: /_HI_/i,
    ar: /_AR_/i,
  };
  if (!IS_ALL_LOCALES && langToRegex[TARGET_LANG]) {
    query.lessonId = { $regex: langToRegex[TARGET_LANG] };
  }
  const cursor = QuizQuestion.find(query)
    .select({ question: 1, options: 1, lessonId: 1 })
    .limit(LIMIT)
    .lean();

  const audits: QuestionAudit[] = [];
  let total = 0;
  let withIssues = 0;
  const byLanguage: Record<string, number> = {};

  for await (const doc of cursor) {
    total++;
    const lessonId = (doc as { lessonId?: string }).lessonId || '';
    const lang = languageFromLessonId(lessonId) || (IS_ALL_LOCALES ? 'en' : TARGET_LANG);
    const question = (doc as { question?: string }).question || '';
    const options = ((doc as { options?: string[] }).options || []).map(String);
    const issues = auditText(question, options, lang);
    if (issues.length) {
      withIssues++;
      byLanguage[lang] = (byLanguage[lang] || 0) + 1;
      audits.push({
        _id: (doc as { _id?: { toString: () => string } })._id?.toString() || '',
        lessonId: lessonId || undefined,
        language: lang,
        question: question.slice(0, 120) + (question.length > 120 ? '…' : ''),
        ...(IS_ALL_LOCALES ? { questionFull: question, options } : {}),
        issues,
      });
    }
  }

  console.log(`Total course-specific questions scanned: ${total}`);
  console.log(`Questions with issues: ${withIssues}\n`);

  if (IS_ALL_LOCALES) {
    const date = new Date().toISOString().slice(0, 10);
    const outPath = process.env.OUT || resolve(process.cwd(), `docs/audit-messy-content-report-${date}.json`);
    const report = {
      runAt: new Date().toISOString(),
      totalScanned: total,
      totalWithIssues: withIssues,
      byLanguage: Object.keys(byLanguage)
        .sort()
        .reduce((acc, k) => ({ ...acc, [k]: byLanguage[k] }), {} as Record<string, number>),
      items: audits,
    };
    writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`📄 Full report written to: ${outPath}\n`);
    if (Object.keys(byLanguage).length) {
      console.log('By language:');
      Object.entries(byLanguage)
        .sort((a, b) => b[1] - a[1])
        .forEach(([lang, n]) => console.log(`  ${lang}: ${n}`));
      console.log('');
    }
  }

  if (audits.length === 0) {
    console.log(`✅ No messy content found in scanned questions.\n`);
    process.exit(0);
    return;
  }

  if (!IS_ALL_LOCALES) {
    console.log(`--- Sample (first 20) ---\n`);
    audits.slice(0, 20).forEach((a) => {
      console.log(`ID: ${a._id}`);
      console.log(`Q:  ${a.question}`);
      a.issues.forEach((i) => console.log(`    [${i.kind}] ${i.detail}${i.snippet ? ` "${i.snippet}"` : ''}`));
      console.log('');
    });
    if (audits.length > 20) {
      console.log(`... and ${audits.length - 20} more. Use LANGUAGE=all to export full list to file.\n`);
    }
  } else {
    console.log('--- Sample (first 10) ---\n');
    audits.slice(0, 10).forEach((a) => {
      console.log(`ID: ${a._id}  lang: ${a.language}  lessonId: ${a.lessonId || '-'}`);
      console.log(`Q:  ${a.question}`);
      a.issues.forEach((i) => console.log(`    [${i.kind}] ${i.detail}${i.snippet ? ` "${i.snippet}"` : ''}`));
      console.log('');
    });
    console.log(`Full list: ${audits.length} items in report file.\n`);
  }

  console.log('═══════════════════════════════════════════════════════════════\n');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
