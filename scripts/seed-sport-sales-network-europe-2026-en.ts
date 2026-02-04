/**
 * Seed "Build a Sport Sales Network in Europe 2026" (EN)
 *
 * What:
 * - Creates/updates the CCS entry + course record for SPORT_SALES_NETWORK_EUROPE_2026_EN
 * - Optionally seeds 30 lesson stubs (inactive) with minimal content derived from the canonical spec
 *
 * Why:
 * - Establishes the CCS/course in the production DB (amanoba) so content can be drafted + audited safely.
 * - Keeps the seed idempotent: dry-run by default, write only when --apply is supplied.
 *
 * Usage:
 *   npm run seed:sport-sales-network-europe-2026-en                         # dry-run (no DB writes)
 *   npm run seed:sport-sales-network-europe-2026-en -- --apply               # create/update CCS + course
 *   npm run seed:sport-sales-network-europe-2026-en -- --apply --include-lessons  # also seed lesson stubs
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../app/lib/mongodb';
import { Brand, CCS, Course, Lesson } from '../app/lib/models';

const CCS_ID = 'SPORT_SALES_NETWORK_EUROPE_2026';
const COURSE_ID = 'SPORT_SALES_NETWORK_EUROPE_2026_EN';
const CANONICAL_JSON_PATH = 'docs/canonical/SPORT_SALES_NETWORK_EUROPE_2026/SPORT_SALES_NETWORK_EUROPE_2026.canonical.json';
const IDEA_DOC_PATH = 'docs/course_ideas/amanoba_course_sport_sales_network_europe_2026.md';

function hasFlag(flag: string) {
  return process.argv.includes(flag);
}

const APPLY = hasFlag('--apply');
const INCLUDE_LESSONS = hasFlag('--include-lessons');

const POINTS_CONFIG = { completionPoints: 1000, lessonPoints: 50, perfectCourseBonus: 500 } as const;
const XP_CONFIG = { completionXP: 500, lessonXP: 25 };

type CanonicalLesson = {
  dayNumber: number;
  canonicalTitle: string;
  objective?: string;
  keyConcepts?: string[];
  exercise?: string;
  deliverable?: string;
  sources?: string[];
};

type Canonical = {
  courseName: string;
  language?: string;
  intent?: { oneSentence?: string };
  lessons?: CanonicalLesson[];
};

type UpsertResult = {
  entity: string;
  id: string;
  description: string;
};

function takeSectionsFromIdea(text: string) {
  const parts = text.split('\n---\n');
  const idea = parts[0]?.trim() ?? text.trim();
  const outline = parts.slice(1).join('\n---\n').trim();
  return { idea, outline };
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function extractDaySectionFromOutline(outlineMd: string, dayNumber: number) {
  const headingRegex = new RegExp(`(^|\n)##\\s+Day\\s+${dayNumber}\\s+-\\s+[^\n]+\\n`, 'm');
  const match = outlineMd.match(headingRegex);
  if (!match || match.index === undefined) return '';

  const startIndex = (match.index ?? 0) + match[0].length;
  const after = outlineMd.slice(startIndex);
  const nextHeadingMatch = after.match(/\n##\s+Day\s+\d+\s+-\s+/m);
  const endIndex = nextHeadingMatch && nextHeadingMatch.index !== undefined ? startIndex + nextHeadingMatch.index : outlineMd.length;

  return outlineMd.slice(startIndex, endIndex).trim();
}

function markdownToHtmlBasic(markdown: string) {
  if (!markdown.trim()) return '';

  const lines = markdown.split('\n');
  const out: string[] = [];
  let inUl = false;

  const flushUl = () => {
    if (inUl) {
      out.push('</ul>');
      inUl = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushUl();
      continue;
    }

    const sourceMatch = line.match(/^(?:-\s+)?(https?:\/\/\S+)$/i);
    const bulletMatch = line.match(/^-\s+(.*)$/);

    if (line.startsWith('**Objective:**')) {
      flushUl();
      out.push(`<p><strong>Objective:</strong> ${escapeHtml(line.replace('**Objective:**', '').trim())}</p>`);
      continue;
    }

    if (line.startsWith('**Key concepts:**')) {
      flushUl();
      out.push(`<h2>Key concepts</h2><p>${escapeHtml(line.replace('**Key concepts:**', '').trim())}</p>`);
      continue;
    }

    if (line.startsWith('**Exercise:**')) {
      flushUl();
      out.push(`<h2>Exercise</h2><p>${escapeHtml(line.replace('**Exercise:**', '').trim())}</p>`);
      continue;
    }

    if (line.startsWith('**Deliverable:**')) {
      flushUl();
      out.push(`<h2>Deliverable</h2><p>${escapeHtml(line.replace('**Deliverable:**', '').trim())}</p>`);
      continue;
    }

    if (line.startsWith('**Sources (URLs):**') || line.startsWith('**Sources:**')) {
      flushUl();
      out.push('<h2>Sources</h2>');
      continue;
    }

    if (sourceMatch) {
      const url = sourceMatch[1];
      if (!inUl) {
        out.push('<ul>');
        inUl = true;
      }
      out.push(`<li><a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a></li>`);
      continue;
    }

    if (bulletMatch) {
      const item = bulletMatch[1].trim();
      if (!inUl) {
        out.push('<ul>');
        inUl = true;
      }
      out.push(`<li>${escapeHtml(item)}</li>`);
      continue;
    }

    flushUl();

    if (line.startsWith('### ')) {
      out.push(`<h3>${escapeHtml(line.replace('### ', '').trim())}</h3>`);
      continue;
    }

    if (line.startsWith('## ')) {
      out.push(`<h2>${escapeHtml(line.replace('## ', '').trim())}</h2>`);
      continue;
    }

    out.push(`<p>${escapeHtml(line)}</p>`);
  }

  flushUl();
  return out.join('\n');
}

function formatSources(sources: string[] = []) {
  if (!sources.length) return '';
  return `<h2>Sources</h2><ul>${sources
    .map((source) => `<li><a href="${source}" target="_blank" rel="noreferrer">${source}</a></li>`)
    .join('')}</ul>`;
}

function buildLessonContent(lesson: CanonicalLesson, outlineMd?: string) {
  const titleHtml = `<h1>${escapeHtml(lesson.canonicalTitle)}</h1>`;

  const objectiveLine = lesson.objective ? `<p><strong>Objective:</strong> ${escapeHtml(lesson.objective)}</p>` : '';

  const keyConcepts = Array.isArray(lesson.keyConcepts) && lesson.keyConcepts.length
    ? `<h2>Key concepts</h2><ul>${lesson.keyConcepts.map((concept) => `<li>${escapeHtml(concept)}</li>`).join('')}</ul>`
    : '';

  const exercise = lesson.exercise ? `<h2>Exercise</h2><p>${escapeHtml(lesson.exercise)}</p>` : '';
  const deliverable = lesson.deliverable ? `<h2>Deliverable</h2><p>${escapeHtml(lesson.deliverable)}</p>` : '';
  const sources = formatSources(Array.isArray(lesson.sources) ? lesson.sources : []);

  const canonicalHtml = [titleHtml, objectiveLine, keyConcepts, exercise, deliverable, sources]
    .filter(Boolean)
    .join('\n');

  const outlineSection = outlineMd ? extractDaySectionFromOutline(outlineMd, lesson.dayNumber) : '';
  const outlineHtml = outlineSection ? markdownToHtmlBasic(outlineSection) : '';

  if (outlineHtml) {
    return [titleHtml, outlineHtml].filter(Boolean).join('\n');
  }

  return canonicalHtml;
}

function buildEmailSubject(lesson: CanonicalLesson) {
  return `Sport Sales Network 2026 — Day ${lesson.dayNumber}: ${lesson.canonicalTitle}`.slice(0, 200);
}

function buildEmailBody(lesson: CanonicalLesson) {
  return `<h1>Sport Sales Network 2026 — Day ${lesson.dayNumber}</h1><p>${escapeHtml(lesson.canonicalTitle)}</p><p><a href="{{APP_URL}}/courses/${COURSE_ID}/day/${lesson.dayNumber}">Open the lesson →</a></p>`;
}

function planLessons(canonical: Canonical, outlineMd?: string) {
  return (canonical.lessons ?? [])
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((lesson) => ({
      dayNumber: lesson.dayNumber,
      title: lesson.canonicalTitle,
      content: buildLessonContent(lesson, outlineMd),
      emailSubject: buildEmailSubject(lesson),
      emailBody: buildEmailBody(lesson),
      quizConfig: {
        enabled: true,
        required: true,
        successThreshold: 70,
        questionCount: 7,
        poolSize: 10,
      },
    }));
}

function summarize(message: string, data?: unknown) {
  console.log(`➜ ${message}`, data ? data : '');
}

async function main() {
  await connectDB();

  const canonicalContent = JSON.parse(readFileSync(CANONICAL_JSON_PATH, 'utf-8')) as Canonical;
  const ideaMd = readFileSync(IDEA_DOC_PATH, 'utf-8');
  const { idea, outline } = takeSectionsFromIdea(ideaMd);

  const lessonsPlanned = planLessons(canonicalContent, outline);

  const brand = await Brand.findOne({ slug: 'amanoba' });
  if (!brand) {
    throw new Error('Brand "amanoba" not found. Run scripts/seed-brand.ts first.');
  }

  const ccsPayload = {
    name: canonicalContent.courseName,
    idea,
    outline,
    relatedDocuments: [
      { type: 'canonical-spec', url: `/${CANONICAL_JSON_PATH}` },
      { type: 'course-idea', url: `/${IDEA_DOC_PATH}` },
    ],
  };

  const coursePayload = {
    name: canonicalContent.courseName,
    description: canonicalContent.intent?.oneSentence ?? 'Sports sales network blueprint',
    language: canonicalContent.language ?? 'en',
    discussionEnabled: false,
    leaderboardEnabled: true,
    studyGroupsEnabled: true,
    durationDays: 30,
    isActive: false,
    requiresPremium: false,
    brandId: brand._id,
    ccsId: CCS_ID,
    pointsConfig: POINTS_CONFIG,
    xpConfig: XP_CONFIG,
    certification: {
      enabled: true,
      premiumIncludesCertification: false,
      requireAllLessonsCompleted: true,
      requireAllQuizzesPassed: true,
    },
    metadata: {
      category: 'sport_sales_network',
      difficulty: 'intermediate',
      estimatedHours: 20,
      tags: ['sport', 'sales', 'channel', 'procurement'],
    },
  } as const;

  const plannedActions: UpsertResult[] = [
    { entity: 'CCS', id: CCS_ID, description: `Upsert CCS ${CCS_ID}` },
    { entity: 'Course', id: COURSE_ID, description: `Upsert course ${COURSE_ID}` },
  ];

  if (INCLUDE_LESSONS) {
    plannedActions.push({ entity: 'Lessons', id: `${lessonsPlanned.length} items`, description: 'Seed lesson stubs for Days 1–30' });
  }

  if (APPLY) {
    const ccsDoc = await CCS.findOneAndUpdate(
      { ccsId: CCS_ID },
      { $set: ccsPayload, $setOnInsert: { ccsId: CCS_ID } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const courseDoc = await Course.findOneAndUpdate(
      { courseId: COURSE_ID },
      { $set: { ...coursePayload, courseId: COURSE_ID } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (INCLUDE_LESSONS) {
      for (const lesson of lessonsPlanned) {
        const lessonId = `${COURSE_ID}_DAY_${String(lesson.dayNumber).padStart(2, '0')}`;
        await Lesson.findOneAndUpdate(
          { lessonId },
          {
            $set: {
              lessonId,
              courseId: courseDoc._id,
              dayNumber: lesson.dayNumber,
              language: 'en',
              title: lesson.title,
              content: lesson.content,
              emailSubject: lesson.emailSubject,
              emailBody: lesson.emailBody,
              quizConfig: lesson.quizConfig,
              pointsReward: POINTS_CONFIG.lessonPoints,
              xpReward: XP_CONFIG.lessonXP,
              isActive: false,
              displayOrder: lesson.dayNumber,
              unlockConditions: { requirePreviousLesson: true },
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    }

    summarize('Seed applied successfully', plannedActions);
  } else {
    summarize('Dry-run mode (no DB writes) — planned actions', plannedActions);
  }
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
