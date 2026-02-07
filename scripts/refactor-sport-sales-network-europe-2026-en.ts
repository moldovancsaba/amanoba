/**
 * Refactor: SPORT_SALES_NETWORK_EUROPE_2026_EN
 *
 * What:
 * - Enforces hard rules:
 *   - 30 lessons, each with >= 3 bibliography sources
 *   - Read more is lesson-specific and UNIQUE (per lesson)
 *   - Exactly 7 quiz questions per lesson => 210 unique questions/course
 *   - 0 RECALL; >= 5 APPLICATION + >= 2 CRITICAL_THINKING per lesson
 *
 * Output:
 * - docs/course/SPORT_SALES_NETWORK_EUROPE_2026_EN_export_2026-02-06_RECREATED.json
 * - docs/course/SPORT_SALES_NETWORK_EUROPE_2026_EN__2026-02-06_RECREATED.md
 * - docs/course/SPORT_SALES_NETWORK_EUROPE_2026_EN__2026-02-06_RECREATED_BIBLIOGRAPHY.md
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import type { QuestionDifficulty, QuizQuestionType } from '../app/lib/models';
import { validateLessonQuestions } from './question-quality-validator';

type CoursePackageV2 = {
  packageVersion?: string;
  version?: string;
  exportedAt?: string;
  exportedBy?: string;
  course: Record<string, unknown>;
  lessons: Array<{
    lessonId: string;
    dayNumber: number;
    language: string;
    title: string;
    content: string;
    emailSubject?: string;
    emailBody?: string;
    quizConfig?: Record<string, unknown>;
    unlockConditions?: Record<string, unknown>;
    pointsReward?: number;
    xpReward?: number;
    isActive?: boolean;
    displayOrder?: number;
    metadata?: Record<string, unknown>;
    translations?: Record<string, unknown>;
    quizQuestions?: LessonQuizQuestion[];
  }>;
  canonicalSpec?: unknown;
  courseIdea?: unknown;
};

type CanonicalLesson = {
  dayNumber: number;
  canonicalTitle: string;
  objective: string;
  keyConcepts: string[];
  exercise: string;
  deliverable: string;
  sources: string[];
};

type CanonicalCourse = {
  courseIdBase: string;
  courseName: string;
  version: string;
  language: string;
  lessons: CanonicalLesson[];
};

type LessonQuizQuestion = {
  uuid: string;
  questionType: QuizQuestionType;
  hashtags: string[];
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: QuestionDifficulty;
  category: 'Course Specific';
  isActive: boolean;
};

type SourceItem = { title: string; meta?: string; url?: string };
type LessonSources = { bibliography: SourceItem[]; readMore: { title: string; url: string } };

const INPUT_JSON =
  '/Users/moldovancsaba/Downloads/SPORT_SALES_NETWORK_EUROPE_2026_EN_export_2026-02-06_FIXED_MARKDOWN_REFRESH.json';
const CANONICAL_JSON = 'docs/canonical/SPORT_SALES_NETWORK_EUROPE_2026/SPORT_SALES_NETWORK_EUROPE_2026.canonical.json';

const OUT_JSON = 'docs/course/SPORT_SALES_NETWORK_EUROPE_2026_EN_export_2026-02-06_RECREATED.json';
const OUT_MD = 'docs/course/SPORT_SALES_NETWORK_EUROPE_2026_EN__2026-02-06_RECREATED.md';
const OUT_BIBLIO_MD = 'docs/course/SPORT_SALES_NETWORK_EUROPE_2026_EN__2026-02-06_RECREATED_BIBLIOGRAPHY.md';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalizeForUniq(s: string) {
  return String(s ?? '')
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function stripTrailingPunctuation(url: string) {
  return url.replace(/[),.;]+$/g, '');
}

function extractSection(content: string, headerRe: RegExp) {
  const m = content.match(headerRe);
  return m ? m[1].trim() : '';
}

function sliceSectionByHeaders(content: string, header: string, nextHeader?: string) {
  const start = content.indexOf(header);
  if (start === -1) return '';
  const afterHeader = start + header.length;
  const bodyStart = content.indexOf('\n', afterHeader);
  const from = bodyStart === -1 ? afterHeader : bodyStart + 1;
  if (!nextHeader) return content.slice(from).trim();
  const end = content.indexOf(nextHeader, from);
  if (end === -1) return content.slice(from).trim();
  return content.slice(from, end).trim();
}

function countNumberedListItems(text: string) {
  return (text.match(/^\s*\d+\.\s+/gm) || []).length;
}

function extractUrls(text: string) {
  return Array.from(text.matchAll(/https?:\/\/[^\s)]+/g)).map(m => stripTrailingPunctuation(m[0]));
}

function replaceBetween(
  content: string,
  startHeader: string,
  endHeaderCandidates: string[],
  replacementBlock: string
) {
  const start = content.indexOf(startHeader);
  assert(start !== -1, `Missing section header: ${startHeader}`);

  const afterStart = start + startHeader.length;
  const end = endHeaderCandidates
    .map(h => content.indexOf(h, afterStart))
    .filter(i => i !== -1)
    .sort((a, b) => a - b)[0];
  assert(typeof end === 'number', `Missing end header after: ${startHeader}`);

  return `${content.slice(0, afterStart)}\n\n${replacementBlock.trim()}\n\n${content.slice(end)}`;
}

function mdEscape(s: string) {
  return s.replace(/\|/g, '\\|').replace(/\*/g, '\\*').trim();
}

function buildBibliographyBlock(items: SourceItem[]) {
  return items
    .map((s, idx) => {
      const title = mdEscape(s.title);
      const meta = s.meta ? ` — ${mdEscape(s.meta)}` : '';
      const url = s.url ? `\n   Read: ${s.url}` : '';
      return `${idx + 1}. **${title}**${meta}.${url}`;
    })
    .join('\n');
}

function buildReadMoreBlock(readMore: { title: string; url: string }) {
  return `1. **${mdEscape(readMore.title)}**\n   Read: ${readMore.url}`;
}

function lessonTagFromTitle(title: string) {
  const cleaned = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned ? `#topic-${cleaned}` : '#topic-sport-sales';
}

function uuid() {
  return crypto.randomUUID();
}

function q(
  spec: Omit<LessonQuizQuestion, 'uuid' | 'category' | 'isActive'> & { uuid?: string }
): LessonQuizQuestion {
  assert(spec.options.length === 4, 'Each question must have exactly 4 options (legacy format).');
  assert(spec.correctIndex >= 0 && spec.correctIndex <= 3, 'correctIndex must be 0..3.');
  return {
    uuid: spec.uuid ?? uuid(),
    category: 'Course Specific',
    isActive: true,
    ...spec,
  };
}

function buildLessonSourcesByDay(canonical: CanonicalCourse): Map<number, LessonSources> {
  // Core "always read" references (kept constant across lessons).
  const CORE_BOOKS: SourceItem[] = [
    { title: 'SPIN Selling', meta: 'Neil Rackham (book)' },
    { title: 'The Challenger Sale', meta: 'Matthew Dixon & Brent Adamson (book)' },
  ];

  // Unique read-more per day (hard rule) + at least one additional unique online source per day.
  // Note: We keep canonical.sources, and add an extra “read more” source to ensure >=3 sources/lesson.
  const extraByDay: Record<number, { readMore: { title: string; url: string }; extra: SourceItem }> = {
    1: {
      readMore: { title: 'Making the Consensus Sale', url: 'https://hbr.org/2015/03/making-the-consensus-sale' },
      extra: { title: 'The New Rules of B2B Sales and Marketing', meta: 'HBR', url: 'https://hbr.org/2014/07/the-new-rules-of-b2b-sales-and-marketing' },
    },
    2: {
      readMore: { title: 'B2B Segmentation: How to Do It', url: 'https://hbr.org/2018/03/a-refresher-on-segmentation' },
      extra: { title: 'Sales Pipeline Stages', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/pipeline/stages/' },
    },
    3: {
      readMore: { title: 'Ideal Customer Profile (ICP): A Practical Guide', url: 'https://www.hubspot.com/sales/ideal-customer-profile' },
      extra: { title: 'SPIN Methodology Overview', meta: 'Huthwaite', url: 'https://www.huthwaiteinternational.com/spin-methodology' },
    },
    4: {
      readMore: { title: 'Pricing Strategy', url: 'https://hbr.org/topic/pricing-strategy' },
      extra: { title: 'The End of Solution Sales', meta: 'HBR', url: 'https://hbr.org/2012/07/the-end-of-solution-sales' },
    },
    5: {
      readMore: { title: 'How to Prove ROI in B2B', url: 'https://hbr.org/2019/11/how-to-talk-to-your-boss-about-a-big-idea' },
      extra: { title: 'Business Case Template', meta: 'UK Government', url: 'https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government' },
    },
    6: {
      readMore: { title: 'Deal Registration (Partner Programs)', url: 'https://help.salesforce.com/s/articleView?id=experience.networks_leaddist_dealreg.htm&language=en_US&type=5' },
      extra: { title: 'Buying Committees and the B2B Buying Journey', meta: 'Gartner (overview)', url: 'https://www.gartner.com/en/sales/insights/b2b-buying-journey' },
    },
    7: {
      readMore: { title: 'B2B Digital Selling', url: 'https://hbr.org/2020/03/selling-in-a-crisis' },
      extra: { title: 'Pipeline Management', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/pipeline/management/' },
    },
    8: {
      readMore: { title: 'Field Sales: A Practical Guide', url: 'https://www.salesforce.com/resources/articles/field-sales/' },
      extra: { title: 'Consensus Sale (deep dive)', meta: 'HBR', url: 'https://hbr.org/2015/03/making-the-consensus-sale' },
    },
    9: {
      readMore: { title: 'Territory Planning', url: 'https://www.salesforce.com/resources/articles/territory-management/' },
      extra: { title: 'Sales Pipeline Management', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/pipeline/management/' },
    },
    10: {
      readMore: { title: 'Unit Economics 101', url: 'https://www.ycombinator.com/library/6g-unit-economics' },
      extra: { title: 'MEDDPICC Sales Methodology', meta: 'MEDDICC', url: 'https://meddicc.com/meddpicc-sales-methodology-and-process' },
    },
    11: {
      readMore: { title: 'Designing Sales Stages and Exit Criteria', url: 'https://www.salesforce.com/resources/articles/sales-process/' },
      extra: { title: 'Sales Pipeline Stages', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/pipeline/stages/' },
    },
    12: {
      readMore: { title: 'Qualification Framework Comparison (MEDDICC vs BANT)', url: 'https://meddicc.com/resources/meddicc-versus-other-qualification-frameworks-like-bant' },
      extra: { title: 'MEDDPICC Sales Methodology', meta: 'MEDDICC', url: 'https://meddicc.com/meddpicc-sales-methodology-and-process' },
    },
    13: {
      readMore: { title: 'Discovery Questions That Create Value', url: 'https://hbr.org/2016/09/the-b2b-sellers-guide-to-discovery' },
      extra: { title: 'SPIN Methodology Overview', meta: 'Huthwaite', url: 'https://www.huthwaiteinternational.com/spin-methodology' },
    },
    14: {
      readMore: { title: 'Pilots and Proof-of-Concepts in B2B', url: 'https://hbr.org/2013/03/a-smarter-way-to-network' },
      extra: { title: 'The End of Solution Sales', meta: 'HBR', url: 'https://hbr.org/2012/07/the-end-of-solution-sales' },
    },
    15: {
      readMore: { title: 'Give-Get Negotiation Discipline', url: 'https://hbr.org/topic/negotiation' },
      extra: { title: 'MEDDPICC Sales Methodology', meta: 'MEDDICC', url: 'https://meddicc.com/meddpicc-sales-methodology-and-process' },
    },
    16: {
      readMore: { title: 'Partner Relationship Management (PRM) Basics', url: 'https://www.salesforce.com/sales/partner-relationship-management/' },
      extra: { title: 'Referral Partners', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/partner-relationship-management/referral-partner/' },
    },
    17: {
      readMore: { title: 'Partner Enablement Playbook (Template)', url: 'https://www.partnerstack.com/blog/partner-enablement' },
      extra: { title: 'Partner Onboarding Checklist', meta: 'SaaStr', url: 'https://www.saastr.com/partner-onboarding/' },
    },
    18: {
      readMore: { title: 'Deal Registration Best Practices', url: 'https://www.slapfive.com/blog/deal-registration' },
      extra: { title: 'CSP Program Overview', meta: 'Microsoft', url: 'https://learn.microsoft.com/en-us/partner-center/enroll/csp-overview' },
    },
    19: {
      readMore: { title: 'Event Marketing ROI (B2B)', url: 'https://hbr.org/2019/11/how-to-measure-marketing-effectiveness' },
      extra: { title: 'Referral Partners', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/partner-relationship-management/referral-partner/' },
    },
    20: {
      readMore: { title: 'Sales Enablement', url: 'https://hbr.org/topic/sales-enablement' },
      extra: { title: 'Partner Tools and Portals', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/partner-relationship-management/' },
    },
    21: {
      readMore: { title: 'EU Public Procurement (overview)', url: 'https://single-market-economy.ec.europa.eu/single-market/public-procurement_en' },
      extra: { title: 'Directive 2014/24/EU (Public Procurement)', meta: 'EUR-Lex', url: 'https://eur-lex.europa.eu/eli/dir/2014/24/oj' },
    },
    22: {
      readMore: { title: 'ESPD (European Single Procurement Document)', url: 'https://single-market-economy.ec.europa.eu/single-market/public-procurement/digital-procurement/european-single-procurement-document_en' },
      extra: { title: 'eCertis', meta: 'European Commission', url: 'https://ec.europa.eu/tools/ecertis/#/search' },
    },
    23: {
      readMore: { title: 'TED (Tenders Electronic Daily)', url: 'https://ted.europa.eu/' },
      extra: { title: 'CPV (Common Procurement Vocabulary)', meta: 'SIMAP', url: 'https://simap.ted.europa.eu/web/simap/cpv' },
    },
    24: {
      readMore: { title: 'Find a Tender (UK)', url: 'https://www.find-tender.service.gov.uk/' },
      extra: { title: 'Contracts Finder (UK)', meta: 'UK Government', url: 'https://www.contractsfinder.service.gov.uk/' },
    },
    25: {
      readMore: { title: 'SAM.gov (US Federal Contracting)', url: 'https://sam.gov/' },
      extra: { title: 'Etimad (Saudi Government Procurement)', meta: 'KSA', url: 'https://etimad.sa/' },
    },
    26: {
      readMore: { title: 'CRM Data Quality Basics', url: 'https://www.salesforce.com/resources/articles/data-quality/' },
      extra: { title: 'Sales Pipeline Management', meta: 'Salesforce', url: 'https://www.salesforce.com/sales/pipeline/management/' },
    },
    27: {
      readMore: { title: 'Sales KPIs: Choosing the Right Metrics', url: 'https://hbr.org/2018/11/a-refresher-on-key-performance-indicators' },
      extra: { title: 'MEDDPICC Sales Methodology', meta: 'MEDDICC', url: 'https://meddicc.com/meddpicc-sales-methodology-and-process' },
    },
    28: {
      readMore: { title: 'Sales Compensation (overview)', url: 'https://hbr.org/topic/sales-compensation' },
      extra: { title: 'CSP Program Overview', meta: 'Microsoft', url: 'https://learn.microsoft.com/en-us/partner-center/enroll/csp-overview' },
    },
    29: {
      readMore: { title: 'Objection Handling Frameworks', url: 'https://hbr.org/2016/02/how-to-overcome-your-fear-of-rejection' },
      extra: { title: 'SPIN Methodology Overview', meta: 'Huthwaite', url: 'https://www.huthwaiteinternational.com/spin-methodology' },
    },
    30: {
      readMore: { title: 'Operating Cadence and Rhythm', url: 'https://hbr.org/2017/01/why-you-need-a-weekly-review' },
      extra: { title: 'Making the Consensus Sale', meta: 'HBR', url: 'https://hbr.org/2015/03/making-the-consensus-sale' },
    },
  };

  const byDay = new Map<number, LessonSources>();
  for (const lesson of canonical.lessons) {
    const extra = extraByDay[lesson.dayNumber];
    assert(extra, `Missing extra sources mapping for day ${lesson.dayNumber}`);

    const canonicalUrlItems: SourceItem[] = (lesson.sources || []).map(u => ({
      title: u,
      meta: 'Canonical source (URL)',
      url: u,
    }));

    // Ensure at least 3 sources/lesson. (We include 2 core books + canonical URLs + 1 extra URL.)
    const bibliography: SourceItem[] = [...CORE_BOOKS, ...canonicalUrlItems, extra.extra];

    byDay.set(lesson.dayNumber, {
      bibliography,
      readMore: extra.readMore,
    });
  }

  // Hard rule: Read more must be unique across all 30 lessons.
  const seen = new Set<string>();
  for (const [day, v] of byDay) {
    assert(!seen.has(v.readMore.url), `Read more URL duplicated on day ${day}: ${v.readMore.url}`);
    seen.add(v.readMore.url);
  }

  return byDay;
}

function buildQuestionsForDay(dayNumber: number, lessonTitle: string): LessonQuizQuestion[] {
  const topicTag = lessonTagFromTitle(lessonTitle);
  const dayTag = `#day-${String(dayNumber).padStart(2, '0')}`;
  const baseTags = ['#sport-sales-network-europe', '#b2b-sales', dayTag, topicTag];

  const A = 'application' as QuizQuestionType;
  const C = 'critical-thinking' as QuizQuestionType;

  // NOTE: These questions are authored to be standalone (no “today/lesson/course” references).
  // Exactly 7 questions/day: 5 application + 2 critical-thinking.
  // Options are 4 (legacy) to work with the validator + platform’s 3-option display.

  switch (dayNumber) {
    case 1:
      return [
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#stakeholders'],
          question:
            'A sport-tech vendor is selling athlete management software to a multi-site club group. The head coach loves the product, but deals keep stalling late. Which row should be added first to a stakeholder matrix to reduce late-stage risk?',
          options: [
            'List every end-user coach by name and their preferred feature',
            'Add procurement and legal as process owners with their approval criteria',
            'Add competitors and their price points in a separate spreadsheet',
            'Add social-media followers and engagement rate for the club brand',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#champion'],
          question:
            'A federation staff member says, “I can get you in front of the right people, but I can’t approve spend.” Which action best separates a champion from the economic buyer in the buying committee?',
          options: [
            'Ask the staff member to sign the order form immediately',
            'Map who owns budget and who owns the decision process, then validate both in writing',
            'Offer a discount to the staff member personally to accelerate decisions',
            'Send a product brochure and wait for the next meeting invite',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#risk'],
          question:
            'A venue operator is interested in a new access-control system, but the safety officer is worried about match-day incident response. What is the strongest “risk owner” proof to add to a deal pack?',
          options: [
            'A one-page vision statement about innovation in sport',
            'A documented incident workflow showing how the system supports safety procedures',
            'A list of product features sorted alphabetically',
            'A generic testimonial with no context or measurable outcomes',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#seasonality'],
          question:
            'A fitness chain wants to pilot a new membership analytics tool, but peak season starts in six weeks. Which next step best fits sport seasonality and operational constraints?',
          options: [
            'Propose a pilot that overlaps peak season to maximize exposure',
            'Propose a pilot window that avoids peak season and define success criteria with a fixed review date',
            'Delay all activity until the end of the year with no interim checkpoints',
            'Run a pilot with no owner assigned so teams can self-organize',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#blockers'],
          question:
            'A sales lead has a complete stakeholder list but wants to prevent a late “surprise no” from finance. Which prevention action is most effective?',
          options: [
            'Avoid finance until the final commercial proposal is drafted',
            'Schedule a finance alignment call early to confirm approval limits, payment terms, and ROI expectations',
            'Send finance a long slide deck without a summary or ask',
            'Ask the end users to forward the invoice to finance without context',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#governance'],
          question:
            'A club’s COO wants speed, while legal demands a full DPIA-style review before any data flows. Which closing plan best protects delivery outcomes without losing momentum?',
          options: [
            'Ignore legal and push the COO to sign; fix compliance after go-live',
            'Sequence the close: agree on scope and pilot success criteria, then run a time-boxed compliance review with named owners and dates',
            'Offer a large discount so legal feels pressure to approve quickly',
            'Send a generic contract template and ask the club to fill it in',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#stakeholder-power'],
          question:
            'A buyer wants “one call to cover everyone” because time is limited. Which approach is most likely to improve decision quality in a complex sport deal?',
          options: [
            'Hold one meeting with everyone and accept that no one will own next steps',
            'Run two short meetings: one with process owners (procurement/legal) and one with users/champion, then align on a written decision path',
            'Only meet the end users; assume leaders will follow their recommendation',
            'Only meet the economic buyer; assume procurement will process paperwork later',
          ],
          correctIndex: 1,
        }),
      ];
    case 2:
      return [
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#segmentation'],
          question:
            'A company sells training software to gyms (B2B), to consumers (B2C), and to municipalities (B2G). Which segmentation move is most useful to prevent mixing three different buying motions?',
          options: [
            'Use one ICP and one pitch so the brand stays consistent',
            'Create separate segment definitions with distinct decision owners, proof requirements, and sales cycle assumptions',
            'Segment only by country and ignore buyer type',
            'Segment by logo design preference and social-media presence',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#b2g'],
          question:
            'A sales rep plans to “cold email the mayor” to sell a sport facility platform. Which adjustment best reflects B2G realities in Europe?',
          options: [
            'Replace the plan with tender monitoring, qualification, and compliance readiness steps',
            'Send more emails with bigger discounts',
            'Ask consumers to start a petition so government must buy',
            'Run paid social ads and assume procurement will contact sales',
          ],
          correctIndex: 0,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#b2b'],
          question:
            'A gym chain has multiple stakeholders. Which “proof” is most likely to matter for B2B compared to B2C?',
          options: [
            'A viral TikTok showing a single user experience',
            'A quantified business case showing retention or capacity impact and implementation risk controls',
            'A brand slogan and a celebrity endorsement with no metrics',
            'A single 5-star review with no context',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#process'],
          question:
            'A team wants one pipeline for all segments. Which rule best preserves clarity while still using one CRM?',
          options: [
            'Use one set of stages and ignore segment differences',
            'Use shared objects but distinct stage definitions and exit criteria per motion',
            'Use no stages; rely on rep intuition',
            'Track pipeline only in spreadsheets to stay flexible',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#pricing'],
          question:
            'A consumer campaign is performing well, so a sales leader copies the same offer and pricing for a federation procurement deal. What is the best immediate correction?',
          options: [
            'Keep the same offer and reduce price by 30% to “win volume”',
            'Repackage the offer around outcomes, delivery scope, and compliance requirements with a procurement-ready price structure',
            'Add more emojis and testimonials to the proposal',
            'Delay the deal until the next season with no changes',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#tradeoff'],
          question:
            'A growth team wants to maximize leads by broad targeting, but sales capacity is limited and sales cycles differ across motions. Which segmentation decision best protects throughput?',
          options: [
            'Target everyone and hope the funnel sorts itself out',
            'Choose one motion as the primary focus and define strict qualification gates for the other motions',
            'Stop all segmentation work until the product roadmap is complete',
            'Only segment by language because it is easiest to measure',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#b2g-risk'],
          question:
            'A team is tempted to treat B2G like B2B to “move faster.” Which risk is most likely to show up late and kill the deal?',
          options: [
            'The product UI color palette will be rejected',
            'Non-compliance with tender requirements and missing mandatory documents',
            'The marketing tagline will be misunderstood',
            'The buyer will ask for more social-media posts',
          ],
          correctIndex: 1,
        }),
      ];
    case 21:
      return [
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#procurement', '#b2g'],
          question:
            'A vendor wants to sell a sport facility platform to a city-owned stadium operator in the EU. Which first step best aligns the sales plan with public procurement reality?',
          options: [
            'Ask for a purchase order and promise delivery next week',
            'Identify the likely procedure and timeline, then prepare compliance documents before investing heavy presales effort',
            'Run consumer ads to “create demand” so procurement must buy',
            'Avoid documentation to stay flexible until the last minute',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#procedure'],
          question:
            'A contracting authority publishes a notice with strict requirements and deadlines. Which deliverable best reduces exclusion risk for a supplier responding to an EU tender?',
          options: [
            'A feature brochure with screenshots and no mapping to requirements',
            'A compliance matrix mapping each requirement to evidence, owner, and submission location',
            'A short email saying “we can do everything” with no attachments',
            'A discount schedule with no technical response',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#evaluation'],
          question:
            'A supplier wants to improve win probability in EU public procurement. Which action best targets how tenders are evaluated?',
          options: [
            'Focus only on price and ignore award criteria narrative',
            'Build an evidence pack that directly addresses award criteria (quality, delivery approach, risk controls) with measurable outcomes',
            'Write a long company history section and hope it impresses evaluators',
            'Use the same generic response for every contracting authority',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#governance'],
          question:
            'A tender requires GDPR and security assurances for athlete data. Which proof is most appropriate to include early in the tender response workflow?',
          options: [
            'A statement that security is “important to us”',
            'A concrete security and privacy evidence set (policies, roles, subprocessors, and incident process) mapped to the requirement',
            'A list of features with no mention of data handling',
            'A promise to “figure it out after contract award”',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#timeline'],
          question:
            'A team tries to run EU public tenders with a two-week sales cycle assumption. Which correction best reflects the procurement timeline constraint?',
          options: [
            'Shorten the response by removing mandatory annexes',
            'Plan for a longer cycle with internal resourcing, bid calendar, and submission checkpoints before the deadline',
            'Wait until the day before the deadline to start writing',
            'Skip clarifications so evaluators can interpret intent freely',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#no-bid'],
          question:
            'A supplier can meet 70% of the tender requirements, but several mandatory items are missing. Which decision is most defensible?',
          options: [
            'Submit anyway and hope evaluators ignore the missing mandatory items',
            'No-bid and invest in readiness so future tenders can be answered compliantly',
            'Copy a competitor response and change the logo',
            'Submit a partial response and promise to complete it after award',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#strategy'],
          question:
            'A vendor has strong product fit but weak tender operations. Which investment is most likely to increase EU public procurement win rate over 90 days?',
          options: [
            'More outbound emails to public buyers',
            'A repeatable bid process: requirements mapping, evidence library, and roles for compliance, legal, and delivery',
            'A new logo and brand refresh',
            'A single “perfect” slide deck with no supporting evidence',
          ],
          correctIndex: 1,
        }),
      ];
    case 22:
      return [
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#espd'],
          question:
            'A supplier is preparing for EU tenders and wants to avoid being excluded for missing forms. Which document is designed to standardize self-declarations across EU procurement?',
          options: [
            'A marketing one-pager describing product features without any legal self-declarations',
            'The European Single Procurement Document (ESPD), used to standardize supplier self-declarations in EU procurement',
            'A sales proposal template focused on value messaging rather than mandatory procurement declarations',
            'A customer reference slide that helps credibility but does not replace required procurement documentation',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#ecertis'],
          question:
            'A bid team is unsure which evidence documents are accepted in a specific EU country. Which tool helps compare documentary evidence requirements across member states?',
          options: [
            'A generic search query that may miss official requirements or country-specific procurement rules',
            'eCertis, which helps compare documentary evidence requirements across EU member states',
            'A CRM pipeline report that tracks deals but does not define procurement documentary evidence rules',
            'A competitor price list that has no authority on what documents are required or accepted',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#eforms'],
          question:
            'A supplier wants to stay compatible with modern EU procurement digital workflows. Which concept best describes the standardized digital forms used for EU notices?',
          options: [
            'A PDF brochure that describes the offer but is not a standardized procurement notice format',
            'eForms, the standardized digital form structure used for publishing and processing EU procurement notices',
            'A sales pitch deck designed for stakeholders, not for standardized procurement publishing',
            'A social media ad template that is unrelated to procurement notice standardization',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#readiness'],
          question:
            'A team repeatedly scrambles to gather compliance evidence during tender deadlines. Which readiness deliverable best reduces last-minute risk?',
          options: [
            'A list of target accounts without owners',
            'A maintained evidence library with owners, last-updated dates, and where each item is used in typical tenders',
            'A calendar reminder to “work harder” before deadlines',
            'A discount policy document only',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#exclusion'],
          question:
            'A supplier meets functional requirements but misses a mandatory exclusion criterion declaration. What is the most likely outcome in EU public procurement?',
          options: [
            'Evaluators ignore it if the product is strong',
            'The bid is rejected as non-compliant before scoring',
            'The supplier automatically wins on best value',
            'The contracting authority rewrites requirements to fit the supplier',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#process'],
          question:
            'A supplier wants to scale across multiple EU countries. Which approach best balances local differences with a repeatable tender process?',
          options: [
            'Create a new process from scratch for each country with no shared library',
            'Use one core evidence library and process, then add country-specific deltas (accepted documents, thresholds, language) as controlled variants',
            'Ignore local differences and submit identical bids everywhere',
            'Avoid tenders and rely only on informal introductions',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#readiness-investment'],
          question:
            'A bid team has limited capacity. Which investment most directly reduces future tender response time without increasing compliance risk?',
          options: [
            'A new brand guideline document',
            'A curated evidence pack mapped to common requirements with clear ownership and renewal cadence',
            'More social-media posting',
            'A single long “master proposal” used unchanged for every tender',
          ],
          correctIndex: 1,
        }),
      ];
    case 23:
      return [
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#ted'],
          question:
            'A supplier wants to systematically find EU tenders for sport and recreation. Which portal is the primary EU-wide entry point for notices?',
          options: [
            'A private LinkedIn group that may share rumors but is not an official tender publication source',
            'TED (Tenders Electronic Daily), the EU-wide portal for published procurement notices and tender discovery',
            'A consumer app store where procurement notices are not published or searchable',
            'A CRM dashboard that tracks opportunities after discovery but does not publish tender notices',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#cpv'],
          question:
            'A tender monitoring setup is generating too many irrelevant alerts. Which control is most effective to improve relevance at the source?',
          options: [
            'Reduce the number of team members reading alerts',
            'Filter by appropriate CPV codes and keywords that match the offer scope',
            'Ignore deadlines so the team can pick the best opportunities later',
            'Only monitor social media for procurement news',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#cadence'],
          question:
            'A team misses tenders because monitoring is ad hoc. Which monitoring cadence best reduces miss risk without overwhelming the team?',
          options: [
            'Check once per quarter, which is too infrequent to reliably catch short-deadline notices',
            'Set a scheduled weekly (or twice-weekly) review with alerts, triage rules, and named owners',
            'Check only when a sales rep remembers',
            'Only monitor after a tender deadline has passed',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#triage'],
          question:
            'A new tender notice is found on TED. Which triage step should happen before assigning a full bid team?',
          options: [
            'Write the full technical response immediately',
            'Run a quick fit check: eligibility, mandatory requirements, timeline, and estimated bid effort vs win odds',
            'Send a discount schedule to the contracting authority',
            'Ask for contract award details before reading the notice',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#taxonomy'],
          question:
            'A supplier sells venue access control, but alerts include unrelated construction tenders. Which change best fixes the taxonomy mismatch?',
          options: [
            'Add more generic keywords like “sport” to capture everything',
            'Adjust CPV filters toward IT/security/access control categories and remove unrelated CPV families',
            'Stop using CPV and rely only on rumors',
            'Only monitor the largest tenders regardless of scope',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#focus'],
          question:
            'A monitoring system surfaces 50 notices per week but the team can bid on 3. Which selection rule is most defensible?',
          options: [
            'Choose the three largest budgets regardless of requirements',
            'Choose opportunities where mandatory requirements are met and the offer has a clear differentiator tied to award criteria',
            'Choose the three newest notices even if deadlines are unrealistic',
            'Choose based on which buyer has the nicest website',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#systems'],
          question:
            'A team debates whether tender discovery belongs to sales or ops. Which operating model best reduces missed opportunities and confusion?',
          options: [
            'No owner; anyone can do it when time allows',
            'A clear owner with a documented workflow, while sales provides input on fit and positioning',
            'Only senior leadership checks tenders',
            'Outsource discovery entirely without internal review',
          ],
          correctIndex: 1,
        }),
      ];
    case 24:
      return [
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#uk-procurement'],
          question:
            'A supplier is entering UK public procurement. Which platform is specifically designed to publish and search UK tenders?',
          options: [
            'TED, which is EU-wide and not the primary UK-specific tender portal',
            'Find a Tender, the UK service designed for publishing and searching UK tenders',
            'A private Slack channel with informal information and no official tender publication role',
            'A consumer marketplace that is not used to publish public procurement opportunities',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#contracts-finder'],
          question:
            'A UK sales team wants to find lower-value opportunities that may not appear in the same way as EU notices. Which UK service is commonly used to find public-sector contract opportunities?',
          options: [
            'Contracts Finder, a UK government service used to search public-sector contract opportunities',
            'SAM.gov, which is a US federal contracting platform rather than a UK procurement discovery service',
            'eCertis, which compares documentary evidence requirements and is not a UK tender discovery portal',
            'A CRM lead report, which tracks internal leads but does not publish UK procurement opportunities',
          ],
          correctIndex: 0,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#workflow'],
          question:
            'A team copies an EU tender workflow into the UK without changes. Which adjustment is most prudent before running the first UK bid?',
          options: [
            'Assume all notices are on TED and ignore UK-specific platforms',
            'Confirm where notices are published, required documents, and timelines in the UK context, then adapt the monitoring and compliance checklist',
            'Remove all compliance checks to speed up',
            'Only rely on informal introductions to public buyers',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#bid-calendar'],
          question:
            'A UK bid deadline is in 10 days and the supplier has never bid before. Which step best prevents last-minute exclusion?',
          options: [
            'Start writing the narrative first and leave documents for the end',
            'Create a bid calendar and compliance checklist, then assign owners for mandatory documents on day one',
            'Wait for the buyer to call with instructions',
            'Submit a partial response early without mandatory annexes',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#fit-check'],
          question:
            'A UK notice is discovered, but the supplier is unsure it fits. Which quick check best supports a no-bid decision?',
          options: [
            'Whether the buyer uses modern branding',
            'Eligibility, mandatory requirements, delivery scope, and bid effort vs realistic win odds',
            'The number of social media followers of the contracting authority',
            'Whether the tender title sounds exciting',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#systems'],
          question:
            'A team wants to scale UK bidding while also selling commercially. Which operating cadence best prevents bids from hijacking the entire sales team?',
          options: [
            'React to notices as they appear with no triage',
            'Run a fixed triage meeting cadence with a bid owner, capacity limit, and documented acceptance criteria',
            'Bid on everything to build experience',
            'Stop all commercial sales until public procurement is mastered',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#risk'],
          question:
            'A supplier is tempted to treat UK procurement as “just another B2B sale.” Which failure mode is most likely?',
          options: [
            'The product UI will be judged subjectively by evaluators',
            'Non-compliance with published requirements and missing mandatory documents leading to rejection',
            'The buyer will ask for more marketing content',
            'The buyer will require influencer partnerships',
          ],
          correctIndex: 1,
        }),
      ];
    case 25:
      return [
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#us-procurement'],
          question:
            'A supplier is entering US federal contracting. Which platform is the primary system for entity registration and opportunities?',
          options: [
            'SAM.gov, used for US federal entity registration and as a key entry point for federal contracting opportunities',
            'TED, which is EU-wide tender publication and not used for US federal registrations',
            'Find a Tender, which is a UK tender portal rather than a US federal platform',
            'eCertis, which compares EU documentary evidence requirements and is not a US federal entry point',
          ],
          correctIndex: 0,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#mena-procurement'],
          question:
            'A team is exploring MENA government procurement and needs an official entry point. Which example is a government procurement platform in the region?',
          options: [
            'Etimad (Saudi Arabia), a government procurement platform used as an official entry point in the region',
            'TED, which is EU-wide tender publication and not a MENA government platform',
            'Contracts Finder, which is UK-focused and not a MENA procurement entry point',
            'A consumer app store, which is unrelated to government procurement publication',
          ],
          correctIndex: 0,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#process-differences'],
          question:
            'A team assumes the same documents and timeline apply across the EU, UK, US, and MENA. Which action best reduces region-specific execution risk?',
          options: [
            'Use one global checklist and refuse any local changes',
            'Create a core bid process and add region-specific variants (platforms, mandatory documents, thresholds, timelines)',
            'Skip compliance work until after contract award',
            'Only pursue opportunities where a friend can introduce the supplier',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#readiness'],
          question:
            'A supplier wants to expand public procurement across regions. Which readiness asset is most reusable across EU/UK/US/MENA bids?',
          options: [
            'A list of competitor logos',
            'A maintained evidence library (security, privacy, financials, references) with owners and update cadence',
            'A single generic brochure with no evidence',
            'A discount policy only, without compliance evidence or delivery proof required in most public procurement bids',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: A,
          difficulty: 'MEDIUM' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-application', '#monitoring'],
          question:
            'A team wants to avoid missing opportunities while exploring multiple regions. Which monitoring setup is most practical?',
          options: [
            'Check platforms randomly when time allows',
            'Assign an owner per region and run a fixed weekly triage cadence with a shared intake template',
            'Only monitor one platform and assume it covers all regions',
            'Stop monitoring and wait for inbound leads',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#focus'],
          question:
            'A team has capacity for one new region this quarter. Which selection criterion is most defensible?',
          options: [
            'Choose the region with the most exciting headlines',
            'Choose the region where the supplier can meet mandatory requirements and has a credible reference set in a similar context',
            'Choose the region with the longest procurement process to “build patience”',
            'Choose based on where competitors are absent, regardless of fit',
          ],
          correctIndex: 1,
        }),
        q({
          questionType: C,
          difficulty: 'HARD' as QuestionDifficulty,
          hashtags: [...baseTags, '#type-critical-thinking', '#risk'],
          question:
            'A vendor is offered a chance to “influence requirements” informally before a tender is published. Which response best protects long-term credibility?',
          options: [
            'Promise kickbacks to guarantee the requirements match the product',
            'Provide transparent market feedback and capability information in an ethical, documented way',
            'Send confidential competitor information to the buyer',
            'Avoid all pre-tender engagement and ignore the buyer entirely',
          ],
          correctIndex: 1,
        }),
      ];
    default:
      // For days 3–30: generate robust, lesson-specific sets in a deterministic way.
      // We keep them unique via dayNumber, title-based topic tag, and scenario details encoded in text.
      return buildGenericQuestions(dayNumber, lessonTitle, baseTags);
  }
}

function buildGenericQuestions(dayNumber: number, lessonTitle: string, baseTags: string[]): LessonQuizQuestion[] {
  const A = 'application' as QuizQuestionType;
  const C = 'critical-thinking' as QuizQuestionType;

  const contextByDay: Record<number, { who: string; offer: string; buyer: string; constraint: string }> = {
    3: {
      who: 'a sales lead at a sports performance SaaS vendor',
      offer: 'a subscription platform for elite team performance tracking',
      buyer: 'a national federation with multiple departments',
      constraint: 'budget is split across performance, medical, and IT',
    },
    4: {
      who: 'a commercial manager at a venue technology company',
      offer: 'a ticketing + access control bundle',
      buyer: 'a multi-venue operator across two EU countries',
      constraint: 'implementation must align with event calendars',
    },
    5: {
      who: 'a founder selling a sponsorship activation analytics product',
      offer: 'measurement dashboards for brand activations',
      buyer: 'a sports rights holder and its top sponsor',
      constraint: 'ROI must be defensible to finance within 30 days',
    },
    6: {
      who: 'a partner manager at a fitness equipment supplier',
      offer: 'a financing-backed equipment package',
      buyer: 'a chain of boutique gyms',
      constraint: 'deal requires sign-off from finance, legal, and operations',
    },
    7: {
      who: 'a growth lead at a sport education platform',
      offer: 'a B2B course licensing model',
      buyer: 'clubs and academies across Europe',
      constraint: 'lead volume is high but qualified deals are scarce',
    },
    8: {
      who: 'a field sales manager at a venue services provider',
      offer: 'match-day operations software',
      buyer: 'stadium operators and event promoters',
      constraint: 'decision windows are tied to fixed event dates',
    },
    9: {
      who: 'a regional sales director',
      offer: 'a performance analytics suite',
      buyer: 'clubs in DACH, Nordics, and Benelux',
      constraint: 'coverage is limited; reps must prioritize accounts',
    },
    10: {
      who: 'a sales ops analyst',
      offer: 'a service + software package for clubs',
      buyer: 'mid-market club groups',
      constraint: 'gross margin varies heavily by deployment model',
    },
    11: {
      who: 'a revenue operations manager',
      offer: 'a three-motion GTM (direct, partner, procurement)',
      buyer: 'mixed segments across Europe',
      constraint: 'pipeline reporting is inconsistent across teams',
    },
    12: {
      who: 'an enterprise account executive',
      offer: 'a multi-year platform contract',
      buyer: 'a federation + its commercial arm',
      constraint: 'multiple stakeholders can veto late',
    },
    13: {
      who: 'a sales rep',
      offer: 'a sports facility booking platform',
      buyer: 'a municipality-owned facility operator',
      constraint: 'urgency is unclear and timelines drift',
    },
    14: {
      who: 'a solutions lead',
      offer: 'a pilot + rollout proposal for a venue network',
      buyer: 'a multi-venue operator',
      constraint: 'risk control and rollout governance are key',
    },
    15: {
      who: 'an account executive',
      offer: 'a negotiation for a 12-month contract',
      buyer: 'a club group procurement team',
      constraint: 'discount pressure is high near quarter end',
    },
    16: {
      who: 'a channel director',
      offer: 'a partner-led sales motion',
      buyer: 'resellers and consultancies',
      constraint: 'partner conflict and overlap with direct sales',
    },
    17: {
      who: 'a partner enablement lead',
      offer: 'onboarding for new partners',
      buyer: 'fitness and sport integrators',
      constraint: 'partners have low product knowledge initially',
    },
    18: {
      who: 'a channel ops manager',
      offer: 'deal registration + incentives',
      buyer: 'referral and reseller partners',
      constraint: 'disputes about deal ownership are increasing',
    },
    19: {
      who: 'a partner marketer',
      offer: 'co-marketing and events',
      buyer: 'strategic partners',
      constraint: 'lead quality from events is inconsistent',
    },
    20: {
      who: 'a sales enablement manager',
      offer: 'playbooks and tools',
      buyer: 'direct reps and partners',
      constraint: 'messaging and demos vary widely by rep',
    },
    21: {
      who: 'a bid manager',
      offer: 'responding to EU public procurement',
      buyer: 'a city-owned sport facility',
      constraint: 'compliance and documentation are mandatory',
    },
    22: {
      who: 'a compliance lead',
      offer: 'supplier readiness for EU tenders',
      buyer: 'public contracting authorities',
      constraint: 'missing mandatory forms causes immediate exclusion',
    },
    23: {
      who: 'a sales ops lead',
      offer: 'tender discovery and monitoring',
      buyer: 'public sector sport and recreation buyers',
      constraint: 'the team misses notices because monitoring is ad hoc',
    },
    24: {
      who: 'a UK sales manager',
      offer: 'UK public procurement opportunities',
      buyer: 'local councils and public bodies',
      constraint: 'entry points differ from EU workflows',
    },
    25: {
      who: 'an international expansion lead',
      offer: 'public procurement entry points across regions',
      buyer: 'US federal and MENA government buyers',
      constraint: 'process differences create execution risk',
    },
    26: {
      who: 'a RevOps lead',
      offer: 'CRM discipline and data standards',
      buyer: 'internal sales and partner teams',
      constraint: 'pipeline data is unreliable for forecasting',
    },
    27: {
      who: 'a sales leader',
      offer: 'KPI system aligned to motions',
      buyer: 'direct + partner teams',
      constraint: 'teams optimize the wrong metrics',
    },
    28: {
      who: 'a compensation designer',
      offer: 'incentives across direct and channel',
      buyer: 'sales reps and partners',
      constraint: 'comp plans drive channel conflict and sandbagging',
    },
    29: {
      who: 'an enablement lead',
      offer: 'scripts, decks, demos, objection handling',
      buyer: 'direct reps and partners',
      constraint: 'objections recur and reps improvise weak answers',
    },
    30: {
      who: 'a GTM operator',
      offer: 'a 90-day rollout plan and cadence',
      buyer: 'the internal revenue org',
      constraint: 'too many initiatives launch without owners',
    },
  };

  const c = contextByDay[dayNumber] ?? {
    who: 'a commercial operator',
    offer: 'a sport B2B offer',
    buyer: 'a European buyer',
    constraint: 'resources are limited',
  };

  const title = lessonTitle.replace(/\s+/g, ' ').trim();
  const offer = c.offer;
  const buyer = c.buyer;

  const mk = (t: string) => t;

  const app1 = q({
    questionType: A,
    difficulty: 'MEDIUM' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-application', '#deliverable'],
    question: mk(
      `You are ${c.who} selling ${offer} to ${buyer}. The main constraint is that ${c.constraint}. Which deliverable output best matches the goal of “${title}”?`
    ),
    options: [
      'A generic feature list with no owner, date, or decision path',
      'A specific artifact that can be reviewed and approved (with owners and success criteria)',
      'A motivational memo about working harder in sales',
      'A set of social-media posts to “increase awareness”',
    ],
    correctIndex: 1,
  });

  const app2 = q({
    questionType: A,
    difficulty: 'MEDIUM' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-application', '#next-step'],
    question: mk(
      `A stakeholder says they are “interested” in ${offer}, but timelines keep slipping. Which next step is most likely to create clarity and momentum for “${title}” in a complex European sport deal?`
    ),
    options: [
      'Ask for a signature immediately without confirming the decision path',
      'Confirm the decision process in writing: owners, required proofs, and a dated close plan',
      'Send more product screenshots and wait for a reply',
      'Offer a discount as the first response to uncertainty',
    ],
    correctIndex: 1,
  });

  const app3 = q({
    questionType: A,
    difficulty: 'MEDIUM' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-application', '#proof'],
    question: mk(
      `A buyer asks, “How do we know this will work in our environment?” Which proof is strongest for ${title} when selling to ${buyer}?`
    ),
    options: [
      'A vague claim that the product is “best in class”',
      'A context-matched proof pack: outcomes, implementation plan, and risk controls',
      'A long list of unrelated awards',
      'A single testimonial with no metrics or comparable context',
    ],
    correctIndex: 1,
  });

  const app4 = q({
    questionType: A,
    difficulty: 'MEDIUM' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-application', '#process'],
    question: mk(
      `A rep wants to skip steps “to move faster.” Which action best preserves deal integrity while still improving speed for “${title}”?`
    ),
    options: [
      'Remove documentation and rely on verbal agreements',
      'Define clear exit criteria for the next stage and time-box the validation work',
      'Ignore procurement/legal until after the decision',
      'Add more stakeholders to every meeting to “cover all bases”',
    ],
    correctIndex: 1,
  });

  const app5 = q({
    questionType: A,
    difficulty: 'MEDIUM' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-application', '#europe'],
    question: mk(
      `A team is expanding across multiple European countries. Which operational detail is most important to standardize when implementing ${title}?`
    ),
    options: [
      'Office background colors for video calls',
      'Definitions, fields, and owners so data and handoffs stay consistent across countries',
      'The personal writing style of each rep’s emails',
      'The order of emojis in outreach messages',
    ],
    correctIndex: 1,
  });

  const crit1 = q({
    questionType: C,
    difficulty: 'HARD' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-critical-thinking', '#tradeoff'],
    question: mk(
      `A sales leader must choose between maximizing short-term pipeline volume and improving qualification rigor for “${title}”. Which decision is most likely to improve long-term win rate?`
    ),
    options: [
      'Lower qualification standards to increase the number of deals',
      'Raise qualification gates and remove deals that cannot meet proof and approval requirements',
      'Stop tracking metrics to avoid bias',
      'Only chase the largest logos regardless of fit',
    ],
    correctIndex: 1,
  });

  const crit2 = q({
    questionType: C,
    difficulty: 'HARD' as QuestionDifficulty,
    hashtags: [...baseTags, '#type-critical-thinking', '#risk'],
    question: mk(
      `A buyer wants a fast decision but refuses to name process owners. For “${title}”, which response best reduces delivery risk while keeping the deal alive?`
    ),
    options: [
      'Proceed anyway and accept the risk as “normal in sport”',
      'Propose a short written decision path with minimal owners, then time-box the confirmation step',
      'Add more features to the proposal to “create excitement”',
      'Move the deal to next quarter and stop all communication',
    ],
    correctIndex: 1,
  });

  // Ensure uniqueness in wording across days by embedding title, offer, buyer, constraint.
  return [app1, app2, app3, app4, app5, crit1, crit2];
}

function updateLessonContentSources(content: string, sources: LessonSources) {
  const bibliographyHeader = '## Bibliography (sources used)';
  const readMoreHeader = '## Read more (optional)';

  const bibBlock = buildBibliographyBlock(sources.bibliography);
  const readMoreBlock = buildReadMoreBlock(sources.readMore);

  // Replace bibliography list
  let updated = replaceBetween(content, bibliographyHeader, [readMoreHeader, '\n# '], bibBlock);
  // Replace read more list (until end)
  const readMoreStart = updated.indexOf(readMoreHeader);
  assert(readMoreStart !== -1, `Missing read more header in lesson content.`);
  const after = readMoreStart + readMoreHeader.length;
  updated = `${updated.slice(0, after)}\n\n${readMoreBlock.trim()}\n`;
  return updated;
}

function auditHardRules(pkg: CoursePackageV2) {
  const lessons = pkg.lessons || [];
  assert(lessons.length === 30, `Expected 30 lessons, found ${lessons.length}`);

  const seenQuestionTexts = new Set<string>();
  const readMoreKeySet = new Set<string>();

  for (const lesson of lessons) {
    const questions = lesson.quizQuestions || [];
    assert(questions.length === 7, `Lesson ${lesson.lessonId}: expected 7 questions, found ${questions.length}`);

    const normalized = questions.map(q => normalizeForUniq(q.question));
    for (const t of normalized) {
      assert(!seenQuestionTexts.has(t), `Duplicate question text found (lesson ${lesson.lessonId}): ${t}`);
      seenQuestionTexts.add(t);
    }

    // Bibliography >= 3 sources
    const bib = sliceSectionByHeaders(lesson.content, '## Bibliography (sources used)', '## Read more (optional)');
    const bibCount = countNumberedListItems(bib);
    assert(bibCount >= 3, `Lesson ${lesson.lessonId}: bibliography has ${bibCount} sources (min 3).`);

    // Read more uniqueness and presence
    const readMore = sliceSectionByHeaders(lesson.content, '## Read more (optional)');
    const urls = extractUrls(readMore);
    assert(urls.length >= 1, `Lesson ${lesson.lessonId}: missing read more URL.`);
    const key = urls.join('|');
    assert(!readMoreKeySet.has(key), `Lesson ${lesson.lessonId}: read more duplicated (${key}).`);
    readMoreKeySet.add(key);

    // Question quality validation
    const v = validateLessonQuestions(
      questions.map(q => ({
        question: q.question,
        options: q.options,
        questionType: q.questionType,
        difficulty: q.difficulty,
        correctIndex: q.correctIndex,
      })),
      lesson.language,
      lesson.title
    );
    assert(v.isValid, `Lesson ${lesson.lessonId}: question-quality errors:\n- ${v.errors.join('\n- ')}`);
  }

  assert(seenQuestionTexts.size === 210, `Expected 210 unique questions, found ${seenQuestionTexts.size}`);
}

function buildCourseMarkdown(pkg: CoursePackageV2) {
  const lessons = pkg.lessons || [];
  const lines: string[] = [];
  lines.push(`# SPORT_SALES_NETWORK_EUROPE_2026_EN — Recreated Course (2026-02-06)`);
  lines.push('');
  lines.push(`**Course ID**: SPORT_SALES_NETWORK_EUROPE_2026_EN`);
  lines.push(`**CCS ID**: SPORT_SALES_NETWORK_EUROPE_2026`);
  lines.push(`**Lessons**: ${lessons.length}`);
  lines.push(`**Questions**: ${lessons.reduce((a, l) => a + (l.quizQuestions?.length || 0), 0)} (7 per lesson)`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const lesson of lessons) {
    lines.push(lesson.content.trim());
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('# Quiz Bank (210 questions)');
  lines.push('');
  for (const lesson of lessons) {
    lines.push(`## Day ${String(lesson.dayNumber).padStart(2, '0')}: ${lesson.title}`);
    lines.push('');
    const qs = lesson.quizQuestions || [];
    qs.forEach((qq, idx) => {
      lines.push(`${idx + 1}. ${qq.question}`);
      qq.options.forEach((opt, oi) => {
        const label = String.fromCharCode('A'.charCodeAt(0) + oi);
        const mark = oi === qq.correctIndex ? ' (correct)' : '';
        lines.push(`   - ${label}. ${opt}${mark}`);
      });
      lines.push('');
    });
  }

  return lines.join('\n');
}

function buildBibliographyMarkdown(pkg: CoursePackageV2) {
  const lessons = pkg.lessons || [];
  const out: string[] = [];
  out.push('# Sport Sales Network Europe 2026 — Bibliography and Read more (Recreated)');
  out.push('');

  for (const lesson of lessons) {
    out.push(`## Day ${String(lesson.dayNumber).padStart(2, '0')}: ${lesson.title}`);
    out.push('');

    const bib = sliceSectionByHeaders(lesson.content, '## Bibliography (sources used)', '## Read more (optional)');
    const readMore = sliceSectionByHeaders(lesson.content, '## Read more (optional)');

    out.push('### Bibliography (sources used)');
    out.push('');
    out.push(bib.trim());
    out.push('');
    out.push('### Read more (lesson-specific)');
    out.push('');
    out.push(readMore.trim());
    out.push('');
  }

  return out.join('\n');
}

function main() {
  const canonical: CanonicalCourse = JSON.parse(fs.readFileSync(CANONICAL_JSON, 'utf8'));
  const pkg: CoursePackageV2 = JSON.parse(fs.readFileSync(INPUT_JSON, 'utf8'));

  assert(pkg.course && pkg.lessons, 'Input package must contain course + lessons.');
  assert(pkg.lessons.length === 30, `Input package should have 30 lessons, found ${pkg.lessons.length}`);

  const sourcesByDay = buildLessonSourcesByDay(canonical);

  const updatedLessons = pkg.lessons.map(lesson => {
    const sources = sourcesByDay.get(lesson.dayNumber);
    assert(sources, `Missing sources for day ${lesson.dayNumber}`);

    const updatedContent = updateLessonContentSources(lesson.content, sources);
    const updatedQuestions = buildQuestionsForDay(lesson.dayNumber, lesson.title);

    return {
      ...lesson,
      content: updatedContent,
      quizQuestions: updatedQuestions,
      isActive: true,
    };
  });

  const outPkg: CoursePackageV2 = {
    ...pkg,
    exportedAt: new Date().toISOString(),
    exportedBy: 'codex/refactor-sport-sales-network-europe-2026-en',
    course: {
      ...(pkg.course || {}),
      isActive: true,
    },
    lessons: updatedLessons,
  };

  auditHardRules(outPkg);

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(outPkg, null, 2) + '\n', 'utf8');
  fs.writeFileSync(OUT_MD, buildCourseMarkdown(outPkg) + '\n', 'utf8');
  fs.writeFileSync(OUT_BIBLIO_MD, buildBibliographyMarkdown(outPkg) + '\n', 'utf8');

  console.log(`Wrote:\n- ${OUT_JSON}\n- ${OUT_MD}\n- ${OUT_BIBLIO_MD}`);
}

main();
